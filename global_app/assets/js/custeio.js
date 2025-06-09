// ===================================================================
// 1. SISTEMA DE GERENCIAMENTO DE ESTADO GLOBAL
// ===================================================================

const FormStateManager = {
  // Armazena dados de todas as atividades
  atividadesData: {},

  // Armazena dados de todas as culturas (dentro de Cultura Anual)
  culturasData: {},

  // Salva dados de um formulário específico
  saveFormData: function (formId, data) {
    if (formId.startsWith("cultura-") || formId.startsWith("perennial-")) {
      this.culturasData[formId] = data;
    } else {
      this.atividadesData[formId] = data;
    }
    // Auto-save no localStorage
    this.saveToLocalStorage();
  },

  // Recupera dados de um formulário específico
  getFormData: function (formId) {
    if (formId.startsWith("cultura-") || formId.startsWith("perennial-")) {
      return this.culturasData[formId] || {};
    } else {
      return this.atividadesData[formId] || {};
    }
  },

  // Coleta dados de todos os campos de um formulário
  collectFormData: function (formElement) {
    const data = {};
    const inputs = formElement.querySelectorAll("input, select, textarea");
    inputs.forEach((input) => {
      if (input.type === "checkbox" || input.type === "radio") {
        data[input.name] = input.checked;
      } else {
        data[input.name] = input.value;
      }
    });
    return data;
  },

  // Restaura dados em um formulário
  restoreFormData: function (formElement, data) {
    Object.keys(data).forEach((fieldName) => {
      const field = formElement.querySelector(`[name="${fieldName}"]`);
      if (field) {
        if (field.type === "checkbox" || field.type === "radio") {
          field.checked = data[fieldName];
        } else {
          field.value = data[fieldName];
        }
      }
    });
  },

  // Persistência em LocalStorage
  // Persistência em LocalStorage
  saveToLocalStorage: function () {
    try {
      localStorage.setItem(
        "formData_atividades",
        JSON.stringify(this.atividadesData)
      );
      localStorage.setItem(
        "formData_culturas",
        JSON.stringify(this.culturasData)
      );
    } catch (e) {
      console.warn("Erro ao salvar no localStorage:", e);
    }
  },

  loadFromLocalStorage: function () {
    try {
      const atividadesData = localStorage.getItem("formData_atividades");
      const culturasData = localStorage.getItem("formData_culturas");

      if (atividadesData) {
        this.atividadesData = JSON.parse(atividadesData);
      }
      if (culturasData) {
        this.culturasData = JSON.parse(culturasData);
      }
    } catch (e) {
      console.warn("Erro ao carregar do localStorage:", e);
    }
  },

  clearLocalStorage: function () {
    localStorage.removeItem("formData_atividades");
    localStorage.removeItem("formData_culturas");
    this.atividadesData = {};
    this.culturasData = {};
  },
};

// ===================================================================
// 2. CONTROLE DE NAVEGAÇÃO ENTRE STEPS (MANTIDO ORIGINAL)
// ===================================================================

