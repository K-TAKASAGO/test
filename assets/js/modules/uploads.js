export function initUploads(){
  const fileInput = document.getElementById('fileInput');
  const drop = document.getElementById('dropzone');
  const thumbs = document.getElementById('thumbs');
  if(!drop || !thumbs) return;

  const showFiles = (files)=>{
    [...files].forEach(f=>{
      const url = URL.createObjectURL(f);
      const el = document.createElement('div');
      el.className='thumb';
      const isImg = f.type.startsWith('image/');
      el.innerHTML = `<img src="${isImg?url:''}" alt=""><div class="meta"><span>${f.name.slice(0,18)}</span><span>${Math.round(f.size/1024)} KB</span></div>`;
      thumbs.appendChild(el);
    });
  };

  drop.addEventListener('click', ()=> fileInput.click());
  drop.addEventListener('dragover', e=>{ e.preventDefault(); drop.style.background='#eef6ff'; });
  drop.addEventListener('dragleave', ()=> drop.style.background='');
  drop.addEventListener('drop', e=>{ e.preventDefault(); drop.style.background=''; showFiles(e.dataTransfer.files); });
  fileInput?.addEventListener('change', e=> showFiles(e.target.files));
}
