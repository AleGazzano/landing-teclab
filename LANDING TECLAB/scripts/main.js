// Helpers
const $ = s => document.querySelector(s);
const form = $('#callToAct');
const nombre = $('#suNombre');
const apellido = $('#suApellido');
const email = $('#suEmail');
const errNombre = $('#err-nombre');
const errApellido = $('#err-apellido');
const errEmail = $('#err-email');
const formMsg = $('#mensajeFormulario');

const emailOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const setErr = (inputEl, errEl, msg) => {
  if (!inputEl || !errEl) return;
  errEl.textContent = msg || '';
  inputEl.classList.toggle('is-invalid', !!msg);
};

if (form) {
  // Limpia error mientras se escribe
  [nombre, apellido, email].forEach(inp => {
    inp?.addEventListener('input', () => {
      const e = inp === nombre ? errNombre : (inp === apellido ? errApellido : errEmail);
      setErr(inp, e, '');
      if (formMsg) { formMsg.className = ''; formMsg.textContent = ''; }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const vNombre = (nombre?.value || '').trim();
    const vApellido = (apellido?.value || '').trim();
    const vEmail = (email?.value || '').trim();

    let ok = true;
    let firstInvalid = null;

    // Validaciones
    if (vNombre.length < 2) { setErr(nombre, errNombre, 'Ingresá un nombre válido (mín. 2 letras).'); ok = false; firstInvalid ||= nombre; }
    if (vApellido.length < 2) { setErr(apellido, errApellido, 'Ingresá un apellido válido (mín. 2 letras).'); ok = false; firstInvalid ||= apellido; }
    if (!emailOk(vEmail)) { setErr(email, errEmail, 'Ingresá un email válido (formato nombre@dominio).'); ok = false; firstInvalid ||= email; }

    // Si hay errores
    if (!ok) {
      if (formMsg) { formMsg.className = 'err'; formMsg.textContent = 'Revisá los campos marcados.'; }
      firstInvalid?.focus();
      return;
    }

    // Éxito (sin mensaje en página)
    alert('✅ Información enviada con éxito. ¡Gracias!');
    form.reset();
    [nombre, apellido, email].forEach(inp => inp?.classList.remove('is-invalid'));
    // (Quitado) if (formMsg) { formMsg.className = 'ok'; formMsg.textContent = 'Formulario enviado.'; }
  });
}

const btnDescarga = document.getElementById('descargaTemario');
if (btnDescarga) {
  btnDescarga.addEventListener('click', function(e) {
    e.preventDefault();
    alert('✅ Descarga completa');
  });
}

const btnSolicitar = document.getElementById('solicitarInfo');
if (btnSolicitar) {
  btnSolicitar.addEventListener('click', function(e) {
    e.preventDefault(); // evita el salto brusco
    const formEl = document.getElementById('callToAct');
    if (formEl) {
      // Intento 1: centrar con scrollIntoView
      formEl.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });

      // Fallback: re-centrar por coordenadas (por si el navegador no respeta 'center')
      setTimeout(() => {
        const rect = formEl.getBoundingClientRect();
        const target = window.scrollY + rect.top - (window.innerHeight - rect.height) / 2;
        window.scrollTo({ top: target, behavior: 'smooth' });
      }, 300);
    }
  });
}
