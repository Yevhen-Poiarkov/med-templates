/* ------------------ Налаштування ------------------ */
const DEFAULT_TEMPLATES = {
  "Скарги": [
    "Пацієнт скаржиться на хропіння, часті пробудження вночі та підвищену денну сонливість.",
    "Заперечує задишку, набряки, біль у грудній клітці."
  ],
  "Анамнез": [
    "Симптоми прогресують протягом останніх 2 років.",
    "Зазначає погіршення пам’яті та концентрації уваги."
  ],
  "Об'єктивно": [
    "ІМТ – 32, окружність шиї – 42 см.",
    "АТ 135/85 мм рт. ст., ЧСС 76 уд/хв."
  ]
};

const LS_KEY  = 'medTemplatesData';   // редаговані шаблони
const LS_FREQ = 'medTemplatesFreq';   // лічильник копіювань

/* ------------------ Початкові дані ------------------ */
let templates = JSON.parse(localStorage.getItem(LS_KEY )) || DEFAULT_TEMPLATES;
let freq      = JSON.parse(localStorage.getItem(LS_FREQ)) || {};
let editMode  = false;

/* ------------------ DOM‑посилання ------------------ */
const btnBox   = document.getElementById('buttons');
const content  = document.getElementById('content');
const editBtn  = document.getElementById('editToggle');

/* ------------------ Допоміжні функції ------------------ */
const save = () => {
  localStorage.setItem(LS_KEY , JSON.stringify(templates));
  localStorage.setItem(LS_FREQ, JSON.stringify(freq));
};

const sortByUse = (arr, cat) =>
  arr.slice().sort((a,b) => (freq[cat]?.[b]||0) - (freq[cat]?.[a]||0));

/* ------------------ Створення блоку тексту ------------------ */
/** Створює картку з textarea + 2 кнопки */
function makeBlock(cat, originalText) {
  const wrap = document.createElement('div');
  wrap.className = 'text-block';          // більше НЕ додаємо .readonly

  /* ===== Текстове поле завжди редаговане  ===== */
  const ta = document.createElement('textarea');
  ta.value = originalText;                // початковий шаблон
  //  ❌ НЕ ставимо readOnly / disabled – воно редагується одразу
  wrap.appendChild(ta);

  /* ===== Кнопки ===== */
  const ctrl = document.createElement('div');
  ctrl.className = 'controls';

  // 📋 Копіювати ВЖЕ відредаговане
  const copy = document.createElement('button');
  copy.textContent = '📋 Копіювати';
  copy.onclick = () => navigator.clipboard.writeText(ta.value);
  ctrl.appendChild(copy);

  // ♻️ Скинути до оригінального варіанту
  const reset = document.createElement('button');
  reset.textContent = '♻️ Скинути';
  reset.onclick  = () => ta.value = originalText;
  ctrl.appendChild(reset);

  wrap.appendChild(ctrl);
  content.appendChild(wrap);
}

/* ------------------ Рендер кнопок‑категорій ------------------ */
function renderButtons(){
  btnBox.innerHTML = '';
  Object.keys(templates).forEach(cat=>{
    const b=document.createElement('button');
    b.textContent=cat;
    b.onclick = ()=>showCategory(cat);
    btnBox.appendChild(b);
  });
  if(editMode){
    const add=document.createElement('button');
    add.textContent='+ Додати категорію';
    add.onclick = ()=>{
      const n=prompt('Назва:'); if(!n) return;
      templates[n]=[]; save(); renderButtons();
    };
    btnBox.appendChild(add);
  }
}

/* ------------------ Показ категорії ------------------ */
function showCategory(cat){
  content.innerHTML='';
  sortByUse(templates[cat],cat).forEach(t=>makeBlock(cat,t));
  if(editMode){
    const add=document.createElement('button');
    add.textContent='+ Додати текст';
    add.onclick=()=>{
      const v=prompt('Новий текст:'); if(!v) return;
      templates[cat].push(v); save(); showCategory(cat);
    };
    content.appendChild(add);
  }
}

/* ------------------ Старт ------------------ */
renderButtons();
