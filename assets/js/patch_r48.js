
// patch r48: lock toggle & layout fit without touching existing main.js
(function(){
  function addLockButton(){
    const card = document.querySelector('.basic-card');
    if(!card) return;
    if(document.getElementById('lockUpdateBtn')) return;

    const updatedBy = card.querySelector('#updatedBy');
    if(!updatedBy) return;

    const wrap = document.createElement('div');
    wrap.className = 'inline-with-btn';
    updatedBy.parentNode.insertBefore(wrap, updatedBy);
    wrap.appendChild(updatedBy);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'lockUpdateBtn';
    btn.className = 'btn lock-btn';
    btn.textContent = '更新ロック';
    wrap.appendChild(btn);

    btn.addEventListener('click', ()=>{
      const locked = card.classList.toggle('locked');
      btn.classList.toggle('locked', locked);
      btn.textContent = locked ? '確定済み' : '更新ロック';
      card.querySelectorAll('input,select,textarea,button').forEach(el=>{
        if(el === btn) return;
        if(el.id === 'lockUpdateBtn') return;
        el.disabled = locked;
      });
      btn.disabled = false;
    });
  }

  function layoutFitPatch(){
    const tabsCard = document.getElementById('main-tabs')?.parentElement || document.querySelector('.card');
    if(!tabsCard) return;
    const top = tabsCard.getBoundingClientRect().top;
    const gap = 8, bottomPad = 10;
    const available = window.innerHeight - top - bottomPad;
    tabsCard.style.height = available+'px';

    const upper = document.querySelector('.order-upper');
    const lower = document.querySelector('.order-lower');
    if(upper && lower){
      const basic = document.querySelector('.basic-card');
      let desiredUpper = Math.max(160, Math.floor(available * 0.46));
      if(basic){
        const hd = basic.querySelector('.hd')?.offsetHeight || 0;
        const active = basic.querySelector('.bd .bi-panel.active') || basic.querySelector('.bd');
        const inner = active ? active.scrollHeight : 0;
        desiredUpper = hd + inner + 28; // swallow inner scroll
      }
      const lowerMin = 260;
      const maxUpper = available - lowerMin - gap;
      const upperH = Math.min(Math.max(desiredUpper, 200), Math.max(220, maxUpper));
      upper.style.height = upperH+'px';
      lower.style.height = (available - upperH - gap)+'px';
    }

    const cm = document.getElementById('cmDesigner') || document.querySelector('.cm-designer');
    if(cm){
      cm.style.height = (available - gap)+'px';
    }
  }

  window.addEventListener('resize', ()=>{ layoutFitPatch(); });
  document.addEventListener('DOMContentLoaded', ()=>{
    addLockButton();
    layoutFitPatch();
    // re-fit after basic info inner tab click
    document.addEventListener('click', (e)=>{
      if(e.target.closest('#bi-tabs button')){ setTimeout(layoutFitPatch, 0); }
    });
  });
})();
