/**
 * Custom Popup System
 * Um sistema de pop-up personalizado para substituir os alertas nativos do navegador
 */

// Cria o elemento HTML do pop-up se ainda não existir
function createPopupElement() {
    if (document.getElementById('customPopupOverlay')) {
        return;
    }

    // Criar o overlay
    const overlay = document.createElement('div');
    overlay.id = 'customPopupOverlay';
    overlay.className = 'custom-popup-overlay';

    // Criar o container do popup
    const popup = document.createElement('div');
    popup.id = 'customPopup';
    popup.className = 'custom-popup';

    // Criar o ícone
    const iconContainer = document.createElement('div');
    iconContainer.className = 'custom-popup-icon';
    const icon = document.createElement('img');
    icon.id = 'customPopupIcon';
    icon.src = ''; // Será definido dinamicamente
    iconContainer.appendChild(icon);

    // Criar o título
    const title = document.createElement('div');
    title.id = 'customPopupTitle';
    title.className = 'custom-popup-title';

    // Criar a mensagem
    const message = document.createElement('div');
    message.id = 'customPopupMessage';
    message.className = 'custom-popup-message';

    // Criar o botão
    const button = document.createElement('button');
    button.id = 'customPopupButton';
    button.className = 'custom-popup-button';
    button.textContent = 'OK';
    button.onclick = closePopup;

    // Montar a estrutura
    popup.appendChild(iconContainer);
    popup.appendChild(title);
    popup.appendChild(message);
    popup.appendChild(button);
    overlay.appendChild(popup);

    // Adicionar ao body
    document.body.appendChild(overlay);
}

// Função principal para mostrar o popup
function showCustomPopup(message, type = 'info', title = '', buttonText = 'OK', callback = null) {
    // Garantir que o elemento do popup existe
    createPopupElement();

    // Obter referências aos elementos
    const overlay = document.getElementById('customPopupOverlay');
    const popup = document.getElementById('customPopup');
    const iconImg = document.getElementById('customPopupIcon');
    const titleElement = document.getElementById('customPopupTitle');
    const messageElement = document.getElementById('customPopupMessage');
    const button = document.getElementById('customPopupButton');

    // Limpar classes anteriores
    popup.classList.remove('success', 'error', 'info');

    // Definir tipo e ícone
    popup.classList.add(type);
    
    // Definir ícone baseado no tipo
    let iconPath = '';
    let defaultTitle = '';
    
    switch(type) {
        case 'success':
            iconPath = 'assets/images/svg/check-circle.svg';
            defaultTitle = 'Sucesso!';
            break;
        case 'error':
            iconPath = 'assets/images/svg/alert-circle.svg';
            defaultTitle = 'Erro!';
            break;
        case 'info':
        default:
            iconPath = 'assets/images/svg/info.svg';
            defaultTitle = 'Informação';
            break;
    }
    
    // Definir conteúdo
    iconImg.src = iconPath;
    titleElement.textContent = title || defaultTitle;
    messageElement.textContent = message;
    button.textContent = buttonText;
    
    // Definir callback personalizado se fornecido
    if (callback) {
        button.onclick = function() {
            closePopup();
            callback();
        };
    } else {
        button.onclick = closePopup;
    }
    
    // Mostrar o popup
    overlay.classList.add('active');
    
    // Adicionar classe de animação
    popup.classList.add('popup-animation');
    
    // Focar no botão para acessibilidade
    setTimeout(() => {
        button.focus();
    }, 100);
}

// Função para fechar o popup
function closePopup() {
    const overlay = document.getElementById('customPopupOverlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
}

// Funções específicas para cada tipo de popup
function showSuccessPopup(message, title = '', buttonText = 'OK', callback = null) {
    showCustomPopup(message, 'success', title, buttonText, callback);
}

function showErrorPopup(message, title = '', buttonText = 'OK', callback = null) {
    showCustomPopup(message, 'error', title, buttonText, callback);
}

function showInfoPopup(message, title = '', buttonText = 'OK', callback = null) {
    showCustomPopup(message, 'info', title, buttonText, callback);
}

// Substituir o alert nativo do navegador
window.originalAlert = window.alert;
window.alert = function(message) {
    showInfoPopup(message);
};

// Inicializar o sistema de popup quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    createPopupElement();
});
