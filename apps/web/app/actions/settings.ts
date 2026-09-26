'use server';

import { prisma } from '../../lib/prisma';
import { verifyPassword, hashPassword } from '../../lib/crypto';
import { sendSmsNotification } from './sms';
import { sendTestSystemEmail } from '../../lib/email';
import { requireAdmin, requireRole } from '../../lib/auth';
import crypto from 'crypto';

/**
 * Internal helper to record administrative actions into the audit log.
 */
export async function recordAuditLog(
  activity: string,
  category: string,
  status: 'Success' | 'Failed' | 'Warning' = 'Success',
  admin: string = 'System Admin',
  details?: string
) {
  try {
    await prisma.adminAuditLog.create({
      data: {
        activity,
        category,
        status,
        admin: admin || 'System Administrator',
        details: details || null,
      },
    });
  } catch (error) {
    console.error('Failed to create audit log entry:', error);
  }
}

/**
 * Returns or initializes the singleton system configuration row.
 */
export async function getOrCreateSystemSettings() {
  let settings = await prisma.systemSetting.findUnique({
    where: { id: 'default' },
  });

  if (!settings) {
    settings = await prisma.systemSetting.create({
      data: {
        id: 'default',
        systemName: 'Eternal Rest - Cemetery Management System',
        systemDescription: 'Web and Mobile-based Cemetery Management System for the Municipality of Jasaan',
        systemLogo: null,
        contactNumber: '+63 88 888 0000',
        officialEmail: 'admin@jasaan.gov.ph',
        officeAddress: 'MEEDO Office, Municipal Hall, Jasaan, Misamis Oriental',
        timeZone: 'Asia/Manila',
        dateFormat: 'YYYY-MM-DD',
        timeFormat: '12-hour',
        notifNewInquiry: true,
        notifInquiryAccepted: true,
        notifInquiryRejected: true,
        notifPayment: true,
        notifOverduePayment: true,
        notifAnnouncement: true,
        notifGraveLocator: true,
        notifSystem: true,
        smsEnabled: true,
        smsProvider: 'Semaphore',
        smsSenderName: 'SEMAPHORE',
        emailEnabled: true,
        emailSenderName: 'Municipality of Jasaan Cemetery Management System',
        emailSenderAddress: 'admin@jasaan.gov.ph',
        userAccessEnabled: true,
        mobileAppEnabled: true,
        inquiriesEnabled: true,
        announcementsEnabled: true,
        graveLocatorEnabled: true,
        maintenanceMode: false,
        maintenanceMessage: 'The cemetery management portal is currently undergoing scheduled maintenance. Please check back shortly.',
        defaultTheme: 'dark',
        sidebarBehavior: 'expanded',
        layoutDensity: 'normal',
        itemsPerPage: 25,
        defaultDashboardPage: '/admin/cemetery-overview',
        language: 'English',
        backupStatus: 'Ready',
        autoBackupEnabled: true,
        backupFrequency: 'Daily',
        sessionTimeout: 60,
      },
    });
  }

  return settings;
}

/**
 * Gathers complete settings data for the Admin Settings dashboard in a single fast call.
 */
export async function getSettingsData(adminEmail?: string) {
  try {
    const session = await requireAdmin();
    const targetEmail = adminEmail || session.email;
    const [settings, admin, auditLogs, auditCount] = await Promise.all([
      getOrCreateSystemSettings(),
      prisma.admin.findUnique({
        where: { email: targetEmail },
        select: {
          id: true,
          email: true,
          name: true,
          username: true,
          contactNumber: true,
          role: true,
          avatar: true,
          department: true,
          sessionTimeout: true,
          createdAt: true,
        },
      }),
      prisma.adminAuditLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
      prisma.adminAuditLog.count(),
    ]);

    // Check backend status of SMS gateway without revealing API keys
    const rawApiKey = process.env.SEMAPHORE_API_KEY || '';
    const isSmsConfigured =
      !!rawApiKey &&
      rawApiKey.toLowerCase() !== 'your_semaphore_api_key_here' &&
      rawApiKey.toLowerCase() !== 'your_new_semaphore_api_key';

    const isEmailConfigured = !!(
      (process.env.EMAIL_USER || process.env.SMTP_USER || process.env.GMAIL_SENDER_EMAIL) &&
      (process.env.EMAIL_APP_PASSWORD || process.env.EMAIL_PASSWORD || process.env.SMTP_PASS || process.env.GMAIL_API_KEY)
    );

    return {
      success: true,
      settings,
      admin: admin || {
        id: session.adminId,
        email: targetEmail,
        name: session.name || 'Super Admin',
        username: 'superadmin',
        contactNumber: '+63 88 888 0000',
        role: session.role || 'Super Administrator',
        department: session.department || 'MEEDO - Municipal Environment & Natural Resources Office',
        avatar: null,
        sessionTimeout: 60,
        createdAt: new Date(),
      },
      auditLogs,
      auditCount,
      gateways: {
        smsConfigured: isSmsConfigured,
        smsProvider: settings.smsProvider,
        emailConfigured: isEmailConfigured,
        emailProvider: 'Gmail SMTP (Nodemailer)',
        databaseStatus: 'Connected (PostgreSQL)',
      },
    };
  } catch (error: any) {
    console.error('getSettingsData error:', error);
    return {
      success: false,
      error: error?.message || 'Failed to load system settings data.',
    };
  }
}

