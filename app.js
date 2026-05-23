// =====================================
// PCBA INVESTIGADOR PRO
// APP.JS V2
// =====================================

// ---------- CONFIGURAÇÕES ----------

let QUESTOES_POR_PROVA = 100;

let modoConcurso = false;

let tempoRestante = 10800;

let cronometro = null;

let questoesAtuais = [];

// ---------- BANCO DE QUESTÕES ----------

const bancoQuestoes = [

{
id:1,
materia:"Português",
assunto:"Interpretação",
pergunta:"A interpretação textual busca identificar:",
alternativas:[
"Apenas erros gramaticais",
"O sentido construído pelo texto",
"Somente verbos",
"Apenas pontuação",
"Somente ortografia"
],
correta:1,
comentario:"Interpretação textual procura compreender as ideias e sentidos do texto."
},

{
id:2,
materia:"Direito Penal",
assunto:"Tentativa",
pergunta:"O crime tentado ocorre quando:",
alternativas:[
"O agente apenas pensa no crime",
"O crime se consuma normalmente",
"A execução inicia mas não se consuma por circunstâncias alheias à vontade do agente",
"A vítima registra ocorrência",
"O juiz profere sentença"
],
correta:2,
comentario:"Art. 14, II do Código Penal."
},

{
id:3,
materia:"Processo Penal",
assunto:"Inquérito",
pergunta:"O inquérito policial possui natureza:",
alternativas:[
"Judicial",
"Legislativa",
"Administrativa investigatória",
"Constitucional",
"Jurisdicional"
],
correta:2,
comentario:"O inquérito policial é procedimento administrativo."
},

{
id:4,
materia:"Constitucional",
assunto:"Artigo 5º",
pergunta:"A inviolabilidade do direito à vida é garantia:",
alternativas:[
"Constitucional",
"Administrativa",
"Tributária",
"Penal",
"Civil"
],
correta:0,
comentario:"Prevista no art. 5º da Constituição Federal."
},

{
id:5,
materia:"Administrativo",
assunto:"Princípios",
pergunta:"Qual destes é princípio da Administração Pública?",
alternativas:[
"Lucro",
"Moralidade",
"Competitividade",
"Mercado",
"Particularidade"
],
correta:1,
comentario:"Art. 37 da Constituição Federal."
}

];

// ---------- EXPANSÃO AUTOMÁTICA ----------

let ultimoID = 6;

// REMOVER QUANDO O BANCO REAL
// DE QUESTÕES FOR IMPLEMENTADO
while(bancoQuestoes.length < 200){

const base =
bancoQuestoes[
Math.floor(
Math.random()*5
)
];

bancoQuestoes.push({

id:ultimoID++,

materia:base.materia,

assunto:base.assunto,

pergunta:
base.pergunta + " (" + ultimoID + ")",

alternativas:
[...base.alternativas],

correta:
base.correta,

comentario:
base.comentario

});

}

// ---------- ELEMENTOS ----------

const home =
document.getElementById("home");

const configuracao =
document.getElementById("configuracao");

const simulado =
document.getElementById("simulado");

const resultado =
document.getElementById("resultado");

const redacaoArea =
document.getElementById("redacaoArea");

const tafArea =
document.getElementById("tafArea");

const historicoArea =
document.getElementById("historicoArea");

const questoesDiv =
document.getElementById("questoes");

const timer =
document.getElementById("timer");

const respondidas =
document.getElementById("respondidas");

const totalQuestoes =
document.getElementById("totalQuestoes"); 

// =====================================
// FUNÇÕES UTILITÁRIAS
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

function mostrar(secao){

    [
        home,
        configuracao,
        simulado,
        resultado,
        redacaoArea,
        tafArea,
        historicoArea
    ]
    .forEach(el=>{

        if(el){

            el.classList.add(
                "hidden"
            );

        }

    });

    secao.classList.remove(
        "hidden"
    );

}

// =====================================
// CRONÔMETRO
// =====================================

