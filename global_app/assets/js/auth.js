// assets/js/auth.js

// 1. Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBxREWzRP-X8Q5b-BtiV6A1PFLbKSdfzwk", // Atenção: Expor a chave de API assim é inseguro em produção.
  authDomain: "global-1a649.firebaseapp.com",
  projectId: "global-1a649",
  storageBucket: "global-1a649.firebasestorage.app",
  messagingSenderId: "689137289621",
  appId: "1:689137289621:web:7595220d59d48d48960e9c",
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Variáveis globais (se necessárias)
window.confirmationResult = null;
window.recaptchaVerifier = null;
window.recaptchaWidgetId = null;

// --- Funções de Autenticação (Login/Registro) ---

// 2. Redireciona após login, verificando o splash
function redirecionarPosLogin() {
  // Decide para onde ir após login bem-sucedido
  // Poderia verificar se é o primeiro acesso para ir para splash, etc.
  // Simplificado: sempre vai para homeScreen.html
  window.location.href = "homeScreen.html";
}

// 3. Login com Google
function loginWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth
    .signInWithPopup(provider)
    .then(() => redirecionarPosLogin())
    .catch((error) => {
      // Não mostrar erro quando o usuário fecha o popup intencionalmente
      if (error.code !== "auth/popup-closed-by-user") {
        showErrorPopup("Erro no login com Google: " + error.message);
      } else {
        console.log("Usuário fechou o popup de login do Google.");
      }
    });
}

// 4. Login com Facebook
function loginWithFacebook() {
  const provider = new firebase.auth.FacebookAuthProvider();
  auth
    .signInWithPopup(provider)
    .then(() => redirecionarPosLogin())
    .catch((error) => {
      // Não mostrar erro quando o usuário fecha o popup intencionalmente
      if (error.code !== "auth/popup-closed-by-user") {
        showErrorPopup("Erro no login com Facebook: " + error.message);
      } else {
        console.log("Usuário fechou o popup de login do Facebook.");
      }
    });
}

// 5. Login com Apple (redirecionamento)
function loginWithApple() {
  const provider = new firebase.auth.OAuthProvider("apple.com");
  auth.signInWithRedirect(provider);
  // Resultado tratado em callback.html ou na própria página após redirecionamento
}

// 6. Inicializa e renderiza o reCAPTCHA (para login por telefone)
function initializeRecaptcha() {
  const recaptchaContainer = document.getElementById("recaptcha-container");
  if (!recaptchaContainer) {
    console.error("Container do reCAPTCHA não encontrado.");
    return;
  }
  recaptchaContainer.innerHTML = ""; // Limpa container

  try {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "normal",
        callback: (response) => {
          console.log("reCAPTCHA resolvido:", response);
        },
        "expired-callback": () => {
          showInfoPopup("reCAPTCHA expirou, por favor, tente novamente.");
          if (window.recaptchaVerifier && window.recaptchaWidgetId !== null) {
            grecaptcha.reset(window.recaptchaWidgetId);
          }
        },
      }
    );

    window.recaptchaVerifier
      .render()
      .then((widgetId) => {
        window.recaptchaWidgetId = widgetId;
        console.log("reCAPTCHA renderizado, ID:", widgetId);
      })
      .catch((error) => {
        console.error("Erro ao renderizar reCAPTCHA:", error);
        showErrorPopup(
          "Não foi possível iniciar o reCAPTCHA. Verifique sua conexão ou tente mais tarde."
        );
      });
  } catch (error) {
    console.error("Erro ao criar RecaptchaVerifier:", error);
    showErrorPopup("Erro ao configurar o reCAPTCHA.");
  }
}

// 7. Envia código por celular (via modal)
function sendPhoneCode() {
  const phoneNumberInput = document.getElementById("phone-number");
  const phoneNumber = phoneNumberInput.value.trim();
  const sendButton = document.querySelector(
    "button[onclick='sendPhoneCode()']"
  );

  if (!phoneNumber.startsWith("+")) {
    showInfoPopup(
      "Inclua o código do país (DDI) no número. Ex: +55 11 912345678"
    );
    return;
  }

  if (!window.recaptchaVerifier || window.recaptchaWidgetId === null) {
    showInfoPopup(
      "reCAPTCHA não está pronto. Por favor, aguarde ou resolva o desafio."
    );
    if (!window.recaptchaVerifier) initializeRecaptcha();
    return;
  }

  // Mostrar estado de carregando no botão
  if (sendButton) {
    sendButton.disabled = true;
    sendButton.innerHTML =
      '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';
  }

  const appVerifier = window.recaptchaVerifier;

  auth
    .signInWithPhoneNumber(phoneNumber, appVerifier)
    .then((confirmationResult) => {
      window.confirmationResult = confirmationResult;
      console.log("Código SMS enviado para", phoneNumber);

      const step1Div = document.getElementById("step1-phone-input");
      const step2Div = document.getElementById("step2-verification");
      if (step1Div) step1Div.style.display = "none";
      if (step2Div) step2Div.style.display = "block";

      const firstOtpInput = document.querySelector("#otp-inputs .otp-input");
      if (firstOtpInput) firstOtpInput.focus();
    })
    .catch((error) => {
      console.error("Erro ao enviar SMS:", error);
      showErrorPopup(
        "Erro ao enviar SMS: " +
          error.message +
          ". Verifique o número ou tente novamente."
      );
      if (window.recaptchaVerifier && window.recaptchaWidgetId !== null) {
        try {
          grecaptcha.reset(window.recaptchaWidgetId);
        } catch (resetError) {
          console.error("Erro ao resetar reCAPTCHA:", resetError);
        }
      }
    })
    .finally(() => {
      // Restaurar o botão ao estado original
      if (sendButton) {
        sendButton.disabled = false;
        sendButton.innerHTML = "Enviar Código";
      }
    });
}

