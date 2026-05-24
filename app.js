// =====================================
// PCBA INVESTIGADOR PRO
// APP.JS OFICIAL
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
// MOSTRAR SEÇÕES
// =====================================

function mostrar(secao){

[
home,
configuracao,
simulado,
resultado,
redacaoArea,
tafArea,
historicoArea
].forEach(sec=>{

if(sec){
sec.classList.add("hidden");
}

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

const j =
Math.floor(
Math.random()*(i+1)
);

[array[i],array[j]] =
[array[j],array[i]];

}

return array;

}
// =====================================
// GERAR SIMULADO
// =====================================

function gerarSimulado(){

let base = [...bancoQuestoes];

const materia =
document.getElementById(
"filtroMateria"
).value;

if(materia !== "todas"){

base = base.filter(
q => q.materia === materia
);

}

if(base.length === 0){

alert(
"Não existem questões cadastradas para esta matéria."
);

return;

}

embaralhar(base);

questoesAtuais = base.slice(
0,
Math.min(
QUESTOES_POR_PROVA,
base.length
)
);

renderizarQuestoes();

atualizarRespondidas();

iniciarCronometro();

mostrar(simulado);

}
// =====================================
// HISTÓRICO
// =====================================

function carregarHistorico(){

const container =
document.getElementById(
"historicoResultados"
);

if(!container) return;

const historico =
JSON.parse(
localStorage.getItem(
"historicoPCBA"
) || "[]"
);

container.innerHTML = "";

if(historico.length === 0){

container.innerHTML = `
<div class="historico-item">
Nenhum resultado salvo.
</div>
`;

return;

}

historico.forEach(item=>{

container.innerHTML += `
<div class="historico-item">
<strong>${item.data}</strong>
<br><br>
Acertos: ${item.acertos}
<br>
Erros: ${item.erros}
<br>
Aproveitamento: ${item.percentual}%
</div>
`;

});

}
// =====================================
// RENDERIZAR QUESTÕES
// =====================================

function renderizarQuestoes(){

questoesDiv.innerHTML = "";

questoesAtuais.forEach((q,i)=>{

const div =
document.createElement("div");

div.className = "questao";

let html = `

<div class="materia">
${q.materia}
</div>

<h3>
${i + 1}. ${q.pergunta}
</h3>

`;

q.alternativas.forEach((alt,j)=>{

html += `

<label class="alternativa">

<input
type="radio"
name="q${i}"
value="${j}"
onchange="atualizarRespondidas()">

${alt}

</label>

`;

});

div.innerHTML = html;

questoesDiv.appendChild(div);

});

totalQuestoes.textContent =
questoesAtuais.length;

}

// =====================================
// RESPONDIDAS + PROGRESSO
// =====================================

function atualizarRespondidas(){

const marcadas =
document.querySelectorAll(
"input[type='radio']:checked"
).length;

respondidas.textContent =
marcadas;

const percentual =

questoesAtuais.length > 0
? (marcadas / questoesAtuais.length) * 100
: 0;

const barra =
document.getElementById(
"progresso"
);

if(barra){

barra.style.width =
percentual + "%";

}

}

// =====================================
// CRONÔMETRO
// =====================================

function iniciarCronometro(){

clearInterval(cronometro);

tempoRestante = 10800;

cronometro = setInterval(()=>{

tempoRestante--;

const h =
Math.floor(
tempoRestante / 3600
);

const m =
Math.floor(
(tempoRestante % 3600) / 60
);

const s =
tempoRestante % 60;

timer.textContent =

String(h).padStart(2,"0")
+ ":"
+
String(m).padStart(2,"0")
+ ":"
+
String(s).padStart(2,"0");

if(tempoRestante <= 0){

clearInterval(
cronometro
);

corrigirProva();

}

},1000);

}

// =====================================
// CORRIGIR PROVA
// =====================================

function corrigirProva(){

clearInterval(
cronometro
);

let acertos = 0;
let erros = 0;

questoesAtuais.forEach((q,i)=>{

const resposta =
document.querySelector(
`input[name="q${i}"]:checked`
);

if(
resposta &&
Number(resposta.value) === q.correta
){

acertos++;

}else{

erros++;

}

});

const percentualFinal =

questoesAtuais.length > 0

? (
(acertos /
questoesAtuais.length)
* 100
).toFixed(1)

: 0;

document.getElementById(
"acertos"
).textContent = acertos;

document.getElementById(
"erros"
).textContent = erros;

document.getElementById(
"percentual"
).textContent =
percentualFinal + "%";

// HISTÓRICO

const historico =
JSON.parse(
localStorage.getItem(
"historicoPCBA"
) || "[]"
);

historico.unshift({

data:
new Date()
.toLocaleString(),

acertos,

erros,

percentual:
percentualFinal

});

if(historico.length > 50){

historico.length = 50;

}

localStorage.setItem(

"historicoPCBA",

JSON.stringify(
historico
)

);

// GABARITO

const gabarito =
document.getElementById(
"gabaritoComentarios"
);

if(gabarito){

gabarito.innerHTML = "";

questoesAtuais.forEach((q,i)=>{

gabarito.innerHTML += `

<div class="gabarito-item">

<strong>
Questão ${i + 1}
</strong>

<br><br>

<b>Matéria:</b>
${q.materia}

<br><br>

<b>Resposta correta:</b>
${q.alternativas[q.correta]}

<br><br>

<b>Comentário:</b>
${q.comentario || "Sem comentário."}

</div>

`;

});

}

carregarHistorico();

mostrar(resultado);

}

// =====================================
// EVENTOS PRINCIPAIS
// =====================================

document.getElementById(
"btnIniciar"
)?.addEventListener(
"click",
()=>{

QUESTOES_POR_PROVA =
parseInt(
document.getElementById(
"quantidadeQuestoes"
).value
) || 100;

gerarSimulado();

}
);

document.getElementById(
"btnNovoSimulado"
)?.addEventListener(
"click",
()=>{

mostrar(configuracao);

}
);

document.getElementById(
"btnModoConcurso"
)?.addEventListener(
"click",
()=>{

mostrar(configuracao);

}
);

document.getElementById(
"btnRedacao"
)?.addEventListener(
"click",
()=>{

mostrar(redacaoArea);

}
);

document.getElementById(
"btnTAF"
)?.addEventListener(
"click",
()=>{

mostrar(tafArea);

}
);

document.getElementById(
"btnHistorico"
)?.addEventListener(
"click",
()=>{

carregarHistorico();

mostrar(historicoArea);

}
);

// =====================================
// FINALIZAR PROVA
// =====================================

document.getElementById(
"btnFinalizar"
)?.addEventListener(
"click",
()=>{

corrigirProva();

}
);

// =====================================
// BOTÕES RESULTADO
// =====================================

document.getElementById(
"btnVoltarInicio"
)?.addEventListener(
"click",
()=>{

mostrar(home);

}
);

document.getElementById(
"btnRefazer"
)?.addEventListener(
"click",
()=>{

gerarSimulado();

}
);

// =====================================
// BOTÕES VOLTAR
// =====================================

document.getElementById(
"voltarHomeRedacao"
)?.addEventListener(
"click",
()=>{

mostrar(home);

}
);

document.getElementById(
"voltarHomeTAF"
)?.addEventListener(
"click",
()=>{

mostrar(home);

}
);

document.getElementById(
"voltarHomeHistorico"
)?.addEventListener(
"click",
()=>{

mostrar(home);

}
);

// =====================================
// LIMPAR HISTÓRICO
// =====================================

document.getElementById(
"limparHistorico"
)?.addEventListener(
"click",
()=>{

if(
confirm(
"Deseja apagar todo o histórico?"
)
){

localStorage.removeItem(
"historicoPCBA"
);

carregarHistorico();

alert(
"Histórico apagado."
);

}

}
);

// =====================================
// SALVAR SIMULADO
// =====================================

document.getElementById(
"btnSalvarSimulado"
)?.addEventListener(
"click",
()=>{

const dados = {

questoes:
questoesAtuais,

data:
new Date()
.toLocaleString()

};

localStorage.setItem(

"simuladoSalvo",

JSON.stringify(
dados
)

);

alert(
"Simulado salvo com sucesso."
);

}
);

// =====================================
// CARREGAR SIMULADO SALVO 
// =====================================

function carregarSimuladoSalvo(){

const salvo =
localStorage.getItem(
"simuladoSalvo"
);

if(!salvo){
return;
}

try{

const dados =
JSON.parse(salvo);

if(
dados &&
dados.questoes &&
dados.questoes.length > 0
){

questoesAtuais =
dados.questoes;

renderizarQuestoes();

atualizarRespondidas();

mostrar(simulado);

}

}catch(erro){

console.error(
"Erro ao carregar simulado:",
erro
);

}

}

// =====================================
// TEMA ESCURO
// =====================================

document.getElementById(
"btnTema"
)?.addEventListener(
"click",
()=>{

document.body
.classList.toggle(
"dark"
);

localStorage.setItem(

"tema",

document.body
.classList.contains(
"dark"
)
? "dark"
: "light"

);

}
);

if(
localStorage.getItem(
"tema"
) === "dark"
){

document.body
.classList.add(
"dark"
);

}

// =====================================
// REDAÇÃO
// =====================================

const textareaRedacao =
document.getElementById(
"redacaoTexto"
);

const contadorPalavras =
document.getElementById(
"contadorPalavras"
);

if(textareaRedacao){

const redacaoSalva =
localStorage.getItem(
"redacaoPCBA"
);

if(redacaoSalva){

textareaRedacao.value =
redacaoSalva;

}

function atualizarContador(){

const texto =
textareaRedacao.value.trim();

const palavras =

texto === ""
? 0
: texto.split(/\s+/).length;

if(contadorPalavras){

contadorPalavras.textContent =
palavras;

}

}

atualizarContador();

textareaRedacao.addEventListener(
"input",
atualizarContador
);

}

document.getElementById(
"salvarRedacao"
)?.addEventListener(
"click",
()=>{

localStorage.setItem(

"redacaoPCBA",

document.getElementById(
"redacaoTexto"
).value

);

alert(
"Redação salva com sucesso."
);

}
);

// =====================================
// TAF
// =====================================

const tafSalvo =
localStorage.getItem(
"tafPCBA"
);

if(tafSalvo){

try{

const dados =
JSON.parse(tafSalvo);

document.getElementById(
"corrida"
).value =
dados.corrida || "";

document.getElementById(
"abdominal"
).value =
dados.abdominal || "";

document.getElementById(
"barra"
).value =
dados.barra || "";

}catch(e){

console.error(e);

}

}

document.getElementById(
"salvarTAF"
)?.addEventListener(
"click",
()=>{

const dados = {

corrida:
document.getElementById(
"corrida"
).value,

abdominal:
document.getElementById(
"abdominal"
).value,

barra:
document.getElementById(
"barra"
).value

};

localStorage.setItem(

"tafPCBA",

JSON.stringify(
dados
)

);

alert(
"Evolução TAF salva."
);

}
);

// =====================================
// INICIALIZAÇÃO
// =====================================
carregarHistorico();

const salvo = localStorage.getItem("simuladoSalvo");

if (salvo) {
  const continuar = confirm(
    "Você tem um simulado salvo. Deseja continuar de onde parou?"
  );

  if (continuar) {
    carregarSimuladoSalvo();
  } else {
    localStorage.removeItem("simuladoSalvo");
    mostrar(home);
  }
} else {
  mostrar(home);
}

console.log("PCBA Investigador PRO carregado com sucesso.");