function iniciarCronometro(){

    clearInterval(cronometro);

    tempoRestante = 10800;

    cronometro =
    setInterval(()=>{

        tempoRestante--;

        const horas =
        Math.floor(
            tempoRestante/3600
        );

        const minutos =
        Math.floor(
            (tempoRestante%3600)/60
        );

        const segundos =
        tempoRestante%60;

        timer.textContent =
        String(horas)
        .padStart(2,"0")
        + ":" +
        String(minutos)
        .padStart(2,"0")
        + ":" +
        String(segundos)
        .padStart(2,"0");

        if(
            tempoRestante <= 0
        ){

            clearInterval(
                cronometro
            );

            corrigirProva();

        }

    },1000);

}

// =====================================
// FILTRO DE QUESTÕES
// =====================================

function gerarSimulado(){

    const materiaSelecionada =
    document
    .getElementById(
        "filtroMateria"
    ).value;

    const quantidade =
    parseInt(
        document
        .getElementById(
            "quantidadeQuestoes"
        ).value
    );

    QUESTOES_POR_PROVA =
    quantidade;

    let base = [];

    if(
        materiaSelecionada
        === "todas"
    ){

        base =
        [...bancoQuestoes];

    }else{

        base =
        bancoQuestoes.filter(
            q =>
            q.materia ===
            materiaSelecionada
        );

    }

    embaralhar(base);
if(base.length === 0){

    alert(
        "Ainda não existem questões cadastradas para esta disciplina."
    );

    return;

}
    questoesAtuais =
    base.slice(
        0,
        quantidade
    );

}

// =====================================
// RENDERIZAR QUESTÕES
// =====================================

function renderizarQuestoes(){

    questoesDiv.innerHTML =
    "";

    totalQuestoes.textContent =
    questoesAtuais.length;

    questoesAtuais.forEach(
        (
            questao,
            indice
        ) => {

        const div =
        document.createElement(
            "div"
        );

        div.className =
        "questao";

        let html = `

        <span class="materia">
            ${questao.materia}
        </span>

        <h3>
        ${indice+1}.
        ${questao.pergunta}
        </h3>

        `;

        questao.alternativas
        .forEach(
        (
            alternativa,
            posicao
        ) => {

            html += `

            <label
            class="alternativa">

            <input
            type="radio"
            name="q${indice}"
            value="${posicao}"
            onchange="
            atualizarRespondidas()
            ">

            ${alternativa}

            </label>

            `;

        });

        div.innerHTML =
        html;

        questoesDiv
        .appendChild(div);

    });

}

// =====================================
// CONTADOR
// =====================================

function atualizarRespondidas(){

    const marcadas =
    document.querySelectorAll(
    'input[type="radio"]:checked'
    ).length;

    respondidas.textContent =
    marcadas;

    const progresso =
    document.getElementById(
        "progresso"
    );

    if(progresso){

        const percentual =

        (
            marcadas /
            questoesAtuais.length
        ) * 100;

        progresso.style.width =
        percentual + "%";

    }

}
// =====================================
// CORREÇÃO DA PROVA
// =====================================

function corrigirProva(){

    clearInterval(
        cronometro
    );

    let acertos = 0;

    let erros = 0;

    const estatisticas = {};

    questoesAtuais.forEach(
    (
        questao,
        indice
    ) => {

        if(
            !estatisticas[
                questao.materia
            ]
        ){

            estatisticas[
                questao.materia
            ] = {

                total:0,

                acertos:0

            };

        }

        estatisticas[
            questao.materia
        ].total++;

        const resposta =
        document.querySelector(

        `input[name="q${indice}"]:checked`

        );

        if(resposta){

            const valor =
            Number(
                resposta.value
            );

            if(
                valor ===
                questao.correta
            ){

                acertos++;

                estatisticas[
                questao.materia
                ].acertos++;

            }else{

                erros++;

            }

        }else{

            erros++;

        }

    });

    const percentual =

    (
        acertos /
        questoesAtuais.length
    ) * 100;

    document
    .getElementById(
        "acertos"
    ).textContent =
    acertos;

    document
    .getElementById(
        "erros"
    ).textContent =
    erros;

    document
    .getElementById(
        "percentual"
    ).textContent =

    percentual.toFixed(1)
    + "%";

    gerarEstatisticas(
        estatisticas
    );

    salvarHistorico({

        data:
        new Date()
        .toLocaleString(),

        acertos,

        erros,

        percentual:
        percentual.toFixed(1)

    });

    respondidas.textContent = 0;
    
    mostrar(resultado);

}

