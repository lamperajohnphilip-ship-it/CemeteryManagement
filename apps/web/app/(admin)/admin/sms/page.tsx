'use client';

import { useState, useEffect, useRef } from 'react';
import { sendSmsNotification } from '../../../actions/sms';
import styles from './page.module.css';

interface PaymentInfo {
  id: string | number;
  payorName: string;
  contact: string;
  deceasedName: string;
  amount: number;
  dueDate: string;
  expiryDate: string;
  status: string;
  lastReminder: string;
}

interface SMSHistory {
  id: string | number;
  date: string;
  recipient: string;
  contact: string;
  message: string;
  status: string;
  type: string;
}

const DEFAULT_TEMPLATES: Record<string, string> = {
  due: 'REMINDER: Dear {payor_name}, your payment of ₱{amount} for {deceased_name} is due on {due_date}. Please settle your payment before {expiry_date} to avoid penalties. Thank you for your prompt settlement. - Bobontugan Cemetery',
  overdue: 'URGENT: Dear {payor_name}, your payment of ₱{amount} for {deceased_name} is OVERDUE since {due_date}. Please settle immediately to avoid additional penalties. Your account will expire on {expiry_date}. Settle now: ₱{amount}. - Bobontugan Cemetery',
  expired: 'FINAL NOTICE: Dear {payor_name}, the grave rental for {deceased_name} has EXPIRED as of {expiry_date}. Your outstanding balance of ₱{amount} must be settled within 7 days to avoid cancellation of your reserved lot. Please visit our office immediately. - Bobontugan Cemetery',
  received: 'PAYMENT RECEIVED: Dear {payor_name}, we have successfully received your payment of ₱{amount} for the account of {deceased_name}. Thank you for your prompt action. - Bobontugan Cemetery',
  general: 'NOTICE: Dear {payor_name}, this is an important update from Bobontugan Cemetery regarding {deceased_name}. Please contact our admin office or visit us during business hours at your earliest convenience.'
};

