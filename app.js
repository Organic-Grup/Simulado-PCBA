// =====================================
// SIMULADOR PCBA - ENGINE FINAL CORRIGIDA
// 100% FUNCIONAL - COPIAR E COLAR
// =====================================

let state = {
  questoes: [],
  tempo: 10800,
  cron: null,
  respondidas: 0,
  erros: []
};

// =====================================
// ELEMENTOS
// =====================================

const el = {
  home: document.getElementById("home"),
  configuracao: document.getElementById("configuracao"),
  simulado: document.getElementById("simulado"),
  resultado: document.getElementById("resultado"),
  questoes: document.getElementById("questoes"),
  timer: document.getElementById("timer"),
  respondidas: document.getElementById("respondidas"),
  total: document.getElementById("totalQuestoes"),
  progresso: document.getElementById("progresso")
};

// =====================================
// NAVEGAÇÃO (AGORA COMPLETA)
// =====================================

function mostrar(id){

  const telas = [
    el.home,
    el.configuracao,
    el.simulado,
    el.resultado
  ];

  telas.forEach(t => t?.classList.add("hidden"));

  if(el[id]){
    el[id].classList.remove("hidden");
  }
}

// =====================================
// SHUFFLE
// =====================================

function shuffle(a){
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

// =====================================
// INICIAR SIMULADO
// =====================================

function gerarSimulado(){

  if(!window.bancoQuestoes){
    alert("Banco de questões não encontrado!");
    return;
  }

  let base = [...bancoQuestoes];

  const filtro = document.getElementById("filtroMateria")?.value;

  if(filtro && filtro !== "todas"){
    base = base.filter(q => q.materia === filtro);
  }

  shuffle(base);

  state.questoes = base.slice(0, 100);
  state.tempo = 10800;
  state.respondidas = 0;
  state.erros = [];

  render();
  timer();
  save();

  mostrar("simulado");
}

// =====================================
// RENDER
// =====================================

function render(){

  el.questoes.innerHTML = "";

  state.questoes.forEach((q,i)=>{

    const div = document.createElement("div");
    div.className = "questao";

    div.innerHTML = `
      <div class="materia">${q.materia}</div>
      <h3>${i+1}. ${q.pergunta}</h3>

      ${q.alternativas.map((a,j)=>`
        <label>
          <input type="radio" name="q${i}" value="${j}">
          ${a}
        </label>
      `).join("")}
    `;

    el.questoes.appendChild(div);
  });

  if(el.total){
    el.total.textContent = state.questoes.length;
  }
}

// =====================================
// UPDATE
// =====================================

function update(){

  const marcadas = document.querySelectorAll("input[type=radio]:checked").length;

  state.respondidas = marcadas;

  if(el.respondidas){
    el.respondidas.textContent = marcadas;
  }

  const p = state.questoes.length
    ? (marcadas/state.questoes.length)*100
    : 0;

  if(el.progresso){
    el.progresso.style.width = p + "%";
  }

  save();
}

// =====================================
// TIMER
// =====================================

function timer(){

  if(state.cron) clearInterval(state.cron);

  state.cron = setInterval(()=>{

    state.tempo--;

    const h = String(Math.floor(state.tempo/3600)).padStart(2,"0");
    const m = String(Math.floor((state.tempo%3600)/60)).padStart(2,"0");
    const s = String(state.tempo%60).padStart(2,"0");

    if(el.timer){
      el.timer.textContent = `${h}:${m}:${s}`;
    }

    save();

    if(state.tempo <= 0){
      finalizar();
    }

  },1000);
}

// =====================================
// FINALIZAR
// =====================================

function finalizar(){

  clearInterval(state.cron);

  let acertos = 0;
  state.erros = [];

  state.questoes.forEach((q,i)=>{

    const r = document.querySelector(`input[name=q${i}]:checked`);

    if(r && Number(r.value) === q.correta){
      acertos++;
    } else {
      state.erros.push(q);
    }
  });

  const erros = state.questoes.length - acertos;
  const p = ((acertos/state.questoes.length)*100).toFixed(1);

  document.getElementById("acertos").textContent = acertos;
  document.getElementById("erros").textContent = erros;
  document.getElementById("percentual").textContent = p + "%";

  gerarAnalise();
  mostrar("resultado");
}

// =====================================
// ANÁLISE
// =====================================

function gerarAnalise(){

  const box = document.getElementById("analise");
  if(!box) return;

  box.innerHTML = `
    <h3>🔥 Revisão Prioritária</h3>
    ${state.erros.slice(0,10).map(q=>`
      <p>${q.materia} → ${q.pergunta}</p>
    `).join("")}
  `;
}

// =====================================
// SALVAR
// =====================================

function save(){
  localStorage.setItem("pcba_state", JSON.stringify(state));
}

// =====================================
// BOTÕES (🔥 ESSENCIAL - AGORA FUNCIONA)
// =====================================

document.getElementById("btnIniciar")
  ?.addEventListener("click", gerarSimulado);

document.getElementById("btnFinalizar")
  ?.addEventListener("click", finalizar);

document.getElementById("btnNovoSimulado")
  ?.addEventListener("click", () => mostrar("configuracao"));

document.getElementById("btnVoltarInicio")
  ?.addEventListener("click", () => mostrar("home"));


// =====================================
// EVENTO GLOBAL
// =====================================

document.addEventListener("change",(e)=>{
  if(e.target.matches("input[type=radio]")){
    update();
  }
});
document.getElementById("btnIniciar")
  ?.addEventListener("click", gerarSimulado);
window.addEventListener("load", () => {
  const data = localStorage.getItem("pcba_state");

  if (!data) return;

  try {
    const parsed = JSON.parse(data);

    // validação mínima
    if (!parsed.questoes || !Array.isArray(parsed.questoes)) return;

    state = parsed;

    render();
    update();   // 🔥 ESSENCIAL (corrige progresso e respondidas)

    // evita múltiplos timers
    if (state.tempo > 0) {
      timer();
    }

    mostrar("simulado");

  } catch (e) {
    console.log("Erro ao restaurar simulado:", e);
  }
});
