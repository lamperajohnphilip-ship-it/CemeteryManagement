'use client';

import React, { useState, useEffect, useMemo } from 'react';
import styles from './GraveLocator.module.css';
import Cemetery2DMap from '../../../components/mapping/Cemetery2DMap';
import { getGraveMapData, GravePlotWithDeceased } from '../../actions/mapping';

export default function PublicGraveLocatorPage() {
  const [plots, setPlots] = useState<GravePlotWithDeceased[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlot, setSelectedPlot] = useState<GravePlotWithDeceased | null>(null);
  const [highlightPlot, setHighlightPlot] = useState<string | null>(null);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await getGraveMapData();
      if (res.success && res.plots) setPlots(res.plots);
      setLoading(false);
    })();
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return plots.filter(p => {
      const nameMatch = p.deceasedRecord?.NAME_OF_DECEASED.toLowerCase().includes(q);
      const refMatch = p.deceasedRecord?.REF_NO.toLowerCase().includes(q);
      const plotMatch = p.plotNumber.toLowerCase().includes(q);
      return nameMatch || refMatch || plotMatch;
    }).slice(0, 10);
  }, [plots, searchQuery]);

  const handleLocate = (plot: GravePlotWithDeceased) => {
    setSelectedPlot(plot);
    setHighlightPlot(plot.plotNumber);
    setSearchQuery('');
    setShowDetailsPanel(true);
  };

  const handleMapClick = (plot: GravePlotWithDeceased) => {
    setSelectedPlot(plot);
    setHighlightPlot(plot.plotNumber);
    setShowDetailsPanel(true);
  };

  const stats = {
    total: plots.length,
    occupied: plots.filter(p => p.status === 'Occupied').length,
    available: plots.filter(p => p.status === 'Available').length,
  };

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
              <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z"/>
              <circle cx="12" cy="9" r="2.5"/>
            </svg>
          </div>
          <div>
            <h1 className={styles.headerTitle}>Grave Locator</h1>
            <p className={styles.headerSub}>Search and locate grave plots at Jasaan Public Cemetery</p>
          </div>
        </div>
        {!loading && (
          <div className={styles.headerStats}>
            <div className={styles.miniStat}>
              <span className={styles.miniStatVal}>{stats.total}</span>
              <span className={styles.miniStatLabel}>Total Plots</span>
            </div>
            <div className={styles.miniStatDivider} />
            <div className={styles.miniStat}>
              <span className={styles.miniStatVal} style={{ color: '#ef5350' }}>{stats.occupied}</span>
              <span className={styles.miniStatLabel}>Occupied</span>
            </div>
            <div className={styles.miniStatDivider} />
            <div className={styles.miniStat}>
              <span className={styles.miniStatVal} style={{ color: '#66bb6a' }}>{stats.available}</span>
              <span className={styles.miniStatLabel}>Available</span>
            </div>
          </div>
        )}
      </div>

      <div className={styles.searchSection}>
        <div className={styles.searchWrapper}>
          <span className={styles.searchIconWrapper}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
          </span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by deceased name, reference number, or plot number (e.g. A-001)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            autoComplete="off"
          />
          {searchQuery && (
            <button className={styles.searchClear} onClick={() => setSearchQuery('')}>x</button>
          )}
        </div>

        {searchResults.length > 0 && (
          <div className={styles.searchResults}>
            {searchResults.map(plot => (
              <div key={plot.id} className={styles.searchResultItem} onClick={() => handleLocate(plot)}>
                <div className={styles.searchResultLeft}>
                  <div className={styles.searchResultPlot}>Plot {plot.plotNumber}</div>
                  {plot.deceasedRecord ? (
                    <>
                      <div className={styles.searchResultName}>{plot.deceasedRecord.NAME_OF_DECEASED}</div>
                      <div className={styles.searchResultMeta}>Ref: {plot.deceasedRecord.REF_NO} - Section {plot.section}</div>
                    </>
                  ) : (
                    <div className={styles.searchResultName} style={{ color: '#66bb6a' }}>Available Plot</div>
                  )}
                </div>
                <div className={styles.searchResultLocate}>
                  <span className={`${styles.statusDot} ${plot.status === 'Occupied' ? styles.dotOccupied : plot.status === 'Available' ? styles.dotAvailable : styles.dotReserved}`} />
                  <span>{plot.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {searchQuery.trim() && searchResults.length === 0 && !loading && (
          <div className={styles.noResults}>
            <p>No graves found matching &ldquo;<strong>{searchQuery}</strong>&rdquo;</p>
          </div>
        )}
      </div>

      <div className={styles.mapSection}>
        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.loadingSpinner} />
            <p>Loading cemetery map...</p>
          </div>
        ) : (
          <Cemetery2DMap
            plots={plots}
            selectedPlotNumber={selectedPlot?.plotNumber}
            highlightPlotNumber={highlightPlot}
            onSelectPlot={handleMapClick}
            readOnly={true}
          />
        )}
      </div>

      {showDetailsPanel && selectedPlot && (
        <div
          className={styles.detailsPanelOverlay}
          onClick={e => { if (e.target === e.currentTarget) { setShowDetailsPanel(false); setHighlightPlot(null); } }}
        >
          <div className={styles.detailsPanel}>
            <button
              className={styles.detailsClose}
              onClick={() => { setShowDetailsPanel(false); setHighlightPlot(null); }}
            >x</button>

            <div className={styles.detailsPlotBadge}>Plot {selectedPlot.plotNumber}</div>

            <div
              className={styles.detailsStatusBadge}
              style={{
                background: selectedPlot.status === 'Occupied' ? 'rgba(139,0,0,0.3)' :
                  selectedPlot.status === 'Available' ? 'rgba(46,125,50,0.3)' :
                  selectedPlot.status === 'Reserved' ? 'rgba(178,106,0,0.3)' : 'rgba(2,119,189,0.3)',
                borderColor: selectedPlot.status === 'Occupied' ? '#e53935' :
                  selectedPlot.status === 'Available' ? '#4caf50' :
                  selectedPlot.status === 'Reserved' ? '#fb8c00' : '#29b6f6',
                color: selectedPlot.status === 'Occupied' ? '#ffcdd2' :
                  selectedPlot.status === 'Available' ? '#a5d6a7' :
                  selectedPlot.status === 'Reserved' ? '#ffe0b2' : '#e1f5fe',
              }}
            >
              {selectedPlot.status}
            </div>

            {selectedPlot.deceasedRecord ? (
              <>
                <h2 className={styles.detailsName}>{selectedPlot.deceasedRecord.NAME_OF_DECEASED}</h2>
                <div className={styles.detailsRefNo}>{selectedPlot.deceasedRecord.REF_NO}</div>

                <div className={styles.detailsDatesRow}>
                  <div className={styles.detailsDateCard}>
                    <div className={styles.detailsDateLabel}>Born</div>
                    <div className={styles.detailsDateValue}>
                      {new Date(selectedPlot.deceasedRecord.DATE_OF_BIRTH).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                  <div className={styles.detailsDateDivider}>+</div>
                  <div className={styles.detailsDateCard}>
                    <div className={styles.detailsDateLabel}>Passed</div>
                    <div className={styles.detailsDateValue}>
                      {new Date(selectedPlot.deceasedRecord.DATE_OF_DEATH).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                </div>

                <div className={styles.detailsInfoGrid}>
                  <div className={styles.detailsInfoItem}>
                    <span className={styles.detailsInfoLabel}>Section</span>
                    <span className={styles.detailsInfoValue}>{selectedPlot.section}</span>
                  </div>
                  <div className={styles.detailsInfoItem}>
                    <span className={styles.detailsInfoLabel}>Plot Type</span>
                    <span className={styles.detailsInfoValue}>{selectedPlot.plotType}</span>
                  </div>
                  <div className={styles.detailsInfoItem}>
                    <span className={styles.detailsInfoLabel}>Row / Column</span>
                    <span className={styles.detailsInfoValue}>Row {selectedPlot.row}, Col {selectedPlot.column}</span>
                  </div>
                  <div className={styles.detailsInfoItem}>
                    <span className={styles.detailsInfoLabel}>Next of Kin</span>
                    <span className={styles.detailsInfoValue}>{selectedPlot.deceasedRecord.PAYORS_NAME}</span>
                  </div>
                  {selectedPlot.notes && (
                    <div className={styles.detailsInfoItem} style={{ gridColumn: '1 / -1' }}>
                      <span className={styles.detailsInfoLabel}>Notes</span>
                      <span className={styles.detailsInfoValue}>{selectedPlot.notes}</span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className={styles.detailsEmpty}>
                <p style={{ color: '#a8a29e', fontSize: '0.85rem', textAlign: 'center' }}>
                  This plot is <strong style={{ color: '#66bb6a' }}>available</strong>. Section {selectedPlot.section}, Row {selectedPlot.row}, Col {selectedPlot.column}.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
