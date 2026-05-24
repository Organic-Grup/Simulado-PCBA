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
].forEach(s=>{

if(s){
s.classList.add("hidden");
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

const j=Math.floor(
Math.random()*(i+1)
);

[array[i],array[j]]=
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

// NÃO EXISTEM QUESTÕES

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

? (marcadas /
questoesAtuais.length) * 100

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

let h =
Math.floor(
tempoRestante / 3600
);

let m =
Math.floor(
(tempoRestante % 3600) / 60
);

let s =
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

function corrigirProva(){

clearInterval(cronometro);

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
(acertos / questoesAtuais.length) * 100
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

// SALVAR HISTÓRICO

const historico = JSON.parse(
localStorage.getItem(
"historicoPCBA"
) || "[]"
);

historico.unshift({

data:
new Date().toLocaleString(),

acertos,

erros,

percentual:
percentualFinal

});

// Limita em 50 resultados

if(historico.length > 50){

historico.length = 50;

}

localStorage.setItem(

"historicoPCBA",

JSON.stringify(
historico
)

);

// GABARITO COMENTADO

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
Questão ${i+1}
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
// BOTÃO VOLTAR AO MENU
// =====================================

const btnVoltarInicio =
document.getElementById(
"btnVoltarInicio"
);

if(btnVoltarInicio){

btnVoltarInicio.addEventListener(
"click",
()=>{

mostrar(home);

}
);

}
// =====================================
// HISTÓRICO
// =====================================

function carregarHistorico(){

const container =
document.getElementById(
"historicoResultados"
);

if(!container){
return;
}

const historico = JSON.parse(
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

<strong>
${item.data}
</strong>

<br><br>

Acertos:
${item.acertos}

<br>

Erros:
${item.erros}

<br>

Aproveitamento:
${item.percentual}%

</div>

`;

});

}
// =====================================
// BOTÃO REFAZER SIMULADO
// =====================================

const btnRefazer =
document.getElementById(
"btnRefazer"
);

if(btnRefazer){

btnRefazer.addEventListener(
"click",
()=>{

gerarSimulado();

}
);

}

// =====================================
// LIMPAR HISTÓRICO
// =====================================

const btnLimparHistorico =
document.getElementById(
"limparHistorico"
);

if(btnLimparHistorico){

btnLimparHistorico.addEventListener(
"click",
()=>{

const confirmar = confirm(
"Deseja apagar todo o histórico?"
);

if(confirmar){

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

}

// =====================================
// SALVAR SIMULADO
// =====================================

const btnSalvarSimulado =
document.getElementById(
"btnSalvarSimulado"
);

if(btnSalvarSimulado){

btnSalvarSimulado.addEventListener(
"click",
()=>{

const dados = {

questoes: questoesAtuais,

data:
new Date().toLocaleString()

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

}

// =====================================
// CARREGAR SIMULADO SALVO (OPCIONAL)
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
// INICIALIZAÇÃO FINAL
// =====================================

carregarHistorico();

mostrar(home);

console.log(
"PCBA Investigador PRO iniciado com sucesso."
);



