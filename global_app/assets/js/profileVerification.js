/**
 * profileVerification.js
 *
 * Este script verifica se o cadastro do usuário está completo no Firestore.
 * Se o cadastro estiver incompleto ou não existir, redireciona para a página de coleta de dados.
 *
 * Fluxo:
 * 1. Verifica se o usuário está autenticado
 * 2. Busca o documento do usuário na coleção 'clientes/{uid}'
 * 3. Verifica se todos os campos obrigatórios estão preenchidos
 * 4. Se incompleto ou inexistente, redireciona para DataCollect
 * 5. Se completo, permite acesso à página atual
 */

// Lista de campos obrigatórios que devem estar preenchidos no documento do usuário
const camposObrigatorios = [
  "nome_completo",
  "email",
  "contato",
  "nascimento",
  "rg",
  "cpf",
  "estado_civil",
  "empresa",
  "cep",
  "endereco",
  // 'endereco1', // REMOVIDO para não tornar “Complemento” obrigatório
  "cidade",
  "bairro",
  "estado",
];

/**
 * Verifica se o cadastro do usuário está completo
 * Esta função deve ser chamada após a autenticação do usuário
 */
function verificarCadastroCompleto(user) {
  // Se não recebeu o usuário como parâmetro, não faz nada
  if (!user) return;

  console.log("Verificando cadastro para o usuário:", user.uid);

  // Referência ao Firestore
  const db = firebase.firestore();

  // Busca o documento do usuário na coleção 'clientes'
  db.collection("clientes")
    .doc(user.uid)
    .get()
    .then((doc) => {
      // Verifica se o documento existe
      if (!doc.exists) {
        console.log(
          "Documento do usuário não existe. Redirecionando para cadastro..."
        );
        redirecionarParaCadastro();
        return;
      }

      // Documento existe, verifica se todos os campos obrigatórios estão preenchidos
      const dados = doc.data();

      // Verifica cada campo obrigatório
      const cadastroCompleto = camposObrigatorios.every((campo) => {
        const valorCampo = dados[campo];
        const campoPreenchido = valorCampo && String(valorCampo).trim() !== "";

        if (!campoPreenchido) {
          console.log(`Campo obrigatório não preenchido: ${campo}`);
        }

        return campoPreenchido;
      });

      // Se o cadastro não estiver completo, redireciona para a página de cadastro
      if (!cadastroCompleto) {
        console.log("Cadastro incompleto. Redirecionando para completar...");
        redirecionarParaCadastro();
      } else {
        console.log("Cadastro completo. Permitindo acesso à página.");
        // Aqui podemos atualizar a mensagem de boas-vindas com o nome do usuário
        atualizarMensagemBoasVindas(dados);
      }
    })
    .catch((error) => {
      console.error("Erro ao verificar cadastro:", error);
      // Em caso de erro, não redireciona para não atrapalhar a experiência do usuário
    });
}

/**
 * Redireciona o usuário para a página de cadastro
 */
function redirecionarParaCadastro() {
  // Verifica se já estamos na página de cadastro para evitar loop infinito
  if (!window.location.href.includes("dataCollect.html")) {
    window.location.href = "dataCollect.html";
  }
}

/**
 * Atualiza a mensagem de boas-vindas com o nome do usuário
 */
function atualizarMensagemBoasVindas(dados) {
  const welcomeElement = document.getElementById("welcome-message");
  if (welcomeElement && dados.nome_completo) {
    // Pega apenas o primeiro nome
    const primeiroNome = dados.nome_completo.split(" ")[0];
    welcomeElement.textContent = `Olá, ${primeiroNome}!`;
  }
}

// Inicializa a verificação quando o documento estiver pronto
document.addEventListener("DOMContentLoaded", function () {
  // Verifica se o Firebase Auth está disponível
  if (typeof firebase !== "undefined" && firebase.auth) {
    // Observa mudanças no estado de autenticação
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // Usuário está autenticado, verifica se o cadastro está completo
        verificarCadastroCompleto(user);
      } else {
        // Usuário não está autenticado, redireciona para a página de login
        if (
          !window.location.href.includes("let-you-screen.html") &&
          !window.location.href.includes("sign-in.html") &&
          !window.location.href.includes("sign-up.html")
        ) {
          window.location.href = "let-you-screen.html";
        }
      }
    });
  } else {
    console.error(
      "Firebase Auth não está disponível. Verifique se o SDK do Firebase foi carregado corretamente."
    );
  }
});
