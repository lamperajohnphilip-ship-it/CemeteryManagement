'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { getInquiries, updateInquiryStatus } from '../../../actions/inquiry';

interface Inquiry {
  id: number;
  ref: string;
  fullName: string;
  email: string;
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
  status: string;
  submittedAt?: string;
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filteredInquiries, setFilteredInquiries] = useState<Inquiry[]>([]);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [currentInquiryId, setCurrentInquiryId] = useState<number | null>(null);
  const [statusSelect, setStatusSelect] = useState('pending');

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewInquiryId, setViewInquiryId] = useState<number | null>(null);

  const itemsPerPage = 10;

  const loadInquiries = async () => {
    // Legacy load
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
          status: r.STATUS.toLowerCase(),
          submittedAt: r.createdAt
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

  useEffect(() => {
    loadInquiries();
  }, []);

  useEffect(() => {
    let result = inquiries;
    if (currentFilter !== 'all') {
      result = result.filter(app => app.status === currentFilter);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(app =>
        (app.fullName?.toLowerCase().includes(term)) ||
        (app.ref?.toLowerCase().includes(term)) ||
        (app.deceased?.toLowerCase().includes(term))
      );
    }
    setFilteredInquiries(result);
  }, [inquiries, currentFilter, searchTerm]);

  const countAll = inquiries.length;
  const countPending = inquiries.filter(a => a.status === 'pending').length;
  const countInprogress = inquiries.filter(a => a.status === 'inprogress').length;
  const countConfirmed = inquiries.filter(a => a.status === 'confirmed').length;
  const countCancelled = inquiries.filter(a => a.status === 'cancelled').length;

  const totalFiltered = filteredInquiries.length;
  const totalPages = Math.ceil(totalFiltered / itemsPerPage);

  const startIdx = (currentPage - 1) * itemsPerPage;
  const pageItems = filteredInquiries.slice(startIdx, startIdx + itemsPerPage);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed': return <span className={`${styles.badge} ${styles.badgeConfirmed}`}>Confirmed</span>;
      case 'inprogress': return <span className={`${styles.badge} ${styles.badgeInprogress}`}>In Progress</span>;
      case 'cancelled': return <span className={`${styles.badge} ${styles.badgeCancelled}`}>Cancelled</span>;
      default: return <span className={`${styles.badge} ${styles.badgePending}`}>Pending</span>;
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

  const updateStatus = async () => {
    if (!currentInquiryId) return;
    const index = inquiries.findIndex(a => a.id === currentInquiryId);
    if (index !== -1 && inquiries[index]) {
      const target = inquiries[index] as Inquiry;
      const oldStatus = target.status;
      const updated = [...inquiries];
      updated[index] = { ...target, status: statusSelect };
      setInquiries(updated);
      
      // Try to update in DB first, if it fails, fallback to local storage
      if (currentInquiryId.toString().length < 10) { 
        // Using length check since DB id is Int, local id is Date.now()
        await updateInquiryStatus(currentInquiryId, statusSelect);
      } else {
        localStorage.setItem('inquiries', JSON.stringify(updated));
      }

      if (oldStatus !== statusSelect) {
        let notifications = [];
        try {
          notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        } catch (e) {}
        notifications.push({
          id: Date.now(),
          type: 'status_change',
          message: `Inquiry ${updated[index].ref} status changed from ${oldStatus} to ${statusSelect}`,
          ref: updated[index].ref,
          read: false,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('notifications', JSON.stringify(notifications));
      }
      alert('Status updated successfully!');
    }
    setModalOpen(false);
  };

  const exportInquiries = () => {
    if (inquiries.length === 0) {
      alert('No inquiries to export.');
      return;
    }
    const headers = ['REF. NO.', 'FULL NAME', 'DECEASED', 'PLOT', 'DATE', 'TIME', 'CONTACT', 'STATUS', 'EMAIL', 'RELATION', 'NOTES'];
    const rows = inquiries.map(a => [
      a.ref, a.fullName, a.deceased, a.plot, a.preferredDate, a.preferredTime, a.phone, a.status, a.email, a.relation, a.notes
    ].map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(','));

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
      <div className={styles.pageHeader}>
        <h3>Inquiry Management</h3>
      </div>

      <div className={styles.statusTabs}>
        <div className={`${styles.statusTab} ${currentFilter === 'all' ? styles.statusTabActive : ''}`} onClick={() => { setCurrentFilter('all'); setCurrentPage(1); }}>
          All <span>{countAll}</span>
        </div>
        <div className={`${styles.statusTab} ${currentFilter === 'pending' ? styles.statusTabActive : ''}`} onClick={() => { setCurrentFilter('pending'); setCurrentPage(1); }}>
          Pending <span>{countPending}</span>
        </div>
        <div className={`${styles.statusTab} ${currentFilter === 'inprogress' ? styles.statusTabActive : ''}`} onClick={() => { setCurrentFilter('inprogress'); setCurrentPage(1); }}>
          In progress <span>{countInprogress}</span>
        </div>
        <div className={`${styles.statusTab} ${currentFilter === 'confirmed' ? styles.statusTabActive : ''}`} onClick={() => { setCurrentFilter('confirmed'); setCurrentPage(1); }}>
          Confirmed <span>{countConfirmed}</span>
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
              placeholder="Search..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
            <button className={styles.btnOutline} style={{ display: 'flex', alignItems: 'center' }} onClick={exportInquiries}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'8px'}}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
              Export
            </button>
            <button className={styles.btnOutline} style={{ display: 'flex', alignItems: 'center' }} onClick={loadInquiries}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'8px'}}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
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
                <th>DECEASED</th>
                <th>REQUESTED PLOT</th>
                <th>BURIAL DATE</th>
                <th>TIME</th>
                <th>CONTACT</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {totalFiltered === 0 ? (
                <tr>
                  <td colSpan={9} className={styles.emptyState}>
                    <div className={styles.icon} style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                    </div>
                    <h5>No Inquiries Found</h5>
                    <p>No inquiries match your current filters.</p>
                  </td>
                </tr>
              ) : (
                pageItems.map(app => (
                  <tr key={app.id}>
                    <td><span className={styles.appId}>{app.ref || '—'}</span></td>
                    <td>{app.fullName || '—'}</td>
                    <td>{app.deceased || '—'}</td>
                    <td>{app.plot || '—'}</td>
                    <td>{app.formattedDate || app.preferredDate || '—'}</td>
                    <td>{app.preferredTime || '—'}</td>
                    <td>{app.phone || '—'}</td>
                    <td>{getStatusBadge(app.status)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className={styles.actionBtn} onClick={() => viewDetails(app.id)} title="View Details" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                        <button className={styles.actionBtn} onClick={() => openStatusModal(app.id)} title="Update Status" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.839a.5.5 0 0 1-.62-.62l.84-2.871a2 2 0 0 1 .506-.854z"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
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

      <div style={{ color: '#7A7570', fontSize: '0.75rem', textAlign: 'right' }}>
        <span>Connected to User Inquiry System · Live updates</span>
      </div>

      {modalOpen && (
        <div className={styles.modalOverlay} onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}>
          <div className={styles.modal} style={{ maxWidth: '500px', width: '90%' }}>
            <div className={styles.modalHeader}>
              <h3>Review Inquiry</h3>
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
                        <h4 style={{ margin: 0, color: 'var(--admin-header-text)', fontSize: '1.2rem' }}>{app.fullName}</h4>
                        <span style={{ fontSize: '0.8rem', padding: '3px 8px', borderRadius: '4px', backgroundColor: 'var(--admin-input-bg)', color: 'var(--admin-text-main)', border: '1px solid var(--admin-input-border)' }}>{app.ref}</span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.9rem', color: 'var(--admin-text-main)' }}>
                        <div><strong style={{ color: 'var(--admin-text-muted)', display: 'block', fontSize: '0.75rem', marginBottom: '2px' }}>CONTACT</strong> {app.phone}</div>
                        <div><strong style={{ color: 'var(--admin-text-muted)', display: 'block', fontSize: '0.75rem', marginBottom: '2px' }}>EMAIL</strong> {app.email || '—'}</div>
                        <div style={{ gridColumn: '1 / -1' }}><strong style={{ color: 'var(--admin-text-muted)', display: 'block', fontSize: '0.75rem', marginBottom: '2px' }}>SCHEDULE</strong> {app.formattedDate || app.preferredDate} at {app.preferredTime}</div>
                        <div style={{ gridColumn: '1 / -1' }}><strong style={{ color: 'var(--admin-text-muted)', display: 'block', fontSize: '0.75rem', marginBottom: '2px' }}>DECEASED</strong> {app.deceased} ({app.relation}) - Plot: {app.plot}</div>
                        <div style={{ gridColumn: '1 / -1', padding: '10px', backgroundColor: 'var(--admin-border-subtle)', borderRadius: '5px', border: '1px solid var(--admin-border)' }}>
                          <strong style={{ color: 'var(--admin-text-muted)', display: 'block', fontSize: '0.75rem', marginBottom: '4px' }}>REASON & NOTES</strong>
                          <div style={{ fontWeight: 'bold', marginBottom: '4px', color: 'var(--admin-text-main)' }}>{app.reason}</div>
                          <div style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--admin-text-muted)' }}>{app.notes || 'No additional notes provided.'}</div>
                        </div>
                      </div>
                    </div>

                    <label style={{ display: 'block', marginBottom: '12px', fontWeight: 'bold', fontSize: '0.9rem', color: '#c9a84c' }}>ACTION REQUIRED:</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <button
                        style={{ padding: '12px', border: '1px solid #4ade80', backgroundColor: statusSelect === 'confirmed' ? '#4ade80' : 'transparent', color: statusSelect === 'confirmed' ? '#000' : '#4ade80', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onClick={() => setStatusSelect('confirmed')}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'6px'}}><polyline points="20 6 9 17 4 12"/></svg>
                        Confirm
                      </button>
                      <button
                        style={{ padding: '12px', border: '1px solid #facc15', backgroundColor: statusSelect === 'inprogress' ? '#facc15' : 'transparent', color: statusSelect === 'inprogress' ? '#000' : '#facc15', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onClick={() => setStatusSelect('inprogress')}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'6px'}}><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/></svg>
                        In Progress
                      </button>
                      <button
                        style={{ padding: '12px', border: '1px solid #f87171', backgroundColor: statusSelect === 'cancelled' ? '#f87171' : 'transparent', color: statusSelect === 'cancelled' ? '#000' : '#f87171', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onClick={() => setStatusSelect('cancelled')}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'6px'}}><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
                        Cancel
                      </button>
                      <button
                        style={{ padding: '12px', border: '1px solid #9ca3af', backgroundColor: statusSelect === 'pending' ? '#9ca3af' : 'transparent', color: statusSelect === 'pending' ? '#000' : '#9ca3af', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onClick={() => setStatusSelect('pending')}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'6px'}}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 15 15"/></svg>
                        Pending
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
            <div className={styles.modalActions} style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid var(--admin-border)' }}>
              <button className={styles.btnOutline} onClick={() => setModalOpen(false)}>Close Without Saving</button>
              <button className={styles.btnGold} onClick={updateStatus}>Save Validation</button>
            </div>
          </div>
        </div>
      )}

      {viewModalOpen && (
        <div className={styles.modalOverlay} onClick={(e) => { if (e.target === e.currentTarget) setViewModalOpen(false); }}>
          <div className={styles.modal} style={{ maxWidth: '600px', width: '90%' }}>
            <div className={styles.modalHeader}>
              <h3>Inquiry Details</h3>
              <span className={styles.modalClose} onClick={() => setViewModalOpen(false)}>&times;</span>
            </div>
            <div className={styles.modalBody}>
              {(() => {
                const app = inquiries.find(a => a.id === viewInquiryId);
                if (!app) return null;
                return (
                  <div style={{ color: 'var(--admin-text-main)', lineHeight: '1.6' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid var(--admin-border)' }}>
                      <div>
                        <h2 style={{ margin: '0 0 5px 0', color: 'var(--admin-header-text)' }}>{app.fullName}</h2>
                        <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>Submitted: {app.submittedAt ? new Date(app.submittedAt).toLocaleString() : '—'}</span>
                      </div>
                      {getStatusBadge(app.status)}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                      <div style={{ backgroundColor: 'var(--admin-panel-bg)', padding: '15px', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
                        <h4 style={{ margin: '0 0 10px 0', color: 'var(--admin-header-text)', borderBottom: '1px solid var(--admin-border)', paddingBottom: '5px' }}>Contact Info</h4>
                        <div style={{ fontSize: '0.9rem' }}><strong style={{ color: 'var(--admin-text-muted)' }}>Email:</strong> {app.email || '—'}</div>
                        <div style={{ fontSize: '0.9rem' }}><strong style={{ color: 'var(--admin-text-muted)' }}>Phone:</strong> {app.phone || '—'}</div>
                        <div style={{ fontSize: '0.9rem' }}><strong style={{ color: 'var(--admin-text-muted)' }}>Address:</strong> {app.address || '—'}</div>
                      </div>

                      <div style={{ backgroundColor: 'var(--admin-panel-bg)', padding: '15px', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
                        <h4 style={{ margin: '0 0 10px 0', color: 'var(--admin-header-text)', borderBottom: '1px solid var(--admin-border)', paddingBottom: '5px' }}>Deceased Info</h4>
                        <div style={{ fontSize: '0.9rem' }}><strong style={{ color: 'var(--admin-text-muted)' }}>Name:</strong> {app.deceased || '—'}</div>
                        <div style={{ fontSize: '0.9rem' }}><strong style={{ color: 'var(--admin-text-muted)' }}>Relation:</strong> {app.relation || '—'}</div>
                        <div style={{ fontSize: '0.9rem' }}><strong style={{ color: 'var(--admin-text-muted)' }}>Plot:</strong> {app.plot || '—'}</div>
                      </div>
                    </div>

                    <div style={{ backgroundColor: 'var(--admin-panel-bg)', padding: '15px', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
                      <h4 style={{ margin: '0 0 10px 0', color: 'var(--admin-header-text)', borderBottom: '1px solid var(--admin-border)', paddingBottom: '5px' }}>Inquiry Request</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div style={{ fontSize: '0.9rem' }}><strong style={{ color: 'var(--admin-text-muted)' }}>Date:</strong> {app.formattedDate || app.preferredDate || '—'}</div>
                        <div style={{ fontSize: '0.9rem' }}><strong style={{ color: 'var(--admin-text-muted)' }}>Time:</strong> {app.preferredTime || '—'}</div>
                        <div style={{ gridColumn: '1 / -1', fontSize: '0.9rem' }}><strong style={{ color: 'var(--admin-text-muted)' }}>Reason:</strong> {app.reason || '—'}</div>
                        <div style={{ gridColumn: '1 / -1', fontSize: '0.9rem', marginTop: '5px' }}>
                          <strong style={{ color: 'var(--admin-text-muted)', display: 'block' }}>Additional Notes:</strong>
                          <p style={{ margin: '5px 0 0 0', padding: '10px', backgroundColor: 'var(--admin-border-subtle)', borderRadius: '4px', fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--admin-text-muted)', border: '1px solid var(--admin-border)' }}>
                            {app.notes || 'No additional notes provided.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
            <div className={styles.modalActions} style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className={styles.btnGold} onClick={() => setViewModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