// =====================================
// ESTATÍSTICAS
// =====================================

function gerarEstatisticas(
    estatisticas
){

    const div =
    document.getElementById(
        "estatisticas"
    );

    div.innerHTML = "";

    Object.keys(
        estatisticas
    )
    .forEach(materia => {

        const dados =
        estatisticas[
            materia
        ];

        const aproveitamento =

        (
            dados.acertos /
            dados.total
        ) * 100;

        const bloco =
        document.createElement(
            "div"
        );

        bloco.className =
        "estatistica";

        bloco.innerHTML =

        `
        <strong>
        ${materia}
        </strong>

        <p>
        Acertos:
        ${dados.acertos}
        /
        ${dados.total}
        </p>

        <p>
        Aproveitamento:
        ${aproveitamento
        .toFixed(1)}%
        </p>
        `;

        div.appendChild(
            bloco
        );

    });

}

// =====================================
// HISTÓRICO
// =====================================

function salvarHistorico(
    resultado
){

    let historico =

    JSON.parse(

        localStorage.getItem(
            "pcbaHistorico"
        )

    ) || [];

    historico.unshift(
        resultado
    );

    localStorage.setItem(

        "pcbaHistorico",

        JSON.stringify(
            historico
        )

    );

}

function carregarHistorico(){

    const area =
    document.getElementById(
        "historicoResultados"
    );

    area.innerHTML = "";

    const historico =

    JSON.parse(

        localStorage.getItem(
            "pcbaHistorico"
        )

    ) || [];

    if(
        historico.length === 0
    ){

        area.innerHTML =

        `
        <div
        class="historico-item">

        Nenhum resultado
        encontrado.

        </div>
        `;

        return;

    }

    historico.forEach(
    registro => {

        const div =
        document.createElement(
            "div"
        );

        div.className =
        "historico-item";

        div.innerHTML =

        `
        <strong>
        ${registro.data}
        </strong>

        <p>
        Acertos:
        ${registro.acertos}
        </p>

        <p>
        Erros:
        ${registro.erros}
        </p>

        <p>
        Aproveitamento:
        ${registro.percentual}%
        </p>
        `;

        area.appendChild(
            div
        );

    });

}

// =====================================
// REDAÇÃO
// =====================================

const redacaoTexto =
document.getElementById(
    "redacaoTexto"
);

const contadorPalavras =
document.getElementById(
    "contadorPalavras"
);

function contarPalavras(){

    if(!redacaoTexto) return;

    const texto =
    redacaoTexto.value.trim();

    if(texto === ""){

        contadorPalavras
        .textContent = "0";

        return;

    }

    const total =
    texto.split(/\s+/).length;

    contadorPalavras
    .textContent = total;

}

function salvarRedacao(){

    if(!redacaoTexto) return;

    localStorage.setItem(

        "pcbaRedacao",

        redacaoTexto.value

    );

    alert(
        "Redação salva!"
    );

}

function carregarRedacao(){

    if(!redacaoTexto) return;

    const texto =

    localStorage.getItem(
        "pcbaRedacao"
    );

    if(texto){

        redacaoTexto.value =
        texto;

        contarPalavras();

    }

}

// =====================================
// TAF
// =====================================

function salvarTAF(){

    const corrida =
    document.getElementById(
        "corrida"
    )?.value || 0;

    const abdominal =
    document.getElementById(
        "abdominal"
    )?.value || 0;

    const barra =
    document.getElementById(
        "barra"
    )?.value || 0;

    const registro = {

        data:
        new Date()
        .toLocaleDateString(),

        corrida,

        abdominal,

        barra

    };

    let historico =

    JSON.parse(

        localStorage.getItem(
            "pcbaTAF"
        )

    ) || [];

    historico.unshift(
        registro
    );

    localStorage.setItem(

        "pcbaTAF",

        JSON.stringify(
            historico
        )

    );

    alert(
        "Treino TAF salvo!"
    );

}

