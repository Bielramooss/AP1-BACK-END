/**
 * ==============================================================================
 * JavaScript Puro - Integração com a API da Loja de Roupas (AP1)
 *
 * - Integração completa via fetch com os endpoints REST:
 *   GET    /api/produtos
 *   GET    /api/produtos/{id}
 *   POST   /api/produtos
 *   PUT    /api/produtos/{id}
 *   DELETE /api/produtos/{id}
 * - Manipulação segura de dados da API via textContent (sem innerHTML com dados).
 * - Sincronização automática do catálogo após cadastrar, editar ou excluir.
 * ==============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "/api/produtos";

  // Estado da aplicação
  let listaProdutos = [];
  let idEmEdicao = null;
  let idParaExcluir = null;
  let isCarregando = false;

  // Elementos do DOM - Formulário
  const form = document.getElementById("clothing-form");
  const formHeading = document.getElementById("form-heading");
  const formModeBadge = document.getElementById("form-mode-badge");
  const inputId = document.getElementById("clothing-id");
  const inputNome = document.getElementById("clothing-name");
  const selectTipo = document.getElementById("clothing-type");
  const inputData = document.getElementById("clothing-date");
  const btnSubmit = document.getElementById("btn-submit");
  const submitBtnText = document.getElementById("submit-btn-text");
  const btnCancel = document.getElementById("btn-cancel");
  const btnReloadList = document.getElementById("btn-reload-list");

  // Elementos do DOM - Listagem e Filtros
  const searchInput = document.getElementById("search-input");
  const filterType = document.getElementById("filter-type");
  const tableContainer = document.getElementById("table-container");
  const clothesTbody = document.getElementById("clothes-tbody");
  const totalCount = document.getElementById("total-count");
  const loadingState = document.getElementById("loading-state");
  const emptyState = document.getElementById("empty-state");
  const emptyMessage = document.getElementById("empty-message");

  // Elementos do DOM - Feedback e Modal
  const feedbackAlert = document.getElementById("feedback-message");
  const deleteDialog = document.getElementById("delete-dialog");
  const dialogMessage = document.getElementById("dialog-message");
  const btnConfirmDelete = document.getElementById("btn-confirm-delete");
  const btnCancelDelete = document.getElementById("btn-cancel-delete");

  let feedbackTimeout = null;

  /**
   * Exibe mensagens de feedback com textContent (seguro contra XSS)
   * @param {string} mensagem Texto da mensagem
   * @param {'success'|'warning'|'danger'} tipo Tipo do alerta
   */
  function exibirFeedback(mensagem, tipo = "success") {
    if (feedbackTimeout) {
      clearTimeout(feedbackTimeout);
    }

    feedbackAlert.className = `feedback-alert feedback-${tipo}`;
    feedbackAlert.textContent = mensagem;
    feedbackAlert.hidden = false;

    feedbackTimeout = setTimeout(() => {
      feedbackAlert.hidden = true;
    }, 4500);
  }

  /**
   * Formata data ISO (AAAA-MM-DD) para exibição brasileira (DD/MM/AAAA)
   * @param {string} dataIso
   * @returns {string}
   */
  function formatarData(dataIso) {
    if (!dataIso) return "—";
    const partes = String(dataIso).split("-");
    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return String(dataIso);
  }

  /**
   * Preenche a data padrão de hoje no formulário
   */
  function preencherDataHoje() {
    const hoje = new Date().toISOString().split("T")[0];
    inputData.value = hoje;
  }

  /**
   * Controla a visibilidade do estado de carregamento
   * @param {boolean} carregando
   */
  function definirCarregando(carregando) {
    isCarregando = carregando;
    if (carregando) {
      if (loadingState) loadingState.hidden = false;
      if (tableContainer) tableContainer.hidden = true;
      if (emptyState) emptyState.hidden = true;
    } else {
      if (loadingState) loadingState.hidden = true;
    }
  }

  /**
   * Renderiza a lista de roupas no DOM usando estritamente textContent
   */
  function renderizarTabela() {
    const termoBusca = (searchInput.value || "").toLowerCase().trim();
    const tipoFiltro = filterType.value;

    const itensFiltrados = listaProdutos.filter((item) => {
      const nome = String(item.nome ?? item.Nome ?? "").toLowerCase();
      const tipo = String(item.tipo ?? item.Tipo ?? "");
      const correspondeNome = nome.includes(termoBusca);
      const correspondeTipo = (tipoFiltro === "todos" || !tipoFiltro) ? true : tipo === tipoFiltro;
      return correspondeNome && correspondeTipo;
    });

    totalCount.textContent = String(itensFiltrados.length);

    // Limpa o conteúdo anterior do tbody com segurança
    while (clothesTbody.firstChild) {
      clothesTbody.removeChild(clothesTbody.firstChild);
    }

    if (itensFiltrados.length === 0) {
      if (tableContainer) tableContainer.hidden = true;
      if (emptyState) {
        emptyState.hidden = false;
        if (listaProdutos.length === 0) {
          emptyMessage.textContent = "O catálogo está vazio. Cadastre uma nova peça utilizando o formulário.";
        } else {
          emptyMessage.textContent = "Nenhuma roupa encontrada com os filtros selecionados.";
        }
      }
      return;
    }

    if (emptyState) emptyState.hidden = true;
    if (tableContainer) tableContainer.hidden = false;

    itensFiltrados.forEach((item) => {
      const idVal = item.id;
      const nomeVal = item.nome ?? item.Nome ?? "";
      const tipoVal = item.tipo ?? item.Tipo ?? "";
      const dataVal = item.data ?? item.Data ?? "";

      const tr = document.createElement("tr");

      // Coluna ID
      const tdId = document.createElement("td");
      tdId.setAttribute("data-label", "ID");
      tdId.textContent = `#${idVal}`;
      tdId.style.fontWeight = "600";
      tdId.style.color = "var(--text-muted)";

      // Coluna Nome
      const tdNome = document.createElement("td");
      tdNome.setAttribute("data-label", "Nome da Peça");
      tdNome.textContent = nomeVal;
      tdNome.style.fontWeight = "600";

      // Coluna Tipo
      const tdTipo = document.createElement("td");
      tdTipo.setAttribute("data-label", "Tipo");
      const spanTipo = document.createElement("span");
      spanTipo.className = "tag-type";
      spanTipo.textContent = tipoVal;
      tdTipo.appendChild(spanTipo);

      // Coluna Data
      const tdData = document.createElement("td");
      tdData.setAttribute("data-label", "Data");
      tdData.textContent = formatarData(dataVal);

      // Coluna Ações
      const tdAcoes = document.createElement("td");
      tdAcoes.className = "actions-cell";
      tdAcoes.setAttribute("data-label", "Ações");

      // Botão Editar
      const btnEditar = document.createElement("button");
      btnEditar.type = "button";
      btnEditar.className = "btn btn-secondary btn-sm";
      btnEditar.setAttribute("aria-label", `Editar ${nomeVal}`);
      btnEditar.textContent = "Editar";
      btnEditar.addEventListener("click", () => iniciarEdicao(idVal));

      // Botão Excluir
      const btnExcluir = document.createElement("button");
      btnExcluir.type = "button";
      btnExcluir.className = "btn btn-danger btn-sm";
      btnExcluir.setAttribute("aria-label", `Excluir ${nomeVal}`);
      btnExcluir.textContent = "Excluir";
      btnExcluir.addEventListener("click", () => abrirModalExclusao(item));

      tdAcoes.appendChild(btnEditar);
      tdAcoes.appendChild(btnExcluir);

      tr.appendChild(tdId);
      tr.appendChild(tdNome);
      tr.appendChild(tdTipo);
      tr.appendChild(tdData);
      tr.appendChild(tdAcoes);

      clothesTbody.appendChild(tr);
    });
  }

  /**
   * GET /api/produtos - Carrega produtos reais da API
   */
  async function carregarProdutos() {
    definirCarregando(true);
    try {
      const resposta = await fetch(API_URL);

      if (!resposta.ok) {
        throw new Error(`Erro ao obter produtos da API (Status HTTP ${resposta.status}).`);
      }

      const dados = await resposta.json();
      listaProdutos = Array.isArray(dados) ? dados : [];
      renderizarTabela();
    } catch (erro) {
      console.error("Falha ao carregar produtos:", erro);
      listaProdutos = [];
      renderizarTabela();
      exibirFeedback(erro.message || "Erro de conexão ao carregar produtos da API.", "danger");
    } finally {
      definirCarregando(false);
    }
  }

  /**
   * GET /api/produtos/{id} - Busca detalhes da peça para edição
   * @param {number} id
   */
  async function iniciarEdicao(id) {
    try {
      const resposta = await fetch(`${API_URL}/${id}`);

      if (!resposta.ok) {
        if (resposta.status === 404) {
          throw new Error(`Peça #${id} não encontrada no banco de dados.`);
        }
        throw new Error(`Erro ao carregar detalhes da peça #${id} (Status HTTP ${resposta.status}).`);
      }

      const item = await resposta.json();

      idEmEdicao = item.id;
      inputId.value = item.id;
      inputNome.value = item.nome ?? item.Nome ?? "";
      selectTipo.value = item.tipo ?? item.Tipo ?? "";
      inputData.value = item.data ?? item.Data ?? "";

      formHeading.textContent = `Editar Roupa (#${item.id})`;
      formModeBadge.textContent = "Modo Edição";
      formModeBadge.classList.add("editing");
      submitBtnText.textContent = "Salvar Alterações";
      btnCancel.hidden = false;

      form.scrollIntoView({ behavior: "smooth", block: "start" });
      inputNome.focus();
      exibirFeedback(`Editando peça #${item.id} - "${item.nome ?? item.Nome}". Faça as alterações e salve.`, "warning");
    } catch (erro) {
      console.error("Falha ao obter produto por ID:", erro);
      exibirFeedback(erro.message || "Erro ao consultar dados da peça.", "danger");
    }
  }

  /**
   * Reseta o formulário para modo de criação
   */
  function resetarFormulario() {
    idEmEdicao = null;
    form.reset();
    inputId.value = "";
    preencherDataHoje();

    formHeading.textContent = "Cadastrar Nova Roupa";
    formModeBadge.textContent = "Novo Registro";
    formModeBadge.classList.remove("editing");
    submitBtnText.textContent = "Cadastrar Roupa";
    btnCancel.hidden = true;
  }

  /**
   * POST /api/produtos ou PUT /api/produtos/{id}
   */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = inputNome.value.trim();
    const tipo = selectTipo.value;
    const data = inputData.value;

    if (!nome) {
      exibirFeedback("Por favor, preencha o nome da roupa.", "danger");
      inputNome.focus();
      return;
    }

    if (!tipo) {
      exibirFeedback("Por favor, selecione o tipo da roupa.", "danger");
      selectTipo.focus();
      return;
    }

    if (!data) {
      exibirFeedback("Por favor, informe a data de cadastro.", "danger");
      inputData.focus();
      return;
    }

    btnSubmit.disabled = true;
    const textoOriginal = submitBtnText.textContent;
    submitBtnText.textContent = idEmEdicao !== null ? "Salvando..." : "Cadastrando...";

    try {
      if (idEmEdicao !== null) {
        // PUT /api/produtos/{id}
        const payload = {
          id: idEmEdicao,
          nome: nome,
          data: data,
          tipo: tipo
        };

        const resposta = await fetch(`${API_URL}/${idEmEdicao}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        if (!resposta.ok) {
          throw new Error(`Falha ao atualizar a roupa #${idEmEdicao} (Status HTTP ${resposta.status}).`);
        }

        const produtoAtualizado = await resposta.json();
        const nomeAtualizado = produtoAtualizado.nome ?? produtoAtualizado.Nome ?? nome;

        resetarFormulario();
        await carregarProdutos();
        exibirFeedback(`Peça #${idEmEdicao} ("${nomeAtualizado}") atualizada com sucesso na API!`, "success");
      } else {
        // POST /api/produtos
        const payload = {
          nome: nome,
          data: data,
          tipo: tipo
        };

        const resposta = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        if (!resposta.ok || resposta.status !== 201) {
          throw new Error(`Falha ao cadastrar a roupa (Status HTTP ${resposta.status}).`);
        }

        const novoProduto = await resposta.json();
        const nomeCadastrado = novoProduto.nome ?? novoProduto.Nome ?? nome;

        resetarFormulario();
        await carregarProdutos();
        exibirFeedback(`Peça #${novoProduto.id} ("${nomeCadastrado}") cadastrada com sucesso na API!`, "success");
      }
    } catch (erro) {
      console.error("Erro na operação de salvar produto:", erro);
      exibirFeedback(erro.message || "Erro de conexão ao salvar produto.", "danger");
    } finally {
      btnSubmit.disabled = false;
      submitBtnText.textContent = textoOriginal;
    }
  });

  // Cancelar edição
  btnCancel.addEventListener("click", () => {
    resetarFormulario();
    exibirFeedback("Modo de edição cancelado.", "warning");
  });

  /**
   * Abre modal de confirmação de exclusão
   * @param {{ id: number, nome?: string, Nome?: string }} item
   */
  function abrirModalExclusao(item) {
    idParaExcluir = item.id;
    const nome = item.nome ?? item.Nome ?? `Peça #${item.id}`;

    dialogMessage.textContent = `Deseja realmente excluir a peça #${item.id} - "${nome}" do banco de dados?`;

    if (typeof deleteDialog.showModal === "function") {
      deleteDialog.showModal();
    } else {
      if (confirm(`Excluir a peça "${nome}" da loja?`)) {
        confirmarExclusao();
      }
    }
  }

  function fecharModalExclusao() {
    idParaExcluir = null;
    if (typeof deleteDialog.close === "function") {
      deleteDialog.close();
    }
  }

  /**
   * DELETE /api/produtos/{id} - Remove o produto na API
   */
  async function confirmarExclusao() {
    if (idParaExcluir === null) return;

    const idAlvo = idParaExcluir;
    btnConfirmDelete.disabled = true;

    try {
      const resposta = await fetch(`${API_URL}/${idAlvo}`, {
        method: "DELETE"
      });

      if (!resposta.ok || (resposta.status !== 204 && resposta.status !== 200)) {
        throw new Error(`Falha ao excluir a peça #${idAlvo} (Status HTTP ${resposta.status}).`);
      }

      if (idEmEdicao === idAlvo) {
        resetarFormulario();
      }

      fecharModalExclusao();
      await carregarProdutos();
      exibirFeedback(`Peça #${idAlvo} excluída com sucesso da loja!`, "success");
    } catch (erro) {
      console.error("Erro ao excluir produto:", erro);
      exibirFeedback(erro.message || "Erro de conexão ao excluir produto.", "danger");
      fecharModalExclusao();
    } finally {
      btnConfirmDelete.disabled = false;
    }
  }

  btnConfirmDelete.addEventListener("click", confirmarExclusao);
  btnCancelDelete.addEventListener("click", fecharModalExclusao);

  // Recarregar lista da API manualmente
  if (btnReloadList) {
    btnReloadList.addEventListener("click", async () => {
      if (isCarregando) return;
      await carregarProdutos();
      exibirFeedback("Catálogo sincronizado com a API.", "success");
    });
  }

  // Filtros em tempo de digitação/seleção
  searchInput.addEventListener("input", renderizarTabela);
  filterType.addEventListener("change", renderizarTabela);

  // Inicialização da interface
  preencherDataHoje();
  carregarProdutos();
});
