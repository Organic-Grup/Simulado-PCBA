
// ==========================
// CONFIGURAÇÕES GERAIS
// ==========================

const TOTAL_QUESTOES = 100;

const bancoQuestoes = [];

const materias = [
    "Português",
    "Direito Penal",
    "Processo Penal",
    "Constitucional",
    "Administrativo",
    "Informática",
    "Direitos Humanos"
];

// ==========================
// GERADOR DE QUESTÕES
// ==========================

function gerarQuestoes() {

    for (let i = 1; i <= TOTAL_QUESTOES; i++) {

        const materia =
            materias[Math.floor(Math.random() * materias.length)];

        bancoQuestoes.push({

            id: i,

            materia: materia,

            pergunta:
                `Questão ${i} - ${materia}`,

            alternativas: [
                "Alternativa A",
                "Alternativa B",
                "Alternativa C",
                "Alternativa D",
                "Alternativa E"
            ],

            correta:
                Math.floor(Math.random() * 5)

        });

    }

}

// ==========================
// EMBARALHAR
// ==========================

function embaralhar(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j =
            Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] =
            [array[j], array[i]];

    }

    return array;
}

// ==========================
// ELEMENTOS HTML
// ==========================

const btnIniciar =
    document.getElementById("btnIniciar");

const btnFinalizar =
    document.getElementById("btnFinalizar");

const btnTema =
    document.getElementById("btnTema");

const simulado =
    document.getElementById("simulado");

const resultado =
    document.getElementById("resultado");

const questoesDiv =
    document.getElementById("questoes");

const respondidasSpan =
    document.getElementById("respondidas");

const totalQuestoesSpan =
    document.getElementById("totalQuestoes");

const timerSpan =
    document.getElementById("timer");

// ==========================
// CRONÔMETRO
// ==========================

let tempoRestante = 10800; // 3 horas

let intervalo = null;

function iniciarCronometro() {

    intervalo = setInterval(() => {

        tempoRestante--;

        const horas =
            Math.floor(tempoRestante / 3600);

        const minutos =
            Math.floor((tempoRestante % 3600) / 60);

        const segundos =
            tempoRestante % 60;

        timerSpan.textContent =
            String(horas).padStart(2, "0") +
            ":" +
            String(minutos).padStart(2, "0") +
            ":" +
            String(segundos).padStart(2, "0");

        if (tempoRestante <= 0) {

            clearInterval(intervalo);

            corrigirSimulado();

        }

    }, 1000);

}

// ==========================
// CONTADOR DE RESPOSTAS
// ==========================

function atualizarRespondidas() {

    const marcadas =
        document.querySelectorAll(
            'input[type="radio"]:checked'
        ).length;

    respondidasSpan.textContent =
        marcadas;

}

// ==========================
// RENDERIZAR QUESTÕES
// ==========================

function renderizarQuestoes() {

    totalQuestoesSpan.textContent =
        bancoQuestoes.length;

    questoesDiv.innerHTML = "";

    bancoQuestoes.forEach((questao, index) => {

        const card =
            document.createElement("div");

        card.className =
            "questao";

        let html = `
            <span class="materia">
                ${questao.materia}
            </span>

            <h3>
                ${index + 1}. ${questao.pergunta}
            </h3>
        `;

        questao.alternativas.forEach(
            (alternativa, posicao) => {

                html += `
                <label class="alternativa">

                    <input
                        type="radio"
                        name="q${index}"
                        value="${posicao}"
                        onchange="atualizarRespondidas()"
                    >

                    ${alternativa}

                </label>
                `;

            }
        );

        card.innerHTML = html;

        questoesDiv.appendChild(card);

    });

}

// ==========================
// CORREÇÃO
// ==========================

function corrigirSimulado() {

    clearInterval(intervalo);

    let acertos = 0;

    let estatisticas = {};

    bancoQuestoes.forEach((questao, index) => {

        if (!estatisticas[questao.materia]) {

            estatisticas[questao.materia] = {
                total: 0,
                acertos: 0
            };

        }

        estatisticas[questao.materia].total++;

        const resposta =
            document.querySelector(
                `input[name="q${index}"]:checked`
            );

        if (resposta) {

            const valor =
                Number(resposta.value);

            if (valor === questao.correta) {

                acertos++;

                estatisticas[
                    questao.materia
                ].acertos++;

            }

        }

    });

    const erros =
        bancoQuestoes.length - acertos;

    const percentual =
        (
            (acertos / bancoQuestoes.length)
            * 100
        ).toFixed(1);

    document.getElementById("acertos")
        .textContent = acertos;

    document.getElementById("erros")
        .textContent = erros;

    document.getElementById("percentual")
        .textContent =
            percentual + "%";

    mostrarEstatisticas(
        estatisticas
    );

    simulado.classList.add(
        "oculto"
    );

    resultado.classList.remove(
        "oculto"
    );

}

// ==========================
// ESTATÍSTICAS
// ==========================

function mostrarEstatisticas(
    estatisticas
) {

    const container =
        document.getElementById(
            "estatisticas"
        );

    container.innerHTML = "";

    Object.keys(estatisticas)
        .forEach(materia => {

            const dados =
                estatisticas[materia];

            const aproveitamento =
                (
                    (dados.acertos /
                    dados.total)
                    * 100
                ).toFixed(1);

            const bloco =
                document.createElement(
                    "div"
                );

            bloco.className =
                "estatistica";

            bloco.innerHTML = `
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
                    ${aproveitamento}%
                </p>
            `;

            container.appendChild(
                bloco
            );

        });

}

// ==========================
// TEMA ESCURO
// ==========================

btnTema.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark"
        );

    }
);

// ==========================
// EVENTOS
// ==========================

btnIniciar.addEventListener(
    "click",
    () => {

        document.querySelector(
            ".boas-vindas"
        ).classList.add(
            "oculto"
        );

        simulado.classList.remove(
            "oculto"
        );

        gerarQuestoes();

        embaralhar(
            bancoQuestoes
        );

        renderizarQuestoes();

        iniciarCronometro();

    }
);

btnFinalizar.addEventListener(
    "click",
    () => {

        const confirmar =
            confirm(
                "Deseja finalizar o simulado?"
            );

        if (confirmar) {

            corrigirSimulado();

        }

    }
);

// ==========================
// DISPONÍVEL GLOBALMENTE
// ==========================

window.atualizarRespondidas =
    atualizarRespondidas;
