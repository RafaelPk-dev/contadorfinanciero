import { acciones } from "./acciones.js";

let contador = 0;
let valorPago = 0.6;
let accionSeleccionada = "Maní Salado"; // por defecto
const produccion = [];

// Estructura acumulada por acción
let resumenAcciones = {
  "Maní Salado": { bolsas: 0, paqueticos: 0, dinero: 0 },
  "Maní Garapiñado": { bolsas: 0, paqueticos: 0, dinero: 0 }
};

document.addEventListener('DOMContentLoaded', () => {
  const btnContador = document.getElementById('btnContador');
  const display = document.getElementById('contadorDisplay');
  const btnIniciar = document.getElementById('btnIniciar');
  const btnGuardar = document.getElementById('btnGuardar');
  const accionSelect = document.getElementById('accionSelect');
  const resumenDiv = document.getElementById('resumenProduccion');
  
  const toggleResumenBtn = document.getElementById('toggleResumen');
  const clearResumenBtn = document.getElementById('clearResumen');
  
  const hamburger = document.getElementById('hamburger');
  const overlayMenu = document.getElementById('overlayMenu');

  if (hamburger && overlayMenu) {
    hamburger.addEventListener('click', () => {
      overlayMenu.classList.toggle('visible');
    });
  }

  toggleResumenBtn.addEventListener('click', () => {
  const resumenDiv = document.getElementById('resumenProduccion');
  resumenDiv.classList.toggle('hidden');
});

clearResumenBtn.addEventListener('click', () => {
  resumenAcciones = {
    "Maní Salado": { bolsas: 0, paqueticos: 0, dinero: 0 },
    "Maní Garapiñado": { bolsas: 0, paqueticos: 0, dinero: 0 }
  };
  localStorage.setItem('resumenAcciones', JSON.stringify(resumenAcciones));
  renderResumen(document.getElementById('resumenProduccion'));
});

// 🔑 Limpiar automáticamente al terminar el día
function limpiarResumenAutomatico() {
  const ahora = new Date();
  const hora = ahora.getHours();
  if (hora === 23) { // ejemplo: a las 11pm se limpia
    resumenAcciones = {
      "Maní Salado": { bolsas: 0, paqueticos: 0, dinero: 0 },
      "Maní Garapiñado": { bolsas: 0, paqueticos: 0, dinero: 0 }
    };
    localStorage.setItem('resumenAcciones', JSON.stringify(resumenAcciones));
    renderResumen(document.getElementById('resumenProduccion'));
  }
}
setInterval(limpiarResumenAutomatico, 60000); // chequea cada minuto

  // Rellenar menú desplegable con acciones
  acciones.forEach(acc => {
    const option = document.createElement('option');
    option.value = acc.valor;
    option.textContent = acc.nombre;
    accionSelect.appendChild(option);
  });

  // Al seleccionar acción, actualizar valorPago y nombre
  accionSelect.addEventListener('change', () => {
    valorPago = parseFloat(accionSelect.value);
    accionSeleccionada = accionSelect.options[accionSelect.selectedIndex].textContent;
  });

  btnIniciar.addEventListener('click', () => {
    btnContador.disabled = false;
    btnIniciar.classList.remove('visible');
    setTimeout(() => btnIniciar.classList.add('oculto'), 500);
  });

  document.addEventListener('click', (ev) => {
    if ((ev.target === btnContador || btnContador.contains(ev.target)) && !btnContador.disabled) {
      incrementarContador(display, btnContador, btnIniciar);
    }
  });

  btnGuardar.addEventListener('click', () => {
    const hoy = new Date();
    const fechaKey = `${hoy.getFullYear()}-${hoy.getMonth() + 1}-${hoy.getDate()}`;

    const datosProduccion = JSON.parse(localStorage.getItem('produccionDias')) || {};

    if (!datosProduccion[fechaKey]) {
      datosProduccion[fechaKey] = {};
    }

    // Guardar desglose por acción
    for (const accion in resumenAcciones) {
      datosProduccion[fechaKey][accion] = resumenAcciones[accion].dinero;
    }

    // Guardar total general
    const totalGeneral = Object.values(resumenAcciones).reduce((acc, a) => acc + a.dinero, 0);
    datosProduccion[fechaKey].total = totalGeneral;

    localStorage.setItem('produccionDias', JSON.stringify(datosProduccion));

    alert(`Datos guardados para el día ${fechaKey}. Total: $${totalGeneral}`);
  });

  // 🔑 Recuperar resumen guardado al cargar
  const resumenGuardado = JSON.parse(localStorage.getItem('resumenAcciones'));
  if (resumenGuardado) {
    resumenAcciones = resumenGuardado;
  }

  renderResumen(resumenDiv);
});

function incrementarContador(display, btnContador, btnIniciar) {
  contador++;
  display.textContent = contador;

  if (contador >= 100) {
    manejarBolsa(display, btnContador, btnIniciar);
  }
}

function manejarBolsa(display, btnContador, btnIniciar) {
  reproducirSonido();

  display.classList.add('alerta');
  setTimeout(() => display.classList.remove('alerta'), 1000);

  const dineroBolsa = (100 * valorPago).toFixed(2);

  produccion.push({
    accion: accionSeleccionada,
    bolsas: 1,
    paqueticos: 100,
    dineroBolsa: parseFloat(dineroBolsa)
  });

  // Actualizar acumulado por acción
  resumenAcciones[accionSeleccionada].bolsas += 1;
  resumenAcciones[accionSeleccionada].paqueticos += 100;
  resumenAcciones[accionSeleccionada].dinero += parseFloat(dineroBolsa);

  // Guardar resumen en localStorage
  localStorage.setItem('resumenAcciones', JSON.stringify(resumenAcciones));

  // Renderizar resumen actualizado
  const resumenDiv = document.getElementById('resumenProduccion');
  renderResumen(resumenDiv);

  contador = 0;
  display.textContent = contador;

  btnContador.disabled = true;
  btnIniciar.classList.remove('oculto');
  setTimeout(() => btnIniciar.classList.add('visible'), 50);
}

function renderResumen(container) {
  if (!container) return;

  container.innerHTML = `
    <h2>Resumen de Producción</h2>
    <p>Maní Salado :Bolsas: ${resumenAcciones["Maní Salado"].bolsas}, 
       Paqueticos: ${resumenAcciones["Maní Salado"].paqueticos}, 
       Dinero: $${resumenAcciones["Maní Salado"].dinero.toFixed(2)}</p>
    <p>Maní Garapiñado :Bolsas: ${resumenAcciones["Maní Garapiñado"].bolsas}, 
       Paqueticos: ${resumenAcciones["Maní Garapiñado"].paqueticos}, 
       Dinero: $${resumenAcciones["Maní Garapiñado"].dinero.toFixed(2)}</p>
    <hr>
    <p><strong>Total Bolsas: ${resumenAcciones["Maní Salado"].bolsas + resumenAcciones["Maní Garapiñado"].bolsas}</strong></p>
    <p><strong>Total Paqueticos: ${resumenAcciones["Maní Salado"].paqueticos + resumenAcciones["Maní Garapiñado"].paqueticos}</strong></p>
    <p><strong>Total Dinero: $${(resumenAcciones["Maní Salado"].dinero + resumenAcciones["Maní Garapiñado"].dinero).toFixed(2)}</strong></p>
  `;
}

function reproducirSonido() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = ctx.createOscillator();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(880, ctx.currentTime);
  oscillator.connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + 2);
}
