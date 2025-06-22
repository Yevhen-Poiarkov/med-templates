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

/* ------------------ Створення блоку тексту ------------------ */
function makeBlock(cat,text){
  const wrap=document.createElement('div');
  wrap.className='text-block';

  const ta=document.createElement('textarea');
  ta.value=text; ta.readOnly=!editMode;

  const ctrl=document.createElement('div'); ctrl.className='controls';

  /* копіювання */
  const copy=document.createElement('button');
  copy.textContent='📋 Копіювати';
  copy.onclick=()=>{
    ta.select(); document.execCommand('copy');
    freq[cat]=freq[cat]||{}; freq[cat][text]=(freq[cat][text]||0)+1;
    save();
  };
  ctrl.appendChild(copy);

  /* скидання */
  const rst=document.createElement('button');
  rst.textContent='♻️ Скинути';
  rst.onclick=()=>ta.value=text;
  ctrl.appendChild(rst);

  /* редагування / видалення у режимі редагування */
  if(editMode){
    ta.onchange=()=>{
      const i=templates[cat].indexOf(text);
      if(i>-1) templates[cat][i]=ta.value; save();
    };
    const del=document.createElement('button');
    del.textContent='🗑️ Видалити';
    del.onclick=()=>{
      if(confirm('Справді видалити?')){
        templates[cat]=templates[cat].filter(t=>t!==text);
        save(); showCategory(cat);
      }
    };
    ctrl.appendChild(del);
  }

  wrap.appendChild(ta); wrap.appendChild(ctrl); content.appendChild(wrap);
}

/* ------------------ Перемикач режиму ------------------ */
editBtn.onclick = ()=>{
  editMode=!editMode;
  editBtn.textContent = editMode ? '🚫 Завершити' : '🖊️ Редагувати';
  renderButtons(); content.innerHTML='';
};

/* ------------------ Старт ------------------ */
renderButtons();
