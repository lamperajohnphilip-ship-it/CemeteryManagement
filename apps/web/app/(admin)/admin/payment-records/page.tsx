'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { getDeceasedRecords } from '../../../actions/deceased';

interface PaymentRecord {
  id: string;
  payorName: string;
  deceasedName: string;
  orNo: string;
  amountDue: number;
  amountPaid: number;
  datePaid: string;
  method: string;
  yearCovered: string;
  dueDate: string;
  remarks: string;
  status: string;
  ref: string;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<PaymentRecord[]>([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');

  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  // Modal states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generateYear, setGenerateYear] = useState('all');
  const [currentReceipt, setCurrentReceipt] = useState<PaymentRecord | null>(null);

  // Delete State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<PaymentRecord | null>(null);

  // Update Balance States
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentUpdateRecord, setCurrentUpdateRecord] = useState<PaymentRecord | null>(null);
  const [addAmountPaid, setAddAmountPaid] = useState('');
  const [editAmountDue, setEditAmountDue] = useState('');
  const [editAmountPaid, setEditAmountPaid] = useState('');

  // Form states
  const [formDeceased, setFormDeceased] = useState('');
  const [formOR, setFormOR] = useState('');
  const [formAmountDue, setFormAmountDue] = useState('');
  const [formAmountPaid, setFormAmountPaid] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formMethod, setFormMethod] = useState('Cash');
  const [formYear, setFormYear] = useState('');
  const [formRemarks, setFormRemarks] = useState('');
  const [formPayor, setFormPayor] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [formDueDate, setFormDueDate] = useState('');

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<{ ts: string, user: string, action: string }[]>([]);

