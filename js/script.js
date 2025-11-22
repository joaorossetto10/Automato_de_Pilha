// Gramática, FIRST, FOLLOW e tabela LL(1) usados no analisador

const NAO_TERMINAIS = ["S", "A", "B", "C", "D"];
const TERMINAIS = ["a", "b", "c", "d"];

const GRAMATICA = {
  S: [
    ["a", "A", "b"],
    ["b", "B"],
    ["c", "C", "d"]
  ],
  A: [["a", "C"], ["ε"]],
  B: [
    ["a", "D", "c"],
    ["b", "A"]
  ],
  C: [
    ["a", "B"],
    ["d", "A"]
  ],
  D: [["c", "S"]]
};

const FIRST = {
  S: ["a", "b", "c"],
  A: ["a", "ε"],
  B: ["a", "b"],
  C: ["a", "d"],
  D: ["c"]
};

const FOLLOW = {
  S: ["$", "c"],
  A: ["$", "b", "c", "d"],
  B: ["$", "b", "c", "d"],
  C: ["$", "b", "c", "d"],
  D: ["c"]
};

const TABELA_LL1 = {
  S: {
    a: ["a", "A", "b"],
    b: ["b", "B"],
    c: ["c", "C", "d"]
  },
  A: {
    a: ["a", "C"],
    b: ["ε"],
    c: ["ε"],
    d: ["ε"],
    $: ["ε"]
  },
  B: {
    a: ["a", "D", "c"],
    b: ["b", "A"]
  },
  C: {
    a: ["a", "B"],
    d: ["d", "A"]
  },
  D: {
    c: ["c", "S"]
  }
};

// Estado da aplicação
let estadoAtual = null;      // execução do parser passo a passo
let derivacaoAtual = null;   // sentença gerada clicando na tabela LL(1)
let historicoDerivacao = []; // para o botão "Desfazer"

// Inicialização da página
document.addEventListener("DOMContentLoaded", () => {
  preencherGramatica();
  preencherFirstFollow();
  preencherTabelaLL1();

  document.getElementById("btnLimpar").addEventListener("click", limparTudo);
  document.getElementById("btnPasso").addEventListener("click", clicarProximoPasso);
  document.getElementById("btnExecutar").addEventListener("click", executarTudo);

  document
    .getElementById("tabelaLL1")
    .addEventListener("click", cliqueTabelaLL1);

  document
    .getElementById("btnDesfazer")
    .addEventListener("click", desfazerPassoDerivacao);

  atualizarStatusSentenca();
});

// --------- exibição da gramática / first / follow / tabela ---------

function preencherGramatica() {
  const div = document.getElementById("listaGramatica");
  div.innerHTML = "";

  NAO_TERMINAIS.forEach((nt) => {
    const prod = GRAMATICA[nt].map((p) => p.join(" ")).join(" | ");
    const line = document.createElement("span");
    line.textContent = `${nt} → ${prod}`;
    div.appendChild(line);
  });
}

function preencherFirstFollow() {
  const f = document.getElementById("listaFirst");
  const g = document.getElementById("listaFollow");

  f.innerHTML = "";
  g.innerHTML = "";

  NAO_TERMINAIS.forEach((nt) => {
    f.innerHTML += `<span>FIRST(${nt}) = { ${FIRST[nt].join(", ")} }</span>`;
    g.innerHTML += `<span>FOLLOW(${nt}) = { ${FOLLOW[nt].join(", ")} }</span>`;
  });
}

