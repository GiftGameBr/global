// Lista fixa de documentos
const listaDocumentosFixos = [
  "CND - Certidão Negativa de Débitos(Tributos Federais e Dívida Ativa da União)",
  "CNH - Proponente",
  "CNH - Cônjuge",
  "Certidão de Nascimento/Casamento",
  "Declaração de IRPF",
  "Recibo de IRPF",
  "Declaração CMN - Declaração de Renegociações por Resoluções do CMN",
  "Certificado de Cadastro do Imóvel Rural (CCIR) - Imóvel Beneficiado",
  "Certidão Negativa de Débitos do Imóvel Rural ou Prova de Pagamento/Quitação do ITR",
  "Certidão de Inteiro Teor do Objeto da Cessão (Validade de até 1 ano)",
  "Certidão de Ônus do Imóvel Objeto da Cessão",
  "Licença Ambiental de Operação (LO)",
  "Roteiro de Acesso ao Imóvel",
  "Cadastro Ambiental Rural (CAR) - Documento de Inscrição",
  "Cadastro Ambiental Rural (CAR) - Demonstrativo de Situação",
  "Documentos de Cessão (Contratos e/ou Anuência) - Crédito Rural",
  "Autorização para Supressão de Vegetação (ASV)",
  "Outorga d'Água",
  "KML da Área Total do Imóvel",
  "KML da Área Beneficiada no Custeio",
];
const storage = firebase.storage();

// Elementos do DOM
const listaPendentes = document.getElementById("listaPendentes");
const listaEnviados = document.getElementById("listaEnviados");
const listaAprovados = document.getElementById("listaAprovados");

const formUpload = document.getElementById("form-upload-documento");
const fileInput = document.getElementById("inputFotoDocumento");
const btnEnviar = document.getElementById("btnEnviarDocumento");
const previewDiv = document.getElementById("previewFotoDocumento");
const progressContainer = document.getElementById("uploadProgressBarContainer");
const progressBar = document.getElementById("uploadProgressBar");

let tipoDocumentoSelecionado = null;

// Logo após definir as variáveis globais:
const urlParams = new URLSearchParams(window.location.search);
const idSolicitacao = urlParams.get("idSolicitacao");
const idCliente = urlParams.get("idCliente");
let clienteIdSelecionado = idCliente;

document.addEventListener("DOMContentLoaded", () => {
  if (!clienteIdSelecionado) {
    //console.log("Cliente não identificado. Volte e selecione uma solicitação.");
    return;
  }
  carregarDocumentosCliente(clienteIdSelecionado);
});

// Ao clicar no botão Documentos, abrir modal e carregar listas
document.addEventListener("click", async (e) => {
  if (e.target && e.target.classList.contains("btn-upload-documento")) {
    clienteIdSelecionado = e.target.getAttribute("data-cliente-id");
    tipoDocumentoSelecionado = null;

    limparTudo();
    await carregarDocumentosCliente(clienteIdSelecionado);

    const modalEl = document.getElementById("uploadDocumentosModal");
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();

    // Força abrir aba Pendentes
    const tabTrigger = new bootstrap.Tab(
      document.querySelector("#pendentes-tab")
    );
    tabTrigger.show();
  }
});

// Limpar interface antes de carregar
function limparTudo() {
  listaPendentes.innerHTML = "";
  listaEnviados.innerHTML = "";
  listaAprovados.innerHTML = "";
  previewDiv.innerHTML = "";
  fileInput.value = "";
  btnEnviar.disabled = true;
  btnEnviar.textContent = "Enviar";
  progressContainer.style.display = "none";
  progressBar.style.width = "0%";
  progressBar.textContent = "0%";
  formUpload.style.display = "none";
}

// Carrega documentos do cliente do Firestore e separa pendentes, enviados e aprovados
async function carregarDocumentosCliente(clienteId) {
  if (!clienteId) return;

  try {
    const docSnap = await firebase
      .firestore()
      .collection("clientes")
      .doc(clienteId)
      .get();
    const data = docSnap.exists ? docSnap.data() : {};
    const documentos = data.documentos || {};

    // Separar documentos
    const enviados = [];
    const aprovados = [];

    for (const docName of Object.keys(documentos)) {
      const doc = documentos[docName];
      if (doc && doc.url) {
        if (doc.status === "aprovado")
          aprovados.push({ tipo: docName, url: doc.url });
        else enviados.push({ tipo: docName, url: doc.url });
      }
    }

    // Pendentes = lista fixa - docs enviados e aprovados
    const docsPendentes = listaDocumentosFixos.filter(
      (docName) =>
        !enviados.some((e) => e.tipo === docName) &&
        !aprovados.some((a) => a.tipo === docName)
    );

    mostrarPendentes(docsPendentes);
    mostrarEnviados(enviados);
    mostrarAprovados(aprovados);
  } catch (error) {
    alert("Erro ao carregar documentos: " + error.message);
  }
}

