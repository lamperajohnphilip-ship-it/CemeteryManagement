/* ============================================================
   CEMETERY DATA (unchanged)
============================================================ */
const CEMETERIES = {
  bobontugan: { name:'Bobontugan Cemetery',  location:'Brgy. Bobontugan, Jasaan', total:142, occupied:108, available:34, sections:3, rows:10, cols:14, rate:0.76 },
  public:     { name:'Public Cemetery',       location:'Poblacion, Jasaan',        total:247, occupied:183, available:64, sections:3, rows:13, cols:19, rate:0.74 },
  private:    { name:'Private Cemetery',      location:'Jasaan, Misamis Oriental', total:98,  occupied:71,  available:27, sections:2, rows:7,  cols:14, rate:0.72 },
  meedu:      { name:'Meedu Cemetery',        location:'Brgy. Meedu, Jasaan',      total:63,  occupied:44,  available:19, sections:2, rows:7,  cols:9,  rate:0.70 },
};

/* ============================================================
   LOCATE GRAVE STATE
============================================================ */
let LOCATE_GRAVE = null;
let targetPlotMesh = null;
let pinMeshes = [];

function loadLocateGrave() {
  try {
    const raw = sessionStorage.getItem('locateGrave');
    if (raw) {
      LOCATE_GRAVE = JSON.parse(raw);
      sessionStorage.removeItem('locateGrave');
      sessionStorage.removeItem('locateCemetery');
    }
  } catch(e) { LOCATE_GRAVE = null; }
}

function plotToGridPos(plotStr, rows, cols) {
  const match = plotStr.match(/([A-Ca-c])-?(\d+)/);
  if (!match) return { col: Math.floor(cols/2), row: Math.floor(rows/2) };
  const sec = match[1].toUpperCase();
  const num = parseInt(match[2]);
  const secCols = Math.floor(cols / 3);
  const secOffset = sec === 'A' ? 0 : sec === 'B' ? secCols : secCols * 2;
  const col = secOffset + ((num - 1) % secCols);
  const row = Math.floor((num - 1) / secCols) % rows;
  return { col: Math.min(col, cols - 1), row: Math.min(row, rows - 1) };
}

/* ============================================================
   MINI 3D PREVIEWS (unchanged)
============================================================ */
const miniRenderers = {};
const MINI_CONFIG = {
  bobontugan: { fog:0x1a2e20, ground:0x3a5c30, groundDark:0x2e4a26, accent:0xc9a84c, sky:0x2d4a3e, rows:5, cols:7 },
  public:     { fog:0x1a2535, ground:0x4a6a35, groundDark:0x3a5525, accent:0xb89040, sky:0x2a3d55, rows:4, cols:6 },
  private:    { fog:0x251a35, ground:0x3d5535, groundDark:0x2e4028, accent:0xd4a855, sky:0x3a2d4a, rows:4, cols:5 },
  meedu:      { fog:0x1c2818, ground:0x4a6838, groundDark:0x384e2a, accent:0xa88c38, sky:0x2d3a2a, rows:3, cols:5 },
};

function mkRng(seed) {
  let s = seed >>> 0;
  return () => { s=Math.imul(s^s>>>15,1|s); s^=s+Math.imul(s^s>>>7,61|s); return((s^s>>>14)>>>0)/4294967296; };
}

function buildMiniScene(key) {
  const cfg = MINI_CONFIG[key];
  const rng = mkRng(key.charCodeAt(0)*997+31);
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(cfg.sky);
  scene.fog = new THREE.FogExp2(cfg.fog, 0.038);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(28,28), new THREE.MeshLambertMaterial({color:cfg.ground}));
  ground.rotation.x=-Math.PI/2; scene.add(ground);
  const wallMat=new THREE.MeshLambertMaterial({color:0x9a8a68});
  [[0,10.5,21,0.28],[0,-10.5,21,0.28],[10.5,0,0.28,21],[-10.5,0,0.28,21]].forEach(([x,z,w,d])=>{
    const wall=new THREE.Mesh(new THREE.BoxGeometry(w,0.55,d),wallMat); wall.position.set(x,0.275,z); scene.add(wall);
  });
  const postMat=new THREE.MeshLambertMaterial({color:cfg.accent});
  [-0.9,0.9].forEach(px=>{ const post=new THREE.Mesh(new THREE.BoxGeometry(0.22,1.5,0.22),postMat); post.position.set(px,0.75,10.5); scene.add(post); });
  const path=new THREE.Mesh(new THREE.PlaneGeometry(1.4,21),new THREE.MeshLambertMaterial({color:0xa09070}));
  path.rotation.x=-Math.PI/2; path.position.set(0,0.01,0); scene.add(path);
  const {rows,cols}=cfg;
  const spX=2.0,spZ=2.4,oX=-(cols-1)*spX/2,oZ=-(rows-1)*spZ/2;
  const stoneMat0=new THREE.MeshLambertMaterial({color:0xb8a880});
  const slabMat=new THREE.MeshLambertMaterial({color:0x807060});
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
    if(Math.abs(c-(cols-1)/2)<0.6) continue;
    const x=oX+c*spX,z=oZ+r*spZ,occ=rng()>0.28;
    const slab=new THREE.Mesh(new THREE.BoxGeometry(0.85,0.07,1.2),slabMat); slab.position.set(x,0.035,z); scene.add(slab);
    if(occ){ const head=new THREE.Mesh(new THREE.BoxGeometry(0.65,1.0,0.1),stoneMat0); head.position.set(x,0.5,z-0.52); scene.add(head); }
  }
  const trunkMat=new THREE.MeshLambertMaterial({color:0x5a3a1a});
  const leafMat=new THREE.MeshLambertMaterial({color:0x1e5c18});
  [[-9,-9],[9,-9],[-9,9],[-7,0],[7,0]].forEach(([tx,tz])=>{
    const h=2.2+rng()*1.4;
    const trunk=new THREE.Mesh(new THREE.CylinderGeometry(0.13,0.18,h,7),trunkMat); trunk.position.set(tx,h/2,tz); scene.add(trunk);
    const foliage=new THREE.Mesh(new THREE.SphereGeometry(0.9+rng()*0.5,7,5),leafMat); foliage.position.set(tx,h+0.4,tz); scene.add(foliage);
  });
  scene.add(new THREE.AmbientLight(0xfff8e8,0.75));
  const sun=new THREE.DirectionalLight(0xffd878,1.1); sun.position.set(12,20,10); scene.add(sun);
  return scene;
}