const getTemplateLabel = (key: string) => {
  const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
  switch (key) {
    case 'due': return <span style={{display:'flex',alignItems:'center',gap:'4px'}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> Due Reminder</span>;
    case 'overdue': return <span style={{display:'flex',alignItems:'center',gap:'4px'}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg> Overdue Alert</span>;
    case 'expired': return <span style={{display:'flex',alignItems:'center',gap:'4px'}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg> Expired Notice</span>;
    case 'received': return <span style={{display:'flex',alignItems:'center',gap:'4px'}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg> Payment Received</span>;
    case 'general': return <span style={{display:'flex',alignItems:'center',gap:'4px'}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg> General Update</span>;
    default: return <span style={{display:'flex',alignItems:'center',gap:'4px'}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> {label}</span>;
  }
};

export default function SMSNotificationsPage() {
  const [templates, setTemplates] = useState<Record<string, string>>(DEFAULT_TEMPLATES);

  const [payments, setPayments] = useState<PaymentInfo[]>([]);
  const [smsHistory, setSmsHistory] = useState<SMSHistory[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
  const [currentPayment, setCurrentPayment] = useState<PaymentInfo | null>(null);

  // Filters
  const [nameFilter, setNameFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Individual Modal
  const [showSMSModal, setShowSMSModal] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  const [smsMessage, setSmsMessage] = useState('');

  // Bulk Modal
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [activeBulkTpl, setActiveBulkTpl] = useState<string | null>(null);
  const [bulkMessage, setBulkMessage] = useState('');

  // Pagination for History
  const [historyPage, setHistoryPage] = useState(1);
  const PER_PAGE = 5;

  const msgRef = useRef<HTMLTextAreaElement>(null);
  const bulkMsgRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    loadData();
    const savedTpls = localStorage.getItem('customSmsTemplates');
    if (savedTpls) {
      try {
        setTemplates(prev => ({ ...prev, ...JSON.parse(savedTpls) }));
      } catch (e) { }
    }
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'cemeterySmsList') loadData();
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const loadData = () => {
    const saved = localStorage.getItem('cemeterySmsList');
    if (saved) {
      try {
        setPayments(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    } else {
      const initialPayments = [
        { id: 1, payorName: 'Juan Dela Cruz', contact: '09123456789', deceasedName: 'Maria Dela Cruz', amount: 500, dueDate: '2025-03-01', expiryDate: '2025-03-15', status: 'pending', lastReminder: '2025-02-24' },
        { id: 2, payorName: 'Maria Santos', contact: '09234567890', deceasedName: 'Pedro Santos', amount: 750, dueDate: '2025-02-15', expiryDate: '2025-02-28', status: 'overdue', lastReminder: '2025-02-20' },
        { id: 3, payorName: 'Jose Rodriguez', contact: '09345678901', deceasedName: 'Ana Rodriguez', amount: 600, dueDate: '2024-12-15', expiryDate: '2024-12-31', status: 'expired', lastReminder: '2024-12-10' },
        { id: 4, payorName: 'Elena Reyes', contact: '09456789012', deceasedName: 'Carlos Reyes', amount: 800, dueDate: '2025-04-05', expiryDate: '2025-04-20', status: 'pending', lastReminder: 'None' },
        { id: 5, payorName: 'Roberto Gomez', contact: '09567890123', deceasedName: 'Sofia Gomez', amount: 450, dueDate: '2025-02-15', expiryDate: '2025-03-01', status: 'overdue', lastReminder: '2025-02-14' },
        { id: 6, payorName: 'Luisa Fernandez', contact: '09678901234', deceasedName: 'Antonio Fernandez', amount: 550, dueDate: '2025-02-25', expiryDate: '2025-03-10', status: 'pending', lastReminder: 'None' },
        { id: 7, payorName: 'Carlos Mendoza', contact: '09789012345', deceasedName: 'Isabel Mendoza', amount: 650, dueDate: '2025-02-05', expiryDate: '2025-02-20', status: 'expired', lastReminder: '2025-02-01' },
      ];
      setPayments(initialPayments);
      localStorage.setItem('cemeterySmsList', JSON.stringify(initialPayments));
    }

    setSmsHistory([
      { id: 1, date: '2025-02-24 10:30 AM', recipient: 'Juan Dela Cruz', contact: '09123456789', message: 'Reminder: Your payment of ₱500 for Maria Dela Cruz is due on March 1, 2025.', status: 'delivered', type: 'due' },
      { id: 2, date: '2025-02-23 02:15 PM', recipient: 'Maria Santos', contact: '09234567890', message: 'URGENT: Your payment of ₱750 for Pedro Santos is OVERDUE since Feb 15, 2025.', status: 'delivered', type: 'overdue' },
      { id: 3, date: '2025-02-22 09:45 AM', recipient: 'Jose Rodriguez', contact: '09345678901', message: 'Your grave rent for Ana Rodriguez expired on Dec 31, 2024. Please settle immediately.', status: 'pending', type: 'expired' },
    ]);
  };

  const fillTemplate = (tpl: string, p: PaymentInfo | null) => {
    if (!p) return tpl;
    const today = new Date();
    const dueD = new Date(p.dueDate);
    const daysLeft = Math.ceil((dueD.getTime() - today.getTime()) / 86400000);
    return tpl
      .replace(/{payor_name}/g, p.payorName)
      .replace(/{deceased_name}/g, p.deceasedName)
      .replace(/{amount}/g, p.amount.toString())
      .replace(/{due_date}/g, p.dueDate)
      .replace(/{expiry_date}/g, p.expiryDate)
      .replace(/{days_left}/g, daysLeft.toString())
      .replace(/{status}/g, p.status.toUpperCase());
  };

  const getFilteredPayments = () => {
    const q = nameFilter.toLowerCase();
    return payments.filter(p => {
      const hay = `${p.payorName} ${p.deceasedName} ${p.contact}`.toLowerCase();
      return hay.includes(q) && (statusFilter === 'all' || p.status === statusFilter);
    });
  };

  const filteredPayments = getFilteredPayments();

  // Selection Logic
  const toggleCb = (id: string | number) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSelected = new Set(selectedIds);
      filteredPayments.forEach(p => newSelected.add(p.id));
      setSelectedIds(newSelected);
    } else {
      const newSelected = new Set(selectedIds);
      filteredPayments.forEach(p => newSelected.delete(p.id));
      setSelectedIds(newSelected);
    }
  };

  const selectAllByStatus = (status: string) => {
    const newSelected = new Set(selectedIds);
    payments.filter(p => p.status === status).forEach(p => newSelected.add(p.id));
    setSelectedIds(newSelected);
  };

  // Individual Modal Actions
  const openComposeModal = () => {
    setCurrentPayment(null);
    setActiveTemplate(null);
    setSmsMessage('');
    setShowSMSModal(true);
  };

  const selectPayorAndOpen = (p: PaymentInfo) => {
    setCurrentPayment(p);
    setActiveTemplate(p.status === 'pending' ? 'due' : p.status);
    setSmsMessage(fillTemplate(templates[p.status === 'pending' ? 'due' : p.status] || '', p));
    setShowSMSModal(true);
  };

  const loadTemplate = (type: string) => {
    if (!currentPayment) {
      alert('⚠️ No payor selected. Click a row in the table first, then click a template.');
      setActiveTemplate(type);
      setSmsMessage(templates[type] || '');
      return;
    }
    setActiveTemplate(type);
    setSmsMessage(fillTemplate(templates[type as keyof typeof templates] || '', currentPayment));
  };

  const saveNewTemplate = (isBulk: boolean) => {
    const tplName = prompt('Enter a brief name for this custom template (e.g. "Meeting Follow-up")');
    if (!tplName) return;
    const key = tplName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    if (!key) return;
    const msg = isBulk ? bulkMessage : smsMessage;
    const newTemplates = { ...templates, [key]: msg };
    setTemplates(newTemplates);
    localStorage.setItem('customSmsTemplates', JSON.stringify(newTemplates));
    alert('Custom template saved!');
    if (isBulk) setActiveBulkTpl(key);
    else setActiveTemplate(key);
  };

  const insertVar = (variable: string, isBulk: boolean) => {
    const ref = isBulk ? bulkMsgRef : msgRef;
    if (ref.current) {
      const start = ref.current.selectionStart || 0;
      const val = isBulk ? bulkMessage : smsMessage;
      const newVal = val.slice(0, start) + variable + val.slice(ref.current.selectionEnd || val.length);
      if (isBulk) setBulkMessage(newVal);
      else setSmsMessage(newVal);
      setTimeout(() => {
        if (ref.current) {
          ref.current.focus();
          ref.current.setSelectionRange(start + variable.length, start + variable.length);
        }
      }, 0);
    }
  };

  const sendSMS = async () => {
    const msg = smsMessage.trim();
    if (!msg) { alert('Please enter a message.'); return; }
    if (!currentPayment) { alert('Please select a payor from the table.'); return; }

    // Use free SMS API (Twilio)
    const response = await sendSmsNotification(currentPayment.contact, msg);
    const smsStatus = response.success ? 'delivered' : 'failed';

    if (!response.success) {
      alert(`Twilio Error: ${response.error}\n\nMake sure your Twilio credentials are in .env and the phone number is verified in your Twilio Trial account.`);
    }

    const newHistory = [{
      id: smsHistory.length + 1,
      date: new Date().toLocaleString(),
      recipient: currentPayment.payorName,
      contact: currentPayment.contact,
      message: msg,
      status: smsStatus,
      type: activeTemplate || currentPayment.status
    }, ...smsHistory];

    setSmsHistory(newHistory);

    const updatedPayments = payments.map(p =>
      p.id === currentPayment.id ? { ...p, lastReminder: new Date().toLocaleDateString() } : p
    );
    setPayments(updatedPayments);
    localStorage.setItem('cemeterySmsList', JSON.stringify(updatedPayments));

    setShowSMSModal(false);
    alert(`SMS processed for ${currentPayment.payorName}!`);
  };

  // Bulk Modal Actions
  const openBulkModal = () => {
    if (selectedIds.size === 0) { alert('Please select at least one recipient.'); return; }
    const list = payments.filter(p => selectedIds.has(p.id));
    const statusCounts = list.reduce((acc, p) => { acc[p.status] = (acc[p.status] || 0) + 1; return acc; }, {} as Record<string, number>);
    const dominant = Object.entries(statusCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

    const initialTpl = dominant === 'pending' ? 'due' : dominant || 'due';
    setActiveBulkTpl(initialTpl);
    setBulkMessage(templates[initialTpl] || '');
    setShowBulkModal(true);
  };

  const loadBulkTemplate = (type: string) => {
    setActiveBulkTpl(type);
    setBulkMessage(templates[type as keyof typeof templates] || '');
  };

  const sendBulkMessages = async () => {
    const tpl = bulkMessage.trim();
    if (!tpl) { alert('Please enter a message template.'); return; }

    const list = payments.filter(p => selectedIds.has(p.id));
    
    // Process each SMS
    const newHistories = await Promise.all(list.map(async (p, idx) => {
      const msg = fillTemplate(tpl, p);
      const response = await sendSmsNotification(p.contact, msg);
      
      return {
        id: smsHistory.length + idx + 1,
        date: new Date().toLocaleString(),
        recipient: p.payorName,
        contact: p.contact,
        message: msg,
        status: response.success ? 'delivered' : 'failed',
        type: `bulk-${activeBulkTpl || p.status}`
      };
    }));

    newHistories.reverse();

    setSmsHistory([...newHistories, ...smsHistory]);

    const updatedPayments = payments.map(p =>
      selectedIds.has(p.id) ? { ...p, lastReminder: new Date().toLocaleDateString() } : p
    );
    setPayments(updatedPayments);
    localStorage.setItem('cemeterySmsList', JSON.stringify(updatedPayments));

    setSelectedIds(new Set());
    setShowBulkModal(false);
    alert(`Bulk SMS processed for ${list.length} recipients!`);
  };

  const exportLog = () => {
    let csv = 'Date,Recipient,Contact,Message,Status,Type\n';
    smsHistory.forEach(m => csv += `"${m.date}","${m.recipient}","${m.contact}","${m.message.replace(/"/g, '""')}","${m.status}","${m.type}"\n`);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `sms_log_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Previews
  const previewText = currentPayment ? fillTemplate(smsMessage, currentPayment) : smsMessage;
  const selectedList = payments.filter(p => selectedIds.has(p.id));
  const bulkPreviewText = selectedList.length > 0 ? fillTemplate(bulkMessage, selectedList[0] || null) : bulkMessage;

  // Render Stats
  const cntPending = payments.filter(p => p.status === 'pending').length;
  const cntOverdue = payments.filter(p => p.status === 'overdue').length;
  const cntExpired = payments.filter(p => p.status === 'expired').length;

  return (
    <div style={{ padding: '0 10px' }}>
      <div className={styles.pageHeader}>
        <h3>SMS Notifications</h3>
      </div>

      <div className={styles.smsStats}>
        <div className={styles.smsStatCard}><div className={styles.smsStatLabel}>Total Sent</div><div className={styles.smsStatNumber}>{smsHistory.length}</div></div>
        <div className={styles.smsStatCard}><div className={styles.smsStatLabel}>Delivered</div><div className={styles.smsStatNumber}>{smsHistory.filter(h => h.status === 'delivered').length}</div></div>
        <div className={styles.smsStatCard}><div className={styles.smsStatLabel}>Pending</div><div className={styles.smsStatNumber}>{smsHistory.filter(h => h.status === 'pending').length}</div></div>
        <div className={styles.smsStatCard}><div className={styles.smsStatLabel}>Failed</div><div className={styles.smsStatNumber}>{smsHistory.filter(h => h.status === 'failed').length}</div></div>
      </div>

      <div className={styles.actionBar}>
        <div className={styles.btnGroup}>
          <button className={styles.btnGold} onClick={openComposeModal}>+ Compose SMS</button>
          <button className={styles.btnOutline} style={{ display: 'flex', alignItems: 'center' }} onClick={exportLog}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'8px'}}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            Export Log
          </button>
        </div>
      </div>

      <div className={styles.bulkBar}>
        <div className={styles.bulkStatusButtons}>
          <span className={`${styles.statusBtn} ${styles.statusBtnPending}`} onClick={() => selectAllByStatus('pending')}>
            Select All Pending <span className={styles.statusCount}>{cntPending}</span>
          </span>
          <span className={`${styles.statusBtn} ${styles.statusBtnOverdue}`} onClick={() => selectAllByStatus('overdue')}>
            Select All Overdue <span className={styles.statusCount}>{cntOverdue}</span>
          </span>
          <span className={`${styles.statusBtn} ${styles.statusBtnExpired}`} onClick={() => selectAllByStatus('expired')}>
            Select All Expired <span className={styles.statusCount}>{cntExpired}</span>
          </span>
        </div>
        <div className={styles.bulkActions}>
          <span className={styles.recipientCountPill}>{selectedIds.size} selected</span>
          <button className={styles.btnOutline} onClick={() => setSelectedIds(new Set())}>Clear</button>
          <button className={styles.btnGold} onClick={openBulkModal}>Send to Selected</button>
        </div>
      </div>

      <div className={styles.filterSection}>
        <input type="text" className={styles.filterInput} placeholder="Filter by name, deceased, contact…" value={nameFilter} onChange={e => setNameFilter(e.target.value)} />
        <select className={styles.filterSelect} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      <div className={styles.panel}>
        <div className={styles.panelHead}>
          <h4>Payment Records — Click a row to select payor</h4>
        </div>
        <div className={styles.tblWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.checkboxCell}>
                  <input
                    type="checkbox"
                    className={styles.selectCheckbox}
                    checked={filteredPayments.length > 0 && selectedIds.size === filteredPayments.length}
                    ref={input => { if (input) input.indeterminate = selectedIds.size > 0 && selectedIds.size < filteredPayments.length; }}
                    onChange={e => toggleSelectAll(e.target.checked)}
                  />
                </th>
                <th>Payor Name</th><th>Contact No.</th><th>Deceased</th><th>Amount</th><th>Due Date</th><th>Expiry Date</th><th>Status</th><th>Last Reminder</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map(p => {
                const isSelected = currentPayment?.id === p.id;
                const isCbChecked = selectedIds.has(p.id);
                const badgeClass = p.status === 'paid' ? styles.payBadgePaid : p.status === 'overdue' ? styles.payBadgeOverdue : p.status === 'expired' ? styles.payBadgeExpired : styles.payBadgePending;

                return (
                  <tr key={p.id} className={`${styles.clickableRow} ${isSelected ? styles.selectedRow : ''}`} onClick={() => selectPayorAndOpen(p)}>
                    <td className={styles.checkboxCell} onClick={e => e.stopPropagation()}>
                      <input type="checkbox" className={styles.selectCheckbox} checked={isCbChecked} onChange={() => toggleCb(p.id)} />
                    </td>
                    <td><strong>{p.payorName}</strong></td>
                    <td>{p.contact}</td>
                    <td>{p.deceasedName}</td>
                    <td>₱{p.amount}</td>
                    <td>{p.dueDate}</td>
                    <td>{p.expiryDate}</td>
                    <td><span className={badgeClass}>{p.status.toUpperCase()}</span></td>
                    <td>{p.lastReminder}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.panel}>
        <div className={styles.panelHead}><h4>SMS History</h4></div>
        <div className={styles.tblWrapper}>
          <table className={styles.table}>
            <thead><tr><th>Date & Time</th><th>Recipient</th><th>Contact</th><th>Message</th><th>Status</th><th>Type</th></tr></thead>
            <tbody>
              {smsHistory.slice((historyPage - 1) * PER_PAGE, historyPage * PER_PAGE).map(m => (
                <tr key={m.id}>
                  <td style={{ fontSize: '0.78rem', whiteSpace: 'nowrap' }}>{m.date}</td>
                  <td>{m.recipient}</td>
                  <td>{m.contact}</td>
                  <td><div className={styles.msgPreview} title={m.message}>{m.message}</div></td>
                  <td>
                    <span className={`${styles.payBadgePaid} ${m.status === 'delivered' ? styles.payBadgePaid : m.status === 'failed' ? styles.payBadgeExpired : styles.payBadgePending}`}>{m.status}</span>
                  </td>
                  <td><span className={styles.reminderBadge}>{m.type}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.tableFooter}>
          <span>Showing {(historyPage - 1) * PER_PAGE + 1}–{Math.min(historyPage * PER_PAGE, smsHistory.length)} of {smsHistory.length} messages</span>
          <div className={styles.pagination}>
            {Array.from({ length: Math.ceil(smsHistory.length / PER_PAGE) }).map((_, i) => (
              <span key={i} className={`${styles.pageBtn} ${i + 1 === historyPage ? styles.pageBtnActive : ''}`} onClick={() => setHistoryPage(i + 1)}>{i + 1}</span>
            ))}
          </div>
        </div>
      </div>

      {showSMSModal && (
        <div className={styles.modalOverlay} onClick={e => { if (e.target === e.currentTarget) setShowSMSModal(false); }}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Compose SMS Reminder</h3>
              <span className={styles.modalClose} onClick={() => setShowSMSModal(false)}>✕</span>
            </div>
            <div className={styles.modalBody}>
              {currentPayment ? (
                <>
                  <div className={styles.selectedPayorBar}>
                    <div>
                      <div className={styles.selectedPayorBarLabel}>Selected Payor</div>
                      <div className={styles.selectedPayorBarName}>{currentPayment.payorName}</div>
                    </div>
                    <div className={styles.selectedPayorBarContact}>{currentPayment.contact}</div>
                  </div>
                  <div className={styles.paymentInfo}>
                    <h4>Payment Details</h4>
                    <div className={styles.paymentInfoGrid}>
                      <div className={styles.infoItem}><span className={styles.infoLabel}>Deceased</span><span className={styles.infoValue}>{currentPayment.deceasedName}</span></div>
                      <div className={styles.infoItem}><span className={styles.infoLabel}>Amount</span><span className={styles.infoValue}>₱{currentPayment.amount}</span></div>
                      <div className={styles.infoItem}><span className={styles.infoLabel}>Due Date</span><span className={styles.infoValue}>{currentPayment.dueDate}</span></div>
                      <div className={styles.infoItem}><span className={styles.infoLabel}>Expiry Date</span><span className={styles.infoValue}>{currentPayment.expiryDate}</span></div>
                      <div className={styles.infoItem}><span className={styles.infoLabel}>Status</span><span className={styles.infoValue}>{currentPayment.status.toUpperCase()}</span></div>
                    </div>
                  </div>
                </>
              ) : (
                <div className={styles.noPayorWarning} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                  No payor selected. Compose manually or select one from the table.
                </div>
              )}

              <div className={styles.sectionDivider}>Quick Templates</div>
              <div className={styles.templateBtnRow} style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px' }}>
                {Object.keys(templates).map(k => (
                  <button
                    key={k}
                    className={styles.tplBtn}
                    onClick={() => loadTemplate(k)}
                    style={{
                      backgroundColor: activeTemplate === k ? '#374151' : 'transparent',
                      border: activeTemplate === k ? '1px solid #c9a84c' : '1px solid #555',
                      color: activeTemplate === k ? '#c9a84c' : '#ccc',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    {getTemplateLabel(k)}
                  </button>
                ))}
              </div>

              <div className={styles.sectionDivider}>Insert Variable</div>
              <div className={styles.variableList}>
                {['{payor_name}', '{deceased_name}', '{amount}', '{due_date}', '{expiry_date}', '{days_left}', '{status}'].map(v => (
                  <span key={v} className={styles.variableTag} onClick={() => insertVar(v, false)}>{v}</span>
                ))}
              </div>

              <div className={styles.sectionDivider} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Message</span>
                <button onClick={() => saveNewTemplate(false)} style={{ border: 'none', background: 'none', color: '#c9a84c', cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'underline' }}>+ Save as New Template</button>
              </div>
              <textarea ref={msgRef} className={styles.formTextarea} value={smsMessage} onChange={e => { setSmsMessage(e.target.value); setActiveTemplate(null); }} placeholder="Click a template or type your message..." />
              <div className={styles.charCounter}>{smsMessage.length} / 160 characters</div>

              <div className={styles.livePreviewPanel}>
                <div className={styles.previewHeader}>Live Preview</div>
                <div className={styles.previewBubble}>{previewText || 'Start typing...'}</div>
                <div className={styles.previewMeta}>{currentPayment ? `To: ${currentPayment.payorName} (${currentPayment.contact})` : ''}</div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.btnOutline} onClick={() => setShowSMSModal(false)}>Cancel</button>
              <button className={styles.btnGold} onClick={sendSMS}>Send SMS</button>
            </div>
          </div>
        </div>
      )}

      {showBulkModal && (
        <div className={styles.modalOverlay} onClick={e => { if (e.target === e.currentTarget) setShowBulkModal(false); }}>
          <div className={`${styles.modalContent} ${styles.modalLg}`}>
            <div className={styles.modalHeader}>
              <h3>Bulk SMS — {selectedIds.size} Recipients</h3>
              <span className={styles.modalClose} onClick={() => setShowBulkModal(false)}>✕</span>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.paymentInfo}>
                <h4>Selected Recipients</h4>
                <div className={styles.paymentInfoGrid}>
                  <div className={styles.infoItem}><span className={styles.infoLabel}>Total</span><span className={styles.infoValue}>{selectedIds.size} recipients</span></div>
                </div>
              </div>

              <div className={styles.sectionDivider}>Quick Templates</div>
              <div className={styles.templateBtnRow} style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px' }}>
                {Object.keys(templates).map(k => (
                  <button
                    key={k}
                    className={styles.tplBtn}
                    onClick={() => loadBulkTemplate(k)}
                    style={{
                      backgroundColor: activeBulkTpl === k ? '#374151' : 'transparent',
                      border: activeBulkTpl === k ? '1px solid #c9a84c' : '1px solid #555',
                      color: activeBulkTpl === k ? '#c9a84c' : '#ccc',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    {getTemplateLabel(k)}
                  </button>
                ))}
              </div>

              <div className={styles.sectionDivider}>Insert Variable</div>
              <div className={styles.variableList}>
                {['{payor_name}', '{deceased_name}', '{amount}', '{due_date}', '{expiry_date}', '{days_left}', '{status}'].map(v => (
                  <span key={v} className={styles.variableTag} onClick={() => insertVar(v, true)}>{v}</span>
                ))}
              </div>

              <div className={styles.sectionDivider} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Message Template</span>
                <button onClick={() => saveNewTemplate(true)} style={{ border: 'none', background: 'none', color: '#c9a84c', cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'underline' }}>+ Save as New Template</button>
              </div>
              <textarea ref={bulkMsgRef} className={styles.formTextarea} value={bulkMessage} onChange={e => { setBulkMessage(e.target.value); setActiveBulkTpl(null); }} placeholder="Template with {variables}..." />
              <div className={styles.charCounter}>{bulkMessage.length} characters</div>

              <div className={styles.livePreviewPanel}>
                <div className={styles.previewHeader}>Preview — First Recipient</div>
                <div className={styles.previewBubble}>{bulkPreviewText || 'Choose template...'}</div>
                <div className={styles.previewMeta}>{selectedList.length > 0 && selectedList[0] ? `To: ${selectedList[0].payorName} (${selectedList[0].contact})` : ''}</div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.btnOutline} onClick={() => setShowBulkModal(false)}>Cancel</button>
              <button className={styles.btnGold} onClick={sendBulkMessages}>Send to All Selected</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
