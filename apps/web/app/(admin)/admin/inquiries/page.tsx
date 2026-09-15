'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import {
  getInquiries,
  acceptInquiry,
  rejectInquiry,
  updateInquiryStatus,
  resendInquiryEmail,
} from '../../../actions/inquiry';

interface Inquiry {
  id: number;
  ref: string;
  fullName: string;
  email: string;
  emailVerified: boolean;
  emailVerifiedAt?: string;
  phone: string;
  relation: string;
  address: string;
  deceased: string;
  plot: string;
  preferredDate?: string;
  formattedDate?: string;
  preferredTime: string;
  reason: string;
  notes: string;
  remarks?: string;
  status: string;
  submittedAt?: string;
}

interface EmailLog {
  id: string;
  inquiryId?: number | null;
  inquiryAppId?: string | null;
  recipient: string;
  emailType: string;
  subject: string;
  status: string;
  sentAt?: string | null;
  errorMessage?: string | null;
  createdAt: string;
}

/* ── Status helpers ─────────────────────────────── */
const STATUS_LABEL: Record<string, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  confirmed: 'Accepted',
  rejected: 'Rejected',
  inprogress: 'In Progress',
  cancelled: 'Cancelled',
};

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filteredInquiries, setFilteredInquiries] = useState<Inquiry[]>([]);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [processingId, setProcessingId] = useState<number | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'warning';
    resendAction?: { id: number; type: 'acceptance' | 'rejection' };
  } | null>(null);

  /* ── Modals ── */
  const [viewModal, setViewModal] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });
  const [rejectModal, setRejectModal] = useState<{ open: boolean; id: number | null; reason: string }>({ open: false, id: null, reason: '' });
  const [statusModal, setStatusModal] = useState<{ open: boolean; id: number | null; selected: string }>({ open: false, id: null, selected: 'pending' });
  const [emailLogsModal, setEmailLogsModal] = useState(false);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  const itemsPerPage = 10;

  /* ── Toast ── */
  const showToast = (
    message: string,
    type: 'success' | 'warning' = 'success',
    resendAction?: { id: number; type: 'acceptance' | 'rejection' }
  ) => {
    setToast({ message, type, resendAction });
    setTimeout(() => setToast(null), 8000);
  };

  /* ── Data loading ── */
  const loadInquiries = async () => {
    setIsLoading(true);
    const saved = localStorage.getItem('inquiries');
    let localData: any[] = [];
    if (saved) {
      try { localData = JSON.parse(saved); } catch (_) {}
    }
    try {
      const res = await getInquiries();
      if (res.success && res.records) {
        const dbData = res.records.map((r: any) => ({
          id: r.id,
          ref: r.APP_ID,
          fullName: r.FAMILY_NAME,
          email: r.email,
          emailVerified: !!r.emailVerified,
          emailVerifiedAt: r.emailVerifiedAt,
          phone: r.CONTACT,
          relation: r.relationship,
          address: r.address || '',
          deceased: r.DECEASED || '',
          plot: r.REQUESTED_PLOT || '',
          preferredDate: r.BURIAL_DATE ? new Date(r.BURIAL_DATE).toISOString().split('T')[0] : '',
          formattedDate: r.BURIAL_DATE
            ? new Date(r.BURIAL_DATE).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })
            : '',
          preferredTime: r.TIME || '',
          reason: r.reason,
          notes: r.notes || '',
          remarks: r.remarks || '',
          status: r.STATUS.toLowerCase(),
          submittedAt: r.createdAt,
        }));
        const merged = [...dbData];
        for (const local of localData) {
          if (!merged.find(m => m.ref === local.ref)) merged.push(local);
        }
        merged.sort((a, b) => {
          if (a.submittedAt && b.submittedAt)
            return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
          return b.id - a.id;
        });
        setInquiries(merged);
      } else {
        setInquiries(localData);
      }
    } catch (_) {
      setInquiries(localData);
    } finally {
      setIsLoading(false);
    }
  };

  const loadEmailLogs = async () => {
    setLoadingLogs(true);
    try {
      const res = await fetch('/api/admin/email-logs?limit=60');
      const data = await res.json();
      if (data.success && data.logs) setEmailLogs(data.logs);
    } catch (_) {} finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => { loadInquiries(); }, []);

  useEffect(() => {
    let result = inquiries;
    if (currentFilter !== 'all') {
      result = result.filter(a => {
        if (currentFilter === 'accepted') return a.status === 'accepted' || a.status === 'confirmed';
        return a.status === currentFilter;
      });
    }
    if (searchTerm) {
      const t = searchTerm.toLowerCase();
      result = result.filter(a =>
        a.fullName?.toLowerCase().includes(t) ||
        a.ref?.toLowerCase().includes(t) ||
        a.email?.toLowerCase().includes(t) ||
        a.deceased?.toLowerCase().includes(t)
      );
    }
    setFilteredInquiries(result);
    setCurrentPage(1);
  }, [inquiries, currentFilter, searchTerm]);

  /* ── Counts ── */
  const counts = {
    all: inquiries.length,
    pending: inquiries.filter(a => a.status === 'pending').length,
    accepted: inquiries.filter(a => a.status === 'accepted' || a.status === 'confirmed').length,
    rejected: inquiries.filter(a => a.status === 'rejected').length,
    inprogress: inquiries.filter(a => a.status === 'inprogress').length,
    cancelled: inquiries.filter(a => a.status === 'cancelled').length,
  };

  const totalFiltered = filteredInquiries.length;
  const totalPages = Math.ceil(totalFiltered / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const pageItems = filteredInquiries.slice(startIdx, startIdx + itemsPerPage);

  /* ── Status badge ── */
  const getStatusBadge = (status: string) => {
    const cls = {
      accepted: styles.badgeAccepted,
      confirmed: styles.badgeAccepted,
      rejected: styles.badgeRejected,
      inprogress: styles.badgeInprogress,
      cancelled: styles.badgeCancelled,
    }[status] ?? styles.badgePending;
    return <span className={`${styles.badge} ${cls}`}>{STATUS_LABEL[status] ?? 'Pending'}</span>;
  };

  /* ── Accept ── */
  const handleAcceptDirect = async (id: number) => {
    const target = inquiries.find(a => a.id === id);
    if (!target) return;
    if (target.status === 'accepted' || target.status === 'confirmed') {
      showToast(`Inquiry ${target.ref} is already accepted.`, 'warning');
      return;
    }
    setProcessingId(id);
    try {
      const res = await acceptInquiry(id);
      if (res.success) {
        setInquiries(prev => prev.map(item => item.id === id ? { ...item, status: 'accepted' } : item));
        showToast(
          res.emailSent
            ? `✅ Accepted! Notification email sent to ${target.email}.`
            : `⚠️ Accepted, but email delivery failed: ${res.emailError || 'Unknown error'}.`,
          res.emailSent ? 'success' : 'warning',
          res.emailSent ? undefined : { id, type: 'acceptance' }
        );
      } else {
        showToast(res.message || 'Failed to accept inquiry.', 'warning');
      }
    } catch (e: any) {
      showToast(e.message || 'An error occurred.', 'warning');
    } finally {
      setProcessingId(null);
    }
  };

  /* ── Reject ── */
  const handleRejectConfirm = async () => {
    if (!rejectModal.id) return;
    const target = inquiries.find(a => a.id === rejectModal.id);
    if (!target) return;
    setProcessingId(rejectModal.id);
    try {
      const res = await rejectInquiry(rejectModal.id, rejectModal.reason);
      if (res.success) {
        setInquiries(prev =>
          prev.map(item => item.id === rejectModal.id
            ? { ...item, status: 'rejected', remarks: rejectModal.reason }
            : item
          )
        );
        setRejectModal({ open: false, id: null, reason: '' });
        showToast(
          res.emailSent
            ? `Rejected. Notification sent to ${target.email}.`
            : `Rejected. Email delivery failed: ${res.emailError || 'Unknown error'}.`,
          res.emailSent ? 'success' : 'warning',
          res.emailSent ? undefined : { id: rejectModal.id!, type: 'rejection' }
        );
      } else {
        showToast(res.message || 'Failed to reject inquiry.', 'warning');
      }
    } catch (e: any) {
      showToast(e.message || 'An error occurred.', 'warning');
    } finally {
      setProcessingId(null);
    }
  };

  /* ── Resend ── */
  const handleResend = async (id: number, type: 'acceptance' | 'rejection' | 'receipt') => {
    setProcessingId(id);
    try {
      const res = await resendInquiryEmail(id, type);
      showToast(res.success ? `✅ ${res.message}` : `⚠️ ${res.message}`, res.success ? 'success' : 'warning');
    } catch (e: any) {
      showToast(e.message || 'Failed to resend email', 'warning');
    } finally {
      setProcessingId(null);
    }
  };

  /* ── Update from status modal ── */
  const updateStatusFromModal = async () => {
    if (!statusModal.id) return;
    const index = inquiries.findIndex(a => a.id === statusModal.id);
    if (index === -1) return;
    const target = inquiries[index] as Inquiry;
    setProcessingId(statusModal.id);
    try {
      if (statusModal.selected === 'accepted' || statusModal.selected === 'confirmed') {
        const res = await acceptInquiry(statusModal.id);
        if (res.success) {
          setInquiries(prev => prev.map(item => item.id === statusModal.id ? { ...item, status: 'accepted' } : item));
          showToast(
            res.emailSent
              ? `✅ Accepted! Email sent to ${target.email}.`
              : `⚠️ Accepted. Email failed: ${res.emailError || 'Unknown error'}.`,
            res.emailSent ? 'success' : 'warning',
            res.emailSent ? undefined : { id: statusModal.id!, type: 'acceptance' }
          );
        }
      } else if (statusModal.selected === 'rejected') {
        const res = await rejectInquiry(statusModal.id, target.remarks);
        if (res.success) {
          setInquiries(prev => prev.map(item => item.id === statusModal.id ? { ...item, status: 'rejected' } : item));
          showToast(
            res.emailSent
              ? `Rejected. Email sent to ${target.email}.`
              : `Rejected. Email failed: ${res.emailError || 'Unknown error'}.`,
            res.emailSent ? 'success' : 'warning'
          );
        }
      } else {
        const res = await updateInquiryStatus(statusModal.id, statusModal.selected);
        if (res.success) {
          setInquiries(prev => prev.map(item => item.id === statusModal.id ? { ...item, status: statusModal.selected } : item));
          showToast(`Status updated to ${STATUS_LABEL[statusModal.selected] ?? statusModal.selected}.`, 'success');
        }
      }
    } catch (e: any) {
      showToast(e.message || 'Failed to update status', 'warning');
    } finally {
      setProcessingId(null);
      setStatusModal(prev => ({ ...prev, open: false }));
    }
  };

  /* ── Export CSV ── */
  const exportCSV = () => {
    if (inquiries.length === 0) { alert('No inquiries to export.'); return; }
    const headers = ['REF. NO.', 'FULL NAME', 'EMAIL', 'EMAIL VERIFIED', 'CONTACT', 'DECEASED', 'PLOT', 'DATE', 'TIME', 'STATUS', 'RELATION', 'REASON', 'NOTES'];
    const rows = inquiries.map(a =>
      [a.ref, a.fullName, a.email, a.emailVerified ? 'YES' : 'NO', a.phone, a.deceased, a.plot,
        a.preferredDate, a.preferredTime, a.status, a.relation, a.reason, a.notes]
        .map(cell => `"${(cell || '').replace(/"/g, '""')}"`)
        .join(',')
    );
    const csv = [headers.map(h => `"${h}"`).join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `inquiries_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  /* ── Helpers ── */
  const getViewApp = () => inquiries.find(a => a.id === viewModal.id) ?? null;
  const getStatusApp = () => inquiries.find(a => a.id === statusModal.id) ?? null;
  const getRejectApp = () => inquiries.find(a => a.id === rejectModal.id) ?? null;

  const FILTERS = [
    { key: 'all',        label: 'All',         count: counts.all },
    { key: 'pending',    label: 'Pending',      count: counts.pending },
    { key: 'accepted',   label: 'Accepted',     count: counts.accepted },
    { key: 'rejected',   label: 'Rejected',     count: counts.rejected },
    { key: 'inprogress', label: 'In Progress',  count: counts.inprogress },
  ];

  /* ── SVG Icons ── */
  const IconCheck = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
  const IconX = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
  const IconEye = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
  const IconEdit = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 20h9" />
      <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.839a.5.5 0 0 1-.62-.62l.84-2.871a2 2 0 0 1 .506-.854z" />
    </svg>
  );
  const IconMail = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
  const IconRefresh = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" />
    </svg>
  );
  const IconDownload = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
  const IconSearch = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );

  /* ════════════════════════════════════════════════════════
     RENDER
     ════════════════════════════════════════════════════════ */
  return (
    <div style={{ padding: '0 4px' }}>

      {/* ─── Toast ─── */}
      {toast && (
        <div className={`${styles.toastBanner} ${toast.type === 'success' ? styles.toastSuccess : styles.toastWarning}`}>
          <span style={{ fontSize: '1.1rem' }}>{toast.type === 'success' ? '📩' : '⚠️'}</span>
          <div style={{ flex: 1 }}>
            <div>{toast.message}</div>
            {toast.resendAction && (
              <button
                onClick={() => toast.resendAction && handleResend(toast.resendAction.id, toast.resendAction.type)}
                style={{ marginTop: '6px', background: '#c8a84b', color: '#000', border: 'none', borderRadius: '5px', padding: '3px 10px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
              >
                ↻ Retry Sending Email
              </button>
            )}
          </div>
          <button onClick={() => setToast(null)} style={{ background: 'none', border: 'none', color: '#9c9588', cursor: 'pointer', fontSize: '1rem', lineHeight: 1, padding: '2px', borderRadius: '4px' }}>✕</button>
        </div>
      )}

      {/* ─── Header ─── */}
      <div className={styles.pageHeader}>
        <h3>Inquiry Management</h3>
        <p>Review, approve, and reject cemetery inquiry submissions. Email notifications are sent automatically.</p>
      </div>

      {/* ─── Stats Cards ─── */}
      <div className={styles.statsRow}>
        {[
          { key: 'all',       label: 'Total',       count: counts.all,       sub: 'All inquiries',       accent: 'accentAll' },
          { key: 'pending',   label: 'Pending',      count: counts.pending,   sub: 'Awaiting review',     accent: 'accentPending' },
          { key: 'accepted',  label: 'Accepted',     count: counts.accepted,  sub: 'Approved inquiries',  accent: 'accentAccepted' },
          { key: 'rejected',  label: 'Rejected',     count: counts.rejected,  sub: 'Declined inquiries',  accent: 'accentRejected' },
          { key: 'inprogress',label: 'In Progress',  count: counts.inprogress,sub: 'Being processed',     accent: 'accentInprog' },
        ].map(s => (
          <div
            key={s.key}
            className={`${styles.statCard} ${styles[s.accent as keyof typeof styles]} ${currentFilter === s.key ? styles.statCardActive : ''}`}
            onClick={() => setCurrentFilter(s.key)}
            role="button"
            title={`Filter by ${s.label}`}
          >
            <span className={styles.statCardLabel}>{s.label}</span>
            <span className={styles.statCardCount}>{s.count}</span>
            <span className={styles.statCardSub}>{s.sub}</span>
          </div>
        ))}
      </div>

      {/* ─── Panel ─── */}
      <div className={styles.panel}>

        {/* Toolbar */}
        <div className={styles.panelHead}>
          <div className={styles.panelHeadLeft}>
            <span className={styles.panelTitle}>INQUIRIES</span>
            <span className={styles.panelCount}>{totalFiltered} results</span>
          </div>
          <div className={styles.panelActions}>
            <div className={styles.searchWrap}>
              <span className={styles.searchIcon}><IconSearch /></span>
              <input
                type="text"
                placeholder="Search name, ref, email…"
                className={styles.searchInput}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                id="inq-search"
              />
            </div>
            <button className={styles.btnOutline} onClick={() => { setEmailLogsModal(true); loadEmailLogs(); }} title="View email delivery logs">
              <IconMail /> Email Logs
            </button>
            <button className={styles.btnOutline} onClick={exportCSV} title="Export to CSV">
              <IconDownload /> Export
            </button>
            <button className={styles.btnOutline} onClick={loadInquiries} title="Refresh data">
              <IconRefresh /> Refresh
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className={styles.filterTabs}>
          {FILTERS.map(f => (
            <button
              key={f.key}
              className={`${styles.filterTab} ${currentFilter === f.key ? styles.filterTabActive : ''}`}
              onClick={() => setCurrentFilter(f.key)}
            >
              {f.label}
              <span className={styles.tabCount}>{f.count}</span>
            </button>
          ))}
        </div>

        {/* Table */}
        <div className={styles.tblWrapper}>
          <table className={styles.table}>
            <colgroup>
              <col /><col /><col /><col /><col /><col /><col /><col />
            </colgroup>
            <thead>
              <tr>
                <th>Ref. No.</th>
                <th>Applicant</th>
                <th>Status</th>
                <th>Deceased / Plot</th>
                <th>Schedule</th>
                <th>Contact</th>
                <th>Request Type</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8}>
                    <div style={{ padding: '60px', textAlign: 'center', color: '#7A7570' }}>
                      <span className={styles.spinnerIcon}>⏳</span> Loading inquiries…
                    </div>
                  </td>
                </tr>
              ) : totalFiltered === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className={styles.emptyState}>
                      <div className={styles.emptyIcon}>
                        <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="18" height="18" x="3" y="4" rx="2" />
                          <line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" />
                          <line x1="3" x2="21" y1="10" y2="10" />
                          <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
                        </svg>
                      </div>
                      <h5>No Inquiries Found</h5>
                      <p>{searchTerm ? `No results for "${searchTerm}". Try a different search term.` : 'No inquiries match the selected filter.'}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                pageItems.map(app => {
                  const isAccepted = app.status === 'accepted' || app.status === 'confirmed';
                  const isRejected = app.status === 'rejected';
                  const isProcessing = processingId === app.id;

                  return (
                    <tr key={app.id}>
                      {/* Ref */}
                      <td>
                        <span className={styles.appId}>{app.ref || '—'}</span>
                        {app.submittedAt && (
                          <div style={{ fontSize: '0.68rem', color: '#5A5650', marginTop: '4px' }}>
                            {new Date(app.submittedAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                        )}
                      </td>

                      {/* Applicant */}
                      <td>
                        <span className={styles.applicantName}>{app.fullName || '—'}</span>
                        <span className={styles.applicantEmail} title={app.email}>{app.email || '—'}</span>
                        <div style={{ marginTop: '4px' }}>
                          {app.emailVerified
                            ? <span className={styles.badgeVerified}><span className={styles.emailVerifiedDot} />Verified</span>
                            : <span className={styles.badgeUnverified}><span className={styles.emailUnverifiedDot} />Unverified</span>
                          }
                        </div>
                      </td>

                      {/* Status */}
                      <td>{getStatusBadge(app.status)}</td>

                      {/* Deceased / Plot */}
                      <td>
                        <div style={{ fontSize: '0.83rem', fontWeight: 500, color: 'var(--admin-text-main)' }}>
                          {app.deceased || <span style={{ color: '#5A5650' }}>—</span>}
                        </div>
                        {app.plot && (
                          <div style={{ fontSize: '0.72rem', color: '#9A8A6A', marginTop: '3px' }}>
                            Plot: <span style={{ color: '#C8A84B' }}>{app.plot}</span>
                          </div>
                        )}
                      </td>

                      {/* Schedule */}
                      <td>
                        <div className={styles.scheduleDate}>{app.formattedDate || app.preferredDate || '—'}</div>
                        {app.preferredTime && (
                          <div className={styles.scheduleTime}>{app.preferredTime}</div>
                        )}
                      </td>

                      {/* Contact */}
                      <td>
                        <div style={{ fontSize: '0.82rem' }}>{app.phone || '—'}</div>
                        {app.relation && (
                          <div style={{ fontSize: '0.7rem', color: '#7A7570', marginTop: '3px' }}>{app.relation}</div>
                        )}
                      </td>

                      {/* Reason */}
                      <td>
                        <span className={styles.reasonChip} title={app.reason}>{app.reason || '—'}</span>
                      </td>

                      {/* Actions */}
                      <td>
                        <div className={styles.actionsCell}>
                          {!isAccepted && !isRejected && (
                            <>
                              <button
                                className={styles.btnAccept}
                                onClick={() => handleAcceptDirect(app.id)}
                                disabled={isProcessing}
                                title={`Accept & send email to ${app.email}`}
                              >
                                <IconCheck />
                                {isProcessing ? '…' : 'Accept'}
                              </button>
                              <button
                                className={styles.btnReject}
                                onClick={() => setRejectModal({ open: true, id: app.id, reason: 'Schedule conflict or requirements incomplete.' })}
                                disabled={isProcessing}
                                title={`Reject & send email to ${app.email}`}
                              >
                                <IconX />
                                Reject
                              </button>
                            </>
                          )}

                          {isAccepted && (
                            <span className={`${styles.statusLabel} ${styles.statusLabelAccepted}`}>
                              <IconCheck /> Accepted
                            </span>
                          )}
                          {isRejected && (
                            <span className={`${styles.statusLabel} ${styles.statusLabelRejected}`}>
                              <IconX /> Rejected
                            </span>
                          )}

                          {(isAccepted || isRejected) && (
                            <button
                              className={styles.btnResend}
                              onClick={() => handleResend(app.id, isAccepted ? 'acceptance' : 'rejection')}
                              disabled={isProcessing}
                              title={`Resend ${isAccepted ? 'acceptance' : 'rejection'} email`}
                            >
                              <IconMail /> Resend
                            </button>
                          )}

                          <button
                            className={styles.btnIconSm}
                            onClick={() => setViewModal({ open: true, id: app.id })}
                            title="View full details"
                          >
                            <IconEye />
                          </button>
                          <button
                            className={styles.btnIconSm}
                            onClick={() => setStatusModal({ open: true, id: app.id, selected: app.status })}
                            title="Change status"
                          >
                            <IconEdit />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && totalPages > 0 && (
          <div className={styles.tableFooter}>
            <span>
              Showing {totalFiltered > 0 ? startIdx + 1 : 0}–{Math.min(startIdx + itemsPerPage, totalFiltered)} of {totalFiltered}
              {currentFilter !== 'all' && ` · Total: ${counts.all}`}
            </span>
            <div className={styles.pagination}>
              <button
                className={styles.pageBtn}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{ opacity: currentPage === 1 ? 0.4 : 1 }}
              >
                ← Prev
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => (
                <button
                  key={i}
                  className={`${styles.pageBtn} ${currentPage === i + 1 ? styles.pageBtnActive : ''}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className={styles.pageBtn}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{ opacity: currentPage === totalPages ? 0.4 : 1 }}
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ════════════════════════════════════
           REJECT MODAL
          ════════════════════════════════════ */}
      {rejectModal.open && (() => {
        const app = getRejectApp();
        if (!app) return null;
        return (
          <div className={styles.modalOverlay} onClick={e => { if (e.target === e.currentTarget) setRejectModal(p => ({ ...p, open: false })); }}>
            <div className={`${styles.modal} ${styles.modalLg}`}>
              <div className={styles.modalHeader}>
                <h3 style={{ color: '#f87171' }}>
                  <IconX /> Reject Inquiry
                </h3>
                <button className={styles.modalClose} onClick={() => setRejectModal(p => ({ ...p, open: false }))}>✕</button>
              </div>
              <div className={styles.modalBody}>
                {/* Meta */}
                <div className={styles.inquiryMetaBanner}>
                  <div>
                    <div className={styles.inquiryMetaName}>{app.fullName}</div>
                    <div style={{ fontSize: '0.8rem', color: '#7A7570' }}>
                      {app.reason} · {app.formattedDate || app.preferredDate || 'No date'}
                    </div>
                  </div>
                  <span className={styles.inquiryMetaRef}>{app.ref}</span>
                </div>

                {/* Email alert */}
                <div className={`${styles.alertInfo} ${styles.alertRed}`}>
                  <span>✉️</span>
                  <span>A rejection email will be sent automatically to <strong>{app.email}</strong>.</span>
                </div>

                {/* Reason textarea */}
                <label className={styles.modalLabel}>Reason for Rejection</label>
                <textarea
                  className={styles.modalTextarea}
                  rows={4}
                  value={rejectModal.reason}
                  onChange={e => setRejectModal(p => ({ ...p, reason: e.target.value }))}
                  placeholder="e.g. Schedule unavailable, missing valid documents, plot already reserved…"
                />
              </div>
              <div className={styles.modalFooter}>
                <button className={styles.btnCancel} onClick={() => setRejectModal(p => ({ ...p, open: false }))}>Cancel</button>
                <button
                  className={styles.btnDanger}
                  onClick={handleRejectConfirm}
                  disabled={processingId !== null}
                >
                  <IconX />
                  {processingId !== null ? 'Rejecting…' : 'Confirm & Send Email'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ════════════════════════════════════
           STATUS MODAL
          ════════════════════════════════════ */}
      {statusModal.open && (() => {
        const app = getStatusApp();
        if (!app) return null;
        return (
          <div className={styles.modalOverlay} onClick={e => { if (e.target === e.currentTarget) setStatusModal(p => ({ ...p, open: false })); }}>
            <div className={`${styles.modal} ${styles.modalLg}`}>
              <div className={styles.modalHeader}>
                <h3><IconEdit /> Update Status</h3>
                <button className={styles.modalClose} onClick={() => setStatusModal(p => ({ ...p, open: false }))}>✕</button>
              </div>
              <div className={styles.modalBody}>
                <div className={styles.inquiryMetaBanner}>
                  <div>
                    <div className={styles.inquiryMetaName}>{app.fullName}</div>
                    <div style={{ fontSize: '0.8rem', color: '#7A7570' }}>
                      {app.email} · {app.formattedDate || 'No date set'}
                    </div>
                  </div>
                  <span className={styles.inquiryMetaRef}>{app.ref}</span>
                </div>

                <label className={styles.modalLabel} style={{ marginBottom: '10px' }}>Select New Status</label>
                <div className={styles.statusGrid}>
                  {[
                    { val: 'accepted', label: 'Accept & Send Email', color: '#4ade80' },
                    { val: 'rejected', label: 'Reject & Send Email', color: '#f87171' },
                    { val: 'inprogress', label: 'Mark In Progress',  color: '#facc15' },
                    { val: 'pending',   label: 'Mark as Pending',    color: '#9ca3af' },
                  ].map(opt => (
                    <button
                      key={opt.val}
                      className={styles.statusChoice}
                      onClick={() => setStatusModal(p => ({ ...p, selected: opt.val }))}
                      style={{
                        border: `1px solid ${opt.color}`,
                        background: statusModal.selected === opt.val ? opt.color : 'transparent',
                        color: statusModal.selected === opt.val ? '#000' : opt.color,
                        fontWeight: 700,
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {(statusModal.selected === 'accepted' || statusModal.selected === 'confirmed') && (
                  <div className={`${styles.alertInfo} ${styles.alertGreen}`}>
                    <span>📧</span>
                    <span>An acceptance email will be sent to <strong>{app.email}</strong>.</span>
                  </div>
                )}
                {statusModal.selected === 'rejected' && (
                  <div className={`${styles.alertInfo} ${styles.alertRed}`}>
                    <span>📧</span>
                    <span>A rejection email will be sent to <strong>{app.email}</strong>.</span>
                  </div>
                )}
              </div>
              <div className={styles.modalFooter}>
                <button className={styles.btnCancel} onClick={() => setStatusModal(p => ({ ...p, open: false }))}>Cancel</button>
                <button className={styles.btnGold} onClick={updateStatusFromModal} disabled={processingId !== null}>
                  {processingId !== null ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ════════════════════════════════════
           VIEW DETAILS MODAL
          ════════════════════════════════════ */}
      {viewModal.open && (() => {
        const app = getViewApp();
        if (!app) return null;
        const isAccepted = app.status === 'accepted' || app.status === 'confirmed';
        const isRejected = app.status === 'rejected';
        return (
          <div className={styles.modalOverlay} onClick={e => { if (e.target === e.currentTarget) setViewModal({ open: false, id: null }); }}>
            <div className={`${styles.modal} ${styles.modalXl}`}>
              <div className={styles.modalHeader}>
                <h3><IconEye /> Inquiry Details</h3>
                <button className={styles.modalClose} onClick={() => setViewModal({ open: false, id: null })}>✕</button>
              </div>
              <div className={styles.modalBody}>
                {/* Meta banner */}
                <div className={styles.inquiryMetaBanner} style={{ marginBottom: '16px' }}>
                  <div>
                    <div className={styles.inquiryMetaName}>{app.fullName}</div>
                    <div style={{ fontSize: '0.8rem', color: '#7A7570' }}>
                      Submitted: {app.submittedAt ? new Date(app.submittedAt).toLocaleString('en-PH') : '—'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {getStatusBadge(app.status)}
                    <span className={styles.inquiryMetaRef}>{app.ref}</span>
                  </div>
                </div>

                {/* Detail grid */}
                <div className={styles.detailGrid}>
                  <div className={styles.detailCard}>
                    <span className={styles.detailCardLabel}>Email</span>
                    <span className={`${styles.detailCardValue} ${styles.highlight}`}>{app.email || '—'}</span>
                    <div style={{ marginTop: '6px' }}>
                      {app.emailVerified
                        ? <span className={styles.badgeVerified}>✓ Verified</span>
                        : <span className={styles.badgeUnverified}>⚠ Unverified</span>
                      }
                    </div>
                  </div>
                  <div className={styles.detailCard}>
                    <span className={styles.detailCardLabel}>Phone & Relation</span>
                    <span className={styles.detailCardValue}>{app.phone || '—'}</span>
                    <div style={{ fontSize: '0.78rem', color: '#9A8A6A', marginTop: '4px' }}>{app.relation || '—'}</div>
                  </div>
                  <div className={`${styles.detailCard} ${styles.fullWidth}`}>
                    <span className={styles.detailCardLabel}>Address</span>
                    <span className={styles.detailCardValue}>{app.address || '—'}</span>
                  </div>
                  <div className={styles.detailCard}>
                    <span className={styles.detailCardLabel}>Deceased</span>
                    <span className={styles.detailCardValue}>{app.deceased || '—'}</span>
                  </div>
                  <div className={styles.detailCard}>
                    <span className={styles.detailCardLabel}>Requested Plot</span>
                    <span className={`${styles.detailCardValue} ${styles.highlight}`}>{app.plot || '—'}</span>
                  </div>
                  <div className={styles.detailCard}>
                    <span className={styles.detailCardLabel}>Preferred Date</span>
                    <span className={styles.detailCardValue}>{app.formattedDate || app.preferredDate || '—'}</span>
                  </div>
                  <div className={styles.detailCard}>
                    <span className={styles.detailCardLabel}>Preferred Time</span>
                    <span className={styles.detailCardValue}>{app.preferredTime || '—'}</span>
                  </div>
                  <div className={`${styles.detailCard} ${styles.fullWidth}`}>
                    <span className={styles.detailCardLabel}>Request Type / Reason</span>
                    <span className={styles.detailCardValue}>{app.reason || '—'}</span>
                  </div>
                  <div className={`${styles.detailCard} ${styles.fullWidth}`}>
                    <span className={styles.detailCardLabel}>Additional Notes</span>
                    <span className={styles.detailCardValue} style={{ fontStyle: 'italic', color: '#9A8A6A' }}>
                      {app.notes || 'No additional notes provided.'}
                    </span>
                  </div>
                  {app.remarks && (
                    <div className={`${styles.detailCard} ${styles.fullWidth}`} style={{ borderColor: 'rgba(200,168,75,0.25)' }}>
                      <span className={styles.detailCardLabel}>Admin Remarks</span>
                      <span className={`${styles.detailCardValue} ${styles.highlight}`}>{app.remarks}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.modalFooter}>
                <div style={{ display: 'flex', gap: '8px', marginRight: 'auto', flexWrap: 'wrap' }}>
                  {!isAccepted && !isRejected && (
                    <>
                      <button
                        className={styles.btnAccept}
                        style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                        onClick={() => { setViewModal({ open: false, id: null }); handleAcceptDirect(app.id); }}
                        disabled={processingId !== null}
                      >
                        <IconCheck /> Accept & Send Email
                      </button>
                      <button
                        className={styles.btnReject}
                        style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                        onClick={() => { setViewModal({ open: false, id: null }); setRejectModal({ open: true, id: app.id, reason: 'Schedule conflict or requirements incomplete.' }); }}
                        disabled={processingId !== null}
                      >
                        <IconX /> Reject & Send Email
                      </button>
                    </>
                  )}
                  {(isAccepted || isRejected) && (
                    <button
                      className={styles.btnResend}
                      style={{ padding: '7px 14px', fontSize: '0.8rem' }}
                      onClick={() => handleResend(app.id, isAccepted ? 'acceptance' : 'rejection')}
                      disabled={processingId !== null}
                    >
                      <IconMail /> Resend Notification
                    </button>
                  )}
                </div>
                <button className={styles.btnGold} onClick={() => setViewModal({ open: false, id: null })}>Close</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ════════════════════════════════════
           EMAIL LOGS MODAL
          ════════════════════════════════════ */}
      {emailLogsModal && (
        <div className={styles.modalOverlay} onClick={e => { if (e.target === e.currentTarget) setEmailLogsModal(false); }}>
          <div className={`${styles.modal} ${styles.modalXl}`}>
            <div className={styles.modalHeader}>
              <h3><IconMail /> Email Notification Logs</h3>
              <button className={styles.modalClose} onClick={() => setEmailLogsModal(false)}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '0.82rem', color: '#7A7570' }}>
                  Audit log of all outgoing verification, acceptance, rejection, and receipt emails.
                </span>
                <button className={styles.btnOutline} onClick={loadEmailLogs} disabled={loadingLogs}>
                  <IconRefresh /> {loadingLogs ? 'Loading…' : 'Refresh'}
                </button>
              </div>

              {loadingLogs ? (
                <div style={{ padding: '50px', textAlign: 'center', color: '#7A7570' }}>
                  <span className={styles.spinnerIcon}>⏳</span> Loading logs…
                </div>
              ) : emailLogs.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#5A5650', background: 'rgba(0,0,0,0.15)', borderRadius: '10px', border: '1px solid var(--admin-border)' }}>
                  No email logs yet. Outgoing emails appear here automatically.
                </div>
              ) : (
                <div className={styles.logsWrap}>
                  <table className={styles.logsTable}>
                    <thead>
                      <tr>
                        <th>Recipient</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Timestamp</th>
                        <th>Subject / Error</th>
                      </tr>
                    </thead>
                    <tbody>
                      {emailLogs.map(log => (
                        <tr key={log.id}>
                          <td style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#C8A84B' }}>{log.recipient}</td>
                          <td><span className={styles.logTypeBadge}>{log.emailType}</span></td>
                          <td>
                            {log.status === 'Sent'
                              ? <span style={{ color: '#4ade80', fontWeight: 700, fontSize: '0.78rem' }}>✓ Sent</span>
                              : <span style={{ color: '#f87171', fontWeight: 700, fontSize: '0.78rem' }}>✗ Failed</span>
                            }
                          </td>
                          <td style={{ fontSize: '0.74rem', color: '#7A7570', whiteSpace: 'nowrap' }}>
                            {new Date(log.createdAt).toLocaleString('en-PH')}
                          </td>
                          <td style={{ fontSize: '0.76rem', color: log.errorMessage ? '#fca5a5' : '#7A7570', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={log.errorMessage || log.subject}>
                            {log.errorMessage || log.subject}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.btnGold} onClick={() => setEmailLogsModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