function initMiniPreview(key) {
  const canvas = document.getElementById('cv-'+key);
  if (!canvas||miniRenderers[key]) return;
  const renderer = new THREE.WebGLRenderer({canvas,antialias:true,alpha:false});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  const scene=buildMiniScene(key);
  const camera=new THREE.PerspectiveCamera(52,1,0.1,80);
  const vpList=[{theta:0.20,phi:1.12,r:18},{theta:0.68,phi:0.90,r:15},{theta:1.05,phi:1.20,r:19},{theta:1.55,phi:0.78,r:14}];
  const keys4=['bobontugan','public','private','meedu'];
  let vpIdx=keys4.indexOf(key)%vpList.length;
  let prevVP=vpList[vpIdx],nextVP=vpList[vpIdx],tp=1,holdT=keys4.indexOf(key)*1.2,inTrans=false,lastT=null;
  const lerpN=(a,b,t)=>a+(b-a)*t;
  const lerpA=(a,b,t)=>{let d=b-a;while(d>Math.PI)d-=Math.PI*2;while(d<-Math.PI)d+=Math.PI*2;return a+d*t;};
  const ease=t=>t<.5?2*t*t:-1+(4-2*t)*t;
  let cTheta=prevVP.theta,cPhi=prevVP.phi,cR=prevVP.r;
  function tick(now){
    miniRenderers[key]._rafId=requestAnimationFrame(tick);
    const dt=lastT==null?0:Math.min((now-lastT)/1000,0.1); lastT=now;
    if(inTrans){ tp+=dt/1.4; if(tp>=1){tp=1;inTrans=false;holdT=0;prevVP=nextVP;cTheta=nextVP.theta;cPhi=nextVP.phi;cR=nextVP.r;} const e=ease(tp); cTheta=lerpA(prevVP.theta,nextVP.theta,e); cPhi=lerpN(prevVP.phi,nextVP.phi,e); cR=lerpN(prevVP.r,nextVP.r,e); }
    else{ holdT+=dt; if(holdT>=5){prevVP=vpList[vpIdx];vpIdx=(vpIdx+1)%vpList.length;nextVP=vpList[vpIdx];inTrans=true;tp=0;} }
    camera.position.set(cR*Math.sin(cPhi)*Math.cos(cTheta),cR*Math.cos(cPhi),cR*Math.sin(cPhi)*Math.sin(cTheta));
    camera.lookAt(0,0.5,0);
    const W=canvas.clientWidth,H=canvas.clientHeight;
    if(W>0&&H>0){if(renderer.domElement.width!==W*renderer.getPixelRatio()||renderer.domElement.height!==H*renderer.getPixelRatio()){renderer.setSize(W,H,false);camera.aspect=W/H;camera.updateProjectionMatrix();}}
    renderer.render(scene,camera);
  }
  miniRenderers[key]=renderer; miniRenderers[key]._rafId=requestAnimationFrame(tick);
}

function initPreviews() { ['bobontugan','public','private','meedu'].forEach(k=>initMiniPreview(k)); }

/* ============================================================
   THREE.JS 3D VIEW (unchanged)
============================================================ */
let renderer,scene,camera,rafId;
let camTheta=Math.PI/5,camPhi=Math.PI/3.2,camR=22;
let camTarget={x:0,y:0,z:0};
let dragging=false,rightDrag=false,lastMouse={x:0,y:0};
let plotMeshes=[];
let showOcc=true,showAvail=true,showPaths=true;
let activeCem=null;

function openView(key) {
  activeCem=key;
  const d=CEMETERIES[key];
  document.getElementById('v3Title').textContent=d.name;
  document.getElementById('v3InfoName').textContent=d.name;
  document.getElementById('kv-total').textContent=d.total;
  document.getElementById('kv-occ').textContent=d.occupied;
  document.getElementById('kv-avail').textContent=d.available;
  document.getElementById('kv-sec').textContent=d.sections;
  document.getElementById('kv-loc').textContent=d.location;

  if (LOCATE_GRAVE) {
    document.getElementById('kv-locate-row').style.display='flex';
    document.getElementById('kv-locate-name').textContent=LOCATE_GRAVE.name;
    const fb=document.getElementById('findGraveBtn');
    if(fb) fb.classList.add('active');
  } else {
    const fb=document.getElementById('findGraveBtn');
    if(fb) fb.classList.remove('active');
  }

  showOcc=true;showAvail=true;showPaths=true;
  ['tb-persp','tb-occ','tb-avail','tb-paths'].forEach(id=>{const el=document.getElementById(id);if(el)el.classList.add('on');});
  ['tb-top','tb-iso'].forEach(id=>{const el=document.getElementById(id);if(el)el.classList.remove('on');});

  document.getElementById('view3d').classList.add('show');
  document.body.style.overflow='hidden';
  document.getElementById('loader').classList.remove('hide');
  document.getElementById('loaderTxt').textContent=LOCATE_GRAVE?'Locating '+LOCATE_GRAVE.name+'…':'Loading 3D View…';
  document.getElementById('graveDetailSlot').innerHTML='';

  camTheta=Math.PI/5;camPhi=Math.PI/3.2;camR=22;camTarget={x:0,y:0,z:0};
  setTimeout(()=>init3D(key),60);
}

function closeView() {
  document.getElementById('view3d').classList.remove('show');
  document.body.style.overflow='';
  closeGravePopup();
  const label=document.getElementById('pinLabel');
  if(label) label.classList.remove('show');
  if(rafId) cancelAnimationFrame(rafId);
  disposeScene();
}

function disposeScene() {
  if(!scene) return;
  scene.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material.dispose();}});
  if(renderer){renderer.dispose();renderer=null;}
  scene=null;camera=null;pinMeshes=[];targetPlotMesh=null;
  window._pinHeadGroup=null; window._pinRing=null; _pinT=0;
}

