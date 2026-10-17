import "./style.css";
import { esc, load, save, modal, toast, empty } from "./utils.js";
import {
  mechanics,
  characters,
  objectives,
  questions,
  searchMechanics,
  trainingScore,
  ranking,
} from "./model.js";
const stored = load("les-rosso-v2", {});
let done = Array.isArray(stored?.done)
    ? stored.done.filter((id) => objectives.some((o) => o.id === id))
    : [],
  notes = stored?.notes && typeof stored.notes === "object" ? stored.notes : {},
  scores = Array.isArray(stored?.scores) ? stored.scores : [],
  saved = Array.isArray(stored?.saved) ? stored.saved : [];
const pages = {
  inicio: ["CENTRO DE CONTROL", "Tu turno empieza aquí."],
  mecanicas: ["GUÍA DEL ENCARGADO", "Mecánicas de la tienda."],
  personajes: ["QUIÉN ES QUIÉN", "Personajes del turno."],
  marcador: ["REGISTRO DE TURNOS", "Marcador de práctica."],
};
let page = pages[location.hash.slice(1)]
  ? location.hash.slice(1)
  : pages[location.pathname.slice(1)]
    ? location.pathname.slice(1)
    : "inicio";
function persist() {
  save("les-rosso-v2", { done, notes, scores, saved });
}
function render() {
  document.querySelector("#app").innerHTML =
    `<a class="skip" href="#main">Saltar al contenido</a><div class="wiki-shell"><aside class="wiki-sidebar"><a class="wiki-logo" href="#inicio">TURNO<span>ROSSO<span class="logo-block">WIKI</span></span></a><p class="sidebar-caption">GUÍA DEL ENCARGADO</p><nav class="wiki-nav" aria-label="Navegación de la wiki">${[
      ["inicio", "◫", "Inicio"],
      ["mecanicas", "⚙", "Mecánicas"],
      ["personajes", "◎", "Personajes"],
      ["marcador", "▥", "Marcador"],
    ]
      .map(
        ([id, icon, title]) =>
          `<a href="#${id}" class="${page === id ? "active" : ""}" ${page === id ? 'aria-current="page"' : ""}><span aria-hidden="true">${icon}</span>${title}<small>↗</small></a>`,
      )
      .join(
        "",
      )}</nav><div class="sidebar-game"><span class="store-status"></span> TIENDA EN TURNO NOCTURNO</div><div class="sidebar-bottom"><p>DEMO COMPLEMENTARIA</p><span>Notas, objetivos y resultados locales.</span><button id="reset-wiki">Reiniciar mis datos</button><a href="https://portfoliolester.vercel.app/" target="_blank" rel="noopener noreferrer">Portafolio de Lester David ↗</a></div></aside><main id="main" class="wiki-main"><div class="wiki-topbar"><span>TURNO ROSSO / ${page.toUpperCase()}</span><button id="practice" class="wiki-button">Practicar un turno ↗</button></div><div class="page-heading"><p>${pages[page][0]}</p><h1>${pages[page][1]}</h1></div><div id="page-content"></div><footer class="wiki-footer"><span>APP COMPLEMENTARIA / TURNO ROSSO</span><span>Modo demo · Sin conexión al juego</span></footer></main></div>`;
  document.querySelector("#practice").onclick = practice;
  document.querySelector("#reset-wiki").onclick = () => {
    const el = modal(
      "Reiniciar datos locales",
      '<p>Se quitarán tus notas, objetivos y resultados de práctica de esta wiki. No afecta a los demás proyectos.</p><button class="btn" id="confirm-reset" style="margin-top:22px">Restablecer datos de prueba</button>',
    );
    el.querySelector("#confirm-reset").onclick = () => {
      done = [];
      notes = {};
      scores = [];
      saved = [];
      persist();
      el.close();
      render();
    };
  };
  if (page === "inicio") home();
  if (page === "mecanicas") guide();
  if (page === "personajes") people();
  if (page === "marcador") leaderboard();
}
function navigate() {
  const next = location.hash.slice(1);
  if (pages[next]) {
    page = next;
    render();
    window.scrollTo({ top: 0, behavior: "instant" });
  }
}
addEventListener("hashchange", navigate);
function home() {
  document.querySelector("#page-content").innerHTML =
    `<section class="game-cover"><img src="/images/tienda.jpg" alt="Encargado limpiando la tienda mientras un ladrón se acerca a la caja"><div class="cover-text"><span>ABIERTO 24/7 / TURNO DE NOCHE</span><h2>Una tienda.<br>Todo bajo tu cuidado.</h2><p>Repón, limpia y cobra. Y no le pierdas la pista a la caja.</p><a href="#mecanicas" class="wiki-button red">Consultar las mecánicas →</a></div><div class="cover-stamp">ROSSO<br><small>GUÍA DEL TURNO</small></div></section><div class="dashboard-grid"><section class="objectives-panel"><div class="panel-heading"><h2>Objetivos del día</h2><span id="objective-counter">${done.length}/4</span></div><p>Tu lista de preparación. Márcala conforme revisas la guía.</p>${objectives.map((o) => `<label class="objective"><input type="checkbox" data-objective="${o.id}" ${done.includes(o.id) ? "checked" : ""}><span><strong>${o.label}</strong><small>${o.detail}</small></span></label>`).join("")}</section><section class="risk-panel"><span class="risk-symbol">!</span><p>ALERTA DEL ENCARGADO</p><h2>Tres segundos<br>son suficientes.</h2><p>El ladrón aprovecha una caja desatendida. La vigilancia tiene prioridad.</p><button class="wiki-button" data-guide="ladron">Cómo evitar el robo ↗</button></section></div><div class="quick-links"><a href="#personajes"><span>01 / PERSONAJES</span><strong>Conoce a quienes<br>entran a la tienda.</strong><span>ENCARGADO · CLIENTES · LADRÓN · DUEÑO →</span></a><a href="#marcador"><span>02 / MARCADOR</span><strong>Comprueba lo que<br>sabes del turno.</strong><span>RESULTADOS DE PRÁCTICA →</span></a></div>`;
  document.querySelectorAll("[data-objective]").forEach(
    (input) =>
      (input.onchange = () => {
        done = input.checked
          ? [...new Set([...done, input.dataset.objective])]
          : done.filter((id) => id !== input.dataset.objective);
        persist();
        document.querySelector("#objective-counter").textContent =
          `${done.length}/4`;
      }),
  );
  bindGuides();
}
function bindGuides() {
  document
    .querySelectorAll("[data-guide]")
    .forEach((b) => (b.onclick = () => detail(b.dataset.guide)));
}
function guide() {
  document.querySelector("#page-content").innerHTML =
    `<div class="guide-toolbar"><input type="search" id="search-guide" aria-label="Buscar mecánica" placeholder="Buscar en la guía: caja, reputación, limpieza…"><span id="guide-count" aria-live="polite"></span></div><div id="mechanics-list"></div>`;
  function list() {
    const entries = searchMechanics(
      document.querySelector("#search-guide").value,
    );
    document.querySelector("#guide-count").textContent =
      `${entries.length} ${entries.length === 1 ? "entrada" : "entradas"}`;
    document.querySelector("#mechanics-list").innerHTML = entries.length
      ? entries
          .map(
            (m) =>
              `<article class="mechanic-row"><div class="mechanic-icon" aria-hidden="true">${m.icon}</div><div><p>${m.category.toUpperCase()}</p><h2>${m.title}</h2><span>${m.summary}</span></div><button class="wiki-button" data-guide="${m.id}">Leer guía ↗</button><span class="saved-label">${saved.includes(m.id) ? "★ GUARDADA" : ""}</span></article>`,
          )
          .join("")
      : empty(
          "No se encontró esa mecánica",
          "Prueba con caja, reputación o limpieza.",
        );
    bindGuides();
  }
  document.querySelector("#search-guide").oninput = list;
  list();
}
function detail(id) {
  const m = mechanics.find((m) => m.id === id);
  const el = modal(
    m.title,
    `<span class="badge">${m.category}</span><p style="margin-top:20px">${m.text}</p><h3>Qué debes hacer</h3><p>${m.action}</p><div class="notice"><strong>Riesgo del turno</strong><p>${m.risk}</p></div><button class="btn secondary" id="save-guide">${saved.includes(id) ? "★ Quitar de guardadas" : "☆ Guardar esta guía"}</button><form id="note-form" style="margin-top:25px"><label for="guide-note">Mi nota del turno</label><textarea id="guide-note" name="note" maxlength="2000" placeholder="Escribe un recordatorio…">${esc(notes[id] || "")}</textarea><button class="btn" style="margin-top:15px" type="submit">Guardar nota local</button></form>`,
  );
  el.querySelector("#save-guide").onclick = () => {
    saved = saved.includes(id) ? saved.filter((x) => x !== id) : [...saved, id];
    persist();
    el.querySelector("#save-guide").textContent = saved.includes(id)
      ? "★ Quitar de guardadas"
      : "☆ Guardar esta guía";
    toast("Guías guardadas actualizadas.");
  };
  el.querySelector("form").onsubmit = (e) => {
    e.preventDefault();
    notes[id] = e.currentTarget.note.value.trim();
    persist();
    toast("Nota guardada en este navegador.");
  };
  el.addEventListener(
    "close",
    () => {
      if (page === "mecanicas") guide();
    },
    { once: true },
  );
}
function people() {
  document.querySelector("#page-content").innerHTML =
    `<div class="character-grid">${characters.map((c, i) => `<article class="character-card"><div class="character-visual ${c.id}">${c.id === "encargado" ? '<div class="player-sprite" role="img" aria-label="Sprite del encargado con gorra roja y delantal azul"></div>' : `<span>${["", "!", "◉", "◈"][i]}</span>`}<small>${c.tag}</small></div><div class="character-content"><span class="badge">${c.role}</span><h2>${c.name}</h2><p>${c.description}</p><div class="character-focus"><span>TEN PRESENTE</span><p>${c.focus}</p></div><div class="character-guides">${c.related.map((id) => `<button data-guide="${id}">${mechanics.find((m) => m.id === id).title} ↗</button>`).join("")}</div></div></article>`).join("")}</div>`;
  bindGuides();
}
function leaderboard() {
  const sample = [
    { name: "Les", score: 1240, result: "Ganó", sample: true },
    { name: "Ana", score: 980, result: "Ganó", sample: true },
    { name: "Marco", score: 760, result: "Perdió", sample: true },
    { name: "Fer", score: 540, result: "Perdió", sample: true },
    { name: "Dani", score: 410, result: "Perdió", sample: true },
  ];
  document.querySelector("#page-content").innerHTML =
    `<div class="score-banner"><div><p>MARCADOR / VISTA DE DEMOSTRACIÓN</p><h2>¿Cómo te fue en el turno?</h2><span>Los resultados nuevos son de práctica y se guardan en este navegador.</span></div><button class="wiki-button red" id="practice-score">Registrar mi práctica ↗</button></div><div class="ranking-toolbar"><span>CLASIFICACIÓN</span><select id="ranking-filter" aria-label="Filtrar resultados"><option>Todos</option><option>Ganó</option><option>Perdió</option></select></div><div class="ranking-table" role="table" aria-label="Marcador de práctica"><div class="ranking-head" role="row"><span role="columnheader">POS.</span><span role="columnheader">ENCARGADO</span><span role="columnheader">PUNTOS</span><span role="columnheader">RESULTADO</span></div><div id="ranking-rows"></div></div><p class="table-note">Los registros marcados como EJEMPLO son datos de muestra. No hay un marcador global conectado al juego.</p>`;
  function show() {
    const rows = ranking(
      [...scores, ...sample],
      document.querySelector("#ranking-filter").value,
    );
    document.querySelector("#ranking-rows").innerHTML = rows.length
      ? rows
          .map(
            (r, i) =>
              `<div class="ranking-row" role="row"><strong role="cell">${String(i + 1).padStart(2, "0")}</strong><div role="cell"><b>${esc(r.name)}</b><small>${r.sample ? "EJEMPLO" : "TU PRÁCTICA LOCAL"}</small></div><span role="cell">${r.score.toLocaleString("es-MX")}</span><span role="cell" class="result ${r.result === "Ganó" ? "win" : "lose"}">${r.result}</span></div>`,
          )
          .join("")
      : empty(
          "Sin resultados para este filtro",
          "Completa una práctica y registra tu resultado.",
        );
  }
  document.querySelector("#ranking-filter").onchange = show;
  document.querySelector("#practice-score").onclick = practice;
  show();
}
function practice() {
  const el = modal(
    "Práctica del encargado",
    `<p>Responde cinco situaciones del turno. Es una evaluación de la guía, no una partida del juego. Cada acierto vale 250 puntos; cuatro o cinco aciertos cuentan como Ganó.</p><form id="practice-form" style="margin-top:25px"><label for="player-name">Nombre para el marcador de práctica</label><input id="player-name" name="playerName" value="Encargado demo" maxlength="40" required>${questions.map((q, i) => `<fieldset class="practice-question"><legend>${i + 1}. ${q.text}</legend>${q.options.map((option, j) => `<label><input type="radio" name="q${i}" value="${j}" required>${option}</label>`).join("")}</fieldset>`).join("")}<button class="btn" type="submit">Revisar y guardar mi resultado</button></form><div id="practice-result" aria-live="polite"></div>`,
  );
  el.querySelector("form").onsubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("playerName")).trim();
    if (!name) {
      toast("Escribe un nombre de prueba.");
      return;
    }
    const answers = questions.map((_, i) => Number(data.get("q" + i)));
    const result = trainingScore(answers);
    scores.unshift({
      id: crypto.randomUUID(),
      name,
      score: result.score,
      result: result.result,
    });
    persist();
    el.querySelector("#practice-result").innerHTML =
      `<div class="summary"><h3>${result.score} puntos / ${result.result}</h3><p>${result.correct} de 5 decisiones correctas.</p>${questions.map((q, i) => `<p style="margin-top:15px"><strong>${answers[i] === q.answer ? "✓" : "↺"} ${esc(q.text)}</strong><br>${q.explanation}</p>`).join("")}</div><p class="hint">Resultado guardado en tu marcador local.</p>`;
    e.currentTarget.querySelector('button[type="submit"]').disabled = true;
  };
  el.addEventListener(
    "close",
    () => {
      if (page === "marcador") leaderboard();
    },
    { once: true },
  );
}
render();
