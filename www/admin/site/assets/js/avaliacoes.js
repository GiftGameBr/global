window.db = firebase.firestore(); // ✅ Correto

const urlParams = new URLSearchParams(window.location.search);
const idEdicao = urlParams.get("id"); // se houver ?id=xxxx

// Função para capturar coordenadas GPS
function capturarGPS(index) {
  if (!navigator.geolocation) {
    alert("Geolocalização não é suportada por este navegador.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    function (position) {
      document.getElementById(`lat${index}`).value =
        position.coords.latitude.toFixed(8);
      document.getElementById(`lng${index}`).value =
        position.coords.longitude.toFixed(8);
    },
    function (error) {
      alert("Erro ao capturar coordenadas: " + error.message);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
    }
  );
}

firebase.auth().onAuthStateChanged(function (user) {
  if (!user) {
    Swal.fire({
      icon: "warning",
      title: "Você precisa estar logado para acessar esta página",
    }).then(() => {
      window.location.href = "login.html";
    });
    return;
  }

  const addedByEmail = user.email;
  const clienteID = user.uid;

  // Verifique se estamos em modo de visualização
  const isViewMode = idEdicao && window.location.search.includes("view=true");

  // Se for edição, carregar dados
  if (idEdicao) {
    db.collection("avaliacoes")
      .doc(idEdicao)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const dados = doc.data();

          // Preencher dados da avaliação no formulário
          document.getElementById("proponente").value = dados.proponente || "";
          document.getElementById("pessoa").value = dados.pessoa || "";
          document.getElementById("cpf_cnpj").value = dados.cpf_cnpj || "";
          document.getElementById("denominacao").value =
            dados.denominacao || "";
          document.getElementById("uf_imovel").value = dados.uf_imovel || "";
          document.getElementById("municipio_imovel").value =
            dados.municipio_imovel || "";
          document.getElementById("comarca").value = dados.comarca || "";
          document.getElementById("livro").value = dados.livro || "";
          document.getElementById("folha").value = dados.folha || "";
          document.getElementById("matricula").value = dados.matricula || "";
          document.getElementById("ccir").value = dados.ccir || "";
          document.getElementById("car").value = dados.car || "";
          document.getElementById("area").value = dados.area || "";
          document.getElementById("atividade_explorada").value =
            dados.atividade_explorada || "";
          document.getElementById("roteiro_acesso").value =
            dados.roteiro_acesso || "";

          (dados.coordenadas || []).forEach((coord, i) => {
            document.getElementById(`lat${i + 1}`).value = coord.latitude || "";
            document.getElementById(`lng${i + 1}`).value =
              coord.longitude || "";
          });

          if (typeof atualizarMapa === "function") {
            atualizarMapa();
          }

          // Verifica se status é concluído ou se está no modo de visualização
          if (dados.status === "concluido" || isViewMode) {
            const inputs = document.querySelectorAll("input");
            inputs.forEach((input) => {
              input.disabled = true;
            });

            const textareas = document.querySelectorAll("textarea");
            textareas.forEach((textarea) => {
              textarea.disabled = true;
            });

            const submitButton = document.getElementById("lead-form-submit");
            if (submitButton) {
              submitButton.style.display = "none"; // Esconde o botão de enviar
            }

            document.getElementById("lead-form").style.pointerEvents = "none";
          }

          // Preencher responsáveis
          preencherResponsaveisAvaliacoes(
            dados.responsavelGerenteId,
            dados.responsavelSecundarioId
          );

          // Carregar cliente associado
          loadCliente(dados.clienteID); // Chamada para carregar o cliente
        } else {
          Swal.fire("Erro", "Avaliação não encontrada para edição.", "error");
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar dados:", error);
        Swal.fire("Erro", "Erro ao carregar dados.", "error");
      });
  }
  if (!idEdicao) {
    loadClientes(); // Carregar a lista de clientes
    // Carregar a lista de responsáveis
  }

  document.getElementById("lead-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const clienteID = document.getElementById("cliente_id").value; // Captura o ID do cliente selecionado
    const responsavelGerenteId = document.getElementById(
      "edit-responsavel-gerente"
    ).value; // Responsável Gerente
    const responsavelSecundarioId = document.getElementById(
      "edit-responsavel-secundario"
    ).value; // Responsável Secundário
    const avaliacao = {
      proponente: document.getElementById("proponente").value.trim(),
      pessoa: document.getElementById("pessoa").value.trim(),
      cpf_cnpj: document.getElementById("cpf_cnpj").value.trim(),
      denominacao: document.getElementById("denominacao").value.trim(),
      uf_imovel: document.getElementById("uf_imovel").value.trim(),
      municipio_imovel: document
        .getElementById("municipio_imovel")
        .value.trim(),
      comarca: document.getElementById("comarca").value.trim(),
      livro: document.getElementById("livro").value.trim(),
      folha: document.getElementById("folha").value.trim(),
      matricula: document.getElementById("matricula").value.trim(),
      ccir: document.getElementById("ccir").value.trim(),
      car: document.getElementById("car").value.trim(),
      area: document.getElementById("area").value.trim(),
      atividade_explorada: document
        .getElementById("atividade_explorada")
        .value.trim(),
      roteiro_acesso: document.getElementById("roteiro_acesso").value.trim(),
      coordenadas: [
        {
          latitude: document.getElementById("lat1").value.trim(),
          longitude: document.getElementById("lng1").value.trim(),
        },
        {
          latitude: document.getElementById("lat2").value.trim(),
          longitude: document.getElementById("lng2").value.trim(),
        },
        {
          latitude: document.getElementById("lat3").value.trim(),
          longitude: document.getElementById("lng3").value.trim(),
        },
        {
          latitude: document.getElementById("lat4").value.trim(),
          longitude: document.getElementById("lng4").value.trim(),
        },
      ],
      clienteID: clienteID, // Adiciona o clienteID
      responsavelGerenteId: responsavelGerenteId, // Adiciona o ID do responsável gerente
      responsavelSecundarioId: responsavelSecundarioId,
    };

    if (idEdicao) {
      db.collection("avaliacoes")
        .doc(idEdicao)
        .update(avaliacao)
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Avaliação atualizada com sucesso!",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            window.location.href = "avaliacoes-list.html";
          });
        })
        .catch((error) => {
          console.error("Erro ao atualizar:", error);
          Swal.fire("Erro", "Erro ao atualizar avaliação.", "error");
        });
    } else {
      db.collection("avaliacoes")
        .add({
          ...avaliacao,
          clienteID: clienteID,
          addedBy: addedByEmail,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          status: "aguardando",
        })
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Avaliação salva com sucesso!",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            window.location.href = "avaliacoes-list.html";
          });
          loadAvaliacoes(); // Adicionado para recarregar a tabela
        })
        .catch((error) => {
          console.error("Erro ao salvar avaliação:", error);
          Swal.fire({
            icon: "error",
            title: "Erro ao salvar",
            text: "Tente novamente mais tarde.",
          });
        });
    }
  });
});

