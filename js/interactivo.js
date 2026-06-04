/* ===== NAVEGACIÓN POR SLIDES ===== */
let slideActual = 0;
let totalSlides = 0;

function initSlides() {
  const slides = document.querySelectorAll('.slide');
  totalSlides = slides.length;
  if (totalSlides === 0) return;
  mostrarSlide(0);
}

function mostrarSlide(n) {
  const slides = document.querySelectorAll('.slide');
  slides.forEach(s => s.classList.remove('activo'));
  slideActual = Math.max(0, Math.min(n, totalSlides - 1));
  slides[slideActual].classList.add('activo');
  actualizarNavegacion();
  actualizarProgreso();
  window.scrollTo(0, 0);
}

function actualizarNavegacion() {
  const btnAnterior = document.getElementById('btn-anterior');
  const btnSiguiente = document.getElementById('btn-siguiente');
  const contador = document.getElementById('contador-slide');
  if (btnAnterior) btnAnterior.disabled = slideActual === 0;
  if (btnSiguiente) btnSiguiente.disabled = slideActual === totalSlides - 1;
  if (contador) contador.textContent = `${slideActual + 1} / ${totalSlides}`;
}

function actualizarProgreso() {
  const fill = document.getElementById('progreso-fill');
  const texto = document.getElementById('progreso-texto');
  if (!fill) return;
  const pct = Math.round(((slideActual + 1) / totalSlides) * 100);
  fill.style.width = pct + '%';
  if (texto) texto.textContent = `Progreso: ${pct}%`;
}

document.addEventListener('DOMContentLoaded', () => {
  initSlides();
  const btnAnterior = document.getElementById('btn-anterior');
  const btnSiguiente = document.getElementById('btn-siguiente');
  if (btnAnterior) btnAnterior.addEventListener('click', () => mostrarSlide(slideActual - 1));
  if (btnSiguiente) btnSiguiente.addEventListener('click', () => mostrarSlide(slideActual + 1));
});

/* ===== INTERACTIVIDAD DEL SIMULADOR ===== */
function seleccionarIcono(el) {
  const contenedor = el.closest('.win10-vista-iconos');
  if (contenedor) {
    contenedor.querySelectorAll('.win10-icono').forEach(i => i.classList.remove('seleccionado'));
  }
  el.classList.add('seleccionado');
}

function seleccionarPanelItem(el) {
  const panel = el.closest('.win10-panel-lateral');
  if (panel) {
    panel.querySelectorAll('.win10-panel-item').forEach(i => i.classList.remove('seleccionado'));
  }
  el.classList.add('seleccionado');
}

function mostrarMensaje(texto, tipo) {
  let msg = document.getElementById('msg-interactivo');
  if (!msg) {
    msg = document.createElement('div');
    msg.id = 'msg-interactivo';
    msg.style.cssText = 'position:fixed;bottom:60px;left:50%;transform:translateX(-50%);padding:14px 24px;border-radius:8px;font-size:17px;font-weight:600;z-index:9999;box-shadow:0 4px 14px rgba(0,0,0,0.2);transition:opacity 0.4s;';
    document.body.appendChild(msg);
  }
  msg.textContent = texto;
  msg.style.background = tipo === 'ok' ? '#107c10' : tipo === 'error' ? '#d83b01' : '#0078d4';
  msg.style.color = 'white';
  msg.style.opacity = '1';
  clearTimeout(msg._t);
  msg._t = setTimeout(() => { msg.style.opacity = '0'; }, 3000);
}

/* ===== ACTIVIDADES INTERACTIVAS ===== */

// Actividad: clic derecho → Nueva Carpeta
let pasoCrearCarpeta = 0;
function activarCrearCarpeta(paso, el) {
  if (paso !== pasoCrearCarpeta) {
    mostrarMensaje('¡Sigue el orden de los pasos!', 'error');
    return;
  }
  el.classList.add('resaltado');
  const mensajes = [
    '✔ ¡Bien! Ahora haz clic en "Nuevo"',
    '✔ ¡Perfecto! Ahora haz clic en "Carpeta"',
    '✔ ¡Carpeta creada! Ahora escribe el nombre'
  ];
  mostrarMensaje(mensajes[paso], 'ok');
  pasoCrearCarpeta++;
  if (pasoCrearCarpeta === 3) {
    setTimeout(() => {
      const zona = document.getElementById('carpeta-nueva-demo');
      if (zona) zona.style.display = 'flex';
      mostrarMensaje('🎉 ¡Has creado una carpeta! Escribe el nombre y pulsa Intro', 'ok');
    }, 800);
  }
}

function renombrarCarpetaDemo(el) {
  el.setAttribute('contenteditable', 'true');
  el.style.outline = '2px solid #0078d4';
  el.style.background = 'white';
  el.focus();
  const rango = document.createRange();
  rango.selectNodeContents(el);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(rango);
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      el.setAttribute('contenteditable', 'false');
      el.style.outline = '';
      el.style.background = '';
      mostrarMensaje('✔ ¡Nombre guardado! Pulsaste Intro correctamente', 'ok');
    }
  }, { once: true });
}

/* ===== QUIZ ===== */
let puntos = 0;
let preguntasRespondidas = 0;
let totalPreguntas = 0;

