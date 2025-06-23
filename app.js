const DEFAULT_TEMPLATES = {
  "Скарги": [
    "Пацієнт скаржиться на хропіння, часті пробудження вночі та денну сонливість.",
    "Заперечує задишку, набряки, біль у грудній клітці."
  ],
  "Анамнез": [
    "Симптоми тривають 2 роки.",
    "Погіршення пам’яті, концентрації уваги."
  ]
};

let editMode = false;
const content = document.getElementById('content');
const btnBox = document.getElementById('buttons');
const editBtn = document.getElementById('editToggle');

editBtn.onclick = () => {
  editMode = !editMode;
  editBtn.textContent = editMode ? '❌ Вимкнути редагування' : '✏️ Увімкнути редагування';
  renderButtons();
  content.innerHTML = '';
};

function renderButtons() {
  btnBox.innerHTML = '';
  Object.keys(DEFAULT_TEMPLATES).forEach(cat => {
    const b = document.createElement('button');
    b.textContent = cat;
    b.onclick = () => showCategory(cat);
    btnBox.appendChild(b);
  });

  if (editMode) {
    const addCat = document.createElement('button');
    addCat.textContent = '+ Додати категорію';
    addCat.onclick = () => {
      const name = prompt('Назва категорії:');
      if (!name || DEFAULT_TEMPLATES[name]) return;
      DEFAULT_TEMPLATES[name] = [];
      renderButtons();
    };
    btnBox.appendChild(addCat);
  }
}

function showCategory(cat) {
  content.innerHTML = '';
  DEFAULT_TEMPLATES[cat].forEach(t => makeBlock(cat, t));

  if (editMode) {
    const add = document.createElement('button');
    add.textContent = '+ Додати шаблон';
    add.onclick = () => {
      const val = prompt('Новий шаблон:');
      if (!val) return;
      DEFAULT_TEMPLATES[cat].push(val);
      showCategory(cat);
    };
    content.appendChild(add);
  }
}

function makeBlock(cat, originalText) {
  const wrap = document.createElement('div');
  wrap.className = 'text-block';

  const ta = document.createElement('textarea');
  ta.value = originalText;
  wrap.appendChild(ta);

  const ctrl = document.createElement('div');
  ctrl.className = 'controls';

  const copy = document.createElement('button');
  copy.textContent = '📋 Копіювати';
  copy.onclick = () => navigator.clipboard.writeText(ta.value);
  ctrl.appendChild(copy);

  const reset = document.createElement('button');
  reset.textContent = '♻️ Скинути';
  reset.onclick = () => ta.value = originalText;
  ctrl.appendChild(reset);

  if (editMode) {
    const del = document.createElement('button');
    del.textContent = '🗑️ Видалити';
    del.onclick = () => {
      DEFAULT_TEMPLATES[cat] = DEFAULT_TEMPLATES[cat].filter(t => t !== originalText);
      showCategory(cat);
    };
    ctrl.appendChild(del);
  }

  wrap.appendChild(ctrl);
  content.appendChild(wrap);
}

renderButtons();