// Função para carregar o cliente no formulário de Avaliações
async function loadCliente(clienteID) {
  const clienteDoc = await db.collection("clientes").doc(clienteID).get();

  if (clienteDoc.exists) {
    const cliente = clienteDoc.data();

    // Preencher o campo do cliente
    const clienteSelect = document.getElementById("cliente_id");

    // Verifique se o cliente existe e preenche o campo de seleção com as informações do cliente
    clienteSelect.innerHTML = ""; // Limpar as opções
    const option = document.createElement("option");
    option.value = clienteID;
    option.textContent =
      cliente.nome || cliente.email || "Cliente não encontrado"; // Exibe o nome ou e-mail
    clienteSelect.appendChild(option);

    // Caso você queira carregar outros dados, como nome e e-mail, faça o seguinte:
    document.getElementById("cliente_nome").value = cliente.nome || "";
    document.getElementById("cliente_email").value = cliente.email || "";
  } else {
    console.error("Cliente não encontrado.");
  }
}

let mapa = L.map("map").setView([-14.235, -51.9253], 4); // Centro do Brasil

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap",
}).addTo(mapa);

function atualizarMapa() {
  mapa.eachLayer(function (layer) {
    if (layer instanceof L.Marker) {
      mapa.removeLayer(layer);
    }
  });

  let coordenadas = [];

  for (let i = 1; i <= 4; i++) {
    const lat = parseFloat(document.getElementById(`lat${i}`).value);
    const lng = parseFloat(document.getElementById(`lng${i}`).value);

    if (!isNaN(lat) && !isNaN(lng)) {
      coordenadas.push([lat, lng]);
      L.marker([lat, lng]).addTo(mapa).bindPopup(`Ponto ${i}`).openPopup();
    }
  }

  if (coordenadas.length > 0) {
    mapa.setView(coordenadas[0], 15);
  }

  // 🚨 ESSENCIAL: força o Leaflet a redesenhar corretamente
  setTimeout(() => {
    mapa.invalidateSize();
  }, 200);
}

