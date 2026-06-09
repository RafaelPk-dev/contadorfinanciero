let contador = 0;
let totalPaqueticos = 0;
let bolsas = 0;
let valorPago = parseFloat(localStorage.getItem('valorPago')) || 0.6;
const produccion = [];

document.addEventListener('DOMContentLoaded', () => {
  const btnContador = document.getElementById('btnContador');
  const display = document.getElementById('contadorDisplay');
  const inputPago = document.getElementById('valorPago');
  const btnIniciar = document.getElementById('btnIniciar');

  const btnGuardar = document.getElementById('btnGuardar');

  const hamburger = document.getElementById('hamburger');
  const menuLinks = document.getElementById('menuLinks');

  inputPago.value = valorPago;

  hamburger.addEventListener('click', () => {
    menuLinks.classList.toggle('oculto');
  });

  // Botón iniciar desbloquea el contador
  btnIniciar.addEventListener('click', () => {
    btnContador.disabled = false;
    btnIniciar.classList.remove('visible');
    setTimeout(() => btnIniciar.classList.add('oculto'), 500);
  });

  // Delegación de eventos para el contador
  document.addEventListener('click', (ev) => {
    if ((ev.target === btnContador || btnContador.contains(ev.target)) && !btnContador.disabled) {
      incrementarContador(display, btnContador, btnIniciar);
    }
  });

  inputPago.addEventListener('change', () => {
    valorPago = parseFloat(inputPago.value) || 0;
    localStorage.setItem('valorPago', valorPago);
  });
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

  bolsas++;
  totalPaqueticos += 100;
  const dineroBolsa = (100 * valorPago).toFixed(2);
  produccion.push({ bolsas, paqueticos: totalPaqueticos, norma: valorPago, dineroBolsa: parseFloat(dineroBolsa) });

  const dineroTotal = produccion.reduce((acc, item) => acc + item.dineroBolsa, 0).toFixed(2);
  renderTabla({ bolsas, paqueticos: totalPaqueticos, dinero: dineroTotal });

  contador = 0;
  display.textContent = contador;

  // Bloquear contador y mostrar iniciar
  btnContador.disabled = true;
  btnIniciar.classList.remove('oculto');
  setTimeout(() => btnIniciar.classList.add('visible'), 50);
}

function renderTabla(datos) {
  const tbody = document.getElementById('tablaResultados');
  tbody.innerHTML = '';

  const fila = document.createElement('tr');

  const celBolsas = document.createElement('td');
  celBolsas.textContent = datos.bolsas;
  celBolsas.setAttribute('data-label', 'Bolsas de maní');

  const celPaqueticos = document.createElement('td');
  celPaqueticos.textContent = datos.paqueticos;
  celPaqueticos.setAttribute('data-label', 'Paqueticos acumulados');

  const celDinero = document.createElement('td');
  celDinero.textContent = `$${datos.dinero}`;
  celDinero.setAttribute('data-label', 'Dinero generado');

  fila.appendChild(celBolsas);
  fila.appendChild(celPaqueticos);
  fila.appendChild(celDinero);

  tbody.appendChild(fila);
}


btnGuardar.addEventListener('click', () => {
    const hoy = new Date();
    const fechaKey = `${hoy.getFullYear()}-${hoy.getMonth() + 1}-${hoy.getDate()}`;

    // Recuperar datos previos
    const datosProduccion = JSON.parse(localStorage.getItem('produccionDias')) || {};

    // Guardar dinero total del día
    const dineroTotal = produccion.reduce((acc, item) => acc + item.dineroBolsa, 0).toFixed(2);
    datosProduccion[fechaKey] = dineroTotal;

    localStorage.setItem('produccionDias', JSON.stringify(datosProduccion));
    alert(`Datos guardados para el día ${fechaKey}: $${dineroTotal}`);
  });




// Función: reproducir sonido
function reproducirSonido() {
  // Generar beep con Web Audio API
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = ctx.createOscillator();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(880, ctx.currentTime); // tono agudo
  oscillator.connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.3); // duración 0.3s
}














