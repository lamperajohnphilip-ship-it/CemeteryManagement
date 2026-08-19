'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

interface DeceasedRecord {
  id: string;
  REF_NO: string;
  NAME_OF_DECEASED: string;
  PAYORS_NAME: string;
  DATE_OF_DEATH: string;
  STATUS: string;
  PAID: number;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [records, setRecords] = useState<DeceasedRecord[]>([]);
  const [pendingInquiriesCount, setPendingInquiriesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // ── Fetch deceased records from the real database ───────
      const res = await fetch('/api/deceased');
      const data = await res.json();
      if (data.success && Array.isArray(data.records)) {
        setRecords(data.records);
      }

      // ── Fetch pending inquiries count ───────────────────────
      const iqRes = await fetch('/api/inquiries/pending-count');
      if (iqRes.ok) {
        const iqData = await iqRes.json();
        if (iqData.success) setPendingInquiriesCount(iqData.count ?? 0);
      }
    } catch (e) {
      console.error('Failed to load dashboard data:', e);
    } finally {
      setLoading(false);
    }
  };

  // ── Derived stats ─────────────────────────────────────────────
  const totalBurials = records.length;
  const totalCollected = records.reduce((sum, r) => sum + (r.PAID || 0), 0);
  const recentRecords = [...records]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getStatusBadge = (status: string) => {
    const s = (status || '').toUpperCase();
    if (s === 'PAID')    return { text: 'Paid',    cls: styles.badgePaid };
    if (s === 'PARTIAL') return { text: 'Partial', cls: styles.badgePartial };
    return                      { text: 'Unpaid',  cls: styles.badgePending };
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('en-PH', {
        year: 'numeric', month: 'short', day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const timeAgo = (dateStr: string) => {
    if (!dateStr) return '—';
    const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7)  return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''} ago`;
    return formatDate(dateStr);
  };

  return (
    <div>
      <div className={styles.secHeader}>
        <div className={styles.secHeaderText}>
          <h3>Cemetery Overview</h3>
        </div>
      </div>

      {/* ── Stats Row ───────────────────────────────────────────── */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>⚰️</div>
          <div className={styles.statNumber}>{loading ? '…' : totalBurials}</div>
          <div className={styles.statLabel}>Total Burials</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🪦</div>
          <div className={styles.statNumber}>156</div>
          <div className={styles.statLabel}>Available Plots</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📅</div>
          <div className={styles.statNumber}>{loading ? '…' : pendingInquiriesCount}</div>
          <div className={styles.statLabel}>Pending Inquiries</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>💬</div>
          <div className={styles.statNumber}>24</div>
          <div className={styles.statLabel}>SMS This Month</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>💰</div>
          <div className={styles.statNumber}>{loading ? '…' : `₱${totalCollected.toLocaleString()}`}</div>
          <div className={styles.statLabel}>Total Collected</div>
        </div>
      </div>

      {/* ── Two-column panels ──────────────────────────────────── */}
      <div className={styles.twoCol}>

        {/* Recent Burial Records */}
        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <h4>Recent Burial Records</h4>
              <p>Latest deceased entries added to inventory</p>
            </div>
          </div>
          <div className={styles.tblWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Deceased Name</th>
                  <th className={styles.th}>Date of Death</th>
                  <th className={styles.th}>Payor</th>
                  <th className={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className={styles.td} colSpan={4} style={{ textAlign: 'center', padding: '24px', color: '#7A7570' }}>
                      Loading records…
                    </td>
                  </tr>
                ) : recentRecords.length === 0 ? (
                  <tr>
                    <td className={styles.td} colSpan={4} style={{ textAlign: 'center', padding: '24px', color: '#7A7570' }}>
                      No burial records found. Add records in Deceased Inventory.
                    </td>
                  </tr>
                ) : (
                  recentRecords.map((record) => {
                    const badge = getStatusBadge(record.STATUS);
                    return (
                      <tr key={record.id} className={styles.tr}>
                        <td className={styles.td}>{record.NAME_OF_DECEASED || '—'}</td>
                        <td className={styles.td}>{formatDate(record.DATE_OF_DEATH)}</td>
                        <td className={styles.td}>{record.PAYORS_NAME || '—'}</td>
                        <td className={styles.td}>
                          <span className={badge.cls}>{badge.text}</span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity Log */}
        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <h4>Recent Activity Log</h4>
          </div>
          <div className={styles.actList}>
            {loading ? (
              <div className={styles.actItem}>
                <div className={styles.actIco}>⏳</div>
                <div className={styles.actText}>
                  <p>Loading activity…</p>
                  <span>—</span>
                </div>
              </div>
            ) : recentRecords.length === 0 ? (
              <div className={styles.actItem}>
                <div className={styles.actIco}>📋</div>
                <div className={styles.actText}>
                  <p>No recent activity</p>
                  <span>—</span>
                </div>
              </div>
            ) : (
              <>
                {recentRecords.slice(0, 4).map((record) => (
                  <div className={styles.actItem} key={record.id}>
                    <div className={styles.actIco}>⚰️</div>
                    <div className={styles.actText}>
                      <p>New burial record: {record.NAME_OF_DECEASED || 'Unknown'}</p>
                      <span>{timeAgo(record.createdAt)}</span>
                    </div>
                  </div>
                ))}
                {pendingInquiriesCount > 0 && (
                  <div className={styles.actItem}>
                    <div className={styles.actIco}>📅</div>
                    <div className={styles.actText}>
                      <p>{pendingInquiriesCount} pending {pendingInquiriesCount === 1 ? 'inquiry' : 'inquiries'} awaiting review</p>
                      <span>Needs attention</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