  useEffect(() => {
    loadData();
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'cemeteryPayments') loadData();
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const loadData = async () => {
    let dbRecords: PaymentRecord[] = [];
    try {
      const res = await getDeceasedRecords();
      if (res.success && res.records) {
        dbRecords = res.records.map((r: any) => ({
          id: r.id,
          payorName: r.PAYORS_NAME || 'Unknown',
          deceasedName: r.NAME_OF_DECEASED || 'Unknown',
          orNo: '',
          amountDue: r.TOTAL_DUE || 0,
          amountPaid: r.PAID || 0,
          datePaid: '',
          method: '',
          yearCovered: r.YEAR?.toString() || new Date().getFullYear().toString(),
          dueDate: '',
          remarks: r.REMARKS || '',
          status: 'pending',
          ref: r.REF_NO || `PAY-${Math.floor(1000 + Math.random() * 9000)}`
        }));
      }
    } catch(e) {
      console.error("Failed to load deceased records from DB", e);
    }

    const saved = localStorage.getItem('cemeteryPayments');
    const today = new Date().toISOString().split('T')[0] || '';
    const getComputedStatus = (p: any) => {
      const dueVal = parseFloat(p.amountDue as any) || 0;
      const paidVal = parseFloat(p.amountPaid as any) || 0;
      if (paidVal >= dueVal && dueVal > 0) return 'paid';
      if (paidVal >= dueVal && dueVal === 0 && paidVal > 0) return 'paid';
      if (p.dueDate && p.dueDate < today) return 'overdue';
      if (paidVal > 0 && paidVal < dueVal) return 'overdue';
      if (p.status === 'partial') return 'overdue';
      return p.status || 'pending';
    };

    let localPayments: PaymentRecord[] = [];
    if (saved) {
      try {
        localPayments = JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }

    // Merge DB records into localPayments
    const localNamesMap = new Map<string, number>();
    localPayments.forEach((p, idx) => localNamesMap.set(p.deceasedName.toLowerCase(), idx));

    for (const dbr of dbRecords) {
      if (!localNamesMap.has(dbr.deceasedName.toLowerCase())) {
        localPayments.push(dbr);
      } else {
        const idx = localNamesMap.get(dbr.deceasedName.toLowerCase());
        if (idx !== undefined && localPayments[idx]) {
          localPayments[idx].amountDue = dbr.amountDue;
          if (dbr.amountPaid > localPayments[idx].amountPaid) {
            localPayments[idx].amountPaid = dbr.amountPaid;
          }
        }
      }
    }

    // Exclude previously deleted records
    let deletedIds: string[] = [];
    try {
      deletedIds = JSON.parse(localStorage.getItem('deletedPaymentIds') || '[]');
    } catch (e) {}

    localPayments = localPayments.filter(p => !deletedIds.includes(p.id) && !deletedIds.includes(p.ref));

    if (localPayments.length > 0) {
      const parsed = localPayments.map((p: any) => ({ ...p, status: getComputedStatus(p) }));
      setPayments(parsed);
      setFilteredPayments(parsed);
      localStorage.setItem('cemeteryPayments', JSON.stringify(parsed));
    } else {
      const mockPayments = [
        { id: '1', payorName: 'Juan Dela Cruz', deceasedName: 'Maria Dela Cruz', orNo: 'OR-2026-0001', amountDue: 500, amountPaid: 500, datePaid: '2026-03-01', method: 'Cash', yearCovered: '2026', dueDate: '2026-03-15', remarks: '', status: 'paid', ref: 'PAY-1001' },
        { id: '2', payorName: 'Maria Santos', deceasedName: 'Pedro Santos', orNo: 'OR-2026-0002', amountDue: 750, amountPaid: 400, datePaid: '2026-02-15', method: 'GCash', yearCovered: '2026', dueDate: '2026-02-28', remarks: 'Partial payment', status: 'overdue', ref: 'PAY-1002' },
        { id: '3', payorName: 'Jose Rodriguez', deceasedName: 'Ana Rodriguez', orNo: '', amountDue: 600, amountPaid: 0, datePaid: '', method: '', yearCovered: '2025', dueDate: '2025-12-15', remarks: '', status: 'overdue', ref: 'PAY-1003' },
      ].filter(p => !deletedIds.includes(p.id) && !deletedIds.includes(p.ref));
      setPayments(mockPayments);
      setFilteredPayments(mockPayments);
      localStorage.setItem('cemeteryPayments', JSON.stringify(mockPayments));
    }

    setAuditLogs([
      { ts: new Date().toISOString(), user: 'Admin Jasaan', action: 'System started' }
    ]);
  };

  useEffect(() => {
    let result = [...payments];

    // Remove redundant identical records (e.g., from duplicate imports)
    const uniqueResult: PaymentRecord[] = [];
    const seen = new Set();
    for (const p of result) {
      const key = `${p.deceasedName}-${p.orNo}-${p.amountPaid}-${p.datePaid}-${p.payorName}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueResult.push(p);
      }
    }
    result = uniqueResult;

    if (searchQuery) {
      const sq = searchQuery.toLowerCase();
      result = result.filter(p => 
        (p.payorName || '').toLowerCase().includes(sq) || 
        (p.deceasedName || '').toLowerCase().includes(sq) || 
        (p.orNo || '').toLowerCase().includes(sq) || 
        (p.ref || '').toLowerCase().includes(sq)
      );
    }
    if (statusFilter !== 'all') result = result.filter(p => p.status === statusFilter);
    if (methodFilter !== 'all') result = result.filter(p => p.method === methodFilter);
    if (yearFilter !== 'all') result = result.filter(p => p.yearCovered === yearFilter);
    
    setFilteredPayments(result);
    setPage(1);
  }, [payments, searchQuery, statusFilter, methodFilter, yearFilter]);

  const totalCollected = payments.reduce((sum, p) => sum + p.amountPaid, 0);
  const countPaid = payments.filter(p => p.status === 'paid').length;
  const countOverdue = payments.filter(p => p.status === 'overdue').length;
  const countPending = payments.filter(p => p.status === 'pending').length;

  const uniqueYears = Array.from(new Set(payments.map(p => p.yearCovered).filter(Boolean))).sort((a, b) => Number(b) - Number(a));

  const pageItems = filteredPayments.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid': return <span className={`${styles.badge} ${styles.badgePaid}`}>PAID</span>;
      case 'partial': return <span className={`${styles.badge} ${styles.badgePartial}`}>PARTIAL</span>;
      case 'pending': return <span className={`${styles.badge} ${styles.badgePending}`}>PENDING</span>;
      case 'overdue': return <span className={`${styles.badge} ${styles.badgeOverdue}`}>OVERDUE</span>;
      default: return <span className={`${styles.badge} ${styles.badgeNeutral}`}>{status.toUpperCase()}</span>;
    }
  };

  const calculateBalance = (deceasedName: string) => {
    const records = payments.filter(p => p.deceasedName === deceasedName);
    if (records.length === 0) return 0;
    const totalDue = Math.max(...records.map(r => r.amountDue));
    const totalPaid = records.reduce((sum, r) => sum + r.amountPaid, 0);
    return Math.max(0, totalDue - totalPaid);
  };

  const deceasedSuggestions = payments
    .filter(p => !formDeceased || (p.deceasedName || '').toLowerCase().includes(formDeceased.toLowerCase()))
    .reduce((unique: PaymentRecord[], item) => {
      if (!unique.find(i => i.deceasedName === item.deceasedName)) unique.push(item);
      return unique;
    }, []);

  const syncInventoryBalance = (deceasedName: string, updatedPaymentsList: PaymentRecord[]) => {
    const rawInv = localStorage.getItem('cemeteryInventory');
    if (!rawInv) return;
    try {
      let inv = JSON.parse(rawInv);
      const idx = inv.findIndex((r: any) => (r.deceased || '').toLowerCase() === deceasedName.toLowerCase());
      if (idx !== -1) {
        const related = updatedPaymentsList.filter(p => (p.deceasedName || '').toLowerCase() === deceasedName.toLowerCase());
        const totalPaid = related.reduce((sum, p) => sum + (parseFloat(p.amountPaid as any) || 0), 0);
        const totalDue = related.length > 0 ? Math.max(...related.map(r => parseFloat(r.amountDue as any) || 0)) : inv[idx].totalAmount;
        const balance = Math.max(0, totalDue - totalPaid);
        let newStatus = 'pending';
        if (totalDue > 0 && totalPaid >= totalDue) newStatus = 'paid';
        else if (totalPaid > 0) newStatus = 'overdue';
        inv[idx].amountPaid = totalPaid;
        inv[idx].totalAmount = totalDue;
        inv[idx].balance = balance;
        inv[idx].paymentStatus = newStatus;
        localStorage.setItem('cemeteryInventory', JSON.stringify(inv));
      }
    } catch(e) {}
  };

  const handleAmountOrDateChange = (field: string, value: string) => {
    let nextDue = formAmountDue;
    let nextPaid = formAmountPaid;
    let nextDate = formDate;

    if (field === 'amountDue') {
      nextDue = value;
      setFormAmountDue(value);
    } else if (field === 'amountPaid') {
      nextPaid = value;
      setFormAmountPaid(value);
    } else if (field === 'date') {
      nextDate = value;
      setFormDate(value);
    }

    const amt = parseFloat(nextPaid) || parseFloat(nextDue) || 0;
    if (amt >= 1000) {
      const years = Math.floor(amt / 1000);
      const base = nextDate ? new Date(nextDate) : new Date();
      base.setFullYear(base.getFullYear() + years);
      setFormDueDate(base.toISOString().split('T')[0] || '');
    }
  };

  const handleSavePayment = () => {
    if (!formOR || !formAmountDue || !formAmountPaid || !formDate || !formDeceased) {
      alert("Please fill all required fields.");
      return;
    }
    const due = parseFloat(formAmountDue);
    const paid = parseFloat(formAmountPaid);
    const today = new Date().toISOString().split('T')[0] ?? '';
    const newPayment: PaymentRecord = {
      id: Date.now().toString(),
      ref: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
      payorName: formPayor || 'Guest Payor',
      deceasedName: formDeceased,
      orNo: formOR,
      amountDue: due,
      amountPaid: paid,
      datePaid: formDate,
      method: formMethod,
      yearCovered: formYear,
      dueDate: formDueDate,
      remarks: formRemarks,
      status: paid >= due ? 'paid' : (formDueDate && formDueDate < today) ? 'overdue' : paid > 0 ? 'overdue' : 'pending'
    };
    const updatedPayments = [newPayment, ...payments];
    setPayments(updatedPayments);
    localStorage.setItem('cemeteryPayments', JSON.stringify(updatedPayments));
    syncInventoryBalance(newPayment.deceasedName, updatedPayments);
    setAuditLogs([{ ts: new Date().toISOString(), user: 'Admin Jasaan', action: `Recorded payment ${newPayment.orNo} for ${newPayment.deceasedName}` }, ...auditLogs]);
    setShowPaymentModal(false);
    setFormOR(''); setFormAmountDue(''); setFormAmountPaid(''); setFormDeceased(''); setFormYear(''); setFormRemarks(''); setFormPayor(''); setFormDueDate('');
  };

  const viewReceipt = (p: PaymentRecord) => {
    setCurrentReceipt(p);
    setShowReceiptModal(true);
  };

  const openUpdatePayment = (p: PaymentRecord) => {
    setCurrentUpdateRecord(p);
    setEditAmountDue(p.amountDue.toString());
    setEditAmountPaid(p.amountPaid.toString());
    setAddAmountPaid('');
    setShowUpdateModal(true);
  };

  const handleUpdatePayment = () => {
    if (!currentUpdateRecord) return;
    let newDue = parseFloat(editAmountDue);
    let newPaid = parseFloat(editAmountPaid);
    if (isNaN(newDue) || newDue < 0) newDue = currentUpdateRecord.amountDue;
    if (isNaN(newPaid) || newPaid < 0) newPaid = currentUpdateRecord.amountPaid;
    if (addAmountPaid) {
      const addedAmount = parseFloat(addAmountPaid);
      if (!isNaN(addedAmount) && addedAmount > 0) newPaid += addedAmount;
    }
    const today = new Date().toISOString().split('T')[0] ?? '';
    const updatedPayments = payments.map(p => {
      if (p.id === currentUpdateRecord.id) {
        return {
          ...p,
          amountDue: newDue,
          amountPaid: newPaid,
          status: newPaid >= newDue ? 'paid' : (p.dueDate && p.dueDate < today) ? 'overdue' : newPaid > 0 ? 'overdue' : 'pending'
        };
      }
      return p;
    });
    setPayments(updatedPayments);
    localStorage.setItem('cemeteryPayments', JSON.stringify(updatedPayments));
    syncInventoryBalance(currentUpdateRecord.deceasedName, updatedPayments);
    setAuditLogs([{ ts: new Date().toISOString(), user: 'Admin Jasaan', action: `Managed balance for ${currentUpdateRecord.deceasedName} (Due: ₱${newDue}, Paid: ₱${newPaid})` }, ...auditLogs]);
    setShowUpdateModal(false);
    setCurrentUpdateRecord(null);
  };

  const openDeleteModal = (record: PaymentRecord) => {
    setRecordToDelete(record);
    setShowDeleteModal(true);
  };

  const confirmDeletePayment = () => {
    if (!recordToDelete) return;
    const target = recordToDelete;

    let deletedIds: string[] = [];
    try {
      deletedIds = JSON.parse(localStorage.getItem('deletedPaymentIds') || '[]');
    } catch (e) {}
    if (!deletedIds.includes(target.id)) deletedIds.push(target.id);
    if (target.ref && !deletedIds.includes(target.ref)) deletedIds.push(target.ref);
    localStorage.setItem('deletedPaymentIds', JSON.stringify(deletedIds));

    const updated = payments.filter(p => p.id !== target.id && p.ref !== target.ref);
    setPayments(updated);
    setFilteredPayments(prev => prev.filter(p => p.id !== target.id && p.ref !== target.ref));
    localStorage.setItem('cemeteryPayments', JSON.stringify(updated));

    // Add to Audit Log
    setAuditLogs(prev => [
      {
        ts: new Date().toISOString(),
        user: 'Admin Jasaan',
        action: `Deleted payment record ${target.ref} (${target.payorName} / ${target.deceasedName})`
      },
      ...prev
    ]);

    setShowDeleteModal(false);
    setShowUpdateModal(false);
    setRecordToDelete(null);
  };

  const handleGenerateReport = () => {
    const uniqueResult: PaymentRecord[] = [];
    const seen = new Set();
    for (const p of payments) {
      const key = `${p.deceasedName}-${p.orNo}-${p.amountPaid}-${p.datePaid}-${p.payorName}`;
      if (!seen.has(key)) { seen.add(key); uniqueResult.push(p); }
    }
    let recordsToExport = uniqueResult;
    if (generateYear !== 'all') recordsToExport = uniqueResult.filter(p => p.yearCovered === generateYear);
    if (recordsToExport.length === 0) { alert("No records found for the selected year."); return; }
    const headers = ['Ref No', 'Payor Name', 'Deceased Name', 'Year', 'Date Paid', 'OR No', 'Method', 'Amount Due', 'Amount Paid', 'Balance', 'Status'];
    const rows = recordsToExport.map(p => [p.ref, `"${p.payorName}"`, `"${p.deceasedName}"`, p.yearCovered, p.datePaid, p.orNo, p.method, p.amountDue, p.amountPaid, Math.max(0, p.amountDue - p.amountPaid), p.status.toUpperCase()]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Payment_Records_${generateYear !== 'all' ? generateYear : 'All_Years'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setAuditLogs([{ ts: new Date().toISOString(), user: 'Admin Jasaan', action: `Generated payment records report for year: ${generateYear}` }, ...auditLogs]);
    setShowGenerateModal(false);
  };

  return (
    <div style={{ padding: '0 10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '40px', marginBottom: '30px' }}>
        <div className={styles.pageHeader} style={{ margin: 0, paddingBottom: 0, borderBottom: 'none' }}>
          <div><h3 style={{ margin: 0, paddingBottom: '4px' }}>Payment Records</h3></div>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button className={styles.btnOutline} style={{ display: 'flex', alignItems: 'center' }} onClick={() => setShowGenerateModal(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'8px'}}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> Generate Records
          </button>
          <button className={styles.btnGold} onClick={() => setShowPaymentModal(true)}>+ RECORD PAYMENT</button>
        </div>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.statCard}><div className={styles.statLabel}>Total Records</div><div className={styles.statValue}>{payments.length}</div><div className={styles.statSub}>All entries</div></div>
        <div className={`${styles.statCard} ${styles.statGreen}`}><div className={styles.statLabel}>Fully Paid</div><div className={styles.statValue}>{countPaid}</div><div className={styles.statSub}>Completed</div></div>
        <div className={`${styles.statCard} ${styles.statOrange}`}><div className={styles.statLabel}>Overdue</div><div className={styles.statValue}>{countOverdue}</div><div className={styles.statSub}>Balance remaining</div></div>
        <div className={`${styles.statCard} ${styles.statRed}`}><div className={styles.statLabel}>Pending</div><div className={styles.statValue}>{countPending}</div><div className={styles.statSub}>Awaiting payment</div></div>
        <div className={`${styles.statCard} ${styles.statBlue}`}><div className={styles.statLabel}>Total Collected</div><div className={styles.statValue}>₱{totalCollected}</div><div className={styles.statSub}>All transactions</div></div>
      </div>

      <div className={styles.filterBar}>
        <div className={styles.filterGroup} style={{ flex: 2 }}>
          <label>Search</label>
          <input type="text" className={styles.filterInput} placeholder="Payor, deceased, OR number, ref..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <div className={styles.filterGroup}>
          <label>Status</label>
          <select className={styles.filterSelect} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label>Year</label>
          <select className={styles.filterSelect} value={yearFilter} onChange={e => setYearFilter(e.target.value)}>
            <option value="all">All Years</option>
            {uniqueYears.map(y => (<option key={y} value={y}>{y}</option>))}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label>Payment Method</label>
          <select className={styles.filterSelect} value={methodFilter} onChange={e => setMethodFilter(e.target.value)}>
            <option value="all">All Methods</option>
            <option value="Cash">Cash</option>
            <option value="GCash">GCash</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Check">Check</option>
          </select>
        </div>
      </div>

      <div className={styles.panel}>
        <div className={styles.panelHead}>
          <div><h4>Payment Transaction Log</h4><p>Showing {filteredPayments.length} records</p></div>
        </div>
        <div className={styles.tblWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>REF. NO.</th><th>PAYOR&apos;S NAME</th><th>DECEASED</th><th>YEAR</th><th>DATE PAID</th><th>OR NO.</th>
                <th>METHOD</th><th>DUE DATE</th><th>PAID</th><th>BALANCE</th><th>STATUS</th><th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 ? (
                <tr><td colSpan={12} style={{ textAlign: 'center', padding: '30px' }}>No payment records found.</td></tr>
              ) : pageItems.map(p => (
                <tr key={p.id}>
                  <td><span className={styles.refBadge}>{p.ref}</span></td>
                  <td><strong>{p.payorName}</strong></td>
                  <td>{p.deceasedName}</td>
                  <td>{p.yearCovered}</td>
                  <td>{p.datePaid || '—'}</td>
                  <td><span style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{p.orNo || '—'}</span></td>
                  <td>{p.method || '—'}</td>
                  <td>{p.dueDate || '—'}</td>
                  <td style={{ color: p.amountPaid >= p.amountDue ? '#a5d6a7' : '#ffb74d', fontWeight: '600' }}>₱{p.amountPaid.toLocaleString()}</td>
                  <td style={{ fontWeight: '600' }}>₱{Math.max(0, p.amountDue - p.amountPaid).toLocaleString()}</td>
                  <td>{getStatusBadge(p.status)}</td>
                  <td>
                    <div className={styles.actionGroup}>
                      {p.status !== 'pending' && <button className={styles.actionBtn} style={{ display: 'flex', alignItems: 'center' }} onClick={() => viewReceipt(p)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'4px'}}><path d="M4 2v20l2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2V2l-2 2-2-2-2 2-2-2-2 2-2-2-2 2Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17V7"/></svg> Receipt
                      </button>}
                      <button className={styles.actionBtn} style={{ color: '#ffb74d', display: 'flex', alignItems: 'center' }} onClick={() => openUpdatePayment(p)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'4px'}}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg> Manage Balance
                      </button>
                      <button
                        className={`${styles.actionBtn} ${styles.btnDeleteAction}`}
                        style={{ display: 'flex', alignItems: 'center' }}
                        onClick={() => openDeleteModal(p)}
                        title="Delete Payment Record"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'3px'}}>
                          <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                        </svg>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.tableFooter}>
          <span>Showing {pageItems.length > 0 ? (page - 1) * itemsPerPage + 1 : 0} to {Math.min(page * itemsPerPage, filteredPayments.length)} of {filteredPayments.length}</span>
          <div className={styles.pagination}>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button key={i} className={`${styles.pageBtn} ${page === i + 1 ? styles.pageBtnActive : ''}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
            ))}
          </div>
        </div>
      </div>

      {showPaymentModal && (
        <div className={styles.modalOverlay} onClick={e => { if (e.target === e.currentTarget) setShowPaymentModal(false); }}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Record New Payment</h3>
              <span className={styles.modalClose} onClick={() => setShowPaymentModal(false)}>&times;</span>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formRow}>
                <div className={styles.formGroup} style={{ position: 'relative' }}>
                  <label>SELECT DECEASED RECORD *</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#555', display: 'flex', pointerEvents: 'none' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    </span>
                    <input
                      type="text"
                      className={styles.formControl}
                      style={{ paddingLeft: '34px' }}
                      value={formDeceased}
                      onChange={e => { setFormDeceased(e.target.value); setShowSuggestions(true); }}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      placeholder="Search by name..."
                      autoComplete="off"
                    />
                  </div>
                  {showSuggestions && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'var(--admin-modal-bg)', border: '1px solid var(--admin-modal-border)', borderRadius: '8px', zIndex: 100, maxHeight: '200px', overflowY: 'auto', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', marginTop: '4px' }}>
                      {deceasedSuggestions.length > 0 ? deceasedSuggestions.map(s => {
                        const bal = calculateBalance(s.deceasedName);
                        return (
                          <div
                            key={s.id}
                            style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid var(--admin-border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--admin-border-subtle)')}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                            onClick={() => {
                              const balStr = bal > 0 ? bal.toString() : '';
                              setFormDeceased(s.deceasedName);
                              setFormAmountDue(balStr);
                              setFormYear(s.yearCovered);
                              setFormPayor(s.payorName);
                              setShowSuggestions(false);
                              const amt = parseFloat(formAmountPaid) || bal || 0;
                              if (amt >= 1000) {
                                const years = Math.floor(amt / 1000);
                                const base = formDate ? new Date(formDate) : new Date();
                                base.setFullYear(base.getFullYear() + years);
                                setFormDueDate(base.toISOString().split('T')[0] ?? '');
                              }
                            }}
                          >
                            <span>
                              <strong style={{ color: 'var(--admin-text-main)', fontSize: '13px' }}>{s.deceasedName}</strong>
                              <small style={{ color: 'var(--admin-text-muted)', marginLeft: '6px' }}>({s.payorName})</small>
                            </span>
                            {bal > 0 && <span style={{ color: 'var(--admin-gold)', fontSize: '12px' }}>Bal: ₱{bal}</span>}
                          </div>
                        );
                      }) : <div style={{ padding: '12px 14px', color: 'var(--admin-text-muted)', fontSize: '13px' }}>No records found</div>}
                    </div>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label>OR NUMBER *</label>
                  <input type="text" className={styles.formControl} value={formOR} onChange={e => setFormOR(e.target.value)} placeholder="e.g. OR-2026-0001" />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>AMOUNT DUE (₱) *</label>
                  <input type="number" className={styles.formControl} value={formAmountDue} onChange={e => handleAmountOrDateChange('amountDue', e.target.value)} placeholder="0.00" />
                </div>
                <div className={styles.formGroup}>
                  <label>AMOUNT PAID (₱) *</label>
                  <input type="number" className={styles.formControl} value={formAmountPaid} onChange={e => handleAmountOrDateChange('amountPaid', e.target.value)} placeholder="0.00" />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>PAYMENT DATE *</label>
                  <input type="date" className={styles.formControl} value={formDate} onChange={e => handleAmountOrDateChange('date', e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label>PAYMENT METHOD</label>
                  <select className={styles.formControl} value={formMethod} onChange={e => setFormMethod(e.target.value)}>
                    <option value="Cash">Cash</option>
                    <option value="GCash">GCash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Check">Check</option>
                  </select>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>YEAR COVERED</label>
                  <input type="text" className={styles.formControl} value={formYear} onChange={e => setFormYear(e.target.value)} placeholder="e.g. 2026" />
                </div>
                <div className={styles.formGroup}>
                  <label>DUE DATE (FOR OVERDUE TRACKING)</label>
                  <input type="date" className={styles.formControl} value={formDueDate} onChange={e => setFormDueDate(e.target.value)} />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup} style={{ width: '100%' }}>
                  <label>REMARKS</label>
                  <input type="text" className={styles.formControl} value={formRemarks} onChange={e => setFormRemarks(e.target.value)} placeholder="Additional notes..." />
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.btnOutline} onClick={() => setShowPaymentModal(false)}>Cancel</button>
              <button className={styles.btnGold} onClick={handleSavePayment}>SAVE PAYMENT</button>
            </div>
          </div>
        </div>
      )}