function init3D(key) {
  const canvas=document.getElementById('c3d');
  const container=canvas.parentElement;
  const W=container.clientWidth-280,H=container.clientHeight;
  disposeScene();
  renderer=new THREE.WebGLRenderer({canvas,antialias:true});
  renderer.setSize(W,H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.setClearColor(0x0e1a0c);
  scene=new THREE.Scene();
  scene.fog=new THREE.Fog(0x0e1a0c,35,90);
  camera=new THREE.PerspectiveCamera(48,W/H,0.1,200);
  updateCam();
  scene.add(new THREE.AmbientLight(0x88aa80,0.65));
  const sun=new THREE.DirectionalLight(0xfff8e8,1.3);
  sun.position.set(18,28,12); sun.castShadow=true;
  sun.shadow.mapSize.set(2048,2048); sun.shadow.camera.near=0.5; sun.shadow.camera.far=100;
  sun.shadow.camera.left=-35; sun.shadow.camera.right=35; sun.shadow.camera.top=35; sun.shadow.camera.bottom=-35;
  scene.add(sun);
  const fill=new THREE.DirectionalLight(0x446855,0.35); fill.position.set(-12,10,-12); scene.add(fill);
  buildScene(CEMETERIES[key]);
  bindControls(canvas,W,H);
  window.addEventListener('resize',()=>{if(!renderer||!camera)return;const nW=container.clientWidth-280,nH=container.clientHeight;renderer.setSize(nW,nH);camera.aspect=nW/nH;camera.updateProjectionMatrix();});
  setTimeout(()=>{
    document.getElementById('loader').classList.add('hide');
    if (LOCATE_GRAVE && targetPlotMesh) {
      flyToTarget();
      showLocateBanner();
      setTimeout(()=>showGravePopup(), 900);
    }
  },700);
  renderLoop();
}

/* ============================================================
   BUILD SCENE (unchanged)
   ★ KEY CHANGE: Pin is placed ON TOP of the tomb's headstone cap
============================================================ */
function buildScene(d) {
  plotMeshes=[];pinMeshes=[];targetPlotMesh=null;
  const rows=d.rows,cols=d.cols;
  const total=rows*cols,occ=Math.floor(total*d.rate);
  const shuffled=[...Array(total).keys()].sort(()=>Math.random()-0.5);
  const occSet=new Set(shuffled.slice(0,occ));
  const SX=1.45,SZ=1.45,gW=cols*SX,gH=rows*SZ;

  let targetGridCol=-1,targetGridRow=-1;
  if (LOCATE_GRAVE) {
    const pos = plotToGridPos(LOCATE_GRAVE.plot, rows, cols);
    targetGridCol=pos.col; targetGridRow=pos.row;
  }

  // Ground
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(gW+5,gH+5),new THREE.MeshLambertMaterial({color:0x182614}));
  ground.rotation.x=-Math.PI/2; ground.receiveShadow=true; scene.add(ground);
  const grassInner=new THREE.Mesh(new THREE.PlaneGeometry(gW+1.5,gH+1.5),new THREE.MeshLambertMaterial({color:0x1e3018}));
  grassInner.rotation.x=-Math.PI/2; grassInner.position.y=0.005; scene.add(grassInner);

  // Walls
  const wMat=new THREE.MeshLambertMaterial({color:0x3c3228});
  [[0,gH/2+2.25,gW+4.5,0.3,1.0],[0,-gH/2-2.25,gW+4.5,0.3,1.0],[gW/2+2.25,0,0.3,gH+5,1.0],[-gW/2-2.25,0,0.3,gH+5,1.0]]
  .forEach(([x,z,w,dep,h])=>{const wall=new THREE.Mesh(new THREE.BoxGeometry(w,h,dep),wMat);wall.position.set(x,h/2,z);wall.castShadow=true;scene.add(wall);});

  // Paths
  if(showPaths){
    const pMat=new THREE.MeshLambertMaterial({color:0x4a5e40});
    const mainH=new THREE.Mesh(new THREE.PlaneGeometry(gW+1,0.75),pMat); mainH.rotation.x=-Math.PI/2; mainH.position.y=0.012; scene.add(mainH);
    const mainV=new THREE.Mesh(new THREE.PlaneGeometry(0.75,gH+1),pMat); mainV.rotation.x=-Math.PI/2; mainV.position.y=0.012; scene.add(mainV);
    for(let r=3;r<rows;r+=3){const z=(r-(rows-1)/2)*SZ;const sp=new THREE.Mesh(new THREE.PlaneGeometry(gW+0.5,0.35),pMat);sp.rotation.x=-Math.PI/2;sp.position.set(0,0.011,z);scene.add(sp);}
  }

  // Plot grid
  const startX=-(cols-1)/2*SX,startZ=-(rows-1)/2*SZ;
  for(let r=0;r<rows;r++){
    for(let c=0;c<cols;c++){
      const idx=r*cols+c;
      const isTarget=(c===targetGridCol && r===targetGridRow);
      const isOcc=isTarget?true:occSet.has(idx);
      if(isOcc&&!showOcc&&!isTarget) continue;
      if(!isOcc&&!showAvail) continue;
      const x=startX+c*SX,z=startZ+r*SZ;
      if(Math.abs(x)<0.5||Math.abs(z)<0.5) continue;

      const h=isOcc?0.09+Math.random()*0.05:0.03;
      const pColor=isTarget?0xff9922:isOcc?0xc9a84c:0x4a6741;
      const mat=new THREE.MeshLambertMaterial({color:pColor});
      if(isTarget) mat.emissive=new THREE.Color(0x331100);
      const plotMesh=new THREE.Mesh(new THREE.BoxGeometry(0.92,h,0.92),mat);
      plotMesh.position.set(x,h/2,z); plotMesh.castShadow=true; plotMesh.receiveShadow=true;
      plotMesh.userData={isOccupied:isOcc,origColor:pColor,isTarget:isTarget,graveData:isTarget?LOCATE_GRAVE:null};
      scene.add(plotMesh); plotMeshes.push(plotMesh);
      if(isTarget) targetPlotMesh=plotMesh;

      if(isOcc){
        // Headstone height — taller for target grave so it stands out
        const hsH=isTarget?0.55:0.28+Math.random()*0.32;
        const hsMat=new THREE.MeshLambertMaterial({color:isTarget?0xffaa44:0x7a7268});
        const hs=new THREE.Mesh(new THREE.BoxGeometry(0.14,hsH,0.07),hsMat);
        hs.position.set(x,h+hsH/2,z-0.38); hs.castShadow=true; scene.add(hs);

        // Round cap on top of headstone
        const capMat=new THREE.MeshLambertMaterial({color:isTarget?0xffbb55:0x8a8278});
        const cap=new THREE.Mesh(new THREE.SphereGeometry(0.075,8,4),capMat);
        cap.position.set(x,h+hsH,z-0.38); scene.add(cap);

        // ★ TARGET GRAVE — pin placed directly on top of the headstone cap
        if(isTarget){
          // The exact Y where the top of the headstone cap sits
          const headstoneTopY = h + hsH + 0.075; // slab top + headstone height + cap radius

          // ── Ground glow disc beneath the tomb ──
          const glowDisc=new THREE.Mesh(
            new THREE.CircleGeometry(1.0,32),
            new THREE.MeshLambertMaterial({color:0xff4400,transparent:true,opacity:0.2})
          );
          glowDisc.rotation.x=-Math.PI/2; glowDisc.position.set(x,0.02,z-0.38); scene.add(glowDisc);

          // ── Pulsing target ring on the ground below the headstone ──
          const ringMat=new THREE.MeshLambertMaterial({color:0xff6600,transparent:true,opacity:0.55});
          const ring=new THREE.Mesh(new THREE.TorusGeometry(0.7,0.06,8,32),ringMat);
          ring.rotation.x=Math.PI/2; ring.position.set(x,0.04,z-0.38);
          ring.userData={isRing:true}; scene.add(ring); pinMeshes.push(ring);

          // ── Very short stem sitting right on top of the headstone cap ──
          // This anchors the pin visually to the tomb
          const stemMat=new THREE.MeshLambertMaterial({color:0xcc3300});
          const stemHeight = 0.35; // short — just a connector from cap to pin head
          const stem=new THREE.Mesh(new THREE.CylinderGeometry(0.04,0.055,stemHeight,10),stemMat);
          // Position stem so its bottom touches the headstone cap top
          stem.position.set(x, headstoneTopY + stemHeight/2, z-0.38);
          stem.castShadow=true; scene.add(stem);
          stem.userData={isPin:true,graveData:LOCATE_GRAVE}; pinMeshes.push(stem);

          // ── Teardrop PIN HEAD — sits directly on top of stem / headstone ──
          const pinHeadGroup=new THREE.Group();
          // Base Y = top of stem
          const pinBaseY = headstoneTopY + stemHeight;
          pinHeadGroup.position.set(x, pinBaseY, z-0.38);

          // Main sphere body (bright red-orange map pin)
          const pinBodyMat=new THREE.MeshLambertMaterial({color:0xff2200,emissive:new THREE.Color(0x550000)});
          const pinBody=new THREE.Mesh(new THREE.SphereGeometry(0.55,20,14),pinBodyMat);
          pinBody.userData={isPin:true,graveData:LOCATE_GRAVE}; pinBody.castShadow=true;
          pinHeadGroup.add(pinBody);

          // White inner dot (classic map pin look)
          const innerMat=new THREE.MeshLambertMaterial({color:0xffffff});
          const inner=new THREE.Mesh(new THREE.SphereGeometry(0.22,12,10),innerMat);
          inner.position.set(0,0,0.38);
          inner.userData={isPin:true,graveData:LOCATE_GRAVE};
          pinHeadGroup.add(inner);

          // Bottom point of teardrop pointing downward into the headstone
          const pointMat=new THREE.MeshLambertMaterial({color:0xdd1100,emissive:new THREE.Color(0x330000)});
          const point=new THREE.Mesh(new THREE.ConeGeometry(0.22,0.55,12),pointMat);
          // Cone points down — position it below the sphere center
          point.position.set(0,-0.65,0); point.rotation.z=Math.PI;
          point.userData={isPin:true,graveData:LOCATE_GRAVE}; point.castShadow=true;
          pinHeadGroup.add(point);

          // Sheen highlight for 3D depth
          const hlMat=new THREE.MeshLambertMaterial({color:0xff7755,transparent:true,opacity:0.6});
          const hl=new THREE.Mesh(new THREE.SphereGeometry(0.28,10,8),hlMat);
          hl.position.set(0.14,0.24,0.18);
          pinHeadGroup.add(hl);

          scene.add(pinHeadGroup);

          // Store animation state — baseY is the resting position on the headstone
          pinHeadGroup.userData={isPin:true,graveData:LOCATE_GRAVE,isPinGroup:true,baseY:pinBaseY};
          pinBody.userData.graveData=LOCATE_GRAVE;
          inner.userData.graveData=LOCATE_GRAVE;
          point.userData.graveData=LOCATE_GRAVE;

          pinMeshes.push(pinBody); pinMeshes.push(inner); pinMeshes.push(point);
          pinMeshes.push(stem); pinMeshes.push(plotMesh);

          window._pinHeadGroup=pinHeadGroup;
          window._pinRing=ring;
          plotMesh.userData.isPin=true;
        }
      }
    }
  }

  // Trees
  [[-gW/2+0.6,-gH/2+0.6],[gW/2-0.6,-gH/2+0.6],[-gW/2+0.6,gH/2-0.6],[gW/2-0.6,gH/2-0.6],[0,-gH/2+0.6],[0,gH/2-0.6],[-gW/2+0.6,0],[gW/2-0.6,0]].forEach(([tx,tz])=>addTree(tx,tz));

  // Gate
  const gMat=new THREE.MeshLambertMaterial({color:0x7a6030});
  [-0.48,0.48].forEach(ox=>{const p=new THREE.Mesh(new THREE.BoxGeometry(0.18,1.4,0.18),gMat);p.position.set(ox,0.7,gH/2+2.3);p.castShadow=true;scene.add(p);});
  const gt=new THREE.Mesh(new THREE.BoxGeometry(1.14,0.14,0.14),gMat); gt.position.set(0,1.38,gH/2+2.3); scene.add(gt);
  const sign=new THREE.Mesh(new THREE.BoxGeometry(1.0,0.3,0.05),new THREE.MeshLambertMaterial({color:0x5a4a20})); sign.position.set(0,1.65,gH/2+2.3); scene.add(sign);
}

