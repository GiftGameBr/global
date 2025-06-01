/**
 * dataCollect.js - Script para gerenciar o formulário de coleta de dados
 * 
 * Este script gerencia a navegação entre as etapas do formulário,
 * validação dos campos e salvamento dos dados no Firestore.
 */

// Variáveis globais
let currentStep = 1;
const totalSteps = 3;

// Quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o usuário está autenticado
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log('Usuário autenticado:', user.uid);
            // Preencher o campo de email com o email do usuário
            document.getElementById('email').value = user.email || '';
            
            // Verificar se o usuário já tem cadastro e preencher os campos
            carregarDadosUsuario(user.uid);
        } else {
            console.log('Usuário não autenticado. Redirecionando para login...');
            window.location.href = 'let-you-screen.html';
        }
    });

    // Configurar navegação entre etapas
    document.getElementById('next-1').addEventListener('click', function() {
        if (validarEtapa(1)) {
            avancarEtapa(2);
        }
    });

    document.getElementById('next-2').addEventListener('click', function() {
        if (validarEtapa(2)) {
            avancarEtapa(3);
        }
    });

    document.getElementById('prev-2').addEventListener('click', function() {
        voltarEtapa(1);
    });

    document.getElementById('prev-3').addEventListener('click', function() {
        voltarEtapa(2);
    });

    // Configurar envio do formulário
    document.getElementById('dataCollectForm').addEventListener('submit', function(e) {
        e.preventDefault();
        if (validarEtapa(3)) {
            salvarDados();
        }
    });

    // Configurar validação em tempo real para os campos
    const campos = document.querySelectorAll('input[required]');
    campos.forEach(campo => {
        campo.addEventListener('blur', function() {
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
    db.collection('clientes').doc(uid).get()
        .then((doc) => {
            if (doc.exists) {
                const dados = doc.data();
                // Preencher os campos do formulário com os dados existentes
                for (const campo in dados) {
                    const elemento = document.getElementById(campo);
                    if (elemento && elemento.tagName === 'INPUT') {
                        elemento.value = dados[campo];
                    }
                }
                console.log('Dados do usuário carregados com sucesso.');
            } else {
                console.log('Documento não existe. Novo cadastro.');
            }
        })
        .catch((error) => {
            console.error('Erro ao carregar dados do usuário:', error);
        });
}

/**
 * Avança para a etapa especificada
 * @param {number} etapa - Número da etapa para avançar
 */
function avancarEtapa(etapa) {
    // Ocultar etapa atual
    document.getElementById(`step-${currentStep}`).classList.remove('active');
    // Mostrar próxima etapa
    document.getElementById(`step-${etapa}`).classList.add('active');
    // Atualizar etapa atual
    currentStep = etapa;
    // Atualizar indicador de progresso
    document.getElementById('progress-indicator').textContent = `Etapa ${currentStep} de ${totalSteps}`;
}

/**
 * Volta para a etapa especificada
 * @param {number} etapa - Número da etapa para voltar
 */
function voltarEtapa(etapa) {
    // Ocultar etapa atual
    document.getElementById(`step-${currentStep}`).classList.remove('active');
    // Mostrar etapa anterior
    document.getElementById(`step-${etapa}`).classList.add('active');
    // Atualizar etapa atual
    currentStep = etapa;
    // Atualizar indicador de progresso
    document.getElementById('progress-indicator').textContent = `Etapa ${currentStep} de ${totalSteps}`;
}

/**
 * Valida os campos da etapa atual
 * @param {number} etapa - Número da etapa para validar
 * @returns {boolean} - Retorna true se todos os campos forem válidos
 */
function validarEtapa(etapa) {
    const step = document.getElementById(`step-${etapa}`);
    const campos = step.querySelectorAll('input[required]');
    let valido = true;

    campos.forEach(campo => {
        if (!validarCampo(campo.id)) {
            valido = false;
        }
    });

    return valido;
}

/**
 * Valida um campo específico
 * @param {string} campoId - ID do campo a ser validado
 * @returns {boolean} - Retorna true se o campo for válido
 */
function validarCampo(campoId) {
    const campo = document.getElementById(campoId);
    const errorElement = document.getElementById(`error-${campoId}`);
    
    if (!campo || !errorElement) return true;
    
    // Verificar se o campo está vazio
    if (!campo.value.trim()) {
        errorElement.style.display = 'block';
        campo.classList.add('is-invalid');
        return false;
    } else {
        errorElement.style.display = 'none';
        campo.classList.remove('is-invalid');
        campo.classList.add('is-valid');
        return true;
    }
}

/**
 * Salva os dados do formulário no Firestore
 */
function salvarDados() {
    // Verificar se o usuário está autenticado
    const user = firebase.auth().currentUser;
    if (!user) {
        console.error('Usuário não autenticado.');
        return;
    }

    // Coletar todos os dados do formulário
    const formData = {};
    const campos = document.querySelectorAll('#dataCollectForm input');
    campos.forEach(campo => {
        if (campo.name) {
            formData[campo.name] = campo.value.trim();
        }
    });

    // Adicionar campos adicionais obrigatórios
    formData.tipo = "cliente";
    formData.status = "inactive";
    formData.data_inclusao = firebase.firestore.Timestamp.now();
    formData.criado_por = user.email || user.uid;

    // Salvar no Firestore
    const db = firebase.firestore();
    db.collection('clientes').doc(user.uid).set(formData, { merge: true })
        .then(() => {
            console.log('Dados salvos com sucesso!');
            // Redirecionar para a página principal
            window.location.href = 'homeScreen.html';
        })
        .catch((error) => {
            console.error('Erro ao salvar dados:', error);
            alert('Erro ao salvar dados. Por favor, tente novamente.');
        });
}