      {showReceiptModal && currentReceipt && (
        <div className={styles.modalOverlay} onClick={e => { if (e.target === e.currentTarget) setShowReceiptModal(false); }}>
          <div className={styles.modalContent} style={{ maxWidth: '440px' }}>
            <div className={styles.modalHeader}>
              <h3>Receipt Preview</h3>
              <span className={styles.modalClose} onClick={() => setShowReceiptModal(false)}>&times;</span>
            </div>
            <div className={styles.modalBody} style={{ display: 'flex', justifyContent: 'center', backgroundColor: 'var(--admin-bg)', padding: '24px' }}>
              <div className={styles.receiptWrapper} style={{ backgroundColor: '#ffffff', color: '#000000', padding: '24px 20px', width: '100%', maxWidth: '360px', fontFamily: '"Courier New", Courier, monospace', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', borderRadius: '4px', lineHeight: '1.4', fontSize: '13px' }}>
                <div style={{ borderTop: '1px dashed #000', borderBottom: '1px dashed #000', height: '3px', margin: '4px 0 12px' }}></div>
                <div style={{ textAlign: 'center', margin: '14px 0' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0', letterSpacing: '2px', fontFamily: 'Arial, sans-serif' }}>RECEIPT</h2>
                </div>
                <div style={{ borderTop: '1px dashed #000', borderBottom: '1px dashed #000', height: '3px', margin: '12px 0 20px' }}></div>
                <div style={{ margin: '16px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ flex: 1, paddingRight: '12px' }}>1x Lot Rent (Yr {currentReceipt.yearCovered})</span>
                    <span style={{ whiteSpace: 'nowrap' }}>₱ {currentReceipt.amountDue.toFixed(2)}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#555555', paddingLeft: '18px', marginTop: '-4px' }}>Deceased: {currentReceipt.deceasedName}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ flex: 1, paddingRight: '12px' }}>1x Payor: {currentReceipt.payorName}</span>
                    <span style={{ whiteSpace: 'nowrap' }}>₱ 0.00</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ flex: 1, paddingRight: '12px' }}>1x OR No: {currentReceipt.orNo || '—'}</span>
                    <span style={{ whiteSpace: 'nowrap' }}>₱ 0.00</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ flex: 1, paddingRight: '12px' }}>1x Date: {currentReceipt.datePaid || '—'}</span>
                    <span style={{ whiteSpace: 'nowrap' }}>₱ 0.00</span>
                  </div>
                  {currentReceipt.remarks && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{ flex: 1, paddingRight: '12px', fontSize: '11px', color: '#555555' }}>* Remarks: {currentReceipt.remarks}</span>
                      <span style={{ whiteSpace: 'nowrap' }}>—</span>
                    </div>
                  )}
                </div>
                <div style={{ borderTop: '1px dashed #000', margin: '20px 0 10px' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '14px', margin: '8px 0' }}>
                  <span>TOTAL AMOUNT</span>
                  <span>₱ {currentReceipt.amountDue.toFixed(2)}</span>
                </div>
                <div style={{ borderTop: '1px dashed #000', borderBottom: '1px dashed #000', height: '3px', margin: '10px 0 16px' }}></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', margin: '12px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                    <span>{currentReceipt.method ? currentReceipt.method.toUpperCase() : 'CASH'}</span>
                    <span>₱ {currentReceipt.amountPaid.toFixed(2)}</span>
                  </div>
                  {currentReceipt.amountPaid >= currentReceipt.amountDue ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                      <span>CHANGE</span>
                      <span>₱ {(currentReceipt.amountPaid - currentReceipt.amountDue).toFixed(2)}</span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                      <span>BALANCE DUE</span>
                      <span>₱ {(currentReceipt.amountDue - currentReceipt.amountPaid).toFixed(2)}</span>
                    </div>
                  )}
                </div>
                <div style={{ borderTop: '1px dashed #000', borderBottom: '1px dashed #000', height: '3px', margin: '16px 0 20px' }}></div>
                <div style={{ textAlign: 'center', margin: '18px 0', fontSize: '16px', fontWeight: 'bold', fontFamily: 'Arial, sans-serif', letterSpacing: '1px' }}>THANK YOU</div>
                <div style={{ borderTop: '1px dashed #000', margin: '20px 0 12px' }}></div>
                <div style={{ display: 'flex', justifyContent: 'center', height: '50px', margin: '16px auto 4px', gap: '2px', width: '200px' }}>
                  {[2,1,3,1,4,2,1,3,2,1,4,1,2,3,1,2,4,1,3,2,1,4,1,2,3,1,2,1,4,2].map((w, idx) => (
                    <div key={idx} style={{ backgroundColor: '#000', width: `${w}px`, height: '100%' }}></div>
                  ))}
                </div>
                <div style={{ textAlign: 'center', fontSize: '10px', color: '#555555', letterSpacing: '2px' }}>{currentReceipt.ref}</div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.btnOutline} onClick={() => setShowReceiptModal(false)}>Close</button>
              <button className={styles.btnGold} style={{ display: 'flex', alignItems: 'center' }} onClick={() => window.print()}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'8px'}}><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg> Print
              </button>
            </div>
          </div>
        </div>
      )}

      {showGenerateModal && (
        <div className={styles.modalOverlay} onClick={e => { if (e.target === e.currentTarget) setShowGenerateModal(false); }}>
          <div className={styles.modalContent} style={{ maxWidth: '400px' }}>
            <div className={styles.modalHeader}>
              <h3>Generate Payment Records</h3>
              <span className={styles.modalClose} onClick={() => setShowGenerateModal(false)}>&times;</span>
            </div>
            <div className={styles.modalBody}>
              <p style={{ color: '#ccc', marginBottom: '20px', fontSize: '14px' }}>Select the year you want to generate records for:</p>
              <div className={styles.formGroup}>
                <label>YEAR</label>
                <select className={styles.formControl} value={generateYear} onChange={e => setGenerateYear(e.target.value)}>
                  <option value="all">All Years</option>
                  {uniqueYears.map(y => (<option key={y} value={y}>{y}</option>))}
                </select>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.btnOutline} onClick={() => setShowGenerateModal(false)}>Cancel</button>
              <button className={styles.btnGold} onClick={handleGenerateReport}>Download Report</button>
            </div>
          </div>
        </div>
      )}

      {showUpdateModal && currentUpdateRecord && (
        <div className={styles.modalOverlay} onClick={e => { if (e.target === e.currentTarget) setShowUpdateModal(false); }}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Manage Balance</h3>
              <span className={styles.modalClose} onClick={() => setShowUpdateModal(false)}>&times;</span>
            </div>
            <div className={styles.modalBody}>
              <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: 'var(--admin-input-bg)', borderRadius: '8px', border: '1px solid var(--admin-input-border)' }}>
                <p style={{ margin: '0 0 8px 0', color: 'var(--admin-text-main)', fontSize: '14px' }}><strong>Record For:</strong> {currentUpdateRecord.deceasedName}</p>
                <p style={{ margin: '0 0 8px 0', color: 'var(--admin-text-muted)', fontSize: '14px' }}><strong>Payor:</strong> {currentUpdateRecord.payorName}</p>
                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed var(--admin-input-border)' }}>
                  <p style={{ margin: '0', color: '#ffb74d', fontSize: '16px', fontWeight: 'bold' }}>
                    Current Balance: ₱{Math.max(0, currentUpdateRecord.amountDue - currentUpdateRecord.amountPaid)}
                  </p>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>TOTAL AMOUNT DUE (₱)</label>
                  <input type="number" className={styles.formControl} value={editAmountDue} onChange={e => setEditAmountDue(e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label>TOTAL AMOUNT PAID (₱)</label>
                  <input type="number" className={styles.formControl} value={editAmountPaid} onChange={e => setEditAmountPaid(e.target.value)} />
                </div>
              </div>
              <div style={{ padding: '10px 0', color: '#888', fontSize: '14px', textAlign: 'center', fontWeight: 'bold' }}>- OR -</div>
              <div className={styles.formGroup}>
                <label>ADD NEW PAYMENT (₱)</label>
                <input type="number" className={styles.formControl} value={addAmountPaid} onChange={e => setAddAmountPaid(e.target.value)} placeholder="e.g. 500" />
                <small style={{ color: '#888', display: 'block', marginTop: '6px' }}>This will be added to the total amount paid.</small>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.btnDanger}
                style={{ marginRight: 'auto' }}
                onClick={() => {
                  setShowUpdateModal(false);
                  if (currentUpdateRecord) openDeleteModal(currentUpdateRecord);
                }}
              >
                🗑 Delete Record
              </button>
              <button className={styles.btnOutline} onClick={() => setShowUpdateModal(false)}>Cancel</button>
              <button className={styles.btnGold} onClick={handleUpdatePayment}>SAVE CHANGES</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Payment Confirmation Modal */}
      {showDeleteModal && recordToDelete && (
        <div className={styles.modalOverlay} onClick={e => { if (e.target === e.currentTarget) setShowDeleteModal(false); }}>
          <div className={styles.modalContent} style={{ maxWidth: '440px' }}>
            <div className={styles.modalHeader}>
              <h3 style={{ color: '#ef5350', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef5350" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                Delete Payment Record
              </h3>
              <span className={styles.modalClose} onClick={() => setShowDeleteModal(false)}>&times;</span>
            </div>
            <div className={styles.modalBody}>
              <p style={{ color: 'var(--admin-text-main)', fontSize: '0.95rem', marginBottom: '14px', lineHeight: 1.5 }}>
                Are you sure you want to permanently delete this payment transaction?
              </p>
              <div style={{ padding: '14px', backgroundColor: 'var(--admin-input-bg)', border: '1px solid var(--admin-input-border)', borderRadius: '8px', fontSize: '0.85rem', lineHeight: '1.6' }}>
                <div><strong style={{ color: 'var(--admin-text-muted)' }}>Reference:</strong> <span style={{ color: '#E2C97E', fontFamily: 'monospace' }}>{recordToDelete.ref}</span></div>
                <div><strong style={{ color: 'var(--admin-text-muted)' }}>Payor:</strong> {recordToDelete.payorName}</div>
                <div><strong style={{ color: 'var(--admin-text-muted)' }}>Deceased:</strong> {recordToDelete.deceasedName}</div>
                <div><strong style={{ color: 'var(--admin-text-muted)' }}>Amount Paid:</strong> ₱{recordToDelete.amountPaid.toLocaleString()}</div>
                <div><strong style={{ color: 'var(--admin-text-muted)' }}>Year:</strong> {recordToDelete.yearCovered}</div>
              </div>
              <p style={{ color: '#ef9a9a', fontSize: '0.78rem', marginTop: '12px', marginBottom: '0' }}>
                ⚠️ This action will remove the record from your active transactions log.
              </p>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.btnOutline} onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className={styles.btnDanger} onClick={confirmDeletePayment}>
                🗑 Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
