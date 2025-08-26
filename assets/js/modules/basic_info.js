// basic_info.js (r104)
// Fix: 「項目 / 梱包指示」が切り替わらない環境に対応
//  - data-bi-panel="fields|pack" を優先。無ければ .bi-panel[data-panel] をフォールバック。
//  - main.js の named import `initBasicInfo` を提供。

function getPanels(root){
  let panels = Array.from(root.querySelectorAll('[data-bi-panel]'));
  if (panels.length) {
    return { mode:'bi', panels };
  }
  // fallback (旧構造)
  panels = Array.from(root.querySelectorAll('.bi-panel[data-panel]'));
  return { mode:'legacy', panels };
}

function showKey(root, key){
  const { mode, panels } = getPanels(root);
  if (mode === 'bi') {
    panels.forEach(p => {
      const t = p.getAttribute('data-bi-panel');
      p.style.display = (key==='fields')
        ? (t === 'fields' ? '' : 'none')
        : (t === 'pack'   ? '' : 'none');
    });
  } else {
    // legacy: 1面構造を想定（.bi-panel が1つ=pack）
    panels.forEach(p => p.classList.toggle('active', p.getAttribute('data-panel') === key));
  }
}

export function initBasicInfo(){
  const root = document.querySelector('.basic-card'); if(!root) return;
  const tabbar = root.querySelector('#bi-tabs, .tabbar');
  const buttons = tabbar ? Array.from(tabbar.querySelectorAll('button[data-t]')) : [];
  if (!buttons.length) return;

  const activate = (btn) => {
    buttons.forEach(b => {
      const on = (b===btn);
      b.classList.toggle('active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
      b.tabIndex = on ? 0 : -1;
    });
    showKey(root, btn.dataset.t);
  };

  // 初期：activeボタン→無ければfieldsに
  const initial = buttons.find(b => b.classList.contains('active')) || buttons.find(b => b.dataset.t==='fields') || buttons[0];
  activate(initial);

  buttons.forEach(btn => {
    const go = () => activate(btn);
    btn.addEventListener('click', e => { e.preventDefault(); go(); });
    btn.addEventListener('keydown', e => {
      if (e.key==='Enter' || e.key===' ') { e.preventDefault(); go(); }
    });
  });
}

// 互換エイリアス
export const initBasicInfoTabs = initBasicInfo;

// 安全のため自動初期化
document.addEventListener('DOMContentLoaded', () => { try{ initBasicInfo(); }catch(e){} });
