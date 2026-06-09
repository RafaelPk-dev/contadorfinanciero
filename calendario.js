document.addEventListener('DOMContentLoaded', () => {
  const calendario = document.getElementById('calendario');
  const detalleDia = document.getElementById('detalle-dia');
  const fechaSeleccionada = document.getElementById('fechaSeleccionada');
  const dineroGenerado = document.getElementById('dineroGenerado');

  // Recuperar datos guardados
  const datosProduccion = JSON.parse(localStorage.getItem('produccionDias')) || {};

  const hoy = new Date();
  const mes = hoy.getMonth();
  const anio = hoy.getFullYear();

  // Generar calendario del mes actual
  const primerDia = new Date(anio, mes, 1).getDay();
  const diasMes = new Date(anio, mes + 1, 0).getDate();

  // Rellenar espacios vacíos antes del primer día
  for (let i = 0; i < primerDia; i++) {
    const celda = document.createElement('div');
    calendario.appendChild(celda);
  }

  // Crear días
  for (let dia = 1; dia <= diasMes; dia++) {
    const celda = document.createElement('div');
    celda.classList.add('dia');
    celda.textContent = dia;

    if (dia === hoy.getDate()) {
      celda.classList.add('hoy');
    }

    celda.addEventListener('click', () => {
      const fechaKey = `${anio}-${mes + 1}-${dia}`;
      fechaSeleccionada.textContent = `Fecha: ${fechaKey}`;
      dineroGenerado.textContent = `Dinero generado: $${datosProduccion[fechaKey] || 0}`;
      detalleDia.classList.remove('oculto');
    });

    calendario.appendChild(celda);
  }
});
