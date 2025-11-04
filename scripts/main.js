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

const THEME = {
  brand: '#008000',     
  brandHover: '#006600',
  accent: '#13a3db',    
  text: '#333',
  surface: '#ffffff',
  backdrop: 'rgba(0,0,0,0.35)',
  width: 380            
};

const hasSwal = () => typeof Swal !== 'undefined';

const modalBase = (opts = {}) => {
  const base = {
    width: THEME.width,
    background: THEME.surface,
    color: THEME.text,
    confirmButtonColor: THEME.brand,
    confirmButtonText: 'Aceptar',
    iconColor: THEME.brand,
    backdrop: THEME.backdrop,
    showClass: { popup: 'swal2-noanimation' },
    hideClass: { popup: '' }
  };
  if (hasSwal()) {
    return Swal.fire({ ...base, ...opts });
  } else {
    const t = opts.title ? `${opts.title}\n` : '';
    const x = opts.text ? `${opts.text}` : '';
    alert(`${t}${x}`);
    return Promise.resolve();
  }
};

const modalSuccess = (title, text = '') =>
  modalBase({ title, text, icon: 'success' });

const modalInfo = (title, text = '') =>
  modalBase({ title, text, icon: 'info', iconColor: THEME.accent });

const toast = (title, icon = 'success') => {
  if (hasSwal()) {
    const T = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2200,
      timerProgressBar: true,
      background: THEME.surface,
      color: THEME.text,
      iconColor: icon === 'success' ? THEME.brand : THEME.accent,
      didOpen: (t) => {
        t.addEventListener('mouseenter', Swal.stopTimer);
        t.addEventListener('mouseleave', Swal.resumeTimer);
      }
    });
    return T.fire({ title, icon });
  } else {
    alert(title);
    return Promise.resolve();
  }
};

const emailOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const setErr = (inputEl, errEl, msg) => {
  if (!inputEl || !errEl) return;
  errEl.textContent = msg || '';
  inputEl.classList.toggle('is-invalid', !!msg);
};

let busy = false;
const submitBtn = form?.querySelector('input[type="submit"], button[type="submit"]');
const originalText = submitBtn ? (('value' in submitBtn) ? submitBtn.value : submitBtn.textContent) : '';

const setBusy = (v) => {
  if (!submitBtn) return;
  busy = v;
  submitBtn.disabled = v;
  if ('value' in submitBtn) submitBtn.value = v ? 'Enviando…' : originalText;
  else submitBtn.textContent = v ? 'Enviando…' : originalText;
  submitBtn.style.opacity = v ? '0.85' : '1';
  submitBtn.style.cursor = v ? 'not-allowed' : 'pointer';
};

if (form) {
  form.addEventListener('submit', (e) => {
    if (busy) e.preventDefault();
  });
}

if (form) {
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

    setBusy(true);
    modalSuccess('La informacion del curso fue enviada', '¡Gracias!')
      .then(() => {
        form.reset();
        [nombre, apellido, email].forEach(inp => inp?.classList.remove('is-invalid'));
        nombre?.focus();
        if (formMsg) { formMsg.className = ''; formMsg.textContent = ''; }
      })
      .finally(() => setBusy(false));
  });
}


const btnDescarga = document.getElementById('descargaTemario');
if (btnDescarga) {
  btnDescarga.addEventListener('click', function(e) {
    e.preventDefault();
    toast('Descarga iniciada', 'success'); 
  });
}

const btnSolicitar = document.getElementById('solicitarInfo');
if (btnSolicitar) {
  btnSolicitar.addEventListener('click', function(e) {
    e.preventDefault();
    const formEl = document.getElementById('callToAct');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });

      setTimeout(() => {
        const rect = formEl.getBoundingClientRect();
        const target = window.scrollY + rect.top - (window.innerHeight - rect.height) / 2;
        window.scrollTo({ top: target, behavior: 'smooth' });
      }, 300);
    }
  });
}

(() => {
  const SHOW_AFTER = 400;            
  const ONLY_DESKTOP = false;        

  if (ONLY_DESKTOP && window.innerWidth < 768) return;

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Volver arriba');
  btn.setAttribute('title', 'Volver arriba');
  btn.textContent = '↑';

  Object.assign(btn.style, {
    position: 'fixed',
    right: '18px',
    bottom: '18px',
    zIndex: '9999',
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px',
    backgroundColor: '#008000',
    color: '#fff',
    boxShadow: '0 6px 14px rgba(0,0,0,0.15)',
    opacity: '0',
    pointerEvents: 'none',
    transform: 'translateY(6px)',
    transition: 'opacity .2s ease, transform .2s ease'
  });

  btn.onmouseenter = () => (btn.style.backgroundColor = '#006600');
  btn.onmouseleave = () => (btn.style.backgroundColor = '#008000');
  btn.onclick = () => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
  };

  document.body.appendChild(btn);

  const toggle = () => {
    if (window.scrollY > SHOW_AFTER) {
      btn.style.opacity = '1';
      btn.style.pointerEvents = 'auto';
      btn.style.transform = 'translateY(0)';
    } else {
      btn.style.opacity = '0';
      btn.style.pointerEvents = 'none';
      btn.style.transform = 'translateY(6px)';
    }
  };
  window.addEventListener('scroll', toggle, { passive: true });
  toggle(); 
})();