function initQuiz() {
  const preguntas = document.querySelectorAll('.quiz-pregunta');
  totalPreguntas = preguntas.length;
  puntos = 0;
  preguntasRespondidas = 0;
}

function responderQuiz(btn, esCorrecta, idPregunta) {
  const pregunta = document.getElementById(idPregunta);
  if (!pregunta) return;
  const opciones = pregunta.querySelectorAll('.quiz-opcion');
  opciones.forEach(op => op.classList.add('desactivada'));
  const feedback = pregunta.querySelector('.feedback-quiz');
  if (esCorrecta) {
    btn.classList.add('correcta');
    puntos++;
    if (feedback) {
      feedback.textContent = '✔ ¡Correcto!';
      feedback.className = 'feedback-quiz correcto';
      feedback.style.display = 'block';
    }
  } else {
    btn.classList.add('incorrecta');
    if (feedback) {
      const textoCorrecta = pregunta.querySelector('.quiz-opcion[data-correcta="true"]');
      feedback.textContent = '✖ No es correcto. La respuesta correcta está marcada en verde.';
      feedback.className = 'feedback-quiz incorrecto';
      feedback.style.display = 'block';
    }
    pregunta.querySelector('[data-correcta="true"]')?.classList.add('correcta');
  }
  preguntasRespondidas++;
  if (preguntasRespondidas === totalPreguntas) {
    setTimeout(() => mostrarResultadoQuiz(), 800);
  }
}

function mostrarResultadoQuiz() {
  const resultado = document.getElementById('resultado-quiz');
  if (!resultado) return;
  resultado.style.display = 'block';
  document.getElementById('puntos-obtenidos').textContent = puntos;
  let estrellas = '';
  let mensaje = '';
  if (puntos >= 9) {
    estrellas = '⭐⭐⭐';
    mensaje = '¡Excelente! Lo has aprendido muy bien.';
  } else if (puntos >= 6) {
    estrellas = '⭐⭐';
    mensaje = '¡Muy bien! Puedes repasar lo que fallaste.';
  } else {
    estrellas = '⭐';
    mensaje = 'Sigue practicando, lo conseguirás.';
  }
  document.getElementById('estrellas-quiz').textContent = estrellas;
  document.getElementById('mensaje-quiz').textContent = mensaje;
  resultado.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/* ===== JUEGO DE ARRASTRAR ===== */
let archivoArrastrado = null;
let aciertosJuego = 0;
let intentosJuego = 0;

function iniciarDragDrop() {
  document.querySelectorAll('.archivo-arrastrable').forEach(el => {
    el.setAttribute('draggable', 'true');
    el.addEventListener('dragstart', (e) => {
      archivoArrastrado = el;
      el.classList.add('arrastrando');
      e.dataTransfer.effectAllowed = 'move';
    });
    el.addEventListener('dragend', () => {
      el.classList.remove('arrastrando');
      archivoArrastrado = null;
    });
  });

  document.querySelectorAll('.carpeta-drop-zona').forEach(zona => {
    zona.addEventListener('dragover', (e) => {
      e.preventDefault();
      zona.classList.add('sobre');
    });
    zona.addEventListener('dragleave', () => {
      zona.classList.remove('sobre');
    });
    zona.addEventListener('drop', (e) => {
      e.preventDefault();
      zona.classList.remove('sobre');
      if (!archivoArrastrado) return;
      const categoriaArchivo = archivoArrastrado.dataset.categoria;
      const categoriaZona = zona.dataset.categoria;
      intentosJuego++;
      if (categoriaArchivo === categoriaZona) {
        aciertosJuego++;
        zona.classList.add('correcta-flash');
        setTimeout(() => zona.classList.remove('correcta-flash'), 800);
        const copia = document.createElement('div');
        copia.className = 'archivo-colocado';
        copia.innerHTML = `<span>${archivoArrastrado.querySelector('.af-icon').textContent}</span><span>${archivoArrastrado.querySelector('.af-nombre').textContent}</span>`;
        zona.querySelector('.archivos-dentro').appendChild(copia);
        archivoArrastrado.style.opacity = '0.3';
        archivoArrastrado.setAttribute('draggable', 'false');
        mostrarMensaje('✔ ¡Correcto!', 'ok');
      } else {
        zona.classList.add('incorrecta-flash');
        setTimeout(() => zona.classList.remove('incorrecta-flash'), 600);
        mostrarMensaje('✖ Esa no es la carpeta correcta. Inténtalo otra vez.', 'error');
      }
      verificarJuegoCompleto();
    });
  });
}

function verificarJuegoCompleto() {
  const totalArchivos = document.querySelectorAll('.archivo-arrastrable').length;
  const colocados = document.querySelectorAll('.archivo-colocado').length;
  if (colocados >= totalArchivos) {
    const resultado = document.getElementById('resultado-juego');
    if (resultado) {
      resultado.style.display = 'block';
      resultado.className = 'juego-resultado bien';
      resultado.innerHTML = `🎉 ¡Completado! Acertaste <strong>${aciertosJuego} de ${totalArchivos}</strong> archivos. ¡Muy bien!`;
      resultado.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  iniciarDragDrop();
  initQuiz();
});