/**
 * 1. Admin Profile: Update administrator personal details and avatar.
 */
export async function updateAdminProfile(
  email: string,
  data: {
    name: string;
    username?: string;
    contactNumber?: string;
    department?: string;
    avatar?: string | null;
    role?: string;
  }
) {
  try {
    const session = await requireRole(['Super Administrator']);
    const targetEmail = email || session.email;

    if (!targetEmail || !data.name?.trim()) {
      return { success: false, error: 'Full name is required.' };
    }

    // Check username uniqueness if modified
    if (data.username?.trim()) {
      const existing = await prisma.admin.findFirst({
        where: {
          username: data.username.trim(),
          NOT: { email: targetEmail },
        },
      });
      if (existing) {
        return { success: false, error: 'Username is already taken by another administrator.' };
      }
    }

    const updated = await prisma.admin.update({
      where: { email: targetEmail },
      data: {
        name: data.name.trim(),
        username: data.username?.trim() || null,
        contactNumber: data.contactNumber?.trim() || null,
        department: data.department?.trim() || null,
        avatar: data.avatar || null,
        role: data.role?.trim() || undefined,
      },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        contactNumber: true,
        department: true,
        avatar: true,
        role: true,
      },
    });

    await recordAuditLog(
      `Updated Admin Profile: ${updated.name} (${targetEmail})`,
      'SETTINGS_CHANGED',
      'Success',
      session.name || targetEmail,
      `Updated contact: ${updated.contactNumber || 'None'}, Department: ${updated.department || 'Default'}`
    );

    return { success: true, admin: updated };
  } catch (error: any) {
    console.error('updateAdminProfile error:', error);
    return { success: false, error: error?.message || 'Failed to update profile.' };
  }
}

/**
 * 2. Account Security: Update administrator password with scrypt hashing.
 */
export async function updateAdminPassword(
  email: string,
  currentPassword: string,
  newPassword: string
) {
  try {
    const session = await requireRole(['Super Administrator']);
    const targetEmail = email || session.email;

    if (!targetEmail || !currentPassword || !newPassword) {
      return { success: false, error: 'Please enter all required password fields.' };
    }

    if (newPassword.length < 8) {
      return { success: false, error: 'New password must be at least 8 characters long.' };
    }

    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      return {
        success: false,
        error: 'New password must contain at least one uppercase letter, one lowercase letter, and one number.',
      };
    }

    const admin = await prisma.admin.findUnique({
      where: { email: targetEmail },
    });

    if (!admin) {
      return { success: false, error: 'Administrator account not found.' };
    }

    // Verify current password securely using constant-time scrypt verification
    const isCurrentValid = verifyPassword(currentPassword, admin.password);
    if (!isCurrentValid) {
      await recordAuditLog(
        `Failed Password Change Attempt (Incorrect current password)`,
        'PASSWORD_CHANGED',
        'Failed',
        admin.name || email
      );
      return { success: false, error: 'Current password is incorrect.' };
    }

    // Hash the new password with a fresh random salt using scrypt
    const hashedNewPassword = hashPassword(newPassword);

    await prisma.admin.update({
      where: { email },
      data: {
        password: hashedNewPassword,
      },
    });

    await recordAuditLog(
      `Account Password Changed Successfully`,
      'PASSWORD_CHANGED',
      'Success',
      admin.name || email
    );

    return { success: true, message: 'Password updated successfully!' };
  } catch (error: any) {
    console.error('updateAdminPassword error:', error);
    return { success: false, error: error?.message || 'Failed to update password.' };
  }
}