// Mostrar pendentes, clicáveis para iniciar upload
function mostrarPendentes(pendentes) {
  listaPendentes.innerHTML = "";
  if (!pendentes.length) {
    listaPendentes.innerHTML =
      '<li class="list-group-item text-center">Nenhum documento pendente</li>';
    formUpload.style.display = "none";
    return;
  }
  pendentes.forEach((tipo) => {
    const li = document.createElement("li");
    li.className = "list-group-item list-group-item-action";
    li.textContent = tipo;
    li.style.cursor = "pointer";
    li.onclick = () => {
      tipoDocumentoSelecionado = tipo;
      mostrarFormUpload(tipo);
    };
    listaPendentes.appendChild(li);
  });
}

// Mostrar enviados com botões Aprovar e Desaprovar
function mostrarEnviados(enviados) {
  listaEnviados.innerHTML = "";
  if (!enviados.length) {
    listaEnviados.innerHTML =
      '<li class="list-group-item text-center">Nenhum documento enviado</li>';
    return;
  }
  enviados.forEach(({ tipo, url }) => {
    const li = document.createElement("li");
    li.className =
      "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
      <span>${tipo}</span>
      <div>
        <a href="${url}" target="_blank" class="btn btn-outline-dark btn-sm me-2">Ver</a>
        <button class="btn btn-success btn-sm btn-aprovar-doc" data-tipo="${tipo}">Aprovar</button>
        <button class="btn btn-danger btn-sm btn-desaprovar-doc" data-tipo="${tipo}" data-url="${url}">Desaprovar</button>
      </div>
    `;
    listaEnviados.appendChild(li);
  });
}

// Mostrar aprovados com botão Excluir
function mostrarAprovados(aprovados) {
  listaAprovados.innerHTML = "";
  if (!aprovados.length) {
    listaAprovados.innerHTML =
      '<li class="list-group-item text-center">Nenhum documento aprovado</li>';
    return;
  }
  aprovados.forEach(({ tipo, url }) => {
    const li = document.createElement("li");
    li.className =
      "list-group-item d-flex justify-content-between align-items-center bg-success text-white";
    li.innerHTML = `
      <span>${tipo}</span>
      <div>
        <a href="${url}" target="_blank" class="btn btn-outline-light btn-sm me-2">Ver</a>
        <button class="btn btn-danger btn-sm btn-excluir-doc" data-tipo="${tipo}" data-url="${url}">Excluir</button>
      </div>
    `;
    listaAprovados.appendChild(li);
  });
}

// Mostrar formulário upload na aba Pendentes após selecionar um documento
function mostrarFormUpload(tipo) {
  formUpload.style.display = "block";
  previewDiv.innerHTML = "";
  btnEnviar.disabled = true;
  fileInput.value = "";
  previewDiv.innerHTML = `<p>Enviando documento: <strong>${tipo}</strong></p>`;
}

// Habilitar botão enviar só se tiver arquivo selecionado
fileInput.addEventListener("change", () => {
  btnEnviar.disabled = !fileInput.files.length;
});

// Envio do documento para Storage e Firestore
formUpload.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!tipoDocumentoSelecionado)
    return alert("Selecione um documento pendente para enviar.");
  if (!fileInput.files.length)
    return alert("Selecione um arquivo para enviar.");
  if (!clienteIdSelecionado) return alert("Cliente não definido.");

  btnEnviar.disabled = true;
  btnEnviar.textContent = "Enviando...";
  progressContainer.style.display = "block";
  progressBar.style.width = "0%";
  progressBar.textContent = "0%";
  fileInput.disabled = true;

  try {
    const file = fileInput.files[0];
    const storageRef = storage.ref(
      `documentos/${clienteIdSelecionado}/${Date.now()}-${file.name}`
    );
    const uploadTask = storageRef.put(file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        progressBar.style.width = progress + "%";
        progressBar.textContent = progress + "%";
      },
      (error) => {
        alert("Erro no upload: " + error.message);
        progressContainer.style.display = "none";
        btnEnviar.disabled = false;
        btnEnviar.textContent = "Enviar";
        fileInput.disabled = false;
      },
      async () => {
        const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();

        await firebase
          .firestore()
          .collection("clientes")
          .doc(clienteIdSelecionado)
          .set(
            {
              documentos: {
                [tipoDocumentoSelecionado]: {
                  url: downloadURL,
                  status: "enviado",
                },
              },
            },
            { merge: true }
          );

        alert("Documento enviado com sucesso!");
        await carregarDocumentosCliente(clienteIdSelecionado);

        // Limpa e esconde o formulário
        fileInput.value = "";
        btnEnviar.disabled = true;
        btnEnviar.textContent = "Enviar";
        formUpload.style.display = "none";
        previewDiv.innerHTML = "";

        progressContainer.style.display = "none";
        fileInput.disabled = false;
      }
    );
  } catch (error) {
    alert("Erro ao enviar documento: " + error.message);
    progressContainer.style.display = "none";
    btnEnviar.disabled = false;
    btnEnviar.textContent = "Enviar";
    fileInput.disabled = false;
  }
});

// Botões Aprovar e Desaprovar na aba enviados
listaEnviados.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btn-aprovar-doc")) {
    const tipo = e.target.getAttribute("data-tipo");
    await aprovarDocumento(tipo);
  } else if (e.target.classList.contains("btn-desaprovar-doc")) {
    const tipo = e.target.getAttribute("data-tipo");
    const url = e.target.getAttribute("data-url");
    await desaprovarDocumento(tipo, url);
  }
});

// Botão excluir na aba aprovados
listaAprovados.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btn-excluir-doc")) {
    const tipo = e.target.getAttribute("data-tipo");
    const url = e.target.getAttribute("data-url");
    if (!confirm(`Tem certeza que deseja excluir o documento "${tipo}"?`))
      return;
    try {
      await firebase
        .firestore()
        .collection("clientes")
        .doc(clienteIdSelecionado)
        .update({
          [`documentos.${tipo}`]: firebase.firestore.FieldValue.delete(),
        });

      if (url) {
        const storageRef = storage.refFromURL(url);
        await storageRef.delete();
      }

      alert(`Documento "${tipo}" excluído com sucesso!`);
      await carregarDocumentosCliente(clienteIdSelecionado);
    } catch (error) {
      alert("Erro ao excluir documento: " + error.message);
    }
  }
});

// Aprovar documento
async function aprovarDocumento(tipo) {
  if (!clienteIdSelecionado) return alert("Cliente não definido.");
  try {
    await firebase
      .firestore()
      .collection("clientes")
      .doc(clienteIdSelecionado)
      .update({
        [`documentos.${tipo}.status`]: "aprovado",
      });
    alert(`Documento "${tipo}" aprovado.`);
    await carregarDocumentosCliente(clienteIdSelecionado);
  } catch (error) {
    alert("Erro ao aprovar documento: " + error.message);
  }
}

// Desaprovar documento (exclui e volta para pendentes)
async function desaprovarDocumento(tipo, url) {
  if (!clienteIdSelecionado) return alert("Cliente não definido.");
  if (
    !confirm(
      `Tem certeza que deseja desaprovar e excluir o documento "${tipo}"?`
    )
  )
    return;

  try {
    await firebase
      .firestore()
      .collection("clientes")
      .doc(clienteIdSelecionado)
      .update({
        [`documentos.${tipo}`]: firebase.firestore.FieldValue.delete(),
      });

    if (url) {
      const storageRef = storage.refFromURL(url);
      await storageRef.delete();
    }

    alert(`Documento "${tipo}" desaprovado e excluído.`);
    await carregarDocumentosCliente(clienteIdSelecionado);
  } catch (error) {
    alert("Erro ao desaprovar documento: " + error.message);
  }
}
async function exibirInfoCliente() {
  if (!clienteIdSelecionado) return;
  const docSnap = await firebase
    .firestore()
    .collection("clientes")
    .doc(clienteIdSelecionado)
    .get();
  if (docSnap.exists) {
    document.getElementById("infoCliente").innerHTML = `<b>Cliente:</b> ${
      docSnap.data().nome || "Nome não cadastrado"
    }`;
    document.getElementById("infoCliente").style.display = "block";
  }
}