document.addEventListener("DOMContentLoaded", function () {
  // Carregar dados salvos
  FormStateManager.loadFromLocalStorage();

  const steps = document.querySelectorAll(".step");
  const progressIndicator = document.getElementById("progress-indicator");

  let currentStep = 0; // index de steps (0 => step-1, 1 => step-2, 2 => step-3, 3 => step-4)

  // Função para exibir somente o step “index” e atualizar indicador
  function showStep(index) {
    steps.forEach((stepDiv, i) => {
      if (i === index) {
        stepDiv.classList.add("active");
      } else {
        stepDiv.classList.remove("active");
      }
    });
    progressIndicator.textContent = `Etapa ${index + 1} de ${steps.length}`;
    currentStep = index;
  }

  // Botão “Próximo” da Etapa 1
  document.getElementById("next-1").addEventListener("click", () => {
    // Aqui você pode validar campos de step 1 antes de avançar, se desejar
    showStep(1);
  });

  // Botão “Próximo” da Etapa 2
  document.getElementById("next-2").addEventListener("click", () => {
    // Aqui você pode validar campos de step 2 antes de avançar, se desejar
    showStep(2);
  });

  // Botão “Próximo” da Etapa 3
  document.getElementById("next-3").addEventListener("click", () => {
    const selecionadas = document.querySelectorAll(
      'input[name="atividade_props[]"]:checked'
    );
    if (selecionadas.length === 0) {
      alert("Por favor, selecione pelo menos uma atividade rural.");
      return;
    }
    showStep(3); // Avançar para Etapa 4
  });

  // Botão “Anterior” da Etapa 2
  document.getElementById("prev-2").addEventListener("click", () => {
    showStep(0);
  });

  // Botão “Anterior” da Etapa 3
  document.getElementById("prev-3").addEventListener("click", () => {
    showStep(1);
  });

  // Botão “Anterior” da Etapa 4
  document.getElementById("prev-4").addEventListener("click", () => {
    showStep(2);
  });
  // Botão “Próximo” da Etapa 4
  document.getElementById("next-4").addEventListener("click", () => {
    showStep(4); // Avançar para a Etapa 5
  });
  // Botão “Anterior” da Etapa 5
  document.getElementById("prev-5").addEventListener("click", () => {
    showStep(3); // Voltar para a Etapa 4
  });
  document.getElementById("next-5").addEventListener("click", () => {
    const quantidade = parseInt(
      document.getElementById("num_secundarias").value
    );

    if (isNaN(quantidade)) {
      alert("Por favor, selecione a quantidade de propriedades secundárias.");
      return;
    }

    if (quantidade === 0) {
      showStep(5); // Avança direto se não tiver propriedades secundárias
      return;
    }

    let valid = true;
    for (let i = 1; i <= quantidade; i++) {
      const select = document.querySelector(
        `[name="secundaria_proprietario_${i}"]`
      );
      if (!select || select.value === "") {
        valid = false;
      }
    }

    if (!valid) {
      alert(
        'Preencha o campo "Você é o proprietário?" para todas as propriedades secundárias.'
      );
      return;
    }

    showStep(5); // Avançar para Etapa 6
  });

  document
    .getElementById("prev-6")
    .addEventListener("click", () => showStep(4));
  // Botão “Finalizar” da Etapa 4
  document.getElementById("finish").addEventListener("click", () => {
    // Se quiser submeter o formulário, use:
    // document.getElementById("upgradeForm").submit();
    //
    // No exemplo anterior, havia um link “Continue” para paymentMethod.html.
    // Caso queira apenas redirecionar para a próxima página, use:
    window.location.href = "paymentMethod.html"; // Redireciona para outra página (se necessário)
  });
});

// ===================================================================
// 3. FUNÇÃO updateSelections() CORRIGIDA
// ===================================================================

function updateSelections() {
  const checkboxes = document.querySelectorAll(
    'input[name="atividade_props[]"]:checked'
  );
  const selecaoAtividades = document.getElementById("selecaoAtividades");
  const formulariosAtividadesContainer = document.getElementById(
    "formulariosAtividadesContainer"
  );

  // SOLUÇÃO: Salvar dados antes de qualquer modificação
  saveAllFormsData();

  // Obter atividades atualmente selecionadas
  const atividadesSelecionadas = Array.from(checkboxes).map((cb) => cb.value);

  // Obter atividades já renderizadas
  const atividadesRenderizadas = Array.from(
    formulariosAtividadesContainer.querySelectorAll(".form-atividade")
  ).map((form) => form.getAttribute("data-atividade"));

  // Remover formulários de atividades desmarcadas
  atividadesRenderizadas.forEach((atividade) => {
    if (!atividadesSelecionadas.includes(atividade)) {
      const formToRemove = formulariosAtividadesContainer.querySelector(
        `[data-atividade="${atividade}"]`
      );
      if (formToRemove) {
        formToRemove.remove();
      }
    }
  });

  // Adicionar formulários para novas atividades selecionadas
  atividadesSelecionadas.forEach((atividade) => {
    if (!atividadesRenderizadas.includes(atividade)) {
      // Criar novo formulário
      const form = document.createElement("div");
      form.classList.add("form-atividade");
      form.setAttribute("data-atividade", atividade);
      form.innerHTML = getFormHtml(atividade);
      formulariosAtividadesContainer.appendChild(form);

      // Restaurar dados salvos
      const savedData = FormStateManager.getFormData(atividade);
      if (Object.keys(savedData).length > 0) {
        FormStateManager.restoreFormData(form, savedData);
      }

      // Adicionar auto-save
      addAutoSaveListeners(form, atividade);

      // Se for Cultura Anual, restaurar estado das culturas
      if (atividade === "Cultura Anual") {
        restoreCultureState();
      }
    }
  });

  // Atualizar lista de atividades selecionadas
  updateAtividadesList(atividadesSelecionadas);
}

// ===================================================================
// 4. FUNÇÕES AUXILIARES PARA PRESERVAÇÃO DE ESTADO
// ===================================================================