function addTree(x,z){
  const trunkMat=new THREE.MeshLambertMaterial({color:0x4a3015});
  const trunk=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.11,0.65,7),trunkMat); trunk.position.set(x,0.32,z); trunk.castShadow=true; scene.add(trunk);
  const leafMat=new THREE.MeshLambertMaterial({color:0x285a22});
  const leaves=new THREE.Mesh(new THREE.SphereGeometry(0.38,7,6),leafMat); leaves.position.set(x,1.1,z); leaves.castShadow=true; scene.add(leaves);
  const leaves2=new THREE.Mesh(new THREE.SphereGeometry(0.26,7,6),leafMat); leaves2.position.set(x+0.15,1.4,z-0.1); leaves2.castShadow=true; scene.add(leaves2);
}

/* ============================================================
   FLY-TO-TARGET (unchanged)
============================================================ */
function flyToTarget() {
  if (!targetPlotMesh) return;
  const tx=targetPlotMesh.position.x, tz=targetPlotMesh.position.z - 0.38; // headstone offset
  const startTarget={...camTarget};
  const endTarget={x:tx, y:0, z:tz};
  const startR=camR, endR=7;
  const startPhi=camPhi, endPhi=Math.PI/4.2;
  const dur=1400; const start=performance.now();
  function step(now){
    const t=Math.min((now-start)/dur,1);
    const e=1-(1-t)*(1-t)*(1-t);
    camTarget.x=startTarget.x+(endTarget.x-startTarget.x)*e;
    camTarget.y=startTarget.y+(endTarget.y-startTarget.y)*e;
    camTarget.z=startTarget.z+(endTarget.z-startTarget.z)*e;
    camR=startR+(endR-startR)*e;
    camPhi=startPhi+(endPhi-startPhi)*e;
    updateCam();
    if(t<1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ============================================================
   LOCATE BANNER (unchanged)
============================================================ */
function showLocateBanner() {
  if (!LOCATE_GRAVE) return;
  const canvas=document.getElementById('c3d').parentElement;
  const existing=canvas.querySelector('.locate-banner');
  if(existing) existing.remove();
  const banner=document.createElement('div');
  banner.className='locate-banner';
  banner.innerHTML=
    '<div class="lb-dot"></div>'+
    '<div><div class="lb-text">Locating grave of</div><div class="lb-name">'+LOCATE_GRAVE.name+'</div></div>'+
    '<div><div class="lb-text" style="margin-bottom:0.2rem">Plot '+LOCATE_GRAVE.plot+' · Section '+LOCATE_GRAVE.section+'</div></div>'+
    '<button class="lb-dismiss" onclick="this.parentElement.remove()">Dismiss</button>';
  canvas.appendChild(banner);
  setTimeout(()=>{ if(banner.parentElement) banner.remove(); },6000);
}

/* ============================================================
   GRAVE POPUP MODAL + 3D TOMB PREVIEW (unchanged)
============================================================ */
let tombRenderer=null, tombRafId=null;

function buildTombScene(g) {
  const ts=new THREE.Scene();
  ts.background=new THREE.Color(0x0a120a);
  ts.fog=new THREE.Fog(0x0a120a,8,20);

  const ground=new THREE.Mesh(new THREE.PlaneGeometry(6,6),new THREE.MeshLambertMaterial({color:0x1a2e18}));
  ground.rotation.x=-Math.PI/2; ground.receiveShadow=true; ts.add(ground);

  const slabMat=new THREE.MeshLambertMaterial({color:0x7a6e5a});
  const slab=new THREE.Mesh(new THREE.BoxGeometry(1.1,0.12,1.7),slabMat);
  slab.position.set(0,0.06,0.1); slab.castShadow=true; ts.add(slab);

  const border=new THREE.Mesh(new THREE.BoxGeometry(1.1,0.06,0.08),new THREE.MeshLambertMaterial({color:0x9a8e78}));
  border.position.set(0,0.15,0.92); border.castShadow=true; ts.add(border);

  const hsColor=0xb8a88c;
  const hsMat=new THREE.MeshLambertMaterial({color:hsColor});
  const hs=new THREE.Mesh(new THREE.BoxGeometry(0.72,1.1,0.12),hsMat);
  hs.position.set(0,0.55,-0.72); hs.castShadow=true; ts.add(hs);

  const arch=new THREE.Mesh(new THREE.CylinderGeometry(0.36,0.36,0.12,12,1,false,0,Math.PI),hsMat);
  arch.rotation.z=Math.PI/2; arch.rotation.y=Math.PI/2;
  arch.position.set(0,1.1,-0.72); ts.add(arch);

  const panel=new THREE.Mesh(new THREE.BoxGeometry(0.54,0.6,0.02),new THREE.MeshLambertMaterial({color:0x9a8878}));
  panel.position.set(0,0.6,-0.66); ts.add(panel);

  const crossMat=new THREE.MeshLambertMaterial({color:0xd4c4a8});
  const crossV=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.38,0.04),crossMat);
  crossV.position.set(0,0.68,-0.66); ts.add(crossV);
  const crossH=new THREE.Mesh(new THREE.BoxGeometry(0.24,0.06,0.04),crossMat);
  crossH.position.set(0,0.76,-0.66); ts.add(crossH);

  const stemMat2=new THREE.MeshLambertMaterial({color:0x3a6630});
  const flowerColors=[0xff5577,0xffaacc,0xff7799];
  [-0.25,0,0.25].forEach((fx,i)=>{
    const stem2=new THREE.Mesh(new THREE.CylinderGeometry(0.02,0.02,0.28,6),stemMat2);
    stem2.position.set(fx,0.14,-0.2); ts.add(stem2);
    const petal=new THREE.Mesh(new THREE.SphereGeometry(0.08,8,6),new THREE.MeshLambertMaterial({color:flowerColors[i%3]}));
    petal.position.set(fx,0.3,-0.2); ts.add(petal);
  });

  const candleMat=new THREE.MeshLambertMaterial({color:0xf0e0c0});
  const flameMat=new THREE.MeshLambertMaterial({color:0xffaa22,emissive:new THREE.Color(0x441100)});
  [-0.35,0.35].forEach(cx=>{
    const body=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.07,0.22,8),candleMat);
    body.position.set(cx,0.11,-0.45); ts.add(body);
    const flame=new THREE.Mesh(new THREE.SphereGeometry(0.04,6,6),flameMat);
    flame.position.set(cx,0.25,-0.45); ts.add(flame);
  });

  const cl1=new THREE.PointLight(0xff8833,1.2,3.5); cl1.position.set(-0.35,0.5,-0.45); ts.add(cl1);
  const cl2=new THREE.PointLight(0xff8833,1.2,3.5); cl2.position.set(0.35,0.5,-0.45); ts.add(cl2);
  ts.add(new THREE.AmbientLight(0x557755,0.6));
  const sun2=new THREE.DirectionalLight(0xfff0d8,0.9); sun2.position.set(3,6,4); sun2.castShadow=true; ts.add(sun2);

  return ts;
}

