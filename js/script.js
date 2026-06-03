function createStars() {
  const container = document.getElementById("stars");
  if (!container) return;

  for (let i = 0; i < 80; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    star.style.setProperty("--duration", (Math.random() * 3 + 2) + "s");
    star.style.setProperty("--opacity", (Math.random() * 0.5 + 0.2));
    star.style.animationDelay = Math.random() * 5 + "s";
    star.style.width = (Math.random() * 2 + 1) + "px";
    star.style.height = star.style.width;
    container.appendChild(star);
  }
}

function handleConsultaCedula() {
  const form = document.getElementById("consultaCedula");
  const prefixSelect = document.getElementById("cedulaPrefix");
  const input = document.getElementById("cedula");
  const loading = document.getElementById("loadingCedula");
  const message = document.getElementById("messageCedula");

  input.addEventListener("input", (event) => {
    event.target.value = event.target.value.replace(/[^0-9]/g, "");
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const tipo = prefixSelect.value.toLowerCase();
    const numero = input.value.trim();
    if (!tipo || numero === "") {
      showMessage(message, "Debes seleccionar un tipo y escribir un número de cédula.");
      return;
    }
    loading.style.display = "block";
    message.style.display = "none";
    mockFetch(`${CONFIG.API_BASE_URL}/consult_dni?tipo=${tipo}&numero=${numero}`)
      .then(async (res) => {
        const response = await res.json();
        if (!res.ok || !response.data) throw response;
        loading.style.display = "none";
        mostrarModal({
          first_name:          response.data.first_name          || "",
          middle_name:         response.data.middle_name         || "",
          last_name:           response.data.last_name           || "",
          second_last_name:    response.data.second_last_name    || "",
          dni_code:            response.data.dni_code            || "",
          dni_number:          response.data.dni_number          || "",
          birthdate:           response.data.birthdate           || null,
          last_company_worked: response.data.last_company_worked || null,
          marital_status:      response.data.marital_status      || null,
          sex:                 response.data.sex                 || null,
          address:             response.data.address             || null,
          phone:               response.data.phone               || null,
          email:               response.data.email               || null,
        }, "cedula", tipo.toUpperCase(), numero);
        form.reset();
      })
      .catch((err) => {
        loading.style.display = "none";
        showMessage(message, err.error || "Error en la consulta");
      });
  });
}

function handleConsultaRif() {
  const form = document.getElementById("consultaRif");
  const rifInput = document.getElementById("rif");
  const tipoSelect = document.getElementById("rifPrefix");
  const loading = document.getElementById("loadingRif");
  const message = document.getElementById("messageRif");

  if (!form || !rifInput || !tipoSelect) return;

  rifInput.addEventListener("input", (event) => {
    event.target.value = event.target.value.replace(/[^0-9]/g, "").slice(0, 9);
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const tipo = tipoSelect.value.toLowerCase();
    const numero = rifInput.value.trim();
    if (!tipo || !numero || numero.length !== 9) {
      showMessage(message, "Debes seleccionar el tipo y escribir el número de RIF (9 dígitos).");
      return;
    }
    loading.style.display = "block";
    message.style.display = "none";
    mockFetch(`${CONFIG.API_BASE_URL}/consulta-rif?tipo=${tipo}&numero=${numero}`)
      .then(async (res) => {
        const response = await res.json();
        if (!res.ok || !response.data) throw response;
        loading.style.display = "none";
        mostrarModal({
          nombre: response.data.name,
          actividad: response.data.activity,
          rif: response.data.rif,
        }, "rif", tipo.toUpperCase(), numero);
        form.reset();
      })
      .catch((err) => {
        loading.style.display = "none";
        showMessage(message, err.error || "Error en la consulta");
      });
  });
}