function saveAllFormsData() {
  // Salvar dados das atividades
  const formsAtividades = document.querySelectorAll(".form-atividade");
  formsAtividades.forEach((form) => {
    const atividade = form.getAttribute("data-atividade");
    const data = FormStateManager.collectFormData(form);
    FormStateManager.saveFormData(atividade, data);
  });

  // Salvar dados das culturas
  const formsCulturas = document.querySelectorAll(".form-cultura");
  formsCulturas.forEach((form) => {
    const culturaId = form.id.replace("form-", "cultura-");
    const data = FormStateManager.collectFormData(form);
    FormStateManager.saveFormData(culturaId, data);
  });
}

function updateAtividadesList(atividades) {
  const selecaoAtividades = document.getElementById("selecaoAtividades");
  selecaoAtividades.innerHTML = "";

  atividades.forEach((atividade) => {
    const listItem = document.createElement("li");
    listItem.classList.add("list-group-item");
    listItem.textContent = atividade;
    selecaoAtividades.appendChild(listItem);
  });
}

function addAutoSaveListeners(formElement, formId) {
  const inputs = formElement.querySelectorAll("input, select, textarea");

  inputs.forEach((input) => {
    // Salvar dados a cada mudança
    input.addEventListener("change", function () {
      const data = FormStateManager.collectFormData(formElement);
      FormStateManager.saveFormData(formId, data);
    });

    // Para inputs de texto, salvar também ao digitar (com debounce)
    if (
      input.type === "text" ||
      input.type === "number" ||
      input.tagName === "TEXTAREA"
    ) {
      let timeout;
      input.addEventListener("input", function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          const data = FormStateManager.collectFormData(formElement);
          FormStateManager.saveFormData(formId, data);
        }, 500);
      });
    }
  });
}

// ===================================================================
// 6. FUNÇÃO getFormHtml() MANTIDA ORIGINAL
// ===================================================================

function getFormHtml(atividade) {
  let formHtml = "";

  switch (atividade) {
    case "Cultura Anual":
      formHtml = `
    <!-- Título do formulário centralizado -->
    <h6 class="text-center">Cultura Anual</h6>

    <!-- Selecione as culturas anuais diretamente -->
    <div class="mt-3 text-center">
      <h6 class="text-center">Selecione uma ou mais cultura anual:</h6>
      <div class="d-flex justify-content-center">
        <div class="btn-group" role="group">
          <button
            type="button"
            class="btn btn-info"
            onclick="toggleCultureSelection(\'Algodão\')"
          >
            Algodão
          </button>
          <button
            type="button"
            class="btn btn-info"
            onclick="toggleCultureSelection(\'Arroz\')"
          >
            Arroz
          </button>
          <button
            type="button"
            class="btn btn-info"
            onclick="toggleCultureSelection(\'Milho\')"
          >
            Milho
          </button>
          <button
            type="button"
            class="btn btn-info"
            onclick="toggleCultureSelection(\'Soja\')"
          >
            Soja
          </button>
          <button
            type="button"
            class="btn btn-info"
            onclick="toggleCultureSelection(\'Sorgo\')"
          >
            Sorgo
          </button>
          <button
            type="button"
            class="btn btn-info"
            onclick="toggleCultureSelection(\'Trigo\')"
          >
            Trigo
          </button>
        </div>
      </div>
    </div>

    <!-- Caixa para exibir as culturas selecionadas -->
    <div class="mt-3 text-center">
      <h6 class="text-center">Culturas Selecionadas:</h6>
      <ul class="list-group d-inline-block text-start" id="selectedCulturesList" style="min-width: 200px;">
        <!-- As seleções do usuário aparecerão aqui -->
      </ul>
    </div>

    <!-- Container para os formulários dinâmicos das culturas selecionadas -->
    <div id="culturasFormsContainer" class="mt-4">
      <!-- Formulários para cada cultura selecionada aparecerão aqui -->
    </div>
`;

      break;

    case "Cultura Perene":
      formHtml = `
        <h6 class="text-center">Cultura Perene</h6>
        <div class="mt-3 text-center">
          <h6>O produtor desenvolve mais de uma cultura perene?</h6>
          <div class="d-flex justify-content-center">
            <div class="btn-group" role="group">
              <button type="button" class="btn btn-info" onclick="togglePerennialSelection('Cana-de-açúcar')">Cana-de-açúcar</button>
              <button type="button" class="btn btn-info" onclick="togglePerennialSelection('Café Arábica')">Café Arábica</button>
              <button type="button" class="btn btn-info" onclick="togglePerennialSelection('Café')">Café</button>
              <button type="button" class="btn btn-info" onclick="togglePerennialSelection('Laranja para')">Laranja para</button>
              <button type="button" class="btn btn-info" onclick="togglePerennialSelection('Laranja de mesa')">Laranja de mesa</button>
            </div>
          </div>
        </div>
        <div class="mt-3 text-center">
          <h6>Culturas Perenes Selecionadas:</h6>
          <ul class="list-group d-inline-block text-start" id="selectedPerennialList" style="min-width:200px;"></ul>
        </div>
        <div id="perennialFormsContainer" class="mt-4"></div>
      `;
      break;
    case "Agricultura Geral":
      formHtml = `
            <h6>Agricultura Geral</h6>
            <input type="text" class="form-control mb-2" name="agricultura_geral_descricao" placeholder="Descrição da produção agrícola" />
            <input type="number" class="form-control" name="agricultura_geral_producao" placeholder="Produção estimada (ton)" />
          `;
      break;
    case "Bovino de Corte":
      formHtml = `
            <h6>Bovino de Corte</h6>
            <input type="number" class="form-control mb-2" name="bovino_corte_cabecas" placeholder="Quantidade de cabeças" />
            <input type="text" class="form-control" name="bovino_corte_sistema" placeholder="Sistema de criação" />
          `;
      break;
    case "Bovino de Leite":
      formHtml = `
            <h6>Bovino de Leite</h6>
            <input type="number" class="form-control mb-2" name="bovino_leite_vacas" placeholder="Quantidade de vacas leiteiras" />
            <input type="number" class="form-control" name="bovino_leite_producao" placeholder="Produção diária (litros)" />
          `;
      break;
    case "Pecuária Geral":
      formHtml = `
            <h6>Pecuária Geral</h6>
            <input type="text" class="form-control mb-2" name="pecuaria_geral_tipo" placeholder="Tipo de pecuária" />
            <input type="number" class="form-control" name="pecuaria_geral_animais" placeholder="Quantidade total de animais" />
          `;
      break;
    default:
      formHtml = `<p>Formulário não disponível para a atividade selecionada.</p>`;
  }

  return formHtml;
}

