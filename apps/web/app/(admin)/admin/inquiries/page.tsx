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

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filteredInquiries, setFilteredInquiries] = useState<Inquiry[]>([]);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals & action states
  const [modalOpen, setModalOpen] = useState(false);
  const [currentInquiryId, setCurrentInquiryId] = useState<number | null>(null);
  const [statusSelect, setStatusSelect] = useState('pending');

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewInquiryId, setViewInquiryId] = useState<number | null>(null);

  // Reject Modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectInquiryId, setRejectInquiryId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Email Notification Logs state
  const [emailLogsModalOpen, setEmailLogsModalOpen] = useState(false);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  const [processingId, setProcessingId] = useState<number | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'warning';
    resendAction?: { id: number; type: 'acceptance' | 'rejection' };
  } | null>(null);

  const itemsPerPage = 10;

  const showToast = (
    message: string,
    type: 'success' | 'warning' = 'success',
    resendAction?: { id: number; type: 'acceptance' | 'rejection' }
  ) => {
    setToast({ message, type, resendAction });
    setTimeout(() => setToast(null), 8000);
  };

  const loadInquiries = async () => {
    // Legacy localStorage load
    const saved = localStorage.getItem('inquiries');
    let localData: any[] = [];
    if (saved) {
      try {
        localData = JSON.parse(saved);
      } catch (e) {}
    }

    // Database load
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
          formattedDate: r.BURIAL_DATE ? new Date(r.BURIAL_DATE).toLocaleDateString('en-PH') : '',
          preferredTime: r.TIME || '',
          reason: r.reason,
          notes: r.notes || '',
          remarks: r.remarks || '',
          status: r.STATUS.toLowerCase(),
          submittedAt: r.createdAt,
        }));

        // Merge dbData and localData, preferring dbData
        const merged = [...dbData];
        for (const local of localData) {
          if (!merged.find(m => m.ref === local.ref)) {
            merged.push(local);
          }
        }

        // Sort by submittedAt / id descending
        merged.sort((a, b) => {
          if (a.submittedAt && b.submittedAt) {
            return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
          }
          return b.id - a.id;
        });

        setInquiries(merged);
      } else {
        setInquiries(localData);
      }
    } catch (e) {
      setInquiries(localData);
    }
  };

  const loadEmailLogs = async () => {
    setLoadingLogs(true);
    try {
      const res = await fetch('/api/admin/email-logs?limit=50');
      const data = await res.json();
      if (data.success && data.logs) {
        setEmailLogs(data.logs);
      }
    } catch (err) {
      console.error('Failed to load email logs:', err);
    } finally {
      setLoadingLogs(false);
    }
  };

  const openEmailLogs = () => {
    setEmailLogsModalOpen(true);
    loadEmailLogs();
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  useEffect(() => {
    let result = inquiries;
    if (currentFilter !== 'all') {
      result = result.filter(app => {
        if (currentFilter === 'accepted' || currentFilter === 'confirmed') {
          return app.status === 'accepted' || app.status === 'confirmed';
        }
        return app.status === currentFilter;
      });
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        app =>
          app.fullName?.toLowerCase().includes(term) ||
          app.ref?.toLowerCase().includes(term) ||
          app.email?.toLowerCase().includes(term) ||
          app.deceased?.toLowerCase().includes(term)
      );
    }
    setFilteredInquiries(result);
  }, [inquiries, currentFilter, searchTerm]);

  const countAll = inquiries.length;
  const countPending = inquiries.filter(a => a.status === 'pending').length;
  const countAccepted = inquiries.filter(a => a.status === 'accepted' || a.status === 'confirmed').length;
  const countInprogress = inquiries.filter(a => a.status === 'inprogress').length;
  const countRejected = inquiries.filter(a => a.status === 'rejected').length;
  const countCancelled = inquiries.filter(a => a.status === 'cancelled').length;

  const totalFiltered = filteredInquiries.length;
  const totalPages = Math.ceil(totalFiltered / itemsPerPage);

  const startIdx = (currentPage - 1) * itemsPerPage;
  const pageItems = filteredInquiries.slice(startIdx, startIdx + itemsPerPage);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
      case 'confirmed':
        return <span className={`${styles.badge} ${styles.badgeAccepted}`}>Accepted</span>;
      case 'rejected':
        return <span className={`${styles.badge} ${styles.badgeRejected}`}>Rejected</span>;
      case 'inprogress':
        return <span className={`${styles.badge} ${styles.badgeInprogress}`}>In Progress</span>;
      case 'cancelled':
        return <span className={`${styles.badge} ${styles.badgeCancelled}`}>Cancelled</span>;
      default:
        return <span className={`${styles.badge} ${styles.badgePending}`}>Pending</span>;
    }
  };

  const viewDetails = (id: number) => {
    setViewInquiryId(id);
    setViewModalOpen(true);
  };

  const openStatusModal = (id: number) => {
    setCurrentInquiryId(id);
    const app = inquiries.find(a => a.id === id);
    if (app) {
      setStatusSelect(app.status || 'pending');
    }
    setModalOpen(true);
  };

  const openRejectModal = (id: number) => {
    const target = inquiries.find(a => a.id === id);
    if (!target) return;
    setRejectInquiryId(id);
    setRejectReason('Schedule conflict or requirements incomplete.');
    setRejectModalOpen(true);
  };

  /**
   * Direct Accept Handler:
   * Sets status to Accepted & automatically sends official acceptance email.
   */
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
        setInquiries(prev =>
          prev.map(item => (item.id === id ? { ...item, status: 'accepted' } : item))
        );

        if (res.emailSent) {
          showToast(
            `✅ Inquiry accepted successfully. Acceptance email sent to ${target.email}.`,
            'success'
          );
        } else {
          showToast(
            `⚠️ Inquiry accepted, but email failed: ${res.emailError || 'Email credentials unconfigured'}.`,
            'warning',
            { id, type: 'acceptance' }
          );
        }
      } else {
        showToast(res.message || 'Failed to accept inquiry.', 'warning');
      }
    } catch (e: any) {
      showToast(e.message || 'An error occurred while accepting inquiry.', 'warning');
    } finally {
      setProcessingId(null);
    }
  };

  /**
   * Direct Reject Handler:
   * Sets status to Rejected & automatically sends official rejection email.
   */
  const handleRejectConfirm = async () => {
    if (!rejectInquiryId) return;
    const target = inquiries.find(a => a.id === rejectInquiryId);
    if (!target) return;

    setProcessingId(rejectInquiryId);

    try {
      const res = await rejectInquiry(rejectInquiryId, rejectReason);

      if (res.success) {
        setInquiries(prev =>
          prev.map(item =>
            item.id === rejectInquiryId ? { ...item, status: 'rejected', remarks: rejectReason } : item
          )
        );
        setRejectModalOpen(false);

        if (res.emailSent) {
          showToast(`Inquiry rejected. Notification email sent to ${target.email}.`, 'success');
        } else {
          showToast(
            `Inquiry rejected, but email failed: ${res.emailError || 'Email could not be delivered'}.`,
            'warning',
            { id: rejectInquiryId, type: 'rejection' }
          );
        }
      } else {
        showToast(res.message || 'Failed to reject inquiry.', 'warning');
      }
    } catch (e: any) {
      showToast(e.message || 'An error occurred while rejecting inquiry.', 'warning');
    } finally {
      setProcessingId(null);
    }
  };

  /**
   * Resends email notification (Acceptance, Rejection, or Receipt).
   */
  const handleResend = async (id: number, type: 'acceptance' | 'rejection' | 'receipt') => {
    setProcessingId(id);
    try {
      const res = await resendInquiryEmail(id, type);
      if (res.success) {
        showToast(`✅ ${res.message}`, 'success');
      } else {
        showToast(`⚠️ ${res.message}`, 'warning');
      }
    } catch (e: any) {
      showToast(e.message || 'Failed to resend email', 'warning');
    } finally {
      setProcessingId(null);
    }
  };

  const updateStatusFromModal = async () => {
    if (!currentInquiryId) return;
    const index = inquiries.findIndex(a => a.id === currentInquiryId);
    if (index !== -1 && inquiries[index]) {
      const target = inquiries[index] as Inquiry;
      const oldStatus = target.status;

      setProcessingId(currentInquiryId);

      try {
        if (statusSelect === 'accepted' || statusSelect === 'confirmed') {
          const res = await acceptInquiry(currentInquiryId);
          if (res.success) {
            const updated = [...inquiries];
            updated[index] = { ...target, status: 'accepted' };
            setInquiries(updated);

            if (res.emailSent) {
              showToast(`✅ Inquiry accepted successfully. Acceptance email sent to ${target.email}.`, 'success');
            } else {
              showToast(`⚠️ Inquiry accepted. (Email notice: ${res.emailError || 'Email could not be delivered.'})`, 'warning', {
                id: currentInquiryId,
                type: 'acceptance',
              });
            }
          } else {
            showToast(res.message || 'Failed to accept inquiry.', 'warning');
          }
        } else if (statusSelect === 'rejected') {
          const res = await rejectInquiry(currentInquiryId, target.remarks);
          if (res.success) {
            const updated = [...inquiries];
            updated[index] = { ...target, status: 'rejected' };
            setInquiries(updated);

            if (res.emailSent) {
              showToast(`Inquiry marked as rejected. Rejection email sent to ${target.email}.`, 'success');
            } else {
              showToast(`Inquiry rejected. (Email notice: ${res.emailError || 'Email could not be delivered.'})`, 'warning', {
                id: currentInquiryId,
                type: 'rejection',
              });
            }
          } else {
            showToast(res.message || 'Failed to reject inquiry.', 'warning');
          }
        } else {
          const res = await updateInquiryStatus(currentInquiryId, statusSelect);
          if (res.success) {
            const updated = [...inquiries];
            updated[index] = { ...target, status: statusSelect };
            setInquiries(updated);
            showToast(`Status updated to ${statusSelect}.`, 'success');
          }
        }

        if (oldStatus !== statusSelect) {
          let notifications = [];
          try {
            notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
          } catch (e) {}
          notifications.push({
            id: Date.now(),
            type: 'status_change',
            message: `Inquiry ${target.ref} status changed from ${oldStatus} to ${statusSelect}`,
            ref: target.ref,
            read: false,
            timestamp: new Date().toISOString(),
          });
          localStorage.setItem('notifications', JSON.stringify(notifications));
        }
      } catch (e: any) {
        showToast(e.message || 'Failed to update status', 'warning');
      } finally {
        setProcessingId(null);
      }
    }
    setModalOpen(false);
  };

  const exportInquiries = () => {
    if (inquiries.length === 0) {
      alert('No inquiries to export.');
      return;
    }
    const headers = ['REF. NO.', 'FULL NAME', 'EMAIL', 'EMAIL VERIFIED', 'CONTACT', 'DECEASED', 'PLOT', 'DATE', 'TIME', 'STATUS', 'RELATION', 'NOTES'];
    const rows = inquiries.map(a =>
      [
        a.ref,
        a.fullName,
        a.email,
        a.emailVerified ? 'YES' : 'NO',
        a.phone,
        a.deceased,
        a.plot,
        a.preferredDate,
        a.preferredTime,
        a.status,
        a.relation,
        a.notes,
      ]
        .map(cell => `"${(cell || '').replace(/"/g, '""')}"`)
        .join(',')
    );

    const csv = [headers.map(h => `"${h}"`).join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'inquiries_export.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div style={{ padding: '0 10px' }}>
      {/* Toast Notification with Resend Action */}
      {toast && (
        <div className={`${styles.toastBanner} ${toast.type === 'success' ? styles.toastSuccess : styles.toastWarning}`}>
          <span>{toast.type === 'success' ? '📩' : '⚠️'}</span>
          <div style={{ flex: 1 }}>
            <div>{toast.message}</div>
            {toast.resendAction && (
              <button
                onClick={() => {
                  if (toast.resendAction) {
                    handleResend(toast.resendAction.id, toast.resendAction.type);
                  }
                }}
                style={{
                  marginTop: '6px',
                  background: '#c8a84b',
                  color: '#000',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '3px 8px',
                  fontSize: '0.72rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                ↻ Resend Email Now
              </button>
            )}
          </div>
          <button
            onClick={() => setToast(null)}
            style={{ background: 'none', border: 'none', color: '#9c9588', cursor: 'pointer', fontSize: '1rem', lineHeight: 1 }}
          >
            &times;
          </button>
        </div>
      )}

      <div className={styles.pageHeader}>
        <h3>Inquiry Management</h3>
        <p>Review submitted citizen inquiries, verified email addresses, and approve or reject schedules with automated email notifications.</p>
      </div>

      <div className={styles.statusTabs}>
        <div className={`${styles.statusTab} ${currentFilter === 'all' ? styles.statusTabActive : ''}`} onClick={() => { setCurrentFilter('all'); setCurrentPage(1); }}>
          All <span>{countAll}</span>
        </div>
        <div className={`${styles.statusTab} ${currentFilter === 'pending' ? styles.statusTabActive : ''}`} onClick={() => { setCurrentFilter('pending'); setCurrentPage(1); }}>
          Pending <span>{countPending}</span>
        </div>
        <div className={`${styles.statusTab} ${currentFilter === 'accepted' ? styles.statusTabActive : ''}`} onClick={() => { setCurrentFilter('accepted'); setCurrentPage(1); }}>
          Accepted <span>{countAccepted}</span>
        </div>
        <div className={`${styles.statusTab} ${currentFilter === 'rejected' ? styles.statusTabActive : ''}`} onClick={() => { setCurrentFilter('rejected'); setCurrentPage(1); }}>
          Rejected <span>{countRejected}</span>
        </div>
        <div className={`${styles.statusTab} ${currentFilter === 'inprogress' ? styles.statusTabActive : ''}`} onClick={() => { setCurrentFilter('inprogress'); setCurrentPage(1); }}>
          In progress <span>{countInprogress}</span>
        </div>
        <div className={`${styles.statusTab} ${currentFilter === 'cancelled' ? styles.statusTabActive : ''}`} onClick={() => { setCurrentFilter('cancelled'); setCurrentPage(1); }}>
          Cancelled <span>{countCancelled}</span>
        </div>
      </div>

      <div className={styles.panel}>
        <div className={styles.panelHead}>
          <h4>INQUIRIES</h4>
          <div className={styles.panelActions}>
            <input
              type="text"
              placeholder="Search name, email, ref..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
            <button className={styles.btnOutline} style={{ display: 'flex', alignItems: 'center', gap: '6px' }} onClick={openEmailLogs} title="View email notification delivery audit log">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              Email Logs
            </button>
            <button className={styles.btnOutline} style={{ display: 'flex', alignItems: 'center' }} onClick={exportInquiries}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'6px'}}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Export
            </button>
            <button className={styles.btnOutline} style={{ display: 'flex', alignItems: 'center' }} onClick={loadInquiries}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'6px'}}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              Refresh
            </button>
          </div>
        </div>

        <div className={styles.tblWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>APP. ID</th>
                <th>FAMILY NAME</th>
                <th>EMAIL &amp; VERIFICATION</th>
                <th>DECEASED</th>
                <th>REQUESTED PLOT</th>
                <th>BURIAL DATE</th>
                <th>TIME</th>
                <th>CONTACT</th>
                <th>STATUS</th>
                <th style={{ textAlign: 'center' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {totalFiltered === 0 ? (
                <tr>
                  <td colSpan={10} className={styles.emptyState}>
                    <div className={styles.icon} style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                    </div>
                    <h5>No Inquiries Found</h5>
                    <p>No inquiries match your current filters.</p>
                  </td>
                </tr>
              ) : (
                pageItems.map(app => {
                  const isAccepted = app.status === 'accepted' || app.status === 'confirmed';
                  const isRejected = app.status === 'rejected';
                  const isProcessing = processingId === app.id;

                  return (
                    <tr key={app.id}>
                      <td><span className={styles.appId}>{app.ref || '—'}</span></td>
                      <td><strong>{app.fullName || '—'}</strong></td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{ color: '#c8a84b', fontSize: '0.82rem', fontFamily: 'monospace' }}>
                            {app.email || '—'}
                          </span>
                          <div>
                            {app.emailVerified ? (
                              <span className={styles.badgeVerified}>✓ Verified</span>
                            ) : (
                              <span className={styles.badgeUnverified}>Unverified</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>{app.deceased || '—'}</td>
                      <td>{app.plot || '—'}</td>
                      <td>{app.formattedDate || app.preferredDate || '—'}</td>
                      <td>{app.preferredTime || '—'}</td>
                      <td>{app.phone || '—'}</td>
                      <td>{getStatusBadge(app.status)}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                          {/* Direct Accept Action */}
                          {!isAccepted && !isRejected && (
                            <button
                              className={styles.btnAccept}
                              onClick={() => handleAcceptDirect(app.id)}
                              disabled={isProcessing}
                              title={`Accept inquiry & send acceptance email to ${app.email}`}
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              {isProcessing ? 'Accepting…' : 'Accept'}
                            </button>
                          )}

                          {/* Direct Reject Action */}
                          {!isAccepted && !isRejected && (
                            <button
                              className={styles.btnReject}
                              onClick={() => openRejectModal(app.id)}
                              disabled={isProcessing}
                              title={`Reject inquiry & send rejection email to ${app.email}`}
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                              Reject
                            </button>
                          )}

                          {isAccepted && (
                            <span className={styles.btnAccepted} title="Inquiry is accepted">
                              ✓ Accepted
                            </span>
                          )}

                          {isRejected && (
                            <span className={styles.btnRejected} title="Inquiry was rejected">
                              ✗ Rejected
                            </span>
                          )}

                          {/* Resend Email Button for Accepted or Rejected */}
                          {(isAccepted || isRejected) && (
                            <button
                              className={styles.btnResend}
                              onClick={() => handleResend(app.id, isAccepted ? 'acceptance' : 'rejection')}
                              disabled={isProcessing}
                              title={`Resend ${isAccepted ? 'acceptance' : 'rejection'} email to ${app.email}`}
                            >
                              ✉️ Resend
                            </button>
                          )}

                          {/* View Details */}
                          <button
                            className={styles.actionBtn}
                            onClick={() => viewDetails(app.id)}
                            title="View Full Details"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </button>

                          {/* Status Review Modal */}
                          <button
                            className={styles.actionBtn}
                            onClick={() => openStatusModal(app.id)}
                            title="Change Status / Review"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M12 20h9" />
                              <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.839a.5.5 0 0 1-.62-.62l.84-2.871a2 2 0 0 1 .506-.854z" />
                            </svg>
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

        <div className={styles.tableFooter}>
          <span>Showing {totalFiltered > 0 ? startIdx + 1 : 0} to {Math.min(startIdx + itemsPerPage, totalFiltered)} of {totalFiltered} inquiries (Total: {inquiries.length})</span>
          <div className={styles.pagination}>
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => (
              <button
                key={i}
                className={`${styles.pageBtn} ${currentPage === i + 1 ? styles.pageBtnActive : ''}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Rejection Confirmation Modal */}
      {rejectModalOpen && (
        <div className={styles.modalOverlay} onClick={(e) => { if (e.target === e.currentTarget) setRejectModalOpen(false); }}>
          <div className={styles.modal} style={{ maxWidth: '500px', width: '90%' }}>
            <div className={styles.modalHeader}>
              <h3 style={{ color: '#f87171' }}>Reject Cemetery Inquiry</h3>
              <span className={styles.modalClose} onClick={() => setRejectModalOpen(false)}>&times;</span>
            </div>
            <div className={styles.modalBody}>
              {(() => {
                const app = inquiries.find(a => a.id === rejectInquiryId);
                if (!app) return null;
                return (
                  <div>
                    <p style={{ margin: '0 0 14px 0', fontSize: '0.9rem', color: 'var(--admin-text-main)' }}>
                      Are you sure you want to reject inquiry <strong>{app.ref}</strong> for <strong>{app.fullName}</strong>?
                    </p>

                    <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '6px', fontSize: '0.82rem', color: '#fca5a5' }}>
                      ✉️ An official rejection notification email will be sent automatically to: <strong>{app.email}</strong>
                    </div>

                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--admin-header-text)' }}>
                      Reason for Rejection (Included in Email):
                    </label>
                    <textarea
                      value={rejectReason}
                      onChange={e => setRejectReason(e.target.value)}
                      placeholder="e.g. Schedule slot unavailable, missing valid death certificate, plot already reserved..."
                      rows={4}
                      style={{
                        width: '100%',
                        backgroundColor: 'var(--admin-input-bg)',
                        border: '1px solid var(--admin-input-border)',
                        borderRadius: '6px',
                        padding: '10px',
                        color: 'var(--admin-text-main)',
                        fontSize: '0.88rem',
                        fontFamily: 'inherit',
                        outline: 'none',
                        marginBottom: '10px',
                      }}
                    />
                  </div>
                );
              })()}
            </div>
            <div className={styles.modalActions} style={{ borderTop: '1px solid var(--admin-border)', paddingTop: '15px' }}>
              <button className={styles.btnOutline} onClick={() => setRejectModalOpen(false)}>Cancel</button>
              <button
                className={styles.btnReject}
                style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                onClick={handleRejectConfirm}
                disabled={processingId !== null}
              >
                {processingId !== null ? 'Rejecting & Sending…' : '✗ Confirm Rejection & Send Email'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review / Status Modal */}
      {modalOpen && (
        <div className={styles.modalOverlay} onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}>
          <div className={styles.modal} style={{ maxWidth: '520px', width: '90%' }}>
            <div className={styles.modalHeader}>
              <h3>Review &amp; Update Inquiry</h3>
              <span className={styles.modalClose} onClick={() => setModalOpen(false)}>&times;</span>
            </div>
            <div className={styles.modalBody}>
              {(() => {
                const app = inquiries.find(a => a.id === currentInquiryId);
                if (!app) return null;
                return (
                  <>
                    <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: 'var(--admin-panel-bg)', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                        <h4 style={{ margin: 0, color: 'var(--admin-header-text)', fontSize: '1.15rem' }}>{app.fullName}</h4>
                        <span style={{ fontSize: '0.8rem', padding: '3px 8px', borderRadius: '4px', backgroundColor: 'var(--admin-input-bg)', color: 'var(--admin-text-main)', border: '1px solid var(--admin-input-border)' }}>{app.ref}</span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.88rem', color: 'var(--admin-text-main)' }}>
                        <div>
                          <strong style={{ color: 'var(--admin-text-muted)', display: 'block', fontSize: '0.75rem', marginBottom: '2px' }}>EMAIL</strong>
                          <span style={{ color: '#c8a84b' }}>{app.email || '—'}</span>{' '}
                          {app.emailVerified ? <span style={{ color: '#86efac', fontSize: '0.72rem' }}>(✓ Verified)</span> : <span style={{ color: '#facc15', fontSize: '0.72rem' }}>(Unverified)</span>}
                        </div>
                        <div><strong style={{ color: 'var(--admin-text-muted)', display: 'block', fontSize: '0.75rem', marginBottom: '2px' }}>CONTACT</strong> {app.phone}</div>
                        <div style={{ gridColumn: '1 / -1' }}><strong style={{ color: 'var(--admin-text-muted)', display: 'block', fontSize: '0.75rem', marginBottom: '2px' }}>SCHEDULE</strong> {app.formattedDate || app.preferredDate} at {app.preferredTime}</div>
                        <div style={{ gridColumn: '1 / -1' }}><strong style={{ color: 'var(--admin-text-muted)', display: 'block', fontSize: '0.75rem', marginBottom: '2px' }}>DECEASED</strong> {app.deceased} ({app.relation}) - Plot: {app.plot}</div>
                        <div style={{ gridColumn: '1 / -1', padding: '10px', backgroundColor: 'var(--admin-border-subtle)', borderRadius: '5px', border: '1px solid var(--admin-border)' }}>
                          <strong style={{ color: 'var(--admin-text-muted)', display: 'block', fontSize: '0.75rem', marginBottom: '4px' }}>REASON &amp; NOTES</strong>
                          <div style={{ fontWeight: 'bold', marginBottom: '4px', color: 'var(--admin-text-main)' }}>{app.reason}</div>
                          <div style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--admin-text-muted)' }}>{app.notes || 'No additional notes provided.'}</div>
                        </div>
                      </div>
                    </div>

                    <label style={{ display: 'block', marginBottom: '12px', fontWeight: 'bold', fontSize: '0.9rem', color: '#c9a84c' }}>SELECT ACTION / STATUS:</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <button
                        style={{ padding: '12px', border: '1px solid #4ade80', backgroundColor: (statusSelect === 'accepted' || statusSelect === 'confirmed') ? '#4ade80' : 'transparent', color: (statusSelect === 'accepted' || statusSelect === 'confirmed') ? '#000' : '#4ade80', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onClick={() => setStatusSelect('accepted')}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'6px'}}><polyline points="20 6 9 17 4 12"/></svg>
                        Accept &amp; Email
                      </button>
                      <button
                        style={{ padding: '12px', border: '1px solid #f87171', backgroundColor: statusSelect === 'rejected' ? '#f87171' : 'transparent', color: statusSelect === 'rejected' ? '#000' : '#f87171', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onClick={() => setStatusSelect('rejected')}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'6px'}}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        Reject &amp; Email
                      </button>
                      <button
                        style={{ padding: '12px', border: '1px solid #facc15', backgroundColor: statusSelect === 'inprogress' ? '#facc15' : 'transparent', color: statusSelect === 'inprogress' ? '#000' : '#facc15', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onClick={() => setStatusSelect('inprogress')}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'6px'}}><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/></svg>
                        In Progress
                      </button>
                      <button
                        style={{ padding: '12px', border: '1px solid #9ca3af', backgroundColor: statusSelect === 'pending' ? '#9ca3af' : 'transparent', color: statusSelect === 'pending' ? '#000' : '#9ca3af', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onClick={() => setStatusSelect('pending')}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'6px'}}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 15 15"/></svg>
                        Pending
                      </button>
                    </div>

                    {(statusSelect === 'accepted' || statusSelect === 'confirmed') && (
                      <div style={{ marginTop: '12px', padding: '8px 12px', backgroundColor: 'rgba(74, 222, 128, 0.1)', border: '1px solid rgba(74, 222, 128, 0.3)', borderRadius: '6px', fontSize: '0.8rem', color: '#a5d6a7' }}>
                        📧 An automated acceptance email will be sent to <strong>{app.email}</strong> upon saving.
                      </div>
                    )}
                    {statusSelect === 'rejected' && (
                      <div style={{ marginTop: '12px', padding: '8px 12px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '6px', fontSize: '0.8rem', color: '#fca5a5' }}>
                        📧 An automated rejection email will be sent to <strong>{app.email}</strong> upon saving.
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
            <div className={styles.modalActions} style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid var(--admin-border)' }}>
              <button className={styles.btnOutline} onClick={() => setModalOpen(false)}>Cancel</button>
              <button className={styles.btnGold} onClick={updateStatusFromModal} disabled={processingId !== null}>
                {processingId !== null ? 'Saving…' : 'Save Status'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {viewModalOpen && (
        <div className={styles.modalOverlay} onClick={(e) => { if (e.target === e.currentTarget) setViewModalOpen(false); }}>
          <div className={styles.modal} style={{ maxWidth: '620px', width: '90%' }}>
            <div className={styles.modalHeader}>
              <h3>Inquiry Details</h3>
              <span className={styles.modalClose} onClick={() => setViewModalOpen(false)}>&times;</span>
            </div>
            <div className={styles.modalBody}>
              {(() => {
                const app = inquiries.find(a => a.id === viewInquiryId);
                if (!app) return null;
                const isAccepted = app.status === 'accepted' || app.status === 'confirmed';
                const isRejected = app.status === 'rejected';

                return (
                  <div style={{ color: 'var(--admin-text-main)', lineHeight: '1.6' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid var(--admin-border)' }}>
                      <div>
                        <h2 style={{ margin: '0 0 5px 0', color: 'var(--admin-header-text)', fontSize: '1.3rem' }}>{app.fullName}</h2>
                        <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
                          Reference ID: <strong style={{ color: '#c8a84b' }}>{app.ref}</strong> · Submitted: {app.submittedAt ? new Date(app.submittedAt).toLocaleString() : '—'}
                        </span>
                      </div>
                      {getStatusBadge(app.status)}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      <div style={{ backgroundColor: 'var(--admin-panel-bg)', padding: '15px', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
                        <h4 style={{ margin: '0 0 10px 0', color: 'var(--admin-header-text)', borderBottom: '1px solid var(--admin-border)', paddingBottom: '5px' }}>Contact Information</h4>
                        <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                          <strong style={{ color: 'var(--admin-text-muted)' }}>Email:</strong>{' '}
                          <span style={{ color: '#c8a84b' }}>{app.email || '—'}</span>
                          <div style={{ marginTop: '3px' }}>
                            {app.emailVerified ? (
                              <span className={styles.badgeVerified}>✓ Verified Email</span>
                            ) : (
                              <span className={styles.badgeUnverified}>Unverified</span>
                            )}
                          </div>
                        </div>
                        <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}><strong style={{ color: 'var(--admin-text-muted)' }}>Phone:</strong> {app.phone || '—'}</div>
                        <div style={{ fontSize: '0.9rem' }}><strong style={{ color: 'var(--admin-text-muted)' }}>Address:</strong> {app.address || '—'}</div>
                      </div>

                      <div style={{ backgroundColor: 'var(--admin-panel-bg)', padding: '15px', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
                        <h4 style={{ margin: '0 0 10px 0', color: 'var(--admin-header-text)', borderBottom: '1px solid var(--admin-border)', paddingBottom: '5px' }}>Deceased &amp; Plot Details</h4>
                        <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}><strong style={{ color: 'var(--admin-text-muted)' }}>Deceased:</strong> {app.deceased || '—'}</div>
                        <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}><strong style={{ color: 'var(--admin-text-muted)' }}>Relation:</strong> {app.relation || '—'}</div>
                        <div style={{ fontSize: '0.9rem' }}><strong style={{ color: 'var(--admin-text-muted)' }}>Plot:</strong> {app.plot || '—'}</div>
                      </div>
                    </div>

                    <div style={{ backgroundColor: 'var(--admin-panel-bg)', padding: '15px', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
                      <h4 style={{ margin: '0 0 10px 0', color: 'var(--admin-header-text)', borderBottom: '1px solid var(--admin-border)', paddingBottom: '5px' }}>Inquiry Request &amp; Schedule</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div style={{ fontSize: '0.9rem' }}><strong style={{ color: 'var(--admin-text-muted)' }}>Request Type:</strong> {app.reason || '—'}</div>
                        <div style={{ fontSize: '0.9rem' }}><strong style={{ color: 'var(--admin-text-muted)' }}>Schedule:</strong> {app.formattedDate || app.preferredDate || '—'} at {app.preferredTime || '—'}</div>
                        <div style={{ gridColumn: '1 / -1', fontSize: '0.9rem', marginTop: '5px' }}>
                          <strong style={{ color: 'var(--admin-text-muted)', display: 'block', marginBottom: '4px' }}>Additional Notes:</strong>
                          <p style={{ margin: '0', padding: '10px', backgroundColor: 'var(--admin-border-subtle)', borderRadius: '4px', fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--admin-text-muted)', border: '1px solid var(--admin-border)' }}>
                            {app.notes || 'No additional notes provided.'}
                          </p>
                        </div>
                        {app.remarks && (
                          <div style={{ gridColumn: '1 / -1', fontSize: '0.9rem', marginTop: '5px' }}>
                            <strong style={{ color: 'var(--admin-text-muted)', display: 'block', marginBottom: '4px' }}>Admin Remarks / Reason:</strong>
                            <p style={{ margin: '0', padding: '10px', backgroundColor: 'rgba(200, 168, 75, 0.08)', borderRadius: '4px', fontSize: '0.85rem', color: '#c8a84b', border: '1px solid rgba(200, 168, 75, 0.2)' }}>
                              {app.remarks}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {!isAccepted && !isRejected && (
                          <>
                            <button
                              className={styles.btnAccept}
                              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                              onClick={() => {
                                setViewModalOpen(false);
                                handleAcceptDirect(app.id);
                              }}
                              disabled={processingId !== null}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                              Accept &amp; Send Email
                            </button>
                            <button
                              className={styles.btnReject}
                              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                              onClick={() => {
                                setViewModalOpen(false);
                                openRejectModal(app.id);
                              }}
                              disabled={processingId !== null}
                            >
                              Reject &amp; Send Email
                            </button>
                          </>
                        )}

                        {(isAccepted || isRejected) && (
                          <button
                            className={styles.btnResend}
                            style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                            onClick={() => handleResend(app.id, isAccepted ? 'acceptance' : 'rejection')}
                            disabled={processingId !== null}
                          >
                            ✉️ Resend Notification Email
                          </button>
                        )}
                      </div>

                      <button className={styles.btnGold} onClick={() => setViewModalOpen(false)}>
                        Close
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Outgoing Email Notification Audit Logs Modal */}
      {emailLogsModalOpen && (
        <div className={styles.modalOverlay} onClick={(e) => { if (e.target === e.currentTarget) setEmailLogsModalOpen(false); }}>
          <div className={styles.modal} style={{ maxWidth: '750px', width: '92%' }}>
            <div className={styles.modalHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.2rem' }}>✉️</span>
                <h3 style={{ margin: 0 }}>Outgoing Email Notification Logs</h3>
              </div>
              <span className={styles.modalClose} onClick={() => setEmailLogsModalOpen(false)}>&times;</span>
            </div>
            <div className={styles.modalBody}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
                  Audit log of all verification, acceptance, rejection, and receipt emails dispatched by the system.
                </span>
                <button className={styles.btnOutline} onClick={loadEmailLogs} disabled={loadingLogs}>
                  {loadingLogs ? 'Loading…' : '↻ Refresh Logs'}
                </button>
              </div>

              {loadingLogs ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
                  Loading email notification logs…
                </div>
              ) : emailLogs.length === 0 ? (
                <div style={{ padding: '30px', textAlign: 'center', color: 'var(--admin-text-muted)', backgroundColor: 'var(--admin-panel-bg)', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
                  No email logs recorded yet. Outgoing emails will automatically appear here.
                </div>
              ) : (
                <div style={{ maxHeight: '420px', overflowY: 'auto', border: '1px solid var(--admin-border)', borderRadius: '8px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                    <thead>
                      <tr style={{ background: 'var(--admin-table-hdr-bg)', borderBottom: '1px solid var(--admin-border)', textAlign: 'left', color: '#c8a84b' }}>
                        <th style={{ padding: '10px 12px' }}>RECIPIENT</th>
                        <th style={{ padding: '10px 12px' }}>TYPE</th>
                        <th style={{ padding: '10px 12px' }}>STATUS</th>
                        <th style={{ padding: '10px 12px' }}>TIMESTAMP</th>
                        <th style={{ padding: '10px 12px' }}>DETAILS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {emailLogs.map(log => (
                        <tr key={log.id} style={{ borderBottom: '1px solid var(--admin-border-subtle)' }}>
                          <td style={{ padding: '10px 12px', fontFamily: 'monospace', color: 'var(--admin-text-main)' }}>
                            {log.recipient}
                          </td>
                          <td style={{ padding: '10px 12px' }}>
                            <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', backgroundColor: 'rgba(200, 168, 75, 0.1)', color: '#c8a84b', border: '1px solid rgba(200, 168, 75, 0.25)' }}>
                              {log.emailType}
                            </span>
                          </td>
                          <td style={{ padding: '10px 12px' }}>
                            {log.status === 'Sent' ? (
                              <span style={{ color: '#86efac', fontWeight: 'bold' }}>✓ Sent</span>
                            ) : (
                              <span style={{ color: '#f87171', fontWeight: 'bold' }}>✗ Failed</span>
                            )}
                          </td>
                          <td style={{ padding: '10px 12px', color: 'var(--admin-text-muted)', fontSize: '0.76rem' }}>
                            {new Date(log.createdAt).toLocaleString('en-PH')}
                          </td>
                          <td style={{ padding: '10px 12px', fontSize: '0.75rem', color: log.errorMessage ? '#fca5a5' : 'var(--admin-text-muted)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {log.errorMessage || log.subject}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className={styles.modalActions} style={{ borderTop: '1px solid var(--admin-border)', paddingTop: '14px' }}>
              <button className={styles.btnGold} onClick={() => setEmailLogsModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

