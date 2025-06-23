/* ---------- початкові дані ---------- */
const LS_FREQ  = 'medTemplatesFreq';   // лічильник копіювань
const LS_DATA  = 'medTemplatesData';   // ваші збережені шаблони

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

/* ---------- завантаження з localStorage ---------- */
let templates = JSON.parse(localStorage.getItem(LS_DATA)) || structuredClone(DEFAULT_TEMPLATES);
let freq      = JSON.parse(localStorage.getItem(LS_FREQ)) || {};
let editMode  = false;

/* ---------- DOM ---------- */
const btnBox  = document.getElementById('buttons');
const content = document.getElementById('content');
const editBtn = document.getElementById('editToggle');

/* ---------- helpers ---------- */
const save = () => {
  localStorage.setItem(LS_DATA,  JSON.stringify(templates));
  localStorage.setItem(LS_FREQ,  JSON.stringify(freq));
};

const hit = (cat, txt) => {
  freq[cat] ??= {};
  freq[cat][txt] = (freq[cat][txt] || 0) + 1;
  save();
};

const sorted = (cat) =>
  templates[cat]
    .slice()
    .sort((a, b) => (freq[cat]?.[b]||0) - (freq[cat]?.[a]||0));

/* ---------- UI ---------- */
editBtn.onclick = () => {
  editMode = !editMode;
  editBtn.textContent = editMode ? '❌ Вимкнути редагування' : '✏️ Увімкнути редагування';
  renderButtons();
  content.innerHTML = '';
};

function renderButtons() {
  btnBox.innerHTML = '';
  Object.keys(templates).forEach(cat => {
    const group = document.createElement('div');
    group.style.display = 'inline-flex';
    group.style.margin = '3px';

    const b = document.createElement('button');
    b.textContent = cat;
    b.onclick = () => showCategory(cat);
    group.appendChild(b);

    if (editMode) {
      const rename = document.createElement('button');
      rename.textContent = '📝';
      rename.title = 'Перейменувати';
      rename.onclick = () => {
        const newName = prompt('Нова назва категорії:', cat);
        if (!newName || newName === cat || templates[newName]) return;
        templates[newName] = templates[cat];
        delete templates[cat];
        if (freq[cat]) {
          freq[newName] = freq[cat];
          delete freq[cat];
        }
        save(); renderButtons();
      };
      group.appendChild(rename);
    }

    btnBox.appendChild(group);
  });

  if (editMode) {
    const addCat = document.createElement('button');
    addCat.textContent = '+ Додати категорію';
    addCat.onclick = () => {
      const name = prompt('Назва категорії:');
      if (!name || templates[name]) return;
      templates[name] = [];
      save(); renderButtons();
    };
    btnBox.appendChild(addCat);
  }
}


function showCategory(cat) {
  content.innerHTML = '';
  sorted(cat).forEach(t => makeBlock(cat, t));

  if (editMode) {
    const add = document.createElement('button');
    add.textContent = '+ Додати шаблон';
    add.onclick = () => {
      const val = prompt('Новий шаблон:');
      if (!val) return;
      templates[cat].push(val);
      save(); showCategory(cat);
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
  copy.onclick = () => {
    navigator.clipboard.writeText(ta.value);
    hit(cat, originalText);         // лічильник
    showCategory(cat);              // відразу пересортувати
  };
  ctrl.appendChild(copy);

  const reset = document.createElement('button');
  reset.textContent = '♻️ Скинути';
  reset.onclick = () => ta.value = originalText;
  ctrl.appendChild(reset);

  if (editMode) {
    const del = document.createElement('button');
    del.textContent = '🗑️ Видалити';
    del.onclick = () => {
      templates[cat] = templates[cat].filter(t => t !== originalText);
      delete freq[cat]?.[originalText];
      save(); showCategory(cat);
    };
    ctrl.appendChild(del);
  }

  wrap.appendChild(ctrl);
  content.appendChild(wrap);
}

renderButtons();          // старт