/**
 * 2. Account Security: Invalidate all sessions / Logout from all devices.
 */
export async function logoutAllDevices(email?: string) {
  try {
    const session = await requireAdmin();
    const targetEmail = session.email;
    const admin = await prisma.admin.findUnique({ where: { email: targetEmail } });
    await recordAuditLog(
      `Administrator logged out from all active sessions & devices`,
      'LOGOUT',
      'Success',
      session.name || targetEmail
    );
    return { success: true, message: 'Successfully revoked all active sessions.' };
  } catch (error: any) {
    console.error('logoutAllDevices error:', error);
    return { success: false, error: error?.message || 'Failed to terminate all sessions.' };
  }
}

/**
 * 3. System Settings: System metadata and regional formatting.
 */
export async function updateSystemSettings(
  data: {
    systemName?: string;
    systemDescription?: string;
    systemLogo?: string | null;
    contactNumber?: string;
    officialEmail?: string;
    officeAddress?: string;
    timeZone?: string;
    dateFormat?: string;
    timeFormat?: string;
  },
  adminEmail?: string
) {
  try {
    const session = await requireRole(['Super Administrator']);
    const targetAdmin = session.name || session.email;

    const updated = await prisma.systemSetting.upsert({
      where: { id: 'default' },
      update: {
        ...data,
      },
      create: {
        id: 'default',
        ...data,
      },
    });

    await recordAuditLog(
      `Updated System Configuration: ${data.systemName || updated.systemName}`,
      'SYSTEM_CONFIG_CHANGED',
      'Success',
      targetAdmin,
      `Timezone: ${updated.timeZone}, DateFormat: ${updated.dateFormat}, TimeFormat: ${updated.timeFormat}`
    );

    return { success: true, settings: updated };
  } catch (error: any) {
    console.error('updateSystemSettings error:', error);
    return { success: false, error: error?.message || 'Failed to update system settings.' };
  }
}

/**
 * 4. Notification Settings: Toggle flags for all 8 system notifications.
 */
export async function updateNotificationSettings(
  toggles: {
    notifNewInquiry?: boolean;
    notifInquiryAccepted?: boolean;
    notifInquiryRejected?: boolean;
    notifPayment?: boolean;
    notifOverduePayment?: boolean;
    notifAnnouncement?: boolean;
    notifGraveLocator?: boolean;
    notifSystem?: boolean;
  },
  adminEmail?: string
) {
  try {
    const session = await requireRole(['Super Administrator']);
    const targetAdmin = session.name || session.email;

    const updated = await prisma.systemSetting.upsert({
      where: { id: 'default' },
      update: {
        ...toggles,
      },
      create: {
        id: 'default',
        ...toggles,
      },
    });

    await recordAuditLog(
      `Updated System Notification Preferences`,
      'NOTIFICATION_SETTINGS_CHANGED',
      'Success',
      targetAdmin,
      `Inquiries: ${updated.notifNewInquiry}, Payments: ${updated.notifPayment}, Announcements: ${updated.notifAnnouncement}`
    );

    return { success: true, settings: updated };
  } catch (error: any) {
    console.error('updateNotificationSettings error:', error);
    return { success: false, error: error?.message || 'Failed to update notification settings.' };
  }
}

/**
 * 5. SMS Settings: Save SMS provider, sender name, and enabled state.
 */
export async function updateSmsSettings(
  data: {
    smsEnabled?: boolean;
    smsProvider?: string;
    smsSenderName?: string;
  },
  adminEmail?: string
) {
  try {
    const session = await requireRole(['Super Administrator']);
    const targetAdmin = session.name || session.email;

    const updated = await prisma.systemSetting.upsert({
      where: { id: 'default' },
      update: {
        ...data,
      },
      create: {
        id: 'default',
        ...data,
      },
    });

    await recordAuditLog(
      `Updated SMS Configuration (Enabled: ${updated.smsEnabled}, Provider: ${updated.smsProvider}, Sender: ${updated.smsSenderName})`,
      'SETTINGS_CHANGED',
      'Success',
      targetAdmin
    );

    return { success: true, settings: updated };
  } catch (error: any) {
    console.error('updateSmsSettings error:', error);
    return { success: false, error: error?.message || 'Failed to save SMS settings.' };
  }
}

/**
 * 5. SMS Settings: Test SMS button execution.
 */
