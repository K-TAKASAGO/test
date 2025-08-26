
export function initDetails(){
  const tb = document.getElementById('details-tbody');
  const add = document.getElementById('addRow');
  if(!tb || !add) return;

  const nf = new Intl.NumberFormat('ja-JP');

  function row(){
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><button class="btn small del">×</button></td>
      <td class="num col-no">-</td>
      <td><select><option>確定</option><option>未確定</option></select></td>
      <td><select><option selected>課税</option><option>非課税</option></select></td>
      <td><input></td>
      <td><input></td>
      <td><input></td>
      <td><input></td>
      <td class="num"><input type="number" value="0"></td>
      <td class="num"><input type="number" value="0"></td>
      <td class="num"><input type="number" step="0.001" value="0"></td>
      <td><input></td>
      <td class="num"><input type="number" value="0"></td>
      <td class="num"><input type="number" value="0"></td>
      <td class="num"><input type="number" value="0"></td>
      <td class="num"><input type="number" value="1"></td>
      <td class="num stickyR amt">0</td>`;
    return tr;
  }

  function renum(){[...tb.children].forEach((tr,i)=>tr.querySelector('.col-no').textContent=i+1)}
  function calc(){
    let sub=0, taxbase=0;
    [...tb.children].forEach(tr=>{
      const qty = +tr.children[15].querySelector('input').value||0;
      const price = +tr.children[14].querySelector('input').value||0;
      const total = qty*price;
      tr.querySelector('.amt').textContent = nf.format(total);
      sub += total;
      if(tr.children[3].querySelector('select').value==='課税') taxbase += total;
    });
    const tax = Math.round(taxbase*0.1);
    document.getElementById('s-sub').textContent = nf.format(sub);
    document.getElementById('s-taxable').textContent = nf.format(taxbase);
    document.getElementById('s-tax').textContent = nf.format(tax);
    document.getElementById('s-grand').textContent = nf.format(sub+tax);
  }

  add.addEventListener('click', ()=>{ tb.appendChild(row()); renum(); calc(); });
  tb.addEventListener('input', calc);
  tb.addEventListener('click', e=>{
    const b = e.target.closest('.del'); if(!b) return;
    b.closest('tr').remove(); renum(); calc();
  });

  // seed 1 row
  add.click();
}
