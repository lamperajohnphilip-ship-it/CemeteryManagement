'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

interface InventoryRecord {
  id: string;
  ref: string;
  payor: string;
  deceased: string;
  gender: string;
  address: string;
  contact: string;
  birthDate?: string;
  deathDate: string;
  yearPaid: string;
  civilStatus: string;
  nationality: string;
  totalAmount: number;
  payments: any[];
  amountPaid: number;
  balance: number;
  paymentStatus: 'paid' | 'partial' | 'pending';
  orNo: string;
  datePaid: string;
  remarks: string; // Used for Plot No
  verified: boolean;
  photo?: string;
}

const SECTIONS = ['A', 'B', 'C'];

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export default function MapPage() {
  const [inventory, setInventory] = useState<InventoryRecord[]>([]);
  const [currentSection, setCurrentSection] = useState('A');
  const [plotsCount, setPlotsCount] = useState<{ [key: string]: number }>({ 'A': 50, 'B': 50, 'C': 50 });

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedPlot, setSelectedPlot] = useState<string>('');
  const [existingRecord, setExistingRecord] = useState<InventoryRecord | null>(null);
  const [isEditingPlot, setIsEditingPlot] = useState(false);

  // Add new record state
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    deceased: '',
    birthDate: '',
    deathDate: '',
    photo: ''
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setFormData({ ...formData, photo: ev.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    loadInventory();
    const savedCounts = localStorage.getItem('cemeteryMapPlotsCount');
    if (savedCounts) {
      try { setPlotsCount(JSON.parse(savedCounts)); } catch (e) { }
    }
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'cemeteryInventory') loadInventory();
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const loadInventory = () => {
    const saved = localStorage.getItem('cemeteryInventory');
    if (saved) {
      try {
        setInventory(JSON.parse(saved));
      } catch (e) { }
    }
  };

  const getRecordForPlot = (plotId: string) => {
    // Assuming remarks is used for Lot No.
    return inventory.find(r => r.remarks === plotId);
  };

  const handlePlotClick = (plotId: string) => {
    const record = getRecordForPlot(plotId);
    setSelectedPlot(plotId);
    setIsEditingPlot(false);
    if (record) {
      setExistingRecord(record);
      setFormData({
        deceased: record.deceased || '',
        birthDate: record.birthDate || '',
        deathDate: record.deathDate || '',
        photo: record.photo || ''
      });
      setShowModal(true);
    } else {
      setExistingRecord(null);
      setFormData({
        deceased: '',
        birthDate: '',
        deathDate: '',
        photo: ''
      });
      setShowAddModal(true);
    }
  };

  const handleAddSubmit = () => {
    if (!formData.deceased) return alert('Name of deceased is required.');

    let newInv = [...inventory];
    const targetId = genId();
    const newRec: InventoryRecord = {
      id: targetId,
      ref: `${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      payor: '',
      deceased: formData.deceased,
      gender: 'Male',
      address: '',
      contact: '',
      birthDate: formData.birthDate,
      deathDate: formData.deathDate,
      photo: formData.photo,
      yearPaid: new Date().getFullYear().toString(),
      civilStatus: 'Single',
      nationality: 'Filipino',
      totalAmount: 0,
      payments: [],
      amountPaid: 0,
      balance: 0,
      paymentStatus: 'pending',
      orNo: '',
      datePaid: '',
      remarks: selectedPlot, // Assign to plot
      verified: false
    };
    newInv.push(newRec);

    setInventory(newInv);
    localStorage.setItem('cemeteryInventory', JSON.stringify(newInv));
    window.dispatchEvent(new Event('storage'));
    setShowAddModal(false);
  };

  const handleEditSubmit = () => {
    if (!existingRecord) return;
    if (!formData.deceased) return alert('Name of deceased is required.');
    let newInv = [...inventory];
    const idx = newInv.findIndex(r => r.id === existingRecord.id);
    if (idx > -1 && newInv[idx]) {
      newInv[idx]!.deceased = formData.deceased;
      newInv[idx]!.birthDate = formData.birthDate;
      newInv[idx]!.deathDate = formData.deathDate;
      newInv[idx]!.photo = formData.photo;
      setInventory(newInv);
      localStorage.setItem('cemeteryInventory', JSON.stringify(newInv));
      window.dispatchEvent(new Event('storage'));
      setExistingRecord(newInv[idx]);
      setIsEditingPlot(false);
    }
  };

  const handleDelete = () => {
    if (!existingRecord) return;
    if (!confirm(`Are you sure you want to delete the record for ${existingRecord.deceased} at plot ${selectedPlot}?`)) return;

    let newInv = inventory.filter(r => r.id !== existingRecord.id);
    setInventory(newInv);
    localStorage.setItem('cemeteryInventory', JSON.stringify(newInv));
    window.dispatchEvent(new Event('storage'));
    setShowModal(false);
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

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div className={styles.title}>
          <h3>Graveyard Map</h3>
        </div>
      </div>

      <div className={styles.mapControls}>
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <div className={`${styles.legendBox} ${styles.boxAvailable}`}></div>
            <span>Available Plot</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendBox} ${styles.boxOccupied}`}></div>
            <span>Occupied Plot</span>
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
            + Add Plot
          </button>
        </div>
      </div>

      <div className={styles.mapGrid}>
        {plots.map(plot => (
          <div
            key={plot.id}
            className={`${styles.plot} ${plot.record ? styles.plotOccupied : styles.plotAvailable}`}
            onClick={() => handlePlotClick(plot.id)}
          >
            <div className={styles.plotId}>{plot.id}</div>
            <div className={styles.plotIcon}>{plot.record ? '⚰️' : '🌿'}</div>
            {plot.record && <div className={styles.plotName}>{plot.record.deceased}</div>}
          </div>
        ))}
      </div>

      {/* View/Edit Modal (Occupied Plot) */}
      {showModal && existingRecord && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Plot Details: {selectedPlot}</h3>
              <span className={styles.modalClose} onClick={() => setShowModal(false)}>&times;</span>
            </div>
            <div className={styles.modalBody}>
              {isEditingPlot ? (
                <div>
                  <div className={styles.formGroup}>
                    <label>Deceased Name</label>
                    <input
                      className={styles.formControl}
                      placeholder="Full name of deceased"
                      value={formData.deceased}
                      onChange={e => setFormData({ ...formData, deceased: e.target.value })}
                    />
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
                  <div className={styles.formGroup}>
                    <label>Grave Photo</label>
                    <input
                      type="file"
                      accept="image/*"
                      className={styles.formControl}
                      onChange={handlePhotoUpload}
                      style={{ padding: '8px' }}
                    />
                    {formData.photo && (
                      <div style={{ marginTop: '10px' }}>
                        <img src={formData.photo} alt="Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px' }} />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className={styles.recordDetails}>
                  {existingRecord.photo && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                      <img src={existingRecord.photo} alt="Grave Photo" style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #C8A84B' }} />
                    </div>
                  )}
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Deceased Name</span>
                    <span className={styles.detailValue}>{existingRecord.deceased}</span>
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
                    <span className={styles.detailLabel}>Payment Status</span>
                    <span className={styles.detailValue} style={{ textTransform: 'capitalize' }}>{existingRecord.paymentStatus}</span>
                  </div>
                </div>
              )}
            </div>
            <div className={styles.modalFooter}>
              {isEditingPlot ? (
                <>
                  <button className={styles.btnOutline} onClick={() => setIsEditingPlot(false)}>Cancel</button>
                  <button className={styles.btnGold} onClick={handleEditSubmit}>Save</button>
                </>
              ) : (
                <>
                  <button className={styles.btnDanger} onClick={handleDelete}>Delete Record</button>
                  <button className={styles.btnOutline} style={{ color: '#c9a84c', borderColor: '#c9a84c', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => setIsEditingPlot(true)}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                    Edit
                  </button>
                  <button className={styles.btnOutline} onClick={() => setShowModal(false)}>Close</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Modal (Available Plot) */}
      {showAddModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Plot: {selectedPlot}</h3>
              <span className={styles.modalClose} onClick={() => setShowAddModal(false)}>&times;</span>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Deceased Name</label>
                <input
                  className={styles.formControl}
                  placeholder="Full name of deceased"
                  value={formData.deceased}
                  onChange={e => setFormData({ ...formData, deceased: e.target.value })}
                />
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
              <div className={styles.formGroup}>
                <label>Grave Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  className={styles.formControl}
                  onChange={handlePhotoUpload}
                  style={{ padding: '8px' }}
                />
                {formData.photo && (
                  <div style={{ marginTop: '10px' }}>
                    <img src={formData.photo} alt="Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px' }} />
                  </div>
                )}
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.btnOutline} onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className={styles.btnGold} onClick={handleAddSubmit}>Save Plot</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
