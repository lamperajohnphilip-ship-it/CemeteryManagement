'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';
import './mapping.css';

export default function MappingPage() {
  const initialized = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (typeof window !== 'undefined' && (window as any).initMapping && !initialized.current) {
        (window as any).initMapping();
        initialized.current = true;
        clearInterval(timer);
      }
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mapping-root">
      <div style={{ width: '100%', height: 'calc(100vh - 60px)', position: 'relative' }}>
        <div dangerouslySetInnerHTML={{ __html: `<!-- UPDATED NAVIGATION - NO SIDEBAR BUTTON -->
<nav>
  <div class="nav-left">
    <div class="nav-logo">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z"/>
        <circle cx="12" cy="9" r="2.5"/>
      </svg>
      ETERNAL REST
    </div>
    <div class="nav-title">Mapping</div>
  </div>
  <!-- BACK TO PORTAL BUTTON -->
  <a class="nav-back" href="cemetery-management.html">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
    Back to Portal
  </a>
</nav>

<!-- SIDEBAR AND OVERLAY COMPLETELY REMOVED -->

<!-- MAIN GRID -->
<div class="main-grid" id="mainGrid">
  <div class="loc-card card-big" id="card-public" onclick="openView('public')">
    <canvas class="card-canvas" id="cv-public"></canvas>
    <div class="card-overlay"><div class="card-tag">Municipal</div><div class="card-name">Public Cemetery</div><div class="card-stats"><span class="stat-dot"></span><span>247 plots · 74% occupied</span></div></div>
    <div class="card-arrow"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></div>
  </div>
  <div class="loc-card card-small disabled" id="card-bobontugan" onclick="alert('This cemetery map is currently not available.')">
    <canvas class="card-canvas" id="cv-bobontugan"></canvas>
    <div class="card-overlay"><div class="card-tag">Cemetery · Jasaan</div><div class="card-name">Bobontugan</div><div><span class="na-badge">Not Available</span></div></div>
  </div>
  <div class="loc-card card-small disabled" id="card-private" onclick="alert('This cemetery map is currently not available.')">
    <canvas class="card-canvas" id="cv-private"></canvas>
    <div class="card-overlay"><div class="card-tag">Private</div><div class="card-name">Private Cemetery</div><div><span class="na-badge">Not Available</span></div></div>
  </div>
  <div class="loc-card card-small disabled" id="card-meedu" onclick="alert('This cemetery map is currently not available.')">
    <canvas class="card-canvas" id="cv-meedu"></canvas>
    <div class="card-overlay"><div class="card-tag">Barangay</div><div class="card-name">Meedu</div><div><span class="na-badge">Not Available</span></div></div>
  </div>
</div>

<!-- 3D VIEW -->
<div id="view3d">
  <div class="v3-nav">
    <div class="v3-title" id="v3Title">—</div>
    <button class="v3-back" onclick="closeView()">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
      Back to Map
    </button>
  </div>
  <div class="v3-toolbar">
    <span class="tb-label">Camera:</span>
    <button class="tb-btn on" id="tb-persp" onclick="setCamera('perspective',this)">3D Perspective</button>
    <button class="tb-btn" id="tb-top" onclick="setCamera('top',this)">Top Down</button>
    <button class="tb-btn" id="tb-iso" onclick="setCamera('isometric',this)">Isometric</button>
    <div class="tb-sep"></div>
    <span class="tb-label">Toggle:</span>
    <button class="tb-btn on" id="tb-occ" onclick="toggleLayer('occupied',this)">Occupied</button>
    <button class="tb-btn on" id="tb-avail" onclick="toggleLayer('available',this)">Available</button>
    <button class="tb-btn on" id="tb-paths" onclick="toggleLayer('paths',this)">Paths</button>
    <div class="tb-hint">Drag to rotate · Scroll to zoom · <strong style="color:var(--orange)">Click orange pin</strong> to view grave details</div>
  </div>
  <div class="v3-body">
    <div class="loader" id="loader">
      <div class="loader-ring"></div>
      <div class="loader-txt" id="loaderTxt">Loading 3D View…</div>
    </div>
    <canvas id="c3d"></canvas>

    <!-- GRAVE POPUP MODAL -->
    <div class="grave-popup-overlay" id="gravePopupOverlay" onclick="if(event.target===this)closeGravePopup()">
      <div class="grave-popup" id="gravePopup">
        <div class="gp-tomb-preview">
          <canvas id="tombCanvas"></canvas>
          <div class="gp-tomb-label">3D Grave Preview</div>
          <div class="gp-tomb-badge" id="tombBadge">Plot —</div>
        </div>
        <div class="gp-header">
          <button class="gp-close" onclick="closeGravePopup()">&#x2715;</button>
          <div class="gp-pin-badge"><div class="gp-pin-dot"></div><span class="gp-pin-label">Located Grave</span></div>
          <div class="gp-name" id="gpName">&#8212;</div>
          <div class="gp-plot-tag" id="gpPlot">&#8212;</div>
        </div>
        <div class="gp-body">
          <div class="gp-dates-row">
            <div class="gp-birth" id="gpBorn">&#8212;</div>
            <div class="gp-dash">&#8212;</div>
            <div class="gp-death" id="gpDied">&#8212;</div>
            <div class="gp-age-badge" id="gpAge">&#8212;</div>
          </div>
          <div class="gp-grid">
            <div class="gp-field"><div class="gp-field-label">Cause of Death</div><div class="gp-field-val" id="gpCause">&#8212;</div></div>
            <div class="gp-field"><div class="gp-field-label">Religion</div><div class="gp-field-val" id="gpReligion">&#8212;</div></div>
            <div class="gp-field"><div class="gp-field-label">Nationality</div><div class="gp-field-val" id="gpNat">&#8212;</div></div>
            <div class="gp-field"><div class="gp-field-label">Next of Kin</div><div class="gp-field-val" id="gpKin">&#8212;</div></div>
            <div class="gp-field full"><div class="gp-field-label">Contact Number</div><div class="gp-field-val" id="gpContact">&#8212;</div></div>
          </div>
          <div class="gp-actions">
            <a class="gp-btn-primary" id="gpBackBtn" href="cemetery-management.html">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
              Back to Portal
            </a>
            <button class="gp-btn-secondary" onclick="flyToTarget();closeGravePopup()">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>
              Focus View
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- FIND GRAVE FLOATING BUTTON -->
    <button class="find-grave-btn" id="findGraveBtn" onclick="flyToTarget();showGravePopup()">
      <div class="find-btn-icon">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
      </div>
      Find Grave
    </button>

    <!-- PIN HOVER LABEL -->
    <div class="pin-label" id="pinLabel">
      <div class="pin-label-bubble">
        <div class="pin-label-name" id="pinLabelName">&#8212;</div>
        <div class="pin-label-plot" id="pinLabelPlot">&#8212;</div>
        <div class="pin-label-hint">Click to view details</div>
      </div>
      <div class="pin-label-arrow"></div>
    </div>

    <div class="v3-info">
      <div class="v3-info-head">
        <div class="v3-info-eyebrow">Cemetery Info</div>
        <div class="v3-info-name" id="v3InfoName">—</div>
      </div>
      <div class="v3-info-body" id="v3InfoBody">
        <div id="graveDetailSlot"></div>
        <div class="info-section" id="legendSection">
          <div class="info-section-title">Legend</div>
          <div class="leg-row"><div class="leg-box" style="background:var(--gold)"></div>Occupied Grave</div>
          <div class="leg-row"><div class="leg-box" style="background:var(--moss)"></div>Available Plot</div>
          <div class="leg-row"><div class="leg-box" style="background:var(--fog)"></div>Pathway / Walkway</div>
          <div class="leg-row"><div class="leg-box" style="background:var(--stone)"></div>Ground</div>
          <div class="leg-row"><div class="leg-box" style="background:#ff9922;border:1px solid #ffbb44"></div>Located Grave (Pin)</div>
        </div>
        <div class="info-section">
          <div class="info-section-title">Statistics</div>
          <div class="kv-row"><div class="kv-key">Total Plots</div><div class="kv-val gold" id="kv-total">—</div></div>
          <div class="kv-row"><div class="kv-key">Occupied</div><div class="kv-val" id="kv-occ">—</div></div>
          <div class="kv-row"><div class="kv-key">Available</div><div class="kv-val green" id="kv-avail">—</div></div>
          <div class="kv-row"><div class="kv-key">Sections</div><div class="kv-val" id="kv-sec">—</div></div>
          <div class="kv-row"><div class="kv-key">Location</div><div class="kv-val" id="kv-loc">—</div></div>
          <div class="kv-row" id="kv-locate-row" style="display:none"><div class="kv-key">Locating</div><div class="kv-val orange" id="kv-locate-name">—</div></div>
        </div>
        <div class="hint-card">
          🖱 Left-drag &nbsp; Rotate view<br>
          🖱 Right-drag &nbsp; Pan camera<br>
          ⚙ Scroll &nbsp; Zoom in/out<br>
          🔶 Click orange pin &nbsp; View grave details
        </div>
      </div>
    </div>
  </div>
</div>
        ` }} />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" strategy="beforeInteractive" />
        <Script src="/mapping-script.js" strategy="afterInteractive" />
      </div>
    </div>
  );
}
