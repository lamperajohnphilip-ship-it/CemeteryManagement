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
  const mapWidth = 1700;
  const mapHeight = 1150;

  // Plot coordinates calculation (Cadastral Block layout with walking strips)
  const getPlotCoordinates = useCallback((plot: GravePlotWithDeceased) => {
    const { section, row, column } = plot;

    const plotW = 66;
    const plotH = 48;
    const gapX = 6;
    const gapY = 6;

    if (section === 'A') {
      // West Lawn Cadastral Block (10 cols x 8 rows) -> A-1 to A-80
      const startX = 110;
      const startY = 160;
      return {
        x: startX + (column - 1) * (plotW + gapX),
        y: startY + (row - 1) * (plotH + gapY),
        w: plotW,
        h: plotH
      };
    } else if (section === 'B') {
      // East Lawn Cadastral Block (10 cols x 8 rows) -> B-1 to B-80
      const startX = 890;
      const startY = 160;
      return {
        x: startX + (column - 1) * (plotW + gapX),
        y: startY + (row - 1) * (plotH + gapY),
        w: plotW,
        h: plotH
      };
    } else {
      // Section C: North Garden Cadastral Block (11 cols x 8 rows) -> C-1 to C-87
      const startX = 430;
      const startY = 660;
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
    const newScale = Math.min(Math.max(scale * zoomFactor, 0.4), 3.5);

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
    if (e.button !== 0) return; // Left click only
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

  // Reset View
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

    let targetX = 850;
    let targetY = 575;
    let targetScale = 1.1;

    if (section === 'A') {
      targetX = 460;
      targetY = 360;
      targetScale = 1.35;
    } else if (section === 'B') {
      targetX = 1240;
      targetY = 360;
      targetScale = 1.35;
    } else if (section === 'C') {
      targetX = 850;
      targetY = 880;
      targetScale = 1.35;
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

  // Name formatter helper (Surname, Given Name)
  const formatDeceasedName = (fullName: string) => {
    if (!fullName) return { lastName: '', firstNames: '' };
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return { lastName: parts[0], firstNames: '' };
    if (parts.length === 2) return { lastName: parts[1], firstNames: parts[0] };
    const lastName = parts[parts.length - 1];
    const firstNames = parts.slice(0, parts.length - 1).join(' ');
    return { lastName, firstNames };
  };

  // Status Styling
  const getPlotStyles = (plot: GravePlotWithDeceased) => {
    const isSelected = selectedPlotNumber && plot.plotNumber.toLowerCase() === selectedPlotNumber.toLowerCase();
    const isHighlighted = highlightPlotNumber && plot.plotNumber.toLowerCase() === highlightPlotNumber.toLowerCase();
    const filteredOut = isPlotFiltered(plot);

    let fill = '#c8e6c9'; // Available (light green)
    let stroke = '#2e7d32'; // Green border
    let textColor = '#1b5e20';

    if (plot.status === 'Occupied') {
      fill = '#cfd8dc'; // Occupied with Burial (light slate)
      stroke = '#455a64'; // Dark slate border
      textColor = '#0f172a';
    } else if (plot.status === 'Reserved') {
      fill = '#f8bbd0'; // Reserved (pink)
      stroke = '#c2185b'; // Magenta border
      textColor = '#880e4f';
    } else if (plot.status === 'Maintenance' || plot.status === 'Restricted') {
      fill = '#ffccbc'; // Restricted / Maintenance (coral)
      stroke = '#d84315';
      textColor = '#bf360c';
    } else if (plot.status === 'Sold') {
      fill = '#b2ebf2'; // Sold available (cyan)
      stroke = '#00838f';
      textColor = '#006064';
    } else if (plot.status === 'Unavailable') {
      fill = '#e2e8f0';
      stroke = '#94a3b8';
      textColor = '#64748b';
    }

    return {
      fill: filteredOut ? '#2b382d' : fill,
      stroke: isSelected ? '#FFD700' : isHighlighted ? '#ff9800' : stroke,
      strokeWidth: isSelected || isHighlighted ? 3 : 1.2,
      textColor: filteredOut ? '#666666' : textColor,
      opacity: filteredOut ? 0.35 : 1
    };
  };

  // Calculate minimap red viewport box coordinates
  const getMinimapViewportRect = () => {
    if (!containerRef.current) return { x: 0, y: 0, w: 50, h: 40 };
    const containerW = containerRef.current.clientWidth || 1000;
    const containerH = containerRef.current.clientHeight || 650;

    const visibleLeft = (-pan.x) / scale;
    const visibleTop = (-pan.y) / scale;
    const visibleW = containerW / scale;
    const visibleH = containerH / scale;

    const miniScaleX = 170 / mapWidth;
    const miniScaleY = 150 / mapHeight;

    const x = Math.max(0, Math.min(170, visibleLeft * miniScaleX));
    const y = Math.max(0, Math.min(150, visibleTop * miniScaleY));
    const w = Math.max(16, Math.min(170, visibleW * miniScaleX));
    const h = Math.max(14, Math.min(150, visibleH * miniScaleY));

    return { x, y, w, h };
  };

  const miniRect = getMinimapViewportRect();

  return (
    <div className={styles.mapContainer} ref={containerRef}>
      {/* Top Left Navigation Controls */}
      <div className={styles.mapControls}>
        <button className={styles.controlBtn} onClick={() => setScale(s => Math.min(s * 1.25, 3.5))} title="Zoom In">+</button>
        <button className={styles.controlBtn} onClick={() => setScale(s => Math.max(s * 0.8, 0.4))} title="Zoom Out">−</button>
        <button className={styles.controlBtn} onClick={resetView} title="Fit Entire Cemetery" style={{ fontSize: '0.9rem' }}>⛶</button>
      </div>

      {/* Section Quick Jump Chips */}
      <div className={styles.sectionJumps}>
        <button className={styles.jumpBtn} onClick={resetView}>Full Cemetery</button>
        <button className={styles.jumpBtn} onClick={() => jumpToSection('A')}>Section A · West</button>
        <button className={styles.jumpBtn} onClick={() => jumpToSection('B')}>Section B · East</button>
        <button className={styles.jumpBtn} onClick={() => jumpToSection('C')}>Section C · North</button>
      </div>

      {/* Top Right Minimap Overview Inset */}
      <div className={styles.minimapContainer} onClick={resetView} title="Cemetery Overview - Click to reset view">
        <div className={styles.minimapHeader}>Overview</div>
        <svg viewBox={`0 0 ${mapWidth} ${mapHeight}`} className={styles.minimapSvg}>
          {/* Minimap Background Ground */}
          <rect x="0" y="0" width={mapWidth} height={mapHeight} fill="#3b5d2e" />

          {/* Section Footprint Outlines */}
          {/* Section A */}
          <rect x="110" y="160" width="714" height="426" fill="#e2e8f0" stroke="#1e293b" strokeWidth="4" rx="6" />
          <text x="467" y="385" fill="#334155" fontSize="64" fontWeight="bold" textAnchor="middle">A</text>

          {/* Section B */}
          <rect x="890" y="160" width="714" height="426" fill="#e2e8f0" stroke="#1e293b" strokeWidth="4" rx="6" />
          <text x="1247" y="385" fill="#334155" fontSize="64" fontWeight="bold" textAnchor="middle">B</text>

          {/* Section C */}
          <rect x="430" y="660" width="786" height="426" fill="#e2e8f0" stroke="#1e293b" strokeWidth="4" rx="6" />
          <text x="823" y="885" fill="#334155" fontSize="64" fontWeight="bold" textAnchor="middle">C</text>

          {/* Red Active Viewport Rectangle */}
          <rect
            x={(-pan.x) / scale}
            y={(-pan.y) / scale}
            width={((containerRef.current?.clientWidth || 1000) / scale)}
            height={((containerRef.current?.clientHeight || 650) / scale)}
            fill="rgba(239, 68, 68, 0.2)"
            stroke="#dc2626"
            strokeWidth="12"
            rx="8"
          />
        </svg>
      </div>

      {/* Bottom Right GIS Legend Card */}
      <div className={styles.mapLegendCard}>
        <div className={styles.legendCardTitle}>Legend</div>
        <div className={styles.legendList}>
          <div className={styles.legendRow}>
            <span className={`${styles.legendSwatch} ${styles.swatchAvailable}`} />
            <span>Available</span>
          </div>
          <div className={styles.legendRow}>
            <span className={`${styles.legendSwatch} ${styles.swatchReserved}`} />
            <span>Reserved</span>
          </div>
          <div className={styles.legendRow}>
            <span className={`${styles.legendSwatch} ${styles.swatchRestricted}`} />
            <span>Restricted</span>
          </div>
          <div className={styles.legendRow}>
            <span className={`${styles.legendSwatch} ${styles.swatchSold}`} />
            <span>Sold</span>
          </div>
          <div className={styles.legendRow}>
            <span className={`${styles.legendSwatch} ${styles.swatchOccupied}`} />
            <span>Sold With Burial</span>
          </div>
          <div className={styles.legendRow}>
            <span className={`${styles.legendSwatch} ${styles.swatchBurials}`} />
            <span>Burials / Vault</span>
          </div>
        </div>
      </div>

      {/* Viewport for Interactive SVG Canvas */}
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
            {/* Real Grass Turf Background Pattern */}
            <linearGradient id="gisGrassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4f7e38" />
              <stop offset="50%" stopColor="#416b2d" />
              <stop offset="100%" stopColor="#4c7736" />
            </linearGradient>

            {/* Mown grass pattern */}
            <pattern id="mownGrass" width="80" height="80" patternUnits="userSpaceOnUse">
              <rect width="80" height="80" fill="#436d2f" />
              <line x1="0" y1="0" x2="80" y2="80" stroke="#3b6129" strokeWidth="8" opacity="0.45" />
              <line x1="80" y1="0" x2="0" y2="80" stroke="#4c7736" strokeWidth="4" opacity="0.3" />
            </pattern>

            {/* Walking pathway corridor pattern */}
            <linearGradient id="walkwayGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#679e4d" />
              <stop offset="50%" stopColor="#76ae5b" />
              <stop offset="100%" stopColor="#679e4d" />
            </linearGradient>

            {/* Drop shadow for grave plots */}
            <filter id="plotShadow" x="-5%" y="-5%" width="115%" height="115%">
              <feDropShadow dx="1" dy="1.5" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* 1. Base Turf Layer */}
          <rect x="0" y="0" width={mapWidth} height={mapHeight} fill="url(#gisGrassGrad)" />
          <rect x="0" y="0" width={mapWidth} height={mapHeight} fill="url(#mownGrass)" opacity="0.75" />

          {/* 2. Walking corridors & Buffer lawns separating Cadastral Blocks */}
          {/* Vertical central corridor */}
          <rect x="830" y="40" width="50" height={mapHeight - 80} fill="url(#walkwayGrad)" rx="6" />
          <line x1="855" y1="50" x2="855" y2={mapHeight - 50} stroke="#2e5020" strokeWidth="1.5" strokeDasharray="6,6" opacity="0.5" />

          {/* Horizontal cross avenue */}
          <rect x="50" y="595" width={mapWidth - 100} height="55" fill="url(#walkwayGrad)" rx="6" />
          <line x1="60" y1="622" x2={mapWidth - 60} y2="622" stroke="#2e5020" strokeWidth="1.5" strokeDasharray="6,6" opacity="0.5" />

          {/* 3. Cadastral Survey Boundary Lines (Purple/Magenta lines from reference) */}
          {/* Section A Survey boundary */}
          <rect x="95" y="145" width="744" height="440" fill="none" stroke="#a21caf" strokeWidth="1.5" strokeDasharray="8,6" rx="4" />
          {/* Section B Survey boundary */}
          <rect x="875" y="145" width="744" height="440" fill="none" stroke="#a21caf" strokeWidth="1.5" strokeDasharray="8,6" rx="4" />
          {/* Section C Survey boundary */}
          <rect x="415" y="645" width="816" height="440" fill="none" stroke="#a21caf" strokeWidth="1.5" strokeDasharray="8,6" rx="4" />

          {/* 4. Pink/Magenta Section & Survey Badges (Exactly like 6A, 7A, 38, 21, D, E in reference image) */}
          {/* Section A Markers */}
          <g transform="translate(85, 150)">
            <circle cx="0" cy="0" r="14" fill="#ec4899" stroke="#be185d" strokeWidth="1.5" />
            <text x="0" y="4" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">6A</text>
          </g>
          <g transform="translate(845, 150)">
            <circle cx="0" cy="0" r="14" fill="#ec4899" stroke="#be185d" strokeWidth="1.5" />
            <text x="0" y="4" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">7A</text>
          </g>
          <g transform="translate(85, 590)">
            <circle cx="0" cy="0" r="14" fill="#ec4899" stroke="#be185d" strokeWidth="1.5" />
            <text x="0" y="4" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">3A</text>
          </g>
          <g transform="translate(855, 590)">
            <circle cx="0" cy="0" r="14" fill="#ec4899" stroke="#be185d" strokeWidth="1.5" />
            <text x="0" y="4" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">38</text>
          </g>
          <g transform="translate(410, 650)">
            <circle cx="0" cy="0" r="14" fill="#ec4899" stroke="#be185d" strokeWidth="1.5" />
            <text x="0" y="4" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">21</text>
          </g>
          <g transform="translate(1235, 650)">
            <circle cx="0" cy="0" r="14" fill="#ec4899" stroke="#be185d" strokeWidth="1.5" />
            <text x="0" y="4" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">20</text>
          </g>

          {/* Section Banners */}
          <g transform="translate(110, 115)">
            <rect x="0" y="0" width="260" height="26" fill="#ffffff" stroke="#a21caf" strokeWidth="1.5" rx="4" />
            <text x="130" y="17" fill="#86198f" fontSize="12" fontWeight="bold" textAnchor="middle">SECTION A · WEST LAWN</text>
          </g>
          <g transform="translate(890, 115)">
            <rect x="0" y="0" width="260" height="26" fill="#ffffff" stroke="#a21caf" strokeWidth="1.5" rx="4" />
            <text x="130" y="17" fill="#86198f" fontSize="12" fontWeight="bold" textAnchor="middle">SECTION B · EAST LAWN</text>
          </g>
          <g transform="translate(430, 615)">
            <rect x="0" y="0" width="310" height="26" fill="#ffffff" stroke="#a21caf" strokeWidth="1.5" rx="4" />
            <text x="155" y="17" fill="#86198f" fontSize="12" fontWeight="bold" textAnchor="middle">SECTION C · NORTH MEMORIAL GARDEN</text>
          </g>

          {/* 5. GRAVE PLOT TILES (Cadastral Lots with Deceased Names) */}
          {plots.map(plot => {
            const coords = getPlotCoordinates(plot);
            const stylesObj = getPlotStyles(plot);
            const isHovered = hoveredPlot?.id === plot.id;
            const isSelected = selectedPlotNumber && plot.plotNumber.toLowerCase() === selectedPlotNumber.toLowerCase();
            const isHighlighted = highlightPlotNumber && plot.plotNumber.toLowerCase() === highlightPlotNumber.toLowerCase();

            const deceasedName = plot.deceasedRecord?.NAME_OF_DECEASED || '';
            const { lastName, firstNames } = formatDeceasedName(deceasedName);

            return (
              <g
                key={plot.id}
                transform={`translate(${coords.x}, ${coords.y})`}
                onClick={() => onSelectPlot && onSelectPlot(plot)}
                onMouseEnter={() => setHoveredPlot(plot)}
                onMouseLeave={() => setHoveredPlot(null)}
                style={{ cursor: 'pointer' }}
                filter="url(#plotShadow)"
              >
                {/* Highlight Beacon Spotlight */}
                {(isSelected || isHighlighted) && (
                  <circle
                    cx={coords.w / 2}
                    cy={coords.h / 2}
                    r={coords.w * 0.75}
                    fill="none"
                    stroke="#FFD700"
                    strokeWidth="3.5"
                    className={styles.pulseCircle}
                  />
                )}

                {/* Plot Outer Lot Rectangle */}
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
                    filter: isHovered ? 'brightness(1.08) drop-shadow(0 0 6px rgba(56, 189, 248, 0.8))' : 'none'
                  }}
                />

                {/* Plot Number in Corner/Top (like 1-1, 2-1, A-1) */}
                <text
                  x="4"
                  y="9.5"
                  fill="#475569"
                  fontSize="6.5"
                  fontWeight="bold"
                  fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                  opacity={stylesObj.opacity}
                >
                  {plot.plotNumber}
                </text>

                {/* Case 1: OCCUPIED (Sold with Burial) -> Inner Vault Box + Deceased Surname & First Names */}
                {plot.status === 'Occupied' && (
                  <>
                    {/* Inner Vault / Tomb Box */}
                    <rect
                      x="4"
                      y="12"
                      width={coords.w - 8}
                      height={coords.h - 15}
                      rx="2"
                      fill="#b0bec5"
                      stroke="#78909c"
                      strokeWidth="0.8"
                      opacity="0.65"
                    />

                    {/* Surname in bold dark text (Top line) */}
                    <text
                      x={coords.w / 2}
                      y="24"
                      fill="#0f172a"
                      fontSize="7.5"
                      fontWeight="bold"
                      textAnchor="middle"
                      fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                    >
                      {lastName || 'Occupied'}
                    </text>

                    {/* First name below (Bottom line) */}
                    {firstNames && (
                      <text
                        x={coords.w / 2}
                        y="34"
                        fill="#334155"
                        fontSize="6.5"
                        textAnchor="middle"
                        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                      >
                        {firstNames}
                      </text>
                    )}
                  </>
                )}

                {/* Case 2: AVAILABLE -> Centered Green Plot Label */}
                {plot.status === 'Available' && (
                  <text
                    x={coords.w / 2}
                    y={coords.h / 2 + 4}
                    fill="#1b5e20"
                    fontSize="8.5"
                    fontWeight="bold"
                    textAnchor="middle"
                    fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                  >
                    {plot.plotNumber}
                  </text>
                )}

                {/* Case 3: RESERVED -> Pink Plot Label with Reserved text */}
                {plot.status === 'Reserved' && (
                  <>
                    <text
                      x={coords.w / 2}
                      y="23"
                      fill="#880e4f"
                      fontSize="7.5"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {plot.plotNumber}
                    </text>
                    <text
                      x={coords.w / 2}
                      y="33"
                      fill="#ad1457"
                      fontSize="6.2"
                      textAnchor="middle"
                    >
                      Reserved
                    </text>
                  </>
                )}

                {/* Case 4: RESTRICTED / MAINTENANCE */}
                {(plot.status === 'Maintenance' || plot.status === 'Restricted') && (
                  <>
                    <text
                      x={coords.w / 2}
                      y="23"
                      fill="#bf360c"
                      fontSize="7.5"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {plot.plotNumber}
                    </text>
                    <text
                      x={coords.w / 2}
                      y="33"
                      fill="#d84315"
                      fontSize="6"
                      textAnchor="middle"
                    >
                      Restricted
                    </text>
                  </>
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
                  hoveredPlot.status === 'Occupied' ? '#334155' :
                  hoveredPlot.status === 'Reserved' ? '#ec4899' :
                  hoveredPlot.status === 'Maintenance' ? '#ea580c' : '#16a34a',
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
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 'normal', marginTop: '2px' }}>
                Ref: {hoveredPlot.deceasedRecord.REF_NO}
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '0.74rem', color: '#86efac', marginTop: '4px' }}>
              ✓ Ready for assignment
            </div>
          )}
        </div>
      )}
    </div>
  );
}
