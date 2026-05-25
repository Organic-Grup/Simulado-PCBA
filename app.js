// =====================================
// PCBA INVESTIGADOR PRO
// APP.JS OFICIAL (VERSÃO CORRIGIDA)
// =====================================

let QUESTOES_POR_PROVA = 100;
let tempoRestante = 10800;
let cronometro = null;
let questoesAtuais = [];

// =====================================
// ELEMENTOS
// =====================================

const home = document.getElementById("home");
const configuracao = document.getElementById("configuracao");
const simulado = document.getElementById("simulado");
const resultado = document.getElementById("resultado");
const redacaoArea = document.getElementById("redacaoArea");
const tafArea = document.getElementById("tafArea");
const historicoArea = document.getElementById("historicoArea");

const questoesDiv = document.getElementById("questoes");

const timer = document.getElementById("timer");
const respondidas = document.getElementById("respondidas");
const totalQuestoes = document.getElementById("totalQuestoes");

// =====================================
// MOSTRAR SEÇÕES (CORRIGIDO - ÚNICO)
// =====================================

function mostrar(secao){
  const secoes = [
    home,
    configuracao,
    simulado,
    resultado,
    redacaoArea,
    tafArea,
    historicoArea
  ];

  secoes.forEach(sec=>{
    if(sec) sec.classList.add("hidden");
  });

  if(secao){
    secao.classList.remove("hidden");
  }
}

// =====================================
// EMBARALHAR
// =====================================

function embaralhar(array){
  for(let i=array.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [array[i],array[j]] = [array[j],array[i]];
  }
  return array;
}

// =====================================
// GERAR SIMULADO (PROTEGIDO)
// =====================================

function gerarSimulado(){

  if(typeof bancoQuestoes === "undefined"){
    alert("Banco de questões não encontrado!");
    return;
  }

  let base = [...bancoQuestoes];

  const materia = document.getElementById("filtroMateria").value;

  if(materia !== "todas"){
    base = base.filter(q => q.materia === materia);
  }

  if(base.length === 0){
    alert("Não existem questões cadastradas para esta matéria.");
    return;
  }

  embaralhar(base);

  questoesAtuais = base.slice(0, Math.min(QUESTOES_POR_PROVA, base.length));

  renderizarQuestoes();
  atualizarRespondidas();
  iniciarCronometro();
  mostrar(simulado);
}

// =====================================
// HISTÓRICO
// =====================================

function carregarHistorico(){

  const container = document.getElementById("historicoResultados");
  if(!container) return;

  const historico = JSON.parse(localStorage.getItem("historicoPCBA") || "[]");

  if(historico.length === 0){
    container.innerHTML = `<div class="historico-item">Nenhum resultado salvo.</div>`;
    return;
  }

  let html = "";

  historico.forEach(item=>{
    html += `
      <div class="historico-item">
        <strong>${item.data}</strong><br><br>
        Acertos: ${item.acertos}<br>
        Erros: ${item.erros}<br>
        Aproveitamento: ${item.percentual}%
      </div>
    `;
  });

  container.innerHTML = html;
}
// =====================================
// RENDERIZAR QUESTÕES
// =====================================

function renderizarQuestoes(){

  if(!questoesDiv) return;

  questoesDiv.innerHTML = "";

  questoesAtuais.forEach((q,i)=>{

    const div = document.createElement("div");
    div.className = "questao";

    let html = `
      <div class="materia">${q.materia}</div>
      <h3>${i + 1}. ${q.pergunta}</h3>
    `;

    q.alternativas.forEach((alt,j)=>{

      html += `
        <label class="alternativa">
          <input
            type="radio"
            name="q${i}"
            value="${j}"
            onchange="atualizarRespondidas()"
          >
          ${alt}
        </label>
      `;
    });

    div.innerHTML = html;
    questoesDiv.appendChild(div);
  });

  if(totalQuestoes){
    totalQuestoes.textContent = questoesAtuais.length;
  }
}

// =====================================
// PROGRESSO
// =====================================

function atualizarRespondidas(){

  const marcadas = document.querySelectorAll("input[type='radio']:checked").length;

  if(respondidas){
    respondidas.textContent = marcadas;
  }

  const percentual =
    questoesAtuais.length > 0
      ? (marcadas / questoesAtuais.length) * 100
      : 0;

  const barra = document.getElementById("progresso");

  if(barra){
    barra.style.width = percentual + "%";
  }
}

// =====================================
// CRONÔMETRO (CORRIGIDO)
// =====================================

