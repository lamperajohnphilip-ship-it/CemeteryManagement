'use client';

import { useState, useEffect, useMemo } from 'react';
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

const DEFAULT_SECTIONS = ['A', 'B', 'C'];

export default function MapPage() {
  const [deceasedRecords, setDeceasedRecords] = useState<DeceasedPlotRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState('A');
  const [sectionsList, setSectionsList] = useState<string[]>(DEFAULT_SECTIONS);
  const [plotsCount, setPlotsCount] = useState<{ [key: string]: number }>({ 'A': 50, 'B': 50, 'C': 50 });

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'occupied'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Add Plot Slot Modal State (Image "+ Add Plot Slot" feature)
  const [showAddSlotModal, setShowAddSlotModal] = useState(false);
  const [addSlotTab, setAddSlotTab] = useState<'single' | 'batch' | 'section'>('single');
  const [singleSlotForm, setSingleSlotForm] = useState({
    section: 'A',
    plotNumber: '',
    plotType: 'Standard Lawn Lot',
    dimensions: '1.0m × 2.44m (Standard)',
    price: '15000',
    status: 'available',
    notes: '',
    assignImmediately: false,
    selectedDeceasedId: '',
  });
  const [batchSlotForm, setBatchSlotForm] = useState({
    section: 'A',
    countToAdd: 10,
    plotType: 'Standard Lawn Lot',
  });
  const [newSectionForm, setNewSectionForm] = useState({
    sectionCode: '',
    sectionName: '',
    initialPlots: 50,
  });

  // Modal states for existing plots
  const [showModal, setShowModal] = useState(false);
  const [selectedPlot, setSelectedPlot] = useState<string>('');
  const [existingRecord, setExistingRecord] = useState<DeceasedPlotRecord | null>(null);
  const [isEditingPlot, setIsEditingPlot] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add/Assign record modal state (when clicking an available plot)
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

    // Load custom sections and counts from storage
    const savedSections = localStorage.getItem('cemeteryMapSections');
    if (savedSections) {
      try {
        const parsed = JSON.parse(savedSections);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSectionsList(parsed);
        }
      } catch (e) {}
    }

    const savedCounts = localStorage.getItem('cemeteryMapPlotsCount');
    if (savedCounts) {
      try {
        setPlotsCount(JSON.parse(savedCounts));
      } catch (e) {}
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
      console.error('Failed to load records from database', e);
    } finally {
      setLoading(false);
    }
  };

  const getRecordForPlot = (plotId: string) => {
    return deceasedRecords.find(r => {
      if (!r.remarks) return false;
      const clean = r.remarks.trim();
      return (
        clean.toLowerCase() === plotId.toLowerCase() ||
        clean.toLowerCase() === `section ${plotId.toLowerCase()}` ||
        clean.toLowerCase().includes(`plot ${plotId.toLowerCase()}`)
      );
    });
  };

  // Open "Add Plot Slot" Form Modal
  const handleOpenAddPlotModal = () => {
    const nextSlotNum = (plotsCount[currentSection] || 50) + 1;
    setSingleSlotForm({
      section: currentSection,
      plotNumber: `${currentSection}-${nextSlotNum}`,
      plotType: 'Standard Lawn Lot',
      dimensions: '1.0m × 2.44m (Standard)',
      price: '15000',
      status: 'available',
      notes: '',
      assignImmediately: false,
      selectedDeceasedId: '',
    });
    setBatchSlotForm({
      section: currentSection,
      countToAdd: 10,
      plotType: 'Standard Lawn Lot',
    });
    setAddSlotTab('single');
    setShowAddSlotModal(true);
  };

  // Submit Single Slot Addition
  const handleCreateSingleSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    const section = singleSlotForm.section.trim().toUpperCase() || currentSection;
    const targetPlotId = singleSlotForm.plotNumber.trim() || `${section}-${(plotsCount[section] || 50) + 1}`;

    // Extract sequence number if formatted like "A-51"
    const match = targetPlotId.match(/-(\d+)$/);
    const parsedNum = match ? parseInt(match[1] || '0', 10) : 0;
    const currentMax = plotsCount[section] || 50;
    const nextMax = parsedNum > currentMax ? parsedNum : currentMax + 1;

    const newCounts = { ...plotsCount, [section]: nextMax };
    setPlotsCount(newCounts);
    localStorage.setItem('cemeteryMapPlotsCount', JSON.stringify(newCounts));

    // Ensure section is in sectionsList
    if (!sectionsList.includes(section)) {
      const updatedSections = [...sectionsList, section];
      setSectionsList(updatedSections);
      localStorage.setItem('cemeteryMapSections', JSON.stringify(updatedSections));
    }

    // Direct immediate assignment if requested
    if (singleSlotForm.assignImmediately && singleSlotForm.selectedDeceasedId) {
      setIsSubmitting(true);
      try {
        await updateDeceasedRecord(singleSlotForm.selectedDeceasedId, {
          REMARKS: targetPlotId,
        });
        await loadDatabaseRecords();
      } catch (err) {
        console.error('Failed to assign deceased during slot creation', err);
      } finally {
        setIsSubmitting(false);
      }
    }

    setCurrentSection(section);
    setShowAddSlotModal(false);
  };

  // Submit Batch Slot Generation
  const handleCreateBatchSlots = (e: React.FormEvent) => {
    e.preventDefault();
    const section = batchSlotForm.section.trim().toUpperCase() || currentSection;
    const count = Math.max(1, Math.min(200, Number(batchSlotForm.countToAdd) || 10));
    const currentMax = plotsCount[section] || 50;
    const newMax = currentMax + count;

    const newCounts = { ...plotsCount, [section]: newMax };
    setPlotsCount(newCounts);
    localStorage.setItem('cemeteryMapPlotsCount', JSON.stringify(newCounts));

    if (!sectionsList.includes(section)) {
      const updatedSections = [...sectionsList, section];
      setSectionsList(updatedSections);
      localStorage.setItem('cemeteryMapSections', JSON.stringify(updatedSections));
    }

    setCurrentSection(section);
    setShowAddSlotModal(false);
  };

  // Submit New Section Creation
  const handleCreateNewSection = (e: React.FormEvent) => {
    e.preventDefault();
    const code = newSectionForm.sectionCode.trim().toUpperCase();
    if (!code) {
      alert('Please provide a Section Code (e.g., D, E, WEST).');
      return;
    }

    if (sectionsList.includes(code)) {
      alert(`Section ${code} already exists.`);
      return;
    }

    const initialPlots = Math.max(1, Math.min(500, Number(newSectionForm.initialPlots) || 50));
    const updatedSections = [...sectionsList, code];
    setSectionsList(updatedSections);
    localStorage.setItem('cemeteryMapSections', JSON.stringify(updatedSections));

    const updatedCounts = { ...plotsCount, [code]: initialPlots };
    setPlotsCount(updatedCounts);
    localStorage.setItem('cemeteryMapPlotsCount', JSON.stringify(updatedCounts));

    setCurrentSection(code);
    setShowAddSlotModal(false);
    setNewSectionForm({ sectionCode: '', sectionName: '', initialPlots: 50 });
  };

  // Handle clicking on an individual plot
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
      alert('Error unassigning: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate plot grid for current section
  const currentMaxPlots = plotsCount[currentSection] || 50;
  const plots = useMemo(() => {
    const list = [];
    for (let i = 1; i <= currentMaxPlots; i++) {
      const plotId = `${currentSection}-${i}`;
      const record = getRecordForPlot(plotId);
      list.push({ id: plotId, record, number: i });
    }
    return list;
  }, [currentSection, currentMaxPlots, deceasedRecords]);

  const occupiedCount = plots.filter(p => !!p.record).length;
  const availableCount = plots.length - occupiedCount;
  const unassignedRecords = deceasedRecords.filter(r => !r.remarks || r.remarks.trim() === '');

  // Filtered plots based on status filter and search query
  const filteredPlots = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return plots.filter(plot => {
      // 1. Status Filter
      if (statusFilter === 'available' && plot.record) return false;
      if (statusFilter === 'occupied' && !plot.record) return false;

      // 2. Search Query filter (matches Plot ID, Deceased Name, or Ref)
      if (query) {
        const idMatch = plot.id.toLowerCase().includes(query);
        const nameMatch = plot.record?.deceased.toLowerCase().includes(query);
        const refMatch = plot.record?.ref.toLowerCase().includes(query);
        return idMatch || nameMatch || refMatch;
      }

      return true;
    });
  }, [plots, statusFilter, searchQuery]);

  return (
    <div className={styles.container}>
      {/* Header Row */}
      <div className={styles.headerRow}>
        <div className={styles.title}>
          <h3>Graveyard Map & Plot Management</h3>
          <p>Visual cemetery grid, plot allocation, and spatial capacity manager</p>
        </div>
      </div>

      {/* Top Stat Summary Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Section {currentSection} Capacity</div>
          <div className={styles.statValue} style={{ color: '#E2C97E' }}>
            {plots.length}
          </div>
          <div className={styles.statSub}>Configured cemetery slots</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statLabel}>Available Slots</div>
          <div className={styles.statValue} style={{ color: '#4ADE80' }}>
            {availableCount}
          </div>
          <div className={styles.statSub}>Ready for assignment</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statLabel}>Occupied Slots</div>
          <div className={styles.statValue} style={{ color: '#F87171' }}>
            {occupiedCount}
          </div>
          <div className={styles.statSub}>
            {plots.length > 0 ? Math.round((occupiedCount / plots.length) * 100) : 0}% Occupancy rate
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statLabel}>Unassigned Records</div>
          <div className={styles.statValue} style={{ color: '#60A5FA' }}>
            {unassignedRecords.length}
          </div>
          <div className={styles.statSub}>Deceased awaiting plot mapping</div>
        </div>
      </div>

      {/* ── Main Map Controls Bar (Image Top Bar) ── */}
      <div className={styles.mapControls}>
        <div className={styles.controlsLeft}>
          {/* Legend & Filter Tabs */}
          <div className={styles.filterGroup}>
            <button
              type="button"
              className={`${styles.filterPill} ${statusFilter === 'all' ? styles.filterPillActive : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              <span>All ({plots.length})</span>
            </button>
            <button
              type="button"
              className={`${styles.filterPill} ${styles.filterPillAvailable} ${statusFilter === 'available' ? styles.filterPillActive : ''}`}
              onClick={() => setStatusFilter(statusFilter === 'available' ? 'all' : 'available')}
            >
              <span className={`${styles.statusDot} ${styles.dotGreen}`}></span>
              <span>Available Plot ({availableCount})</span>
            </button>
            <button
              type="button"
              className={`${styles.filterPill} ${styles.filterPillOccupied} ${statusFilter === 'occupied' ? styles.filterPillActive : ''}`}
              onClick={() => setStatusFilter(statusFilter === 'occupied' ? 'all' : 'occupied')}
            >
              <span className={`${styles.statusDot} ${styles.dotRed}`}></span>
              <span>Occupied Plot ({occupiedCount})</span>
            </button>
          </div>

          {/* Quick Search Input */}
          <div className={styles.searchWrapper}>
            <span className={styles.searchIcon}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search plot or name (e.g. A-12)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.controlsRight}>
          {/* Section Selector */}
          <select
            className={styles.sectionSelect}
            value={currentSection}
            onChange={e => setCurrentSection(e.target.value)}
            aria-label="Select cemetery section"
          >
            {sectionsList.map(s => (
              <option key={s} value={s}>
                Section {s} ({plotsCount[s] || 50} slots)
              </option>
            ))}
          </select>

          {/* "+ Add Plot Slot" Button that opens the Form Modal */}
          <button
            type="button"
            className={styles.btnAddSlot}
            onClick={handleOpenAddPlotModal}
            title="Configure and add new plot slots"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            + Add Plot Slot
          </button>
        </div>
      </div>

      {/* ── Visual Plot Grid Section (Image Grid Area) ── */}
      <div className={styles.mapGridWrapper}>
        <div className={styles.mapGridHeader}>
          <div className={styles.mapGridHeaderTitle}>
            <span>Section {currentSection} Ground Map</span>
            <span style={{ color: '#7A7570', fontWeight: 'normal', fontSize: '0.8rem' }}>
              — Showing {filteredPlots.length} of {plots.length} slots
            </span>
          </div>
          <div className={styles.mapGridHeaderHint}>
            💡 Click any plot to assign deceased, view details, or update records
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9E978E' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>⏳</div>
            Loading cemetery plots from database...
          </div>
        ) : filteredPlots.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9E978E' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>🔍</div>
            No plots match your filter &ldquo;{searchQuery || statusFilter}&rdquo; in Section {currentSection}.
            <div style={{ marginTop: '10px' }}>
              <button
                type="button"
                className={styles.btnOutline}
                style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.mapGrid}>
            {filteredPlots.map(plot => {
              const isOccupied = !!plot.record;
              const isOverdue = plot.record?.paymentStatus === 'overdue';
              const isPaid = plot.record?.paymentStatus === 'paid';
              const isMatch = searchQuery.trim() !== '' && (
                plot.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                plot.record?.deceased.toLowerCase().includes(searchQuery.toLowerCase())
              );

              return (
                <div
                  key={plot.id}
                  className={`
                    ${styles.plot}
                    ${isOccupied ? styles.plotOccupied : styles.plotAvailable}
                    ${isMatch ? styles.plotHighlight : ''}
                  `}
                  onClick={() => handlePlotClick(plot.id)}
                  title={
                    isOccupied
                      ? `Plot ${plot.id}: ${plot.record?.deceased} (${plot.record?.paymentStatus.toUpperCase()})`
                      : `Plot ${plot.id}: Available (Click to assign)`
                  }
                >
                  {/* Payment dot indicator for occupied plots */}
                  {isOccupied && (
                    <span
                      className={`
                        ${styles.plotPaymentDot}
                        ${isPaid ? styles.paymentPaid : ''}
                        ${isOverdue ? styles.paymentOverdue : ''}
                      `}
                    />
                  )}

                  {/* Top Plot Identifier */}
                  <div className={styles.plotId}>{plot.id}</div>

                  {/* Center Themed Icon */}
                  <div className={styles.plotIcon}>
                    {isOccupied ? (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2v20M7 7h10M5 22h14" />
                      </svg>
                    ) : (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        <path d="M12 8v4M12 16h.01" />
                      </svg>
                    )}
                  </div>

                  {/* Bottom Text */}
                  {isOccupied ? (
                    <div className={styles.plotName} title={plot.record?.deceased}>
                      {plot.record?.deceased}
                    </div>
                  ) : (
                    <span className={styles.plotStatusText}>Available</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          MODAL 1: ADD PLOT SLOT FORM MODAL (Requested "+ Add Plot Slot" feature)
          ════════════════════════════════════════════════════════════════════════ */}
      {showAddSlotModal && (
        <div
          className={styles.modal}
          onClick={e => {
            if (e.target === e.currentTarget && !isSubmitting) setShowAddSlotModal(false);
          }}
        >
          <div className={styles.modalContent} style={{ maxWidth: '580px' }}>
            <div className={styles.modalHeader}>
              <div>
                <h3>Add Cemetery Plot Slot</h3>
                <span style={{ fontSize: '0.78rem', color: '#9E978E' }}>
                  Configure new plots, batch capacity, or cemetery sections
                </span>
              </div>
              <span
                className={styles.modalClose}
                onClick={() => !isSubmitting && setShowAddSlotModal(false)}
              >
                &times;
              </span>
            </div>

            <div className={styles.modalBody}>
              {/* Mode Selection Tabs */}
              <div className={styles.tabNav}>
                <button
                  type="button"
                  className={`${styles.tabBtn} ${addSlotTab === 'single' ? styles.tabBtnActive : ''}`}
                  onClick={() => setAddSlotTab('single')}
                >
                  Single Plot Slot
                </button>
                <button
                  type="button"
                  className={`${styles.tabBtn} ${addSlotTab === 'batch' ? styles.tabBtnActive : ''}`}
                  onClick={() => setAddSlotTab('batch')}
                >
                  Batch Generate Slots
                </button>
                <button
                  type="button"
                  className={`${styles.tabBtn} ${addSlotTab === 'section' ? styles.tabBtnActive : ''}`}
                  onClick={() => setAddSlotTab('section')}
                >
                  + New Section
                </button>
              </div>

              {/* TAB 1: Single Plot Slot Form */}
              {addSlotTab === 'single' && (
                <form onSubmit={handleCreateSingleSlot}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Cemetery Section *</label>
                      <select
                        className={styles.formControl}
                        value={singleSlotForm.section}
                        onChange={e => {
                          const sec = e.target.value;
                          const nextNum = (plotsCount[sec] || 50) + 1;
                          setSingleSlotForm({
                            ...singleSlotForm,
                            section: sec,
                            plotNumber: `${sec}-${nextNum}`,
                          });
                        }}
                      >
                        {sectionsList.map(s => (
                          <option key={s} value={s}>
                            Section {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Plot Identifier *</label>
                      <input
                        type="text"
                        className={styles.formControl}
                        placeholder="e.g. A-51"
                        value={singleSlotForm.plotNumber}
                        onChange={e => setSingleSlotForm({ ...singleSlotForm, plotNumber: e.target.value })}
                        required
                      />
                      <div className={styles.formHint}>Unique identifier displayed on map</div>
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Plot Classification</label>
                      <select
                        className={styles.formControl}
                        value={singleSlotForm.plotType}
                        onChange={e => setSingleSlotForm({ ...singleSlotForm, plotType: e.target.value })}
                      >
                        <option value="Standard Lawn Lot">Standard Lawn Lot (Ground Plot)</option>
                        <option value="Family Estate / Mausoleum">Family Estate / Mausoleum</option>
                        <option value="Columbarium / Bone Crypt">Columbarium / Bone Crypt</option>
                        <option value="Baby / Infant Memorial">Baby / Infant Memorial</option>
                        <option value="Wall Vault">Wall Vault / Niche</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Dimensions</label>
                      <input
                        type="text"
                        className={styles.formControl}
                        placeholder="e.g. 1.0m × 2.44m"
                        value={singleSlotForm.dimensions}
                        onChange={e => setSingleSlotForm({ ...singleSlotForm, dimensions: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Standard Fee Rate (₱)</label>
                      <input
                        type="number"
                        className={styles.formControl}
                        placeholder="15000"
                        value={singleSlotForm.price}
                        onChange={e => setSingleSlotForm({ ...singleSlotForm, price: e.target.value })}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Initial Status</label>
                      <select
                        className={styles.formControl}
                        value={singleSlotForm.status}
                        onChange={e => setSingleSlotForm({ ...singleSlotForm, status: e.target.value })}
                      >
                        <option value="available">Available for Assignment</option>
                        <option value="reserved">Reserved by Family</option>
                        <option value="maintenance">Under Maintenance / Groundwork</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Landmark & Location Notes</label>
                    <input
                      type="text"
                      className={styles.formControl}
                      placeholder="e.g. Row 6, beside Acacia Tree pathway"
                      value={singleSlotForm.notes}
                      onChange={e => setSingleSlotForm({ ...singleSlotForm, notes: e.target.value })}
                    />
                  </div>

                  {/* Immediate Assignment Option */}
                  <div style={{ marginTop: '16px', padding: '12px 14px', background: 'rgba(200, 168, 75, 0.06)', borderRadius: '8px', border: '1px solid rgba(200, 168, 75, 0.2)' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.84rem', color: '#E2C97E', fontWeight: 600, textTransform: 'none' }}>
                      <input
                        type="checkbox"
                        checked={singleSlotForm.assignImmediately}
                        onChange={e => setSingleSlotForm({ ...singleSlotForm, assignImmediately: e.target.checked })}
                      />
                      Assign an unassigned deceased immediately to this new slot
                    </label>

                    {singleSlotForm.assignImmediately && (
                      <div style={{ marginTop: '10px' }}>
                        <select
                          className={styles.formControl}
                          value={singleSlotForm.selectedDeceasedId}
                          onChange={e => setSingleSlotForm({ ...singleSlotForm, selectedDeceasedId: e.target.value })}
                        >
                          <option value="">-- Select Deceased to Place in Slot --</option>
                          {unassignedRecords.map(r => (
                            <option key={r.id} value={r.id}>
                              {r.deceased} (Ref: {r.ref} · DOD: {r.deathDate || 'N/A'})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <div className={styles.modalFooter} style={{ padding: '16px 0 0 0', marginTop: '18px', borderTop: 'none' }}>
                    <button
                      type="button"
                      className={styles.btnOutline}
                      disabled={isSubmitting}
                      onClick={() => setShowAddSlotModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={styles.btnGold}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Adding...' : 'Create & Save Plot Slot'}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: Batch Generate Slots Form */}
              {addSlotTab === 'batch' && (
                <form onSubmit={handleCreateBatchSlots}>
                  <div className={styles.formGroup}>
                    <label>Target Section *</label>
                    <select
                      className={styles.formControl}
                      value={batchSlotForm.section}
                      onChange={e => setBatchSlotForm({ ...batchSlotForm, section: e.target.value })}
                    >
                      {sectionsList.map(s => (
                        <option key={s} value={s}>
                          Section {s} (Currently {plotsCount[s] || 50} slots)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Number of Slots to Add *</label>
                    <input
                      type="number"
                      min="1"
                      max="200"
                      className={styles.formControl}
                      value={batchSlotForm.countToAdd}
                      onChange={e => setBatchSlotForm({ ...batchSlotForm, countToAdd: Number(e.target.value) })}
                      required
                    />
                    <div className={styles.formHint}>
                      Recommended batches: 5, 10, 25, or 50 plots
                    </div>
                  </div>

                  {/* Batch Summary Preview */}
                  <div className={styles.previewBanner}>
                    <div className={styles.previewTitle}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Batch Generation Preview
                    </div>
                    <div>
                      Will generate <strong>{batchSlotForm.countToAdd}</strong> new slots for{' '}
                      <strong>Section {batchSlotForm.section}</strong>:
                    </div>
                    <div style={{ marginTop: '6px', fontFamily: 'monospace', color: '#F0EDE6' }}>
                      {batchSlotForm.section}-{(plotsCount[batchSlotForm.section] || 50) + 1} &rarr;{' '}
                      {batchSlotForm.section}-{(plotsCount[batchSlotForm.section] || 50) + Number(batchSlotForm.countToAdd || 0)}
                    </div>
                  </div>

                  <div className={styles.modalFooter} style={{ padding: '16px 0 0 0', marginTop: '18px', borderTop: 'none' }}>
                    <button
                      type="button"
                      className={styles.btnOutline}
                      disabled={isSubmitting}
                      onClick={() => setShowAddSlotModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={styles.btnGold}
                      disabled={isSubmitting}
                    >
                      Generate {batchSlotForm.countToAdd} Plot Slots
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 3: New Section Form */}
              {addSlotTab === 'section' && (
                <form onSubmit={handleCreateNewSection}>
                  <div className={styles.formGroup}>
                    <label>Section Code *</label>
                    <input
                      type="text"
                      maxLength={8}
                      className={styles.formControl}
                      placeholder="e.g. D or WEST"
                      value={newSectionForm.sectionCode}
                      onChange={e => setNewSectionForm({ ...newSectionForm, sectionCode: e.target.value })}
                      required
                    />
                    <div className={styles.formHint}>Short code used in plot IDs (e.g. D-1, D-2)</div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Section Name / Description</label>
                    <input
                      type="text"
                      className={styles.formControl}
                      placeholder="e.g. Garden of Peace (Phase 2)"
                      value={newSectionForm.sectionName}
                      onChange={e => setNewSectionForm({ ...newSectionForm, sectionName: e.target.value })}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Initial Plot Capacity</label>
                    <input
                      type="number"
                      min="1"
                      max="500"
                      className={styles.formControl}
                      value={newSectionForm.initialPlots}
                      onChange={e => setNewSectionForm({ ...newSectionForm, initialPlots: Number(e.target.value) })}
                      required
                    />
                  </div>

                  <div className={styles.modalFooter} style={{ padding: '16px 0 0 0', marginTop: '18px', borderTop: 'none' }}>
                    <button
                      type="button"
                      className={styles.btnOutline}
                      disabled={isSubmitting}
                      onClick={() => setShowAddSlotModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={styles.btnGold}
                      disabled={isSubmitting}
                    >
                      Create Section
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════
          MODAL 2: VIEW / EDIT OCCUPIED PLOT DETAILS
          ════════════════════════════════════════════════════════════════════════ */}
      {showModal && existingRecord && (
        <div
          className={styles.modal}
          onClick={e => {
            if (e.target === e.currentTarget && !isSubmitting) setShowModal(false);
          }}
        >
          <div className={styles.modalContent} style={{ maxWidth: '540px' }}>
            <div className={styles.modalHeader}>
              <div>
                <h3>Plot Details: {selectedPlot}</h3>
                <span style={{ fontSize: '0.78rem', color: '#9E978E' }}>
                  Occupied Cemetery Slot Record
                </span>
              </div>
              <span className={styles.modalClose} onClick={() => !isSubmitting && setShowModal(false)}>
                &times;
              </span>
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
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Payor / Family Name</label>
                      <input
                        className={styles.formControl}
                        value={formData.payor}
                        onChange={e => setFormData({ ...formData, payor: e.target.value })}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Contact No.</label>
                      <input
                        className={styles.formControl}
                        value={formData.contact}
                        onChange={e => setFormData({ ...formData, contact: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Date of Birth</label>
                      <input
                        type="date"
                        className={styles.formControl}
                        value={formData.birthDate}
                        onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                      />
                    </div>
                    <div className={styles.formGroup}>
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
                    <span className={styles.detailValue} style={{ color: '#E2C97E', fontFamily: 'monospace' }}>
                      {existingRecord.ref}
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Deceased Name</span>
                    <span className={styles.detailValue}>
                      <strong style={{ color: '#FFFFFF', fontSize: '1.05rem' }}>{existingRecord.deceased}</strong>
                    </span>
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
                    <span className={styles.detailValue}>
                      ₱{existingRecord.totalAmount} / ₱{existingRecord.amountPaid}
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Payment Status</span>
                    <span
                      className={styles.detailValue}
                      style={{
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        color:
                          existingRecord.paymentStatus === 'paid'
                            ? '#81C784'
                            : existingRecord.paymentStatus === 'overdue'
                            ? '#FF8A65'
                            : '#E0E0E0',
                      }}
                    >
                      {existingRecord.paymentStatus}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className={styles.modalFooter}>
              {isEditingPlot ? (
                <>
                  <button
                    type="button"
                    className={styles.btnOutline}
                    disabled={isSubmitting}
                    onClick={() => setIsEditingPlot(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className={styles.btnGold}
                    disabled={isSubmitting}
                    onClick={handleEditSubmit}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className={styles.btnDanger}
                    disabled={isSubmitting}
                    onClick={handleUnassignPlot}
                  >
                    Unassign Plot
                  </button>
                  <button
                    type="button"
                    className={styles.btnOutline}
                    style={{ color: '#E2C97E', borderColor: '#E2C97E', display: 'flex', alignItems: 'center', gap: '6px' }}
                    onClick={() => setIsEditingPlot(true)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                    Edit Info
                  </button>
                  <button
                    type="button"
                    className={styles.btnOutline}
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════
          MODAL 3: ASSIGN AVAILABLE PLOT
          ════════════════════════════════════════════════════════════════════════ */}
      {showAddModal && (
        <div
          className={styles.modal}
          onClick={e => {
            if (e.target === e.currentTarget && !isSubmitting) setShowAddModal(false);
          }}
        >
          <div className={styles.modalContent} style={{ maxWidth: '540px' }}>
            <div className={styles.modalHeader}>
              <div>
                <h3>Assign Plot: {selectedPlot}</h3>
                <span style={{ fontSize: '0.78rem', color: '#9E978E' }}>
                  Link a deceased person to this available slot
                </span>
              </div>
              <span className={styles.modalClose} onClick={() => !isSubmitting && setShowAddModal(false)}>
                &times;
              </span>
            </div>

            <div className={styles.modalBody}>
              {/* Tabs */}
              <div className={styles.tabNav}>
                <button
                  type="button"
                  className={`${styles.tabBtn} ${assignmentMode === 'existing' ? styles.tabBtnActive : ''}`}
                  onClick={() => setAssignmentMode('existing')}
                >
                  Select Existing ({unassignedRecords.length})
                </button>
                <button
                  type="button"
                  className={`${styles.tabBtn} ${assignmentMode === 'new' ? styles.tabBtnActive : ''}`}
                  onClick={() => setAssignmentMode('new')}
                >
                  + Add New Deceased
                </button>
              </div>

              {assignmentMode === 'existing' ? (
                <div>
                  <div className={styles.formGroup}>
                    <label>CHOOSE DECEASED RECORD *</label>
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
                    <div
                      style={{
                        marginTop: '12px',
                        padding: '14px',
                        background: 'rgba(200, 168, 75, 0.08)',
                        borderRadius: '8px',
                        border: '1px solid rgba(200, 168, 75, 0.25)',
                        fontSize: '0.85rem',
                      }}
                    >
                      {(() => {
                        const rec = deceasedRecords.find(r => r.id === selectedExistingId);
                        if (!rec) return null;
                        return (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
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
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Payor Name</label>
                      <input
                        className={styles.formControl}
                        placeholder="Family contact person"
                        value={formData.payor}
                        onChange={e => setFormData({ ...formData, payor: e.target.value })}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Contact No.</label>
                      <input
                        className={styles.formControl}
                        placeholder="09XXXXXXXXX"
                        value={formData.contact}
                        onChange={e => setFormData({ ...formData, contact: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Date of Birth</label>
                      <input
                        type="date"
                        className={styles.formControl}
                        value={formData.birthDate}
                        onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Date of Death</label>
                      <input
                        type="date"
                        className={styles.formControl}
                        value={formData.deathDate}
                        onChange={e => setFormData({ ...formData, deathDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Total Due (₱)</label>
                      <input
                        type="number"
                        className={styles.formControl}
                        value={formData.totalDue}
                        onChange={e => setFormData({ ...formData, totalDue: e.target.value })}
                      />
                    </div>
                    <div className={styles.formGroup}>
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
              <button
                type="button"
                className={styles.btnOutline}
                disabled={isSubmitting}
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.btnGold}
                disabled={isSubmitting}
                onClick={handleAssignPlot}
              >
                {isSubmitting ? 'Saving...' : 'Assign to Plot'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