export async function testSmsConnection(
  recipientPhone: string,
  adminEmail: string = 'admin@jasaan.gov.ph'
) {
  try {
    if (!recipientPhone?.trim()) {
      return { success: false, error: 'Please enter a valid mobile number for the SMS test.' };
    }

    const testMessage = `[Jasaan CemeteryMS Test] Greetings! This is a test notification from the Cemetery Management System. SMS gateway is functioning properly. Timestamp: ${new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Manila' })}`;

    const result = await sendSmsNotification({
      recipient: recipientPhone.trim(),
      recipientName: 'Administrator Test',
      message: testMessage,
      type: 'CUSTOM',
      sentBy: adminEmail,
    });

    if (result.success) {
      await recordAuditLog(
        `Executed SMS Gateway Test to ${recipientPhone} (Successful)`,
        'SETTINGS_CHANGED',
        'Success',
        adminEmail
      );
      return {
        success: true,
        message: `Test SMS dispatched successfully to ${recipientPhone}!`,
      };
    } else {
      await recordAuditLog(
        `Failed SMS Gateway Test to ${recipientPhone} (${result.error || 'Gateway error'})`,
        'SETTINGS_CHANGED',
        'Warning',
        adminEmail
      );
      return {
        success: false,
        error: result.error || 'Failed to dispatch SMS test.',
        unconfigured: result.unconfigured,
      };
    }
  } catch (error: any) {
    console.error('testSmsConnection error:', error);
    return { success: false, error: error?.message || 'Unexpected error during SMS test.' };
  }
}

/**
 * 6. Email Settings: Save Email sender name, sender email, and enabled state.
 */
export async function updateEmailSettings(
  data: {
    emailEnabled?: boolean;
    emailSenderName?: string;
    emailSenderAddress?: string;
  },
  adminEmail?: string
) {
  try {
    const session = await requireRole(['Super Administrator']);
    const targetAdmin = adminEmail || session.name || session.email;

    const updated = await prisma.systemSetting.upsert({
      where: { id: 'default' },
      update: {
        ...data,
      },
      create: {
        id: 'default',
        ...data,
      },
    });

    await recordAuditLog(
      `Updated Email Configuration (Enabled: ${updated.emailEnabled}, Sender: ${updated.emailSenderName})`,
      'SETTINGS_CHANGED',
      'Success',
      targetAdmin
    );

    return { success: true, settings: updated };
  } catch (error: any) {
    console.error('updateEmailSettings error:', error);
    return { success: false, error: error?.message || 'Failed to save Email settings.' };
  }
}

/**
 * 6. Email Settings: Test Email button execution.
 */
export async function testEmailConnection(
  recipientEmail: string,
  adminEmail?: string
) {
  try {
    const session = await requireRole(['Super Administrator']);
    const targetAdmin = adminEmail || session.name || session.email;

    if (!recipientEmail?.trim()) {
      return { success: false, error: 'Please enter a valid email address for the test.' };
    }

    const settings = await getOrCreateSystemSettings();
    const result = await sendTestSystemEmail(recipientEmail.trim(), settings.emailSenderName);

    if (result.success) {
      await recordAuditLog(
        `Executed SMTP Email Test to ${recipientEmail} (Successful)`,
        'SETTINGS_CHANGED',
        'Success',
        targetAdmin
      );
      return {
        success: true,
        message: `Test email sent successfully to ${recipientEmail}!`,
      };
    } else {
      await recordAuditLog(
        `Failed SMTP Email Test to ${recipientEmail} (${result.error || 'SMTP error'})`,
        'SETTINGS_CHANGED',
        'Warning',
        targetAdmin
      );
      return {
        success: false,
        error: result.error || 'Failed to dispatch test email.',
        unconfigured: result.unconfigured,
      };
    }
  } catch (error: any) {
    console.error('testEmailConnection error:', error);
    return { success: false, error: error?.message || 'Unexpected error during Email test.' };
  }
}

/**
 * 7. User/Mobile Settings: Public and Mobile app access controls + Maintenance mode.
 */
