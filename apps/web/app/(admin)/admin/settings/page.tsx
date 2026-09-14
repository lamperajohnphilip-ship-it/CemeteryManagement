'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styles from './page.module.css';
import {
  getSettingsData,
  updateAdminProfile,
  updateAdminPassword,
  logoutAllDevices,
  updateSystemSettings,
  updateNotificationSettings,
  updateSmsSettings,
  testSmsConnection,
  updateEmailSettings,
  testEmailConnection,
  updateUserMobileSettings,
  updateAppearanceSettings,
  updateSystemPreferences,
  triggerManualBackup,
  updateBackupConfig,
  getAuditLogs,
  clearAuditLogs,
} from '../../../actions/settings';

type TabKey =
  | 'profile'
  | 'security'
  | 'system'
  | 'notifications'
  | 'sms'
  | 'email'
  | 'user_mobile'
  | 'appearance'
  | 'preferences'
  | 'backup'
  | 'audit'
  | 'about';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // ── 1. Admin Profile State ──────────────────────────────
  const [adminId, setAdminId] = useState('');
  const [fullName, setFullName] = useState('Super Admin');
  const [username, setUsername] = useState('superadmin');
  const [email, setEmail] = useState('admin@jasaan.gov.ph');
  const [contactNumber, setContactNumber] = useState('+63 88 888 0000');
  const [role, setRole] = useState('Super Administrator');
  const [department, setDepartment] = useState('MEEDO - Municipal Environment & Natural Resources Office');
  const [avatar, setAvatar] = useState<string | null>(null);

  // ── 2. Account Security State ───────────────────────────
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(60);

  // ── 3. System Settings State ────────────────────────────
  const [systemName, setSystemName] = useState('Eternal Rest - Cemetery Management System');
  const [systemDescription, setSystemDescription] = useState('Web and Mobile-based Cemetery Management System for the Municipality of Jasaan');
  const [systemLogo, setSystemLogo] = useState<string | null>(null);
  const [sysContactNumber, setSysContactNumber] = useState('+63 88 888 0000');
  const [officialEmail, setOfficialEmail] = useState('admin@jasaan.gov.ph');
  const [officeAddress, setOfficeAddress] = useState('MEEDO Office, Municipal Hall, Jasaan, Misamis Oriental');
  const [timeZone, setTimeZone] = useState('Asia/Manila');
  const [dateFormat, setDateFormat] = useState('YYYY-MM-DD');
  const [timeFormat, setTimeFormat] = useState('12-hour');

  // ── 4. Notification Settings State ──────────────────────
  const [notifNewInquiry, setNotifNewInquiry] = useState(true);
  const [notifInquiryAccepted, setNotifInquiryAccepted] = useState(true);
  const [notifInquiryRejected, setNotifInquiryRejected] = useState(true);
  const [notifPayment, setNotifPayment] = useState(true);
  const [notifOverduePayment, setNotifOverduePayment] = useState(true);
  const [notifAnnouncement, setNotifAnnouncement] = useState(true);
  const [notifGraveLocator, setNotifGraveLocator] = useState(true);
  const [notifSystem, setNotifSystem] = useState(true);

  // ── 5. SMS Settings State ───────────────────────────────
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [smsProvider, setSmsProvider] = useState('Semaphore');
  const [smsSenderName, setSmsSenderName] = useState('SEMAPHORE');
  const [smsConfigured, setSmsConfigured] = useState(false);
  const [testSmsModalOpen, setTestSmsModalOpen] = useState(false);
  const [testSmsPhone, setTestSmsPhone] = useState('09171234567');
  const [testingSms, setTestingSms] = useState(false);

  // ── 6. Email Settings State ─────────────────────────────
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [emailSenderName, setEmailSenderName] = useState('Municipality of Jasaan Cemetery Management System');
  const [emailSenderAddress, setEmailSenderAddress] = useState('admin@jasaan.gov.ph');
  const [emailConfigured, setEmailConfigured] = useState(false);
  const [testEmailModalOpen, setTestEmailModalOpen] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState('admin@jasaan.gov.ph');
  const [testingEmail, setTestingEmail] = useState(false);

  // ── 7. User/Mobile Settings State ───────────────────────
  const [userAccessEnabled, setUserAccessEnabled] = useState(true);
  const [mobileAppEnabled, setMobileAppEnabled] = useState(true);
  const [inquiriesEnabled, setInquiriesEnabled] = useState(true);
  const [announcementsEnabled, setAnnouncementsEnabled] = useState(true);
  const [graveLocatorEnabled, setGraveLocatorEnabled] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState(
    'The cemetery management portal is currently undergoing scheduled maintenance. Please check back shortly.'
  );

  // ── 8. Appearance State ─────────────────────────────────
  const [theme, setTheme] = useState('dark');
  const [sidebarBehavior, setSidebarBehavior] = useState('expanded');
  const [layoutDensity, setLayoutDensity] = useState('normal');

  // ── 9. System Preferences State ─────────────────────────
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [defaultDashboardPage, setDefaultDashboardPage] = useState('/admin/cemetery-overview');
  const [language, setLanguage] = useState('English');

  // ── 10. Data & Backup State ─────────────────────────────
  const [lastBackupAt, setLastBackupAt] = useState<string | null>(null);
  const [lastBackupFile, setLastBackupFile] = useState<string | null>(null);
  const [backupStatus, setBackupStatus] = useState('Ready');
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState('Daily');
  const [backupModalOpen, setBackupModalOpen] = useState(false);
  const [runningBackup, setRunningBackup] = useState(false);

  // ── 11. Audit & Activity State ──────────────────────────
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [auditCount, setAuditCount] = useState(0);
  const [auditCategory, setAuditCategory] = useState('ALL');
  const [auditSearch, setAuditSearch] = useState('');
  const [auditPage, setAuditPage] = useState(1);
  const [auditTotalPages, setAuditTotalPages] = useState(1);
  const [loadingAudit, setLoadingAudit] = useState(false);
  const [clearAuditModalOpen, setClearAuditModalOpen] = useState(false);

  // Confirmation Modals State
  const [logoutAllModalOpen, setLogoutAllModalOpen] = useState(false);
  const [maintenanceModalOpen, setMaintenanceModalOpen] = useState(false);

  // ── Toast Helper ────────────────────────────────────────
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // ── Initial Data Fetch ──────────────────────────────────
  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    try {
      // Check stored admin profile for email
      let currentAdminEmail = 'admin@jasaan.gov.ph';
      const stored = localStorage.getItem('adminProfile');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.emailAddress) currentAdminEmail = parsed.emailAddress;
        } catch (e) {}
      }

      const res = await getSettingsData(currentAdminEmail);
      if (res.success && res.settings) {
        const s = res.settings;
        // Profile
        if (res.admin) {
          setAdminId(res.admin.id || '');
          setFullName(res.admin.name || 'Super Admin');
          setUsername(res.admin.username || 'superadmin');
          setEmail(res.admin.email || currentAdminEmail);
          setContactNumber(res.admin.contactNumber || '+63 88 888 0000');
          setRole(res.admin.role || 'Super Administrator');
          setDepartment(res.admin.department || 'MEEDO - Municipal Environment & Natural Resources Office');
          setAvatar(res.admin.avatar || null);
          setSessionTimeout(res.admin.sessionTimeout || s.sessionTimeout || 60);
        }

        // System Settings
        setSystemName(s.systemName || '');
        setSystemDescription(s.systemDescription || '');
        setSystemLogo(s.systemLogo || null);
        setSysContactNumber(s.contactNumber || '');
        setOfficialEmail(s.officialEmail || '');
        setOfficeAddress(s.officeAddress || '');
        setTimeZone(s.timeZone || 'Asia/Manila');
        setDateFormat(s.dateFormat || 'YYYY-MM-DD');
        setTimeFormat(s.timeFormat || '12-hour');

        // Notifications
        setNotifNewInquiry(s.notifNewInquiry);
        setNotifInquiryAccepted(s.notifInquiryAccepted);
        setNotifInquiryRejected(s.notifInquiryRejected);
        setNotifPayment(s.notifPayment);
        setNotifOverduePayment(s.notifOverduePayment);
        setNotifAnnouncement(s.notifAnnouncement);
        setNotifGraveLocator(s.notifGraveLocator);
        setNotifSystem(s.notifSystem);

        // SMS
        setSmsEnabled(s.smsEnabled);
        setSmsProvider(s.smsProvider || 'Semaphore');
        setSmsSenderName(s.smsSenderName || 'SEMAPHORE');
        setSmsConfigured(res.gateways?.smsConfigured ?? false);

        // Email
        setEmailEnabled(s.emailEnabled);
        setEmailSenderName(s.emailSenderName || 'Municipality of Jasaan Cemetery Management System');
        setEmailSenderAddress(s.emailSenderAddress || 'admin@jasaan.gov.ph');
        setEmailConfigured(res.gateways?.emailConfigured ?? false);

        // User / Mobile
        setUserAccessEnabled(s.userAccessEnabled);
        setMobileAppEnabled(s.mobileAppEnabled);
        setInquiriesEnabled(s.inquiriesEnabled);
        setAnnouncementsEnabled(s.announcementsEnabled);
        setGraveLocatorEnabled(s.graveLocatorEnabled);
        setMaintenanceMode(s.maintenanceMode);
        setMaintenanceMessage(s.maintenanceMessage);

        // Appearance
        const savedTheme = localStorage.getItem('adminTheme') || s.defaultTheme || 'dark';
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
        setSidebarBehavior(s.sidebarBehavior || 'expanded');
        setLayoutDensity(s.layoutDensity || 'normal');

        // Preferences
        setItemsPerPage(s.itemsPerPage || 25);
        setDefaultDashboardPage(s.defaultDashboardPage || '/admin/cemetery-overview');
        setLanguage(s.language || 'English');

        // Data & Backup
        setLastBackupAt(s.lastBackupAt ? new Date(s.lastBackupAt).toLocaleString('en-US', { timeZone: 'Asia/Manila' }) : null);
        setLastBackupFile(s.lastBackupFile || null);
        setBackupStatus(s.backupStatus || 'Ready');
        setAutoBackupEnabled(s.autoBackupEnabled);
        setBackupFrequency(s.backupFrequency || 'Daily');

        // Audit Logs
        setAuditLogs(res.auditLogs || []);
        setAuditCount(res.auditCount || 0);
        setAuditTotalPages(Math.ceil((res.auditCount || 0) / 20) || 1);
      } else {
        showToast(res.error || 'Could not load configuration from server.', 'error');
      }
    } catch (err: any) {
      showToast('Network error while retrieving settings.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // ── Fetch Audit Logs Filtered ───────────────────────────
  const fetchAuditLogs = useCallback(
    async (page = 1, category = auditCategory, search = auditSearch) => {
      setLoadingAudit(true);
      try {
        const res = await getAuditLogs({ category, search, page, limit: 15 });
        if (res.success) {
          setAuditLogs(res.logs || []);
          setAuditCount(res.total || 0);
          setAuditPage(res.page || 1);
          setAuditTotalPages(res.totalPages || 1);
        }
      } catch (e) {
        console.error('Failed to load audit logs', e);
      } finally {
        setLoadingAudit(false);
      }
    },
    [auditCategory, auditSearch]
  );

  // ── Password Strength Evaluation ────────────────────────
  const passwordStrength = useMemo(() => {
    if (!newPassword) return { score: 0, label: 'None', color: '#333' };
    let score = 0;
    if (newPassword.length >= 8) score += 1;
    if (/[A-Z]/.test(newPassword)) score += 1;
    if (/[a-z]/.test(newPassword) && /[0-9]/.test(newPassword)) score += 1;
    if (/[^A-Za-z0-9]/.test(newPassword) || newPassword.length >= 12) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: 'Weak', color: '#ef4444' };
      case 2:
        return { score: 2, label: 'Fair', color: '#f59e0b' };
      case 3:
        return { score: 3, label: 'Good', color: '#3b82f6' };
      case 4:
      default:
        return { score: 4, label: 'Strong', color: '#22c55e' };
    }
  }, [newPassword]);

  // ── Handlers ────────────────────────────────────────────

  // 1. Save Profile
  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await updateAdminProfile(email, {
        name: fullName,
        username,
        contactNumber,
        department,
        avatar,
        role,
      });
      if (res.success) {
        localStorage.setItem(
          'adminProfile',
          JSON.stringify({
            emailAddress: email,
            name: fullName,
            username,
            contactNumber,
            department,
            role,
          })
        );
        showToast('Admin profile updated successfully!', 'success');
        fetchAuditLogs();
      } else {
        showToast(res.error || 'Failed to update profile.', 'error');
      }
    } catch (e: any) {
      showToast(e?.message || 'Error updating profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Avatar file upload handler (converts to base64)
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showToast('Profile image size must be under 2MB.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(reader.result as string);
      showToast('Avatar preview ready. Click "Save Changes" to apply.', 'info');
    };
    reader.readAsDataURL(file);
  };

  // 2. Save Password
  const handleSavePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast('Please fill in all password fields.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match.', 'error');
      return;
    }
    if (newPassword.length < 8) {
      showToast('New password must be at least 8 characters.', 'error');
      return;
    }
    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      showToast('Password must contain uppercase, lowercase, and a number.', 'error');
      return;
    }

    setSaving(true);
    try {
      const res = await updateAdminPassword(email, currentPassword, newPassword);
      if (res.success) {
        showToast('Account password updated successfully!', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        fetchAuditLogs();
      } else {
        showToast(res.error || 'Failed to update password.', 'error');
      }
    } catch (e: any) {
      showToast(e?.message || 'Error updating password.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Logout from all devices
  const handleConfirmLogoutAll = async () => {
    setSaving(true);
    try {
      const res = await logoutAllDevices(email);
      if (res.success) {
        showToast('All active sessions have been terminated.', 'success');
        setLogoutAllModalOpen(false);
        fetchAuditLogs();
      } else {
        showToast(res.error || 'Failed to terminate sessions.', 'error');
      }
    } catch (e: any) {
      showToast(e?.message || 'Error revoking sessions.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // 3. Save System Settings
  const handleSaveSystemSettings = async () => {
    setSaving(true);
    try {
      const res = await updateSystemSettings(
        {
          systemName,
          systemDescription,
          systemLogo,
          contactNumber: sysContactNumber,
          officialEmail,
          officeAddress,
          timeZone,
          dateFormat,
          timeFormat,
        },
        email
      );
      if (res.success) {
        showToast('System configuration saved successfully!', 'success');
        fetchAuditLogs();
      } else {
        showToast(res.error || 'Failed to save system settings.', 'error');
      }
    } catch (e: any) {
      showToast('Error saving system settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // 4. Save Notification Settings
  const handleSaveNotifications = async () => {
    setSaving(true);
    try {
      const res = await updateNotificationSettings(
        {
          notifNewInquiry,
          notifInquiryAccepted,
          notifInquiryRejected,
          notifPayment,
          notifOverduePayment,
          notifAnnouncement,
          notifGraveLocator,
          notifSystem,
        },
        email
      );
      if (res.success) {
        showToast('Notification preferences updated!', 'success');
        fetchAuditLogs();
      } else {
        showToast(res.error || 'Failed to update notifications.', 'error');
      }
    } catch (e) {
      showToast('Error saving notification preferences.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // 5. Save SMS Settings
  const handleSaveSmsSettings = async () => {
    setSaving(true);
    try {
      const res = await updateSmsSettings(
        {
          smsEnabled,
          smsProvider,
          smsSenderName,
        },
        email
      );
      if (res.success) {
        showToast('SMS configuration saved!', 'success');
        fetchAuditLogs();
      } else {
        showToast(res.error || 'Failed to save SMS settings.', 'error');
      }
    } catch (e) {
      showToast('Error updating SMS configuration.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Test SMS Dispatch
  const handleSendTestSms = async () => {
    if (!testSmsPhone?.trim()) {
      showToast('Please enter a test mobile phone number.', 'error');
      return;
    }
    setTestingSms(true);
    try {
      const res = await testSmsConnection(testSmsPhone, email);
      if (res.success) {
        showToast(res.message || 'Test SMS sent successfully!', 'success');
        setTestSmsModalOpen(false);
        fetchAuditLogs();
      } else {
        showToast(res.error || 'Failed to send test SMS.', 'error');
      }
    } catch (e: any) {
      showToast(e?.message || 'Error executing test SMS.', 'error');
    } finally {
      setTestingSms(false);
    }
  };

  // 6. Save Email Settings
  const handleSaveEmailSettings = async () => {
    setSaving(true);
    try {
      const res = await updateEmailSettings(
        {
          emailEnabled,
          emailSenderName,
          emailSenderAddress,
        },
        email
      );
      if (res.success) {
        showToast('Email settings saved successfully!', 'success');
        fetchAuditLogs();
      } else {
        showToast(res.error || 'Failed to save email settings.', 'error');
      }
    } catch (e) {
      showToast('Error updating email configuration.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Test Email Dispatch
  const handleSendTestEmail = async () => {
    if (!testEmailAddress?.trim()) {
      showToast('Please enter a test recipient email address.', 'error');
      return;
    }
    setTestingEmail(true);
    try {
      const res = await testEmailConnection(testEmailAddress, email);
      if (res.success) {
        showToast(res.message || 'Test email dispatched successfully!', 'success');
        setTestEmailModalOpen(false);
        fetchAuditLogs();
      } else {
        showToast(res.error || 'Failed to send test email.', 'error');
      }
    } catch (e: any) {
      showToast(e?.message || 'Error executing test email.', 'error');
    } finally {
      setTestingEmail(false);
    }
  };

  // 7. Save User & Mobile Settings
  const handleSaveUserMobileSettings = async (overrideMaintenance?: boolean) => {
    setSaving(true);
    const targetMaintenance = overrideMaintenance !== undefined ? overrideMaintenance : maintenanceMode;
    try {
      const res = await updateUserMobileSettings(
        {
          userAccessEnabled,
          mobileAppEnabled,
          inquiriesEnabled,
          announcementsEnabled,
          graveLocatorEnabled,
          maintenanceMode: targetMaintenance,
          maintenanceMessage,
        },
        email
      );
      if (res.success) {
        setMaintenanceMode(targetMaintenance);
        setMaintenanceModalOpen(false);
        showToast(
          targetMaintenance
            ? 'Maintenance Mode ENABLED. Public users will see maintenance notice.'
            : 'User & Mobile access configuration saved successfully!',
          targetMaintenance ? 'info' : 'success'
        );
        fetchAuditLogs();
      } else {
        showToast(res.error || 'Failed to update access settings.', 'error');
      }
    } catch (e) {
      showToast('Error updating User & Mobile settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // 8. Save Appearance Settings
  const handleSaveAppearance = async (newTheme: string, newSidebar = sidebarBehavior, newDensity = layoutDensity) => {
    setTheme(newTheme);
    localStorage.setItem('adminTheme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);

    setSidebarBehavior(newSidebar);
    setLayoutDensity(newDensity);

    try {
      await updateAppearanceSettings(
        {
          defaultTheme: newTheme,
          sidebarBehavior: newSidebar,
          layoutDensity: newDensity,
        },
        email
      );
      showToast(`Appearance updated: Theme set to ${newTheme.toUpperCase()}`, 'success');
      fetchAuditLogs();
    } catch (e) {
      showToast('Appearance updated locally.', 'info');
    }
  };

  // 9. Save System Preferences
  const handleSavePreferences = async () => {
    setSaving(true);
    try {
      const res = await updateSystemPreferences(
        {
          itemsPerPage,
          defaultDashboardPage,
          language,
          dateFormat,
          timeFormat,
          timeZone,
        },
        email
      );
      if (res.success) {
        showToast('System preferences saved successfully!', 'success');
        fetchAuditLogs();
      } else {
        showToast(res.error || 'Failed to save preferences.', 'error');
      }
    } catch (e) {
      showToast('Error saving system preferences.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // 10. Manual Backup Execution
  const handleExecuteBackup = async () => {
    setRunningBackup(true);
    try {
      const res = await triggerManualBackup(email);
      if (res.success && res.jsonString) {
        // Create browser download
        const blob = new Blob([res.jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = res.filename || `cemetery_backup_${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setLastBackupAt(new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' }));
        setLastBackupFile(res.filename);
        setBackupStatus('Successful');
        setBackupModalOpen(false);
        showToast(`Backup created & downloaded! Total records: ${Object.values(res.counts).reduce((a: any, b: any) => a + b, 0)}`, 'success');
        fetchAuditLogs();
      } else {
        showToast(res.error || 'Failed to generate backup.', 'error');
      }
    } catch (e: any) {
      showToast(e?.message || 'Error generating database backup.', 'error');
    } finally {
      setRunningBackup(false);
    }
  };

  // Save Backup Schedule
  const handleSaveBackupSchedule = async () => {
    setSaving(true);
    try {
      const res = await updateBackupConfig(
        {
          autoBackupEnabled,
          backupFrequency,
        },
        email
      );
      if (res.success) {
        showToast('Automated backup schedule updated!', 'success');
        fetchAuditLogs();
      } else {
        showToast(res.error || 'Failed to update backup schedule.', 'error');
      }
    } catch (e) {
      showToast('Error updating backup schedule.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // 11. Clear Audit Logs
  const handleClearAuditLogs = async () => {
    setSaving(true);
    try {
      const res = await clearAuditLogs(email);
      if (res.success) {
        showToast('Audit activity logs have been cleared.', 'info');
        setClearAuditModalOpen(false);
        fetchAuditLogs();
      } else {
        showToast(res.error || 'Failed to clear audit logs.', 'error');
      }
    } catch (e) {
      showToast('Error clearing logs.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Format Helper
  const formatTimestamp = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString('en-US', {
        timeZone: 'Asia/Manila',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
    } catch (e) {
      return dateStr;
    }
  };

  const navTabs = [
    { key: 'profile' as TabKey, label: 'Admin Profile', icon: '👤' },
    { key: 'security' as TabKey, label: 'Account Security', icon: '🔒' },
    { key: 'system' as TabKey, label: 'System Settings', icon: '⚙️' },
    { key: 'notifications' as TabKey, label: 'Notification Settings', icon: '🔔' },
    { key: 'sms' as TabKey, label: 'SMS Settings', icon: '💬' },
    { key: 'email' as TabKey, label: 'Email Settings', icon: '✉️' },
    { key: 'user_mobile' as TabKey, label: 'User & Mobile Settings', icon: '📱' },
    { key: 'appearance' as TabKey, label: 'Appearance', icon: '🎨' },
    { key: 'preferences' as TabKey, label: 'System Preferences', icon: '⚡' },
    { key: 'backup' as TabKey, label: 'Data & Backup', icon: '💾' },
    { key: 'audit' as TabKey, label: 'Audit & Activity', icon: '📜', badge: auditCount > 0 ? auditCount : undefined },
    { key: 'about' as TabKey, label: 'About System', icon: 'ℹ️' },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16 }}>
        <div className={styles.spinner} style={{ width: 28, height: 28, borderWidth: 3 }}></div>
        <p style={{ color: '#7A7570', fontSize: '0.9rem', letterSpacing: '0.04em' }}>Loading System & Administrator Settings…</p>
      </div>
    );
  }

  return (
    <div className={styles.settingsContainer}>
      {/* Toast Notifications */}
      <div className={styles.toastContainer}>
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`${styles.toast} ${
              t.type === 'success' ? styles.toastSuccess : t.type === 'error' ? styles.toastError : styles.toastInfo
            }`}
          >
            <span className={styles.toastIcon}>{t.type === 'success' ? '✓' : t.type === 'error' ? '⚠' : 'ℹ'}</span>
            <span className={styles.toastMessage}>{t.message}</span>
            <button className={styles.toastClose} onClick={() => removeToast(t.id)}>
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerTitleGroup}>
          <h3>System & Administrator Settings</h3>
          <p>Configure administrative accounts, security protocols, gateways, public access, and maintenance operations.</p>
        </div>
        <div className={styles.headerBadges}>
          {maintenanceMode && (
            <span className={styles.maintenanceAlertBadge}>
              <span>⚠️</span> Maintenance Mode Active
            </span>
          )}
          <span className={styles.systemBadge}>
            <span className={styles.systemBadgeDot}></span>
            <span>PostgreSQL Online</span>
          </span>
          <span className={styles.systemBadge} style={{ borderColor: smsConfigured ? 'rgba(34,197,94,0.3)' : 'rgba(234,179,8,0.3)' }}>
            <span
              className={styles.systemBadgeDot}
              style={{ background: smsConfigured ? '#22c55e' : '#facc15', boxShadow: 'none' }}
            ></span>
            <span>SMS: {smsConfigured ? 'Semaphore Active' : 'Unconfigured'}</span>
          </span>
        </div>
      </div>

      {/* Main Settings Layout (Sidebar Tabs + Content) */}
      <div className={styles.settingsLayout}>
        {/* Navigation Tabs */}
        <aside className={styles.tabsNav}>
          <div className={styles.tabsNavLabel}>CONFIGURATION SECTIONS</div>
          {navTabs.map((tab) => (
            <button
              key={tab.key}
              className={`${styles.tabButton} ${activeTab === tab.key ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              <span className={styles.tabText}>{tab.label}</span>
              {tab.badge !== undefined && <span className={styles.tabBadge}>{tab.badge}</span>}
            </button>
          ))}
        </aside>

        {/* Active Section Content */}
        <main className={styles.contentArea}>
          {/* =================================================================
              1. ADMIN PROFILE
             ================================================================= */}
          {activeTab === 'profile' && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardHeaderInfo}>
                  <h4>1. Admin Profile</h4>
                  <p>Manage your administrative identity, contact channels, and system credentials.</p>
                </div>
                <span className={styles.statusPill + ' ' + styles.statusSuccess}>Verified Administrator</span>
              </div>
              <div className={styles.cardBody}>
                {/* Profile Picture */}
                <div className={styles.avatarSection}>
                  <div className={styles.avatarCircle}>
                    {avatar ? (
                      <img src={avatar} alt="Profile" className={styles.avatarImage} />
                    ) : (
                      <span>{fullName.charAt(0) || 'A'}</span>
                    )}
                  </div>
                  <div className={styles.avatarActions}>
                    <div className={styles.avatarName}>{fullName}</div>
                    <div className={styles.avatarRole}>{role} · {department}</div>
                    <div className={styles.avatarButtons}>
                      <label className={styles.btnOutline + ' ' + styles.btnSmall} style={{ cursor: 'pointer' }}>
                        <span>📷 Change Profile Picture</span>
                        <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} />
                      </label>
                      {avatar && (
                        <button
                          className={styles.btnDanger + ' ' + styles.btnSmall}
                          onClick={() => {
                            setAvatar(null);
                            showToast('Avatar removed. Click "Save Changes" to apply.', 'info');
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form Inputs */}
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Full Name</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. John Philip Lampera"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Username</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. admin_jasaan"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Email Address</label>
                    <input
                      type="email"
                      className={styles.formInput}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@jasaan.gov.ph"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Contact Number</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      placeholder="+63 917 123 4567"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Assigned Role</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="Super Administrator"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Department / Office</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="MEEDO"
                    />
                  </div>
                </div>
              </div>
              <div className={styles.cardFooter}>
                <button
                  className={styles.btnOutline}
                  onClick={() => {
                    fetchInitialData();
                    showToast('Profile form reset to server defaults.', 'info');
                  }}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button className={styles.btnGold} onClick={handleSaveProfile} disabled={saving}>
                  {saving && <span className={styles.spinner}></span>}
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* =================================================================
              2. ACCOUNT SECURITY
             ================================================================= */}
          {activeTab === 'security' && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardHeaderInfo}>
                  <h4>2. Account Security</h4>
                  <p>Enforce strong authentication credentials, password encryption, and manage active session lifespans.</p>
                </div>
                <span className={styles.statusPill + ' ' + styles.statusSuccess}>Scrypt Salted Encryption</span>
              </div>
              <div className={styles.cardBody}>
                {/* Change Password Form */}
                <h5 style={{ fontSize: '0.95rem', color: '#E2C97E', marginBottom: 16 }}>Change Password</h5>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Current Password</label>
                  <div className={styles.passwordInputWrapper}>
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      className={styles.formInput}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter your current password"
                    />
                    <button
                      type="button"
                      className={styles.passwordToggleBtn}
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? '👁' : '👁‍🗨'}
                    </button>
                  </div>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>New Password</label>
                    <div className={styles.passwordInputWrapper}>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        className={styles.formInput}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Minimum 8 characters"
                      />
                      <button
                        type="button"
                        className={styles.passwordToggleBtn}
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? '👁' : '👁‍🗨'}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {newPassword && (
                      <div className={styles.strengthMeter}>
                        <div className={styles.strengthBars}>
                          <div
                            className={styles.strengthBar}
                            style={{ background: passwordStrength.score >= 1 ? passwordStrength.color : '#252525' }}
                          ></div>
                          <div
                            className={styles.strengthBar}
                            style={{ background: passwordStrength.score >= 2 ? passwordStrength.color : '#252525' }}
                          ></div>
                          <div
                            className={styles.strengthBar}
                            style={{ background: passwordStrength.score >= 3 ? passwordStrength.color : '#252525' }}
                          ></div>
                          <div
                            className={styles.strengthBar}
                            style={{ background: passwordStrength.score >= 4 ? passwordStrength.color : '#252525' }}
                          ></div>
                        </div>
                        <div className={styles.strengthText} style={{ color: passwordStrength.color }}>
                          <span>Password Strength: {passwordStrength.label}</span>
                          <span style={{ fontSize: '0.72rem', color: '#7A7570' }}>Must have uppercase, lowercase, & number</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Confirm New Password</label>
                    <div className={styles.passwordInputWrapper}>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className={styles.formInput}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repeat new password"
                      />
                      <button
                        type="button"
                        className={styles.passwordToggleBtn}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? '👁' : '👁‍🗨'}
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 28 }}>
                  <button className={styles.btnGold} onClick={handleSavePassword} disabled={saving || !newPassword}>
                    {saving && <span className={styles.spinner}></span>}
                    Update Password
                  </button>
                </div>

                <div style={{ borderTop: '1px solid #252525', paddingTop: 24, marginTop: 12 }}>
                  <h5 style={{ fontSize: '0.95rem', color: '#E2C97E', marginBottom: 16 }}>Session & Device Management</h5>

                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        Session Timeout
                        <span className={styles.formHint}>Auto-logout after inactivity</span>
                      </label>
                      <select
                        className={styles.formSelect}
                        value={sessionTimeout}
                        onChange={(e) => setSessionTimeout(Number(e.target.value))}
                      >
                        <option value={15}>15 Minutes (High Security)</option>
                        <option value={30}>30 Minutes</option>
                        <option value={60}>1 Hour (Recommended)</option>
                        <option value={120}>2 Hours</option>
                        <option value={240}>4 Hours</option>
                        <option value={480}>8 Hours (Full Shift)</option>
                        <option value={1440}>24 Hours</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Logout from All Devices</label>
                      <button
                        className={styles.btnDanger}
                        style={{ height: 46 }}
                        onClick={() => setLogoutAllModalOpen(true)}
                      >
                        <span>🔒 Terminate All Sessions</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              3. SYSTEM SETTINGS
             ================================================================= */}
          {activeTab === 'system' && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardHeaderInfo}>
                  <h4>3. System Settings</h4>
                  <p>Define official municipal identity, contact info, office address, and default regional formats.</p>
                </div>
                <span className={styles.statusPill + ' ' + styles.statusSuccess}>Default Timezone: Asia/Manila</span>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>System Name</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      value={systemName}
                      onChange={(e) => setSystemName(e.target.value)}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Official Email</label>
                    <input
                      type="email"
                      className={styles.formInput}
                      value={officialEmail}
                      onChange={(e) => setOfficialEmail(e.target.value)}
                    />
                  </div>

                  <div className={styles.formGroup + ' ' + styles.formGridFull}>
                    <label className={styles.formLabel}>System Description</label>
                    <textarea
                      className={styles.formTextarea}
                      value={systemDescription}
                      onChange={(e) => setSystemDescription(e.target.value)}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Contact Number</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      value={sysContactNumber}
                      onChange={(e) => setSysContactNumber(e.target.value)}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Office Address</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      value={officeAddress}
                      onChange={(e) => setOfficeAddress(e.target.value)}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Time Zone</label>
                    <select
                      className={styles.formSelect}
                      value={timeZone}
                      onChange={(e) => setTimeZone(e.target.value)}
                    >
                      <option value="Asia/Manila">Asia/Manila (GMT+8) — Philippine Standard Time</option>
                      <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
                      <option value="Asia/Tokyo">Asia/Tokyo (GMT+9)</option>
                      <option value="UTC">Universal Coordinated Time (UTC)</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Date Format</label>
                    <select
                      className={styles.formSelect}
                      value={dateFormat}
                      onChange={(e) => setDateFormat(e.target.value)}
                    >
                      <option value="YYYY-MM-DD">YYYY-MM-DD (2026-09-08)</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY (09/08/2026)</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY (08/09/2026)</option>
                      <option value="MMMM D, YYYY">MMMM D, YYYY (September 8, 2026)</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Time Format</label>
                    <select
                      className={styles.formSelect}
                      value={timeFormat}
                      onChange={(e) => setTimeFormat(e.target.value)}
                    >
                      <option value="12-hour">12-Hour Format (e.g. 07:15 PM)</option>
                      <option value="24-hour">24-Hour Format (e.g. 19:15)</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className={styles.cardFooter}>
                <button className={styles.btnOutline} onClick={fetchInitialData} disabled={saving}>
                  Cancel
                </button>
                <button className={styles.btnGold} onClick={handleSaveSystemSettings} disabled={saving}>
                  {saving && <span className={styles.spinner}></span>}
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* =================================================================
              4. NOTIFICATION SETTINGS
             ================================================================= */}
          {activeTab === 'notifications' && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardHeaderInfo}>
                  <h4>4. Notification Settings</h4>
                  <p>Enable or disable automated system triggers and administrative alerts.</p>
                </div>
                <button
                  className={styles.btnOutline + ' ' + styles.btnSmall}
                  onClick={() => {
                    const allOn = !notifNewInquiry;
                    setNotifNewInquiry(allOn);
                    setNotifInquiryAccepted(allOn);
                    setNotifInquiryRejected(allOn);
                    setNotifPayment(allOn);
                    setNotifOverduePayment(allOn);
                    setNotifAnnouncement(allOn);
                    setNotifGraveLocator(allOn);
                    setNotifSystem(allOn);
                  }}
                >
                  Toggle All
                </button>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.toggleRow}>
                  <div className={styles.toggleInfo}>
                    <h5>New Inquiry Notifications</h5>
                    <p>Alert administrators whenever a family submits a new burial or plot inquiry.</p>
                  </div>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={notifNewInquiry}
                      onChange={(e) => setNotifNewInquiry(e.target.checked)}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>

                <div className={styles.toggleRow}>
                  <div className={styles.toggleInfo}>
                    <h5>Inquiry Accepted Notifications</h5>
                    <p>Trigger confirmation notifications when an inquiry is officially approved by MEEDO staff.</p>
                  </div>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={notifInquiryAccepted}
                      onChange={(e) => setNotifInquiryAccepted(e.target.checked)}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>

                <div className={styles.toggleRow}>
                  <div className={styles.toggleInfo}>
                    <h5>Inquiry Rejected Notifications</h5>
                    <p>Send formal notices with specified remarks when a plot or schedule request cannot be accommodated.</p>
                  </div>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={notifInquiryRejected}
                      onChange={(e) => setNotifInquiryRejected(e.target.checked)}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>

                <div className={styles.toggleRow}>
                  <div className={styles.toggleInfo}>
                    <h5>Payment Notifications</h5>
                    <p>Issue immediate official receipt acknowledgments upon logging a grave rent payment.</p>
                  </div>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={notifPayment}
                      onChange={(e) => setNotifPayment(e.target.checked)}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>

                <div className={styles.toggleRow}>
                  <div className={styles.toggleInfo}>
                    <h5>Overdue Payment Notifications</h5>
                    <p>Send automated renewal and overdue reminders for grave plots nearing lease expiration.</p>
                  </div>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={notifOverduePayment}
                      onChange={(e) => setNotifOverduePayment(e.target.checked)}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>

                <div className={styles.toggleRow}>
                  <div className={styles.toggleInfo}>
                    <h5>Announcement Notifications</h5>
                    <p>Broadcast municipal cemetery guidelines, All Saints' Day schedules, and public notices.</p>
                  </div>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={notifAnnouncement}
                      onChange={(e) => setNotifAnnouncement(e.target.checked)}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>

                <div className={styles.toggleRow}>
                  <div className={styles.toggleInfo}>
                    <h5>Grave Locator Notifications</h5>
                    <p>Generate alerts when public users request digital navigation assistance for a deceased relative.</p>
                  </div>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={notifGraveLocator}
                      onChange={(e) => setNotifGraveLocator(e.target.checked)}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>

                <div className={styles.toggleRow}>
                  <div className={styles.toggleInfo}>
                    <h5>System Notifications</h5>
                    <p>Receive administrative security warnings, failed login alerts, and backup completions.</p>
                  </div>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={notifSystem}
                      onChange={(e) => setNotifSystem(e.target.checked)}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>
              </div>
              <div className={styles.cardFooter}>
                <button className={styles.btnOutline} onClick={fetchInitialData} disabled={saving}>
                  Cancel
                </button>
                <button className={styles.btnGold} onClick={handleSaveNotifications} disabled={saving}>
                  {saving && <span className={styles.spinner}></span>}
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* =================================================================
              5. SMS SETTINGS
             ================================================================= */}
          {activeTab === 'sms' && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardHeaderInfo}>
                  <h4>5. SMS Settings</h4>
                  <p>Manage telco gateway dispatch (Globe, Smart, DITO) via Semaphore without exposing API keys.</p>
                </div>
                <span
                  className={`${styles.statusPill} ${
                    smsConfigured ? styles.statusSuccess : styles.statusWarning
                  }`}
                >
                  {smsConfigured ? 'Gateway Ready' : 'API Key Unconfigured in .env'}
                </span>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.toggleRow} style={{ paddingTop: 0 }}>
                  <div className={styles.toggleInfo}>
                    <h5>Enable SMS Notifications</h5>
                    <p>Global master switch for sending automated mobile SMS alerts to families and administrators.</p>
                  </div>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={smsEnabled}
                      onChange={(e) => setSmsEnabled(e.target.checked)}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>

                <div className={styles.formGrid} style={{ marginTop: 20 }}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>SMS Provider</label>
                    <select
                      className={styles.formSelect}
                      value={smsProvider}
                      onChange={(e) => setSmsProvider(e.target.value)}
                    >
                      <option value="Semaphore">Semaphore API (Philippines Telcos: Globe, Smart, DITO)</option>
                      <option value="Twilio">Twilio Global SMS</option>
                      <option value="Infobip">Infobip Enterprise</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Sender Name</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      value={smsSenderName}
                      onChange={(e) => setSmsSenderName(e.target.value)}
                      placeholder="e.g. SEMAPHORE or JASAAN_CMS"
                    />
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(200, 168, 75, 0.05)',
                    border: '1px solid rgba(200, 168, 75, 0.2)',
                    borderRadius: 10,
                    padding: 16,
                    marginTop: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 12,
                  }}
                >
                  <div>
                    <h5 style={{ color: '#E2C97E', fontSize: '0.9rem', marginBottom: 2 }}>Secure Server-Side Credentials</h5>
                    <p style={{ color: '#7A7570', fontSize: '0.8rem' }}>
                      Semaphore API keys are safely encrypted in your server environment (<code>SEMAPHORE_API_KEY</code>). They are never exposed to browser clients.
                    </p>
                  </div>
                  <button
                    className={styles.btnGold + ' ' + styles.btnSmall}
                    onClick={() => setTestSmsModalOpen(true)}
                  >
                    <span>💬 Test SMS Gateway</span>
                  </button>
                </div>
              </div>
              <div className={styles.cardFooter}>
                <button className={styles.btnOutline} onClick={fetchInitialData} disabled={saving}>
                  Cancel
                </button>
                <button className={styles.btnGold} onClick={handleSaveSmsSettings} disabled={saving}>
                  {saving && <span className={styles.spinner}></span>}
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* =================================================================
              6. EMAIL SETTINGS
             ================================================================= */}
          {activeTab === 'email' && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardHeaderInfo}>
                  <h4>6. Email Settings</h4>
                  <p>Configure transactional SMTP email dispatch (Gmail SMTP / Nodemailer) with hidden passwords.</p>
                </div>
                <span
                  className={`${styles.statusPill} ${
                    emailConfigured ? styles.statusSuccess : styles.statusWarning
                  }`}
                >
                  {emailConfigured ? 'SMTP Connected' : 'Credentials Unset in .env'}
                </span>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.toggleRow} style={{ paddingTop: 0 }}>
                  <div className={styles.toggleInfo}>
                    <h5>Enable Email Notifications</h5>
                    <p>Enable automated official emails for burial approvals, payment receipts, and announcements.</p>
                  </div>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={emailEnabled}
                      onChange={(e) => setEmailEnabled(e.target.checked)}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>

                <div className={styles.formGrid} style={{ marginTop: 20 }}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Sender Name</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      value={emailSenderName}
                      onChange={(e) => setEmailSenderName(e.target.value)}
                      placeholder="e.g. Jasaan Municipal Cemetery"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Sender Email Address</label>
                    <input
                      type="email"
                      className={styles.formInput}
                      value={emailSenderAddress}
                      onChange={(e) => setEmailSenderAddress(e.target.value)}
                      placeholder="admin@jasaan.gov.ph"
                    />
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(200, 168, 75, 0.05)',
                    border: '1px solid rgba(200, 168, 75, 0.2)',
                    borderRadius: 10,
                    padding: 16,
                    marginTop: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 12,
                  }}
                >
                  <div>
                    <h5 style={{ color: '#E2C97E', fontSize: '0.9rem', marginBottom: 2 }}>Secure SMTP Transport</h5>
                    <p style={{ color: '#7A7570', fontSize: '0.8rem' }}>
                      Nodemailer connects via secure TLS port 465. Passwords (<code>EMAIL_APP_PASSWORD</code>) are kept strictly server-side.
                    </p>
                  </div>
                  <button
                    className={styles.btnGold + ' ' + styles.btnSmall}
                    onClick={() => setTestEmailModalOpen(true)}
                  >
                    <span>✉️ Test Email Dispatch</span>
                  </button>
                </div>
              </div>
              <div className={styles.cardFooter}>
                <button className={styles.btnOutline} onClick={fetchInitialData} disabled={saving}>
                  Cancel
                </button>
                <button className={styles.btnGold} onClick={handleSaveEmailSettings} disabled={saving}>
                  {saving && <span className={styles.spinner}></span>}
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* =================================================================
              7. USER / MOBILE SETTINGS & MAINTENANCE MODE
             ================================================================= */}
          {activeTab === 'user_mobile' && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardHeaderInfo}>
                  <h4>7. User & Mobile Settings</h4>
                  <p>Control public citizen features, mobile application endpoints, and emergency maintenance lockouts.</p>
                </div>
                {maintenanceMode ? (
                  <span className={styles.statusPill + ' ' + styles.statusError}>Maintenance Active</span>
                ) : (
                  <span className={styles.statusPill + ' ' + styles.statusSuccess}>Public Access Online</span>
                )}
              </div>
              <div className={styles.cardBody}>
                {/* Maintenance Mode Box */}
                <div
                  style={{
                    background: maintenanceMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                    border: maintenanceMode ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid #252525',
                    borderRadius: 12,
                    padding: 20,
                    marginBottom: 24,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                    <div>
                      <h5 style={{ color: maintenanceMode ? '#f87171' : '#F0EDE6', fontSize: '1rem', marginBottom: 4 }}>
                        {maintenanceMode ? '⚠️ Maintenance Mode is ENABLED' : 'Maintenance Mode'}
                      </h5>
                      <p style={{ color: '#7A7570', fontSize: '0.84rem' }}>
                        When activated, public citizens and mobile users will be shown the maintenance screen below.
                      </p>
                    </div>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={maintenanceMode}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setMaintenanceModalOpen(true);
                          } else {
                            handleSaveUserMobileSettings(false);
                          }
                        }}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </div>

                  <div style={{ marginTop: 16 }}>
                    <label className={styles.formLabel}>Configured Maintenance Message</label>
                    <textarea
                      className={styles.formTextarea}
                      value={maintenanceMessage}
                      onChange={(e) => setMaintenanceMessage(e.target.value)}
                      placeholder="Message displayed to public and mobile users during maintenance..."
                    />
                  </div>
                </div>

                <h5 style={{ fontSize: '0.95rem', color: '#E2C97E', marginBottom: 12 }}>Feature Access Controls</h5>

                <div className={styles.toggleRow}>
                  <div className={styles.toggleInfo}>
                    <h5>Enable User Access</h5>
                    <p>Permit citizens to browse the public portal, view municipal announcements, and look up records.</p>
                  </div>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={userAccessEnabled}
                      onChange={(e) => setUserAccessEnabled(e.target.checked)}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>

                <div className={styles.toggleRow}>
                  <div className={styles.toggleInfo}>
                    <h5>Enable Mobile App Access</h5>
                    <p>Allow the React Native / Expo Cemetery Management mobile app to sync with the backend API.</p>
                  </div>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={mobileAppEnabled}
                      onChange={(e) => setMobileAppEnabled(e.target.checked)}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>

                <div className={styles.toggleRow}>
                  <div className={styles.toggleInfo}>
                    <h5>Enable Online Inquiries</h5>
                    <p>Allow families to submit online booking, grave lot acquisition, and interment schedule inquiries.</p>
                  </div>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={inquiriesEnabled}
                      onChange={(e) => setInquiriesEnabled(e.target.checked)}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>

                <div className={styles.toggleRow}>
                  <div className={styles.toggleInfo}>
                    <h5>Enable Public Announcements</h5>
                    <p>Publish cemetery advisories, visiting hour rules, and municipal cemetery ordinances publicly.</p>
                  </div>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={announcementsEnabled}
                      onChange={(e) => setAnnouncementsEnabled(e.target.checked)}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>

                <div className={styles.toggleRow}>
                  <div className={styles.toggleInfo}>
                    <h5>Enable Grave Locator & Mapping</h5>
                    <p>Allow public interactive map browsing, GPS grave navigation, and section searches.</p>
                  </div>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={graveLocatorEnabled}
                      onChange={(e) => setGraveLocatorEnabled(e.target.checked)}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>
              </div>
              <div className={styles.cardFooter}>
                <button className={styles.btnOutline} onClick={fetchInitialData} disabled={saving}>
                  Cancel
                </button>
                <button
                  className={styles.btnGold}
                  onClick={() => handleSaveUserMobileSettings()}
                  disabled={saving}
                >
                  {saving && <span className={styles.spinner}></span>}
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* =================================================================
              8. APPEARANCE
             ================================================================= */}
          {activeTab === 'appearance' && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardHeaderInfo}>
                  <h4>8. Appearance</h4>
                  <p>Customize the administrative dashboard color theme, sidebar layout, and display density.</p>
                </div>
                <span className={styles.statusPill + ' ' + styles.statusSuccess}>Current: {theme.toUpperCase()}</span>
              </div>
              <div className={styles.cardBody}>
                <h5 style={{ fontSize: '0.95rem', color: '#E2C97E', marginBottom: 16 }}>Dashboard Theme</h5>
                <div className={styles.themeGrid}>
                  <button
                    className={`${styles.themeCard} ${theme === 'dark' ? styles.themeCardActive : ''}`}
                    onClick={() => handleSaveAppearance('dark')}
                  >
                    <span className={styles.themeCardIcon}>🌙</span>
                    <span className={styles.themeCardTitle}>Dark Mode</span>
                    <span className={styles.themeCardSub}>Signature Gold & Dark Slate</span>
                  </button>

                  <button
                    className={`${styles.themeCard} ${theme === 'light' ? styles.themeCardActive : ''}`}
                    onClick={() => handleSaveAppearance('light')}
                  >
                    <span className={styles.themeCardIcon}>☀️</span>
                    <span className={styles.themeCardTitle}>Light Mode</span>
                    <span className={styles.themeCardSub}>Clean & High-Contrast Daylight</span>
                  </button>

                  <button
                    className={`${styles.themeCard} ${theme === 'system' ? styles.themeCardActive : ''}`}
                    onClick={() => {
                      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                      handleSaveAppearance(prefersDark ? 'dark' : 'light');
                    }}
                  >
                    <span className={styles.themeCardIcon}>💻</span>
                    <span className={styles.themeCardTitle}>System Default</span>
                    <span className={styles.themeCardSub}>Matches OS Display Preferences</span>
                  </button>
                </div>

                <div style={{ borderTop: '1px solid #252525', paddingTop: 24, marginTop: 24 }}>
                  <h5 style={{ fontSize: '0.95rem', color: '#E2C97E', marginBottom: 16 }}>Layout & Density</h5>

                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Sidebar Behavior</label>
                      <select
                        className={styles.formSelect}
                        value={sidebarBehavior}
                        onChange={(e) => handleSaveAppearance(theme, e.target.value, layoutDensity)}
                      >
                        <option value="expanded">Expanded Default (Icons + Titles)</option>
                        <option value="collapsed">Compact Rail (Icons Only)</option>
                        <option value="auto">Auto-collapse on Smaller Screens</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Layout Density</label>
                      <select
                        className={styles.formSelect}
                        value={layoutDensity}
                        onChange={(e) => handleSaveAppearance(theme, sidebarBehavior, e.target.value)}
                      >
                        <option value="normal">Normal (Comfortable Spacing)</option>
                        <option value="compact">Compact (High-Density Tables)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              9. SYSTEM PREFERENCES
             ================================================================= */}
          {activeTab === 'preferences' && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardHeaderInfo}>
                  <h4>9. System Preferences</h4>
                  <p>Fine-tune pagination sizes, default landing views, languages, and regional time standards.</p>
                </div>
                <span className={styles.statusPill + ' ' + styles.statusSuccess}>Configured</span>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Records Per Page</label>
                    <select
                      className={styles.formSelect}
                      value={itemsPerPage}
                      onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    >
                      <option value={10}>10 items</option>
                      <option value={25}>25 items (Recommended)</option>
                      <option value={50}>50 items</option>
                      <option value={100}>100 items (High Density)</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Default Dashboard Page</label>
                    <select
                      className={styles.formSelect}
                      value={defaultDashboardPage}
                      onChange={(e) => setDefaultDashboardPage(e.target.value)}
                    >
                      <option value="/admin/cemetery-overview">Cemetery Overview (Analytics)</option>
                      <option value="/admin/deceased-information">Deceased Information</option>
                      <option value="/admin/inquiries">Inquiries Management</option>
                      <option value="/admin/grave-mapping">Grave Mapping</option>
                      <option value="/admin/payment-records">Payment Records</option>
                      <option value="/admin/announcements">Announcements</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>System Language</label>
                    <select
                      className={styles.formSelect}
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                    >
                      <option value="English">English (United States / Philippines)</option>
                      <option value="Filipino">Filipino / Tagalog</option>
                      <option value="Cebuano">Cebuano / Bisaya (Northern Mindanao)</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Preferred Date Format</label>
                    <select
                      className={styles.formSelect}
                      value={dateFormat}
                      onChange={(e) => setDateFormat(e.target.value)}
                    >
                      <option value="YYYY-MM-DD">YYYY-MM-DD (2026-09-08)</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY (09/08/2026)</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY (08/09/2026)</option>
                      <option value="MMMM D, YYYY">MMMM D, YYYY (September 8, 2026)</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Preferred Time Format</label>
                    <select
                      className={styles.formSelect}
                      value={timeFormat}
                      onChange={(e) => setTimeFormat(e.target.value)}
                    >
                      <option value="12-hour">12-Hour Format (hh:mm A)</option>
                      <option value="24-hour">24-Hour Format (HH:mm)</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>System Time Zone</label>
                    <select
                      className={styles.formSelect}
                      value={timeZone}
                      onChange={(e) => setTimeZone(e.target.value)}
                    >
                      <option value="Asia/Manila">Asia/Manila (GMT+8) — Default</option>
                      <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
                      <option value="UTC">UTC (Universal Coordinated Time)</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className={styles.cardFooter}>
                <button className={styles.btnOutline} onClick={fetchInitialData} disabled={saving}>
                  Cancel
                </button>
                <button className={styles.btnGold} onClick={handleSavePreferences} disabled={saving}>
                  {saving && <span className={styles.spinner}></span>}
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* =================================================================
              10. DATA & BACKUP
             ================================================================= */}
          {activeTab === 'backup' && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardHeaderInfo}>
                  <h4>10. Data & Backup</h4>
                  <p>Generate encrypted, structured JSON snapshots of deceased records, payments, inquiries, and audit logs.</p>
                </div>
                <span className={styles.statusPill + ' ' + styles.statusSuccess}>
                  Status: {backupStatus}
                </span>
              </div>
              <div className={styles.cardBody}>
                {/* Last Backup Details */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: 16,
                    marginBottom: 24,
                  }}
                >
                  <div className={styles.aboutItem}>
                    <div className={styles.aboutLabel}>Last Backup Executed</div>
                    <div className={styles.aboutValue}>{lastBackupAt || 'No manual backup on record'}</div>
                  </div>

                  <div className={styles.aboutItem}>
                    <div className={styles.aboutLabel}>Latest Backup Archive</div>
                    <div className={styles.aboutValue} style={{ fontSize: '0.85rem', wordBreak: 'break-all' }}>
                      {lastBackupFile || 'None generated'}
                    </div>
                  </div>

                  <div className={styles.aboutItem}>
                    <div className={styles.aboutLabel}>Backup Integrity Verification</div>
                    <div className={styles.aboutValue} style={{ color: '#4ade80' }}>
                      ✓ SHA-256 Checksum Engine Active
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(200, 168, 75, 0.05)',
                    border: '1px solid rgba(200, 168, 75, 0.25)',
                    borderRadius: 12,
                    padding: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 16,
                    marginBottom: 28,
                  }}
                >
                  <div>
                    <h5 style={{ color: '#E2C97E', fontSize: '1rem', marginBottom: 4 }}>Manual System Backup</h5>
                    <p style={{ color: '#7A7570', fontSize: '0.84rem' }}>
                      Generates a full snapshot of all active tables and prompts an immediate file download.
                    </p>
                  </div>
                  <button
                    className={styles.btnGold}
                    onClick={() => setBackupModalOpen(true)}
                    disabled={runningBackup}
                  >
                    <span>💾 Generate Manual Backup Now</span>
                  </button>
                </div>

                {/* Automated Backup Settings */}
                <h5 style={{ fontSize: '0.95rem', color: '#E2C97E', marginBottom: 16 }}>Automated Backup Schedule</h5>

                <div className={styles.toggleRow} style={{ paddingTop: 0 }}>
                  <div className={styles.toggleInfo}>
                    <h5>Enable Automated Daily Backups</h5>
                    <p>Automate background system snapshots and record retention archiving.</p>
                  </div>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={autoBackupEnabled}
                      onChange={(e) => setAutoBackupEnabled(e.target.checked)}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>

                <div className={styles.formGrid} style={{ marginTop: 16 }}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Backup Frequency</label>
                    <select
                      className={styles.formSelect}
                      value={backupFrequency}
                      onChange={(e) => setBackupFrequency(e.target.value)}
                    >
                      <option value="Daily">Daily at 00:00 (Asia/Manila)</option>
                      <option value="Weekly">Weekly on Sunday at 02:00</option>
                      <option value="Monthly">Monthly on the 1st day at 03:00</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className={styles.cardFooter}>
                <button className={styles.btnOutline} onClick={fetchInitialData} disabled={saving}>
                  Cancel
                </button>
                <button className={styles.btnGold} onClick={handleSaveBackupSchedule} disabled={saving}>
                  {saving && <span className={styles.spinner}></span>}
                  Save Schedule
                </button>
              </div>
            </div>
          )}

          {/* =================================================================
              11. AUDIT & ACTIVITY
             ================================================================= */}
          {activeTab === 'audit' && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardHeaderInfo}>
                  <h4>11. Audit & Activity Log</h4>
                  <p>Track administrator logins, configuration changes, password updates, and backup events.</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    className={styles.btnOutline + ' ' + styles.btnSmall}
                    onClick={() => fetchAuditLogs(1)}
                    disabled={loadingAudit}
                  >
                    🔄 Refresh
                  </button>
                  <button
                    className={styles.btnDanger + ' ' + styles.btnSmall}
                    onClick={() => setClearAuditModalOpen(true)}
                  >
                    Clear Logs
                  </button>
                </div>
              </div>
              <div className={styles.cardBody}>
                {/* Filter and Search Bar */}
                <div className={styles.auditFilterBar}>
                  <input
                    type="text"
                    className={styles.auditSearchInput}
                    placeholder="Search by activity description, administrator, or details..."
                    value={auditSearch}
                    onChange={(e) => {
                      setAuditSearch(e.target.value);
                      fetchAuditLogs(1, auditCategory, e.target.value);
                    }}
                  />

                  <select
                    className={styles.auditCategorySelect}
                    value={auditCategory}
                    onChange={(e) => {
                      setAuditCategory(e.target.value);
                      fetchAuditLogs(1, e.target.value, auditSearch);
                    }}
                  >
                    <option value="ALL">All Categories ({auditCount})</option>
                    <option value="LOGIN">Logins</option>
                    <option value="LOGOUT">Logouts</option>
                    <option value="SETTINGS_CHANGED">Settings Changed</option>
                    <option value="PASSWORD_CHANGED">Password Changed</option>
                    <option value="NOTIFICATION_SETTINGS_CHANGED">Notification Settings</option>
                    <option value="SYSTEM_CONFIG_CHANGED">System Config</option>
                    <option value="BACKUP">Backups</option>
                  </select>
                </div>

                {/* Audit Logs Table */}
                <div className={styles.tableWrapper}>
                  <table className={styles.auditTable}>
                    <thead>
                      <tr>
                        <th>Activity</th>
                        <th>Administrator</th>
                        <th>Date / Time</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadingAudit ? (
                        <tr>
                          <td colSpan={4} style={{ textAlign: 'center', padding: 30, color: '#7A7570' }}>
                            Loading audit history…
                          </td>
                        </tr>
                      ) : auditLogs.length === 0 ? (
                        <tr>
                          <td colSpan={4} style={{ textAlign: 'center', padding: 30, color: '#7A7570' }}>
                            No audit activity records found matching your filters.
                          </td>
                        </tr>
                      ) : (
                        auditLogs.map((log) => (
                          <tr key={log.id}>
                            <td>
                              <div className={styles.auditActivityCell}>{log.activity}</div>
                              {log.details && <div className={styles.auditDetailsSub}>{log.details}</div>}
                            </td>
                            <td style={{ whiteSpace: 'nowrap' }}>{log.admin}</td>
                            <td style={{ whiteSpace: 'nowrap', color: '#a19a8e' }}>{formatTimestamp(log.createdAt)}</td>
                            <td>
                              <span
                                className={`${styles.statusPill} ${
                                  log.status === 'Success'
                                    ? styles.statusSuccess
                                    : log.status === 'Warning'
                                    ? styles.statusWarning
                                    : styles.statusError
                                }`}
                              >
                                {log.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {auditTotalPages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                    <span style={{ fontSize: '0.8rem', color: '#7A7570' }}>
                      Showing Page {auditPage} of {auditTotalPages} ({auditCount} total records)
                    </span>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        className={styles.btnOutline + ' ' + styles.btnSmall}
                        disabled={auditPage <= 1}
                        onClick={() => fetchAuditLogs(auditPage - 1)}
                      >
                        Previous
                      </button>
                      <button
                        className={styles.btnOutline + ' ' + styles.btnSmall}
                        disabled={auditPage >= auditTotalPages}
                        onClick={() => fetchAuditLogs(auditPage + 1)}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =================================================================
              12. ABOUT SYSTEM
             ================================================================= */}
          {activeTab === 'about' && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardHeaderInfo}>
                  <h4>12. About System</h4>
                  <p>Official software specifications, licensing, municipal engineering, and runtime environment.</p>
                </div>
                <span className={styles.statusPill + ' ' + styles.statusSuccess}>Version 2.4.0 (Build 2026.09)</span>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.aboutGrid}>
                  <div className={styles.aboutItem}>
                    <div className={styles.aboutLabel}>System Name</div>
                    <div className={styles.aboutValue}>Web and Mobile-based Cemetery Management System</div>
                  </div>

                  <div className={styles.aboutItem}>
                    <div className={styles.aboutLabel}>System Version</div>
                    <div className={styles.aboutValue}>v2.4.0 (Production Release)</div>
                  </div>

                  <div className={styles.aboutItem}>
                    <div className={styles.aboutLabel}>Developer / Development Team</div>
                    <div className={styles.aboutValue}>MEEDO Cemetery IT Engineering & Systems Office</div>
                  </div>

                  <div className={styles.aboutItem}>
                    <div className={styles.aboutLabel}>Municipality</div>
                    <div className={styles.aboutValue}>Municipality of Jasaan, Misamis Oriental, 9003, Philippines</div>
                  </div>

                  <div className={styles.aboutItem} style={{ gridColumn: '1 / -1' }}>
                    <div className={styles.aboutLabel}>Technology Stack</div>
                    <div className={styles.techPills}>
                      <span className={styles.techPill}>Next.js 16 (App Router)</span>
                      <span className={styles.techPill}>React 19</span>
                      <span className={styles.techPill}>TypeScript 5.9</span>
                      <span className={styles.techPill}>Prisma ORM 5.22</span>
                      <span className={styles.techPill}>PostgreSQL (Supabase)</span>
                      <span className={styles.techPill}>Semaphore SMS API (PH)</span>
                      <span className={styles.techPill}>Nodemailer (Gmail SMTP)</span>
                      <span className={styles.techPill}>Vanilla CSS Modules</span>
                      <span className={styles.techPill}>Scrypt Key Derivation</span>
                    </div>
                  </div>

                  <div className={styles.aboutItem} style={{ gridColumn: '1 / -1' }}>
                    <div className={styles.aboutLabel}>Copyright & Intellectual Property</div>
                    <div className={styles.aboutValue}>
                      © 2026 Municipality of Jasaan. All rights reserved. Authorized municipal use only.
                    </div>
                  </div>
                </div>

                {/* Health Checks */}
                <div style={{ marginTop: 24, borderTop: '1px solid #252525', paddingTop: 20 }}>
                  <h5 style={{ fontSize: '0.9rem', color: '#E2C97E', marginBottom: 12 }}>Live System Status</h5>
                  <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                    <span className={styles.statusPill + ' ' + styles.statusSuccess}>
                      <span className={styles.systemBadgeDot} style={{ width: 6, height: 6 }}></span>
                      PostgreSQL Connection: Healthy
                    </span>
                    <span
                      className={`${styles.statusPill} ${
                        smsConfigured ? styles.statusSuccess : styles.statusWarning
                      }`}
                    >
                      <span
                        className={styles.systemBadgeDot}
                        style={{ width: 6, height: 6, background: smsConfigured ? '#22c55e' : '#facc15' }}
                      ></span>
                      Semaphore SMS Service: {smsConfigured ? 'Operational' : 'Set Key in .env'}
                    </span>
                    <span
                      className={`${styles.statusPill} ${
                        emailConfigured ? styles.statusSuccess : styles.statusWarning
                      }`}
                    >
                      <span
                        className={styles.systemBadgeDot}
                        style={{ width: 6, height: 6, background: emailConfigured ? '#22c55e' : '#facc15' }}
                      ></span>
                      SMTP Mailer: {emailConfigured ? 'Ready' : 'Set Credentials in .env'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* =====================================================================
          CONFIRMATION MODALS
         ===================================================================== */}

      {/* 1. Test SMS Modal */}
      {testSmsModalOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h4>Test SMS Gateway Dispatch</h4>
              <button className={styles.modalCloseBtn} onClick={() => setTestSmsModalOpen(false)}>
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <p style={{ marginBottom: 14 }}>
                Send a real test notification through Semaphore to verify Philippine telco routing.
              </p>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Target Mobile Number</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={testSmsPhone}
                  onChange={(e) => setTestSmsPhone(e.target.value)}
                  placeholder="09171234567"
                />
                <span className={styles.formHint}>Use 11-digit format starting with 09 (Globe, Smart, DITO, TNT, TM).</span>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.btnOutline}
                onClick={() => setTestSmsModalOpen(false)}
                disabled={testingSms}
              >
                Cancel
              </button>
              <button className={styles.btnGold} onClick={handleSendTestSms} disabled={testingSms}>
                {testingSms && <span className={styles.spinner}></span>}
                Send Test SMS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Test Email Modal */}
      {testEmailModalOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h4>Test SMTP Email Dispatch</h4>
              <button className={styles.modalCloseBtn} onClick={() => setTestEmailModalOpen(false)}>
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <p style={{ marginBottom: 14 }}>
                Send a branded HTML verification email through your configured Gmail SMTP server.
              </p>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Target Recipient Email</label>
                <input
                  type="email"
                  className={styles.formInput}
                  value={testEmailAddress}
                  onChange={(e) => setTestEmailAddress(e.target.value)}
                  placeholder="admin@jasaan.gov.ph"
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.btnOutline}
                onClick={() => setTestEmailModalOpen(false)}
                disabled={testingEmail}
              >
                Cancel
              </button>
              <button className={styles.btnGold} onClick={handleSendTestEmail} disabled={testingEmail}>
                {testingEmail && <span className={styles.spinner}></span>}
                Send Test Email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Manual Backup Confirmation Modal */}
      {backupModalOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h4>Confirm Manual Database Backup</h4>
              <button className={styles.modalCloseBtn} onClick={() => setBackupModalOpen(false)}>
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>
                You are about to export a full database snapshot including all <strong>deceased records</strong>, <strong>payments</strong>, <strong>inquiries</strong>, and <strong>audit logs</strong>.
              </p>
              <p style={{ marginTop: 10, color: '#E2C97E' }}>
                The archive will be downloaded directly to your local computer as a verified JSON bundle with an SHA-256 integrity checksum.
              </p>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.btnOutline}
                onClick={() => setBackupModalOpen(false)}
                disabled={runningBackup}
              >
                Cancel
              </button>
              <button className={styles.btnGold} onClick={handleExecuteBackup} disabled={runningBackup}>
                {runningBackup && <span className={styles.spinner}></span>}
                Execute Backup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Logout All Devices Modal */}
      {logoutAllModalOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h4>Terminate All Active Sessions?</h4>
              <button className={styles.modalCloseBtn} onClick={() => setLogoutAllModalOpen(false)}>
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>
                Are you sure you want to log out from all devices? This will invalidate all active browser sessions and require re-authentication.
              </p>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.btnOutline}
                onClick={() => setLogoutAllModalOpen(false)}
                disabled={saving}
              >
                Cancel
              </button>
              <button className={styles.btnDanger} onClick={handleConfirmLogoutAll} disabled={saving}>
                {saving && <span className={styles.spinner}></span>}
                Terminate All Sessions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Maintenance Mode Confirmation Modal */}
      {maintenanceModalOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h4 style={{ color: '#f87171' }}>Activate Maintenance Mode?</h4>
              <button className={styles.modalCloseBtn} onClick={() => setMaintenanceModalOpen(false)}>
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>
                Enabling Maintenance Mode will immediately display the maintenance screen to public citizens and mobile app users.
              </p>
              <p style={{ marginTop: 10, color: '#fca5a5' }}>
                Only authorized administrators will be able to access the admin portal during maintenance.
              </p>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.btnOutline}
                onClick={() => setMaintenanceModalOpen(false)}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                className={styles.btnDanger}
                onClick={() => handleSaveUserMobileSettings(true)}
                disabled={saving}
              >
                {saving && <span className={styles.spinner}></span>}
                Activate Maintenance Mode
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Clear Audit Logs Confirmation Modal */}
      {clearAuditModalOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h4 style={{ color: '#f87171' }}>Clear Audit Activity History?</h4>
              <button className={styles.modalCloseBtn} onClick={() => setClearAuditModalOpen(false)}>
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>
                This action will delete all recorded administrative activity logs from the database. A single audit entry recording the clearance will be preserved.
              </p>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.btnOutline}
                onClick={() => setClearAuditModalOpen(false)}
                disabled={saving}
              >
                Cancel
              </button>
              <button className={styles.btnDanger} onClick={handleClearAuditLogs} disabled={saving}>
                {saving && <span className={styles.spinner}></span>}
                Confirm Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