// 8. Verifica o código SMS inserido nos campos OTP do modal
function verifyPhoneCodeInModal() {
  const otpInputs = document.querySelectorAll("#otp-inputs .otp-input");
  const verifyButton = document.querySelector(
    "button[onclick='verifyPhoneCodeInModal()']"
  );
  let code = "";
  otpInputs.forEach((input) => {
    code += input.value.trim();
  });

  if (code.length !== 6) {
    showInfoPopup("Por favor, preencha todos os 6 dígitos do código recebido.");
    return;
  }

  if (!window.confirmationResult) {
    showErrorPopup(
      "Erro interno: Objeto de confirmação não encontrado. Tente enviar o código novamente."
    );
    const step1Div = document.getElementById("step1-phone-input");
    const step2Div = document.getElementById("step2-verification");
    if (step1Div) step1Div.style.display = "block";
    if (step2Div) step2Div.style.display = "none";
    initializeRecaptcha();
    return;
  }

  // Mostrar estado de carregando no botão
  if (verifyButton) {
    verifyButton.disabled = true;
    verifyButton.innerHTML =
      '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Verificando...';
  }

  window.confirmationResult
    .confirm(code)
    .then((result) => {
      const user = result.user;
      console.log("Número verificado com sucesso! Usuário:", user);
      // Removida a mensagem de sucesso para continuar o fluxo automaticamente
      const modalElement = document.getElementById("modalTelefone");
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) modalInstance.hide();
      redirecionarPosLogin();
    })
    .catch((error) => {
      console.error("Erro ao verificar código SMS:", error);
      showErrorPopup(
        "Código inválido ou expirado. Por favor, tente novamente."
      );
      otpInputs.forEach((input) => (input.value = ""));
      if (otpInputs.length > 0) otpInputs[0].focus();
    })
    .finally(() => {
      // Restaurar o botão ao estado original
      if (verifyButton) {
        verifyButton.disabled = false;
        verifyButton.innerHTML = "Verificar Código";
      }
    });
}

// --- Funções de Gerenciamento de Sessão ---

// 9. Verifica estado de autenticação e atualiza UI (para páginas protegidas como homeScreen)
function checkAuthState(callback) {
  auth.onAuthStateChanged((user) => {
    if (user) {
      // Usuário está logado
      console.log("Usuário logado:", user.uid);
      if (callback) callback(user); // Executa callback passando o usuário
    } else {
      // Usuário não está logado
      console.log("Nenhum usuário logado. Redirecionando para login...");
      // Redireciona para a tela de login (ajuste o nome se necessário)
      window.location.href = "let-you-screen.html";
    }
  });
}

// 10. Função de Logout
function logoutUser() {
  auth
    .signOut()
    .then(() => {
      console.log("Logout realizado com sucesso.");
      // Redireciona para a tela de login após o logout
      window.location.href = "let-you-screen.html"; // Ajuste o nome se necessário
    })
    .catch((error) => {
      console.error("Erro ao fazer logout:", error);
      showErrorPopup("Erro ao sair. Tente novamente.");
    });
}

// 11. Atualiza a saudação no Header (exemplo)
function updateWelcomeMessage(user) {
  const welcomeElement = document.getElementById("welcome-message"); // ID a ser criado no HTML
  if (welcomeElement) {
    let userName = "Usuário"; // Nome padrão
    if (user.displayName) {
      userName = user.displayName.split(" ")[0]; // Pega o primeiro nome se disponível
    } else if (user.email) {
      userName = user.email.split("@")[0]; // Pega parte antes do @ do email
    } else if (user.phoneNumber) {
      userName = user.phoneNumber; // Usa o número de telefone
    }
    welcomeElement.textContent = `Bem Vindo, ${userName}!`;
  }
}

// --- Inicialização Específica da Página ---
// (Pode ser chamado no final do HTML de cada página relevante)

// Exemplo de como usar na homeScreen.html:
// No final do body de homeScreen.html, adicionar:
// <script>
//   document.addEventListener('DOMContentLoaded', () => {
//     checkAuthState(updateWelcomeMessage); // Verifica login e atualiza saudação
//   });
// </script>