// ===================================================================
// 5. SISTEMA DE CULTURAS MELHORADO
// ===================================================================

let selectedAnnualCultures = [];
let selectedPerennialCultures = [];

// -------- CULTURA ANUAL --------

function toggleCultureSelection(culture) {
  saveAllCulturesData();
  const index = selectedAnnualCultures.indexOf(culture);
  if (index > -1) {
    selectedAnnualCultures.splice(index, 1);
    removeCultureForm(culture, "anual");
  } else {
    addCultureForm(culture, "anual");
  }
  updateSelectedCulturesList("anual");
  updateCultureButtons("anual");
  FormStateManager.saveFormData(
    "selectedAnnualCultures",
    selectedAnnualCultures
  );
}

function restoreCultureState() {
  const savedCultures = FormStateManager.getFormData("selectedAnnualCultures");
  if (Array.isArray(savedCultures)) {
    selectedAnnualCultures = savedCultures;
    selectedAnnualCultures.forEach((culture) =>
      addCultureForm(culture, "anual")
    );
    updateSelectedCulturesList("anual");
    updateCultureButtons("anual");
  }
}

// -------- CULTURA PERENE --------

function togglePerennialSelection(culture) {
  saveAllCulturesData();
  const idx = selectedPerennialCultures.indexOf(culture);
  if (idx > -1) {
    selectedPerennialCultures.splice(idx, 1);
    removeCultureForm(culture, "perene");
  } else {
    addCultureForm(culture, "perene");
  }
  updateSelectedCulturesList("perene");
  updateCultureButtons("perene");
  FormStateManager.saveFormData(
    "selectedPerennialCultures",
    selectedPerennialCultures
  );
}

function restorePerennialState() {
  const saved = FormStateManager.getFormData("selectedPerennialCultures");
  if (Array.isArray(saved)) {
    selectedPerennialCultures = saved;
    selectedPerennialCultures.forEach((culture) =>
      addCultureForm(culture, "perene")
    );
    updateSelectedCulturesList("perene");
    updateCultureButtons("perene");
  }
}

// --------- GERENCIAMENTO DE FORMULÁRIOS DINÂMICOS ---------

