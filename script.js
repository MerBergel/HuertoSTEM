document.addEventListener('DOMContentLoaded', function () {
  // ----- Navegación por pestañas (SPA) -----
  const navLinks = document.querySelectorAll('.nav-link');
  const contentSections = document.querySelectorAll('.content-section');

  function switchTab(targetId){
    contentSections.forEach(s=>s.classList.toggle('active', s.id===targetId));
    navLinks.forEach(l=>l.classList.toggle('active', l.dataset.target===targetId));
    // Inicializar gráficos si se entra en secciones con canvas
    if (targetId === 'areas')      initMainGrowthChart();
    if (targetId === 'infografia') { initDisciplinesChart(); initInfGrowthChart(); }
  }

  const initialHash = window.location.hash.substring(1) || 'proyecto';
  switchTab(initialHash);

  navLinks.forEach(link=>{
    link.addEventListener('click', e=>{
      if (!link.dataset.target) return;
      e.preventDefault();
      const t = link.dataset.target;
      window.location.hash = t;
    });
  });

  window.addEventListener('hashchange', ()=>{
    const hash = window.location.hash.substring(1) || 'proyecto';
    switchTab(hash);
  });

  // ----- Datos para cronograma y áreas -----
  const projectData = {
    trimestres:{
      '1':{
        title:'1º Trimestre: Diseño y Planificación (Septiembre - Diciembre)',
        content:`<ul class="list-disc list-inside space-y-3 text-stone-700">
          <li><b>General:</b> Equipos, investigación y diseño del espacio.</li>
          <li><b>Científico-Matemático:</b> pH/nutrientes, superficies y volúmenes.</li>
          <li><b>Tecnológico:</b> Introducción a Arduino y blog del proyecto.</li>
          <li><b>Artístico-Social:</b> Maquetas, logo e imagen del proyecto.</li>
          <li><b>Lingüístico:</b> Cuaderno de campo y primeras presentaciones.</li>
        </ul>`
      },
      '2':{
        title:'2º Trimestre: Construcción y Desarrollo (Enero - Marzo)',
        content:`<ul class="list-disc list-inside space-y-3 text-stone-700">
          <li><b>General:</b> Preparación del terreno, bancales y siembras.</li>
          <li><b>Tecnológico:</b> Riego automatizado con Arduino + app de datos.</li>
          <li><b>Datos:</b> Registro semanal y primeras gráficas.</li>
          <li><b>Comunicación:</b> Etiquetado bilingüe y entradas en el blog.</li>
        </ul>`
      },
      '3':{
        title:'3º Trimestre: Crecimiento y Cosecha (Abril - Junio)',
        content:`<ul class="list-disc list-inside space-y-3 text-stone-700">
          <li><b>Datos:</b> Estadística y visualización avanzada.</li>
          <li><b>Optimización:</b> Trigonometría, fuerzas y mejoras.</li>
          <li><b>Servicio:</b> Mercadillo solidario y difusión.</li>
          <li><b>Cierre:</b> Presentaciones finales, vídeo y reflexión.</li>
        </ul>`
      }
    },
    areas:{
      'cientifico':{
        title:'Actividades Científico-Matemáticas',
        content:`<ul class="list-disc list-inside space-y-2 text-stone-700">
          <li>Análisis de suelo (pH, nutrientes).</li>
          <li>Cálculos de superficies y volúmenes.</li>
          <li>Fotosíntesis y ciclo del agua.</li>
          <li>Registro y estadística de crecimiento.</li>
        </ul>`
      },
      'tecnologico':{
        title:'Actividades Tecnológicas',
        content:`<ul class="list-disc list-inside space-y-2 text-stone-700">
          <li>Arduino básico y sensores.</li>
          <li>Sistema de riego automatizado.</li>
          <li>App sencilla de registro.</li>
          <li>Gráficas y publicación web.</li>
        </ul>`
      },
      'artistico':{
        title:'Actividades Artísticas y Sociales',
        content:`<ul class="list-disc list-inside space-y-2 text-stone-700">
          <li>Diseño del espacio, maquetas y señalética.</li>
          <li>Imagen del proyecto y difusión.</li>
          <li>Mercadillo solidario.</li>
        </ul>`
      },
      'linguistico':{
        title:'Actividades Lingüísticas',
        content:`<ul class="list-disc list-inside space-y-2 text-stone-700">
          <li>Cuaderno de campo digital colaborativo.</li>
          <li>Etiquetado bilingüe de plantas.</li>
          <li>Presentaciones orales y artículos del blog.</li>
        </ul>`
      }
    }
  };

  // ----- Cronograma (resumen) -----
  const timelineBtns = document.querySelectorAll('.timeline-btn');
  const timelineContent = document.getElementById('timeline-content');
  function showTrimestre(num){
    const d = projectData.trimestres[num];
    timelineContent.innerHTML = `<h3 class="text-2xl font-bold text-stone-800 mb-4">${d.title}</h3>${d.content}`;
    timelineBtns.forEach(b=>b.classList.toggle('active', b.dataset.trimestre===num));
  }
  timelineBtns.forEach(btn=>btn.addEventListener('click',()=>showTrimestre(btn.dataset.trimestre)));
  if (timelineBtns.length) showTrimestre('1');

  // ----- Áreas STEAM -----
  const steamCards  = document.querySelectorAll('.steam-card');
  const steamContent= document.getElementById('steam-content');
  const chartArea   = document.getElementById('chart-area');

  function showArea(id){
    const d = projectData.areas[id];
    steamContent.innerHTML = `<h3 class="text-2xl font-bold text-stone-800 mb-4">${d.title}</h3>${d.content}`;
    chartArea.style.display = id==='cientifico' ? 'block' : 'none';

    // Anillos de foco
    steamCards.forEach(c=>c.classList.remove('ring-2','ring-offset-2','ring-green-500','ring-blue-500','ring-yellow-500','ring-red-500'));
    const card = document.querySelector(`.steam-card[data-area="${id}"]`);
    if(id==='cientifico')  card.classList.add('ring-2','ring-offset-2','ring-green-500');
    if(id==='tecnologico') card.classList.add('ring-2','ring-offset-2','ring-blue-500');
    if(id==='artistico')   card.classList.add('ring-2','ring-offset-2','ring-yellow-500');
    if(id==='linguistico') card.classList.add('ring-2','ring-offset-2','ring-red-500');
  }
  steamCards.forEach(c=>c.addEventListener('click',()=>showArea(c.dataset.area)));
  if (steamCards.length) showArea('cientifico');

  // ----- Gráfico principal (Áreas) -----
  let mainChart, mainChartInited = false, chartWeek = 4;
  function initMainGrowthChart(){
    if (mainChartInited) return;
    const canvas = document.getElementById('growthChartMain');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    mainChart = new Chart(ctx,{
      type:'line',
      data:{
        labels:['Semana 1','Semana 2','Semana 3','Semana 4'],
        datasets:[
          {label:'Altura Tomatera (cm)', data:[5,8,12,16], borderColor:'#16a34a', backgroundColor:'rgba(22,163,74,.1)', tension:.3, fill:true},
          {label:'Altura Lechuga (cm)',  data:[3,5,7,9],   borderColor:'#65a30d', backgroundColor:'rgba(101,163,13,.1)',tension:.3, fill:true}
        ]
      },
      options:{
        responsive:true, maintainAspectRatio:false,
        scales:{ y:{beginAtZero:true,title:{display:true,text:'Altura (cm)'}}, x:{title:{display:true,text:'Tiempo'}}},
        plugins:{ tooltip:{callbacks:{label:(c)=>`${c.dataset.label}: ${c.parsed.y} cm`}}}
      }
    });
    const addBtn = document.getElementById('addDataBtn');
    if (addBtn){
      addBtn.addEventListener('click',()=>{
        chartWeek++;
        mainChart.data.labels.push(`Semana ${chartWeek}`);
        mainChart.data.datasets[0].data.push(Math.floor(Math.random()*5)+16+(chartWeek-4)*4);
        mainChart.data.datasets[1].data.push(Math.floor(Math.random()*2)+9+(chartWeek-4)*1.5);
        mainChart.update();
      });
    }
    mainChartInited = true;
  }

  // ----- Infografía: donut + línea -----
  let donutInited=false, lineInfInited=false;

  function wrapLabel(label) {
    if (!label || label.length <= 16) return label;
    const words = label.split(' ');
    const lines = [];
    let current = '';
    for (const w of words) {
      if ((current + ' ' + w).trim().length > 16) { lines.push(current.trim()); current = w; }
      else current = (current + ' ' + w).trim();
    }
    if (current) lines.push(current);
    return lines;
  }

  function ttTitle(items){
    const it = items[0];
    let l = it.chart.data.labels[it.dataIndex];
    return Array.isArray(l) ? l.join(' ') : l;
  }

  function initDisciplinesChart(){
    if (donutInited) return;
    const cv = document.getElementById('disciplinesChartInf');
    if (!cv) return;
    const ctx = cv.getContext('2d');
    new Chart(ctx,{
      type:'doughnut',
      data:{
        labels:[wrapLabel('Científico-Matemático'), wrapLabel('Tecnológico'), wrapLabel('Artístico y Social'), wrapLabel('Lingüístico')],
        datasets:[{ data:[25,25,25,25], backgroundColor:['#FF6B6B','#06D6A0','#FFD166','#118AB2'], borderColor:'#fff', borderWidth:4 }]
      },
      options:{ responsive:true, maintainAspectRatio:false,
        plugins:{ legend:{position:'bottom'}, tooltip:{callbacks:{title:ttTitle}} } }
    });
    donutInited = true;
  }

  function initInfGrowthChart(){
    if (lineInfInited) return;
    const cv = document.getElementById('growthChartInf');
    if (!cv) return;
    const ctx = cv.getContext('2d');
    new Chart(ctx,{
      type:'line',
      data:{
        labels:['Semana 1','Semana 2','Semana 4','Semana 6','Semana 8','Semana 10'],
        datasets:[
          { label:'Altura Tomatera (cm)', data:[5,8,15,22,30,42], borderColor:'#FF6B6B', backgroundColor:'rgba(255,107,107,.2)', tension:.4, fill:true },
          { label:'Altura Lechuga (cm)',  data:[3,5,8,11,13,15], borderColor:'#06D6A0', backgroundColor:'rgba(6,214,160,.2)',  tension:.4, fill:true }
        ]
      },
      options:{
        responsive:true, maintainAspectRatio:false,
        scales:{ y:{beginAtZero:true,title:{display:true,text:'Altura (cm)'}}, x:{title:{display:true,text:'Semanas'}} },
        plugins:{ tooltip:{callbacks:{title:ttTitle}} }
      }
    });
    lineInfInited = true;
  }

  // ----- Acordeones de Planificación -----
  const accBtns    = document.querySelectorAll('.accordion-btn');
  const expandAll  = document.getElementById('expandAll');
  const collapseAll= document.getElementById('collapseAll');
  const printBtn   = document.getElementById('printPlan');

  accBtns.forEach(btn=>{
    btn.addEventListener('click',()=>{
      const target = document.getElementById(btn.dataset.target);
      const expanded = btn.getAttribute('aria-expanded')==='true';
      btn.setAttribute('aria-expanded', String(!expanded));
      target.classList.toggle('hidden', expanded);
    });
  });
  if (expandAll)  expandAll.addEventListener('click',()=>accBtns.forEach(b=>{b.setAttribute('aria-expanded','true'); document.getElementById(b.dataset.target).classList.remove('hidden');}));
  if (collapseAll)collapseAll.addEventListener('click',()=>accBtns.forEach(b=>{b.setAttribute('aria-expanded','false');document.getElementById(b.dataset.target).classList.add('hidden');}));
  if (printBtn)   printBtn.addEventListener('click',()=>window.print());

  // ----- Generador de Etiquetas QR -----
  const openQR = document.getElementById('openQR');
  const closeQR = document.getElementById('closeQR');
  const qrModal = document.getElementById('qrModal');
  const genQR = document.getElementById('genQR');
  const printQR = document.getElementById('printQR');
  const plantInput = document.getElementById('plantInput');
  const qrGrid = document.getElementById('qrGrid');
  const qrSize = document.getElementById('qrSize');
  const qrCols = document.getElementById('qrCols');

  // Relleno de ejemplo
  const defaultPlants = [
    "Tomatera | Tomato | https://es.wikipedia.org/wiki/Tomate",
    "Lechuga | Lettuce | https://es.wikipedia.org/wiki/Lactuca_sativa",
    "Pimiento | Pepper | https://es.wikipedia.org/wiki/Capsicum",
    "Calabacín | Zucchini | https://es.wikipedia.org/wiki/Cucurbita_pepo",
    "Zanahoria | Carrot | https://es.wikipedia.org/wiki/Daucus_carota",
    "Espinaca | Spinach | https://es.wikipedia.org/wiki/Spinacia_oleracea",
    "Fresa | Strawberry | https://es.wikipedia.org/wiki/Fragaria",
    "Romero | Rosemary | https://es.wikipedia.org/wiki/Rosmarinus_officinalis",
    "Tomillo | Thyme | https://es.wikipedia.org/wiki/Thymus_(planta)",
    "Albahaca | Basil | https://es.wikipedia.org/wiki/Ocimum_basilicum",
    "Perejil | Parsley | https://es.wikipedia.org/wiki/Petroselinum_crispum",
    "Cebolla | Onion | https://es.wikipedia.org/wiki/Allium_cepa"
  ];
  if (plantInput && !plantInput.value.trim()) {
    plantInput.value = defaultPlants.join("\n");
  }

  function openModal(){ qrModal.classList.remove('hidden'); qrModal.classList.add('flex'); }
  function closeModal(){ qrModal.classList.add('hidden'); qrModal.classList.remove('flex'); }

  if (openQR) openQR.addEventListener('click', openModal);
  if (closeQR) closeQR.addEventListener('click', closeModal);
  if (qrModal) qrModal.addEventListener('click', (e)=>{ if (e.target===qrModal) closeModal(); });

  function clearGrid(){
    while (qrGrid.firstChild) qrGrid.removeChild(qrGrid.firstChild);
  }

  function makeLabel({es,en,url}, size){
    const wrap = document.createElement('div');
    wrap.className = "qr-label flex flex-col items-center";
    // QR
    const qrBox = document.createElement('div');
    qrBox.style.width = `${size}px`;
    qrBox.style.height = `${size}px`;
    new QRCode(qrBox, { text: url, width: size, height: size, correctLevel: QRCode.CorrectLevel.M });
    // Textos
    const esEl = document.createElement('div'); esEl.className = "qr-es mt-2"; esEl.textContent = es;
    const enEl = document.createElement('div'); enEl.className = "qr-en";     enEl.textContent = en;
    const urlEl= document.createElement('div'); urlEl.className= "qr-url mt-1";urlEl.textContent = url;
    wrap.append(qrBox, esEl, enEl, urlEl);
    return wrap;
  }

  function parseLines(text){
    return text.split('\n')
      .map(l=>l.trim())
      .filter(Boolean)
      .map(l=>{
        const [es,en,url] = l.split('|').map(s=> (s||'').trim());
        return {es, en, url};
      })
      .filter(o=>o.es && o.en && o.url);
  }

  function generateQR(){
    clearGrid();
    const size = Math.max(96, Math.min(256, parseInt(qrSize.value || "128", 10)));
    const cols = Math.max(2, Math.min(5, parseInt(qrCols.value || "4", 10)));
    qrGrid.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
    const list = parseLines(plantInput.value);
    list.forEach(item=> qrGrid.appendChild(makeLabel(item, size)));
  }

  if (genQR) genQR.addEventListener('click', generateQR);
  if (printQR) printQR.addEventListener('click', ()=>window.print());
  // En script.js
async function loadCSVtoChart(chart, url){
  const res = await fetch(url);
  const text = await res.text();
  const rows = text.trim().split('\n').slice(1).map(r=>r.split(','));
  const semanas = []; const tomatera = []; const lechuga = [];
  rows.forEach((r,i)=>{ // adapta estas columnas a tu CSV real
    semanas.push(`Obs ${i+1}`);
    tomatera.push(parseFloat(r[6]||0)); // Altura_cm
    lechuga.push(parseFloat(r[7]||0));  // Numero_Hojas (ejemplo) o cambia a otra planta
  });
  chart.data.labels = semanas;
  chart.data.datasets[0].data = tomatera;
  chart.data.datasets[1].data = lechuga;
  chart.update();
}
document.getElementById('loadCSV')?.addEventListener('click',()=>loadCSVtoChart(mainChart,'assets/cuaderno_campo_2025-2026.csv'));

});

