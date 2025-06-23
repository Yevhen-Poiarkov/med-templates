let editMode = false;

/* ---------- початкові шаблони ---------- */
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

/* ---------- DOM ---------- */
const btnBox  = document.getElementById('buttons');
const content = document.getElementById('content');

/* ---------- створення кнопок-категорій ---------- */
Object.keys(DEFAULT_TEMPLATES).forEach(cat=>{
  const b=document.createElement('button');
  b.textContent=cat;
  b.onclick = ()=>showCategory(cat);
  btnBox.appendChild(b);
});

/* ---------- показ вибраної категорії ---------- */
function showCategory(cat){
  content.innerHTML = '';
  DEFAULT_TEMPLATES[cat].forEach(t=>makeBlock(cat,t));
}

/* ---------- картка тексту ---------- */
function makeBlock(cat, originalText){
  const wrap=document.createElement('div');
  wrap.className='text-block';

  /* textarea редагується, але не зберігається */
  const ta=document.createElement('textarea');
  ta.value=originalText;
  wrap.appendChild(ta);

  const ctrl=document.createElement('div');
  ctrl.className='controls';

  const copy=document.createElement('button');
  copy.textContent='📋 Копіювати';
  copy.onclick=()=>navigator.clipboard.writeText(ta.value);
  ctrl.appendChild(copy);

  const reset=document.createElement('button');
  reset.textContent='♻️ Скинути';
  reset.onclick=()=>ta.value=originalText;
  ctrl.appendChild(reset);

  wrap.appendChild(ctrl);
  content.appendChild(wrap);
}