// Atualiza o mapa automaticamente quando o usuário captura cada coordenada
for (let i = 1; i <= 4; i++) {
  const btn = document.querySelector(`button[onclick="capturarGPS(${i})"]`);
  btn.addEventListener("click", function () {
    setTimeout(() => {
      atualizarMapa();
    }, 1000); // espera o GPS preencher o input
  });
}

async function salvarSolicitacao(dados) {
  if (dados.responsavelGerenteId) {
    const doc = await db
      .collection("gerentes")
      .doc(dados.responsavelGerenteId)
      .get();
    if (doc.exists)
      dados.responsavelGerenteNome = doc.data().nome || doc.data().email;
  }

  if (dados.responsavelSecundarioId) {
    const doc = await db
      .collection("agentes")
      .doc(dados.responsavelSecundarioId)
      .get();
    if (doc.exists)
      dados.responsavelSecundarioNome = doc.data().nome || doc.data().email;
  }

  await db.collection("investimento").add(dados);
}

async function loadClientes() {
  const snap = await db.collection("clientes").get();
  const select = document.getElementById("cliente_id");
  let options = `<option value="">Selecione o cliente...</option>`;
  snap.forEach((doc) => {
    const c = doc.data();
    options += `<option value="${doc.id}">${
      c.nome || c.email || c.empresa || "Cliente"
    }</option>`;
  });
  select.innerHTML = options;
}

async function loadGerentes() {
  const snap = await db.collection("gerentes").get();
  const select = document.getElementById("edit-responsavel-gerente");
  let options = `<option value="">Não atribuído</option>`;
  snap.forEach((doc) => {
    const g = doc.data();
    options += `<option value="${doc.id}">${g.nome || g.email}</option>`;
  });
  select.innerHTML = options;
}

async function loadAgentesOuGerentes() {
  const snapAgentes = await db.collection("agentes").get();
  const snapGerentes = await db.collection("gerentes").get();
  const select = document.getElementById("edit-responsavel-secundario");
  let options = `<option value="">Não atribuído</option>`;

  snapAgentes.forEach((doc) => {
    const a = doc.data();
    options += `<option value="${doc.id}">${
      a.nome || a.email
    } (Agente)</option>`;
  });

  snapGerentes.forEach((doc) => {
    const g = doc.data();
    options += `<option value="${doc.id}">${
      g.nome || g.email
    } (Gerente)</option>`;
  });

  select.innerHTML = options;
}
let gerentesAtivos = [];
let agentesAtivos = [];