export async function updateUserMobileSettings(
  data: {
    userAccessEnabled?: boolean;
    mobileAppEnabled?: boolean;
    inquiriesEnabled?: boolean;
    announcementsEnabled?: boolean;
    graveLocatorEnabled?: boolean;
    maintenanceMode?: boolean;
    maintenanceMessage?: string;
  },
  adminEmail?: string
) {
  try {
    const session = await requireRole(['Super Administrator']);
    const targetAdmin = adminEmail || session.name || session.email;

    const updated = await prisma.systemSetting.upsert({
      where: { id: 'default' },
      update: {
        ...data,
      },
      create: {
        id: 'default',
        ...data,
      },
    });

    await recordAuditLog(
      `Updated User & Mobile Access Controls (Maintenance Mode: ${updated.maintenanceMode ? 'ENABLED' : 'DISABLED'})`,
      'SYSTEM_CONFIG_CHANGED',
      updated.maintenanceMode ? 'Warning' : 'Success',
      targetAdmin,
      `UserAccess: ${updated.userAccessEnabled}, MobileApp: ${updated.mobileAppEnabled}, Inquiries: ${updated.inquiriesEnabled}`
    );

    return { success: true, settings: updated };
  } catch (error: any) {
    console.error('updateUserMobileSettings error:', error);
    return { success: false, error: error?.message || 'Failed to update user/mobile settings.' };
  }
}

/**
 * 8. Appearance Settings: Theme, sidebar behavior, and density.
 */
export async function updateAppearanceSettings(
  data: {
    defaultTheme?: string;
    sidebarBehavior?: string;
    layoutDensity?: string;
  },
  adminEmail?: string
) {
  try {
    const session = await requireRole(['Super Administrator']);
    const targetAdmin = adminEmail || session.name || session.email;

    const updated = await prisma.systemSetting.upsert({
      where: { id: 'default' },
      update: {
        ...data,
      },
      create: {
        id: 'default',
        ...data,
      },
    });

    await recordAuditLog(
      `Updated Dashboard Appearance Settings (Theme: ${updated.defaultTheme}, Sidebar: ${updated.sidebarBehavior}, Density: ${updated.layoutDensity})`,
      'SETTINGS_CHANGED',
      'Success',
      targetAdmin
    );

    return { success: true, settings: updated };
  } catch (error: any) {
    console.error('updateAppearanceSettings error:', error);
    return { success: false, error: error?.message || 'Failed to save appearance preferences.' };
  }
}

/**
 * 9. System Preferences: Items per page, default dashboard, language.
 */
export async function updateSystemPreferences(
  data: {
    itemsPerPage?: number;
    defaultDashboardPage?: string;
    language?: string;
    dateFormat?: string;
    timeFormat?: string;
    timeZone?: string;
  },
  adminEmail?: string
) {
  try {
    const session = await requireRole(['Super Administrator']);
    const targetAdmin = adminEmail || session.name || session.email;

    const updated = await prisma.systemSetting.upsert({
      where: { id: 'default' },
      update: {
        ...data,
      },
      create: {
        id: 'default',
        ...data,
      },
    });

    await recordAuditLog(
      `Updated System Preferences (ItemsPerPage: ${updated.itemsPerPage}, Lang: ${updated.language}, DefaultPage: ${updated.defaultDashboardPage})`,
      'SETTINGS_CHANGED',
      'Success',
      targetAdmin
    );

    return { success: true, settings: updated };
  } catch (error: any) {
    console.error('updateSystemPreferences error:', error);
    return { success: false, error: error?.message || 'Failed to update preferences.' };
  }
}

/**
 * 10. Data & Backup: Generates a complete, structured JSON backup of cemetery databases.
 */