function showGravePopup(g) {
  const grave = g || LOCATE_GRAVE;
  if (!grave) return;
  const fmtDate = d => {
    try { return new Date(d).toLocaleDateString('en-PH',{year:'numeric',month:'long',day:'numeric'}); }
    catch(e){ return d; }
  };
  document.getElementById('gpName').textContent    = grave.name || '—';
  document.getElementById('gpPlot').textContent    = 'Plot ' + (grave.plot||'—') + '  ·  Section ' + (grave.section||'—');
  document.getElementById('gpBorn').textContent    = fmtDate(grave.born);
  document.getElementById('gpDied').textContent    = fmtDate(grave.died);
  document.getElementById('gpAge').textContent     = 'Age ' + (grave.age||'—');
  document.getElementById('gpCause').textContent   = grave.cause    || '—';
  document.getElementById('gpReligion').textContent= grave.religion || '—';
  document.getElementById('gpNat').textContent     = grave.nationality || '—';
  document.getElementById('gpKin').textContent     = grave.kin      || '—';
  document.getElementById('gpContact').textContent = grave.contact  || '—';
  document.getElementById('tombBadge').textContent = 'Plot ' + (grave.plot||'—');
  document.getElementById('gravePopupOverlay').classList.add('show');
  startTombPreview();
  showGraveDetailPanel(grave);
}

function startTombPreview() {
  if(tombRafId){ cancelAnimationFrame(tombRafId); tombRafId=null; }
  if(tombRenderer){ tombRenderer.dispose(); tombRenderer=null; }
  const tc=document.getElementById('tombCanvas');
  if(!tc) return;
  const W=tc.offsetWidth||400, H=tc.offsetHeight||180;
  tombRenderer=new THREE.WebGLRenderer({canvas:tc,antialias:true,alpha:false});
  tombRenderer.setSize(W,H,false);
  tombRenderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  tombRenderer.shadowMap.enabled=true;
  const ts=buildTombScene(LOCATE_GRAVE);
  const tc2=new THREE.PerspectiveCamera(48,W/H,0.1,30);
  let tTheta=2.4,tPhi=1.05,tR=3.2;
  const tTarget={x:0,y:0.4,z:-0.3};
  tc2.position.set(tTarget.x+tR*Math.sin(tPhi)*Math.cos(tTheta),tTarget.y+tR*Math.cos(tPhi),tTarget.z+tR*Math.sin(tPhi)*Math.sin(tTheta));
  tc2.lookAt(tTarget.x,tTarget.y,tTarget.z);
  let tT=0;
  function tombLoop(){
    tombRafId=requestAnimationFrame(tombLoop);
    tT+=0.008; tTheta=2.4+Math.sin(tT)*0.4;
    tc2.position.set(tTarget.x+tR*Math.sin(tPhi)*Math.cos(tTheta),tTarget.y+tR*Math.cos(tPhi),tTarget.z+tR*Math.sin(tPhi)*Math.sin(tTheta));
    tc2.lookAt(tTarget.x,tTarget.y,tTarget.z);
    tombRenderer.render(ts,tc2);
  }
  tombRafId=requestAnimationFrame(tombLoop);
}

function closeGravePopup() {
  document.getElementById('gravePopupOverlay').classList.remove('show');
  if(tombRafId){ cancelAnimationFrame(tombRafId); tombRafId=null; }
  if(tombRenderer){ tombRenderer.dispose(); tombRenderer=null; }
}

document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeGravePopup(); });