async function preencherResponsaveisAvaliacoes(
  valorGerenteSalvo = "",
  valorSecundarioSalvo = ""
) {
  const gerenteSelect = document.getElementById("edit-responsavel-gerente");
  const secundarioSelect = document.getElementById(
    "edit-responsavel-secundario"
  );

  gerenteSelect.innerHTML = '<option value="">Não atribuído</option>';
  secundarioSelect.innerHTML = '<option value="">Não atribuído</option>';

  // 1. Carrega gerentes ativos
  const gerentesSnap = await firebase
    .firestore()
    .collection("gerentes")
    .where("status", "==", "active")
    .get();

  gerentesAtivos = gerentesSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  gerentesAtivos.forEach((gerente) => {
    const option = document.createElement("option");
    option.value = gerente.id;
    option.textContent = gerente.nome_completo || gerente.email || "(sem nome)";
    gerenteSelect.appendChild(option);
  });

  // Seleciona gerente salvo, se houver
  if (valorGerenteSalvo) {
    gerenteSelect.value = valorGerenteSalvo;
  }

  // 2. Carrega agentes ativos
  const agentesSnap = await firebase
    .firestore()
    .collection("agentes")
    .where("status", "==", "active")
    .get();

  agentesAtivos = agentesSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  // 3. Atualiza os responsáveis secundários com base no gerente salvo
  atualizarSecundario(valorGerenteSalvo, valorSecundarioSalvo);

  // 4. Ao mudar o gerente, atualizar opções do secundário
  gerenteSelect.addEventListener("change", () => {
    atualizarSecundario(gerenteSelect.value);
  });
}

async function atualizarSecundario(
  gerenteIdSelecionado,
  valorSecundarioSalvo = ""
) {
  const secundarioSelect = document.getElementById(
    "edit-responsavel-secundario"
  );
  secundarioSelect.innerHTML = '<option value="">Não atribuído</option>';

  const gerenteSelecionado = gerentesAtivos.find(
    (g) => g.id === gerenteIdSelecionado
  );
  if (!gerenteSelecionado) return;

  const nomeGerente = gerenteSelecionado.nome_completo;

  // Adiciona o próprio gerente como opção
  const optionGerente = document.createElement("option");
  optionGerente.value = gerenteSelecionado.id;
  optionGerente.textContent = nomeGerente + " (Gerente)";
  secundarioSelect.appendChild(optionGerente);

  // Adiciona agentes que têm esse gerente como responsável
  agentesAtivos
    .filter((ag) => ag.gerenteNome === nomeGerente)
    .forEach((agente) => {
      const option = document.createElement("option");
      option.value = agente.id;
      option.textContent =
        (agente.nome_completo || agente.email || "(sem nome)") + " (Agente)";
      secundarioSelect.appendChild(option);
    });

  // 🔄 Garante que o valor salvo seja exibido mesmo que não esteja na lista
  if (
    valorSecundarioSalvo &&
    ![...secundarioSelect.options].some(
      (opt) => opt.value === valorSecundarioSalvo
    )
  ) {
    try {
      // Tenta buscar como agente
      const docAgente = await firebase
        .firestore()
        .collection("agentes")
        .doc(valorSecundarioSalvo)
        .get();
      if (docAgente.exists) {
        const data = docAgente.data();
        const option = document.createElement("option");
        option.value = valorSecundarioSalvo;
        option.textContent =
          (data.nome_completo || data.email || "(sem nome)") + " (Agente)";
        secundarioSelect.appendChild(option);
      } else {
        // Tenta buscar como gerente
        const docGerente = await firebase
          .firestore()
          .collection("gerentes")
          .doc(valorSecundarioSalvo)
          .get();
        if (docGerente.exists) {
          const data = docGerente.data();
          const option = document.createElement("option");
          option.value = valorSecundarioSalvo;
          option.textContent =
            (data.nome_completo || data.email || "(sem nome)") + " (Gerente)";
          secundarioSelect.appendChild(option);
        }
      }
    } catch (e) {
      console.warn(
        "Não foi possível carregar responsável secundário salvo:",
        e
      );
    }
  }

  // ✅ Seleciona valor salvo no campo
  if (valorSecundarioSalvo) {
    secundarioSelect.value = valorSecundarioSalvo;
  }
}

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    Promise.all([loadClientes(), preencherResponsaveisAvaliacoes()]).then(
      () => {
        // ou qualquer outra função que inicia sua tabela
      }
    );
  }
});
