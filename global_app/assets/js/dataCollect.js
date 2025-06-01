/**
 * dataCollect.js - Script para gerenciar o formulário de coleta de dados
 *
 * Este script gerencia a navegação entre as etapas do formulário,
 * validação dos campos (inputs e selects), habilitação/desabilitação de inputs
 * baseados no provedor e salvamento dos dados no Firestore com verificação de unicidade
 * de email e telefone.
 */

// Variáveis globais
let currentStep = 1;
const totalSteps = 3;

// Quando o documento estiver pronto
document.addEventListener("DOMContentLoaded", function () {
  // Verificar se o usuário está autenticado
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log("Usuário autenticado:", user.uid);
      const emailInput = document.getElementById("email");
      const contatoInput = document.getElementById("contato");

      // Determinar provedor de autenticação (Google ou Phone)
      const providers = user.providerData.map((pd) => pd.providerId);
      const isGoogle = providers.includes("google.com");
      const isPhone = providers.includes("phone");

      // Se provedor for Google, preencher e desabilitar email
      if (isGoogle) {
        if (user.email) {
          emailInput.value = user.email;
        }
        emailInput.disabled = true;
        // Habilitar campo de telefone para usuário Google
        contatoInput.disabled = false;
      }

      // Se provedor for Phone, preencher e desabilitar contato
      if (isPhone) {
        if (user.phoneNumber) {
          contatoInput.value = user.phoneNumber;
        }
        contatoInput.disabled = true;
        // Habilitar campo de email para usuário Phone
        emailInput.disabled = false;
      }

      // Carregar dados adicionais do Firestore
      carregarDadosUsuario(user.uid);
    } else {
      console.log("Usuário não autenticado. Redirecionando para login...");
      window.location.href = "let-you-screen.html";
    }
  });

  // Configurar navegação entre etapas
  document.getElementById("next-1").addEventListener("click", function () {
    if (validarEtapa(1)) {
      avancarEtapa(2);
    }
  });

  document.getElementById("next-2").addEventListener("click", function () {
    if (validarEtapa(2)) {
      avancarEtapa(3);
    }
  });

  document.getElementById("prev-2").addEventListener("click", function () {
    voltarEtapa(1);
  });

  document.getElementById("prev-3").addEventListener("click", function () {
    voltarEtapa(2);
  });

  // Configurar envio do formulário
  document
    .getElementById("dataCollectForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      if (validarEtapa(3)) {
        salvarDados();
      }
    });

  // Configurar validação em tempo real para inputs **e selects**
  const camposValidar = document.querySelectorAll(
    "input[required], select[required]"
  );
  camposValidar.forEach((campo) => {
    campo.addEventListener("blur", function () {
      validarCampo(this.id);
    });
  });
});

/**
 * Carrega os dados do usuário do Firestore, se existirem
 * @param {string} uid - ID do usuário
 */
function carregarDadosUsuario(uid) {
  const db = firebase.firestore();
  db.collection("clientes")
    .doc(uid)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const dados = doc.data();
        console.log("Dados do usuário carregados com sucesso.");

        // Obter referência aos inputs e provedor atual
        const emailInput = document.getElementById("email");
        const contatoInput = document.getElementById("contato");
        const estadoCivilSelect = document.getElementById("estado_civil");
        const endereco1Input = document.getElementById("endereco1");
        const user = firebase.auth().currentUser;
        const providers = user.providerData.map((pd) => pd.providerId);
        const isGoogle = providers.includes("google.com");
        const isPhone = providers.includes("phone");

        // Preencher e desabilitar campos conforme dados existentes
        if (dados.email) {
          emailInput.value = dados.email;
          emailInput.disabled = true;
        } else {
          // Se não houver email salvo e provedor for Phone, permitir edição
          if (isPhone) {
            emailInput.disabled = false;
          }
        }

        if (dados.contato) {
          contatoInput.value = dados.contato;
          contatoInput.disabled = true;
        } else {
          // Se não houver contato salvo e provedor for Google, permitir edição
          if (isGoogle) {
            contatoInput.disabled = false;
          }
        }

        // Preencher estado civil, se existir
        if (dados.estado_civil && estadoCivilSelect) {
          estadoCivilSelect.value = dados.estado_civil;
        }

        // Preencher complemento (endereco1), se existir
        if (dados.endereco1 && endereco1Input) {
          endereco1Input.value = dados.endereco1;
        }

        // Preencher demais campos do formulário (outros inputs)
        for (const campo in dados) {
          if (
            campo === "email" ||
            campo === "contato" ||
            campo === "estado_civil" ||
            campo === "endereco1"
          )
            continue;
          const elemento = document.getElementById(campo);
          if (elemento && elemento.tagName === "INPUT") {
            elemento.value = dados[campo];
          }
        }
      } else {
        console.log("Documento não existe. Novo cadastro.");
      }
    })
    .catch((error) => {
      console.error("Erro ao carregar dados do usuário:", error);
    });
}

