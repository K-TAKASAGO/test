
import { initBasicInfo } from './modules/basic_info.js';
import { initUpload }    from './modules/upload.js';
import { initDetails }   from './modules/order_details.js';
import { initCasemark }  from './modules/casemark.js';

// Tab switching for main content
const tabNav = document.getElementById('main-tabs');
if (tabNav){
  tabNav.addEventListener('click', e => {
    const btn = e.target.closest('.tab-btn'); if(!btn) return;
    [...tabNav.querySelectorAll('.tab-btn')].forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const target = btn.dataset.target;
    document.querySelectorAll('.panel').forEach(p=>p.classList.toggle('active', p.id===target));
  });
}

// Init sub modules after DOM ready
window.addEventListener('DOMContentLoaded', () => {
  initBasicInfo();
  initUpload();
  initDetails();
  initCasemark();
});

// Dummy actions
document.addEventListener('click', e=>{
  const a = e.target.closest('[data-action]'); if(!a) return;
  const act = a.dataset.action;
  alert(`アクション: ${act}（ダミー）`);
});
