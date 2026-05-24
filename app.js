let QUESTOES_POR_PROVA = 100;
let tempoRestante = 10800;
let cronometro = null;
let questoesAtuais = [];

// ELEMENTOS
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

// MOSTRAR SEÇÕES (CORRIGIDO SEM MEXER NA ESTRUTURA)
function mostrar(secao){
[
home,
configuracao,
simulado,
resultado,
redacaoArea,
tafArea,
historicoArea
].forEach(s => s.classList.add("hidden"));

secao.classList.remove("hidden");
}

// EMBARALHAR
function embaralhar(array){
for(let i=array.length-1;i>0;i--){
const j=Math.floor(Math.random()*(i+1));
[array[i],array[j]]=[array[j],array[i]];
}
return array;
}

// GERAR SIMULADO
function gerarSimulado(){
let base = [...bancoQuestoes];

embaralhar(base);

questoesAtuais = base.slice(0, QUESTOES_POR_PROVA);

renderizarQuestoes();
atualizarRespondidas();
iniciarCronometro();

mostrar(simulado);
}

// RENDER
function renderizarQuestoes(){
questoesDiv.innerHTML = "";

questoesAtuais.forEach((q,i)=>{
const div = document.createElement("div");
div.className = "questao";

let html = `<strong>${i+1}. ${q.pergunta}</strong><br><br>`;

q.alternativas.forEach((alt,j)=>{
html += `
<label class="alternativa">
<input type="radio" name="q${i}" value="${j}" onchange="atualizarRespondidas()">
${alt}
</label>`;
});

div.innerHTML = html;
questoesDiv.appendChild(div);
});

totalQuestoes.textContent = questoesAtuais.length;
}

// RESPONDIDAS
function atualizarRespondidas(){
const marcadas = document.querySelectorAll("input[type='radio']:checked").length;
respondidas.textContent = marcadas;
}

// CRONÔMETRO
function iniciarCronometro(){
clearInterval(cronometro);
tempoRestante = 10800;

cronometro = setInterval(()=>{
tempoRestante--;

let h=Math.floor(tempoRestante/3600);
let m=Math.floor((tempoRestante%3600)/60);
let s=tempoRestante%60;

timer.textContent =
String(h).padStart(2,"0")+":"+
String(m).padStart(2,"0")+":"+
String(s).padStart(2,"0");

if(tempoRestante<=0){
clearInterval(cronometro);
corrigirProva();
}

},1000);
}

// CORREÇÃO
function corrigirProva(){
clearInterval(cronometro);

let acertos=0;
let erros=0;

questoesAtuais.forEach((q,i)=>{
const resposta=document.querySelector(`input[name="q${i}"]:checked`);

if(resposta && Number(resposta.value)===q.correta){
acertos++;
}else{
erros++;
}
});

document.getElementById("acertos").textContent=acertos;
document.getElementById("erros").textContent=erros;
document.getElementById("percentual").textContent=
((acertos/questoesAtuais.length)*100).toFixed(1)+"%";

mostrar(resultado);
}

// EVENTOS
document.getElementById("btnIniciar").addEventListener("click", ()=>{
QUESTOES_POR_PROVA = parseInt(document.getElementById("quantidadeQuestoes").value);
gerarSimulado();
});

document.getElementById("btnNovoSimulado").addEventListener("click", ()=>{
mostrar(configuracao);
});

document.getElementById("btnRedacao").addEventListener("click", ()=>{
mostrar(redacaoArea);
});

document.getElementById("btnTAF").addEventListener("click", ()=>{
mostrar(tafArea);
});

document.getElementById("btnHistorico").addEventListener("click", ()=>{
mostrar(historicoArea);
});

document.getElementById("btnModoConcurso").addEventListener("click", ()=>{
mostrar(configuracao);
});

// FINALIZAR PROVA

document.getElementById("btnFinalizar").addEventListener("click", ()=>{
corrigirProva();
});

// VOLTAR MENU

document.getElementById("voltarHomeRedacao").addEventListener("click", ()=>{
mostrar(home);
});

document.getElementById("voltarHomeTAF").addEventListener("click", ()=>{
mostrar(home);
});

document.getElementById("voltarHomeHistorico").addEventListener("click", ()=>{
mostrar(home);
});

// TEMA CLARO/ESCURO

document.getElementById("btnTema").addEventListener("click", ()=>{
document.body.classList.toggle("dark");

localStorage.setItem(
"tema",
document.body.classList.contains("dark")
? "dark"
: "light"
);
});

if(localStorage.getItem("tema")==="dark"){
document.body.classList.add("dark");
}

// SALVAR REDAÇÃO

document.getElementById("salvarRedacao").addEventListener("click", ()=>{

const texto =
document.getElementById("redacaoTexto").value;

localStorage.setItem("redacaoPCBA", texto);

alert("Redação salva.");
});

// CARREGAR REDAÇÃO

const redacaoSalva =
localStorage.getItem("redacaoPCBA");

if(redacaoSalva){
document.getElementById("redacaoTexto").value =
redacaoSalva;
}

// CONTADOR DE PALAVRAS

document.getElementById("redacaoTexto")
.addEventListener("input", ()=>{

const texto =
document.getElementById("redacaoTexto")
.value
.trim();

const palavras =
texto.length === 0
? 0
: texto.split(/\s+/).length;

document.getElementById(
"contadorPalavras"
).textContent = palavras;

});

// SALVAR TAF

document.getElementById("salvarTAF").addEventListener("click", ()=>{

const dados = {

corrida:
document.getElementById("corrida").value,

abdominal:
document.getElementById("abdominal").value,

barra:
document.getElementById("barra").value

};

localStorage.setItem(
"tafPCBA",
JSON.stringify(dados)
);

alert("TAF salvo.");
});

// CARREGAR TAF

const tafSalvo =
localStorage.getItem("tafPCBA");

if(tafSalvo){

const dados =
JSON.parse(tafSalvo);

document.getElementById("corrida").value =
dados.corrida || "";

document.getElementById("abdominal").value =
dados.abdominal || "";

document.getElementById("barra").value =
dados.barra || "";

}