function showGraveDetailPanel(g) {
  const slot=document.getElementById('graveDetailSlot');
  const fmtDate=d=>{ try{return new Date(d).toLocaleDateString('en-PH',{year:'numeric',month:'long',day:'numeric'});}catch(e){return d;} };
  slot.innerHTML=
    '<div class="grave-detail-card">'+
      '<div class="gd-plot">&#128205; Plot '+g.plot+' &middot; Section '+g.section+'</div>'+
      '<div class="gd-name">'+g.name+'</div>'+
      '<div class="gd-dates">'+fmtDate(g.born)+' &mdash; '+fmtDate(g.died)+' &middot; Age '+g.age+'</div>'+
      '<div class="gd-grid">'+
        '<div><div class="gd-field-label">Cause of Death</div><div class="gd-field-val">'+g.cause+'</div></div>'+
        '<div><div class="gd-field-label">Religion</div><div class="gd-field-val">'+g.religion+'</div></div>'+
        '<div><div class="gd-field-label">Nationality</div><div class="gd-field-val">'+g.nationality+'</div></div>'+
        '<div><div class="gd-field-label">Next of Kin</div><div class="gd-field-val">'+g.kin+'</div></div>'+
        '<div style="grid-column:span 2"><div class="gd-field-label">Contact</div><div class="gd-field-val">'+g.contact+'</div></div>'+
      '</div>'+
      '<a class="gd-back-btn" href="cemetery-management.html">'+
        '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>'+
        'Back to Portal'+
      '</a>'+
    '</div>';
  document.getElementById('v3InfoBody').scrollTop=0;
}

/* ============================================================
   CONTROLS (unchanged)
============================================================ */
function bindControls(canvas, W, H) {
  const raycaster=new THREE.Raycaster();
  canvas.addEventListener('mousedown',e=>{dragging=true;rightDrag=e.button===2;lastMouse={x:e.clientX,y:e.clientY};});
  canvas.addEventListener('mousemove',e=>{
    if(!dragging) return;
    const dx=e.clientX-lastMouse.x,dy=e.clientY-lastMouse.y;
    if(rightDrag){camTarget.x-=Math.sin(camTheta)*dx*0.03;camTarget.z-=Math.cos(camTheta)*dx*0.03;camTarget.y+=dy*0.03;}
    else{camTheta-=dx*0.007;camPhi=Math.max(0.18,Math.min(Math.PI/2.05,camPhi-dy*0.007));}
    lastMouse={x:e.clientX,y:e.clientY}; updateCam();
  });
  window.addEventListener('mouseup',()=>dragging=false);
  canvas.addEventListener('contextmenu',e=>e.preventDefault());
  canvas.addEventListener('wheel',e=>{camR=Math.max(4,Math.min(55,camR+e.deltaY*0.035));updateCam();e.preventDefault();},{passive:false});

  let lTouch=null;
  canvas.addEventListener('touchstart',e=>{lTouch={x:e.touches[0].clientX,y:e.touches[0].clientY};});
  canvas.addEventListener('touchmove',e=>{if(!lTouch)return;camTheta-=(e.touches[0].clientX-lTouch.x)*0.009;camPhi=Math.max(0.18,Math.min(Math.PI/2.05,camPhi-(e.touches[0].clientY-lTouch.y)*0.009));lTouch={x:e.touches[0].clientX,y:e.touches[0].clientY};updateCam();e.preventDefault();},{passive:false});

  let mouseDownPos={x:0,y:0};
  canvas.addEventListener('mousedown',e=>{mouseDownPos={x:e.clientX,y:e.clientY};});
  canvas.addEventListener('mouseup',e=>{
    if(Math.hypot(e.clientX-mouseDownPos.x,e.clientY-mouseDownPos.y)>6) return;
    const rect=canvas.getBoundingClientRect();
    const cW=renderer.domElement.width/window.devicePixelRatio;
    const cH=renderer.domElement.height/window.devicePixelRatio;
    const mouse=new THREE.Vector2(((e.clientX-rect.left)/cW)*2-1,-((e.clientY-rect.top)/cH)*2+1);
    raycaster.setFromCamera(mouse,camera);
    if(pinMeshes.length>0){
      const pinHits=raycaster.intersectObjects(pinMeshes);
      if(pinHits.length>0){
        const gd=pinHits[0].object.userData.graveData;
        if(gd){ showGravePopup(gd); flyToTarget(); return; }
      }
    }
    const hits=raycaster.intersectObjects(plotMeshes);
    plotMeshes.forEach(m=>{ if(!m.userData.isTarget) m.material.color.setHex(m.userData.origColor); });
    if(hits.length>0){
      const hit=hits[0].object;
      if(hit.userData.isTarget&&hit.userData.graveData){ showGravePopup(hit.userData.graveData); flyToTarget(); }
      else if(!hit.userData.isTarget){ hit.material.color.setHex(0xff9922); }
    }
  });

  canvas.addEventListener('mousemove',e=>{
    if(dragging) return;
    const rect=canvas.getBoundingClientRect();
    const cW=renderer.domElement.width/window.devicePixelRatio;
    const cH=renderer.domElement.height/window.devicePixelRatio;
    const mouse=new THREE.Vector2(((e.clientX-rect.left)/cW)*2-1,-((e.clientY-rect.top)/cH)*2+1);
    raycaster.setFromCamera(mouse,camera);
    const pinHits=pinMeshes.length>0?raycaster.intersectObjects(pinMeshes):[];
    const label=document.getElementById('pinLabel');
    if(pinHits.length>0){
      canvas.style.cursor='pointer';
      if(label&&LOCATE_GRAVE){
        label.classList.add('show');
        document.getElementById('pinLabelName').textContent=LOCATE_GRAVE.name;
        document.getElementById('pinLabelPlot').textContent='Plot '+LOCATE_GRAVE.plot+' · Sec. '+LOCATE_GRAVE.section;
        label.style.left=(e.clientX-rect.left)+'px';
        label.style.top=(e.clientY-rect.top-10)+'px';
      }
    } else {
      canvas.style.cursor='grab';
      if(label) label.classList.remove('show');
    }
  });
}

function updateCam(){if(!camera)return;camera.position.set(camTarget.x+camR*Math.sin(camPhi)*Math.cos(camTheta),camTarget.y+camR*Math.cos(camPhi),camTarget.z+camR*Math.sin(camPhi)*Math.sin(camTheta));camera.lookAt(camTarget.x,camTarget.y,camTarget.z);}

let _pinT=0;
function renderLoop(){
  rafId=requestAnimationFrame(renderLoop);
  if(renderer&&scene&&camera){
    _pinT+=0.032;
    if(window._pinHeadGroup){
      // Gentle float above the headstone — only moves slightly up/down
      const bounce=Math.sin(_pinT*1.6)*0.12;
      window._pinHeadGroup.position.y=window._pinHeadGroup.userData.baseY+bounce;
      // Billboard: pin always faces camera
      window._pinHeadGroup.lookAt(camera.position);
      // Gentle scale pulse
      const ps=1+Math.sin(_pinT*2.2)*0.05;
      window._pinHeadGroup.scale.set(ps,ps,ps);
    }
    if(window._pinRing){
      const s=1+Math.sin(_pinT*0.9)*0.15;
      window._pinRing.scale.set(s,s,1);
      window._pinRing.material.opacity=0.2+Math.sin(_pinT*0.9)*0.2;
    }
    renderer.render(scene,camera);
  }
}