function showMessage(el, text) {
  el.style.display = "block";
  el.className = "message error";
  el.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${text}`;
}

function mostrarModal(datos, tipo, prefix, numero) {
  const modal = document.getElementById("modalDatos");
  const modalBody = document.getElementById("modalBody");

  if (tipo === "rif") {
    modalBody.innerHTML = `
      <div class="result-card rif-result">
        <div class="result-header">
          <div class="result-icon rif-icon">
            <i class="fas fa-building"></i>
          </div>
          <div class="result-title">
            <span class="result-label">RIF Consultado</span>
            <h3>${datos.rif || `${prefix}${numero}`}</h3>
          </div>
        </div>
        <div class="result-body">
          <div class="result-field">
            <span class="field-icon"><i class="fas fa-store"></i></span>
            <div>
              <span class="field-label">Razón Social</span>
              <span class="field-value">${datos.nombre || "No disponible"}</span>
            </div>
          </div>
          <div class="result-field">
            <span class="field-icon"><i class="fas fa-briefcase"></i></span>
            <div>
              <span class="field-label">Actividad Económica</span>
              <span class="field-value">${datos.actividad || "No disponible"}</span>
            </div>
          </div>
        </div>
      </div>`;
  } else {
    const genderInfo = datos.sex === "M"
      ? { icon: "♂", color: "#3b82f6", text: "Masculino" }
      : datos.sex === "F"
      ? { icon: "♀", color: "#ec4899", text: "Femenino" }
      : { icon: "—", color: "#64748b", text: "No disponible" };

    const fullName = [datos.first_name, datos.middle_name, datos.last_name, datos.second_last_name].filter(Boolean).join(" ");
    const cedulaDisplay = datos.dni_code && datos.dni_number
      ? `${datos.dni_code}${datos.dni_number}`
      : `${prefix}${numero}`;

    const val = (v) => v || "No disponible";

    modalBody.innerHTML = `
      <div class="result-card cedula-result">
        <div class="result-header">
          <div class="result-icon cedula-icon">
            <i class="fas fa-id-card"></i>
          </div>
          <div class="result-title">
            <span class="result-label">Cédula Consultada</span>
            <h3>${cedulaDisplay}</h3>
          </div>
        </div>
        <div class="result-body">
          <div class="result-field full-width">
            <span class="field-icon"><i class="fas fa-user"></i></span>
            <div>
              <span class="field-label">Nombre Completo</span>
              <span class="field-value">${val(fullName)}</span>
            </div>
          </div>
          <div class="result-field">
            <span class="field-icon"><i class="fas fa-birthday-cake"></i></span>
            <div>
              <span class="field-label">Nacimiento</span>
              <span class="field-value">${val(datos.birthdate)}</span>
            </div>
          </div>
          <div class="result-field">
            <span class="field-icon"><i class="fas fa-building"></i></span>
            <div>
              <span class="field-label">Última Empresa (ivss)</span>
              <span class="field-value">${val(datos.last_company_worked)}</span>
            </div>
          </div>
          <div class="result-field">
            <span class="field-icon"><i class="fas fa-venus-mars"></i></span>
            <div>
              <span class="field-label">Sexo</span>
              <span class="field-value" style="color: ${genderInfo.color}">${genderInfo.icon} ${genderInfo.text}</span>
            </div>
          </div>
          <div class="result-field">
            <span class="field-icon"><i class="fas fa-ring"></i></span>
            <div>
              <span class="field-label">Estado Civil</span>
              <span class="field-value">${val(datos.marital_status)}</span>
            </div>
          </div>
          <div class="result-field">
            <span class="field-icon"><i class="fas fa-map-marker-alt"></i></span>
            <div>
              <span class="field-label">Dirección</span>
              <span class="field-value">${val(datos.address)}</span>
            </div>
          </div>
          <div class="result-field">
            <span class="field-icon"><i class="fas fa-phone"></i></span>
            <div>
              <span class="field-label">Teléfono</span>
              <span class="field-value">${val(datos.phone)}</span>
            </div>
          </div>
          <div class="result-field">
            <span class="field-icon"><i class="fas fa-envelope"></i></span>
            <div>
              <span class="field-label">Email</span>
              <span class="field-value">${val(datos.email)}</span>
            </div>
          </div>
        </div>
      </div>`;
  }

  modal.style.display = "flex";
}

document.addEventListener("DOMContentLoaded", () => {
  createStars();
  handleConsultaCedula();
  handleConsultaRif();

  const modal = document.getElementById("modalDatos");
  const closeBtn = document.getElementById("closeModal");

  if (modal) {
    modal.style.display = "none";
    window.onclick = (event) => {
      if (event.target === modal) modal.style.display = "none";
    };
  }
  if (closeBtn) {
    closeBtn.onclick = () => { modal.style.display = "none"; };
  }
});
