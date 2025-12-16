const categoriesList = [
  "Hortifrúti","Açougue e Peixaria","Laticínios","Padaria",
  "Bebidas","Limpeza","Higiene","Pet Shop","Grãos","Outros"
];

let data = {},
    history = JSON.parse(localStorage.getItem("history") || "[]");

const catBox = document.getElementById("categories");
const totalEl = document.getElementById("grandTotal");
const modal = document.getElementById("modal");
const menuLateral = document.getElementById("menu-lateral");

/* ---------- CRIA CATEGORIAS ---------- */
categoriesList.forEach(c => {
  data[c] = [];
  catBox.innerHTML += `
    <div class="category">
      <h2 onclick="toggleCat(this)">${c} <span>➖</span></h2>
      <div class="items" data-cat="${c}"></div>
    </div>`;
  modalCategory.innerHTML += `<option>${c}</option>`;
});

/* ---------- MENU LATERAL ---------- */
function toggleMenu(){
  menuLateral.classList.toggle("open");
}

function closeMenu(){
  menuLateral.classList.remove("open");
}

/* ---------- CATEGORIAS ---------- */
function toggleCat(el){
  const items = el.nextElementSibling;
  items.style.display = items.style.display === "none" ? "block" : "none";
}

/* ---------- MODAL ---------- */
function openModal(){
  modal.classList.add("show");
  closeMenu();
}

function closeModal(){
  modal.classList.remove("show");
}

function confirmAdd(){
  const cat = modalCategory.value;
  const name = modalName.value;
  const qty = +modalQty.value;
  const unit = modalUnit.value;
  const price = +modalPrice.value;

  if(!name) return alert("Informe o nome");

  data[cat].push({ name, qty, unit, price });
  closeModal();
  render();
}

/* ---------- RENDER ---------- */
function render(){
  document.querySelectorAll(".items").forEach(box => {
    const cat = box.dataset.cat;
    box.innerHTML = "";

    data[cat].forEach((i, idx) => {
      box.innerHTML += `
        <div class="item">
          <input value="${i.name}" onchange="edit('${cat}',${idx},'name',this.value)">
          <input type="number" value="${i.qty}" onchange="edit('${cat}',${idx},'qty',this.value)">
          <select onchange="edit('${cat}',${idx},'unit',this.value)">
            ${["kg","g","L","mL","UN","PC"].map(u =>
              `<option ${i.unit === u ? "selected" : ""}>${u}</option>`
            ).join("")}
          </select>
          <input type="number" value="${i.price}" onchange="edit('${cat}',${idx},'price',this.value)">
          <button class="remove" onclick="removeItem('${cat}',${idx})">❌</button>
        </div>`;
    });
  });

  calcTotal();
}

/* ---------- EDIÇÃO ---------- */
function edit(cat, i, field, value){
  data[cat][i][field] = value;
  calcTotal();
}

function removeItem(cat, i){
  data[cat].splice(i, 1);
  render();
}

/* ---------- TOTAL ---------- */
function calcTotal(){
  let total = 0;
  Object.values(data).forEach(cat =>
    cat.forEach(i => total += i.qty * i.price)
  );
  totalEl.textContent = total.toFixed(2);
}

/* ---------- SALVAR ---------- */
function saveList(){
  const name = prompt("Nome da lista:");
  if(!name) return;

  history.push({
    name,
    date: new Date().toLocaleString(),
    data: JSON.parse(JSON.stringify(data))
  });

  localStorage.setItem("history", JSON.stringify(history));
  closeMenu();
}

/* ---------- HISTÓRICO ---------- */
function toggleHistory(){
  const box = historyBox;
  historyList.innerHTML = "";

  history.forEach(h => {
    let total = 0;
    Object.values(h.data).forEach(c =>
      c.forEach(i => total += i.qty * i.price)
    );

    const card = document.createElement("div");
    card.className = "history-card";

    card.innerHTML = `
      <h4>${h.name}</h4>
      <small>${h.date}</small>
      <div class="history-total">Total: R$ ${total.toFixed(2)}</div>
    `;

    card.onclick = () => {
      data = JSON.parse(JSON.stringify(h.data));
      render();
      toggleHistory();
    };

    historyList.appendChild(card);
  });

  box.classList.toggle("show");
}


/* ---------- COMPARTILHAR ---------- */
function shareList(){
  let txt = "Lista de Compras\n";

  Object.entries(data).forEach(([c, items]) => {
    if(items.length){
      txt += `\n${c}\n`;
      items.forEach(i =>
        txt += `${i.name} - ${i.qty} ${i.unit} x R$ ${i.price}\n`
      );
    }
  });

  navigator.share
    ? navigator.share({ text: txt })
    : alert(txt);

  closeMenu();
}

/* ---------- COPIAR ---------- */
function copyText(){
  navigator.clipboard.writeText(`Total: R$ ${totalEl.textContent}`);
  closeMenu();
}

/* ---------- IMPRIMIR ---------- */
function printList(){
  window.print();
  closeMenu();
}

/* ---------- INICIAL ---------- */
render();