function setCamera(mode,btn){
  document.querySelectorAll('#tb-persp,#tb-top,#tb-iso').forEach(b=>b.classList.remove('on')); btn.classList.add('on');
  if(mode==='perspective'){camTheta=Math.PI/5;camPhi=Math.PI/3.2;camR=22;}
  else if(mode==='top'){camTheta=Math.PI/4;camPhi=0.06;camR=28;}
  else if(mode==='isometric'){camTheta=Math.PI/6;camPhi=Math.PI/4.5;camR=32;}
  if(LOCATE_GRAVE&&targetPlotMesh){camTarget.x=targetPlotMesh.position.x*0.4;camTarget.z=targetPlotMesh.position.z*0.4;}
  else{camTarget={x:0,y:0,z:0};}
  updateCam();
}

function toggleLayer(layer,btn){
  btn.classList.toggle('on');
  if(layer==='occupied') showOcc=!showOcc;
  if(layer==='available') showAvail=!showAvail;
  if(layer==='paths') showPaths=!showPaths;
  if(!activeCem||!scene) return;
  document.getElementById('loader').classList.remove('hide');
  const toRemove=[]; scene.traverse(o=>{if(o.type==='Mesh')toRemove.push(o);}); toRemove.forEach(o=>{if(o.geometry)o.geometry.dispose();if(o.material)o.material.dispose();scene.remove(o);});
  plotMeshes=[];pinMeshes=[];targetPlotMesh=null;
  buildScene(CEMETERIES[activeCem]);
  if(LOCATE_GRAVE&&targetPlotMesh){setTimeout(()=>{flyToTarget();},200);}
  setTimeout(()=>document.getElementById('loader').classList.add('hide'),350);
}

/* ============================================================
   CARD ROTATION (Disabled)
============================================================ */
  document.getElementById('gpDied').textContent    = fmtDate(grave.died);
  document.getElementById('gpAge').textContent     = 'Age ' + (grave.age||'—');
  document.getElementById('gpCause').textContent   = grave.cause    || '—';
  document.getElementById('gpReligion').textContent= grave.religion || '—';
  document.getElementById('gpNat').textContent     = grave.nationality || '—';
  document.getElementById('gpKin').textContent     = grave.kin      || '—';
  document.getElementById('gpContact').textContent = grave.contact  || '—';
  document.getElementById('tombBadge').textContent = 'Plot ' + (grave.plot||'—');
  document.getElementById('gravePopupOverlay').classList.add('show');
  startTombPreview();
  showGraveDetailPanel(grave);
}

function startTombPreview() {
  if(tombRafId){ cancelAnimationFrame(tombRafId); tombRafId=null; }
  if(tombRenderer){ tombRenderer.dispose(); tombRenderer=null; }
  const tc=document.getElementById('tombCanvas');
  if(!tc) return;
  const W=tc.offsetWidth||400, H=tc.offsetHeight||180;
  tombRenderer=new THREE.WebGLRenderer({canvas:tc,antialias:true,alpha:false});
  tombRenderer.setSize(W,H,false);
  tombRenderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  tombRenderer.shadowMap.enabled=true;
  const ts=buildTombScene(LOCATE_GRAVE);
  const tc2=new THREE.PerspectiveCamera(48,W/H,0.1,30);
  let tTheta=2.4,tPhi=1.05,tR=3.2;
  const tTarget={x:0,y:0.4,z:-0.3};
  tc2.position.set(tTarget.x+tR*Math.sin(tPhi)*Math.cos(tTheta),tTarget.y+tR*Math.cos(tPhi),tTarget.z+tR*Math.sin(tPhi)*Math.sin(tTheta));
  tc2.lookAt(tTarget.x,tTarget.y,tTarget.z);
  let tT=0;
  function tombLoop(){
    tombRafId=requestAnimationFrame(tombLoop);
    tT+=0.008; tTheta=2.4+Math.sin(tT)*0.4;
    tc2.position.set(tTarget.x+tR*Math.sin(tPhi)*Math.cos(tTheta),tTarget.y+tR*Math.cos(tPhi),tTarget.z+tR*Math.sin(tPhi)*Math.sin(tTheta));
    tc2.lookAt(tTarget.x,tTarget.y,tTarget.z);
    tombRenderer.render(ts,tc2);
  }
  tombRafId=requestAnimationFrame(tombLoop);
}

function closeGravePopup() {
  document.getElementById('gravePopupOverlay').classList.remove('show');
  if(tombRafId){ cancelAnimationFrame(tombRafId); tombRafId=null; }
  if(tombRenderer){ tombRenderer.dispose(); tombRenderer=null; }
}

document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeGravePopup(); });

function showGraveDetailPanel(g) {
  const slot=document.getElementById('graveDetailSlot');
  const fmtDate=d=>{ try{return new Date(d).toLocaleDateString('en-PH',{year:'numeric',month:'long',day:'numeric'});}catch(e){return d;} };
  slot.innerHTML=
    '<div class="grave-detail-card">'+
      '<div class="gd-plot">&#128205; Plot '+g.plot+' &middot; Section '+g.section+'</div>'+
      '<div class="gd-name">'+g.name+'</div>'+
      '<div class="gd-dates">'+fmtDate(g.born)+' &mdash; '+fmtDate(g.died)+' &middot; Age '+g.age+'</div>'+
      '<div class="gd-grid">'+
        '<div><div class="gd-field-label">Cause of Death</div><div class="gd-field-val">'+g.cause+'</div></div>'+
        '<div><div class="gd-field-label">Religion</div><div class="gd-field-val">'+g.religion+'</div></div>'+
        '<div><div class="gd-field-label">Nationality</div><div class="gd-field-val">'+g.nationality+'</div></div>'+
        '<div><div class="gd-field-label">Next of Kin</div><div class="gd-field-val">'+g.kin+'</div></div>'+
        '<div style="grid-column:span 2"><div class="gd-field-label">Contact</div><div class="gd-field-val">'+g.contact+'</div></div>'+
      '</div>'+
      '<a class="gd-back-btn" href="cemetery-management.html">'+
        '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>'+
        'Back to Portal'+
      '</a>'+
    '</div>';
  document.getElementById('v3InfoBody').scrollTop=0;
}