function addCultureForm(culture, tipo) {
  let container, prefix, keyArr, formHtml;
  if (tipo === "anual") {
    container = document.getElementById("culturasFormsContainer");
    prefix = "cultura-";
    keyArr = selectedAnnualCultures;
    formHtml = getCultureFormHtml(culture);
  } else {
    container = document.getElementById("perennialFormsContainer");
    prefix = "perennial-";
    keyArr = selectedPerennialCultures;
    formHtml = getPerennialFormHtml(culture);
  }
  if (!container) return;
  if (document.getElementById(`form-${culture}`)) return;

  keyArr.push(culture);

  const formDiv = document.createElement("div");
  formDiv.className = "form-cultura";
  formDiv.id = `form-${culture}`;
  formDiv.innerHTML = formHtml;
  container.appendChild(formDiv);

  const savedData = FormStateManager.getFormData(`${prefix}${culture}`);
  if (Object.keys(savedData).length > 0) {
    FormStateManager.restoreFormData(formDiv, savedData);
  }
  addAutoSaveListeners(formDiv, `${prefix}${culture}`);
}

function removeCultureForm(culture, tipo) {
  let prefix, keyArr;
  if (tipo === "anual") {
    prefix = "cultura-";
    keyArr = selectedAnnualCultures;
  } else {
    prefix = "perennial-";
    keyArr = selectedPerennialCultures;
  }
  const idx = keyArr.indexOf(culture);
  if (idx > -1) keyArr.splice(idx, 1);
  if (document.getElementById(`form-${culture}`)) {
    const form = document.getElementById(`form-${culture}`);
    const data = FormStateManager.collectFormData(form);
    FormStateManager.saveFormData(`${prefix}${culture}`, data);
    form.remove();
  }
}

// --------- AUTO-SAVE E RESTAURAÇÃO ---------

function saveAllFormsData() {
  // Salvar dados das atividades
  const formsAtividades = document.querySelectorAll(".form-atividade");
  formsAtividades.forEach((form) => {
    const atividade = form.getAttribute("data-atividade");
    const data = FormStateManager.collectFormData(form);
    FormStateManager.saveFormData(atividade, data);
  });
  // Salvar dados das culturas
  saveAllCulturesData();
}

function saveAllCulturesData() {
  const formsCulturas = document.querySelectorAll(".form-cultura");
  formsCulturas.forEach((form) => {
    let culturaId = form.id.replace("form-", "");
    if (selectedAnnualCultures.includes(culturaId)) {
      culturaId = "cultura-" + culturaId;
    } else if (selectedPerennialCultures.includes(culturaId)) {
      culturaId = "perennial-" + culturaId;
    }
    const data = FormStateManager.collectFormData(form);
    FormStateManager.saveFormData(culturaId, data);
  });
}

function addAutoSaveListeners(formElement, formId) {
  const inputs = formElement.querySelectorAll("input, select, textarea");
  inputs.forEach((input) => {
    input.addEventListener("change", function () {
      const data = FormStateManager.collectFormData(formElement);
      FormStateManager.saveFormData(formId, data);
    });
    if (
      input.type === "text" ||
      input.type === "number" ||
      input.tagName === "TEXTAREA"
    ) {
      let timeout;
      input.addEventListener("input", function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          const data = FormStateManager.collectFormData(formElement);
          FormStateManager.saveFormData(formId, data);
        }, 500);
      });
    }
  });
}

// ---------- LISTAS VISUAIS DE SELECIONADOS ----------

function updateSelectedCulturesList(tipo) {
  let list, cultures;
  if (tipo === "anual") {
    list = document.getElementById("selectedCulturesList");
    cultures = selectedAnnualCultures;
  } else {
    list = document.getElementById("selectedPerennialList");
    cultures = selectedPerennialCultures;
  }
  if (!list) return;
  list.innerHTML = "";
  cultures.forEach((culture) => {
    const listItem = document.createElement("li");
    listItem.className = "list-group-item";
    listItem.textContent = culture;
    list.appendChild(listItem);
  });
}

function updateCultureButtons(tipo) {
  let selector, arr;
  if (tipo === "anual") {
    selector = '[onclick^="toggleCultureSelection"]';
    arr = selectedAnnualCultures;
  } else {
    selector = '[onclick^="togglePerennialSelection"]';
    arr = selectedPerennialCultures;
  }
  document.querySelectorAll(selector).forEach((btn) => {
    const text = btn.textContent.trim();
    btn.classList.toggle("btn-success", arr.includes(text));
    btn.classList.toggle("btn-info", !arr.includes(text));
  });
}