function iniciarCronometro(){

  clearInterval(cronometro);

  cronometro = setInterval(()=>{

    tempoRestante--;

    const h = Math.floor(tempoRestante / 3600);
    const m = Math.floor((tempoRestante % 3600) / 60);
    const s = tempoRestante % 60;

    if(timer){
      timer.textContent =
        String(h).padStart(2,"0") + ":" +
        String(m).padStart(2,"0") + ":" +
        String(s).padStart(2,"0");
    }

    localStorage.setItem("tempoRestantePCBA", tempoRestante);

    if(tempoRestante <= 0){
      clearInterval(cronometro);
      corrigirProva();
    }

  },1000);
}

// =====================================
// CORRIGIR PROVA (PRINCIPAL)
// =====================================

function corrigirProva(){

  clearInterval(cronometro);

  let acertos = 0;
  let erros = 0;

  questoesAtuais.forEach((q,i)=>{

    const resposta = document.querySelector(`input[name="q${i}"]:checked`);

    if(resposta && Number(resposta.value) === q.correta){
      acertos++;
    } else {
      erros++;
    }
  });

  const percentualFinal =
    questoesAtuais.length > 0
      ? ((acertos / questoesAtuais.length) * 100).toFixed(1)
      : 0;

  document.getElementById("acertos").textContent = acertos;
  document.getElementById("erros").textContent = erros;
  document.getElementById("percentual").textContent = percentualFinal + "%";

  // =====================================
  // SALVAR HISTÓRICO
  // =====================================

  const historico = JSON.parse(localStorage.getItem("historicoPCBA") || "[]");

  historico.unshift({
    data: new Date().toLocaleString(),
    acertos,
    erros,
    percentual: percentualFinal
  });

  if(historico.length > 50){
    historico.length = 50;
  }

  localStorage.setItem("historicoPCBA", JSON.stringify(historico));

  // =====================================
  // MOSTRAR GABARITO
  // =====================================

  const gabarito = document.getElementById("gabaritoComentarios");

  if(gabarito){

    let html = "";

    questoesAtuais.forEach((q,i)=>{

      html += `
        <div class="gabarito-item">
          <strong>Questão ${i + 1}</strong><br><br>
          <b>Matéria:</b> ${q.materia}<br><br>
          <b>Resposta correta:</b> ${q.alternativas[q.correta]}<br><br>
          <b>Comentário:</b> ${q.comentario || "Sem comentário."}
        </div>
      `;
    });

    gabarito.innerHTML = html;
  }

  carregarHistorico();
  mostrar(resultado);
}

// =====================================
// SALVAR SIMULADO
// =====================================

function salvarSimulado(){

  localStorage.setItem("simuladoSalvo", JSON.stringify({
    questoesAtuais,
    tempoRestante
  }));

}

// =====================================
// INICIALIZAÇÃO SEGURA (CORRIGIDA)
// =====================================

function iniciarApp() {
  carregarHistorico();

  const salvo = localStorage.getItem("simuladoSalvo");

  if (!salvo) {
    mostrar(home);
    console.log("PCBA Investigador PRO carregado com sucesso.");
    return;
  }

  const continuar = confirm(
    "Você tem um simulado salvo. Deseja continuar de onde parou?"
  );

  if (continuar) {
    carregarSimuladoSalvo();
  } else {
    localStorage.removeItem("simuladoSalvo");
    mostrar(home);
  }

  console.log("PCBA Investigador PRO carregado com sucesso.");
}

// =====================================
// MOSTRAR SEÇÕES (VERSÃO FINAL LIMPA)
// =====================================
function mostrar(secao) {
  const secoes = [
    home,
    configuracao,
    simulado,
    resultado,
    redacaoArea,
    tafArea,
    historicoArea
  ];

  secoes.forEach(sec => {
    if (sec) sec.classList.add("hidden");
  });

  if (secao) {
    secao.classList.remove("hidden");
  }
}
function carregarSimuladoSalvo() {

  const salvo = localStorage.getItem("simuladoSalvo");

  if (!salvo) return;

  try {

    const dados = JSON.parse(salvo);

    questoesAtuais = dados.questoesAtuais || [];
    tempoRestante = dados.tempoRestante || 10800;

    renderizarQuestoes();
    atualizarRespondidas();

    clearInterval(cronometro);
    iniciarCronometro();

    mostrar(simulado);

  } catch (e) {
    console.error("Erro ao carregar simulado:", e);
  }
}