/* ============================================================
   CONTROLS (unchanged)
============================================================ */
function bindControls(canvas, W, H) {
  const raycaster=new THREE.Raycaster();
  canvas.addEventListener('mousedown',e=>{dragging=true;rightDrag=e.button===2;lastMouse={x:e.clientX,y:e.clientY};});
  canvas.addEventListener('mousemove',e=>{
    if(!dragging) return;
    const dx=e.clientX-lastMouse.x,dy=e.clientY-lastMouse.y;
    if(rightDrag){camTarget.x-=Math.sin(camTheta)*dx*0.03;camTarget.z-=Math.cos(camTheta)*dx*0.03;camTarget.y+=dy*0.03;}
    else{camTheta-=dx*0.007;camPhi=Math.max(0.18,Math.min(Math.PI/2.05,camPhi-dy*0.007));}
    lastMouse={x:e.clientX,y:e.clientY}; updateCam();
  });
  window.addEventListener('mouseup',()=>dragging=false);
  canvas.addEventListener('contextmenu',e=>e.preventDefault());
  canvas.addEventListener('wheel',e=>{camR=Math.max(4,Math.min(55,camR+e.deltaY*0.035));updateCam();e.preventDefault();},{passive:false});

  let lTouch=null;
  canvas.addEventListener('touchstart',e=>{lTouch={x:e.touches[0].clientX,y:e.touches[0].clientY};});
  canvas.addEventListener('touchmove',e=>{if(!lTouch)return;camTheta-=(e.touches[0].clientX-lTouch.x)*0.009;camPhi=Math.max(0.18,Math.min(Math.PI/2.05,camPhi-(e.touches[0].clientY-lTouch.y)*0.009));lTouch={x:e.touches[0].clientX,y:e.touches[0].clientY};updateCam();e.preventDefault();},{passive:false});

  let mouseDownPos={x:0,y:0};
  canvas.addEventListener('mousedown',e=>{mouseDownPos={x:e.clientX,y:e.clientY};});
  canvas.addEventListener('mouseup',e=>{
    if(Math.hypot(e.clientX-mouseDownPos.x,e.clientY-mouseDownPos.y)>6) return;
    const rect=canvas.getBoundingClientRect();
    const cW=renderer.domElement.width/window.devicePixelRatio;
    const cH=renderer.domElement.height/window.devicePixelRatio;
    const mouse=new THREE.Vector2(((e.clientX-rect.left)/cW)*2-1,-((e.clientY-rect.top)/cH)*2+1);
    raycaster.setFromCamera(mouse,camera);
    if(pinMeshes.length>0){
      const pinHits=raycaster.intersectObjects(pinMeshes);
      if(pinHits.length>0){
        const gd=pinHits[0].object.userData.graveData;
        if(gd){ showGravePopup(gd); flyToTarget(); return; }
      }
    }
    const hits=raycaster.intersectObjects(plotMeshes);
    plotMeshes.forEach(m=>{ if(!m.userData.isTarget) m.material.color.setHex(m.userData.origColor); });
    if(hits.length>0){
      const hit=hits[0].object;
      if(hit.userData.isTarget&&hit.userData.graveData){ showGravePopup(hit.userData.graveData); flyToTarget(); }
      else if(!hit.userData.isTarget){ hit.material.color.setHex(0xff9922); }
    }
  });

  canvas.addEventListener('mousemove',e=>{
    if(dragging) return;
    const rect=canvas.getBoundingClientRect();
    const cW=renderer.domElement.width/window.devicePixelRatio;
    const cH=renderer.domElement.height/window.devicePixelRatio;
    const mouse=new THREE.Vector2(((e.clientX-rect.left)/cW)*2-1,-((e.clientY-rect.top)/cH)*2+1);
    raycaster.setFromCamera(mouse,camera);
    const pinHits=pinMeshes.length>0?raycaster.intersectObjects(pinMeshes):[];
    const label=document.getElementById('pinLabel');
    if(pinHits.length>0){
      canvas.style.cursor='pointer';
      if(label&&LOCATE_GRAVE){
        label.classList.add('show');
        document.getElementById('pinLabelName').textContent=LOCATE_GRAVE.name;
        document.getElementById('pinLabelPlot').textContent='Plot '+LOCATE_GRAVE.plot+' · Sec. '+LOCATE_GRAVE.section;
        label.style.left=(e.clientX-rect.left)+'px';
        label.style.top=(e.clientY-rect.top-10)+'px';
      }
    } else {
      canvas.style.cursor='grab';
      if(label) label.classList.remove('show');
    }
  });
}

function updateCam(){if(!camera)return;camera.position.set(camTarget.x+camR*Math.sin(camPhi)*Math.cos(camTheta),camTarget.y+camR*Math.cos(camPhi),camTarget.z+camR*Math.sin(camPhi)*Math.sin(camTheta));camera.lookAt(camTarget.x,camTarget.y,camTarget.z);}

let _pinT=0;
function renderLoop(){
  rafId=requestAnimationFrame(renderLoop);
  if(renderer&&scene&&camera){
    _pinT+=0.032;
    if(window._pinHeadGroup){
      // Gentle float above the headstone — only moves slightly up/down
      const bounce=Math.sin(_pinT*1.6)*0.12;
      window._pinHeadGroup.position.y=window._pinHeadGroup.userData.baseY+bounce;
      // Billboard: pin always faces camera
      window._pinHeadGroup.lookAt(camera.position);
      // Gentle scale pulse
      const ps=1+Math.sin(_pinT*2.2)*0.05;
      window._pinHeadGroup.scale.set(ps,ps,ps);
    }
    if(window._pinRing){
      const s=1+Math.sin(_pinT*0.9)*0.15;
      window._pinRing.scale.set(s,s,1);
      window._pinRing.material.opacity=0.2+Math.sin(_pinT*0.9)*0.2;
    }
    renderer.render(scene,camera);
  }
}

function setCamera(mode,btn){
  document.querySelectorAll('#tb-persp,#tb-top,#tb-iso').forEach(b=>b.classList.remove('on')); btn.classList.add('on');
  if(mode==='perspective'){camTheta=Math.PI/5;camPhi=Math.PI/3.2;camR=22;}
  else if(mode==='top'){camTheta=Math.PI/4;camPhi=0.06;camR=28;}
  else if(mode==='isometric'){camTheta=Math.PI/6;camPhi=Math.PI/4.5;camR=32;}
  if(LOCATE_GRAVE&&targetPlotMesh){camTarget.x=targetPlotMesh.position.x*0.4;camTarget.z=targetPlotMesh.position.z*0.4;}
  else{camTarget={x:0,y:0,z:0};}
  updateCam();
}

function toggleLayer(layer,btn){
  btn.classList.toggle('on');
  if(layer==='occupied') showOcc=!showOcc;
  if(layer==='available') showAvail=!showAvail;
  if(layer==='paths') showPaths=!showPaths;
  if(!activeCem||!scene) return;
  document.getElementById('loader').classList.remove('hide');
  const toRemove=[]; scene.traverse(o=>{if(o.type==='Mesh')toRemove.push(o);}); toRemove.forEach(o=>{if(o.geometry)o.geometry.dispose();if(o.material)o.material.dispose();scene.remove(o);});
  plotMeshes=[];pinMeshes=[];targetPlotMesh=null;
  buildScene(CEMETERIES[activeCem]);
  if(LOCATE_GRAVE&&targetPlotMesh){setTimeout(()=>{flyToTarget();},200);}
  setTimeout(()=>document.getElementById('loader').classList.add('hide'),350);
}

/* ============================================================
   CARD ROTATION (Disabled)
============================================================ */
// Card rotation disabled to keep Public Cemetery as the main available map

/* ============================================================
   INIT (unchanged)
============================================================ */
window.initMapping = () => {
  loadLocateGrave();
  setTimeout(initPreviews,120);
  if(LOCATE_GRAVE){
    setTimeout(()=>{ openView('public'); },400);
  }
};
window.openView = openView;
window._realOpenView = openView;
window.closeView = closeView;
window._realCloseView = closeView;
window.setCamera = setCamera;
window._realSetCamera = setCamera;
window.toggleLayer = toggleLayer;
window._realToggleLayer = toggleLayer;
window.flyToTarget = flyToTarget;
window._realFlyToTarget = flyToTarget;
window.showGravePopup = showGravePopup;
window._realShowGravePopup = showGravePopup;
window.closeGravePopup = closeGravePopup;
window._realCloseGravePopup = closeGravePopup;