// ===================================================================
// 7. FUNÇÃO getCultureFormHtml() MANTIDA ORIGINAL
// ===================================================================
function getPerennialFormHtml(culture) {
  return `
    <h6 class="fw-bold text-center mb-3">${culture}</h6>
    <div class="mb-3">
      <label>Ano de previsão da colheita:</label>
      <input type="number" class="form-control" name="${culture}_ano_previsao" required />
    </div>
    <h6>Histórico de safras anteriores</h6>
    ${[3, 2, 1]
      .map(
        (i) => `
      <div class="mb-3">
        <label>${i} anos atrás (ha):</label>
        <input type="number" step="0.01" class="form-control" name="${culture}_hist_${i}anos" required />
      </div>
    `
      )
      .join("")}
    <h6>Área renovada</h6>
    ${[3, 2, 1]
      .map(
        (i) => `
      <div class="mb-3">
        <label>${i} anos atrás (ha):</label>
        <input type="number" step="0.01" class="form-control" name="${culture}_renovada_${i}anos" required />
      </div>
    `
      )
      .join("")}
    <div class="mb-3">
      <label>Município:</label>
      <input type="text" class="form-control" name="${culture}_municipio" required />
    </div>
    <div class="mb-3">
      <label>Matrícula:</label>
      <input type="text" class="form-control" name="${culture}_matricula" required />
    </div>
    <h6>Dados da safra prevista</h6>
    <div class="mb-3"><label>Safra prevista:</label><input type="number" class="form-control" name="${culture}_safra_prevista" required /></div>
    <div class="mb-3"><label>Área de plantio atual (ha):</label><input type="number" step="0.01" class="form-control" name="${culture}_area_plantio" required /></div>
    <div class="mb-3"><label>Área a ser renovada (ha):</label><input type="number" step="0.01" class="form-control" name="${culture}_area_renovar" required /></div>
    <div class="mb-3"><label>% irrigação:</label><input type="number" step="0.01" class="form-control" name="${culture}_pct_irrigacao" required /></div>
    <div class="mb-3"><label>% mecanização:</label><input type="number" step="0.01" class="form-control" name="${culture}_pct_mecanizacao" required /></div>
    <div class="mb-3"><label>% consumo próprio:</label><input type="number" step="0.01" class="form-control" name="${culture}_pct_consumo" required /></div>
    <div class="mb-3"><label>% armazenamento próprio:</label><input type="number" step="0.01" class="form-control" name="${culture}_pct_armazenamento" required /></div>
    <div class="mb-3"><label>Produtividade (Kg/ha):</label><input type="number" step="0.01" class="form-control" name="${culture}_produtividade" required /></div>
    <div class="mb-3">
      <label>Nível tecnológico:</label>
      <select class="form-select" name="${culture}_nivel_tecnologico" required>
        <option value="">Selecione...</option>
        <option>Alto</option>
        <option>Médio</option>
        <option>Baixo</option>
      </select>
    </div>
    <h6>Dados financeiros</h6>
    <div class="row">
      <div class="col"><label>Preço venda (R$/kg):</label><input type="number" step="0.01" class="form-control" name="${culture}_preco_venda" required /></div>
      <div class="col"><label>Custo produção (R$/ha):</label><input type="number" step="0.01" class="form-control" name="${culture}_custo_producao" required /></div>
      <div class="col"><label>Custo renovação (R$/ha):</label><input type="number" step="0.01" class="form-control" name="${culture}_custo_renovacao" required /></div>
    </div>
    <div class="d-flex gap-2 mt-3">
      <input type="number" class="form-control" name="${culture}_ano_safra_inicio" placeholder="Ano-safra início" min="1900" required />
      <span class="align-self-center">/</span>
      <input type="number" class="form-control" name="${culture}_ano_safra_fim" placeholder="Ano-safra fim" min="1900" required />
    </div>
  `;
}