/**
 * Avança para a etapa especificada
 * @param {number} etapa - Número da etapa para avançar
 */
function avancarEtapa(etapa) {
  document.getElementById(`step-${currentStep}`).classList.remove("active");
  document.getElementById(`step-${etapa}`).classList.add("active");
  currentStep = etapa;
  document.getElementById(
    "progress-indicator"
  ).textContent = `Etapa ${currentStep} de ${totalSteps}`;
}

/**
 * Volta para a etapa especificada
 * @param {number} etapa - Número da etapa para voltar
 */
function voltarEtapa(etapa) {
  document.getElementById(`step-${currentStep}`).classList.remove("active");
  document.getElementById(`step-${etapa}`).classList.add("active");
  currentStep = etapa;
  document.getElementById(
    "progress-indicator"
  ).textContent = `Etapa ${currentStep} de ${totalSteps}`;
}

/**
 * Valida os campos da etapa atual
 * @param {number} etapa - Número da etapa para validar
 * @returns {boolean} - Retorna true se todos os campos forem válidos
 */
function validarEtapa(etapa) {
  const step = document.getElementById(`step-${etapa}`);
  // Incluir inputs e selects obrigatórios na validação de etapa
  const campos = step.querySelectorAll("input[required], select[required]");
  let valido = true;

  campos.forEach((campo) => {
    if (!validarCampo(campo.id)) {
      valido = false;
    }
  });

  return valido;
}

/**
 * Valida um campo específico (input ou select)
 * @param {string} campoId - ID do campo a ser validado
 * @returns {boolean} - Retorna true se o campo for válido
 */
function validarCampo(campoId) {
  const campo = document.getElementById(campoId);
  const errorElement = document.getElementById(`error-${campoId}`);

  if (!campo || !errorElement) return true;

  // Para <select> e <input>, o value vazio ou com apenas espaços é inválido
  if (!campo.value || !campo.value.trim()) {
    errorElement.style.display = "block";
    campo.classList.add("is-invalid");
    return false;
  } else {
    errorElement.style.display = "none";
    campo.classList.remove("is-invalid");
    campo.classList.add("is-valid");
    return true;
  }
}

/**
 * Salva os dados do formulário no Firestore com verificação de unicidade
 */
function salvarDados() {
  const user = firebase.auth().currentUser;
  if (!user) {
    console.error("Usuário não autenticado.");
    return;
  }

  const db = firebase.firestore();
  // Coletar todos os dados do formulário: inputs **e selects**
  const campos = document.querySelectorAll(
    "#dataCollectForm input, #dataCollectForm select"
  );
  const formData = {};

  campos.forEach((campo) => {
    if (campo.name) {
      formData[campo.name] = campo.value.trim();
    }
  });

  // Adicionar campos adicionais obrigatórios
  formData.tipo = "cliente";
  formData.status = "inactive";
  formData.data_inclusao = firebase.firestore.Timestamp.now();
  formData.criado_por = user.email || user.uid;

  // Verificação de unicidade de email e contato
  const checks = [];
  if (formData.email) {
    const emailCheck = db
      .collection("clientes")
      .where("email", "==", formData.email)
      .get()
      .then((snapshot) => {
        if (!snapshot.empty) {
          let conflito = false;
          snapshot.forEach((doc) => {
            if (doc.id !== user.uid) {
              conflito = true;
            }
          });
          if (conflito) {
            return Promise.reject("email-conflict");
          }
        }
      });
    checks.push(emailCheck);
  }
  if (formData.contato) {
    const contatoCheck = db
      .collection("clientes")
      .where("contato", "==", formData.contato)
      .get()
      .then((snapshot) => {
        if (!snapshot.empty) {
          let conflito = false;
          snapshot.forEach((doc) => {
            if (doc.id !== user.uid) {
              conflito = true;
            }
          });
          if (conflito) {
            return Promise.reject("contato-conflict");
          }
        }
      });
    checks.push(contatoCheck);
  }

  Promise.all(checks)
    .then(() => {
      // Se passou nas verificações, salvar no Firestore
      db.collection("clientes")
        .doc(user.uid)
        .set(formData, { merge: true })
        .then(() => {
          console.log("Dados salvos com sucesso!");
          // Redirecionar para a página principal
          window.location.href = "homeScreen.html";
        })
        .catch((error) => {
          console.error("Erro ao salvar dados:", error);
          alert("Erro ao salvar dados. Por favor, tente novamente.");
        });
    })
    .catch((error) => {
      if (error === "email-conflict") {
        alert("Esse e-mail já está em uso.");
      } else if (error === "contato-conflict") {
        alert("Esse número de celular já está em uso.");
      } else {
        console.error("Erro na verificação de unicidade:", error);
        alert("Erro ao verificar unicidade. Por favor, tente novamente.");
      }
    });
}
