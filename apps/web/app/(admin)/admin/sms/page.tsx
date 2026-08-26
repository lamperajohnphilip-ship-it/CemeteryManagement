'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import styles from './page.module.css';
import {
  sendSmsNotification,
  sendBulkSmsNotification,
  getSmsHistory,
  getSmsStats,
  deleteSmsLog,
} from '../../../actions/sms';
import {
  normalizePhilippineNumber,
  isValidPhilippineNumber,
  calculateSmsSegments,
} from '../../../../lib/sms-utils';
import { getPaymentRecords } from '../../../actions/payments';
import { getInquiries } from '../../../actions/inquiry';


interface SmsLogItem {
  id: string;
  recipient: string;
  recipientName?: string | null;
  message: string;
  semaphoreId?: string | null;
  status: string;
  type?: string | null;
  senderName?: string | null;
  sentBy?: string | null;
  errorMessage?: string | null;
  createdAt: string | Date;
}

interface PayorRecipient {
  id: string;
  name: string;
  phone: string;
  deceased: string;
  amount: number;
  balance: number;
  dueDate: string;
  status: string;
}

const TEMPLATES: Record<string, { label: string; icon: string; text: string }> = {
  INQUIRY_APPROVED: {
    label: 'Inquiry Approved',
    icon: '✅',
    text: 'Good day {recipient_name}, your cemetery inquiry (Ref: {app_id}) has been APPROVED by the Municipality of Jasaan Cemetery Management Office. Please visit our office on your scheduled date ({burial_date} at {burial_time}). Thank you.',
  },
  INQUIRY_REJECTED: {
    label: 'Inquiry Not Approved',
    icon: '⚠️',
    text: 'Good day {recipient_name}, regarding your cemetery inquiry (Ref: {app_id}): your request could not be approved at this time. Please contact or visit the Jasaan Cemetery Office during business hours for assistance.',
  },
  GRAVE_RESERVATION: {
    label: 'Grave Reservation Approved',
    icon: '🏛️',
    text: 'Dear {recipient_name}, your grave reservation for {deceased_name} has been APPROVED. Plot/Block: {plot_number}. Scheduled Date: {burial_date}. Municipality of Jasaan Cemetery Office.',
  },
  BURIAL_CONFIRMATION: {
    label: 'Burial Record Confirmed',
    icon: '📋',
    text: 'Dear {recipient_name}, the burial record for {deceased_name} has been officially recorded in the Jasaan Municipal Cemetery registry. Thank you.',
  },
  PAYMENT_RECEIVED: {
    label: 'Payment Received',
    icon: '💰',
    text: 'OFFICIAL RECEIPT: Payment of ₱{amount_paid} for the account of {deceased_name} has been received. Remaining Balance: ₱{balance}. Ref: {ref_no}. Municipality of Jasaan Cemetery.',
  },
  PAYMENT_REMINDER: {
    label: 'Payment Reminder',
    icon: '🔔',
    text: 'Good day, {recipient_name}. This is a friendly reminder regarding the cemetery maintenance/rental payment for {deceased_name}. Outstanding Balance: ₱{balance}, Due Date: {due_date}. Please settle at the Municipal Office. - Jasaan Cemetery',
  },
  ANNOUNCEMENT: {
    label: 'Important Announcement',
    icon: '📣',
    text: 'IMPORTANT NOTICE from Municipality of Jasaan Cemetery: Clean-up and visiting schedules will be observed this week. Please ensure grave sites are maintained respectfully. Thank you.',
  },
  CUSTOM: {
    label: 'Custom Message',
    icon: '✍️',
    text: '',
  },
};

const VARIABLE_TAGS = [
  '{recipient_name}',
  '{deceased_name}',
  '{plot_number}',
  '{burial_date}',
  '{burial_time}',
  '{amount_paid}',
  '{balance}',
  '{due_date}',
  '{app_id}',
  '{ref_no}',
];

