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

  // Filters & Selection - Side-panel-based assignment (no popup modals)
  const [filterSection, setFilterSection] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightPlot, setHighlightPlot] = useState<string | null>(null);
  const [selectedPlot, setSelectedPlot] = useState<GravePlotWithDeceased | null>(null);

  // Side Panel Tab
  const [assignTab, setAssignTab] = useState<'info' | 'assign' | 'status'>('info');

  // Assignment states
  const [deceasedSearchResults, setDeceasedSearchResults] = useState<any[]>([]);
  const [deceasedSearchQuery, setDeceasedSearchQuery] = useState('');
  const [selectedDeceased, setSelectedDeceased] = useState<any | null>(null);
  const [assignmentNotes, setAssignmentNotes] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Quick Create form
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // â”€â”€ Load Grave Plots â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€ Statistics Calculations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const totalPlots = plots.length;
  const availableCount = plots.filter(p => p.status === 'Available').length;
  const occupiedCount = plots.filter(p => p.status === 'Occupied').length;
  const reservedCount = plots.filter(p => p.status === 'Reserved').length;
  const maintenanceCount = plots.filter(p => p.status === 'Maintenance').length;
  const occupancyRate = totalPlots > 0 ? ((occupiedCount / totalPlots) * 100).toFixed(1) : '0';

  // â”€â”€ Search & Autocomplete â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const searchMatches = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    const cleanQ = q.replace(/^([a-c])\s*[-â€“_]?\s*0*(\d+)$/i, (_, s, n) => `${s}-${parseInt(n, 10)}`);
    return plots
      .filter(p => {
        const plotMatch = p.plotNumber.toLowerCase().includes(q) || p.plotNumber.toLowerCase().includes(cleanQ);
        const nameMatch = p.deceasedRecord?.NAME_OF_DECEASED.toLowerCase().includes(q);
        const refMatch = p.deceasedRecord?.REF_NO.toLowerCase().includes(q);
        return plotMatch || nameMatch || refMatch;
      })
      .slice(0, 8);
  }, [plots, searchQuery]);

  // â”€â”€ Handle Plot Click on 2D Map â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handlePlotClick = (plot: GravePlotWithDeceased) => {
    setSelectedPlot(plot);
    setHighlightPlot(plot.plotNumber);
    setSelectedDeceased(null);
    setDeceasedSearchQuery('');
    setDeceasedSearchResults([]);
    setAssignmentNotes(plot.notes || '');
    setShowCreateForm(false);
    setEditStatus(plot.status);
    setEditPlotType(plot.plotType);
    setEditNotes(plot.notes || '');

    if (plot.status === 'Available') {
      setAssignTab('assign');
      searchDeceased('');
    } else if (plot.status === 'Occupied') {
      setAssignTab('info');
    } else {
      setAssignTab('status');
    }
  };

  const statusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Available':   return { background: '#e8f5e9', color: '#2e7d32', border: '1px solid #81c784' };
      case 'Occupied':    return { background: '#fce4ec', color: '#880e4f', border: '1px solid #f48fb1' };
      case 'Reserved':    return { background: '#fff8e1', color: '#f57f17', border: '1px solid #ffe082' };
      case 'Maintenance': return { background: '#e3f2fd', color: '#0d47a1', border: '1px solid #90caf9' };
      default:            return { background: '#eceff1', color: '#37474f', border: '1px solid #b0bec5' };
    }
  };

  // â”€â”€ Deceased Search for Assignment â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const searchDeceased = async (q: string) => {
    setDeceasedSearchQuery(q);
    const res = await searchDeceasedForAssignment(q);
    if (res.success && res.records) {
      setDeceasedSearchResults(res.records);
    }
  };

  // â”€â”€ Execute Grave Assignment â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleConfirmAssignment = async () => {
    if (!selectedPlot || !selectedDeceased) {
      showAlert('Please select a deceased person to assign.', 'error');
      return;
    }
    setIsSubmitting(true);
    const res = await assignDeceasedToGrave({
      plotNumber: selectedPlot.plotNumber,
      deceasedId: selectedDeceased.id,
      notes: assignmentNotes
    });
    setIsSubmitting(false);
    if (res.success) {
      showAlert(`${selectedDeceased.NAME_OF_DECEASED} assigned to Plot ${selectedPlot.plotNumber}!`, 'success');
      setSelectedDeceased(null);
      setDeceasedSearchQuery('');
      await loadPlots();
      setSelectedPlot(null);
      setHighlightPlot(null);
    } else {
      showAlert(res.error || 'Failed to assign plot.', 'error');
    }
  };

  // â”€â”€ Quick Register & Assign â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleQuickCreateAndAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlot) return;
    if (!newDeceasedForm.NAME_OF_DECEASED || !newDeceasedForm.PAYORS_NAME || !newDeceasedForm.DATE_OF_DEATH) {
      showAlert('Fill in Name, Payor, and Date of Death.', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      const createRes = await addDeceasedRecord({ ...newDeceasedForm, REMARKS: `Plot ${selectedPlot.plotNumber}` });
      if (!createRes.success || !createRes.record) {
        showAlert(createRes.error || 'Failed to register deceased.', 'error');
        setIsSubmitting(false);
        return;
      }
      const assignRes = await assignDeceasedToGrave({ plotNumber: selectedPlot.plotNumber, deceasedId: createRes.record.id, notes: assignmentNotes });
      if (assignRes.success) {
        showAlert(`Registered & assigned ${newDeceasedForm.NAME_OF_DECEASED} to Plot ${selectedPlot.plotNumber}!`, 'success');
        setShowCreateForm(false);
        await loadPlots();
        setSelectedPlot(null);
        setHighlightPlot(null);
      } else {
        showAlert(assignRes.error || 'Registered but failed to assign.', 'error');
      }
    } catch (err: any) {
      showAlert(err.message || 'Error creating record.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // â”€â”€ Vacate / Unassign Plot â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleVacatePlot = async () => {
    if (!selectedPlot) return;
    if (!confirm(`Vacate Plot ${selectedPlot.plotNumber}? This removes the deceased assignment.`)) return;
    const res = await unassignGrave(selectedPlot.plotNumber);
    if (res.success) {
      showAlert('Plot vacated successfully.', 'success');
      await loadPlots();
      setSelectedPlot(null);
      setHighlightPlot(null);
    } else {
      showAlert(res.error || 'Failed to vacate plot.', 'error');
    }
  };

  // â”€â”€ Update Plot Status â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleSaveStatus = async () => {
    if (!selectedPlot) return;
    setIsSubmitting(true);
    const res = await updateGraveStatus({ plotNumber: selectedPlot.plotNumber, status: editStatus as any, plotType: editPlotType, notes: editNotes });
    setIsSubmitting(false);
    if (res.success) {
      showAlert('Plot status updated.', 'success');
      await loadPlots();
      setSelectedPlot(null);
      setHighlightPlot(null);
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
          <p>Click on any grave plot on the map to assign a deceased person or manage its status.</p>
        </div>
        <button className={styles.btnGold} onClick={loadPlots} disabled={loading}>
          ðŸ”„ {loading ? 'Loading...' : 'Refresh Map'}
        </button>
      </div>

      {/* Alert Banner */}
      {alert && (
        <div className={`${styles.alertBanner} ${alert.type === 'success' ? styles.alertSuccess : styles.alertError}`}>
          <span>{alert.type === 'success' ? 'âœ…' : 'âš ï¸'}</span>
          <span>{alert.text}</span>
        </div>
      )}

      {/* Stats Row */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Grave Plots</div>
          <div className={styles.statValue}>{totalPlots}</div>
          <div className={styles.statSub}>Sections A, B, C</div>
        </div>
        <div className={`${styles.statCard} ${styles.statGreen}`}>
          <div className={styles.statLabel}>Available</div>
          <div className={styles.statValue}>{availableCount}</div>
          <div className={styles.statSub}>Ready for assignment</div>
        </div>
        <div className={`${styles.statCard} ${styles.statRed}`}>
          <div className={styles.statLabel}>Occupied</div>
          <div className={styles.statValue}>{occupiedCount}</div>
          <div className={styles.statSub}>{occupancyRate}% occupancy</div>
        </div>
        <div className={`${styles.statCard} ${styles.statOrange}`}>
          <div className={styles.statLabel}>Reserved</div>
          <div className={styles.statValue}>{reservedCount}</div>
          <div className={styles.statSub}>Held for families</div>
        </div>
        <div className={`${styles.statCard} ${styles.statBlue}`}>
          <div className={styles.statLabel}>Maintenance</div>
          <div className={styles.statValue}>{maintenanceCount}</div>
          <div className={styles.statSub}>Under restoration</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search Plot (A-1, B-5...) or Deceased Name..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchMatches.length > 0 && searchQuery.trim() && (
            <div className={styles.searchDropdown}>
              {searchMatches.map(m => (
                <div key={m.id} className={styles.searchDropdownItem} onClick={() => { setHighlightPlot(m.plotNumber); handlePlotClick(m); setSearchQuery(''); }}>
                  <div>
                    <strong style={{ color: '#E2C97E' }}>Plot {m.plotNumber}</strong>
                    <span style={{ color: '#a8a29e', marginLeft: '8px', fontSize: '0.78rem' }}>Section {m.section} Â· {m.status}</span>
                    {m.deceasedRecord && <div style={{ color: '#ffffff', fontSize: '0.78rem', marginTop: '2px' }}>âœ {m.deceasedRecord.NAME_OF_DECEASED}</div>}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#81c784' }}>ðŸ“ Go â†’</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <select className={styles.filterSelect} value={filterSection} onChange={e => setFilterSection(e.target.value)}>
          <option value="all">All Sections (A, B, C)</option>
          <option value="A">Section A Â· West Lawn</option>
          <option value="B">Section B Â· East Lawn</option>
          <option value="C">Section C Â· North Garden</option>
        </select>
        <select className={styles.filterSelect} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="Available">ðŸŸ¢ Available</option>
          <option value="Occupied">ðŸ”´ Occupied</option>
          <option value="Reserved">ðŸŸ¡ Reserved</option>
          <option value="Maintenance">ðŸ”µ Maintenance</option>
        </select>
      </div>

      {/* MAIN SPLIT LAYOUT: Map + Assignment Panel */}
      <div className={styles.mainLayout}>

        {/* LEFT: 2D Map */}
        <div className={styles.mapArea}>
          <Cemetery2DMap
            plots={plots}
            selectedPlotNumber={selectedPlot?.plotNumber}
            highlightPlotNumber={highlightPlot}
            onSelectPlot={handlePlotClick}
            filterSection={filterSection}
            filterStatus={filterStatus}
          />
          <div className={styles.mapHint}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
            Click any grave plot to select it. Use the Assignment Panel on the right to assign or manage.
          </div>
        </div>

        {/* RIGHT: Assignment Panel */}
        <div className={styles.assignmentPanel}>
          {!selectedPlot ? (
            <div className={styles.panelIdle}>
              <div className={styles.panelIdleIcon}>
                <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="3"/>
                  <path d="M3 9h18M9 21V9"/>
                </svg>
              </div>
              <div className={styles.panelIdleTitle}>Select a Grave Plot</div>
              <div className={styles.panelIdleDesc}>
                Click on any grave plot in the map to open the Assignment Panel where you can assign a deceased person or manage the plot.
              </div>
              <div className={styles.plotQuickList}>
                <div className={styles.plotQuickListTitle}>ðŸŸ¢ Available Plots</div>
                {plots.filter(p => p.status === 'Available').slice(0, 10).map(p => (
                  <button key={p.id} className={styles.plotQuickItem} onClick={() => handlePlotClick(p)}>
                    <span className={styles.plotQuickBadge}>{p.plotNumber}</span>
                    <span style={{ color: '#a8a29e', fontSize: '0.78rem' }}>Section {p.section}</span>
                    <span className={styles.plotQuickArrow}>Assign â†’</span>
                  </button>
                ))}
                {availableCount === 0 && (
                  <div style={{ color: '#78716c', fontSize: '0.8rem', textAlign: 'center', padding: '12px' }}>No available plots.</div>
                )}
              </div>
            </div>
          ) : (
            <div className={styles.panelActive}>

              {/* Panel Header */}
              <div className={styles.panelHeader}>
                <div className={styles.panelHeaderLeft}>
                  <div className={styles.panelPlotNumber}>Plot {selectedPlot.plotNumber}</div>
                  <div className={styles.panelPlotSection}>Section {selectedPlot.section} &nbsp;Â·&nbsp; Row {selectedPlot.row}, Col {selectedPlot.column}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={styles.panelStatusBadge} style={statusBadgeStyle(selectedPlot.status)}>{selectedPlot.status}</span>
                  <button className={styles.panelCloseBtn} onClick={() => { setSelectedPlot(null); setHighlightPlot(null); }} title="Deselect">Ã—</button>
                </div>
              </div>

              {/* Tabs */}
              <div className={styles.tabBar}>
                <button className={`${styles.tabBtn} ${assignTab === 'info' ? styles.tabBtnActive : ''}`} onClick={() => setAssignTab('info')}>ðŸ“‹ Details</button>
                <button
                  className={`${styles.tabBtn} ${assignTab === 'assign' ? styles.tabBtnActive : ''}`}
                  onClick={() => { setAssignTab('assign'); if (!deceasedSearchResults.length) searchDeceased(''); }}
                  disabled={selectedPlot.status === 'Occupied'}
                  title={selectedPlot.status === 'Occupied' ? 'Vacate plot first' : 'Assign deceased'}
                >âœ Assign</button>
                <button className={`${styles.tabBtn} ${assignTab === 'status' ? styles.tabBtnActive : ''}`} onClick={() => setAssignTab('status')}>âš™ï¸ Status</button>
              </div>

              {/* â”€â”€ TAB: DETAILS â”€â”€ */}
              {assignTab === 'info' && (
                <div className={styles.tabContent}>
                  {selectedPlot.status === 'Occupied' && selectedPlot.deceasedRecord ? (
                    <>
                      <div className={styles.deceasedProfileCard}>
                        <div className={styles.deceasedCross}>âœ</div>
                        <div className={styles.deceasedName}>{selectedPlot.deceasedRecord.NAME_OF_DECEASED}</div>
                        <div className={styles.deceasedRef}>{selectedPlot.deceasedRecord.REF_NO}</div>
                      </div>
                      <div className={styles.detailGrid}>
                        <div className={styles.detailItem}>
                          <div className={styles.detailLabel}>Date of Birth</div>
                          <div className={styles.detailValue}>{new Date(selectedPlot.deceasedRecord.DATE_OF_BIRTH).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                        </div>
                        <div className={styles.detailItem}>
                          <div className={styles.detailLabel}>Date of Death</div>
                          <div className={styles.detailValue}>{new Date(selectedPlot.deceasedRecord.DATE_OF_DEATH).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                        </div>
                        <div className={styles.detailItem}>
                          <div className={styles.detailLabel}>Payor / Family</div>
                          <div className={styles.detailValue}>{selectedPlot.deceasedRecord.PAYORS_NAME}</div>
                        </div>
                        <div className={styles.detailItem}>
                          <div className={styles.detailLabel}>Contact No.</div>
                          <div className={styles.detailValue}>{selectedPlot.deceasedRecord.CONTACT_NO || 'â€”'}</div>
                        </div>
                        <div className={styles.detailItem} style={{ gridColumn: '1 / -1' }}>
                          <div className={styles.detailLabel}>Address</div>
                          <div className={styles.detailValue}>{selectedPlot.deceasedRecord.ADDRESS || 'â€”'}</div>
                        </div>
                        <div className={styles.detailItem}>
                          <div className={styles.detailLabel}>Plot Type</div>
                          <div className={styles.detailValue}>{selectedPlot.plotType}</div>
                        </div>
                        <div className={styles.detailItem}>
                          <div className={styles.detailLabel}>Balance</div>
                          <div className={styles.detailValue} style={{ color: selectedPlot.deceasedRecord.BALANCE > 0 ? '#ef5350' : '#66bb6a', fontWeight: 700 }}>â‚±{selectedPlot.deceasedRecord.BALANCE.toLocaleString()}</div>
                        </div>
                      </div>
                      {selectedPlot.notes && <div className={styles.detailNotes}><strong>Notes:</strong> {selectedPlot.notes}</div>}
                      <button className={styles.btnDanger} style={{ width: '100%', marginTop: '16px', justifyContent: 'center' }} onClick={handleVacatePlot}>ðŸ—‘ Vacate / Unassign This Plot</button>
                    </>
                  ) : (
                    <div className={styles.emptyState}>
                      <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
                        {selectedPlot.status === 'Available' ? 'ðŸŸ¢' : selectedPlot.status === 'Reserved' ? 'ðŸŸ¡' : 'ðŸ”µ'}
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '6px' }}>Plot {selectedPlot.plotNumber}</div>
                      <div style={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: '1.5' }}>
                        {selectedPlot.status === 'Available'
                          ? 'This plot is vacant and ready for assignment. Go to the Assign tab.'
                          : `Status: ${selectedPlot.status}. Use the Status tab to update.`}
                      </div>
                      {selectedPlot.status === 'Available' && (
                        <button className={styles.btnGold} style={{ marginTop: '14px' }} onClick={() => { setAssignTab('assign'); searchDeceased(''); }}>âœ Assign Deceased â†’</button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* â”€â”€ TAB: ASSIGN â”€â”€ */}
              {assignTab === 'assign' && (
                <div className={styles.tabContent}>
                  {selectedPlot.status === 'Occupied' ? (
                    <div className={styles.emptyState}>
                      <div style={{ fontSize: '2rem', marginBottom: '8px' }}>â›”</div>
                      <div style={{ fontWeight: 600, marginBottom: '6px' }}>Plot Already Occupied</div>
                      <div style={{ color: '#94a3b8', fontSize: '0.82rem' }}>Vacate this plot first before assigning a new deceased person.</div>
                    </div>
                  ) : !showCreateForm ? (
                    <>
                      <div className={styles.assignInstruction}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                        Assign an existing deceased record to <strong>Plot {selectedPlot.plotNumber}</strong>.
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Search Deceased Person</label>
                        <input type="text" className={styles.formControl} placeholder="Type name or reference number..." value={deceasedSearchQuery} onChange={e => searchDeceased(e.target.value)} autoFocus />
                      </div>
                      <div className={styles.deceasedResultList}>
                        {deceasedSearchResults.length === 0 ? (
                          <div className={styles.emptyResults}>{deceasedSearchQuery ? 'No unassigned deceased found.' : 'Start typing to search records...'}</div>
                        ) : (
                          deceasedSearchResults.map(d => (
                            <div key={d.id} className={`${styles.deceasedResultItem} ${selectedDeceased?.id === d.id ? styles.deceasedResultItemSelected : ''}`} onClick={() => setSelectedDeceased(selectedDeceased?.id === d.id ? null : d)}>
                              <div className={styles.deceasedResultCheck}>{selectedDeceased?.id === d.id ? 'âœ“' : ''}</div>
                              <div className={styles.deceasedResultBody}>
                                <div className={styles.deceasedResultName}>âœ {d.NAME_OF_DECEASED}</div>
                                <div className={styles.deceasedResultMeta}>Ref: {d.REF_NO} Â· {d.PAYORS_NAME}</div>
                                <div className={styles.deceasedResultMeta}>Died: {new Date(d.DATE_OF_DEATH).toLocaleDateString()}</div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      {selectedDeceased && (
                        <div className={styles.selectedDeceasedConfirm}>
                          <div className={styles.confirmLabel}>Assigning to Plot {selectedPlot.plotNumber}:</div>
                          <div className={styles.confirmName}>âœ {selectedDeceased.NAME_OF_DECEASED}</div>
                          <div className={styles.confirmMeta}>Ref: {selectedDeceased.REF_NO}</div>
                          <div className={styles.formGroup} style={{ marginTop: '10px', marginBottom: '0' }}>
                            <label className={styles.formLabel}>Assignment Notes (Optional)</label>
                            <input type="text" className={styles.formControl} placeholder="e.g. Near entrance, family plot..." value={assignmentNotes} onChange={e => setAssignmentNotes(e.target.value)} />
                          </div>
                          <button className={styles.btnGold} style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }} onClick={handleConfirmAssignment} disabled={isSubmitting}>
                            {isSubmitting ? 'â³ Assigning...' : `âœ“ Confirm: Assign to Plot ${selectedPlot.plotNumber}`}
                          </button>
                        </div>
                      )}
                      <div className={styles.orDivider}><span>or</span></div>
                      <button className={styles.btnOutline} style={{ width: '100%', justifyContent: 'center' }} onClick={() => setShowCreateForm(true)}>âž• Register New Deceased &amp; Assign</button>
                    </>
                  ) : (
                    <form onSubmit={handleQuickCreateAndAssign}>
                      <div className={styles.assignInstruction}>Registering new deceased &amp; assigning to <strong>Plot {selectedPlot.plotNumber}</strong></div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Full Name of Deceased *</label>
                        <input type="text" className={styles.formControl} value={newDeceasedForm.NAME_OF_DECEASED} onChange={e => setNewDeceasedForm({ ...newDeceasedForm, NAME_OF_DECEASED: e.target.value })} required placeholder="e.g. Juan Santos Dela Cruz" />
                      </div>
                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Date of Birth</label>
                          <input type="date" className={styles.formControl} value={newDeceasedForm.DATE_OF_BIRTH} onChange={e => setNewDeceasedForm({ ...newDeceasedForm, DATE_OF_BIRTH: e.target.value })} />
                        </div>
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Date of Death *</label>
                          <input type="date" className={styles.formControl} value={newDeceasedForm.DATE_OF_DEATH} onChange={e => setNewDeceasedForm({ ...newDeceasedForm, DATE_OF_DEATH: e.target.value })} required />
                        </div>
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Family / Payor Name *</label>
                        <input type="text" className={styles.formControl} value={newDeceasedForm.PAYORS_NAME} onChange={e => setNewDeceasedForm({ ...newDeceasedForm, PAYORS_NAME: e.target.value })} required placeholder="e.g. Maria Dela Cruz" />
                      </div>
                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Contact No.</label>
                          <input type="text" className={styles.formControl} value={newDeceasedForm.CONTACT_NO} onChange={e => setNewDeceasedForm({ ...newDeceasedForm, CONTACT_NO: e.target.value })} placeholder="09XXXXXXXXX" />
                        </div>
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Address</label>
                          <input type="text" className={styles.formControl} value={newDeceasedForm.ADDRESS} onChange={e => setNewDeceasedForm({ ...newDeceasedForm, ADDRESS: e.target.value })} placeholder="Barangay, Jasaan" />
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                        <button type="button" className={styles.btnOutline} style={{ flex: 1 }} onClick={() => setShowCreateForm(false)}>â† Back</button>
                        <button type="submit" className={styles.btnGold} style={{ flex: 2, justifyContent: 'center' }} disabled={isSubmitting}>{isSubmitting ? 'â³ Saving...' : 'âœ“ Register & Assign'}</button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* â”€â”€ TAB: STATUS â”€â”€ */}
              {assignTab === 'status' && (
                <div className={styles.tabContent}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Plot Status</label>
                    <select className={styles.formControl} value={editStatus} onChange={e => setEditStatus(e.target.value)}>
                      <option value="Available">ðŸŸ¢ Available â€“ Ready for assignment</option>
                      <option value="Reserved">ðŸŸ¡ Reserved â€“ Family reservation</option>
                      <option value="Maintenance">ðŸ”µ Maintenance â€“ Under repair</option>
                      <option value="Unavailable">âšª Unavailable â€“ Buffer zone</option>
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
                    <textarea className={styles.formControl} rows={3} value={editNotes} onChange={e => setEditNotes(e.target.value)} placeholder="Additional plot remarks..." />
                  </div>
                  <button className={styles.btnGold} style={{ width: '100%', justifyContent: 'center' }} onClick={handleSaveStatus} disabled={isSubmitting}>
                    {isSubmitting ? 'â³ Saving...' : 'ðŸ’¾ Save Plot Status'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
