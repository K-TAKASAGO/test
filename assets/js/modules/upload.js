
export function initUpload(){
  const dz = document.getElementById('dropzone');
  const fi = document.getElementById('fileInput');
  const thumbs = document.getElementById('thumbs');
  if(!dz || !fi || !thumbs) return;

  function addFile(file){
    const url = URL.createObjectURL(file);
    const el = document.createElement('div');
    el.className='thumb';
    el.innerHTML = `<img src="${url}" alt=""><div class="meta"><span>${file.name}</span><button class="btn small">削除</button></div>`;
    el.querySelector('button').onclick = ()=>el.remove();
    thumbs.appendChild(el);
  }
  dz.addEventListener('click', ()=>fi.click());
  dz.addEventListener('dragover', e=>{e.preventDefault(); dz.style.background='#f8fbff'});
  dz.addEventListener('dragleave', ()=>dz.style.background='');
  dz.addEventListener('drop', e=>{
    e.preventDefault(); dz.style.background='';
    [...e.dataTransfer.files].forEach(addFile);
  });
  fi.addEventListener('change', ()=>{
    [...fi.files].forEach(addFile); fi.value='';
  });
}
