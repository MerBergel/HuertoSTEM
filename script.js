document.addEventListener('DOMContentLoaded', function () {
  /* ===========================
     Navegación por pestañas (SPA)
     =========================== */
  const navLinks = document.querySelectorAll('.nav-link');
  const contentSections = document.querySelectorAll('.content-section');

  function switchTab(targetId) {
    contentSections.forEach(section => {
      section.classList.toggle('active', section.id === targetId);
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.target === targetId);
    });
  }

  const initialHash = window.location.hash.substring(1) || 'proyecto';
  switchTab(initialHash);

  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.dataset.target;
      window.location.hash = targetId;
    });
  });
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.substring(1) || 'proyecto';
    switchTab(hash);
  });

  /* ===========================
     Datos del proyecto
     =========================== */
  const projectData = {
    trimestres: {
      '1': {
        title: '1º Trimestre: Diseño y Planificación (Septiembre – Diciembre)',
        content: `
          <ul class="list-disc list-inside space-y-3 text-stone-700">
            <li><strong>General:</strong> Formación de equipos, investigación inicial y diseño del espacio.</li>
            <li><strong>Científico-Matemático:</strong> Análisis de suelo (pH, nutrientes), cálculo de superficies y volúmenes.</li>
            <li><strong>Tecnológico:</strong> Introducción a Arduino y creación del blog del proyecto.</li>
            <li><strong>Artístico y Social:</strong> Maquetas, logo y estética del huerto.</li>
            <li><strong>Lingüístico:</strong> Cuaderno de campo digital y presentaciones iniciales.</li>
          </ul>
        `
      },
      '2': {
        title: '2º Trimestre: Construcción y Desarrollo (Enero – Marzo)',
        content: `
          <ul class="list-disc list-inside space-y-3 text-stone-700">
            <li><strong>General:</strong> Preparación del terreno, siembra y montaje tecnológico.</li>
            <li><strong>Científico-Matemático:</strong> Semilleros, germinación y registro sistemático de datos.</li>
            <li><strong>Tecnológico:</strong> Riego automatizado con Arduino y app de registro.</li>
            <li><strong>Artístico y Social:</strong> Bancales, caminos y elementos decorativos.</li>
            <li><strong>Lingüístico:</strong> Etiquetas bilingües y actualización del blog.</li>
          </ul>
        `
      },
      '3': {
        title: '3º Trimestre: Crecimiento y Cosecha (Abril – Junio)',
        content: `
          <ul class="list-disc list-inside space-y-3 text-stone-700">
            <li><strong>General:</strong> Mantenimiento, análisis de datos, cosecha y difusión.</li>
            <li><strong>Científico-Matemático:</strong> Estadística de crecimiento y control de plagas ecológico.</li>
            <li><strong>Tecnológico:</strong> Visualización avanzada de datos y vídeo-resumen.</li>
            <li><strong>Artístico y Social:</strong> Mercadillo solidario para la comunidad escolar.</li>
            <li><strong>Lingüístico:</strong> Presentaciones finales y artículo de cierre en el blog.</li>
          </ul>
        `
      }
    },
    areas: {
      'cientifico': {
        title: 'Actividades Científico-Matemáticas',
        content: `
          <ul class="list-disc list-inside space-y-2 text-stone-700">
            <li>Análisis del suelo (pH, nutrientes).</li>
            <li>Cálculos de superficies y volúmenes para el diseño.</li>
            <li>Investigación botánica y ciclo del agua/fotosíntesis.</li>
            <li>Registro y estadística de crecimiento.</li>
            <li>Métodos de control de plagas ecológicos.</li>
          </ul>
        `
      },
      'tecnologico': {
        title: 'Actividades Tecnológicas',
        content: `
          <ul class="list-disc list-inside space-y-2 text-stone-700">
            <li>Introducción a Arduino y electrónica básica.</li>
            <li>Blog del proyecto y buenas prácticas digitales.</li>
            <li>Riego automatizado con sensores y relé.</li>
            <li>App sencilla para registro de datos (ej. MIT App Inventor).</li>
            <li>Hojas de cálculo y gráficos.</li>
            <li>Vídeo-resumen final.</li>
          </ul>
        `
      },
      'artistico': {
        title: 'Actividades Artísticas y Sociales',
        content: `
          <ul class="list-disc list-inside space-y-2 text-stone-700">
            <li>Diseño funcional y estético del huerto.</li>
            <li>Maquetas, señalética y elementos decorativos.</li>
            <li>Mercadillo solidario y difusión.</li>
          </ul>
        `
      },
      'linguistico': {
        title: 'Actividades Lingüísticas',
        content: `
          <ul class="list-disc list-inside space-y-2 text-stone-700">
            <li>Cuaderno de campo digital colaborativo.</li>
            <li>Presentaciones orales y storytelling científico.</li>
            <li>Etiquetas bilingües y entradas del blog.</li>
          </ul>
        `
      }
    }
  };

  /* ===========================
     Cronograma (Trimestres)
     =========================== */
  const timelineBtns = document.querySelectorAll('.timeline-btn');
  const timelineContent = document.getElementById('timeline-content');
  function showTrimestre(trimestreNum) {
    const data = projectData.trimestres[trimestreNum];
    timelineContent.innerHTML = `<h3 class="text-2xl font-bold text-stone-800 mb-4">${data.title}</h3>${data.content}`;
    timelineBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.trimestre === trimestreNum);
    });
    // actualizar Hitos con el trimestre seleccionado
    if (typeof setCurrentTri === 'function') setCurrentTri(trimestreNum);
  }
  timelineBtns.forEach(btn => {
    btn.addEventListener('click', () => showTrimestre(btn.dataset.trimestre));
  });
  showTrimestre('1');

  /* ===========================
     Áreas STEAM + Chart main
     =========================== */
  const steamCards = document.querySelectorAll('.steam-card');
  const steamContent = document.getElementById('steam-content');
  const chartArea = document.getElementById('chart-area');

  function showArea(areaId) {
    const data = projectData.areas[areaId];
    steamContent.innerHTML = `<h3 class="text-2xl font-bold text-stone-800 mb-4">${data.title}</h3>${data.content}`;
    steamCards.forEach(card =>
      card.classList.remove('ring-2', 'ring-offset-2', 'ring-green-500', 'ring-blue-500', 'ring-yellow-500', 'ring-red-500')
    );
    const cardEl = document.querySelector(`.steam-card[data-area="${areaId}"]`);
    if (areaId === 'cientifico') cardEl.classList.add('ring-2', 'ring-offset-2', 'ring-green-500');
    if (areaId === 'tecnologico') cardEl.classList.add('ring-2', 'ring-offset-2', 'ring-blue-500');
    if (areaId === 'artistico') cardEl.classList.add('ring-2', 'ring-offset-2', 'ring-yellow-500');
    if (areaId === 'linguistico') cardEl.classList.add('ring-2', 'ring-offset-2', 'ring-red-500');

    chartArea.style.display = areaId === 'cientifico' ? 'block' : 'none';
  }

  steamCards.forEach(card => {
    card.addEventListener('click', () => showArea(card.dataset.area));
  });
  showArea('cientifico');

  // Chart principal en Áreas
  const ctxMain = document.getElementById('growthChartMain').getContext('2d');
  let chartWeek = 4;
  const growthChartMain = new Chart(ctxMain, {
    type: 'line',
    data: {
      labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
      datasets: [
        {
          label: 'Altura Tomatera (cm)',
          data: [5, 8, 12, 16],
          borderColor: '#16a34a',
          backgroundColor: 'rgba(22, 163, 74, 0.1)',
          tension: 0.3,
          fill: true
        },
        {
          label: 'Altura Lechuga (cm)',
          data: [3, 5, 7, 9],
          borderColor: '#65a30d',
          backgroundColor: 'rgba(101, 163, 13, 0.1)',
          tension: 0.3,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true, title: { display: true, text: 'Altura (cm)' } },
        x: { title: { display: true, text: 'Tiempo' } }
      },
      plugins: {
        tooltip: { callbacks: { label: (c)=> `${c.dataset.label}: ${c.parsed.y} cm` } }
      }
    }
  });

  document.getElementById('addDataBtnMain').addEventListener('click', function () {
    chartWeek++;
    growthChartMain.data.labels.push(`Semana ${chartWeek}`);
    growthChartMain.data.datasets[0].data.push(Math.floor(Math.random() * 5) + 16 + (chartWeek - 4) * 4);
    growthChartMain.data.datasets[1].data.push(Math.floor(Math.random() * 2) + 9 + (chartWeek - 4) * 1.5);
    growthChartMain.update();
  });

  /* ===========================
     Infografía: Donut + Línea
     =========================== */
  function wrapLabel(label) {
    if (label.length <= 16) return label;
    const words = label.split(' ');
    const lines = [];
    let currentLine = '';
    for (const w of words) {
      if ((currentLine + ' ' + w).trim().length > 16) {
        lines.push(currentLine.trim());
        currentLine = w;
      } else {
        currentLine = (currentLine + ' ' + w).trim();
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  }

  const tooltipTitle = (items) => {
    const it = items[0];
    let label = it.chart.data.labels[it.dataIndex];
    return Array.isArray(label) ? label.join(' ') : label;
    };

  // Donut
  const disciplinesCtx = document.getElementById('disciplinesChart').getContext('2d');
  new Chart(disciplinesCtx, {
    type: 'doughnut',
    data: {
      labels: [
        wrapLabel('Científico-Matemático'),
        wrapLabel('Tecnológico'),
        wrapLabel('Artístico y Social'),
        wrapLabel('Lingüístico')
      ],
      datasets: [{
        data: [25, 25, 25, 25],
        backgroundColor: ['#FF6B6B', '#06D6A0', '#FFD166', '#118AB2'],
        borderColor: '#fff',
        borderWidth: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' },
        tooltip: { callbacks: { title: tooltipTitle } }
      }
    }
  });

  // Línea (infografía)
  const growthCtxInfo = document.getElementById('growthChartInfo').getContext('2d');
  new Chart(growthCtxInfo, {
    type: 'line',
    data: {
      labels: ['Semana 1', 'Semana 2', 'Semana 4', 'Semana 6', 'Semana 8', 'Semana 10'],
      datasets: [{
        label: 'Altura Tomatera (cm)',
        data: [5, 8, 15, 22, 30, 42],
        borderColor: '#FF6B6B',
        backgroundColor: 'rgba(255, 107, 107, 0.2)',
        tension: 0.4,
        fill: true
      }, {
        label: 'Altura Lechuga (cm)',
        data: [3, 5, 8, 11, 13, 15],
        borderColor: '#06D6A0',
        backgroundColor: 'rgba(6, 214, 160, 0.2)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true, title: { display: true, text: 'Altura (cm)' } },
        x: { title: { display: true, text: 'Semanas de crecimiento' } }
      },
      plugins: { tooltip: { callbacks: { title: tooltipTitle } } }
    }
  });

  /* ===========================
     Hitos vinculados al Cronograma
     =========================== */
  const HITOS = [
    { tri:1, start:'2025-09-08', end:null,         titulo:'Inicio del proyecto',                        desc:'Lanzamiento del reto anual y equipos.',          tag:'Inicio' },
    { tri:1, start:'2025-11-03', end:'2025-11-14', titulo:'Bloque "Hola Arduino"',                       desc:'Entradas/salidas, LED y sensor temperatura.',     tag:'Tecnología' },
    { tri:1, start:'2025-12-09', end:'2025-12-12', titulo:'Defensa T1 + Votación',                       desc:'Presentación de diseños y elección para T2.',     tag:'Presentación' },
    { tri:2, start:'2026-01-07', end:'2026-01-09', titulo:'Inicio de construcción',                      desc:'Plan de obra, materiales y bancales.',            tag:'Construcción' },
    { tri:2, start:'2026-02-03', end:'2026-02-07', titulo:'Siembra + Riego v1',                          desc:'Siembra directa y riego con bomba/goteros.',      tag:'Agronomía' },
    { tri:2, start:'2026-02-09', end:'2026-02-13', titulo:'Riego v2 con Arduino',                        desc:'Relé + sensor de humedad, primeras automatizaciones.', tag:'Tecnología' },
    { tri:2, start:'2026-02-23', end:'2026-02-27', titulo:'Trasplantes + entrada en el blog',            desc:'Trasplante de plantones y difusión.',             tag:'Comunicación' },
    { tri:2, start:'2026-03-02', end:'2026-03-13', titulo:'Ajuste de riego + primeras gráficas',         desc:'Calibración y visualización de datos.',           tag:'Datos' },
    { tri:3, start:'2026-04-07', end:'2026-04-10', titulo:'Estadística I (media/mediana/moda)',          desc:'Análisis con datos reales del huerto.',           tag:'Ciencia' },
    { tri:3, start:'2026-06-02', end:'2026-06-06', titulo:'Semana del Mercadillo Solidario',             desc:'Organización, venta y donación.',                 tag:'Servicio' },
    { tri:3, start:'2026-06-09', end:'2026-06-13', titulo:'Presentaciones finales + vídeo',              desc:'Defensa final y estreno del vídeo-resumen.',      tag:'Presentación' },
    { tri:3, start:'2026-06-16', end:'2026-06-20', titulo:'Desmontaje y cierre',                         desc:'Mantenimiento y celebración final.',              tag:'Cierre' },
  ].map(h => ({ ...h, d0: new Date(h.start), d1: h.end ? new Date(h.end) : null })).sort((a,b)=>a.d0-b.d0);

  const listEl = document.getElementById('timelineList');
  const toggleBtn = document.getElementById('toggleHitos');

  function fmt(d) { return new Intl.DateTimeFormat('es-ES', { day:'2-digit', month:'short', year:'numeric' }).format(d).replace('.', ''); }
  function rango(a, b) {
    const da = new Date(a), db = b ? new Date(b) : null;
    if (!db) return fmt(da);
    const sameMonth = da.getFullYear() === db.getFullYear() && da.getMonth() === db.getMonth();
    if (sameMonth) {
      const diaA = String(da.getDate()).padStart(2, '0');
      const diaB = String(db.getDate()).padStart(2, '0');
      const mesY = new Intl.DateTimeFormat('es-ES', { month: 'short', year: 'numeric' }).format(db).replace('.', '');
      return `${diaA}–${diaB} ${mesY}`;
    }
    return `${fmt(da)} – ${fmt(db)}`;
  }
  function chip(text) {
    const palette = {
      'Inicio':'bg-emerald-100 text-emerald-700',
      'Tecnología':'bg-blue-100 text-blue-700',
      'Presentación':'bg-purple-100 text-purple-700',
      'Construcción':'bg-amber-100 text-amber-700',
      'Agronomía':'bg-lime-100 text-lime-700',
      'Comunicación':'bg-sky-100 text-sky-700',
      'Datos':'bg-cyan-100 text-cyan-700',
      'Ciencia':'bg-rose-100 text-rose-700',
      'Servicio':'bg-orange-100 text-orange-700',
      'Cierre':'bg-stone-100 text-stone-700'
    };
    const cls = palette[text] || 'bg-stone-100 text-stone-700';
    return `<span class="inline-block px-2 py-1 rounded-full text-xs font-semibold ${cls}">${text}</span>`;
  }
  function itemHTML(h) {
    const fecha = rango(h.start, h.end);
    return `
      <div class="relative ml-2">
        <span class="absolute -left-2 top-2 w-3 h-3 rounded-full bg-green-600 border-2 border-white shadow"></span>
        <div class="bg-white border border-stone-200 rounded-lg p-3 shadow-sm">
          <div class="flex items-center justify-between gap-2">
            <p class="text-sm font-bold text-stone-900">${fecha}</p>
            ${chip(h.tag)}
          </div>
          <h4 class="mt-1 font-bold text-stone-900">${h.titulo}</h4>
          <p class="text-sm text-stone-600">${h.desc}</p>
          <p class="text-xs text-stone-400 mt-1">Trimestre ${h.tri}</p>
        </div>
      </div>`;
  }

  let hitosModo = 'tri'; // 'tri' | 'all'
  let currentTri = '1';
  function renderHitos() {
    if (!listEl) return;
    const data = (hitosModo === 'all') ? HITOS : HITOS.filter(h => String(h.tri) === String(currentTri));
    listEl.innerHTML = data.map(itemHTML).join('');
    if (toggleBtn) toggleBtn.textContent = hitosModo === 'all' ? `Ver solo T${currentTri}` : 'Ver todo el curso';
  }

  // Exponer setter para sincronizar con el cronograma
  window.setCurrentTri = function (tri) { currentTri = String(tri); renderHitos(); };

  toggleBtn?.addEventListener('click', () => { hitosModo = (hitosModo === 'all') ? 'tri' : 'all'; renderHitos(); });
  document.getElementById('printTimeline')?.addEventListener('click', () => window.print());

  // Inicializar
  renderHitos();
});
