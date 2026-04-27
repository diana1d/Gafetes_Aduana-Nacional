function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function v(id) {
  return document.getElementById(id).value.trim();
}

function buildGafete(nombre, cargo, unidad, interno) {
  const tel = esc(unidad) + (interno ? ' / Int. ' + esc(interno) : '');
  const franjaHTML = `
      <img class="franja-bg" src="img/franja_inferior.png" alt=""/>
      <div class="franja-datos">
        <span class="franja-tel">${tel}</span>
      </div>`;
  const textoHTML = `
      <div class="gafete-nombre">${esc(nombre)}</div>
      <div class="gafete-cargo">${esc(cargo)}</div>`;
  return `
  <div class="gafete-wrapper">
    <img class="bg" src="img/fondo_gafete.png" alt=""/>
    <div class="gafete-text-inv">${textoHTML}</div>
    <div class="gafete-franja-inv">${franjaHTML}</div>
    <div class="gafete-text">${textoHTML}</div>
    <div class="gafete-franja">${franjaHTML}</div>
  </div>`;
}

function generarVista() {
  const sheet = document.getElementById('sheet-1');
  sheet.innerHTML =
    buildGafete(
      v('g1-nombre') || 'Nombre Apellido',
      v('g1-cargo')  || 'CARGO',
      v('g1-unidad') || 'Oficina Central: (591) – 2 – 2XXXXXX',
      v('g1-interno') || '0000'
    ) +
    buildGafete(
      v('g2-nombre') || 'Nombre Apellido',
      v('g2-cargo')  || 'CARGO',
      v('g2-unidad') || 'Oficina Central: (591) – 2 – 2XXXXXX',
      v('g2-interno') || '0000'
    );

  const pa = document.getElementById('preview-area');
  pa.style.display = 'block';
  pa.scrollIntoView({ behavior: 'smooth' });
}

function imprimir() {
  generarVista();
  setTimeout(() => window.print(), 350);
}

function toggleUnidadFija() {
  const fija = document.getElementById('unidad-fija').checked;
  const g1unidad = document.getElementById('g1-unidad');
  const label = document.getElementById('fijar-label');
  if (fija) {
    g1unidad.disabled = true;
    g1unidad.style.background = '#f3f4f6';
    label.classList.add('activo');
  } else {
    g1unidad.disabled = false;
    g1unidad.style.background = '';
    label.classList.remove('activo');
  }
}

function toggleUnidadFija2() {
  const fija = document.getElementById('unidad-fija-2').checked;
  const g2unidad = document.getElementById('g2-unidad');
  const label = document.getElementById('fijar-label-2');
  if (fija) {
    g2unidad.disabled = true;
    g2unidad.style.background = '#f3f4f6';
    label.classList.add('activo');
  } else {
    g2unidad.disabled = false;
    g2unidad.style.background = '';
    label.classList.remove('activo');
  }
}

function limpiar() {
  const fija = document.getElementById('unidad-fija').checked;
  ['g1-nombre', 'g1-cargo', 'g1-interno',
   'g2-nombre', 'g2-cargo', 'g2-interno']
    .forEach(id => document.getElementById(id).value = '');
  if (!fija) {
    document.getElementById('g1-unidad').value = '';
    document.getElementById('g2-unidad').value = '';
  }
  document.getElementById('preview-area').style.display = 'none';
}

async function descargarPDF() {
  generarVista();
  await new Promise(r => setTimeout(r, 400));

  const sheet = document.getElementById('sheet-1');
  const { jsPDF } = window.jspdf;

  const canvas = await html2canvas(sheet, {
    scale: 3,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    width: sheet.offsetWidth,
    height: sheet.offsetHeight
  });

  const imgData = canvas.toDataURL('image/jpeg', 1.0);
  const pdf = new jsPDF({ unit: 'cm', format: [21.59, 27.94], orientation: 'portrait' });
  pdf.addImage(imgData, 'JPEG', 0, 0, 21.59, 27.94);
  pdf.save('gafetes.pdf');
}

window.addEventListener('load', () => {
  if (v('g1-nombre')) generarVista();
});
