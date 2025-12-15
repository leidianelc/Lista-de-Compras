const totalEl = document.getElementById('total');

function addItem(button) {
  const ul = button.previousElementSibling;

  const li = document.createElement('li');
  li.innerHTML = `
    <input type="checkbox">
    <input type="text" class="item-name" placeholder="Item">
    <input type="number" class="qty" min="1" value="1">
    <input type="number" class="unit" placeholder="R$ unit." min="0" step="0.01">
    <input type="text" class="total-item" disabled>
    <button class="remove-btn">❌</button>
  `;

  ul.appendChild(li);
  attachEvents(li);
  saveState();
}

function attachEvents(li) {
  const checkbox = li.querySelector('input[type="checkbox"]');
  const qty = li.querySelector('.qty');
  const unit = li.querySelector('.unit');
  const removeBtn = li.querySelector('.remove-btn');

  checkbox.addEventListener('change', () => {
    li.classList.toggle('checked', checkbox.checked);
    calculateTotal();
    saveState();
  });

  qty.addEventListener('input', () => updateItem(li));
  unit.addEventListener('input', () => updateItem(li));
  li.querySelector('.item-name').addEventListener('input', saveState);

  removeBtn.addEventListener('click', () => {
    li.remove();
    calculateTotal();
    saveState();
  });
}

function updateItem(li) {
  calculateItemTotal(li);
  calculateTotal();
  saveState();
}

function calculateItemTotal(li) {
  const qty = parseFloat(li.querySelector('.qty').value || 0);
  const unit = parseFloat(li.querySelector('.unit').value || 0);
  li.querySelector('.total-item').value = (qty * unit).toFixed(2);
}

function calculateTotal() {
  let total = 0;
  document.querySelectorAll('li').forEach(li => {
    if (li.querySelector('input[type="checkbox"]').checked) {
      total += parseFloat(li.querySelector('.total-item').value || 0);
    }
  });
  totalEl.textContent = total.toFixed(2);
}

function saveState() {
  const data = [];
  document.querySelectorAll('.category').forEach(cat => {
    const items = [];
    cat.querySelectorAll('li').forEach(li => {
      items.push({
        checked: li.querySelector('input[type="checkbox"]').checked,
        name: li.querySelector('.item-name').value,
        qty: li.querySelector('.qty').value,
        unit: li.querySelector('.unit').value
      });
    });
    data.push(items);
  });
  localStorage.setItem('shoppingList', JSON.stringify(data));
}

function loadState() {
  const data = JSON.parse(localStorage.getItem('shoppingList'));
  if (!data) return;

  document.querySelectorAll('.category').forEach((cat, i) => {
    const ul = cat.querySelector('.items');
    data[i].forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `
        <input type="checkbox" ${item.checked ? 'checked' : ''}>
        <input type="text" class="item-name" value="${item.name}">
        <input type="number" class="qty" value="${item.qty}">
        <input type="number" class="unit" value="${item.unit}">
        <input type="text" class="total-item" disabled>
        <button class="remove-btn">❌</button>
      `;
      ul.appendChild(li);
      calculateItemTotal(li);
      if (item.checked) li.classList.add('checked');
      attachEvents(li);
    });
  });

  calculateTotal();
}

function resetList() {
  localStorage.removeItem('shoppingList');
  document.querySelectorAll('.items').forEach(ul => ul.innerHTML = '');
  calculateTotal();
}

loadState();
