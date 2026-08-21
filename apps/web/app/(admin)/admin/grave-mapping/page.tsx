'use client';

import React, { useState, useEffect, useMemo } from 'react';
import styles from './page.module.css';
import Cemetery2DMap from '../../../../components/mapping/Cemetery2DMap';
import {
  getGraveMapData,
  assignDeceasedToGrave,
  unassignGrave,
  updateGraveStatus,
  searchDeceasedForAssignment,
  GravePlotWithDeceased
} from '../../../actions/mapping';
import { addDeceasedRecord } from '../../../actions/deceased';

export default function AdminGraveMappingPage() {
  const [plots, setPlots] = useState<GravePlotWithDeceased[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Selection
  const [filterSection, setFilterSection] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightPlot, setHighlightPlot] = useState<string | null>(null);
  const [selectedPlot, setSelectedPlot] = useState<GravePlotWithDeceased | null>(null);

  // Modal States
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showOccupiedModal, setShowOccupiedModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Assignment Sub-states
  const [assignmentMode, setAssignmentMode] = useState<'search' | 'create' | 'confirm'>('search');
  const [deceasedSearchResults, setDeceasedSearchResults] = useState<any[]>([]);
  const [deceasedSearchQuery, setDeceasedSearchQuery] = useState('');
  const [selectedDeceased, setSelectedDeceased] = useState<any | null>(null);
  const [assignmentNotes, setAssignmentNotes] = useState('');

  // Quick Create Deceased State
  const [newDeceasedForm, setNewDeceasedForm] = useState({
    NAME_OF_DECEASED: '',
    PAYORS_NAME: '',
    CONTACT_NO: '',
    ADDRESS: '',
    DATE_OF_BIRTH: '',
    DATE_OF_DEATH: '',
    YEAR: new Date().getFullYear(),
    TOTAL_DUE: 1500,
    PAID: 1500
  });

  // Status Edit State
  const [editStatus, setEditStatus] = useState<string>('Available');
  const [editPlotType, setEditPlotType] = useState<string>('Standard Ground Plot');
  const [editNotes, setEditNotes] = useState<string>('');

  // Notifications
  const [alert, setAlert] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // ── Load Grave Plots ────────────────────────────────────────
  const loadPlots = async () => {
    try {
      setLoading(true);
      const res = await getGraveMapData();
      if (res.success && res.plots) {
        setPlots(res.plots);
      } else {
        showAlert(res.error || 'Failed to load grave map data.', 'error');
      }
    } catch (e: any) {
      showAlert(e.message || 'Error connecting to database.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlots();
  }, []);

  const showAlert = (text: string, type: 'success' | 'error') => {
    setAlert({ text, type });
    setTimeout(() => setAlert(null), 6000);
  };

  // ── Statistics Calculations ─────────────────────────────────
  const totalPlots = plots.length;
  const availableCount = plots.filter(p => p.status === 'Available').length;
  const occupiedCount = plots.filter(p => p.status === 'Occupied').length;
  const reservedCount = plots.filter(p => p.status === 'Reserved').length;
  const maintenanceCount = plots.filter(p => p.status === 'Maintenance').length;
  const occupancyRate = totalPlots > 0 ? ((occupiedCount / totalPlots) * 100).toFixed(1) : '0';

  // ── Search & Autocomplete ───────────────────────────────────
  const searchMatches = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return plots
      .filter(p => {
        const plotMatch = p.plotNumber.toLowerCase().includes(q);
        const nameMatch = p.deceasedRecord?.NAME_OF_DECEASED.toLowerCase().includes(q);
        const refMatch = p.deceasedRecord?.REF_NO.toLowerCase().includes(q);
        return plotMatch || nameMatch || refMatch;
      })
      .slice(0, 8);
  }, [plots, searchQuery]);

  // ── Handle Plot Click on 2D Map ─────────────────────────────
  const handlePlotClick = (plot: GravePlotWithDeceased) => {
    setSelectedPlot(plot);
    setHighlightPlot(plot.plotNumber);

    if (plot.status === 'Available') {
      setAssignmentMode('search');
      setSelectedDeceased(null);
      setAssignmentNotes(plot.notes || '');
      setShowAssignModal(true);
      searchDeceased('');
    } else if (plot.status === 'Occupied') {
      setShowOccupiedModal(true);
    } else {
      // Reserved, Maintenance, Unavailable
      setEditStatus(plot.status);
      setEditPlotType(plot.plotType);
      setEditNotes(plot.notes || '');
      setShowStatusModal(true);
    }
  };

  // ── Deceased Search for Assignment ──────────────────────────
  const searchDeceased = async (q: string) => {
    setDeceasedSearchQuery(q);
    const res = await searchDeceasedForAssignment(q);
    if (res.success && res.records) {
      setDeceasedSearchResults(res.records);
    }
  };

  // ── Execute Grave Assignment ────────────────────────────────
  const handleConfirmAssignment = async () => {
    if (!selectedPlot || !selectedDeceased) {
      showAlert('Please select both a plot and a deceased person.', 'error');
      return;
    }

    const res = await assignDeceasedToGrave({
      plotNumber: selectedPlot.plotNumber,
      deceasedId: selectedDeceased.id,
      notes: assignmentNotes
    });

    if (res.success) {
      showAlert(res.message || 'Deceased assigned successfully!', 'success');
      setShowAssignModal(false);
      setSelectedDeceased(null);
      await loadPlots();
    } else {
      showAlert(res.error || 'Failed to assign plot.', 'error');
    }
  };

  // ── Quick Register & Assign ─────────────────────────────────
  const handleQuickCreateAndAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlot) return;

    if (!newDeceasedForm.NAME_OF_DECEASED || !newDeceasedForm.PAYORS_NAME || !newDeceasedForm.DATE_OF_DEATH) {
      showAlert('Please fill in required fields (Deceased Name, Payor, Date of Death).', 'error');
      return;
    }

    try {
      const createRes = await addDeceasedRecord({
        ...newDeceasedForm,
        REMARKS: `Plot ${selectedPlot.plotNumber}`
      });

      if (!createRes.success || !createRes.record) {
        showAlert(createRes.error || 'Failed to register deceased.', 'error');
        return;
      }

      const assignRes = await assignDeceasedToGrave({
        plotNumber: selectedPlot.plotNumber,
        deceasedId: createRes.record.id,
        notes: assignmentNotes
      });

      if (assignRes.success) {
        showAlert(`Successfully registered & assigned ${newDeceasedForm.NAME_OF_DECEASED} to Plot ${selectedPlot.plotNumber}!`, 'success');
        setShowAssignModal(false);
        await loadPlots();
      } else {
        showAlert(assignRes.error || 'Registered deceased but failed to assign plot.', 'error');
      }
    } catch (err: any) {
      showAlert(err.message || 'Error creating record.', 'error');
    }
  };

  // ── Vacate / Unassign Plot ──────────────────────────────────
  const handleVacatePlot = async () => {
    if (!selectedPlot) return;
    if (!confirm(`Are you sure you want to vacate Plot ${selectedPlot.plotNumber}? This will remove the deceased assignment.`)) return;

    const res = await unassignGrave(selectedPlot.plotNumber);
    if (res.success) {
      showAlert(res.message || 'Plot vacated successfully.', 'success');
      setShowOccupiedModal(false);
      await loadPlots();
    } else {
      showAlert(res.error || 'Failed to vacate plot.', 'error');
    }
  };

  // ── Update Plot Status ──────────────────────────────────────
  const handleSaveStatus = async () => {
    if (!selectedPlot) return;

    const res = await updateGraveStatus({
      plotNumber: selectedPlot.plotNumber,
      status: editStatus as any,
      plotType: editPlotType,
      notes: editNotes
    });

    if (res.success) {
      showAlert(res.message || 'Status updated successfully.', 'success');
      setShowStatusModal(false);
      await loadPlots();
    } else {
      showAlert(res.error || 'Failed to update status.', 'error');
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h3>Grave Mapping &amp; Plot Assignment</h3>
          <p>Interactive 2D top-down site plan of Jasaan Public Cemetery with live database plot assignment.</p>
        </div>
      </div>

      {/* Alert Banner */}
      {alert && (
        <div className={`${styles.alertBanner} ${alert.type === 'success' ? styles.alertSuccess : styles.alertError}`}>
          <span>{alert.type === 'success' ? '✅' : '⚠️'}</span>
          <span>{alert.text}</span>
        </div>
      )}

      {/* Stats Summary Cards */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Grave Plots</div>
          <div className={styles.statValue}>{totalPlots}</div>
          <div className={styles.statSub}>Sections A, B, C</div>
        </div>
        <div className={`${styles.statCard} ${styles.statGreen}`}>
          <div className={styles.statLabel}>Available Plots</div>
          <div className={styles.statValue}>{availableCount}</div>
          <div className={styles.statSub}>Ready for assignment</div>
        </div>
        <div className={`${styles.statCard} ${styles.statRed}`}>
          <div className={styles.statLabel}>Occupied Plots</div>
          <div className={styles.statValue}>{occupiedCount}</div>
          <div className={styles.statSub}>{occupancyRate}% occupancy rate</div>
        </div>
        <div className={`${styles.statCard} ${styles.statOrange}`}>
          <div className={styles.statLabel}>Reserved Plots</div>
          <div className={styles.statValue}>{reservedCount}</div>
          <div className={styles.statSub}>Held for families</div>
        </div>
        <div className={`${styles.statCard} ${styles.statBlue}`}>
          <div className={styles.statLabel}>Maintenance</div>
          <div className={styles.statValue}>{maintenanceCount}</div>
          <div className={styles.statSub}>Under restoration</div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search Plot (e.g. A-001) or Deceased Name..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />

          {/* Autocomplete Dropdown */}
          {searchMatches.length > 0 && searchQuery.trim() && (
            <div className={styles.searchDropdown}>
              {searchMatches.map(m => (
                <div
                  key={m.id}
                  className={styles.searchDropdownItem}
                  onClick={() => {
                    setHighlightPlot(m.plotNumber);
                    handlePlotClick(m);
                    setSearchQuery('');
                  }}
                >
                  <div>
                    <strong style={{ color: '#E2C97E' }}>Plot {m.plotNumber}</strong>
                    <span style={{ color: '#a8a29e', marginLeft: '8px', fontSize: '0.78rem' }}>
                      ({m.section} - {m.status})
                    </span>
                    {m.deceasedRecord && (
                      <div style={{ color: '#ffffff', fontSize: '0.78rem', marginTop: '2px' }}>
                        ✝ {m.deceasedRecord.NAME_OF_DECEASED}
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#81c784' }}>📍 Locate Plot →</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section Filter */}
        <select className={styles.filterSelect} value={filterSection} onChange={e => setFilterSection(e.target.value)}>
          <option value="all">All Sections (A, B, C)</option>
          <option value="A">Section A · West Lawn</option>
          <option value="B">Section B · East Lawn</option>
          <option value="C">Section C · North Garden</option>
        </select>

        {/* Status Filter */}
        <select className={styles.filterSelect} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">All Plot Statuses</option>
          <option value="Available">🟢 Available</option>
          <option value="Occupied">🔴 Occupied</option>
          <option value="Reserved">🟡 Reserved</option>
          <option value="Maintenance">🔵 Maintenance</option>
        </select>

        <button className={styles.btnOutline} onClick={loadPlots} title="Refresh Live Map">
          🔄 Refresh Map
        </button>
      </div>

      {/* Interactive 2D Cemetery Map */}
      <Cemetery2DMap
        plots={plots}
        selectedPlotNumber={selectedPlot?.plotNumber}
        highlightPlotNumber={highlightPlot}
        onSelectPlot={handlePlotClick}
        filterSection={filterSection}
        filterStatus={filterStatus}
      />

      {/* ============================================================
          MODAL 1: ASSIGN DECEASED PERSON (Available Plot)
      ============================================================ */}
      {showAssignModal && selectedPlot && (
        <div className={styles.modalOverlay} onClick={e => { if (e.target === e.currentTarget) setShowAssignModal(false); }}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>
                <span>🟩</span> Assign Deceased to Plot {selectedPlot.plotNumber}
              </h3>
              <button className={styles.modalClose} onClick={() => setShowAssignModal(false)}>&times;</button>
            </div>

            <div className={styles.modalBody}>
              {/* Plot Header Info */}
              <div style={{ background: '#0e120f', border: '1px solid rgba(200, 168, 75, 0.25)', borderRadius: '8px', padding: '12px 16px', marginBottom: '18px', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ color: '#E2C97E', fontWeight: 'bold' }}>Plot {selectedPlot.plotNumber}</div>
                  <div style={{ color: '#a8a29e', fontSize: '0.78rem' }}>Section {selectedPlot.section} (Row {selectedPlot.row}, Col {selectedPlot.column})</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ background: '#2e7d32', color: '#ffffff', padding: '3px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                    Available
                  </span>
                  <div style={{ color: '#a8a29e', fontSize: '0.72rem', marginTop: '4px' }}>{selectedPlot.plotType}</div>
                </div>
              </div>

              {/* Mode Toggle Tabs */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <button
                  type="button"
                  className={assignmentMode === 'search' || assignmentMode === 'confirm' ? styles.btnGold : styles.btnOutline}
                  onClick={() => setAssignmentMode('search')}
                >
                  🔍 Select Existing Deceased
                </button>
                <button
                  type="button"
                  className={assignmentMode === 'create' ? styles.btnGold : styles.btnOutline}
                  onClick={() => setAssignmentMode('create')}
                >
                  ➕ Register New Deceased
                </button>
              </div>

              {/* ── SUB-VIEW A: SEARCH EXISTING DECEASED ── */}
              {assignmentMode === 'search' && (
                <div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Search Deceased Person</label>
                    <input
                      type="text"
                      className={styles.formControl}
                      placeholder="Type deceased name or reference number..."
                      value={deceasedSearchQuery}
                      onChange={e => searchDeceased(e.target.value)}
                      autoFocus
                    />
                  </div>

                  <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '14px' }}>
                    {deceasedSearchResults.length === 0 ? (
                      <div style={{ color: '#78716c', fontSize: '0.8rem', textAlign: 'center', padding: '20px' }}>
                        {deceasedSearchQuery ? 'No unassigned deceased found.' : 'Search for a deceased record to assign to this plot.'}
                      </div>
                    ) : (
                      deceasedSearchResults.map(d => (
                        <div
                          key={d.id}
                          className={`${styles.deceasedSelectionCard} ${selectedDeceased?.id === d.id ? styles.deceasedSelectionCardActive : ''}`}
                          onClick={() => {
                            setSelectedDeceased(d);
                            setAssignmentMode('confirm');
                          }}
                        >
                          <div>
                            <div style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.88rem' }}>✝ {d.NAME_OF_DECEASED}</div>
                            <div style={{ color: '#a8a29e', fontSize: '0.75rem' }}>Ref: {d.REF_NO} · Payor: {d.PAYORS_NAME}</div>
                            <div style={{ color: '#78716c', fontSize: '0.72rem' }}>Died: {new Date(d.DATE_OF_DEATH).toLocaleDateString()}</div>
                          </div>
                          <button type="button" className={styles.btnGold} style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                            Select →
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* ── SUB-VIEW B: QUICK REGISTER NEW DECEASED ── */}
              {assignmentMode === 'create' && (
                <form onSubmit={handleQuickCreateAndAssign}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Full Name of Deceased *</label>
                    <input
                      type="text"
                      className={styles.formControl}
                      value={newDeceasedForm.NAME_OF_DECEASED}
                      onChange={e => setNewDeceasedForm({ ...newDeceasedForm, NAME_OF_DECEASED: e.target.value })}
                      required
                      placeholder="e.g. Juan Santos Dela Cruz"
                    />
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Date of Birth</label>
                      <input
                        type="date"
                        className={styles.formControl}
                        value={newDeceasedForm.DATE_OF_BIRTH}
                        onChange={e => setNewDeceasedForm({ ...newDeceasedForm, DATE_OF_BIRTH: e.target.value })}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Date of Death *</label>
                      <input
                        type="date"
                        className={styles.formControl}
                        value={newDeceasedForm.DATE_OF_DEATH}
                        onChange={e => setNewDeceasedForm({ ...newDeceasedForm, DATE_OF_DEATH: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Family / Payor Name *</label>
                      <input
                        type="text"
                        className={styles.formControl}
                        value={newDeceasedForm.PAYORS_NAME}
                        onChange={e => setNewDeceasedForm({ ...newDeceasedForm, PAYORS_NAME: e.target.value })}
                        required
                        placeholder="e.g. Maria Dela Cruz"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Contact Number</label>
                      <input
                        type="text"
                        className={styles.formControl}
                        value={newDeceasedForm.CONTACT_NO}
                        onChange={e => setNewDeceasedForm({ ...newDeceasedForm, CONTACT_NO: e.target.value })}
                        placeholder="e.g. 09123456789"
                      />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Address</label>
                    <input
                      type="text"
                      className={styles.formControl}
                      value={newDeceasedForm.ADDRESS}
                      onChange={e => setNewDeceasedForm({ ...newDeceasedForm, ADDRESS: e.target.value })}
                      placeholder="e.g. Poblacion, Jasaan"
                    />
                  </div>

                  <div className={styles.modalFooter} style={{ padding: '16px 0 0 0' }}>
                    <button type="button" className={styles.btnOutline} onClick={() => setAssignmentMode('search')}>Back</button>
                    <button type="submit" className={styles.btnGold}>✓ Register &amp; Assign to Plot</button>
                  </div>
                </form>
              )}

              {/* ── SUB-VIEW C: CONFIRMATION SCREEN ── */}
              {assignmentMode === 'confirm' && selectedDeceased && (
                <div>
                  <div style={{ background: '#1c221e', border: '1px solid #C8A84B', borderRadius: '10px', padding: '16px', marginBottom: '18px' }}>
                    <h4 style={{ color: '#E2C97E', margin: '0 0 10px 0', fontSize: '1rem' }}>Confirm Grave Assignment</h4>
                    <div style={{ fontSize: '0.85rem', lineHeight: '1.7', color: '#d6d3d1' }}>
                      <div><strong>Target Plot:</strong> <span style={{ color: '#E2C97E', fontFamily: 'monospace' }}>{selectedPlot.plotNumber}</span> (Section {selectedPlot.section})</div>
                      <div><strong>Deceased:</strong> <span style={{ color: '#ffffff', fontWeight: 'bold' }}>{selectedDeceased.NAME_OF_DECEASED}</span></div>
                      <div><strong>Reference No:</strong> {selectedDeceased.REF_NO}</div>
                      <div><strong>Date of Birth:</strong> {new Date(selectedDeceased.DATE_OF_BIRTH).toLocaleDateString()}</div>
                      <div><strong>Date of Death:</strong> {new Date(selectedDeceased.DATE_OF_DEATH).toLocaleDateString()}</div>
                      <div><strong>Payor / Family:</strong> {selectedDeceased.PAYORS_NAME} ({selectedDeceased.CONTACT_NO})</div>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Plot / Assignment Notes (Optional)</label>
                    <input
                      type="text"
                      className={styles.formControl}
                      placeholder="e.g. Near tree landmark, family plot"
                      value={assignmentNotes}
                      onChange={e => setAssignmentNotes(e.target.value)}
                    />
                  </div>

                  <div className={styles.modalFooter} style={{ padding: '16px 0 0 0' }}>
                    <button type="button" className={styles.btnOutline} onClick={() => setAssignmentMode('search')}>Back</button>
                    <button type="button" className={styles.btnGold} onClick={handleConfirmAssignment}>
                      ✓ Confirm Grave Assignment
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL 2: OCCUPIED GRAVE DETAILS & MANAGEMENT
      ============================================================ */}
      {showOccupiedModal && selectedPlot && selectedPlot.deceasedRecord && (
        <div className={styles.modalOverlay} onClick={e => { if (e.target === e.currentTarget) setShowOccupiedModal(false); }}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>
                <span style={{ color: '#ef5350' }}>✝</span> Plot {selectedPlot.plotNumber} · Occupied
              </h3>
              <button className={styles.modalClose} onClick={() => setShowOccupiedModal(false)}>&times;</button>
            </div>

            <div className={styles.modalBody}>
              {/* Deceased Memorial Profile Card */}
              <div style={{ background: '#171c18', border: '1px solid rgba(200, 168, 75, 0.3)', borderRadius: '10px', padding: '18px', marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 4px 0', color: '#E2C97E', fontSize: '1.25rem', fontFamily: 'serif' }}>
                      {selectedPlot.deceasedRecord.NAME_OF_DECEASED}
                    </h3>
                    <div style={{ color: '#a8a29e', fontSize: '0.78rem', fontFamily: 'monospace' }}>
                      {selectedPlot.deceasedRecord.REF_NO}
                    </div>
                  </div>
                  <span style={{ background: '#8b0000', color: '#ffcdd2', padding: '3px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                    Occupied
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.82rem', color: '#d6d3d1' }}>
                  <div><strong>Section:</strong> {selectedPlot.section} (Row {selectedPlot.row}, Col {selectedPlot.column})</div>
                  <div><strong>Plot Type:</strong> {selectedPlot.plotType}</div>
                  <div><strong>Date of Birth:</strong> {new Date(selectedPlot.deceasedRecord.DATE_OF_BIRTH).toLocaleDateString()}</div>
                  <div><strong>Date of Death:</strong> {new Date(selectedPlot.deceasedRecord.DATE_OF_DEATH).toLocaleDateString()}</div>
                  <div><strong>Payor:</strong> {selectedPlot.deceasedRecord.PAYORS_NAME}</div>
                  <div><strong>Contact:</strong> {selectedPlot.deceasedRecord.CONTACT_NO}</div>
                  <div><strong>Address:</strong> {selectedPlot.deceasedRecord.ADDRESS}</div>
                  <div><strong>Balance:</strong> ₱{selectedPlot.deceasedRecord.BALANCE.toLocaleString()}</div>
                </div>

                {selectedPlot.notes && (
                  <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px dashed rgba(200, 168, 75, 0.2)', fontSize: '0.78rem', color: '#E2C97E' }}>
                    <strong>Notes:</strong> {selectedPlot.notes}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.btnDanger}
                style={{ marginRight: 'auto' }}
                onClick={handleVacatePlot}
              >
                🗑 Vacate / Unassign Plot
              </button>
              <button
                type="button"
                className={styles.btnOutline}
                onClick={() => {
                  setShowOccupiedModal(false);
                  setEditStatus(selectedPlot.status);
                  setEditPlotType(selectedPlot.plotType);
                  setEditNotes(selectedPlot.notes || '');
                  setShowStatusModal(true);
                }}
              >
                Edit Plot Status
              </button>
              <button type="button" className={styles.btnGold} onClick={() => setShowOccupiedModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL 3: PLOT STATUS MANAGER (Reserved / Maintenance / etc.)
      ============================================================ */}
      {showStatusModal && selectedPlot && (
        <div className={styles.modalOverlay} onClick={e => { if (e.target === e.currentTarget) setShowStatusModal(false); }}>
          <div className={styles.modalContent} style={{ maxWidth: '460px' }}>
            <div className={styles.modalHeader}>
              <h3>Manage Plot {selectedPlot.plotNumber}</h3>
              <button className={styles.modalClose} onClick={() => setShowStatusModal(false)}>&times;</button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Plot Status</label>
                <select className={styles.formControl} value={editStatus} onChange={e => setEditStatus(e.target.value)}>
                  <option value="Available">🟢 Available (Ready for assignment)</option>
                  <option value="Reserved">🟡 Reserved (Family reservation)</option>
                  <option value="Maintenance">🔵 Under Maintenance / Repair</option>
                  <option value="Unavailable">⚪ Unavailable / Buffer Zone</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Plot Type</label>
                <select className={styles.formControl} value={editPlotType} onChange={e => setEditPlotType(e.target.value)}>
                  <option value="Standard Ground Plot">Standard Ground Plot</option>
                  <option value="Lawn Lot">Lawn Lot</option>
                  <option value="Mausoleum / Family Estate">Mausoleum / Family Estate</option>
                  <option value="Niche / Ossuary">Niche / Ossuary</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Notes</label>
                <textarea
                  className={styles.formControl}
                  rows={3}
                  value={editNotes}
                  onChange={e => setEditNotes(e.target.value)}
                  placeholder="Additional plot remarks..."
                />
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button type="button" className={styles.btnOutline} onClick={() => setShowStatusModal(false)}>Cancel</button>
              <button type="button" className={styles.btnGold} onClick={handleSaveStatus}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