function preencherTabelaLL1() {
  const tbody = document.getElementById("corpoLL1");
  tbody.innerHTML = "";

  const colunas = TERMINAIS.concat(["$"]);

  NAO_TERMINAIS.forEach((nt) => {
    const tr = document.createElement("tr");

    const tdNT = document.createElement("td");
    tdNT.textContent = nt;
    tr.appendChild(tdNT);

    colunas.forEach((t) => {
      const td = document.createElement("td");
      const prod = obterProducao(nt, t);

      if (prod) {
        td.textContent = `${nt} → ${prod.join(" ")}`;
        td.classList.add("celula-prod");
        td.dataset.nt = nt;
        td.dataset.producao = prod.join(" ");
      } else {
        td.textContent = "—";
      }

      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });
}

// --------- geração de sentença clicando na tabela LL(1) ---------

function cliqueTabelaLL1(event) {
  const cell = event.target.closest("td");
  if (!cell || !cell.classList.contains("celula-prod")) return;

  const nt = cell.dataset.nt;
  const prod = cell.dataset.producao.split(" ");

  if (derivacaoAtual) {
    historicoDerivacao.push([...derivacaoAtual]);
  } else {
    historicoDerivacao.push(null);
  }

  if (!derivacaoAtual) derivacaoAtual = ["S"];

  let i = derivacaoAtual.indexOf(nt);
  if (i === -1) {
    derivacaoAtual = [nt];
    i = 0;
  }

  derivacaoAtual.splice(i, 1);
  if (!(prod.length === 1 && prod[0] === "ε")) {
    for (let j = prod.length - 1; j >= 0; j--) {
      derivacaoAtual.splice(i, 0, prod[j]);
    }
  }

  atualizarSentencaGerada();
  atualizarCampoEntradaComDerivacao();
  atualizarStatusSentenca();
}

function desfazerPassoDerivacao() {
  if (historicoDerivacao.length === 0) {
    derivacaoAtual = null;
  } else {
    derivacaoAtual = historicoDerivacao.pop();
  }
  atualizarSentencaGerada();
  atualizarCampoEntradaComDerivacao();
  atualizarStatusSentenca();
}

function atualizarSentencaGerada() {
  const span = document.getElementById("sentencaGerada");
  if (!derivacaoAtual || derivacaoAtual.length === 0) {
    span.textContent = "—";
  } else {
    span.textContent = derivacaoAtual.join(" ");
  }
}

function atualizarCampoEntradaComDerivacao() {
  const input = document.getElementById("entradaUsuario");
  if (!derivacaoAtual) {
    input.value = "";
  } else {
    input.value = derivacaoAtual.join(" ");
  }
}

// Status: parcial, válida ou inválida para a gramática
function atualizarStatusSentenca() {
  const span = document.getElementById("statusSentenca");
  span.className = "";

  if (!derivacaoAtual || derivacaoAtual.length === 0) {
    span.textContent = "Nenhuma derivação realizada.";
    span.classList.add("status-neutro");
    return;
  }

  const temNT = derivacaoAtual.some((s) => NAO_TERMINAIS.includes(s));

  if (temNT) {
    span.textContent = "Sentença parcial (ainda contém não-terminais).";
    span.classList.add("status-parcial");
    return;
  }

  const terminais = derivacaoAtual.slice();
  const valida = aceitaSentenca(terminais);

  if (valida) {
    span.textContent = "Sentença final válida para a gramática.";
    span.classList.add("status-ok");
  } else {
    span.textContent = "Sentença final inválida para a gramática.";
    span.classList.add("status-erro");
  }
}

// Validação "silenciosa", sem preencher a tabela de passos
function aceitaSentenca(simbolos) {
  let pilha = ["$", "S"];
  let entrada = simbolos.slice();
  entrada.push("$");

  let limite = 500;
  while (limite-- > 0) {
    const topo = pilha[pilha.length - 1];
    const look = entrada[0];

    if (topo === "$" && look === "$") return true;

    if (TERMINAIS.includes(topo) || topo === "$") {
      if (topo === look) {
        pilha.pop();
        entrada.shift();
      } else {
        return false;
      }
    } else {
      const prod = obterProducao(topo, look);
      if (!prod) return false;

      pilha.pop();
      if (!(prod.length === 1 && prod[0] === "ε")) {
        for (let i = prod.length - 1; i >= 0; i--) {
          pilha.push(prod[i]);
        }
      }
    }
  }
  return false;
}

// --------- parser LL(1) com traço da pilha ---------

function prepararEstadoInicial() {
  const txt = document.getElementById("entradaUsuario").value.trim();
  if (!txt) {
    mostrarResultado("Digite alguma sentença.", false, true);
    return null;
  }

  const entrada = txt.replace(/\s+/g, "").split("");
  for (const c of entrada) {
    if (!TERMINAIS.includes(c)) {
      mostrarResultado(`Símbolo inválido: ${c}`, false, true);
      return null;
    }
  }

  entrada.push("$");

  estadoAtual = {
    pilha: ["$", "S"],
    entrada,
    passos: 0,
    terminou: false
  };

  document.getElementById("corpoProcesso").innerHTML = "";
  mostrarResultado("Análise iniciada...", false, true);
  return estadoAtual;
}

function clicarProximoPasso() {
  if (!estadoAtual || estadoAtual.terminou) {
    if (!prepararEstadoInicial()) return;
  }
  executarPasso();
}

function executarTudo() {
  if (!estadoAtual || estadoAtual.terminou) {
    if (!prepararEstadoInicial()) return;
  }
  let limit = 200;
  while (!estadoAtual.terminou && limit-- > 0) {
    executarPasso();
  }
}

function executarPasso() {
  const st = estadoAtual;
  if (!st || st.terminou) return;

  const pilha = st.pilha;
  const entrada = st.entrada;

  const topo = pilha[pilha.length - 1];
  const look = entrada[0];

  const pilhaAntes = pilha.slice();
  const entradaAntes = entrada.slice();
  let acao = "";

  if (topo === "$" && look === "$") {
    st.passos++;
    acao = `Aceito em ${st.passos} passos.`;
    registrarPasso(pilhaAntes, entradaAntes, acao);
    st.terminou = true;
    mostrarResultado(acao, true);
    return;
  }

  if (TERMINAIS.includes(topo) || topo === "$") {
    if (topo === look) {
      pilha.pop();
      entrada.shift();
      st.passos++;
      acao = `Ler ${topo}`;
      registrarPasso(pilhaAntes, entradaAntes, acao);
      return;
    } else {
      st.passos++;
      acao = `Erro em ${st.passos} passos.`;
      registrarPasso(pilhaAntes, entradaAntes, acao);
      st.terminou = true;
      mostrarResultado(acao, false);
      return;
    }
  }

  const prod = obterProducao(topo, look);
  if (!prod) {
    st.passos++;
    acao = `Erro em ${st.passos} passos.`;
    registrarPasso(pilhaAntes, entradaAntes, acao);
    st.terminou = true;
    mostrarResultado(acao, false);
    return;
  }

  pilha.pop();
  if (!(prod.length === 1 && prod[0] === "ε")) {
    for (let i = prod.length - 1; i >= 0; i--) {
      pilha.push(prod[i]);
    }
  }

  st.passos++;
  acao = `${topo} → ${prod.join(" ")}`;
  registrarPasso(pilhaAntes, entradaAntes, acao);
}

function obterProducao(nt, t) {
  return TABELA_LL1[nt]?.[t] || null;
}

function registrarPasso(pilhaAntes, entradaAntes, acao) {
  const tbody = document.getElementById("corpoProcesso");
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${pilhaAntes.join(" ")}</td>
    <td>${entradaAntes.join(" ")}</td>
    <td>${acao}</td>
    <td>${estadoAtual.passos}</td>
  `;

  tbody.appendChild(tr);
}

function mostrarResultado(msg, sucesso, aviso) {
  const el = document.getElementById("saidaResultado");
  el.textContent = msg;

  el.className = "";
  if (aviso) el.classList.add("aviso");
  else if (sucesso) el.classList.add("aceito");
  else el.classList.add("rejeitado");
}

// Limpa tudo e volta para o estado inicial
function limparTudo() {
  estadoAtual = null;
  derivacaoAtual = null;
  historicoDerivacao = [];

  atualizarSentencaGerada();
  atualizarCampoEntradaComDerivacao();
  atualizarStatusSentenca();

  document.getElementById("corpoProcesso").innerHTML = "";
  mostrarResultado("Nenhuma análise realizada.", false, true);
}