/* ===========================
   Puntuaciones (Gamificación)
   =========================== */
(function(){
  const SCORE_KEY = 'huertoScores2025';
  const scoreBody = document.getElementById('scoreBody');
  const addTeamBtn = document.getElementById('addTeamBtn');
  const teamName = document.getElementById('teamName');
  const resetBtn = document.getElementById('resetScores');
  const exportBtn = document.getElementById('exportScores');
  const importInput = document.getElementById('importScores');
  const printBtn = document.getElementById('printScores');

  if (!scoreBody) return; // la sección puede no estar aún

  // Utilidades
  const uid = ()=> (crypto?.randomUUID?.() || ('id-' + Math.random().toString(36).slice(2)));

  const defaultTeams = ()=> ([
    { id: uid(), name: 'Equipo A', cte:0, tec:0, art:0, lin:0, serv:0 },
    { id: uid(), name: 'Equipo B', cte:0, tec:0, art:0, lin:0, serv:0 },
    { id: uid(), name: 'Equipo C', cte:0, tec:0, art:0, lin:0, serv:0 },
    { id: uid(), name: 'Equipo D', cte:0, tec:0, art:0, lin:0, serv:0 }
  ]);

  const load = ()=> {
    try { return JSON.parse(localStorage.getItem(SCORE_KEY)) || defaultTeams(); }
    catch { return defaultTeams(); }
  };
  const save = (data)=> localStorage.setItem(SCORE_KEY, JSON.stringify(data));

  let teams = load();

  const total = (t)=> t.cte + t.tec + t.art + t.lin + t.serv;

  const badges = (t)=>{
    const out = [];
    if (t.cte >= 10)  out.push({icon:'🌱', txt:'Maestr@s del pH'});
    if (t.tec >= 10)  out.push({icon:'💧', txt:'Makers del Riego'});
    if (t.art >= 10)  out.push({icon:'🎭', txt:'Diseño con Alma'});
    if (t.lin >= 10)  out.push({icon:'✍️', txt:'Crónicas del Huerto'});
    if (t.serv >= 8)  out.push({icon:'👐', txt:'Manos que Ayudan'});
    if (total(t) >= 50) out.push({icon:'⭐', txt:'Equipo Estrella'});
    return out;
  };

  const render = ()=>{
    scoreBody.innerHTML = teams.map(t=>{
      const b = badges(t).map(b=>`<span class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-stone-100 text-stone-700 text-xs mr-1">${b.icon} ${b.txt}</span>`).join('');
      const cell = (key, label)=> `
        <td class="p-3">
          <div class="flex items-center gap-2">
            <button class="px-2 py-1 rounded-md bg-stone-200 hover:bg-stone-300 text-sm" data-action="minus" data-id="${t.id}" data-cat="${key}">−</button>
            <span class="min-w-[2rem] text-center font-bold">${t[key]}</span>
            <button class="px-2 py-1 rounded-md bg-green-600 hover:bg-green-700 text-white text-sm" data-action="plus" data-id="${t.id}" data-cat="${key}">+</button>
          </div>
        </td>`;
      return `
        <tr>
          <td class="p-3 font-bold">${t.name}</td>
          ${cell('cte','🧪')}
          ${cell('tec','⚙️')}
          ${cell('art','🎨')}
          ${cell('lin','🗣️')}
          ${cell('serv','🤝')}
          <td class="p-3 font-extrabold">${total(t)}</td>
          <td class="p-3">${b || '<span class="text-stone-400 text-sm">—</span>'}</td>
          <td class="p-3">
            <button class="px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm" data-action="remove" data-id="${t.id}">Eliminar</button>
          </td>
        </tr>`;
    }).join('');
  };

  // Eventos
  scoreBody.addEventListener('click', (e)=>{
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const id = btn.dataset.id;
    const cat = btn.dataset.cat;
    const action = btn.dataset.action;
    const i = teams.findIndex(t=>t.id===id);
    if (i<0) return;

    if (action==='plus' && cat){
      teams[i][cat] = (teams[i][cat]||0) + 1;
    } else if (action==='minus' && cat){
      teams[i][cat] = Math.max(0, (teams[i][cat]||0) - 1);
    } else if (action==='remove'){
      teams.splice(i,1);
    }
    save(teams); render();
  });

  addTeamBtn?.addEventListener('click', ()=>{
    const name = (teamName.value || '').trim();
    if (!name) return teamName.focus();
    teams.push({ id: uid(), name, cte:0, tec:0, art:0, lin:0, serv:0 });
    teamName.value = '';
    save(teams); render();
  });

  resetBtn?.addEventListener('click', ()=>{
    if (!confirm('¿Seguro que quieres reiniciar todas las puntuaciones?')) return;
    teams = teams.map(t=>({ ...t, cte:0, tec:0, art:0, lin:0, serv:0 }));
    save(teams); render();
  });

  exportBtn?.addEventListener('click', ()=>{
    const blob = new Blob([JSON.stringify(teams,null,2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'puntuaciones_huerto_2025-2026.json';
    document.body.appendChild(a); a.click();
    URL.revokeObjectURL(url); a.remove();
  });

  importInput?.addEventListener('change', ()=>{
    const file = importInput.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ()=>{
      try {
        const data = JSON.parse(reader.result);
        if (!Array.isArray(data)) throw new Error('Formato inválido');
        teams = data;
        save(teams); render();
      } catch(e){ alert('No se pudo importar: ' + e.message); }
    };
    reader.readAsText(file);
    importInput.value = '';
  });

  printBtn?.addEventListener('click', ()=>window.print());

  // Arranque
  render();
})();


