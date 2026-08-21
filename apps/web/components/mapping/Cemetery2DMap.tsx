'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from './Cemetery2DMap.module.css';
import { GravePlotWithDeceased } from '../../app/actions/mapping';

interface Cemetery2DMapProps {
  plots: GravePlotWithDeceased[];
  selectedPlotNumber?: string | null;
  highlightPlotNumber?: string | null;
  onSelectPlot?: (plot: GravePlotWithDeceased) => void;
  readOnly?: boolean;
  filterSection?: string;
  filterStatus?: string;
}

export default function Cemetery2DMap({
  plots,
  selectedPlotNumber,
  highlightPlotNumber,
  onSelectPlot,
  filterSection = 'all',
  filterStatus = 'all'
}: Cemetery2DMapProps) {
  // Zoom & Pan transformation state
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Hover Tooltip State
  const [hoveredPlot, setHoveredPlot] = useState<GravePlotWithDeceased | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const mapWidth = 1200;
  const mapHeight = 900;

  // Plot coordinates calculation
  const getPlotCoordinates = useCallback((plot: GravePlotWithDeceased) => {
    const { section, row, column } = plot;

    if (section === 'A') {
      // West Lawn: 10 cols x 8 rows
      const startX = 85;
      const startY = 490;
      const plotW = 36;
      const plotH = 30;
      const gapX = 6;
      const gapY = 8;
      return {
        x: startX + (column - 1) * (plotW + gapX),
        y: startY + (row - 1) * (plotH + gapY),
        w: plotW,
        h: plotH
      };
    } else if (section === 'B') {
      // East Lawn: 10 cols x 8 rows
      const startX = 695;
      const startY = 490;
      const plotW = 36;
      const plotH = 30;
      const gapX = 6;
      const gapY = 8;
      return {
        x: startX + (column - 1) * (plotW + gapX),
        y: startY + (row - 1) * (plotH + gapY),
        w: plotW,
        h: plotH
      };
    } else {
      // Section C: North Garden (11 cols x 8 rows)
      const startX = 175;
      const startY = 120;
      const plotW = 36;
      const plotH = 28;
      const gapX = 6;
      const gapY = 6;
      return {
        x: startX + (column - 1) * (plotW + gapX),
        y: startY + (row - 1) * (plotH + gapY),
        w: plotW,
        h: plotH
      };
    }
  }, []);

  // Center on Highlighted Plot
  const jumpToPlot = useCallback((plotNum: string) => {
    if (!plotNum || !containerRef.current) return;
    const cleanPlotNum = plotNum.replace(/^([A-Ca-c])\s*[-–_]?\s*0*(\d+)$/i, (_, sec, num) => `${sec.toUpperCase()}-${parseInt(num, 10)}`);
    const target = plots.find(p =>
      p.plotNumber.toLowerCase() === plotNum.toLowerCase() ||
      p.plotNumber.toLowerCase() === cleanPlotNum.toLowerCase()
    );
    if (!target) return;

    const coords = getPlotCoordinates(target);
    const containerW = containerRef.current.clientWidth;
    const containerH = containerRef.current.clientHeight;

    const newScale = 1.6;
    const targetCenterX = coords.x + coords.w / 2;
    const targetCenterY = coords.y + coords.h / 2;

    const newPanX = containerW / 2 - targetCenterX * newScale;
    const newPanY = containerH / 2 - targetCenterY * newScale;

    setScale(newScale);
    setPan({ x: newPanX, y: newPanY });
  }, [plots, getPlotCoordinates]);

  // Handle external highlight request
  useEffect(() => {
    if (highlightPlotNumber) {
      jumpToPlot(highlightPlotNumber);
    }
  }, [highlightPlotNumber, jumpToPlot]);

  // Mouse Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
    const newScale = Math.min(Math.max(scale * zoomFactor, 0.5), 3.5);

    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Zoom towards mouse pointer
    const newPanX = mouseX - (mouseX - pan.x) * (newScale / scale);
    const newPanY = mouseY - (mouseY - pan.y) * (newScale / scale);

    setScale(newScale);
    setPan({ x: newPanX, y: newPanY });
  };

  // Drag & Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setTooltipPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Quick jump views
  const resetView = () => {
    if (!containerRef.current) return;
    const containerW = containerRef.current.clientWidth;
    const containerH = containerRef.current.clientHeight;
    const fitScale = Math.min(containerW / mapWidth, containerH / mapHeight) * 0.95;
    setScale(fitScale);
    setPan({
      x: (containerW - mapWidth * fitScale) / 2,
      y: (containerH - mapHeight * fitScale) / 2
    });
  };

  const jumpToSection = (section: string) => {
    if (!containerRef.current) return;
    const containerW = containerRef.current.clientWidth;
    const containerH = containerRef.current.clientHeight;

    let targetX = 600;
    let targetY = 450;
    let targetScale = 1.3;

    if (section === 'A') {
      targetX = 290;
      targetY = 640;
      targetScale = 1.5;
    } else if (section === 'B') {
      targetX = 900;
      targetY = 640;
      targetScale = 1.5;
    } else if (section === 'C') {
      targetX = 600;
      targetY = 260;
      targetScale = 1.4;
    } else if (section === 'gate') {
      targetX = 600;
      targetY = 820;
      targetScale = 1.6;
    }

    setScale(targetScale);
    setPan({
      x: containerW / 2 - targetX * targetScale,
      y: containerH / 2 - targetY * targetScale
    });
  };

  // Initial fit on mount
  useEffect(() => {
    resetView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter plots based on section and status
  const isPlotFiltered = (plot: GravePlotWithDeceased) => {
    if (filterSection !== 'all' && plot.section.toLowerCase() !== filterSection.toLowerCase()) {
      return true;
    }
    if (filterStatus !== 'all' && plot.status.toLowerCase() !== filterStatus.toLowerCase()) {
      return true;
    }
    return false;
  };

  // Status color helpers
  const getPlotStyles = (plot: GravePlotWithDeceased) => {
    const isSelected = selectedPlotNumber && plot.plotNumber.toLowerCase() === selectedPlotNumber.toLowerCase();
    const isHighlighted = highlightPlotNumber && plot.plotNumber.toLowerCase() === highlightPlotNumber.toLowerCase();
    const filteredOut = isPlotFiltered(plot);

    let fill = '#2e7d32'; // Available (green)
    let stroke = '#4caf50';
    let textColor = '#e8f5e9';

    if (plot.status === 'Occupied') {
      fill = '#8b0000'; // Occupied (dark red)
      stroke = '#e53935';
      textColor = '#ffebee';
    } else if (plot.status === 'Reserved') {
      fill = '#b26a00'; // Reserved (amber)
      stroke = '#fb8c00';
      textColor = '#fff8e1';
    } else if (plot.status === 'Maintenance') {
      fill = '#0277bd'; // Maintenance (blue)
      stroke = '#29b6f6';
      textColor = '#e1f5fe';
    } else if (plot.status === 'Unavailable') {
      fill = '#263238'; // Unavailable (slate)
      stroke = '#546e7a';
      textColor = '#eceff1';
    }

    if (isSelected || isHighlighted) {
      stroke = '#FFD700';
    }

    return {
      fill: filteredOut ? '#1a1f1c' : fill,
      stroke: isSelected ? '#FFD700' : isHighlighted ? '#ff9800' : stroke,
      strokeWidth: isSelected || isHighlighted ? 2.5 : 1,
      textColor: filteredOut ? '#555555' : textColor,
      opacity: filteredOut ? 0.35 : 1
    };
  };

  return (
    <div className={styles.mapContainer} ref={containerRef}>
      {/* Top Legend */}
      <div className={styles.mapLegend}>
        <div className={styles.legendItem}>
          <span className={`${styles.legendColor} ${styles.colorAvailable}`}></span>
          <span>Available ({plots.filter(p => p.status === 'Available').length})</span>
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendColor} ${styles.colorOccupied}`}></span>
          <span>Occupied ({plots.filter(p => p.status === 'Occupied').length})</span>
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendColor} ${styles.colorReserved}`}></span>
          <span>Reserved ({plots.filter(p => p.status === 'Reserved').length})</span>
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendColor} ${styles.colorMaintenance}`}></span>
          <span>Maintenance ({plots.filter(p => p.status === 'Maintenance').length})</span>
        </div>
      </div>

      {/* Map Controls */}
      <div className={styles.mapControls}>
        <button className={styles.controlBtn} onClick={() => setScale(s => Math.min(s * 1.25, 3.5))} title="Zoom In">+</button>
        <button className={styles.controlBtn} onClick={() => setScale(s => Math.max(s * 0.8, 0.5))} title="Zoom Out">−</button>
        <button className={styles.controlBtn} onClick={resetView} title="Fit to Screen" style={{ fontSize: '0.85rem' }}>⛶</button>
      </div>

      {/* Section Quick Jump Buttons */}
      <div className={styles.sectionJumps}>
        <span style={{ fontSize: '0.7rem', color: '#78716c', alignSelf: 'center', paddingLeft: '4px' }}>JUMP TO:</span>
        <button className={styles.jumpBtn} onClick={resetView}>Full Cemetery</button>
        <button className={styles.jumpBtn} onClick={() => jumpToSection('A')}>Section A (West)</button>
        <button className={styles.jumpBtn} onClick={() => jumpToSection('B')}>Section B (East)</button>
        <button className={styles.jumpBtn} onClick={() => jumpToSection('C')}>Section C (North)</button>
        <button className={styles.jumpBtn} onClick={() => jumpToSection('gate')}>Main Gate</button>
      </div>

      {/* Viewport for SVG Rendering */}
      <div
        className={styles.mapViewport}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          width={mapWidth}
          height={mapHeight}
          className={styles.svgMap}
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`
          }}
          viewBox={`0 0 ${mapWidth} ${mapHeight}`}
        >
          <defs>
            {/* Lawn background pattern */}
            <linearGradient id="lawnGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#142416" />
              <stop offset="100%" stopColor="#0b170e" />
            </linearGradient>

            {/* Pathway stone gradient */}
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2c2720" />
              <stop offset="50%" stopColor="#3d372e" />
              <stop offset="100%" stopColor="#2c2720" />
            </linearGradient>

            {/* Plaza stone pattern */}
            <radialGradient id="plazaGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#4a4235" />
              <stop offset="85%" stopColor="#2d2820" />
              <stop offset="100%" stopColor="#1c1914" />
            </radialGradient>
          </defs>

          {/* 1. Base Ground Lawn */}
          <rect x="0" y="0" width={mapWidth} height={mapHeight} fill="url(#lawnGradient)" />

          {/* 2. Perimeter Stone Wall with Decorative Border */}
          <rect x="30" y="30" width={mapWidth - 60} height={mapHeight - 60} fill="none" stroke="#544c3d" strokeWidth="12" rx="16" />
          <rect x="36" y="36" width={mapWidth - 72} height={mapHeight - 72} fill="none" stroke="#2a241b" strokeWidth="2" rx="12" />

          {/* Corner Watchtowers / Bastions */}
          {[[30, 30], [mapWidth - 30, 30], [30, mapHeight - 30], [mapWidth - 30, mapHeight - 30]].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="18" fill="#3e372b" stroke="#C8A84B" strokeWidth="2" />
          ))}

          {/* 3. PATHWAYS & AVENUES */}
          {/* Main Central North-South Boulevard */}
          <rect x="530" y="42" width="140" height="780" fill="url(#pathGradient)" rx="6" />
          <line x1="600" y1="50" x2="600" y2="820" stroke="#C8A84B" strokeWidth="1.5" strokeDasharray="8,8" opacity="0.4" />

          {/* East-West Cross Avenue */}
          <rect x="42" y="425" width={mapWidth - 84} height="70" fill="url(#pathGradient)" rx="6" />
          <line x1="50" y1="460" x2={mapWidth - 50} y2="460" stroke="#C8A84B" strokeWidth="1.5" strokeDasharray="8,8" opacity="0.4" />

          {/* Perimeter Walkways */}
          <rect x="55" y="55" width={mapWidth - 110} height={mapHeight - 110} fill="none" stroke="#2d2820" strokeWidth="16" rx="10" />

          {/* 4. CENTRAL MEMORIAL PLAZA / ROUNDABOUT */}
          <circle cx="600" cy="460" r="85" fill="url(#plazaGradient)" stroke="#C8A84B" strokeWidth="3" />
          <circle cx="600" cy="460" r="65" fill="#1b241c" stroke="#544c3d" strokeWidth="2" />

          {/* Center Memorial Monument & Cross */}
          <circle cx="600" cy="460" r="30" fill="#2d2820" stroke="#C8A84B" strokeWidth="2" />
          {/* Cross icon */}
          <rect x="597" y="440" width="6" height="40" fill="#E2C97E" />
          <rect x="588" y="448" width="24" height="6" fill="#E2C97E" />
          <text x="600" y="505" fill="#E2C97E" fontSize="9" fontWeight="bold" textAnchor="middle" letterSpacing="1">MEMORIAL PLAZA</text>

          {/* 5. MAIN ENTRANCE GATE & SECURITY PAVILION */}
          <g transform="translate(500, 810)">
            <rect x="0" y="0" width="200" height="55" fill="#241e17" stroke="#C8A84B" strokeWidth="2.5" rx="8" />
            <text x="100" y="24" fill="#E2C97E" fontSize="11" fontWeight="bold" textAnchor="middle" letterSpacing="1.5">MAIN ENTRANCE</text>
            <text x="100" y="42" fill="#a8a29e" fontSize="8" textAnchor="middle">MUNICIPALITY OF JASAAN CEMETERY</text>
            {/* Gate Bars */}
            {[-80, -40, 0, 40, 80].map((gx, idx) => (
              <circle key={idx} cx={100 + gx} cy="55" r="4" fill="#C8A84B" />
            ))}
          </g>

          {/* 6. SECTION BANNERS & LABELS */}
          {/* Section A Banner */}
          <g transform="translate(85, 465)">
            <rect x="0" y="0" width="415" height="20" fill="rgba(18, 26, 20, 0.9)" stroke="#4caf50" strokeWidth="1" rx="4" />
            <text x="207" y="14" fill="#81c784" fontSize="10" fontWeight="bold" textAnchor="middle" letterSpacing="1.2">
              SECTION A · WEST LAWN (80 PLOTS)
            </text>
          </g>

          {/* Section B Banner */}
          <g transform="translate(695, 465)">
            <rect x="0" y="0" width="415" height="20" fill="rgba(18, 26, 20, 0.9)" stroke="#4caf50" strokeWidth="1" rx="4" />
            <text x="207" y="14" fill="#81c784" fontSize="10" fontWeight="bold" textAnchor="middle" letterSpacing="1.2">
              SECTION B · EAST LAWN (80 PLOTS)
            </text>
          </g>

          {/* Section C Banner */}
          <g transform="translate(175, 95)">
            <rect x="0" y="0" width="455" height="20" fill="rgba(18, 26, 20, 0.9)" stroke="#4caf50" strokeWidth="1" rx="4" />
            <text x="227" y="14" fill="#81c784" fontSize="10" fontWeight="bold" textAnchor="middle" letterSpacing="1.2">
              SECTION C · NORTH MEMORIAL GARDEN (87 PLOTS)
            </text>
          </g>

          {/* 7. LANDSCAPING TREES & GARDENS */}
          {/* Cypress Trees along boundaries */}
          {[
            [120, 75], [260, 75], [400, 75], [800, 75], [940, 75], [1080, 75],
            [60, 200], [60, 360], [60, 580], [60, 740],
            [1140, 200], [1140, 360], [1140, 580], [1140, 740],
            [280, 850], [420, 850], [780, 850], [920, 850]
          ].map(([tx, ty], idx) => (
            <g key={idx} transform={`translate(${tx}, ${ty})`}>
              <circle cx="0" cy="0" r="14" fill="#1b4d24" stroke="#0e2913" strokeWidth="2" opacity="0.85" />
              <circle cx="-3" cy="-3" r="8" fill="#2d6e38" opacity="0.9" />
              <circle cx="0" cy="0" r="3" fill="#0e2913" />
            </g>
          ))}

          {/* 8. GRAVE PLOTS (CLICKABLE RECTANGLES) */}
          {plots.map(plot => {
            const coords = getPlotCoordinates(plot);
            const stylesObj = getPlotStyles(plot);
            const isHovered = hoveredPlot?.id === plot.id;
            const isSelected = selectedPlotNumber && plot.plotNumber.toLowerCase() === selectedPlotNumber.toLowerCase();
            const isHighlighted = highlightPlotNumber && plot.plotNumber.toLowerCase() === highlightPlotNumber.toLowerCase();

            return (
              <g
                key={plot.id}
                transform={`translate(${coords.x}, ${coords.y})`}
                onClick={() => onSelectPlot && onSelectPlot(plot)}
                onMouseEnter={() => setHoveredPlot(plot)}
                onMouseLeave={() => setHoveredPlot(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Highlight Spotlight / Beacon */}
                {(isSelected || isHighlighted) && (
                  <circle
                    cx={coords.w / 2}
                    cy={coords.h / 2}
                    r={coords.w * 0.8}
                    fill="none"
                    stroke="#FFD700"
                    strokeWidth="3"
                    className={styles.pulseCircle}
                  />
                )}

                {/* Plot Rectangle */}
                <rect
                  x="0"
                  y="0"
                  width={coords.w}
                  height={coords.h}
                  fill={stylesObj.fill}
                  stroke={stylesObj.stroke}
                  strokeWidth={stylesObj.strokeWidth}
                  rx="3"
                  opacity={stylesObj.opacity}
                  style={{
                    transition: 'all 0.15s ease',
                    filter: isHovered ? 'drop-shadow(0 0 6px rgba(200, 168, 75, 0.8))' : 'none'
                  }}
                />

                {/* Headstone Marker Shape */}
                <rect
                  x="3"
                  y="3"
                  width={coords.w - 6}
                  height="5"
                  fill="rgba(255, 255, 255, 0.2)"
                  rx="1"
                />

                {/* Plot ID Label */}
                <text
                  x={coords.w / 2}
                  y={coords.h / 2 + 3}
                  fill={stylesObj.textColor}
                  fontSize="7.5"
                  fontWeight="bold"
                  textAnchor="middle"
                  fontFamily="monospace"
                  opacity={stylesObj.opacity}
                >
                  {plot.plotNumber}
                </text>

                {/* Status Indicator Dot/Glyph */}
                {plot.status === 'Occupied' && (
                  <text
                    x={coords.w / 2}
                    y={coords.h - 4}
                    fill="#ffcdd2"
                    fontSize="6"
                    textAnchor="middle"
                  >
                    ✝
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Floating Hover Tooltip */}
      {hoveredPlot && (
        <div
          className={styles.mapTooltip}
          style={{
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`
          }}
        >
          <div className={styles.tooltipTitle}>
            <span>Plot {hoveredPlot.plotNumber}</span>
            <span
              className={styles.tooltipBadge}
              style={{
                backgroundColor:
                  hoveredPlot.status === 'Occupied' ? '#c62828' :
                  hoveredPlot.status === 'Reserved' ? '#e65100' :
                  hoveredPlot.status === 'Maintenance' ? '#0277bd' : '#2e7d32',
                color: '#ffffff'
              }}
            >
              {hoveredPlot.status}
            </span>
          </div>
          <div className={styles.tooltipText}><strong>Section:</strong> {hoveredPlot.section} (Row {hoveredPlot.row}, Col {hoveredPlot.column})</div>
          <div className={styles.tooltipText}><strong>Type:</strong> {hoveredPlot.plotType}</div>

          {hoveredPlot.deceasedRecord ? (
            <div className={styles.tooltipDeceased}>
              <div>✝ {hoveredPlot.deceasedRecord.NAME_OF_DECEASED}</div>
              <div style={{ fontSize: '0.7rem', color: '#a8a29e', fontWeight: 'normal' }}>
                Ref: {hoveredPlot.deceasedRecord.REF_NO}
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '0.72rem', color: '#81c784', marginTop: '4px' }}>
              ✓ Ready for assignment
            </div>
          )}
        </div>
      )}
    </div>
  );
}
