const categoriesList=[
"Hortifrúti","Açougue e Peixaria","Laticínios","Padaria",
"Bebidas","Limpeza","Higiene","Pet Shop","Grãos","Outros"
];

let data={}, history=JSON.parse(localStorage.getItem("history")||"[]");

const catBox=document.getElementById("categories");
const totalEl=document.getElementById("grandTotal");
const modal=document.getElementById("modal");

categoriesList.forEach(c=>{
  data[c]=[];
  catBox.innerHTML+=`
  <div class="category">
    <h2 onclick="toggleCat(this)">${c} <span>➖</span></h2>
    <div class="items" data-cat="${c}"></div>
  </div>`;
  modalCategory.innerHTML+=`<option>${c}</option>`;
});

function toggleCat(el){
  const items=el.nextElementSibling;
  items.style.display=items.style.display==="none"?"block":"none";
}

function toggleFab(){
  document.querySelector(".fab").classList.toggle("open");
}

function openModal(){
  modal.classList.add("show");
  toggleFab();
}
function closeModal(){ modal.classList.remove("show"); }

function confirmAdd(){
  const cat=modalCategory.value;
  const name=modalName.value;
  const qty=+modalQty.value;
  const unit=modalUnit.value;
  const price=+modalPrice.value;

  if(!name) return alert("Informe o nome");

  data[cat].push({name,qty,unit,price});
  closeModal();
  render();
}

function render(){
  document.querySelectorAll(".items").forEach(box=>{
    const cat=box.dataset.cat;
    box.innerHTML="";
    data[cat].forEach((i,idx)=>{
      box.innerHTML+=`
      <div class="item">
        <input value="${i.name}" onchange="edit('${cat}',${idx},'name',this.value)">
        <input type="number" value="${i.qty}" onchange="edit('${cat}',${idx},'qty',this.value)">
        <select onchange="edit('${cat}',${idx},'unit',this.value)">
          ${["kg","g","L","mL","UN","PC"].map(u=>`<option ${i.unit===u?"selected":""}>${u}</option>`).join("")}
        </select>
        <input type="number" value="${i.price}" onchange="edit('${cat}',${idx},'price',this.value)">
        <button class="remove" onclick="removeItem('${cat}',${idx})">❌</button>
      </div>`;
    });
  });
  calcTotal();
}

function edit(cat,i,f,v){
  data[cat][i][f]=v;
  calcTotal();
}

function removeItem(cat,i){
  data[cat].splice(i,1);
  render();
}

function calcTotal(){
  let t=0;
  Object.values(data).forEach(c=>c.forEach(i=>t+=i.qty*i.price));
  totalEl.textContent=t.toFixed(2);
}

function saveList(){
  const name=prompt("Nome da lista:");
  if(!name)return;
  history.push({name,date:new Date().toLocaleString(),data:JSON.parse(JSON.stringify(data))});
  localStorage.setItem("history",JSON.stringify(history));
}

function toggleHistory(){
  const box=historyBox;
  historyList.innerHTML="";
  history.forEach(h=>{
    const b=document.createElement("button");
    b.textContent=`${h.name} - ${h.date}`;
    b.onclick=()=>{
      data=JSON.parse(JSON.stringify(h.data));
      render();
      toggleHistory();
    };
    historyList.appendChild(b);
  });
  box.classList.toggle("show");
}

function shareList(){
  let txt="Lista de Compras\n";
  Object.entries(data).forEach(([c,it])=>{
    if(it.length){
      txt+=`\n${c}\n`;
      it.forEach(i=>txt+=`${i.name} - ${i.qty} ${i.unit} x R$ ${i.price}\n`);
    }
  });
  navigator.share?navigator.share({text:txt}):alert(txt);
}

function copyText(){
  navigator.clipboard.writeText(totalEl.textContent);
}

function printList(){
  window.print();
}

render();
