document.addEventListener('DOMContentLoaded', () => {
  const calendario = document.getElementById('calendario');
  const detalleDia = document.getElementById('detalle-dia');
  const fechaSeleccionada = document.getElementById('fechaSeleccionada');
  const dineroGenerado = document.getElementById('dineroGenerado');

  const hoy = new Date();
  const mes = hoy.getMonth();
  const anio = hoy.getFullYear();

  calendario.innerHTML = "";

  const primerDia = new Date(anio, mes, 1).getDay();
  const diasMes = new Date(anio, mes + 1, 0).getDate();

  let diaSeleccionadoActual = null;

  // Menú hamburguesa con overlay
  const hamburger = document.getElementById('hamburger');
  const overlayMenu = document.getElementById('overlayMenu');

  if (hamburger && overlayMenu) {
    hamburger.addEventListener('click', () => {
      overlayMenu.classList.toggle('visible');
    });
  }

  // Rellenar espacios vacíos antes del primer día
  for (let i = 0; i < primerDia; i++) {
    const celda = document.createElement('div');
    calendario.appendChild(celda);
  }

  // Crear días del mes
  for (let dia = 1; dia <= diasMes; dia++) {
    const celda = document.createElement('div');
    celda.classList.add('dia');
    celda.textContent = dia;

    if (dia === hoy.getDate()) {
      celda.classList.add('hoy');
    }

    celda.addEventListener('click', () => {
      const fechaKey = `${anio}-${mes + 1}-${dia}`;
      const datosProduccion = JSON.parse(localStorage.getItem('produccionDias')) || {};
      const infoDia = datosProduccion[fechaKey];

      // Caso: mismo día → ocultar
      if (diaSeleccionadoActual === fechaKey && detalleDia.classList.contains('visible')) {
        detalleDia.classList.remove('visible');
        setTimeout(() => detalleDia.classList.add('oculto'), 300);
        diaSeleccionadoActual = null;
        return;
      }

      // Función para mostrar la información del día
      const mostrarInfo = () => {
        fechaSeleccionada.textContent = `Fecha: ${fechaKey}`;

        if (infoDia) {
          let detalleHTML = "";
          // Mostrar cada acción registrada (ej. Maní Salado, Maní Garapiñado)
          if (infoDia["Maní Salado"] !== undefined) {
            detalleHTML += `<p>Maní Salado: $${infoDia["Maní Salado"]}</p>`;
          }
          if (infoDia["Maní Garapiñado"] !== undefined) {
            detalleHTML += `<p>Maní Garapiñado: $${infoDia["Maní Garapiñado"]}</p>`;
          }
          // Mostrar total general
          if (infoDia.total !== undefined) {
            detalleHTML += `<p><strong>Total: $${infoDia.total}</strong></p>`;
          }
          dineroGenerado.innerHTML = detalleHTML;
        } else {
          dineroGenerado.textContent = "Sin datos";
        }
      };

      // Caso: cambiar de día
      if (detalleDia.classList.contains('visible')) {
        detalleDia.classList.remove('visible');
        setTimeout(() => {
          detalleDia.classList.add('oculto');
          mostrarInfo();
          detalleDia.classList.remove('oculto');
          setTimeout(() => detalleDia.classList.add('visible'), 50);
          diaSeleccionadoActual = fechaKey;
        }, 300);
      } else {
        mostrarInfo();
        detalleDia.classList.remove('oculto');
        setTimeout(() => detalleDia.classList.add('visible'), 50);
        diaSeleccionadoActual = fechaKey;
      }

      document.querySelectorAll('.dia').forEach(d => d.classList.remove('seleccionado'));
      celda.classList.add('seleccionado');
    });

    calendario.appendChild(celda);
  }
});
