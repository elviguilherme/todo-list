let tarefas = [];

let proximoId = 1;

const prioridadesValidas = ["Baixa", "Média", "Alta"];

function normalizarClasse(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const inputDescricao = document.getElementById("inputDescricao");
const selectPrioridade = document.getElementById("selectPrioridade");
const btnAdicionar = document.getElementById("btnAdicionar");
const listaTarefas = document.getElementById("listaTarefas");
const areaErro = document.getElementById("areaErro");

const modalOverlay = document.getElementById("modalOverlay");
const modalConfirmar = document.getElementById("modalConfirmar");
const modalCancelar = document.getElementById("modalCancelar");

let tarefaPendenteExclusao = null;
let cardPendenteExclusao = null;

btnAdicionar.addEventListener("click", aoClicarAdicionar);

modalConfirmar.addEventListener("click", aoConfirmarExclusaoNoModal);
modalCancelar.addEventListener("click", fecharModal);

function aoClicarAdicionar() {
  const descricao = inputDescricao.value.trim();
  const prioridade = selectPrioridade.value;

  limparErro();

  if (!validarCampos(descricao, prioridade)) {
    return;
  }

  const novaTarefa = criarObjetoTarefa(descricao, prioridade);
  tarefas.push(novaTarefa);

  renderizarTarefa(novaTarefa);
  limparFormulario();
}

function validarCampos(descricao, prioridade) {
  const descricaoVazia = descricao === "";
  const prioridadeInvalida = !prioridadesValidas.includes(prioridade);

  if (descricaoVazia && prioridadeInvalida) {
    mostrarErro("Faltando nome e prioridade.");
    return false;
  }

  if (descricaoVazia) {
    mostrarErro("Faltando nome.");
    return false;
  }

  if (prioridadeInvalida) {
    mostrarErro("Faltando prioridade.");
    return false;
  }

  return true;
}

function criarObjetoTarefa(descricao, prioridade) {
  const tarefa = {
    id: proximoId,
    descricao: descricao,
    prioridade: prioridade,
    concluida: false
  };

  proximoId++;
  return tarefa;
}

function renderizarTarefa(tarefa) {
  const item = document.createElement("li");
  item.className = "tarefa prioridade-" + normalizarClasse(tarefa.prioridade);
  item.dataset.id = tarefa.id;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = tarefa.concluida;
  checkbox.addEventListener("change", function () {
    alternarConclusao(tarefa.id, item);
  });

  const textoTarefa = document.createElement("span");
  textoTarefa.className = "tarefa-texto";
  textoTarefa.textContent = tarefa.descricao;

  const etiqueta = document.createElement("span");
  etiqueta.className = "etiqueta " + normalizarClasse(tarefa.prioridade);
  etiqueta.textContent = tarefa.prioridade;

  const btnExcluir = document.createElement("button");
  btnExcluir.className = "btnExcluir";
  btnExcluir.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<polyline points="3 6 5 6 21 6"></polyline>' +
    '<path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>' +
    '<path d="M10 11v6"></path>' +
    '<path d="M14 11v6"></path>' +
    '<path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>' +
    '</svg>';
  btnExcluir.addEventListener("click", function () {
    confirmarExclusao(tarefa.id, item);
  });

  if (tarefa.concluida) {
    item.classList.add("concluida");
  }

  item.appendChild(checkbox);
  item.appendChild(textoTarefa);
  item.appendChild(etiqueta);
  item.appendChild(btnExcluir);

  listaTarefas.appendChild(item);
}

function alternarConclusao(id, elementoCard) {
  const tarefa = tarefas.find(function (t) {
    return t.id === id;
  });

  if (!tarefa) return;

  tarefa.concluida = !tarefa.concluida;
  elementoCard.classList.toggle("concluida");
}

function confirmarExclusao(id, elementoCard) {
  const tarefa = tarefas.find(function (t) {
    return t.id === id;
  });

  if (!tarefa) return;

  if (tarefa.concluida) {
    excluirTarefa(id, elementoCard);
    return;
  }

  tarefaPendenteExclusao = id;
  cardPendenteExclusao = elementoCard;
  abrirModal();
}

function abrirModal() {
  modalOverlay.classList.remove("escondido");
}

function fecharModal() {
  modalOverlay.classList.add("escondido");
  tarefaPendenteExclusao = null;
  cardPendenteExclusao = null;
}

function aoConfirmarExclusaoNoModal() {
  if (tarefaPendenteExclusao !== null) {
    excluirTarefa(tarefaPendenteExclusao, cardPendenteExclusao);
  }
  fecharModal();
}

function excluirTarefa(id, elementoCard) {
  elementoCard.classList.add("saindo");

  elementoCard.addEventListener("animationend", function () {
    tarefas = tarefas.filter(function (t) {
      return t.id !== id;
    });

    elementoCard.remove();
  });
}

function mostrarErro(mensagem) {
  const div = document.createElement("div");
  div.className = "mensagem-erro";
  div.textContent = mensagem;
  areaErro.appendChild(div);

  setTimeout(function () {
    div.remove();
  }, 3000);
}

function limparErro() {
  areaErro.innerHTML = "";
}

function limparFormulario() {
  inputDescricao.value = "";
  selectPrioridade.value = "";
  inputDescricao.focus();
}