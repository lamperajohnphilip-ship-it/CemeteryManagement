'use client';

import { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import styles from './page.module.css';
import { addDeceasedRecord, getDeceasedRecords, updateDeceasedRecord, archiveDeceasedRecord } from '../../../actions/deceased';

interface PaymentHistory {
  date: string;
  amount: number;
  or: string;
  method: string;
  by: string;
}

interface InventoryRecord {
  id: string;
  ref: string;
  payor: string;
  deceased: string;
  gender: string;
  address: string;
  contact: string;
  birthDate?: string;
  duePaymentSchedule?: string;
  deathDate: string;
  yearPaid: string;
  civilStatus: string;
  nationality: string;
  totalAmount: number;
  payments: PaymentHistory[];
  amountPaid: number;
  balance: number;
  paymentStatus: 'paid' | 'partial' | 'pending';
  orNo: string;
  datePaid: string;
  remarks: string;
  verified: boolean;
}

const INVENTORY_KEY = 'cemeteryInventory';
const PAYMENTS_KEY = 'cemeteryPayments';

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function fmtNum(n: number) {
  return (parseFloat(n as any) || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function DeceasedInventoryPage() {
  const [inventory, setInventory] = useState<InventoryRecord[]>([]);
  const [displayData, setDisplayData] = useState<InventoryRecord[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [filterName, setFilterName] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [editMode, setEditMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Modals state
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showImportSum, setShowImportSum] = useState(false);
  const [importSummary, setImportSummary] = useState<any>(null);

  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [archiveReason, setArchiveReason] = useState('');
  const [archiveLoading, setArchiveLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Focus ref for edits
  const editableRefs = useRef<{ [key: string]: HTMLTableCellElement | null }>({});

  // Record Form state
  const [formState, setFormState] = useState({
    id: '', ref: '', payor: '', deceased: '', gender: 'Male', address: '', contact: '',
    birthDate: '', deathDate: '', yearPaid: new Date().getFullYear().toString(), totalAmount: '', amountPaid: '', duePaymentSchedule: '', civilStatus: 'Single', remarks: ''
  });

  // Inline Validation state
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Helper to handle field change and dynamically clear errors
  const handleFieldChange = (field: string, value: string) => {
    setFormState(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Payment Details state
  const [paymentDetails, setPaymentDetails] = useState<InventoryRecord | null>(null);

  useEffect(() => {
    loadInventory();
    const handleStorage = (e: StorageEvent) => {
      if (e.key === INVENTORY_KEY || e.key === PAYMENTS_KEY) loadInventory();
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    applyFilters(inventory);
  }, [filterName, filterYear, filterStatus, inventory]);

  const loadInventory = async () => {
    // Try to load from DB first
    try {
      const res = await getDeceasedRecords();
      if (res.success && res.records) {
        const dbRecords: InventoryRecord[] = res.records.map((r: any) => ({
          id: r.id,
          ref: r.REF_NO,
          payor: r.PAYORS_NAME,
          contact: r.CONTACT_NO,
          deceased: r.NAME_OF_DECEASED,
          address: r.ADDRESS,
          birthDate: r.DATE_OF_BIRTH ? (new Date(r.DATE_OF_BIRTH).toISOString().split('T')[0] || '') : '',
          deathDate: r.DATE_OF_DEATH ? (new Date(r.DATE_OF_DEATH).toISOString().split('T')[0] || '') : '',
          yearPaid: r.YEAR.toString(),
          totalAmount: r.TOTAL_DUE,
          amountPaid: r.PAID,
          balance: r.BALANCE,
          paymentStatus: (r.STATUS || 'pending').toLowerCase() as any,
          remarks: r.REMARKS || '',
          gender: 'Male', civilStatus: 'Single', nationality: 'Filipino', payments: [], orNo: '', datePaid: '', verified: true
        }));
        
        const saved = localStorage.getItem(INVENTORY_KEY);
        let localRecs: InventoryRecord[] = [];
        if (saved) {
          try { localRecs = JSON.parse(saved); } catch(e){}
        }
        
        const dbNames = new Set(dbRecords.map(r => r.deceased.toLowerCase()));
        const legacyRecs = localRecs.filter(r => !dbNames.has((r.deceased || '').toLowerCase()));
        
        setInventory([...dbRecords, ...legacyRecs]);
        return;
      }
    } catch(e) {
      console.error(e);
    }
    
    // Fallback to local storage
    const saved = localStorage.getItem(INVENTORY_KEY);
    if (saved) {
      try {
        setInventory(JSON.parse(saved));
      } catch (e) { }
    }
  };

  const calculateBalance = (record: any) => {
    const totalDue = parseFloat(record.totalAmount) || parseFloat(record.amount) || 0;
    let totalPaid = 0;
    if (Array.isArray(record.payments) && record.payments.length > 0) {
      totalPaid = record.payments.reduce((sum: number, p: any) => sum + (parseFloat(p.amount) || 0), 0);
    } else {
      totalPaid = parseFloat(record.amountPaid) || 0;
    }
    const balance = Math.max(0, totalDue - totalPaid);
    const pct = totalDue > 0 ? Math.min(100, (totalPaid / totalDue) * 100) : 0;
    let paymentStatus = 'pending';
    if (totalDue > 0 && totalPaid >= totalDue) paymentStatus = 'paid';
    else if (totalPaid > 0) paymentStatus = 'partial';

    return { totalDue, totalPaid, balance, paymentStatus, pct };
  };

  const applyFilters = (data: InventoryRecord[]) => {
    const nameQ = filterName.toLowerCase();
    const yearQ = filterYear.trim();
    const stQ = filterStatus;

    const filtered = data.filter(r => {
      if (nameQ && !((r.deceased || '').toLowerCase().includes(nameQ) || (r.payor || '').toLowerCase().includes(nameQ))) return false;
      if (yearQ && !((r.yearPaid || '').includes(yearQ)) && !((r.deathDate || '').includes(yearQ))) return false;
      if (stQ !== 'all' && r.paymentStatus !== stQ) return false;
      return true;
    });
    setDisplayData(filtered);
    setCurrentPage(1);
  };

  const saveInventory = (newInv: InventoryRecord[]) => {
    setInventory(newInv);
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(newInv));
  };

  // Status checks
  const totalRecs = inventory.length;
  const paidRecs = inventory.filter(r => r.paymentStatus === 'paid').length;
  const partialRecs = inventory.filter(r => r.paymentStatus === 'partial').length;
  const pendingRecs = inventory.filter(r => r.paymentStatus === 'pending' || !r.paymentStatus).length;
  const maleRecs = inventory.filter(r => r.gender === 'Male').length;
  const femaleRecs = inventory.filter(r => r.gender === 'Female').length;

  const handleArchiveSelected = () => {
    if (selectedIds.size === 0) return alert('Select at least one row to archive.');
    setArchiveReason('');
    setShowArchiveModal(true);
  };

  const executeArchive = async () => {
    setArchiveLoading(true);
    for (const id of Array.from(selectedIds)) {
      if (id.length > 20) {
        await archiveDeceasedRecord(id, archiveReason);
      }
    }
    const newInv = inventory.filter(r => !selectedIds.has(r.id));
    saveInventory(newInv);
    await loadInventory();
    setSelectedIds(new Set());
    setArchiveLoading(false);
    setShowArchiveModal(false);
  };

  const calculateDueDate = (totalAmt: string, paidAmt: string) => {
    const amt = parseFloat(paidAmt) || parseFloat(totalAmt) || 0;
    if (amt >= 1000) {
      const years = Math.floor(amt / 1000);
      const base = new Date();
      base.setFullYear(base.getFullYear() + years);
      return base.toISOString().split('T')[0];
    }
    return '';
  };

  const handleAmountChange = (field: 'totalAmount' | 'amountPaid', val: string) => {
    const nextState = { ...formState, [field]: val };
    const computed = calculateDueDate(nextState.totalAmount, nextState.amountPaid);
    if (computed) {
      nextState.duePaymentSchedule = computed;
    }
    setFormState(nextState);
    setErrors(prev => {
      const next = { ...prev };
      delete next[field];
      if (computed && next.duePaymentSchedule) {
        delete next.duePaymentSchedule;
      }
      return next;
    });
  };

  const openNewRecord = () => {
    setErrors({});
    setFormState({
      id: '', ref: `${new Date().getFullYear()}-000`, payor: '', deceased: '', gender: 'Male', address: '', contact: '',
      birthDate: '', deathDate: '', yearPaid: new Date().getFullYear().toString(), totalAmount: '', amountPaid: '', duePaymentSchedule: '', civilStatus: 'Single', remarks: ''
    });
    setShowRecordModal(true);
  };

  const openEditModal = (id: string) => {
    const r = inventory.find(x => x.id === id);
    if (!r) return;
    setErrors({});
    setFormState({
      id: r.id, ref: r.ref, payor: r.payor, deceased: r.deceased, gender: r.gender || 'Male',
      address: r.address, contact: r.contact, birthDate: r.birthDate || '', deathDate: r.deathDate, yearPaid: r.yearPaid,
      totalAmount: r.totalAmount?.toString() || '', amountPaid: r.amountPaid?.toString() || '', duePaymentSchedule: r.duePaymentSchedule || '', civilStatus: r.civilStatus || 'Single', remarks: r.remarks
    });
    setShowRecordModal(true);
  };

  const saveRecord = async () => {
    const newErrors: {[key: string]: string} = {};
    if (!formState.ref?.trim()) newErrors.ref = 'Please enter reference number.';
    if (!formState.payor?.trim()) newErrors.payor = "Please enter payor's name.";
    if (!formState.contact?.trim()) newErrors.contact = 'Please enter a valid phone number.';
    if (!formState.address?.trim()) newErrors.address = 'Please enter address.';
    if (!formState.deceased?.trim()) newErrors.deceased = 'Please enter name of deceased.';
    if (!formState.birthDate) newErrors.birthDate = 'Please enter date of birth.';
    if (!formState.deathDate) newErrors.deathDate = 'Please enter date of death.';
    if (formState.totalAmount === '') newErrors.totalAmount = 'Please enter total amount due.';
    if (formState.amountPaid === '') newErrors.amountPaid = 'Please enter initial payment.';
    if (!formState.duePaymentSchedule) newErrors.duePaymentSchedule = 'Please select due date.';
    if (!formState.remarks?.trim()) newErrors.remarks = 'Please enter remarks / lot no.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    let newInv = [...inventory];
    const totalAmount = parseFloat(formState.totalAmount) || 0;
    const amountPaid = parseFloat(formState.amountPaid) || 0;

    // Save to PostgreSQL Backend
    const dbData = {
      PAYORS_NAME: formState.payor || 'Unknown',
      CONTACT_NO: formState.contact || 'N/A',
      NAME_OF_DECEASED: formState.deceased,
      ADDRESS: formState.address || 'N/A',
      DATE_OF_BIRTH: formState.birthDate || (new Date().toISOString().split('T')[0] as string),
      DATE_OF_DEATH: formState.deathDate || (new Date().toISOString().split('T')[0] as string),
      YEAR: parseInt(formState.yearPaid) || new Date().getFullYear(),
      TOTAL_DUE: totalAmount,
      PAID: amountPaid,
      REMARKS: formState.remarks || ''
    };
    
    if (formState.id && formState.id.length > 20) {
      // Assuming long IDs are from DB (CUID is 25 chars)
      await updateDeceasedRecord(formState.id, dbData);
    } else if (!formState.id) {
      await addDeceasedRecord(dbData);
    }

    if (formState.id) {
      const idx = newInv.findIndex(r => r.id === formState.id);
      if (idx > -1) {
        newInv[idx] = { ...newInv[idx], ...formState, totalAmount } as any;
        // Don't override existing amountPaid via form unless we explicitly designed it to, but since we added amountPaid field, let's update it if its new
        if (!newInv[idx]!.payments || newInv[idx]!.payments.length === 0) {
            newInv[idx]!.amountPaid = amountPaid;
        }
        const calc = calculateBalance(newInv[idx]);
        newInv[idx]!.balance = calc.balance;
        newInv[idx]!.paymentStatus = calc.paymentStatus as any;
      }
    } else {
      const targetId = genId();
      
      const calcBalance = Math.max(0, totalAmount - amountPaid);
      let initStatus = 'pending';
      if (totalAmount > 0 && amountPaid >= totalAmount) initStatus = 'paid';
      else if (amountPaid > 0) initStatus = 'partial';

      const initialPayments = amountPaid > 0 ? [{
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        amount: amountPaid,
        or: 'Initial',
        method: 'Cash',
        by: 'Admin'
      }] : [];

      const newRec: InventoryRecord = {
        ...formState, id: targetId, totalAmount,
        payments: initialPayments, amountPaid: amountPaid, balance: calcBalance, paymentStatus: initStatus as any,
        orNo: '', datePaid: '', verified: false, nationality: 'Filipino'
      };
      newInv.push(newRec);

      // --- Add to SMS Notification records ---
      const smsStorage = localStorage.getItem('cemeterySmsList');
      const smsHistory = smsStorage ? JSON.parse(smsStorage) : [];
      smsHistory.unshift({
        id: typeof targetId === 'string' ? targetId : Date.now(),
        payorName: formState.payor || 'Unknown',
        contact: formState.contact || '',
        deceasedName: formState.deceased,
        amount: totalAmount,
        dueDate: formState.duePaymentSchedule || '',
        expiryDate: '',
        status: 'pending',
        lastReminder: 'None'
      });
      localStorage.setItem('cemeterySmsList', JSON.stringify(smsHistory));

      // --- Add to Payment records ---
      const pmtStorage = localStorage.getItem('cemeteryPayments');
      const payments = pmtStorage ? JSON.parse(pmtStorage) : [];
      payments.unshift({
        id: typeof targetId === 'string' ? targetId : Date.now(),
        ref: formState.ref || `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
        payorName: formState.payor || 'Unknown',
        deceasedName: formState.deceased,
        orNo: '',
        amountDue: totalAmount,
        amountPaid: amountPaid,
        datePaid: amountPaid > 0 ? new Date().toISOString().split('T')[0] : '',
        method: '',
        yearCovered: formState.yearPaid || new Date().getFullYear().toString(),
        dueDate: formState.duePaymentSchedule || '',
        remarks: formState.remarks || '',
        status: 'pending'
      });
      localStorage.setItem('cemeteryPayments', JSON.stringify(payments));
    }
    saveInventory(newInv);
    await loadInventory();
    setShowRecordModal(false);
  };

  const handleExport = () => {
    if (inventory.length === 0) return alert('No data to export.');
    const headers = ['REF. NO.', "PAYOR'S NAME", 'NAME OF DECEASED', 'ADDRESS', 'CONTACT NO.', 'DATE OF DEATH', 'YEAR PAID', 'TOTAL DUE', 'STATUS', 'REMARKS'];
    const rows = inventory.map(r => [
      r.ref, r.payor, r.deceased, r.address, r.contact, r.deathDate, r.yearPaid, r.totalAmount, r.paymentStatus, r.remarks
    ].map(c => `"${String(c || '').replace(/"/g, '""')}"`).join(','));
    const csv = [headers.map(h => `"${h}"`).join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `inventory_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const wb = XLSX.read(ev.target?.result, { type: 'array' });
        const sheetName = wb.SheetNames[0];
        if (!sheetName) return alert('Invalid Excel file: No sheets found');
        const ws = wb.Sheets[sheetName];
        if (!ws) return alert('Invalid Excel file: Worksheet is empty or missing');
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1 }) as string[][];
        if (rows.length < 2) return alert('Empty file');

        let newRecords: InventoryRecord[] = [...inventory];
        let imported = 0;

        const smsStorage = localStorage.getItem('cemeterySmsList');
        const smsHistory = smsStorage ? JSON.parse(smsStorage) : [];
        const pmtStorage = localStorage.getItem('cemeteryPayments');
        const paymentsList = pmtStorage ? JSON.parse(pmtStorage) : [];

        const dbPromises: Promise<any>[] = [];

        rows.slice(1).forEach((row) => {
          if (!row.some(c => c)) return; // skip empty rows
          const deceased = String(row[2] || '').trim();
          if (!deceased) return; // name essential
          const newId = genId();
          const rec: InventoryRecord = {
            id: newId, ref: String(row[0] || ''), payor: String(row[1] || ''), deceased,
            address: String(row[3] || ''), contact: String(row[4] || ''), deathDate: String(row[5] || ''),
            yearPaid: String(row[6] || ''), totalAmount: parseFloat(String(row[7])) || 0,
            remarks: String(row[9] || ''), payments: [], amountPaid: 0, balance: parseFloat(String(row[7])) || 0,
            paymentStatus: 'pending', orNo: '', datePaid: '', verified: false, gender: 'Male', civilStatus: 'Single', nationality: 'Filipino'
          };
          newRecords.push(rec);

          // Add to DB
          const dbData = {
            PAYORS_NAME: rec.payor || 'Unknown',
            CONTACT_NO: rec.contact || 'N/A',
            NAME_OF_DECEASED: rec.deceased,
            ADDRESS: rec.address || 'N/A',
            DATE_OF_BIRTH: new Date().toISOString().split('T')[0] as string,
            DATE_OF_DEATH: rec.deathDate || (new Date().toISOString().split('T')[0] as string),
            YEAR: parseInt(rec.yearPaid) || new Date().getFullYear(),
            TOTAL_DUE: rec.totalAmount,
            PAID: 0,
            REMARKS: rec.remarks || ''
          };
          dbPromises.push(addDeceasedRecord(dbData));

          // Add to SMS notification
          smsHistory.unshift({
            id: newId,
            payorName: rec.payor || 'Unknown',
            contact: rec.contact || '',
            deceasedName: rec.deceased,
            amount: rec.totalAmount,
            dueDate: '',
            expiryDate: '',
            status: 'pending',
            lastReminder: 'None'
          });

          // Add to Payment records
          paymentsList.unshift({
            id: newId,
            ref: rec.ref || `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
            payorName: rec.payor || 'Unknown',
            deceasedName: rec.deceased,
            orNo: '',
            amountDue: rec.totalAmount,
            amountPaid: 0,
            datePaid: '',
            method: '',
            yearCovered: rec.yearPaid || new Date().getFullYear().toString(),
            dueDate: '',
            remarks: rec.remarks,
            status: 'pending'
          });

          imported++;
        });

        localStorage.setItem('cemeterySmsList', JSON.stringify(smsHistory));
        localStorage.setItem('cemeteryPayments', JSON.stringify(paymentsList));

        Promise.all(dbPromises).then(() => {
          loadInventory();
          alert(`Successfully imported ${imported} records directly to the PostgreSQL database!`);
        }).catch(err => {
          console.error("Failed to insert some records to DB", err);
          saveInventory(newRecords);
          alert(`Imported ${imported} records, but some failed to save to DB.`);
        });
      } catch (err) {
        alert('Failed to parse file.');
      }
    };
    reader.readAsArrayBuffer(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) setSelectedIds(new Set(displayData.map(d => d.id)));
    else setSelectedIds(new Set());
  };

  const saveEdits = () => {
    let newInv = [...inventory];
    Object.keys(editableRefs.current).forEach(key => {
      const cell = editableRefs.current[key];
      if (!cell) return;
      const [id, field] = key.split('_');
      if (!id || !field) return;
      const idx = newInv.findIndex(r => r.id === id);
      if (idx > -1) {
        const input = cell.querySelector('input');
        if (input) {
          (newInv[idx] as any)[field] = input.value;
        }
      }
    });
    saveInventory(newInv);
    setEditMode(false);
  };

  // Pagination calculations
  const indexOfLastRecord = currentPage * rowsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - rowsPerPage;
  const currentRecords = displayData.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(displayData.length / rowsPerPage);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const showingStart = displayData.length === 0 ? 0 : indexOfFirstRecord + 1;
  const showingEnd = Math.min(indexOfLastRecord, displayData.length);

  return (
    <div>
      <div className={styles.headerRow}>
        <div className={styles.title}>
          <h3>Deceased Information</h3>
        </div>
      </div>

      <div className={styles.summaryCards}>
        <div className={styles.summaryCard}>
          <div className={styles.label}>Total Records</div>
          <div className={styles.value}>{totalRecs}</div>
          <div className={styles.sub}>Deceased entries</div>
        </div>
        <div className={`${styles.summaryCard} ${styles.cardPaid}`}>
          <div className={styles.label}>Fully Paid</div>
          <div className={styles.value}>{paidRecs}</div>
          <div className={styles.sub}>Cleared accounts</div>
        </div>
        <div className={`${styles.summaryCard} ${styles.cardPartial}`}>
          <div className={styles.label}>Partial</div>
          <div className={styles.value}>{partialRecs}</div>
          <div className={styles.sub}>Has balance</div>
        </div>
        <div className={`${styles.summaryCard} ${styles.cardPending}`}>
          <div className={styles.label}>Pending</div>
          <div className={styles.value}>{pendingRecs}</div>
          <div className={styles.sub}>Awaiting payment</div>
        </div>
        <div className={`${styles.summaryCard} ${styles.cardMale}`}>
          <div className={styles.label}>Male</div>
          <div className={styles.value}>{maleRecs}</div>
          <div className={styles.sub}>Deceased</div>
        </div>
        <div className={`${styles.summaryCard} ${styles.cardFemale}`}>
          <div className={styles.label}>Female</div>
          <div className={styles.value}>{femaleRecs}</div>
          <div className={styles.sub}>Deceased</div>
        </div>
      </div>

      <div className={styles.statusPills}>
        <span className={`${styles.statusPill} ${filterStatus === 'all' ? styles.statusPillActive : ''}`} onClick={() => setFilterStatus('all')}>All</span>
        <span className={`${styles.statusPill} ${filterStatus === 'paid' ? styles.statusPillActive : ''}`} onClick={() => setFilterStatus('paid')}>✓ Paid</span>
        <span className={`${styles.statusPill} ${filterStatus === 'partial' ? styles.statusPillActive : ''}`} onClick={() => setFilterStatus('partial')}>◐ Partial</span>
        <span className={`${styles.statusPill} ${filterStatus === 'pending' ? styles.statusPillActive : ''}`} onClick={() => setFilterStatus('pending')}>⧖ Pending</span>
      </div>

      <div className={styles.filterSection}>
        <div className={styles.filterGroup}>
          <label>Search Name</label>
          <input className={styles.filterInput} value={filterName} onChange={e => setFilterName(e.target.value)} placeholder="Deceased or payor name…" />
        </div>
        <div className={styles.filterGroup} style={{ maxWidth: 140 }}>
          <label>Year</label>
          <input className={styles.filterInput} value={filterYear} onChange={e => setFilterYear(e.target.value)} placeholder="e.g. 2025…" />
        </div>
      </div>

      <div className={styles.actionBar}>
        <div className={styles.actionGroup}>
          <button className={styles.btnOutline} style={{ display: 'flex', alignItems: 'center' }} onClick={() => fileInputRef.current?.click()}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'8px'}}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
            Import
          </button>
          <div className={styles.actionDivider}></div>
          <button className={styles.btnOutline} style={{ display: 'flex', alignItems: 'center' }} onClick={handleExport}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'8px'}}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            Export CSV
          </button>
        </div>
        <div className={styles.actionGroup}>
          <button className={styles.btnOutline} style={{ display: 'flex', alignItems: 'center' }} onClick={openNewRecord}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'8px'}}><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
            Add Row
          </button>
          <div className={styles.actionDivider}></div>
          {!editMode ? (
            <button className={styles.btnEdit} style={{ display: 'flex', alignItems: 'center' }} onClick={() => setEditMode(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'8px'}}><path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.839a.5.5 0 0 1-.62-.62l.84-2.871a2 2 0 0 1 .506-.854z"/></svg>
              Edit
            </button>
          ) : (
            <>
              <button className={styles.btnSave} style={{ display: 'flex', alignItems: 'center' }} onClick={saveEdits}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'8px'}}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                Save Changes
              </button>
              <button className={styles.btnDanger} style={{ display: 'flex', alignItems: 'center' }} onClick={handleArchiveSelected}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'8px'}}><path d="M21 8v13H3V8"/><path d="M1 3h22v5H1z"/><path d="M10 12h4"/></svg>
                Archive
              </button>
            </>
          )}
        </div>
        {editMode && (
          <span className={styles.editModeIndicator}>
            <span className={styles.dot}></span>Edit Mode Active
          </span>
        )}
      </div>

      <input type="file" ref={fileInputRef} onChange={handleImport} accept=".csv,.xlsx,.xls" style={{ display: 'none' }} />

      <div className={styles.panel}>
        <div className={styles.panelHead}>
          <div>
            <h4>Burial Records</h4>
            <p>Showing {showingStart} to {showingEnd} of {displayData.length} records</p>
          </div>
        </div>
        <div className={styles.tblWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                {editMode && <th className={`${styles.th} ${styles.colCb}`}><input type="checkbox" onChange={e => toggleSelectAll(e.target.checked)} /></th>}
                <th className={`${styles.th} ${styles.colRef}`}>REF. NO.</th>
                <th className={`${styles.th} ${styles.colPayor}`}>PAYOR'S NAME</th>
                <th className={`${styles.th} ${styles.colContact}`}>CONTACT NO.</th>
                <th className={`${styles.th} ${styles.colDeceased}`}>NAME OF DECEASED</th>
                <th className={`${styles.th} ${styles.colAddr}`}>ADDRESS</th>
                <th className={`${styles.th} ${styles.colDob}`}>DATE OF BIRTH</th>
                <th className={`${styles.th} ${styles.colDod}`}>DATE OF DEATH</th>
                <th className={`${styles.th} ${styles.colYear}`}>YEAR</th>
                <th className={`${styles.th} ${styles.colTotal}`}>TOTAL DUE</th>
                <th className={`${styles.th} ${styles.colPaid}`}>PAID</th>
                <th className={`${styles.th} ${styles.colBalance}`}>BALANCE</th>
                <th className={`${styles.th} ${styles.colStatus}`}>STATUS</th>
                <th className={`${styles.th} ${styles.colRemarks}`}>REMARKS</th>
                <th className={`${styles.th} ${styles.colActions}`}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map(r => {
                const { totalDue, totalPaid, balance, paymentStatus, pct } = calculateBalance(r);
                return (
                  <tr key={r.id} className={styles.tr}>
                    {editMode && (
                      <td className={`${styles.td} ${styles.colCb}`}>
                        <input type="checkbox" checked={selectedIds.has(r.id)} onChange={e => {
                          const newSet = new Set(selectedIds);
                          if (e.target.checked) newSet.add(r.id); else newSet.delete(r.id);
                          setSelectedIds(newSet);
                        }} />
                      </td>
                    )}
                    <td className={`${styles.td} ${styles.colRef} ${editMode ? styles.editableCell : ''}`} ref={el => { editableRefs.current[`${r.id}_ref`] = el }}>
                      {editMode ? <input defaultValue={r.ref} /> : r.ref}
                    </td>
                    <td className={`${styles.td} ${styles.colPayor} ${editMode ? styles.editableCell : ''}`} ref={el => { editableRefs.current[`${r.id}_payor`] = el }}>
                      {editMode ? <input defaultValue={r.payor} /> : r.payor}
                    </td>
                    <td className={`${styles.td} ${styles.colContact} ${editMode ? styles.editableCell : ''}`} ref={el => { editableRefs.current[`${r.id}_contact`] = el }}>
                      {editMode ? <input defaultValue={r.contact} /> : r.contact}
                    </td>
                    <td className={`${styles.td} ${styles.colDeceased} ${editMode ? styles.editableCell : ''}`} ref={el => { editableRefs.current[`${r.id}_deceased`] = el }}>
                      {editMode ? <input defaultValue={r.deceased} /> : r.deceased}
                    </td>
                    <td className={`${styles.td} ${styles.colAddr} ${editMode ? styles.editableCell : ''}`} ref={el => { editableRefs.current[`${r.id}_address`] = el }}>
                      {editMode ? <input defaultValue={r.address} /> : r.address}
                    </td>
                    <td className={`${styles.td} ${styles.colDob} ${editMode ? styles.editableCell : ''}`} ref={el => { editableRefs.current[`${r.id}_birthDate`] = el }}>
                      {editMode ? <input defaultValue={r.birthDate} /> : r.birthDate}
                    </td>
                    <td className={`${styles.td} ${styles.colDod} ${editMode ? styles.editableCell : ''}`} ref={el => { editableRefs.current[`${r.id}_deathDate`] = el }}>
                      {editMode ? <input defaultValue={r.deathDate} /> : r.deathDate}
                    </td>
                    <td className={`${styles.td} ${styles.colYear} ${editMode ? styles.editableCell : ''}`} ref={el => { editableRefs.current[`${r.id}_yearPaid`] = el }}>
                      {editMode ? <input defaultValue={r.yearPaid} /> : r.yearPaid}
                    </td>

                    <td className={`${styles.td} ${styles.colTotal}`} style={{ color: '#7A7570' }}>₱{fmtNum(totalDue)}</td>
                    <td className={`${styles.td} ${styles.colPaid}`}>
                      <span className={paymentStatus === 'paid' ? styles.amtPaid : paymentStatus === 'partial' ? styles.amtPartial : styles.amtPending}>₱{fmtNum(totalPaid)}</span>
                    </td>
                    <td className={`${styles.td} ${styles.colBalance}`}>
                      <div className={balance === 0 && totalPaid > 0 ? styles.amtPaid : balance > 0 && totalPaid > 0 ? styles.amtPartial : styles.amtPending}>
                        {balance === 0 && totalPaid > 0 ? <span style={{ color: '#a5d6a7', fontSize: '.7rem' }}>CLEARED</span> : `₱${fmtNum(balance)}`}
                      </div>
                      <div className={styles.balanceBar}><div className={`${styles.balanceFill} ${pct >= 100 ? styles.fillPaid : pct > 0 ? styles.fillPartial : styles.fillPending}`} style={{ width: `${pct}%` }}></div></div>
                    </td>
                    <td className={`${styles.td} ${styles.colStatus}`}>
                      <span className={`${styles.badgeCell} ${paymentStatus === 'paid' ? styles.badgePaidCell : paymentStatus === 'partial' ? styles.badgePartialCell : styles.badgePendingCell}`}>
                        <span className={styles.badgeDot}></span>{paymentStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className={`${styles.td} ${styles.colRemarks} ${editMode ? styles.editableCell : ''}`} ref={el => { editableRefs.current[`${r.id}_remarks`] = el }}>
                      {editMode ? <input defaultValue={r.remarks} /> : r.remarks}
                    </td>
                    <td className={`${styles.td} ${styles.colActions}`}>
                      <div className={styles.tblActionGroup}>
                        <button className={styles.tblBtn} onClick={() => { setPaymentDetails(r); setShowPaymentModal(true); }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Payments">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                        </button>
                        <button className={styles.tblBtn} onClick={() => openEditModal(r.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Edit">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.839a.5.5 0 0 1-.62-.62l.84-2.871a2 2 0 0 1 .506-.854z"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {displayData.length === 0 && (
            <div className={styles.emptyState}>
              <div className={styles.icon} style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>
              </div>
              <h5>No Records Found</h5>
              <p>Import an Excel file or add a new row to get started.</p>
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        {displayData.length > 0 && (
          <div className={styles.panelFooter}>
            <div className={styles.paginationInfo}>
              Showing <strong>{showingStart}</strong> to <strong>{showingEnd}</strong> of <strong>{displayData.length}</strong> records
            </div>
            <div className={styles.paginationControls}>
              <div className={styles.rowsPerPage}>
                <span>Rows per page:</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className={styles.rowsSelect}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
              <div className={styles.pageButtons}>
                <button
                  className={styles.pageBtn}
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  title="First Page"
                >
                  «
                </button>
                <button
                  className={styles.pageBtn}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  title="Previous Page"
                >
                  ‹
                </button>
                {getPageNumbers().map((pg, idx) => {
                  if (pg === '...') {
                    return (
                      <span key={`ellipsis-${idx}`} className={styles.pageEllipsis}>
                        ...
                      </span>
                    );
                  }
                  return (
                    <button
                      key={`page-${pg}`}
                      className={`${styles.pageBtn} ${currentPage === pg ? styles.pageBtnActive : ''}`}
                      onClick={() => setCurrentPage(pg as number)}
                    >
                      {pg}
                    </button>
                  );
                })}
                <button
                  className={styles.pageBtn}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  title="Next Page"
                >
                  ›
                </button>
                <button
                  className={styles.pageBtn}
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  title="Last Page"
                >
                  »
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showRecordModal && (
        <div className={styles.modal}>
          <div className={`${styles.modalContent} ${styles.modalLg}`}>
            <div className={styles.modalHeader}>
              <h3>{formState.id ? 'Edit Record' : 'Add New Record'}</h3>
              <span className={styles.modalClose} onClick={() => { setShowRecordModal(false); setErrors({}); }}>&times;</span>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formSectionLabel}>Deceased & Payor Information</div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Reference No. *</label>
                  <input
                    className={`${styles.formControl} ${errors.ref ? styles.inputError : ''}`}
                    value={formState.ref}
                    onChange={e => handleFieldChange('ref', e.target.value)}
                  />
                  {errors.ref && <span className={styles.errorText}>{errors.ref}</span>}
                </div>
                <div className={styles.formGroup}>
                  <label>Payor's Name *</label>
                  <input
                    className={`${styles.formControl} ${errors.payor ? styles.inputError : ''}`}
                    value={formState.payor}
                    onChange={e => handleFieldChange('payor', e.target.value)}
                  />
                  {errors.payor && <span className={styles.errorText}>{errors.payor}</span>}
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Payor's Contact No. *</label>
                  <input
                    className={`${styles.formControl} ${errors.contact ? styles.inputError : ''}`}
                    value={formState.contact}
                    onChange={e => handleFieldChange('contact', e.target.value)}
                  />
                  {errors.contact && <span className={styles.errorText}>{errors.contact}</span>}
                </div>
                <div className={styles.formGroup}>
                  <label>Address *</label>
                  <input
                    className={`${styles.formControl} ${errors.address ? styles.inputError : ''}`}
                    value={formState.address}
                    onChange={e => handleFieldChange('address', e.target.value)}
                  />
                  {errors.address && <span className={styles.errorText}>{errors.address}</span>}
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Name of Deceased *</label>
                  <input
                    className={`${styles.formControl} ${errors.deceased ? styles.inputError : ''}`}
                    value={formState.deceased}
                    onChange={e => handleFieldChange('deceased', e.target.value)}
                  />
                  {errors.deceased && <span className={styles.errorText}>{errors.deceased}</span>}
                </div>
                <div className={styles.formGroup}>
                  <label>Gender *</label>
                  <select
                    className={`${styles.formControl} ${errors.gender ? styles.inputError : ''}`}
                    value={formState.gender}
                    onChange={e => handleFieldChange('gender', e.target.value)}
                  >
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                  {errors.gender && <span className={styles.errorText}>{errors.gender}</span>}
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Date of Birth *</label>
                  <input
                    type="date"
                    className={`${styles.formControl} ${errors.birthDate ? styles.inputError : ''}`}
                    value={formState.birthDate}
                    onChange={e => handleFieldChange('birthDate', e.target.value)}
                  />
                  {errors.birthDate && <span className={styles.errorText}>{errors.birthDate}</span>}
                </div>
                <div className={styles.formGroup}>
                  <label>Date of Death *</label>
                  <input
                    type="date"
                    className={`${styles.formControl} ${errors.deathDate ? styles.inputError : ''}`}
                    value={formState.deathDate}
                    onChange={e => handleFieldChange('deathDate', e.target.value)}
                  />
                  {errors.deathDate && <span className={styles.errorText}>{errors.deathDate}</span>}
                </div>
              </div>
              <div className={styles.formSectionLabel}>Payment Setup</div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Total Amount Due (₱) *</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="number"
                      className={`${styles.formControl} ${errors.totalAmount ? styles.inputError : ''}`}
                      value={formState.totalAmount}
                      onChange={e => handleAmountChange('totalAmount', e.target.value)}
                      placeholder="e.g. 1000"
                    />
                    <button type="button" className={styles.btnOutline} style={{ padding: '0 8px', fontSize: '0.8rem', whiteSpace: 'nowrap' }} onClick={() => handleAmountChange('totalAmount', '1000')}>₱1k</button>
                    <button type="button" className={styles.btnOutline} style={{ padding: '0 8px', fontSize: '0.8rem', whiteSpace: 'nowrap' }} onClick={() => handleAmountChange('totalAmount', '2000')}>₱2k</button>
                  </div>
                  {errors.totalAmount && <span className={styles.errorText}>{errors.totalAmount}</span>}
                </div>
                <div className={styles.formGroup}>
                  <label>Initial Payment (₱) *</label>
                  <input
                    type="number"
                    className={`${styles.formControl} ${errors.amountPaid ? styles.inputError : ''}`}
                    value={formState.amountPaid}
                    onChange={e => handleAmountChange('amountPaid', e.target.value)}
                    placeholder="e.g. 5000"
                    disabled={!!formState.id}
                    title={formState.id ? "Use the Payment module or table actions to add payments after creation." : "Initial payment amount"}
                  />
                  {errors.amountPaid && <span className={styles.errorText}>{errors.amountPaid}</span>}
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Due Date *</label>
                  <input
                    type="date"
                    className={`${styles.formControl} ${errors.duePaymentSchedule ? styles.inputError : ''}`}
                    value={formState.duePaymentSchedule}
                    onChange={e => handleFieldChange('duePaymentSchedule', e.target.value)}
                  />
                  {errors.duePaymentSchedule && <span className={styles.errorText}>{errors.duePaymentSchedule}</span>}
                </div>
                <div className={styles.formGroup}>
                  <label>Civil Status *</label>
                  <select
                    className={`${styles.formControl} ${errors.civilStatus ? styles.inputError : ''}`}
                    value={formState.civilStatus}
                    onChange={e => handleFieldChange('civilStatus', e.target.value)}
                  >
                    <option>Single</option>
                    <option>Married</option>
                    <option>Widowed</option>
                    <option>Separated</option>
                  </select>
                  {errors.civilStatus && <span className={styles.errorText}>{errors.civilStatus}</span>}
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Remarks / Lot No. *</label>
                <input
                  className={`${styles.formControl} ${errors.remarks ? styles.inputError : ''}`}
                  value={formState.remarks}
                  onChange={e => handleFieldChange('remarks', e.target.value)}
                />
                {errors.remarks && <span className={styles.errorText}>{errors.remarks}</span>}
              </div>
            </div>
            <div className={styles.modalFooter} style={{ justifyContent: formState.id ? 'space-between' : 'flex-end' }}>
              {formState.id && (
                <button
                  className={styles.btnDanger}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  onClick={() => {
                    if (!confirm(`Are you sure you want to delete the record for "${formState.deceased}"? This cannot be undone.`)) return;
                    const newInv = inventory.filter(r => r.id !== formState.id);
                    saveInventory(newInv);
                    setShowRecordModal(false);
                    setErrors({});
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                  Delete Record
                </button>
              )}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className={styles.btnOutline} onClick={() => { setShowRecordModal(false); setErrors({}); }}>Cancel</button>
                <button className={styles.btnGold} onClick={saveRecord}>Save Record</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPaymentModal && paymentDetails && (
        <div className={styles.modal}>
          <div className={`${styles.modalContent} ${styles.modalLg}`}>
            <div className={styles.modalHeader}>
              <h3>Payment Details — {paymentDetails.deceased}</h3>
              <span className={styles.modalClose} onClick={() => setShowPaymentModal(false)}>&times;</span>
            </div>
            <div className={styles.modalBody}>
              {(() => {
                const { totalDue, totalPaid, balance, pct } = calculateBalance(paymentDetails);
                return (
                  <>
                    <div className={styles.balanceSummary}>
                      <div className={styles.bsItem}><div className={styles.bsLabel}>Total Due</div><div className={styles.bsValue}>₱{fmtNum(totalDue)}</div></div>
                      <div className={styles.bsItem}><div className={styles.bsLabel}>Total Paid</div><div className={styles.bsValue} style={{ color: '#a5d6a7' }}>₱{fmtNum(totalPaid)}</div></div>
                      <div className={styles.bsItem}><div className={styles.bsLabel}>Balance</div><div className={styles.bsValue}>{balance === 0 ? 'CLEARED' : `₱${fmtNum(balance)}`}</div></div>
                    </div>
                    <div className={styles.balanceBar} style={{ height: 6, marginBottom: 18 }}><div className={`${styles.balanceFill} ${pct >= 100 ? styles.fillPaid : pct > 0 ? styles.fillPartial : styles.fillPending}`} style={{ width: `${pct}%` }}></div></div>
                  </>
                );
              })()}
              <div className={styles.formSectionLabel}>Transaction History</div>
              <ul className={styles.paymentTimeline}>
                {paymentDetails.payments && paymentDetails.payments.length > 0 ? (
                  paymentDetails.payments.map((p, i) => (
                    <li className={styles.ptItem} key={i}>
                      <div className={styles.ptDot} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                      </div>
                      <div className={styles.ptBody}>
                        <div className={styles.ptTitle}>₱{fmtNum(p.amount)} via {p.method}</div>
                        <div className={styles.ptMeta}>{p.date} · Recorded by {p.by}</div>
                        {p.or && <div className={styles.ptDetail}>OR No: <strong>{p.or}</strong></div>}
                      </div>
                    </li>
                  ))
                ) : (
                  <li style={{ color: '#7A7570', fontSize: '.82rem', padding: '12px 0' }}>No transactions recorded yet.</li>
                )}
              </ul>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.btnOutline} onClick={() => setShowPaymentModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showArchiveModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent} style={{ maxWidth: '420px' }}>
            <div className={styles.modalHeader}>
              <h3 style={{ color: '#FFD580' }}>📦 Archive Records</h3>
              <span className={styles.modalClose} onClick={() => setShowArchiveModal(false)}>&times;</span>
            </div>
            <div className={styles.modalBody}>
              <p style={{ marginBottom: '16px', color: '#F0EDE6', fontSize: '0.9rem' }}>
                You are about to archive <strong>{selectedIds.size}</strong> record(s). Archived records can be viewed and restored from the <strong>Archive</strong> section.
              </p>
              <div className={styles.formGroup}>
                <label>Reason for Archiving <span style={{ fontSize: '0.75rem', color: '#7A7570', fontWeight: 'normal' }}>(Optional)</span></label>
                <input
                  type="text"
                  className={styles.formControl}
                  value={archiveReason}
                  onChange={(e) => setArchiveReason(e.target.value)}
                  placeholder="e.g. Record expired, duplicate, etc."
                  autoFocus
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.btnOutline} onClick={() => setShowArchiveModal(false)} disabled={archiveLoading}>Cancel</button>
              <button className={styles.btnGold} onClick={executeArchive} disabled={archiveLoading}>
                {archiveLoading ? 'Archiving…' : '📦 Confirm Archive'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