// =====================================
// MODO CONCURSO
// =====================================

function alternarModoConcurso(){

    modoConcurso =
    !modoConcurso;

    localStorage.setItem(

        "modoConcurso",

        JSON.stringify(
            modoConcurso
        )

    );

    alert(

        modoConcurso

        ?

        "Modo Concurso Ativado"

        :

        "Modo Concurso Desativado"

    );

}

function carregarModoConcurso(){

    const valor =

    localStorage.getItem(
        "modoConcurso"
    );

    if(valor){

        modoConcurso =
        JSON.parse(valor);

    }

}

// =====================================
// TEMA ESCURO
// =====================================

function alternarTema(){

    document.body
    .classList.toggle(
        "dark"
    );

    const temaEscuro =

    document.body
    .classList.contains(
        "dark"
    );

    localStorage.setItem(

        "temaEscuro",

        JSON.stringify(
            temaEscuro
        )

    );

}

function carregarTema(){

    const tema =

    JSON.parse(

        localStorage.getItem(
            "temaEscuro"
        )

    );

    if(tema){

        document.body
        .classList.add(
            "dark"
        );

    }

}

// =====================================
// EVENTOS DOS BOTÕES
// =====================================

document
.getElementById(
    "btnNovoSimulado"
)
?.addEventListener(
    "click",
    () => {

        mostrar(
            configuracao
        );

    }
);

document
.getElementById(
    "btnIniciar"
)
?.addEventListener(
    "click",
    () => {

        gerarSimulado();

        renderizarQuestoes();

        atualizarRespondidas();

        iniciarCronometro();

        mostrar(
            simulado
        );

    }
);

document
.getElementById(
    "btnFinalizar"
)
?.addEventListener(
    "click",
    () => {

        const confirmar =

        confirm(

        "Deseja finalizar a prova?"

        );

        if(confirmar){

            corrigirProva();

        }

    }
);

// =====================================
// REDAÇÃO
// =====================================

document
.getElementById(
    "btnRedacao"
)
?.addEventListener(
    "click",
    () => {

        mostrar(
            redacaoArea
        );

    }
);

document
.getElementById(
    "salvarRedacao"
)
?.addEventListener(
    "click",
    salvarRedacao
);

redacaoTexto
?.addEventListener(
    "input",
    contarPalavras
);

// =====================================
// TAF
// =====================================

document
.getElementById(
    "btnTAF"
)
?.addEventListener(
    "click",
    () => {

        mostrar(
            tafArea
        );

    }
);

document
.getElementById(
    "salvarTAF"
)
?.addEventListener(
    "click",
    salvarTAF
);

// =====================================
// HISTÓRICO
// =====================================

document
.getElementById(
    "btnHistorico"
)
?.addEventListener(
    "click",
    () => {

        carregarHistorico();

        mostrar(
            historicoArea
        );

    }
);

// =====================================
// MODO CONCURSO
// =====================================

document
.getElementById(
    "btnModoConcurso"
)
?.addEventListener(
    "click",
    alternarModoConcurso
);

// =====================================
// TEMA
// =====================================

document
.getElementById(
    "btnTema"
)
?.addEventListener(
    "click",
    alternarTema
);

// =====================================
// INICIALIZAÇÃO
// =====================================
document
.getElementById(
    "voltarHomeRedacao"
)
?.addEventListener(
    "click",
    ()=>mostrar(home)
);

document
.getElementById(
    "voltarHomeTAF"
)
?.addEventListener(
    "click",
    ()=>mostrar(home)
);

document
.getElementById(
    "voltarHomeHistorico"
)
?.addEventListener(
    "click",
    ()=>mostrar(home)
);

function iniciarSistema(){

    carregarTema();

    carregarModoConcurso();

    carregarRedacao();

    mostrar(
        home
    );

}

iniciarSistema();
