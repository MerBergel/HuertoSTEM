document.addEventListener('DOMContentLoaded', function () {
  // ----- Navegación por pestañas (SPA) -----
  const navLinks = document.querySelectorAll('.nav-link');
  const contentSections = document.querySelectorAll('.content-section');

  function switchTab(targetId){
    contentSections.forEach(s=>s.classList.toggle('active', s.id===targetId));
    navLinks.forEach(l=>l.classList.toggle('active', l.dataset.target===targetId));
    // Inicializa gráficos si se entra en secciones con canvas
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
});