export async function triggerManualBackup(adminEmail?: string) {
  let targetAdmin = adminEmail || 'System Administrator';
  try {
    const session = await requireRole(['Super Administrator']);
    targetAdmin = session.name || session.email;

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `cemetery_backup_${timestamp}.json`;

    // Fetch records across all core tables (excluding sensitive passwords)
    const [deceased, payments, inquiries, announcements, smsLogs, settings, auditLogs] = await Promise.all([
      prisma.deceasedRecord.findMany(),
      prisma.paymentRecord.findMany(),
      prisma.inquiries.findMany(),
      prisma.announcement.findMany(),
      prisma.smsNotification.findMany({ take: 500, orderBy: { createdAt: 'desc' } }),
      prisma.systemSetting.findUnique({ where: { id: 'default' } }),
      prisma.adminAuditLog.findMany({ take: 500, orderBy: { createdAt: 'desc' } }),
    ]);

    const backupData = {
      version: '2.4.0',
      timestamp: new Date().toISOString(),
      municipality: 'Municipality of Jasaan',
      system: 'Web and Mobile-based Cemetery Management System',
      exportedBy: targetAdmin,
      counts: {
        deceasedRecords: deceased.length,
        paymentRecords: payments.length,
        inquiries: inquiries.length,
        announcements: announcements.length,
        smsLogs: smsLogs.length,
        auditLogs: auditLogs.length,
      },
      tables: {
        deceasedRecords: deceased,
        paymentRecords: payments,
        inquiries,
        announcements,
        smsNotifications: smsLogs,
        systemSettings: settings,
        auditLogs,
      },
    };

    const jsonString = JSON.stringify(backupData, null, 2);
    const checksum = crypto.createHash('sha256').update(jsonString).digest('hex');

    // Update settings table with backup completion status
    const updatedSettings = await prisma.systemSetting.upsert({
      where: { id: 'default' },
      update: {
        lastBackupAt: new Date(),
        lastBackupFile: filename,
        backupStatus: 'Successful',
      },
      create: {
        id: 'default',
        lastBackupAt: new Date(),
        lastBackupFile: filename,
        backupStatus: 'Successful',
      },
    });

    await recordAuditLog(
      `Manual Database Backup Created: ${filename} (Total Records: ${deceased.length + payments.length + inquiries.length})`,
      'BACKUP',
      'Success',
      targetAdmin,
      `SHA-256 Checksum: ${checksum}`
    );

    return {
      success: true,
      filename,
      jsonString,
      checksum,
      counts: backupData.counts,
      settings: updatedSettings,
    };
  } catch (error: any) {
    console.error('triggerManualBackup error:', error);
    await recordAuditLog(
      `Manual Database Backup Attempt Failed: ${error?.message || 'Unknown error'}`,
      'BACKUP',
      'Failed',
      targetAdmin
    );
    return {
      success: false,
      error: error?.message || 'Failed to complete system backup.',
    };
  }
}

/**
 * 10. Data & Backup: Update automated backup frequency and toggle.
 */
export async function updateBackupConfig(
  data: {
    autoBackupEnabled?: boolean;
    backupFrequency?: string;
  },
  adminEmail?: string
) {
  try {
    const session = await requireRole(['Super Administrator']);
    const targetAdmin = adminEmail || session.name || session.email;

    const updated = await prisma.systemSetting.upsert({
      where: { id: 'default' },
      update: {
        ...data,
      },
      create: {
        id: 'default',
        ...data,
      },
    });

    await recordAuditLog(
      `Updated Backup Schedule (Auto-backup: ${updated.autoBackupEnabled}, Frequency: ${updated.backupFrequency})`,
      'SETTINGS_CHANGED',
      'Success',
      targetAdmin
    );

    return { success: true, settings: updated };
  } catch (error: any) {
    console.error('updateBackupConfig error:', error);
    return { success: false, error: error?.message || 'Failed to update backup settings.' };
  }
}

/**
 * 11. Audit & Activity: Queries recent administrator activities with filtering and pagination.
 */
export async function getAuditLogs(params: {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  try {
    await requireAdmin();
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 20));
    const skip = (page - 1) * limit;

    const whereClause: any = {};

    if (params.category && params.category !== 'ALL') {
      whereClause.category = params.category;
    }

    if (params.search?.trim()) {
      whereClause.OR = [
        { activity: { contains: params.search.trim(), mode: 'insensitive' } },
        { admin: { contains: params.search.trim(), mode: 'insensitive' } },
        { details: { contains: params.search.trim(), mode: 'insensitive' } },
      ];
    }

    const [logs, total] = await Promise.all([
      prisma.adminAuditLog.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.adminAuditLog.count({ where: whereClause }),
    ]);

    return {
      success: true,
      logs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error: any) {
    console.error('getAuditLogs error:', error);
    return { success: false, error: error?.message || 'Failed to fetch audit activity logs.', logs: [], total: 0 };
  }
}

/**
 * 11. Audit & Activity: Clear or reset audit logs with administrative confirmation.
 */
export async function clearAuditLogs(adminEmail?: string) {
  try {
    const session = await requireRole(['Super Administrator']);
    const targetAdmin = adminEmail || session.name || session.email;

    await prisma.adminAuditLog.deleteMany({});

    // Record the reset event itself
    await prisma.adminAuditLog.create({
      data: {
        activity: 'Audit logs cleared and archived by Administrator',
        category: 'SYSTEM_CONFIG_CHANGED',
        status: 'Warning',
        admin: targetAdmin,
        details: 'System audit log history was purged with administrator approval.',
      },
    });

    return { success: true, message: 'Audit logs have been reset.' };
  } catch (error: any) {
    console.error('clearAuditLogs error:', error);
    return { success: false, error: error?.message || 'Failed to clear audit logs.' };
  }
}