export default function SMSNotificationsPage() {
  // Navigation tabs: 'composer' | 'bulk' | 'history'
  const [activeTab, setActiveTab] = useState<'composer' | 'bulk' | 'history'>('composer');

  // Live Stats
  const [stats, setStats] = useState({
    total: 0,
    delivered: 0,
    queued: 0,
    failed: 0,
    todayCount: 0,
  });

  // Single SMS Composer State
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<string>('CUSTOM');
  const [messageBody, setMessageBody] = useState('');
  const [selectedContext, setSelectedContext] = useState<Record<string, string>>({
    recipient_name: '',
    deceased_name: 'Juan Dela Cruz',
    plot_number: 'Block 2, Plot 14',
    burial_date: 'March 15, 2026',
    burial_time: '9:00 AM',
    amount_paid: '500',
    balance: '1,500',
    due_date: 'March 30, 2026',
    app_id: 'INQ-20260301-8841',
    ref_no: 'PAY-20260301-1029',
  });

  // Bulk SMS State
  const [payorRecipients, setPayorRecipients] = useState<PayorRecipient[]>([]);
  const [bulkFilterStatus, setBulkFilterStatus] = useState('all');
  const [bulkSearch, setBulkSearch] = useState('');
  const [selectedRecipientIds, setSelectedRecipientIds] = useState<Set<string>>(new Set());
  const [bulkTemplateKey, setBulkTemplateKey] = useState<string>('PAYMENT_REMINDER');
  const [bulkMessageBody, setBulkMessageBody] = useState(TEMPLATES.PAYMENT_REMINDER?.text || '');

  // SMS History State
  const [historyLogs, setHistoryLogs] = useState<SmsLogItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyTotalPages, setHistoryTotalPages] = useState(1);
  const [historyTotalCount, setHistoryTotalCount] = useState(0);
  const [historySearch, setHistorySearch] = useState('');
  const [historyStatusFilter, setHistoryStatusFilter] = useState('all');
  const [historyTypeFilter, setHistoryTypeFilter] = useState('all');

  // Modals & Feedback
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showBulkConfirmModal, setShowBulkConfirmModal] = useState(false);
  const [viewDetailsLog, setViewDetailsLog] = useState<SmsLogItem | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [alertFeedback, setAlertFeedback] = useState<{
    type: 'success' | 'error' | 'warning';
    title: string;
    message: string;
    messageId?: string;
  } | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bulkTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Load initial stats, history, and recipient candidates on mount
  useEffect(() => {
    loadAllData();
  }, []);

  // Reload history whenever search, filters, or page changes
  useEffect(() => {
    if (activeTab === 'history') {
      fetchHistory();
    }
  }, [historyPage, historyStatusFilter, historyTypeFilter]);

  const loadAllData = async () => {
    fetchStats();
    fetchHistory();
    fetchPayors();
  };

  const fetchStats = async () => {
    const res = await getSmsStats();
    if (res.success && res.stats) {
      setStats(res.stats);
    }
  };

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await getSmsHistory({
        page: historyPage,
        limit: 10,
        search: historySearch,
        status: historyStatusFilter,
        type: historyTypeFilter,
      });

      if (res.success && res.records) {
        setHistoryLogs(res.records);
        setHistoryTotalPages(res.pagination?.totalPages || 1);
        setHistoryTotalCount(res.pagination?.total || 0);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const fetchPayors = async () => {
    try {
      const [payRes, inqRes] = await Promise.all([getPaymentRecords(), getInquiries()]);
      const list: PayorRecipient[] = [];

      if (payRes.success && Array.isArray(payRes.records)) {
        payRes.records.forEach((p: any) => {
          const phone = p.CONTACT_NO || p.deceasedRecord?.CONTACT_NO || '';
          if (phone) {
            list.push({
              id: `pay-${p.id}`,
              name: p.PAYORS_NAME || 'Unknown Payor',
              phone: phone,
              deceased: p.NAME_OF_DECEASED || 'Deceased',
              amount: p.TOTAL_DUE || 0,
              balance: p.BALANCE || 0,
              dueDate: p.DUE_DATE || 'N/A',
              status: (p.STATUS || 'pending').toLowerCase(),
            });
          }
        });
      }

      if (inqRes.success && Array.isArray(inqRes.records)) {
        inqRes.records.forEach((inq: any) => {
          if (inq.CONTACT) {
            list.push({
              id: `inq-${inq.id}`,
              name: inq.FAMILY_NAME || 'Applicant',
              phone: inq.CONTACT,
              deceased: inq.DECEASED || 'N/A',
              amount: 0,
              balance: 0,
              dueDate: inq.BURIAL_DATE ? new Date(inq.BURIAL_DATE).toLocaleDateString() : 'N/A',
              status: (inq.STATUS || 'pending').toLowerCase(),
            });
          }
        });
      }

      setPayorRecipients(list);
    } catch (err) {
      console.warn('Could not load recipient payors:', err);
    }
  };

  // Interpolates dynamic variables in templates
  const interpolateMessage = (text: string, ctx: Record<string, string>) => {
    let result = text;
    Object.entries(ctx).forEach(([key, val]) => {
      const regex = new RegExp(`{${key}}`, 'g');
      result = result.replace(regex, val || `{${key}}`);
    });
    return result;
  };

  // Live preview text with current variable values
  const previewText = useMemo(() => {
    const ctx = {
      ...selectedContext,
      recipient_name: recipientName || 'Citizen',
    };
    return interpolateMessage(messageBody, ctx);
  }, [messageBody, recipientName, selectedContext]);

  // Segment calculation for single SMS
  const segmentInfo = useMemo(() => {
    return calculateSmsSegments(previewText);
  }, [previewText]);

  // Handle template selection
  const handleSelectTemplate = (key: string) => {
    setSelectedTemplateKey(key);
    const tpl = TEMPLATES[key];
    if (tpl) {
      setMessageBody(tpl.text);
    }
  };

  // Insert variable into message textarea at cursor
  const handleInsertVariable = (variable: string, isBulk: boolean = false) => {
    const ref = isBulk ? bulkTextareaRef.current : textareaRef.current;
    if (ref) {
      const start = ref.selectionStart || 0;
      const end = ref.selectionEnd || 0;
      const current = isBulk ? bulkMessageBody : messageBody;
      const updated = current.substring(0, start) + variable + current.substring(end);

      if (isBulk) {
        setBulkMessageBody(updated);
      } else {
        setMessageBody(updated);
      }

      setTimeout(() => {
        if (ref) {
          ref.focus();
          ref.setSelectionRange(start + variable.length, start + variable.length);
        }
      }, 0);
    }
  };

  // Clear single composer
  const handleClearComposer = () => {
    setRecipientPhone('');
    setRecipientName('');
    setMessageBody('');
    setSelectedTemplateKey('CUSTOM');
    setAlertFeedback(null);
  };

  // Send Single SMS
  const handleSendSingleSms = async () => {
    if (!recipientPhone.trim()) {
      setAlertFeedback({
        type: 'error',
        title: 'Recipient Required',
        message: 'Please enter a valid Philippine mobile number (e.g. 09171234567).',
      });
      return;
    }

    if (!isValidPhilippineNumber(recipientPhone)) {
      setAlertFeedback({
        type: 'error',
        title: 'Invalid Mobile Number',
        message: `"${recipientPhone}" is not a valid 11-digit Philippine mobile number starting with 09.`,
      });
      return;
    }

    if (!messageBody.trim()) {
      setAlertFeedback({
        type: 'error',
        title: 'Message Required',
        message: 'Please enter message text or select a template before sending.',
      });
      return;
    }

    setIsSending(true);
    setShowConfirmModal(false);
    setAlertFeedback(null);

    try {
      const normalized = normalizePhilippineNumber(recipientPhone);
      const res = await sendSmsNotification({
        recipient: normalized,
        recipientName: recipientName.trim() || undefined,
        message: previewText,
        type: selectedTemplateKey,
        sentBy: 'Admin Superuser',
      });

      if (res.success) {
        setAlertFeedback({
          type: 'success',
          title: 'SMS Sent Successfully',
          message: `SMS message has been dispatched via Semaphore to ${normalized}.`,
          messageId: res.messageId || undefined,
        });
        fetchStats();
        fetchHistory();
      } else {
        setAlertFeedback({
          type: (res as any).unconfigured ? 'warning' : 'error',
          title: (res as any).unconfigured ? 'Semaphore Not Configured' : 'SMS Failed to Send',
          message: res.error || 'Please check recipient number and Semaphore account balance.',
        });
      }
    } catch (err: any) {
      setAlertFeedback({
        type: 'error',
        title: 'System Error',
        message: err?.message || 'An unexpected error occurred while sending SMS.',
      });
    } finally {
      setIsSending(false);
    }
  };

  // Bulk Selection & Sending
  const filteredPayors = useMemo(() => {
    return payorRecipients.filter(p => {
      const matchSearch =
        p.name.toLowerCase().includes(bulkSearch.toLowerCase()) ||
        p.phone.includes(bulkSearch) ||
        p.deceased.toLowerCase().includes(bulkSearch.toLowerCase());
      const matchStatus = bulkFilterStatus === 'all' || p.status === bulkFilterStatus;
      return matchSearch && matchStatus;
    });
  }, [payorRecipients, bulkSearch, bulkFilterStatus]);

  const toggleSelectRecipient = (id: string) => {
    const next = new Set(selectedRecipientIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedRecipientIds(next);
  };

  const toggleSelectAllFiltered = () => {
    if (selectedRecipientIds.size === filteredPayors.length && filteredPayors.length > 0) {
      setSelectedRecipientIds(new Set());
    } else {
      setSelectedRecipientIds(new Set(filteredPayors.map(p => p.id)));
    }
  };

  const selectByStatus = (status: string) => {
    const matches = payorRecipients.filter(p => p.status === status);
    setSelectedRecipientIds(new Set(matches.map(p => p.id)));
  };

  const handleSendBulkSms = async () => {
    if (selectedRecipientIds.size === 0) {
      setAlertFeedback({
        type: 'error',
        title: 'No Recipients Selected',
        message: 'Please check at least one recipient from the list below.',
      });
      return;
    }

    if (!bulkMessageBody.trim()) {
      setAlertFeedback({
        type: 'error',
        title: 'Message Required',
        message: 'Please enter a message template for the bulk broadcast.',
      });
      return;
    }

    setIsSending(true);
    setShowBulkConfirmModal(false);
    setAlertFeedback(null);

    const selectedList = payorRecipients.filter(p => selectedRecipientIds.has(p.id));
    const recipientsPayload = selectedList.map(p => ({
      number: normalizePhilippineNumber(p.phone),
      name: p.name,
      message: interpolateMessage(bulkMessageBody, {
        recipient_name: p.name,
        deceased_name: p.deceased,
        amount_paid: String(p.amount),
        balance: String(p.balance),
        due_date: p.dueDate,
        plot_number: 'Assigned Plot',
        ref_no: `PAY-${p.id.slice(0, 6)}`,
        burial_date: p.dueDate,
        burial_time: '9:00 AM',
        app_id: `INQ-${p.id.slice(0, 6)}`,
      }),
    }));

    try {
      const res = await sendBulkSmsNotification({
        recipients: recipientsPayload,
        type: `BULK_${bulkTemplateKey}`,
        sentBy: 'Admin Superuser',
      });

      if (res.success) {
        setAlertFeedback({
          type: 'success',
          title: 'Bulk SMS Processed',
          message: `Successfully processed ${res.successCount} of ${res.total} messages via Semaphore. (${res.failCount} failed).`,
        });
        setSelectedRecipientIds(new Set());
        fetchStats();
        fetchHistory();
      } else {
        setAlertFeedback({
          type: 'error',
          title: 'Bulk Dispatch Failed',
          message: res.error || 'Failed to dispatch bulk SMS broadcast.',
        });
      }
    } catch (err: any) {
      setAlertFeedback({
        type: 'error',
        title: 'System Error',
        message: err?.message || 'An unexpected error occurred during bulk SMS dispatch.',
      });
    } finally {
      setIsSending(false);
    }
  };

  // CSV Export for SMS History
  const exportHistoryCsv = () => {
    if (historyLogs.length === 0) {
      alert('No SMS history logs to export.');
      return;
    }

    let csv = 'SMS_ID,Recipient,Recipient_Name,Message,Semaphore_ID,Status,Type,Sent_By,Sent_At,Error_Message\n';
    historyLogs.forEach(log => {
      const safeMsg = (log.message || '').replace(/"/g, '""');
      const safeErr = (log.errorMessage || '').replace(/"/g, '""');
      const dateStr = new Date(log.createdAt).toLocaleString('en-PH');
      csv += `"${log.id}","${log.recipient}","${log.recipientName || ''}","${safeMsg}","${log.semaphoreId || ''}","${log.status}","${log.type || ''}","${log.sentBy || ''}","${dateStr}","${safeErr}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `jasaan_sms_history_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: '0 12px' }}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <h3>SMS Notifications</h3>
        <p>
          Send real-time SMS alerts, inquiry notifications, and payment reminders powered by Semaphore API (Philippines).
        </p>
      </div>

      {/* Aggregate Stats Cards */}
      <div className={styles.smsStats}>
        <div className={styles.smsStatCard}>
          <div className={styles.smsStatLabel}>Total Messages Sent</div>
          <div className={styles.smsStatNumber}>{stats.total}</div>
        </div>
        <div className={styles.smsStatCard}>
          <div className={styles.smsStatLabel}>Delivered / Sent</div>
          <div className={styles.smsStatNumber} style={{ color: '#6fbf8c' }}>
            {stats.delivered}
          </div>
        </div>
        <div className={styles.smsStatCard}>
          <div className={styles.smsStatLabel}>Queued / Pending</div>
          <div className={styles.smsStatNumber} style={{ color: '#e6b064' }}>
            {stats.queued}
          </div>
        </div>
        <div className={styles.smsStatCard}>
          <div className={styles.smsStatLabel}>Failed Attempts</div>
          <div className={styles.smsStatNumber} style={{ color: '#ef9a9a' }}>
            {stats.failed}
          </div>
        </div>
      </div>

      {/* Alert Notification Banner */}
      {alertFeedback && (
        <div
          className={`${styles.alertBanner} ${
            alertFeedback.type === 'success'
              ? styles.alertSuccess
              : alertFeedback.type === 'warning'
              ? styles.alertWarning
              : styles.alertError
          }`}
        >
          <div>
            <strong>{alertFeedback.title}: </strong>
            <span>{alertFeedback.message}</span>
            {alertFeedback.messageId && (
              <span style={{ display: 'block', marginTop: '4px', fontSize: '0.75rem', opacity: 0.9 }}>
                Semaphore Message ID: <code>{alertFeedback.messageId}</code>
              </span>
            )}
          </div>
          <button
            onClick={() => setAlertFeedback(null)}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '1rem' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className={styles.tabNav}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'composer' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('composer')}
        >
          <span>✍️</span> Single SMS Composer
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'bulk' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('bulk')}
        >
          <span>👥</span> Bulk SMS Broadcast
          {selectedRecipientIds.size > 0 && <span className={styles.tabBadge}>{selectedRecipientIds.size}</span>}
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'history' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <span>📜</span> SMS History & Logs
          <span className={styles.tabBadge}>{stats.total}</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: SINGLE SMS COMPOSER */}
      {/* ========================================================================= */}
      {activeTab === 'composer' && (
        <div className={styles.composerGrid}>
          {/* Form Side */}
          <div className={styles.formCard}>
            <div className={styles.formCardTitle}>Compose Notification</div>
            <div className={styles.formCardSub}>
              Send a personalized SMS to a citizen or family representative.
            </div>

            <div className={styles.senderBox}>
              <span className={styles.senderBoxLabel}>Authorized Gateway / Sender:</span>
              <span className={styles.senderBoxValue}>SEMAPHORE (Philippines Telcos)</span>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <span>Recipient Phone Number *</span>
                </label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="e.g. 09171234567"
                  value={recipientPhone}
                  onChange={e => setRecipientPhone(e.target.value)}
                />
                <span className={styles.inputHint}>Accepts 09..., +639..., or 639... (Globe, Smart, DITO)</span>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <span>Recipient Full Name</span>
                </label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="e.g. Juan Dela Cruz"
                  value={recipientName}
                  onChange={e => setRecipientName(e.target.value)}
                />
                <span className={styles.inputHint}>Optional (for record keeping)</span>
              </div>
            </div>

            {/* Template Selector Dropdown */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <span>Choose SMS Template</span>
              </label>
              <select
                className={styles.formSelect}
                value={selectedTemplateKey}
                onChange={e => handleSelectTemplate(e.target.value)}
              >
                {Object.entries(TEMPLATES).map(([key, tpl]) => (
                  <option key={key} value={key}>
                    {tpl.icon} {tpl.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Variable Insert Chips */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <span>Insert Dynamic Variables</span>
                <span style={{ fontSize: '0.68rem', color: '#7A7570' }}>Click to insert</span>
              </label>
              <div className={styles.variableList}>
                {VARIABLE_TAGS.map(v => (
                  <span
                    key={v}
                    className={styles.variableTag}
                    onClick={() => handleInsertVariable(v, false)}
                    title={`Click to insert ${v} at cursor`}
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>

            {/* Message Body Textarea */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <span>Message Content *</span>
                <span className={styles.segmentBadge}>
                  {segmentInfo.segments} Segment{segmentInfo.segments !== 1 ? 's' : ''} ({segmentInfo.chars}/160 chars)
                </span>
              </label>
              <textarea
                ref={textareaRef}
                className={styles.formTextarea}
                rows={5}
                placeholder="Type your SMS message here or select a template above..."
                value={messageBody}
                onChange={e => {
                  setMessageBody(e.target.value);
                  setSelectedTemplateKey('CUSTOM');
                }}
              />
              <div className={styles.counterRow}>
                <span>
                  {segmentInfo.segments > 1
                    ? `Multi-part SMS: ${segmentInfo.chars} characters across ${segmentInfo.segments} segments`
                    : `Standard SMS: ${160 - segmentInfo.chars} characters remaining in single segment`}
                </span>
              </div>
            </div>

            {/* Form Actions */}
            <div className={styles.formActions}>
              <button className={styles.btnOutline} onClick={handleClearComposer} disabled={isSending}>
                Clear
              </button>
              <button
                className={styles.btnGold}
                onClick={() => setShowConfirmModal(true)}
                disabled={isSending || !recipientPhone.trim() || !messageBody.trim()}
              >
                {isSending ? 'Sending SMS...' : 'Review & Send SMS'}
              </button>
            </div>
          </div>

          {/* Live Mobile Screen Preview Side */}
          <div>
            <div className={styles.phonePreviewFrame}>
              <div className={styles.phoneTopNotch}></div>
              <div className={styles.phoneHeader}>
                <div className={styles.phoneHeaderName}>{recipientName || 'Citizen Recipient'}</div>
                <div className={styles.phoneHeaderPhone}>
                  {normalizePhilippineNumber(recipientPhone) || '09XXXXXXXXX'}
                </div>
              </div>

              <div className={styles.previewHeader}>Live Mobile Display Preview</div>

              <div className={styles.previewBubble}>{previewText || 'Your SMS message will appear here...'}</div>

              <div className={styles.previewMeta}>
                <span>GSM 7-bit • {segmentInfo.segments} Part(s)</span>
              </div>
            </div>

            <div style={{ marginTop: '16px', padding: '14px', background: 'var(--admin-panel-bg)', borderRadius: '12px', border: '1px solid var(--admin-border)', fontSize: '0.75rem', color: '#7A7570' }}>
              <strong style={{ color: '#E2C97E' }}>💡 Philippine Telco Tip:</strong>
              <p style={{ margin: '6px 0 0 0', lineHeight: 1.5 }}>
                Standard SMS limit is 160 characters. Messages exceeding 160 characters will automatically be delivered as a unified multi-part SMS on recipient mobile phones.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: BULK SMS BROADCAST */}
      {/* ========================================================================= */}
      {activeTab === 'bulk' && (
        <div>
          {/* Quick Selection Status Bar */}
          <div className={styles.bulkBar}>
            <div className={styles.bulkStatusButtons}>
              <span
                className={`${styles.statusBtn} ${styles.statusBtnPending}`}
                onClick={() => selectByStatus('pending')}
              >
                Select All Pending <span className={styles.statusCount}>{payorRecipients.filter(p => p.status === 'pending').length}</span>
              </span>
              <span
                className={`${styles.statusBtn} ${styles.statusBtnOverdue}`}
                onClick={() => selectByStatus('overdue')}
              >
                Select All Overdue <span className={styles.statusCount}>{payorRecipients.filter(p => p.status === 'overdue').length}</span>
              </span>
              <span
                className={`${styles.statusBtn} ${styles.statusBtnExpired}`}
                onClick={() => selectByStatus('unpaid')}
              >
                Select All Unpaid <span className={styles.statusCount}>{payorRecipients.filter(p => p.status === 'unpaid').length}</span>
              </span>
            </div>

            <div className={styles.bulkActions}>
              <span className={styles.recipientCountPill}>{selectedRecipientIds.size} Selected</span>
              <button className={styles.btnOutline} onClick={() => setSelectedRecipientIds(new Set())}>
                Clear Selection
              </button>
              <button
                className={styles.btnGold}
                disabled={selectedRecipientIds.size === 0 || isSending}
                onClick={() => setShowBulkConfirmModal(true)}
              >
                Send to {selectedRecipientIds.size} Recipients
              </button>
            </div>
          </div>

          {/* Bulk Template Composer Panel */}
          <div className={styles.panel} style={{ marginBottom: '20px' }}>
            <div className={styles.panelHead}>
              <h4>Broadcast Message Template</h4>
            </div>
            <div style={{ padding: '20px' }}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <span>Preset Bulk Template</span>
                </label>
                <select
                  className={styles.formSelect}
                  value={bulkTemplateKey}
                  onChange={e => {
                    setBulkTemplateKey(e.target.value);
                    const tpl = TEMPLATES[e.target.value];
                    if (tpl) {
                      setBulkMessageBody(tpl.text);
                    }
                  }}
                >
                  <option value="PAYMENT_REMINDER">🔔 Payment Reminder (Due & Overdue)</option>
                  <option value="ANNOUNCEMENT">📣 Important Municipal Announcement</option>
                  <option value="INQUIRY_APPROVED">✅ Burial Inquiries Notice</option>
                  <option value="CUSTOM">✍️ Custom Broadcast</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <span>Insert Variable Placeholders</span>
                </label>
                <div className={styles.variableList}>
                  {VARIABLE_TAGS.map(v => (
                    <span
                      key={v}
                      className={styles.variableTag}
                      onClick={() => handleInsertVariable(v, true)}
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <span>Broadcast Message Content</span>
                </label>
                <textarea
                  ref={bulkTextareaRef}
                  className={styles.formTextarea}
                  rows={4}
                  value={bulkMessageBody}
                  onChange={e => setBulkMessageBody(e.target.value)}
                  placeholder="Compose message with {variables}..."
                />
              </div>
            </div>
          </div>

          {/* Candidate Recipients Table */}
          <div className={styles.panel}>
            <div className={styles.panelHead}>
              <h4>Select Recipients ({filteredPayors.length} Available)</h4>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  className={styles.filterInput}
                  placeholder="Search name, deceased, phone..."
                  value={bulkSearch}
                  onChange={e => setBulkSearch(e.target.value)}
                />
                <select
                  className={styles.filterSelect}
                  value={bulkFilterStatus}
                  onChange={e => setBulkFilterStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="overdue">Overdue</option>
                  <option value="unpaid">Unpaid</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
            </div>

            <div className={styles.tblWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.checkboxCell}>
                      <input
                        type="checkbox"
                        className={styles.selectCheckbox}
                        checked={filteredPayors.length > 0 && selectedRecipientIds.size === filteredPayors.length}
                        onChange={toggleSelectAllFiltered}
                      />
                    </th>
                    <th>Recipient / Payor</th>
                    <th>Contact Number</th>
                    <th>Deceased</th>
                    <th>Balance</th>
                    <th>Due Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayors.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: '#7A7570' }}>
                        No records with valid contact numbers match the filter.
                      </td>
                    </tr>
                  ) : (
                    filteredPayors.map(p => {
                      const isSelected = selectedRecipientIds.has(p.id);
                      return (
                        <tr
                          key={p.id}
                          className={`${styles.clickableRow} ${isSelected ? styles.selectedRow : ''}`}
                          onClick={() => toggleSelectRecipient(p.id)}
                        >
                          <td className={styles.checkboxCell} onClick={e => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              className={styles.selectCheckbox}
                              checked={isSelected}
                              onChange={() => toggleSelectRecipient(p.id)}
                            />
                          </td>
                          <td>
                            <strong>{p.name}</strong>
                          </td>
                          <td>
                            <code>{normalizePhilippineNumber(p.phone)}</code>
                          </td>
                          <td>{p.deceased}</td>
                          <td>₱{p.balance.toLocaleString()}</td>
                          <td>{p.dueDate}</td>
                          <td>
                            <span
                              className={
                                p.status === 'paid'
                                  ? styles.payBadgePaid
                                  : p.status === 'overdue'
                                  ? styles.payBadgeOverdue
                                  : styles.payBadgePending
                              }
                            >
                              {p.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SMS HISTORY & LOGS */}
      {/* ========================================================================= */}
      {activeTab === 'history' && (
        <div>
          {/* History Search & Filter Bar */}
          <div className={styles.filterSection}>
            <input
              type="text"
              className={styles.filterInput}
              placeholder="Search by recipient, name, message content, or Semaphore ID..."
              value={historySearch}
              onChange={e => setHistorySearch(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  setHistoryPage(1);
                  fetchHistory();
                }
              }}
            />
            <button className={styles.btnOutline} onClick={() => { setHistoryPage(1); fetchHistory(); }}>
              🔍 Search
            </button>

            <select
              className={styles.filterSelect}
              value={historyStatusFilter}
              onChange={e => {
                setHistoryStatusFilter(e.target.value);
                setHistoryPage(1);
              }}
            >
              <option value="all">All Statuses</option>
              <option value="Sent">Sent / Delivered</option>
              <option value="Queued">Queued</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>

            <select
              className={styles.filterSelect}
              value={historyTypeFilter}
              onChange={e => {
                setHistoryTypeFilter(e.target.value);
                setHistoryPage(1);
              }}
            >
              <option value="all">All Types</option>
              <option value="INQUIRY_APPROVED">Inquiry Approved</option>
              <option value="INQUIRY_REJECTED">Inquiry Rejected</option>
              <option value="PAYMENT_RECEIVED">Payment Received</option>
              <option value="PAYMENT_REMINDER">Payment Reminder</option>
              <option value="GRAVE_RESERVATION">Grave Reservation</option>
              <option value="BURIAL_CONFIRMATION">Burial Confirmation</option>
              <option value="ANNOUNCEMENT">Announcement</option>
              <option value="CUSTOM">Custom Message</option>
            </select>

            <button className={styles.btnOutline} style={{ marginLeft: 'auto' }} onClick={exportHistoryCsv}>
              📥 Export CSV
            </button>
            <button className={styles.btnOutline} onClick={fetchHistory}>
              🔄 Refresh
            </button>
          </div>

          {/* History Log Table */}
          <div className={styles.panel}>
            <div className={styles.panelHead}>
              <h4>SMS Delivery Log ({historyTotalCount} Total Records)</h4>
            </div>

            <div className={styles.tblWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Recipient</th>
                    <th>Contact No.</th>
                    <th>Message Content</th>
                    <th>Message ID</th>
                    <th>Status</th>
                    <th>Type</th>
                    <th>Sent By</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {historyLoading ? (
                    <tr>
                      <td colSpan={9} style={{ textAlign: 'center', padding: '40px', color: '#7A7570' }}>
                        Loading SMS logs from database...
                      </td>
                    </tr>
                  ) : historyLogs.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ textAlign: 'center', padding: '40px', color: '#7A7570' }}>
                        No SMS logs found. Dispatched messages will appear here automatically.
                      </td>
                    </tr>
                  ) : (
                    historyLogs.map(log => {
                      const dateStr = new Date(log.createdAt).toLocaleString('en-PH', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                      });

                      return (
                        <tr key={log.id}>
                          <td style={{ fontSize: '0.78rem', whiteSpace: 'nowrap' }}>{dateStr}</td>
                          <td>
                            <strong>{log.recipientName || 'Citizen'}</strong>
                          </td>
                          <td>
                            <code>{log.recipient}</code>
                          </td>
                          <td>
                            <div className={styles.msgPreview} title={log.message}>
                              {log.message}
                            </div>
                          </td>
                          <td>
                            <code style={{ fontSize: '0.72rem', color: '#C8A84B' }}>
                              {log.semaphoreId || '—'}
                            </code>
                          </td>
                          <td>
                            <span
                              className={
                                log.status === 'Sent' || log.status === 'Delivered'
                                  ? styles.statusSent
                                  : log.status === 'Queued' || log.status === 'Pending'
                                  ? styles.statusQueued
                                  : styles.statusFailed
                              }
                            >
                              {log.status}
                            </span>
                          </td>
                          <td>
                            <span className={styles.reminderBadge}>{log.type || 'CUSTOM'}</span>
                          </td>
                          <td style={{ fontSize: '0.75rem', color: '#7A7570' }}>{log.sentBy || 'Admin'}</td>
                          <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <button
                              className={styles.btnOutline}
                              style={{ padding: '3px 8px', fontSize: '0.72rem', marginRight: '6px' }}
                              onClick={() => setViewDetailsLog(log)}
                            >
                              Details
                            </button>
                            <button
                              className={styles.btnOutline}
                              style={{ padding: '3px 8px', fontSize: '0.72rem', color: '#ef9a9a', borderColor: 'rgba(239, 154, 154, 0.3)' }}
                              onClick={async () => {
                                if (confirm('Are you sure you want to delete this SMS log entry?')) {
                                  await deleteSmsLog(log.id);
                                  fetchHistory();
                                  fetchStats();
                                }
                              }}
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className={styles.tableFooter}>
              <span>
                Page {historyPage} of {historyTotalPages} ({historyTotalCount} total logs)
              </span>
              <div className={styles.pagination}>
                <button
                  className={styles.pageBtn}
                  disabled={historyPage <= 1}
                  onClick={() => setHistoryPage(p => Math.max(1, p - 1))}
                >
                  ◀ Prev
                </button>
                {Array.from({ length: Math.min(5, historyTotalPages) }).map((_, i) => {
                  const pNum = i + 1;
                  return (
                    <span
                      key={pNum}
                      className={`${styles.pageBtn} ${historyPage === pNum ? styles.pageBtnActive : ''}`}
                      onClick={() => setHistoryPage(pNum)}
                    >
                      {pNum}
                    </span>
                  );
                })}
                <button
                  className={styles.pageBtn}
                  disabled={historyPage >= historyTotalPages}
                  onClick={() => setHistoryPage(p => Math.min(historyTotalPages, p + 1))}
                >
                  Next ▶
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: SINGLE SMS CONFIRMATION */}
      {/* ========================================================================= */}
      {showConfirmModal && (
        <div className={styles.modalOverlay} onClick={() => setShowConfirmModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Confirm SMS Notification</h3>
              <span className={styles.modalClose} onClick={() => setShowConfirmModal(false)}>
                ✕
              </span>
            </div>
            <div className={styles.modalBody}>
              <p style={{ margin: '0 0 16px 0', fontSize: '0.85rem', color: '#d0c8b8' }}>
                Please review the recipient and rendered message below before dispatching through Semaphore:
              </p>

              <div className={styles.selectedPayorBar}>
                <div>
                  <div className={styles.selectedPayorBarLabel}>Recipient</div>
                  <div className={styles.selectedPayorBarName}>{recipientName || 'Citizen Recipient'}</div>
                </div>
                <div className={styles.selectedPayorBarContact}>
                  <code>{normalizePhilippineNumber(recipientPhone)}</code>
                </div>
              </div>

              <div className={styles.sectionDivider}>Rendered SMS Body</div>
              <div className={styles.previewBubble}>{previewText}</div>

              <div style={{ marginTop: '14px', fontSize: '0.75rem', color: '#7A7570' }}>
                <div>• Gateway: Semaphore API (Philippine Direct Route)</div>
                <div>• Segments: {segmentInfo.segments} ({segmentInfo.chars} characters)</div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.btnOutline} onClick={() => setShowConfirmModal(false)}>
                Cancel
              </button>
              <button className={styles.btnGold} onClick={handleSendSingleSms} disabled={isSending}>
                {isSending ? 'Dispatching...' : 'Confirm & Send SMS'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: BULK SMS CONFIRMATION */}
      {/* ========================================================================= */}
      {showBulkConfirmModal && (
        <div className={styles.modalOverlay} onClick={() => setShowBulkConfirmModal(false)}>
          <div className={`${styles.modalContent} ${styles.modalLg}`} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Confirm Bulk SMS Broadcast</h3>
              <span className={styles.modalClose} onClick={() => setShowBulkConfirmModal(false)}>
                ✕
              </span>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.paymentInfo}>
                <h4>Broadcast Summary</h4>
                <div className={styles.paymentInfoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Selected Recipients</span>
                    <span className={styles.infoValue}>{selectedRecipientIds.size} Citizens</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Template Type</span>
                    <span className={styles.infoValue}>{bulkTemplateKey}</span>
                  </div>
                </div>
              </div>

              <div className={styles.sectionDivider}>Sample Message Preview (1st Recipient)</div>
              <div className={styles.previewBubble}>
                {selectedRecipientIds.size > 0
                  ? interpolateMessage(
                      bulkMessageBody,
                      (() => {
                        const first = payorRecipients.find(p => selectedRecipientIds.has(p.id));
                        return {
                          recipient_name: first?.name || 'Citizen',
                          deceased_name: first?.deceased || 'Deceased',
                          amount_paid: String(first?.amount || 500),
                          balance: String(first?.balance || 1500),
                          due_date: first?.dueDate || 'March 30, 2026',
                          plot_number: 'Block 2, Plot 14',
                          ref_no: `PAY-${first?.id?.slice(0, 6) || '1029'}`,
                          burial_date: first?.dueDate || 'March 15, 2026',
                          burial_time: '9:00 AM',
                          app_id: `INQ-${first?.id?.slice(0, 6) || '8841'}`,
                        };
                      })()
                    )
                  : bulkMessageBody}
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.btnOutline} onClick={() => setShowBulkConfirmModal(false)}>
                Cancel
              </button>
              <button className={styles.btnGold} onClick={handleSendBulkSms} disabled={isSending}>
                {isSending ? 'Sending Broadcast...' : `Send to All ${selectedRecipientIds.size} Recipients`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: SMS LOG DETAILS */}
      {/* ========================================================================= */}
      {viewDetailsLog && (
        <div className={styles.modalOverlay} onClick={() => setViewDetailsLog(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>SMS Log Details</h3>
              <span className={styles.modalClose} onClick={() => setViewDetailsLog(null)}>
                ✕
              </span>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.paymentInfo}>
                <div className={styles.paymentInfoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Recipient</span>
                    <span className={styles.infoValue}>{viewDetailsLog.recipientName || 'Citizen'}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Phone Number</span>
                    <span className={styles.infoValue}>{viewDetailsLog.recipient}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Semaphore Message ID</span>
                    <span className={styles.infoValue}>{viewDetailsLog.semaphoreId || 'None (Failed)'}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Status</span>
                    <span className={styles.infoValue}>{viewDetailsLog.status}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Sent Date & Time</span>
                    <span className={styles.infoValue}>
                      {new Date(viewDetailsLog.createdAt).toLocaleString('en-PH')}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Dispatched By</span>
                    <span className={styles.infoValue}>{viewDetailsLog.sentBy || 'Admin'}</span>
                  </div>
                </div>
              </div>

              <div className={styles.sectionDivider}>Delivered Message</div>
              <div className={styles.previewBubble}>{viewDetailsLog.message}</div>

              {viewDetailsLog.errorMessage && (
                <div style={{ marginTop: '16px' }}>
                  <div className={styles.sectionDivider} style={{ color: '#ef9a9a' }}>
                    Gateway Error Diagnostic
                  </div>
                  <div style={{ background: 'rgba(211, 47, 47, 0.1)', border: '1px solid rgba(211, 47, 47, 0.3)', padding: '10px 14px', borderRadius: '8px', color: '#ef9a9a', fontSize: '0.8rem' }}>
                    {viewDetailsLog.errorMessage}
                  </div>
                </div>
              )}
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.btnGold} onClick={() => setViewDetailsLog(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
