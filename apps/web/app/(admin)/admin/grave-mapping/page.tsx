'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { getDeceasedRecords, addDeceasedRecord, updateDeceasedRecord } from '../../../actions/deceased';

interface DeceasedPlotRecord {
  id: string;
  ref: string;
  payor: string;
  deceased: string;
  address: string;
  contact: string;
  birthDate?: string;
  deathDate?: string;
  yearPaid: string;
  totalAmount: number;
  amountPaid: number;
  balance: number;
  paymentStatus: 'paid' | 'partial' | 'pending' | 'overdue';
  remarks: string; // Used for Plot No: e.g. "A-1", "B-5"
}

const SECTIONS = ['A', 'B', 'C'];

export default function MapPage() {
  const [deceasedRecords, setDeceasedRecords] = useState<DeceasedPlotRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState('A');
  const [plotsCount, setPlotsCount] = useState<{ [key: string]: number }>({ 'A': 50, 'B': 50, 'C': 50 });

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedPlot, setSelectedPlot] = useState<string>('');
  const [existingRecord, setExistingRecord] = useState<DeceasedPlotRecord | null>(null);
  const [isEditingPlot, setIsEditingPlot] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add/Assign record state
  const [showAddModal, setShowAddModal] = useState(false);
  const [assignmentMode, setAssignmentMode] = useState<'existing' | 'new'>('existing');
  const [selectedExistingId, setSelectedExistingId] = useState('');
  const [formData, setFormData] = useState({
    deceased: '',
    payor: '',
    contact: '',
    address: 'Jasaan, Misamis Oriental',
    birthDate: '',
    deathDate: '',
    totalDue: '500',
    paid: '500',
    year: new Date().getFullYear().toString(),
  });

  useEffect(() => {
    loadDatabaseRecords();
    const savedCounts = localStorage.getItem('cemeteryMapPlotsCount');
    if (savedCounts) {
      try { setPlotsCount(JSON.parse(savedCounts)); } catch (e) { }
    }
  }, []);

  const loadDatabaseRecords = async () => {
    setLoading(true);
    try {
      const res = await getDeceasedRecords();
      if (res.success && res.records) {
        const mapped: DeceasedPlotRecord[] = res.records.map((r: any) => ({
          id: r.id,
          ref: r.REF_NO || `REF-${r.id.slice(0, 6)}`,
          payor: r.PAYORS_NAME || 'Unknown',
          deceased: r.NAME_OF_DECEASED || 'Unknown',
          address: r.ADDRESS || 'Jasaan',
          contact: r.CONTACT_NO || 'N/A',
          birthDate: r.DATE_OF_BIRTH ? new Date(r.DATE_OF_BIRTH).toISOString().split('T')[0] : '',
          deathDate: r.DATE_OF_DEATH ? new Date(r.DATE_OF_DEATH).toISOString().split('T')[0] : '',
          yearPaid: r.YEAR?.toString() || new Date().getFullYear().toString(),
          totalAmount: parseFloat(r.TOTAL_DUE as any) || 0,
          amountPaid: parseFloat(r.PAID as any) || 0,
          balance: parseFloat(r.BALANCE as any) || 0,
          paymentStatus: (r.STATUS || 'pending').toLowerCase() as any,
          remarks: r.REMARKS || '',
        }));
        setDeceasedRecords(mapped);
      }
    } catch (e) {
      console.error("Failed to load records from Supabase", e);
    } finally {
      setLoading(false);
    }
  };

  const getRecordForPlot = (plotId: string) => {
    // Check if remarks contains exact plotId (e.g. "A-1" or "Section A, Plot 1")
    return deceasedRecords.find(r => {
      if (!r.remarks) return false;
      const clean = r.remarks.trim();
      return clean === plotId || clean.toLowerCase() === `section ${plotId.toLowerCase()}` || clean.toLowerCase().includes(`plot ${plotId.toLowerCase()}`);
    });
  };

  const handlePlotClick = (plotId: string) => {
    const record = getRecordForPlot(plotId);
    setSelectedPlot(plotId);
    setIsEditingPlot(false);
    if (record) {
      setExistingRecord(record);
      setFormData({
        deceased: record.deceased || '',
        payor: record.payor || '',
        contact: record.contact || '',
        address: record.address || 'Jasaan',
        birthDate: record.birthDate || '',
        deathDate: record.deathDate || '',
        totalDue: record.totalAmount.toString(),
        paid: record.amountPaid.toString(),
        year: record.yearPaid,
      });
      setShowModal(true);
    } else {
      setExistingRecord(null);
      setSelectedExistingId('');
      setAssignmentMode('existing');
      setFormData({
        deceased: '',
        payor: '',
        contact: '',
        address: 'Jasaan, Misamis Oriental',
        birthDate: '',
        deathDate: new Date().toISOString().split('T')[0] || '',
        totalDue: '500',
        paid: '500',
        year: new Date().getFullYear().toString(),
      });
      setShowAddModal(true);
    }
  };

  const handleAssignPlot = async () => {
    setIsSubmitting(true);
    try {
      if (assignmentMode === 'existing') {
        if (!selectedExistingId) {
          alert('Please select an existing deceased record.');
          setIsSubmitting(false);
          return;
        }

        const target = deceasedRecords.find(r => r.id === selectedExistingId);
        const res = await updateDeceasedRecord(selectedExistingId, {
          REMARKS: selectedPlot,
        });

        if (!res.success) {
          alert('Failed to assign plot: ' + res.error);
          setIsSubmitting(false);
          return;
        }

        alert(`Successfully assigned ${target?.deceased || 'record'} to Plot ${selectedPlot}!`);
      } else {
        if (!formData.deceased) {
          alert('Name of deceased is required.');
          setIsSubmitting(false);
          return;
        }

        const res = await addDeceasedRecord({
          NAME_OF_DECEASED: formData.deceased,
          PAYORS_NAME: formData.payor || 'Family of ' + formData.deceased,
          CONTACT_NO: formData.contact || 'N/A',
          ADDRESS: formData.address || 'Jasaan, Misamis Oriental',
          DATE_OF_BIRTH: formData.birthDate || '1970-01-01',
          DATE_OF_DEATH: formData.deathDate || new Date().toISOString().split('T')[0] || '2026-01-01',
          YEAR: parseInt(formData.year) || new Date().getFullYear(),
          TOTAL_DUE: parseFloat(formData.totalDue) || 500,
          PAID: parseFloat(formData.paid) || 500,
          REMARKS: selectedPlot,
        });

        if (!res.success) {
          alert('Failed to add record: ' + res.error);
          setIsSubmitting(false);
          return;
        }

        alert(`Successfully added and assigned ${formData.deceased} to Plot ${selectedPlot}!`);
      }

      setShowAddModal(false);
      await loadDatabaseRecords();
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!existingRecord) return;
    if (!formData.deceased) return alert('Name of deceased is required.');

    setIsSubmitting(true);
    try {
      const res = await updateDeceasedRecord(existingRecord.id, {
        NAME_OF_DECEASED: formData.deceased,
        PAYORS_NAME: formData.payor,
        CONTACT_NO: formData.contact,
        ADDRESS: formData.address,
        DATE_OF_BIRTH: formData.birthDate,
        DATE_OF_DEATH: formData.deathDate,
      });

      if (!res.success) {
        alert('Failed to update record: ' + res.error);
        setIsSubmitting(false);
        return;
      }

      alert('Record updated in database!');
      setIsEditingPlot(false);
      setShowModal(false);
      await loadDatabaseRecords();
    } catch (err: any) {
      alert('Error updating: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnassignPlot = async () => {
    if (!existingRecord) return;
    if (!confirm(`Are you sure you want to unassign ${existingRecord.deceased} from Plot ${selectedPlot}?`)) return;

    setIsSubmitting(true);
    try {
      const res = await updateDeceasedRecord(existingRecord.id, {
        REMARKS: '', // Clear plot
      });

      if (!res.success) {
        alert('Failed to unassign: ' + res.error);
        setIsSubmitting(false);
        return;
      }

      alert(`Plot ${selectedPlot} is now available.`);
      setShowModal(false);
      await loadDatabaseRecords();
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddNewPlot = () => {
    const nextCount = (plotsCount[currentSection] || 50) + 1;
    const newCounts = { ...plotsCount, [currentSection]: nextCount };
    setPlotsCount(newCounts);
    localStorage.setItem('cemeteryMapPlotsCount', JSON.stringify(newCounts));
  };

  // Generate plot grid for current section
  const plots = [];
  const currentMaxPlots = plotsCount[currentSection] || 50;
  for (let i = 1; i <= currentMaxPlots; i++) {
    const plotId = `${currentSection}-${i}`;
    const record = getRecordForPlot(plotId);
    plots.push({ id: plotId, record });
  }

  const occupiedCount = plots.filter(p => !!p.record).length;
  const availableCount = plots.length - occupiedCount;

  const unassignedRecords = deceasedRecords.filter(r => !r.remarks || r.remarks.trim() === '');

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div className={styles.title}>
          <h3>Graveyard Map</h3>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
            Visual plot manager connected to Supabase database
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
        <div style={{ background: 'var(--admin-panel-bg)', border: '1px solid var(--admin-border)', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: '#7A7570', textTransform: 'uppercase' }}>Section {currentSection} Total</div>
          <div style={{ fontFamily: 'serif', fontSize: '1.8rem', color: '#E2C97E', margin: '4px 0' }}>{plots.length}</div>
          <div style={{ fontSize: '0.75rem', color: '#7A7570' }}>Total plots configured</div>
        </div>
        <div style={{ background: 'var(--admin-panel-bg)', border: '1px solid var(--admin-border)', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: '#7A7570', textTransform: 'uppercase' }}>Occupied Plots</div>
          <div style={{ fontFamily: 'serif', fontSize: '1.8rem', color: '#ff7043', margin: '4px 0' }}>{occupiedCount}</div>
          <div style={{ fontSize: '0.75rem', color: '#7A7570' }}>{plots.length > 0 ? Math.round((occupiedCount / plots.length) * 100) : 0}% Occupancy</div>
        </div>
        <div style={{ background: 'var(--admin-panel-bg)', border: '1px solid var(--admin-border)', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: '#7A7570', textTransform: 'uppercase' }}>Available Plots</div>
          <div style={{ fontFamily: 'serif', fontSize: '1.8rem', color: '#66bb6a', margin: '4px 0' }}>{availableCount}</div>
          <div style={{ fontSize: '0.75rem', color: '#7A7570' }}>Ready for assignment</div>
        </div>
        <div style={{ background: 'var(--admin-panel-bg)', border: '1px solid var(--admin-border)', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: '#7A7570', textTransform: 'uppercase' }}>Unassigned Records</div>
          <div style={{ fontFamily: 'serif', fontSize: '1.8rem', color: '#42a5f5', margin: '4px 0' }}>{unassignedRecords.length}</div>
          <div style={{ fontSize: '0.75rem', color: '#7A7570' }}>Deceased awaiting plot</div>
        </div>
      </div>

      <div className={styles.mapControls}>
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <div className={`${styles.legendBox} ${styles.boxAvailable}`}></div>
            <span>Available Plot ({availableCount})</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendBox} ${styles.boxOccupied}`}></div>
            <span>Occupied Plot ({occupiedCount})</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select
            className={styles.sectionSelect}
            value={currentSection}
            onChange={(e) => setCurrentSection(e.target.value)}
          >
            {SECTIONS.map(s => <option key={s} value={s}>Section {s}</option>)}
          </select>
          <button className={styles.btnOutline} style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={handleAddNewPlot}>
            + Add Plot Slot
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', color: 'var(--admin-text-muted)' }}>
          Loading cemetery plots from database...
        </div>
      ) : (
        <div className={styles.mapGrid}>
          {plots.map(plot => {
            const isOverdue = plot.record?.paymentStatus === 'overdue';
            return (
              <div
                key={plot.id}
                className={`${styles.plot} ${plot.record ? styles.plotOccupied : styles.plotAvailable}`}
                style={isOverdue ? { borderColor: '#ffa726' } : {}}
                onClick={() => handlePlotClick(plot.id)}
              >
                <div className={styles.plotId}>{plot.id}</div>
                <div className={styles.plotIcon}>{plot.record ? '⚰️' : '🌿'}</div>
                {plot.record && (
                  <div className={styles.plotName} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {plot.record.deceased}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* View/Edit Modal (Occupied Plot) */}
      {showModal && existingRecord && (
        <div className={styles.modal} onClick={e => { if (e.target === e.currentTarget && !isSubmitting) setShowModal(false); }}>
          <div className={styles.modalContent} style={{ maxWidth: '520px' }}>
            <div className={styles.modalHeader}>
              <h3>Plot Details: {selectedPlot}</h3>
              <span className={styles.modalClose} onClick={() => !isSubmitting && setShowModal(false)}>&times;</span>
            </div>
            <div className={styles.modalBody}>
              {isEditingPlot ? (
                <div>
                  <div className={styles.formGroup}>
                    <label>Deceased Name *</label>
                    <input
                      className={styles.formControl}
                      placeholder="Full name of deceased"
                      value={formData.deceased}
                      onChange={e => setFormData({ ...formData, deceased: e.target.value })}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div className={styles.formGroup} style={{ flex: 1 }}>
                      <label>Payor / Family Name</label>
                      <input
                        className={styles.formControl}
                        value={formData.payor}
                        onChange={e => setFormData({ ...formData, payor: e.target.value })}
                      />
                    </div>
                    <div className={styles.formGroup} style={{ flex: 1 }}>
                      <label>Contact No.</label>
                      <input
                        className={styles.formControl}
                        value={formData.contact}
                        onChange={e => setFormData({ ...formData, contact: e.target.value })}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div className={styles.formGroup} style={{ flex: 1 }}>
                      <label>Date of Birth</label>
                      <input
                        type="date"
                        className={styles.formControl}
                        value={formData.birthDate}
                        onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                      />
                    </div>
                    <div className={styles.formGroup} style={{ flex: 1 }}>
                      <label>Date of Death</label>
                      <input
                        type="date"
                        className={styles.formControl}
                        value={formData.deathDate}
                        onChange={e => setFormData({ ...formData, deathDate: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className={styles.recordDetails}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Reference No.</span>
                    <span className={styles.detailValue} style={{ color: 'var(--admin-gold)', fontFamily: 'monospace' }}>{existingRecord.ref}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Deceased Name</span>
                    <span className={styles.detailValue}><strong>{existingRecord.deceased}</strong></span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Next of Kin / Payor</span>
                    <span className={styles.detailValue}>{existingRecord.payor || '—'}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Contact No.</span>
                    <span className={styles.detailValue}>{existingRecord.contact || '—'}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Date of Birth</span>
                    <span className={styles.detailValue}>{existingRecord.birthDate || 'Unknown'}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Date of Death</span>
                    <span className={styles.detailValue}>{existingRecord.deathDate || 'Unknown'}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Total Due / Paid</span>
                    <span className={styles.detailValue}>₱{existingRecord.totalAmount} / ₱{existingRecord.amountPaid}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Payment Status</span>
                    <span className={styles.detailValue} style={{ textTransform: 'uppercase', fontWeight: 'bold', color: existingRecord.paymentStatus === 'paid' ? '#81c784' : existingRecord.paymentStatus === 'overdue' ? '#ff8a65' : '#e0e0e0' }}>
                      {existingRecord.paymentStatus}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className={styles.modalFooter}>
              {isEditingPlot ? (
                <>
                  <button className={styles.btnOutline} disabled={isSubmitting} onClick={() => setIsEditingPlot(false)}>Cancel</button>
                  <button className={styles.btnGold} disabled={isSubmitting} onClick={handleEditSubmit}>
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              ) : (
                <>
                  <button className={styles.btnDanger} disabled={isSubmitting} onClick={handleUnassignPlot}>
                    Unassign Plot
                  </button>
                  <button className={styles.btnOutline} style={{ color: '#c9a84c', borderColor: '#c9a84c', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => setIsEditingPlot(true)}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                    Edit Info
                  </button>
                  <button className={styles.btnOutline} onClick={() => setShowModal(false)}>Close</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add / Assign Modal (Available Plot) */}
      {showAddModal && (
        <div className={styles.modal} onClick={e => { if (e.target === e.currentTarget && !isSubmitting) setShowAddModal(false); }}>
          <div className={styles.modalContent} style={{ maxWidth: '520px' }}>
            <div className={styles.modalHeader}>
              <h3>Assign Plot: {selectedPlot}</h3>
              <span className={styles.modalClose} onClick={() => !isSubmitting && setShowAddModal(false)}>&times;</span>
            </div>
            <div className={styles.modalBody}>
              {/* Tabs */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '18px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '10px' }}>
                <button
                  type="button"
                  onClick={() => setAssignmentMode('existing')}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: assignmentMode === 'existing' ? 'var(--admin-gold)' : 'var(--admin-border)',
                    backgroundColor: assignmentMode === 'existing' ? 'rgba(200, 168, 75, 0.15)' : 'transparent',
                    color: assignmentMode === 'existing' ? 'var(--admin-gold)' : 'var(--admin-text-muted)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.82rem'
                  }}
                >
                  Select Existing Record ({unassignedRecords.length})
                </button>
                <button
                  type="button"
                  onClick={() => setAssignmentMode('new')}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: assignmentMode === 'new' ? 'var(--admin-gold)' : 'var(--admin-border)',
                    backgroundColor: assignmentMode === 'new' ? 'rgba(200, 168, 75, 0.15)' : 'transparent',
                    color: assignmentMode === 'new' ? 'var(--admin-gold)' : 'var(--admin-text-muted)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.82rem'
                  }}
                >
                  + Add New Deceased
                </button>
              </div>

              {assignmentMode === 'existing' ? (
                <div>
                  <div className={styles.formGroup}>
                    <label>CHOOSE DECEASED FROM SUPABASE *</label>
                    <select
                      className={styles.formControl}
                      value={selectedExistingId}
                      onChange={e => setSelectedExistingId(e.target.value)}
                    >
                      <option value="">-- Choose Deceased Person --</option>
                      {unassignedRecords.map(r => (
                        <option key={r.id} value={r.id}>
                          {r.deceased} (Ref: {r.ref} · Died: {r.deathDate || 'N/A'})
                        </option>
                      ))}
                    </select>
                  </div>
                  {selectedExistingId && (
                    <div style={{ marginTop: '12px', padding: '12px', background: 'var(--admin-input-bg)', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '0.85rem' }}>
                      {(() => {
                        const rec = deceasedRecords.find(r => r.id === selectedExistingId);
                        if (!rec) return null;
                        return (
                          <div>
                            <div><strong>Deceased:</strong> {rec.deceased}</div>
                            <div><strong>Payor:</strong> {rec.payor}</div>
                            <div><strong>Contact:</strong> {rec.contact}</div>
                            <div><strong>Date of Death:</strong> {rec.deathDate}</div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className={styles.formGroup}>
                    <label>Deceased Name *</label>
                    <input
                      className={styles.formControl}
                      placeholder="Full name of deceased"
                      value={formData.deceased}
                      onChange={e => setFormData({ ...formData, deceased: e.target.value })}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div className={styles.formGroup} style={{ flex: 1 }}>
                      <label>Payor Name</label>
                      <input
                        className={styles.formControl}
                        placeholder="Family contact person"
                        value={formData.payor}
                        onChange={e => setFormData({ ...formData, payor: e.target.value })}
                      />
                    </div>
                    <div className={styles.formGroup} style={{ flex: 1 }}>
                      <label>Contact No.</label>
                      <input
                        className={styles.formControl}
                        placeholder="09XXXXXXXXX"
                        value={formData.contact}
                        onChange={e => setFormData({ ...formData, contact: e.target.value })}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div className={styles.formGroup} style={{ flex: 1 }}>
                      <label>Date of Birth</label>
                      <input
                        type="date"
                        className={styles.formControl}
                        value={formData.birthDate}
                        onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                      />
                    </div>
                    <div className={styles.formGroup} style={{ flex: 1 }}>
                      <label>Date of Death</label>
                      <input
                        type="date"
                        className={styles.formControl}
                        value={formData.deathDate}
                        onChange={e => setFormData({ ...formData, deathDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div className={styles.formGroup} style={{ flex: 1 }}>
                      <label>Total Due (₱)</label>
                      <input
                        type="number"
                        className={styles.formControl}
                        value={formData.totalDue}
                        onChange={e => setFormData({ ...formData, totalDue: e.target.value })}
                      />
                    </div>
                    <div className={styles.formGroup} style={{ flex: 1 }}>
                      <label>Amount Paid (₱)</label>
                      <input
                        type="number"
                        className={styles.formControl}
                        value={formData.paid}
                        onChange={e => setFormData({ ...formData, paid: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.btnOutline} disabled={isSubmitting} onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className={styles.btnGold} disabled={isSubmitting} onClick={handleAssignPlot}>
                {isSubmitting ? 'Saving...' : 'Assign to Plot'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
