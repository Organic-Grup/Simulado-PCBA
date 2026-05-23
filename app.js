// =====================================
// PCBA INVESTIGADOR PRO - APP JS LIMPO
// =====================================

// CONFIGURAÇÕES
let QUESTOES_POR_PROVA = 100;
let modoConcurso = false;
let tempoRestante = 10800;
let cronometro = null;
let questoesAtuais = [];

// ELEMENTOS
const home = document.getElementById("home");
const configuracao = document.getElementById("configuracao");
const simulado = document.getElementById("simulado");
const resultado = document.getElementById("resultado");
const questoesDiv = document.getElementById("questoes");

const timer = document.getElementById("timer");
const respondidas = document.getElementById("respondidas");
const totalQuestoes = document.getElementById("totalQuestoes");

// =====================================
// BANCO DE QUESTÕES (EXPANDIDO PC-BA / AOCP STYLE)
// =====================================

const bancoQuestoes = [
{
id: 1,
materia: "Português",
pergunta: "A função referencial da linguagem tem como objetivo:",
alternativas: [
"Expressar emoções",
"Transmitir informações objetivas",
"Convencer o leitor",
"Criar efeitos poéticos",
"Manter contato"
],
correta: 1,
comentario: "Função referencial = informar objetivamente."
},

{
id: 2,
materia: "Direito Penal",
pergunta: "O crime tentado ocorre quando:",
alternativas: [
"O agente pensa no crime",
"O crime se consuma",
"A execução é iniciada, mas não se consuma por circunstâncias alheias à vontade do agente",
"O agente desiste voluntariamente",
"O juiz arquiva o caso"
],
correta: 2,
comentario: "Art. 14, II do CP."
},

{
id: 3,
materia: "Processo Penal",
pergunta: "O inquérito policial tem natureza:",
alternativas: [
"Judicial",
"Administrativa",
"Legislativa",
"Constitucional",
"Privada"
],
correta: 1,
comentario: "É procedimento administrativo investigatório."
},

{
id: 4,
materia: "Constitucional",
pergunta: "O direito à vida está previsto principalmente em:",
alternativas: [
"Art. 5º da CF",
"Art. 37 da CF",
"Código Penal",
"Código Civil",
"CPP"
],
correta: 0,
comentario: "Art. 5º da Constituição Federal."
},

{
id: 5,
materia: "Administrativo",
pergunta: "O princípio da moralidade exige:",
alternativas: [
"Lucro estatal",
"Conduta ética da administração pública",
"Privatização",
"Autonomia financeira",
"Competição"
],
correta: 1,
comentario: "Art. 37 CF."
},

{
id: 6,
materia: "Informática",
pergunta: "Firewall é utilizado para:",
alternativas: [
"Editar arquivos",
"Proteger rede contra acessos não autorizados",
"Aumentar memória",
"Instalar programas",
"Criar senhas"
],
correta: 1,
comentario: "Segurança de rede."
},

{
id: 7,
materia: "Direitos Humanos",
pergunta: "A Declaração Universal dos Direitos Humanos foi criada em:",
alternativas: [
"1945",
"1948",
"1964",
"1988",
"2001"
],
correta: 1,
comentario: "ONU, 1948."
}
];

// =====================================
// FUNÇÕES BASE
// =====================================

function embaralhar(array){
for(let i=array.length-1;i>0;i--){
const j=Math.floor(Math.random()*(i+1));
[array[i],array[j]]=[array[j],array[i]];
}
return array;
}

function mostrar(secao){
[home,configuracao,simulado,resultado].forEach(s=>{
if(s) s.classList.add("hidden");
});
secao.classList.remove("hidden");
}

// =====================================
// GERAR SIMULADO
// =====================================

function gerarSimulado(){
let base = [...bancoQuestoes];

embaralhar(base);

questoesAtuais = base.slice(0, QUESTOES_POR_PROVA);

renderizarQuestoes();
atualizarRespondidas();
iniciarCronometro();

mostrar(simulado);
}

// =====================================
// RENDER QUESTÕES
// =====================================

function renderizarQuestoes(){
questoesDiv.innerHTML = "";

questoesAtuais.forEach((q,i)=>{
const div = document.createElement("div");
div.className = "questao";

let html = `
<strong>${i+1}. ${q.pergunta}</strong><br><br>
`;

q.alternativas.forEach((alt,j)=>{
html += `
<label class="alternativa">
<input type="radio" name="q${i}" value="${j}" onchange="atualizarRespondidas()">
${alt}
</label>
`;
});

div.innerHTML = html;
questoesDiv.appendChild(div);
});

totalQuestoes.textContent = questoesAtuais.length;
}

// =====================================
// CONTROLE
// =====================================

function atualizarRespondidas(){
const marcadas = document.querySelectorAll("input[type='radio']:checked").length;
respondidas.textContent = marcadas;
}

// =====================================
// CRONÔMETRO
// =====================================

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

// =====================================
// CORREÇÃO
// =====================================

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

// =====================================
// EVENTOS
// =====================================

document.getElementById("btnIniciar").addEventListener("click", ()=>{
const qtd=document.getElementById("quantidadeQuestoes").value;
QUESTOES_POR_PROVA=parseInt(qtd);
gerarSimulado();
});

document.getElementById("btnNovoSimulado").addEventListener("click", ()=>{
mostrar(configuracao);
});