function getCultureFormHtml(culture) {
  return `
          <div class="border p-3 mb-3">
              <h6 class="fw-bold text-center mb-3">${culture}</h6>
              
              <h6 class="mt-3">Histórico de safras anteriores</h6>
              <div class="col-12 mb-3">
                  <label class="form-label">03 anos atrás (ha)</label>
                  <input type="number" class="form-control mb-2" name="${culture}_hist_3anos_ha" placeholder="03 anos atrás (ha)" min="0" step="0.01" required />
              </div>
              <div class="col-12 mb-3">
                  <label class="form-label">02 anos atrás (ha)</label>
                  <input type="number" class="form-control mb-2" name="${culture}_hist_2anos_ha" placeholder="02 anos atrás (ha)" min="0" step="0.01" required />
              </div>
              <div class="col-12 mb-3">
                  <label class="form-label">01 ano atrás (ha)</label>
                  <input type="number" class="form-control mb-2" name="${culture}_hist_1ano_ha" placeholder="01 ano atrás (ha)" min="0" step="0.01" required />
              </div>

              <div class="col-12 mb-3">
                  <label class="form-label">Município</label>
                  <input type="text" class="form-control mb-2" name="${culture}_cultura_anual_municipio" placeholder="Município" required />
              </div>

              <div class="col-12 mb-3">
                  <label class="form-label">Matrícula</label>
                  <input type="text" class="form-control mb-2" name="${culture}_cultura_anual_matricula" placeholder="Matrícula" required />
              </div>

              <h6 class="mt-3">Dados da safra prevista</h6>
              <div class="col-12 mb-3">
                  <label class="form-label">Área de plantio da cultura na safra prevista (ha)</label>
                  <input type="number" class="form-control mb-2" name="${culture}_cultura_anual_area_plantio" placeholder="Área de plantio da cultura na safra prevista (ha)" min="0" step="0.01" required />
              </div>

              <div class="col-12 mb-3">
                  <label class="form-label">Percentual da área total da cultura com irrigação</label>
                  <input type="number" class="form-control mb-2" name="${culture}_cultura_anual_pct_irrigacao" placeholder="Percentual da área total da cultura com irrigação" min="0" max="100" step="0.01" required />
              </div>

              <div class="col-12 mb-3">
                  <label class="form-label">Percentual da área total da cultura com mecanização de colheita</label>
                  <input type="number" class="form-control mb-2" name="${culture}_cultura_anual_pct_mecanizacao" placeholder="Percentual da área total da cultura com mecanização de colheita" min="0" max="100" step="0.01" required />
              </div>

              <div class="col-12 mb-3">
                  <label class="form-label">Percentual da produção utilizada para consumo próprio</label>
                  <input type="number" class="form-control mb-2" name="${culture}_cultura_anual_pct_consumo_proprio" placeholder="Percentual da produção utilizada para consumo próprio" min="0" max="100" step="0.01" required />
              </div>

              <div class="col-12 mb-3">
                  <label class="form-label">Percentual da produção com armazenamento próprio</label>
                  <input type="number" class="form-control mb-2" name="${culture}_cultura_anual_pct_armazenamento" placeholder="Percentual da produção com armazenamento próprio" min="0" max="100" step="0.01" required />
              </div>

              <div class="col-12 mb-3">
                  <label class="form-label">Produtividade média estimada para a safra (Kg/ha)</label>
                  <input type="number" class="form-control mb-2" name="${culture}_cultura_anual_produtividade_kg_ha" placeholder="Produtividade média estimada para a safra (Kg/ha)" min="0" step="0.01" required />
              </div>

              <div class="col-12 mb-3">
                  <label class="form-label">Nível tecnológico adotado para esta cultura</label>
                  <select class="form-control mb-2" name="${culture}_cultura_anual_nivel_tecnologico" required>
                      <option value="">Selecione o nível tecnológico</option>
                      <option value="Alto">Alto</option>
                      <option value="Médio">Médio</option>
                      <option value="Baixo">Baixo</option>
                  </select>
              </div>

              <h6 class="mt-3">Dados financeiros da safra prevista</h6>
              <div class="row">
                  <div class="col-6">
                      <label class="d-block">Receita estimada</label>
                      <input type="number" class="form-control mb-2" name="${culture}_cultura_anual_preco_venda_rkg" placeholder="Preço estimado de venda (R$/kg)" min="0" step="0.01" required />
                  </div>
                  <div class="col-6">
                      <label class="d-block">Despesa estimada</label>
                      <input type="number" class="form-control mb-2" name="${culture}_cultura_anual_custo_producao_rha" placeholder="Custo estimado de produção (R$/ha)" min="0" step="0.01" required />
                  </div>
              </div>

              <div class="form-inline mb-2">
                  <input type="number" class="form-control mr-2" name="${culture}_cultura_anual_ano_safra_inicio" placeholder="Ano-safra início" min="1900" max="2100" required />
                  <span class="mx-1">/</span>
                  <input type="number" class="form-control" name="${culture}_cultura_anual_ano_safra_fim" placeholder="Ano-safra fim" min="1900" max="2100" required />
              </div>
          </div>
      `;
}

