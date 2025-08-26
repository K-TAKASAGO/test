
// casemark.js r108
// Drop-in replacement. Handles orientation (A4 横/縦), guides, element list re-order, canvas drag, and mini preview sync.
// Exports: initCasemark

export function initCasemark(root=document) {
  // ---- DOM refs (find if present) ----
  const svg = root.querySelector('#svg');
  const svgG = root.querySelector('#svgG');
  const guidesG = root.querySelector('#guides');
  const selectionG = root.querySelector('#selection');
  const listBox = root.querySelector('#elemList') || root.querySelector('[data-elem-list]');
  const alignBox = root.querySelector('#p-align');
  const addT = root.querySelector('#addT');
  const addR = root.querySelector('#addR');
  const addDsm = root.querySelector('#addD-sm');
  const addDlg = root.querySelector('#addD-lg');
  const autoBtn = root.querySelector('#auto-arrange-btn');
  const a4Seg = root.querySelector('#a4seg');

  // mini preview (if exists in page)
  const miniSvg = root.querySelector('#mini-svg');
  const miniG = root.querySelector('#mini-svgG');
  const miniGuides = root.querySelector('#mini-guides');

  if(!svg || !svgG || !guidesG || !selectionG) {
    console.warn('[casemark] svg containers not found');
    return;
  }

  // ---- State ----
  let elems = [];           // {type, x,y,w,h,font,align,text}
  let sel = -1;
  let drag = null;
  let orientation = 'land'; // 'land' | 'port'

  // ---- Utils ----
  const $ = (s, el = root) => el.querySelector(s);
  const $$ = (s, el = root) => Array.from(el.querySelectorAll(s));
  Element.prototype.setAttrs = function(obj){ for (const k in obj) this.setAttribute(k, obj[k]); };

  function currentBox() {
    // returns {w,h}
    const vb = svg.viewBox.baseVal;
    return { w: vb.width || 297, h: vb.height || 210 };
  }

  function setOrientation(mode) {
    orientation = mode === 'port' ? 'port' : 'land';
    const isLand = orientation === 'land';
    svg.setAttribute('viewBox', isLand ? '0 0 297 210' : '0 0 210 297');
    if (miniSvg) miniSvg.setAttribute('viewBox', isLand ? '0 0 297 210' : '0 0 210 297');

    // Update clip-path references if they exist
    try {
      $('#svgG').setAttribute('clip-path', isLand ? 'url(#pageClipLand)' : 'url(#pageClipPort)');
      $('#selection').setAttribute('clip-path', isLand ? 'url(#pageClipLand)' : 'url(#pageClipPort)');
      if (miniG) miniG.setAttribute('clip-path', isLand ? 'url(#miniPageClipLand)' : 'url(#miniPageClipPort)');
    } catch(e){}

    drawGuides();
    draw(); // will also refresh mini preview
  }

  function drawGuides() {
    const {w,h} = currentBox();
    const pad = 10;
    const gw = w - pad*2, gh = h - pad*2;
    // Outer dashed rect and center cross
    const content = [
      `<rect x="${pad}" y="${pad}" width="${gw}" height="${gh}" fill="none" stroke="#9db0d1" stroke-width="0.8" stroke-dasharray="6 6"/>`,
      `<line x1="${w/2}" y1="${pad}" x2="${w/2}" y2="${h-pad}" stroke="#9db0d133" stroke-width="0.8" stroke-dasharray="6 6"/>`,
      `<line x1="${pad}" y1="${h/2}" x2="${w-pad}" y2="${h/2}" stroke="#9db0d133" stroke-width="0.8" stroke-dasharray="6 6"/>`,
    ].join('');
    guidesG.innerHTML = content;
    if (miniGuides) miniGuides.innerHTML = content; // mirror for mini preview if present
  }

  // ---- Rendering ----
  function textNode(e, i) {
    const a = e.align || 'start';
    const fs = e.font || 16;
    const x = e.x ?? 20;
    const y = e.y ?? 20;
    const s = e.text ?? '新規テキスト';
    return `<text data-index="${i}" x="${x}" y="${y}" font-size="${fs}" font-family="Arial, sans-serif" dominant-baseline="middle" text-anchor="${a}">${escapeXML(s)}</text>`;
  }
  function rectNode(e, i) {
    const x = e.x || 100, y = e.y || 60, w = e.w || 80, h = e.h || 40;
    return `<rect data-index="${i}" x="${x - w/2}" y="${y - h/2}" width="${w}" height="${h}" fill="none" stroke="#111827" stroke-width="0.9" />`;
  }
  function diamondNode(e, i) {
    const x = e.x || 105, y = e.y || 40, w = e.w || 250, h = e.h || 100;
    const pts = `${x},${y-h/2} ${x+w/2},${y} ${x},${y+h/2} ${x-w/2},${y}`;
    return `<polygon data-index="${i}" points="${pts}" fill="none" stroke="#111827" stroke-width="0.9" />`;
  }
  function nodeFor(e, i) {
    if (e.type === 'text') return textNode(e, i);
    if (e.type === 'rect') return rectNode(e, i);
    return diamondNode(e, i);
  }

  function draw() {
    const html = elems.map((e,i)=> nodeFor(e,i)).join('');
    svgG.innerHTML = html;
    updateSelectionBox();
    updateMini();
  }

  function updateMini() {
    if (!miniG) return;
    miniG.innerHTML = svgG.innerHTML;
  }

  function updateSelectionBox() {
    selectionG.innerHTML = '';
    if (sel < 0 || !elems[sel]) return;
    const target = svgG.querySelector(`[data-index="${sel}"]`);
    if (!target) return;
    const bb = target.getBBox();
    const r = document.createElementNS('http://www.w3.org/2000/svg','rect');
    r.setAttrs({
      x: bb.x - 2, y: bb.y - 2, width: bb.width + 4, height: bb.height + 4,
      fill: 'none', stroke: '#1c7df0', 'stroke-width': 1, 'stroke-dasharray': '4 3'
    });
    selectionG.appendChild(r);
  }

  function renderList() {
    if (!listBox) return;
    listBox.innerHTML = '';
    elems.forEach((e, i) => {
      const item = document.createElement('div');
      item.className = 'elem-item';
      item.draggable = true;
      item.dataset.index = i;
      item.style.display = 'flex';
      item.style.alignItems = 'center';
      item.style.gap = '8px';
      item.style.padding = '6px 8px';
      item.style.border = '1px solid var(--line, #e6e9f1)';
      item.style.borderRadius = '10px';
      item.style.background = '#fff';

      const dot = document.createElement('span');
      dot.style.width = '8px'; dot.style.height = '8px'; dot.style.borderRadius = '50%';
      dot.style.background = i === sel ? '#1c7df0' : '#94a3b8';
      item.appendChild(dot);

      const labelWrap = document.createElement('div');
      labelWrap.style.flex = '1'; labelWrap.style.minWidth = '0';

      if (e.type === 'text') {
        const input = document.createElement('input');
        input.className = 'txt';
        input.value = e.text || '新規テキスト';
        input.style.width = '100%';
        input.addEventListener('input', () => { e.text = input.value; draw(); });
        labelWrap.appendChild(input);
      } else if (e.type === 'rect') {
        labelWrap.textContent = `▭ ${e.w||80}×${e.h||40}`;
      } else {
        labelWrap.textContent = `◇ ${e.w||250}×${e.h||100}`;
      }
      item.appendChild(labelWrap);

      const del = document.createElement('button');
      del.textContent = '削除';
      del.className = 'btn';
      del.addEventListener('click', (ev)=>{
        ev.stopPropagation();
        if (sel === i) sel = -1;
        elems.splice(i,1);
        renderList(); draw();
      });
      item.appendChild(del);

      item.addEventListener('click', ()=>{ sel = i; renderList(); draw(); });

      // DnD
      item.addEventListener('dragstart', ev => {
        ev.dataTransfer.setData('text/plain', String(i));
        item.style.opacity = '0.5';
      });
      item.addEventListener('dragend', ()=> item.style.opacity = '');
      item.addEventListener('dragover', ev => ev.preventDefault());
      item.addEventListener('drop', ev => {
        ev.preventDefault();
        const from = Number(ev.dataTransfer.getData('text/plain'));
        const to = Number(item.dataset.index);
        if (Number.isNaN(from) || Number.isNaN(to) || from === to) return;
        const moved = elems.splice(from,1)[0];
        elems.splice(to,0,moved);
        sel = to;
        renderList(); draw();
      });

      listBox.appendChild(item);
    });
  }

  // ---- Events ----
  function addText() {
    const {w,h} = currentBox();
    elems.push({type:'text', text:'新規テキスト', x: (w*0.6), y: (h*0.12), font: 24, align: 'start'});
    sel = elems.length - 1; renderList(); draw();
  }
  function addRect() {
    const {w,h} = currentBox();
    elems.push({type:'rect', x: w/2, y: h/2, w: 80, h: 40});
    sel = elems.length - 1; renderList(); draw();
  }
  function addDiamondSmall() {
    const {w} = currentBox();
    elems.push({type:'diamond', x:w/2, y: 40, w: 250, h:100});
    sel = elems.length - 1; renderList(); draw();
  }
  function addDiamondLarge() {
    const {w,h} = currentBox();
    elems.push({type:'diamond', x:w/2, y:h/2, w:250, h:189});
    sel = elems.length - 1; renderList(); draw();
  }
  function autoArrange() {
    if (elems.length === 0) return;
    const {w} = currentBox();
    let y = 30;
    elems.forEach(e => {
      const h = e.type === 'text' ? (e.font||16)*0.9 : (e.h||40);
      e.x = w/2;
      e.y = y + h/2;
      if (e.type === 'text') e.align = 'middle';
      y += h + 10;
    });
    draw(); renderList();
  }

  svg.addEventListener('mousedown', e => {
    const t = e.target.closest('[data-index]');
    if (!t) { sel = -1; renderList(); draw(); return; }
    sel = Number(t.dataset.index); renderList();
    const pt = getPoint(e);
    const el = elems[sel];
    drag = { sx: pt.x, sy: pt.y, ox: el.x || 0, oy: el.y || 0 };
  });
  root.addEventListener('mousemove', e => {
    if (!drag || sel < 0) return;
    const pt = getPoint(e);
    elems[sel].x = drag.ox + (pt.x - drag.sx);
    elems[sel].y = drag.oy + (pt.y - drag.sy);
    draw(); // selection box follows
  });
  root.addEventListener('mouseup', ()=> drag = null);

  function getPoint(evt) {
    const p = svg.createSVGPoint();
    p.x = evt.clientX; p.y = evt.clientY;
    return p.matrixTransform(svg.getScreenCTM().inverse());
  }

  if (alignBox) {
    alignBox.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b || sel < 0) return;
      if (elems[sel].type !== 'text') return;
      elems[sel].align = b.dataset.align;
      draw(); renderList();
    });
  }

  if (addT) addT.addEventListener('click', addText);
  if (addR) addR.addEventListener('click', addRect);
  if (addDsm) addDsm.addEventListener('click', addDiamondSmall);
  if (addDlg) addDlg.addEventListener('click', addDiamondLarge);
  if (autoBtn) autoBtn.addEventListener('click', autoArrange);

  if (a4Seg) {
    a4Seg.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      $$('#a4seg button').forEach(x => x.classList.toggle('active', x === b));
      setOrientation(b.dataset.o);
    });
  }

  // Initialize
  setOrientation('land'); // default
  // seed first text so users see something
  if (elems.length === 0) addText();

  // public API (optional: attach to window for debugging)
  return {
    addText, addRect, addDiamondSmall, addDiamondLarge,
    setOrientation, autoArrange, state:()=>({elems, sel, orientation})
  };
}

function escapeXML(s){ return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[m])); }
