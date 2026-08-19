'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { getArchivedRecords, unarchiveDeceasedRecord } from '../../../actions/deceased';

interface ArchivedRecord {
  id: string;
  ref: string;
  payor: string;
  deceased: string;
  address: string;
  contact: string;
  birthDate: string;
  deathDate: string;
  yearPaid: string;
  totalAmount: number;
  amountPaid: number;
  balance: number;
  paymentStatus: string;
  remarks: string;
  archivedAt: string | null;
  archiveReason: string | null;
}

function fmtNum(n: number) {
  return (parseFloat(n as any) || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDate(d: string | null) {
  if (!d) return '—';
  const date = new Date(d);
  return date.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function ArchivePage() {
  const [records, setRecords] = useState<ArchivedRecord[]>([]);
  const [filtered, setFiltered] = useState<ArchivedRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [restoring, setRestoring] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    loadArchived();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      records.filter(r =>
        (r.deceased || '').toLowerCase().includes(q) ||
        (r.payor || '').toLowerCase().includes(q) ||
        (r.ref || '').toLowerCase().includes(q) ||
        (r.archiveReason || '').toLowerCase().includes(q)
      )
    );
  }, [search, records]);

  const loadArchived = async () => {
    setLoading(true);
    try {
      const res = await getArchivedRecords();
      if (res.success && res.records) {
        const mapped: ArchivedRecord[] = res.records.map((r: any) => ({
          id: r.id,
          ref: r.REF_NO,
          payor: r.PAYORS_NAME,
          contact: r.CONTACT_NO,
          deceased: r.NAME_OF_DECEASED,
          address: r.ADDRESS,
          birthDate: r.DATE_OF_BIRTH ? new Date(r.DATE_OF_BIRTH).toISOString().substring(0, 10) : '',
          deathDate: r.DATE_OF_DEATH ? new Date(r.DATE_OF_DEATH).toISOString().substring(0, 10) : '',
          yearPaid: r.YEAR?.toString() || '',
          totalAmount: r.TOTAL_DUE,
          amountPaid: r.PAID,
          balance: r.BALANCE,
          paymentStatus: (r.STATUS || 'pending').toLowerCase(),
          remarks: r.REMARKS || '',
          archivedAt: r.archivedAt || null,
          archiveReason: r.archiveReason || null,
        }));
        setRecords(mapped);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleRestoreSelected = () => {
    if (selectedIds.size === 0) return alert('Select at least one record to restore.');
    setShowRestoreModal(true);
  };

  const executeRestore = async () => {
    setRestoring(true);
    const count = selectedIds.size;
    for (const id of Array.from(selectedIds)) {
      await unarchiveDeceasedRecord(id);
    }
    await loadArchived();
    setSelectedIds(new Set());
    setRestoring(false);
    setShowRestoreModal(false);
    showToast(`✅ ${count} record(s) restored to Deceased Information.`);
  };

  const toggleSelect = (id: string, checked: boolean) => {
    const s = new Set(selectedIds);
    if (checked) s.add(id); else s.delete(id);
    setSelectedIds(s);
  };

  const toggleAll = (checked: boolean) => {
    setSelectedIds(checked ? new Set(filtered.map(r => r.id)) : new Set());
  };

  return (
    <div className={styles.page}>
      {/* Toast */}
      {toastMsg && <div className={styles.toast}>{toastMsg}</div>}

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerIcon}>📦</div>
          <div>
            <h2 className={styles.title}>Archive</h2>
          </div>
        </div>
        <div className={styles.headerStats}>
          <div className={styles.statPill}>
            <span className={styles.statNum}>{records.length}</span>
            <span className={styles.statLabel}>Total Archived</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            className={styles.searchInput}
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, payor, ref, or reason…"
          />
        </div>
        <button
          className={`${styles.restoreBtn} ${selectedIds.size === 0 ? styles.restoreBtnDisabled : ''}`}
          onClick={handleRestoreSelected}
          disabled={selectedIds.size === 0}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
          </svg>
          Restore Selected ({selectedIds.size})
        </button>
      </div>

      {/* Table */}
      <div className={styles.panel}>
        <div className={styles.panelHead}>
          <h4>Archived Records</h4>
          <p>Showing {filtered.length} of {records.length} archived entries</p>
        </div>
        <div className={styles.tableWrap}>
          {loading ? (
            <div className={styles.emptyState}>
              <div className={styles.spinner}/>
              <p>Loading archived records…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📭</div>
              <h5>No Archived Records</h5>
              <p>{search ? 'No records match your search.' : 'Archive records from Deceased Information to see them here.'}</p>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}><input type="checkbox" onChange={e => toggleAll(e.target.checked)} checked={selectedIds.size === filtered.length && filtered.length > 0} /></th>
                  <th className={styles.th}>REF. NO.</th>
                  <th className={styles.th}>PAYOR'S NAME</th>
                  <th className={styles.th}>NAME OF DECEASED</th>
                  <th className={styles.th}>ADDRESS</th>
                  <th className={styles.th}>DATE OF DEATH</th>
                  <th className={styles.th}>YEAR</th>
                  <th className={styles.th}>TOTAL DUE</th>
                  <th className={styles.th}>STATUS</th>
                  <th className={styles.th}>ARCHIVED ON</th>
                  <th className={styles.th}>REASON</th>
                  <th className={styles.th}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className={`${styles.tr} ${selectedIds.has(r.id) ? styles.trSelected : ''}`}>
                    <td className={styles.td}>
                      <input type="checkbox" checked={selectedIds.has(r.id)} onChange={e => toggleSelect(r.id, e.target.checked)} />
                    </td>
                    <td className={styles.td}><span className={styles.refBadge}>{r.ref}</span></td>
                    <td className={styles.td}>{r.payor}</td>
                    <td className={styles.td}><strong>{r.deceased}</strong></td>
                    <td className={styles.td}>{r.address}</td>
                    <td className={styles.td}>{fmtDate(r.deathDate)}</td>
                    <td className={styles.td}>{r.yearPaid}</td>
                    <td className={styles.td}>₱{fmtNum(r.totalAmount)}</td>
                    <td className={styles.td}>
                      <span className={`${styles.badge} ${r.paymentStatus === 'paid' ? styles.badgePaid : r.paymentStatus === 'partial' ? styles.badgePartial : styles.badgePending}`}>
                        {r.paymentStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className={styles.td}>{fmtDate(r.archivedAt)}</td>
                    <td className={styles.td}><span className={styles.reason}>{r.archiveReason || <em style={{color:'#5A5550'}}>—</em>}</span></td>
                    <td className={styles.td}>
                      <button className={styles.restoreRowBtn} onClick={async () => {
                        await unarchiveDeceasedRecord(r.id);
                        await loadArchived();
                        showToast('✅ Record restored successfully.');
                      }}>
                        ↩ Restore
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Restore Modal */}
      {showRestoreModal && (
        <div className={styles.modal}>
          <div className={styles.modalBox}>
            <div className={styles.modalHeader}>
              <h3>↩ Restore Records</h3>
              <span className={styles.modalClose} onClick={() => setShowRestoreModal(false)}>×</span>
            </div>
            <div className={styles.modalBody}>
              <p>
                You are about to restore <strong>{selectedIds.size}</strong> record(s) back to the{' '}
                <strong>Deceased Information</strong> inventory. They will no longer appear in the Archive.
              </p>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setShowRestoreModal(false)} disabled={restoring}>Cancel</button>
              <button className={styles.confirmRestoreBtn} onClick={executeRestore} disabled={restoring}>
                {restoring ? 'Restoring…' : '↩ Yes, Restore'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