function renderSecundarias(qtd) {
  const container = document.getElementById("secundariasContainer");
  container.innerHTML = "";
  for (let i = 1; i <= qtd; i++) {
    container.innerHTML += `
        <div class="border p-3 mb-4">
          <h6 class="fw-bold mb-3">Propriedade Secundária ${i}</h6>
          <div class="mb-3">
            <label class="form-label">Nome da Propriedade</label>
            <input type="text" class="form-control" name="secundaria_nome_${i}" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Município / UF</label>
            <input type="text" class="form-control" name="secundaria_municipio_${i}" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Número de matrícula</label>
            <input type="text" class="form-control" name="secundaria_matricula_${i}" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Área utilizada (ha)</label>
            <input type="number" step="0.01" class="form-control" name="secundaria_area_${i}" required />
          </div>
          <div class="mb-3 obrigatorio-label">
            <label class="form-label">Você é o proprietário?</label>
            <select class="form-select" name="secundaria_proprietario_${i}" onchange="toggleProprietarioExtras(this, ${i})" required>
              <option value="">Selecione...</option>
              <option value="Sim">Sim</option>
              <option value="Não">Não</option>
            </select>
          </div>
          <div id="extras_${i}" style="display:none;">
            <div class="mb-3">
              <label class="form-label">Nome ou Razão Social do Proprietário</label>
              <input type="text" class="form-control" name="secundaria_nome_proprietario_${i}" />
            </div>
            <div class="mb-3">
              <label class="form-label">CPF/CNPJ</label>
              <input type="text" class="form-control" name="secundaria_cpf_cnpj_${i}" />
            </div>
            <div class="mb-3">
              <label class="form-label">Percentual de Propriedade (%)</label>
              <input type="number" class="form-control" name="secundaria_percentual_${i}" />
            </div>
          </div>
        </div>
      `;
  }
}

function toggleProprietarioExtras(select, index) {
  const extras = document.getElementById("extras_" + index);
  if (select.value === "Não") {
    extras.style.display = "block";
  } else {
    extras.style.display = "none";
  }
}

function atualizarValorCredito(valor) {
  const exibido = document.getElementById("valor_credito_exibido");
  const valorFormatado = Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
  exibido.textContent = valorFormatado;
}

// Função para limpar todos os dados salvos (útil para testes)
function clearAllSavedData() {
  if (
    confirm(
      "Tem certeza que deseja limpar todos os dados salvos? Esta ação não pode ser desfeita."
    )
  ) {
    FormStateManager.clearLocalStorage();
    location.reload();
  }
}

// Auto-save periódico
setInterval(() => {
  saveAllFormsData();
}, 30000); // Salva a cada 30 segundos

// Salvar dados antes de sair da página
window.addEventListener("beforeunload", function () {
  saveAllFormsData();
});

console.log("Sistema de preservação de estado carregado com sucesso!");

document.addEventListener("DOMContentLoaded", function () {
  firebase.auth().onAuthStateChanged(function (user) {
    if (!user) {
      alert("Você precisa estar logado para enviar a solicitação.");
      window.location.href = "sign-in.html";
      return;
    }

    const form = document.getElementById("upgradeForm");
    const btnEnviar = document.getElementById("enviarFormulario");

    btnEnviar.addEventListener("click", async function (e) {
      e.preventDefault();

      // Estado "carregando"
      btnEnviar.innerHTML =
        'Enviando... <span class="spinner-border spinner-border-sm ms-1" role="status" aria-hidden="true"></span>';
      btnEnviar.disabled = true;

      // Organizando os dados do formulário
      const formData = new FormData(form);
      const dados = {};

      formData.forEach((valor, chave) => {
        if (dados[chave]) {
          if (!Array.isArray(dados[chave])) {
            dados[chave] = [dados[chave]];
          }
          dados[chave].push(valor);
        } else {
          dados[chave] = valor;
        }
      });

      // Adiciona os campos fixos
      dados.status = "inactive";
      dados.status_documentacao = "pendente";
      dados.status_solicitacao = "aguardando";
      dados.createdAt = firebase.firestore.Timestamp.now();
      dados.cliente_id = user.uid;
      dados.addedBy = user.email;

      try {
        await firebase.firestore().collection("custeio").add(dados);

        // Pop-up bonito
        Swal.fire({
          icon: "success",
          title: "Solicitação enviada com sucesso!",
          html: `Agora é hora de <strong>concluir sua solicitação</strong> com os documentos e informações necessárias.<br><br>
             Nossa equipe irá acompanhar tudo de perto para garantir a aprovação do seu crédito junto aos nossos bancos parceiros.`,
          confirmButtonText: "Entendi!",
          confirmButtonColor: "#198754",
        }).then(() => {
          window.location.href = "solicitacoes.html";
        });
      } catch (err) {
        console.error("Erro ao gravar no Firestore:", err);
        alert("Erro ao enviar. Tente novamente.");
        btnEnviar.innerHTML = "Enviar Formulário";
        btnEnviar.disabled = false;
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const avisoModal = new bootstrap.Modal(document.getElementById("avisoModal"));
  avisoModal.show();
});
