export const mechanics = [
  {
    id: "reponer",
    title: "Reponer anaqueles",
    category: "Inventario",
    icon: "▤",
    summary:
      "Lleva productos de la bodega a los anaqueles antes de que se vacíen.",
    text: "Toma una caja de la bodega y transfiere su contenido a un anaquel con espacio. Los clientes necesitan encontrar productos para completar sus compras.",
    action:
      "Revisa el stock mientras recorres la tienda. Repón antes de que llegue el siguiente cliente.",
    risk: "Un anaquel vacío puede hacer que los clientes se marchen insatisfechos.",
  },
  {
    id: "limpieza",
    title: "Limpieza",
    category: "Mantenimiento",
    icon: "✦",
    summary: "Usa el trapeador y mantén la interacción sobre cada mancha.",
    text: "Las manchas requieren atención durante el turno. Lleva el trapeador hasta la zona y mantén presionada la interacción hasta completar la limpieza.",
    action:
      "Incluye el piso en tu recorrido de revisión; una mancha activa afecta la reputación.",
    risk: "Dejar manchas activas reduce la reputación de la tienda.",
  },
  {
    id: "caja",
    title: "Cobrar y cuidar la caja",
    category: "Operación",
    icon: "▣",
    summary: "Atiende los cobros y no dejes la caja sin vigilancia.",
    text: "El encargado necesita alternar entre el inventario, la limpieza y la caja. La atención al mostrador es clave para cuidar los ingresos del turno.",
    action:
      "Regresa a la caja después de cada tarea y comprueba quién está frente al mostrador.",
    risk: "Descuidar la caja facilita el robo del ladrón.",
  },
  {
    id: "ladron",
    title: "El ladrón",
    category: "Seguridad",
    icon: "!",
    summary:
      "Si la caja está desatendida, puede robar el dinero en tres segundos.",
    text: "El ladrón aparece por sorpresa. Si nadie está en la caja, aprovecha una ventana de tres segundos para tomar el dinero y huir.",
    action:
      "Identifica la amenaza y vuelve a la caja. La vigilancia tiene prioridad sobre las tareas que pueden esperar.",
    risk: "Puedes perder el dinero de la caja si no respondes a tiempo.",
  },
  {
    id: "reputacion",
    title: "Reputación",
    category: "Gestión",
    icon: "★",
    summary:
      "Mantén satisfechos a los clientes: llegar a cero significa perder la tienda.",
    text: "La reputación disminuye por manchas activas, anaqueles vacíos y clientes insatisfechos. Es un indicador de la gestión del turno.",
    action:
      "Equilibra reposición, limpieza y atención. No te concentres en una sola tarea mientras las demás se acumulan.",
    risk: "Si la reputación llega a cero, pierdes la tienda.",
  },
  {
    id: "auditoria",
    title: "Auditoría del dueño",
    category: "Gestión",
    icon: "◎",
    summary: "El dueño inspecciona sin aviso y multa la mala gestión.",
    text: "El dueño puede llegar en cualquier momento. Si encuentra la reputación baja, aplica una multa al balance de la tienda.",
    action:
      "Mantén condiciones estables durante todo el turno, no solo cuando esperas una visita.",
    risk: "Una inspección con reputación baja puede reducir el balance.",
  },
];
export const characters = [
  {
    id: "encargado",
    name: "Encargado",
    role: "Protagonista",
    tag: "TÚ CONTROLAS EL TURNO",
    description:
      "Reponer inventario, cobrar y limpiar: el encargado mantiene la tienda funcionando y cuida su reputación.",
    focus: "Organizar las tareas sin perder de vista la caja.",
    related: ["reponer", "limpieza", "caja"],
  },
  {
    id: "ladron",
    name: "Ladrón",
    role: "Amenaza",
    tag: "VIGILA LA CAJA",
    description:
      "Entra sin avisar y busca una oportunidad para tomar el dinero cuando el mostrador está desatendido.",
    focus: "Detectarlo a tiempo y proteger la caja.",
    related: ["ladron", "caja"],
  },
  {
    id: "clientes",
    name: "Clientes",
    role: "Compradores",
    tag: "CUIDA LA EXPERIENCIA",
    description:
      "Buscan productos disponibles en los anaqueles. Su satisfacción ayuda a mantener la reputación de la tienda.",
    focus: "Conservar stock y atender las compras.",
    related: ["reponer", "reputacion"],
  },
  {
    id: "dueno",
    name: "El Dueño",
    role: "Auditor",
    tag: "INSPECCIÓN SORPRESA",
    description:
      "Realiza inspecciones durante el turno y puede multar una tienda con mala gestión.",
    focus: "Mantener la reputación antes de la visita.",
    related: ["auditoria", "reputacion"],
  },
];
export const objectives = [
  {
    id: "stock",
    label: "Revisar y reponer los anaqueles",
    detail: "Evita que los clientes encuentren espacios vacíos.",
  },
  {
    id: "clean",
    label: "Mantener el piso limpio",
    detail: "Atiende las manchas con el trapeador.",
  },
  {
    id: "cash",
    label: "Atender y vigilar la caja",
    detail: "Alterna cobros y recorridos sin descuidarla.",
  },
  {
    id: "reputation",
    label: "Cuidar la reputación",
    detail: "Comprueba el estado general de la tienda.",
  },
];
export const questions = [
  {
    text: "Un cliente encuentra un anaquel vacío. ¿Qué debes priorizar?",
    options: [
      "Esperar a la auditoría",
      "Reponer desde la bodega",
      "Dejar que se marche",
    ],
    answer: 1,
    explanation:
      "La reposición permite que los clientes encuentren los productos que buscan.",
  },
  {
    text: "¿Cómo se limpia una mancha?",
    options: [
      "Con el trapeador y manteniendo la interacción",
      "Pasando por encima",
      "Desde la bodega",
    ],
    answer: 0,
    explanation:
      "Mantén la interacción con el trapeador hasta completar la limpieza.",
  },
  {
    text: "¿Qué sucede si la caja queda sola frente al ladrón?",
    options: [
      "Sube la reputación",
      "Se repone el inventario",
      "Puede robar en tres segundos",
    ],
    answer: 2,
    explanation:
      "La vigilancia de la caja evita que aproveche la ventana de robo.",
  },
  {
    text: "¿Qué pasa al llegar a cero de reputación?",
    options: [
      "Pierdes la tienda",
      "Se reinicia el inventario",
      "Llegan más clientes",
    ],
    answer: 0,
    explanation: "La reputación es una condición de continuidad de la tienda.",
  },
  {
    text: "¿Qué puede hacer el dueño ante una reputación baja?",
    options: ["Regalar productos", "Aplicar una multa", "Limpiar la tienda"],
    answer: 1,
    explanation: "La auditoría puede aplicar una multa al balance.",
  },
];
const normalize = (s) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
export function searchMechanics(query) {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  return mechanics.filter((m) =>
    words.every((w) =>
      normalize(
        m.title + " " + m.summary + " " + m.text + " " + m.category,
      ).includes(w),
    ),
  );
}
export function trainingScore(answers) {
  if (
    answers.length !== questions.length ||
    answers.some((a) => !Number.isInteger(a) || a < 0 || a > 2)
  )
    throw new Error("Responde las cinco preguntas.");
  const correct = questions.reduce(
    (sum, q, i) => sum + (q.answer === answers[i] ? 1 : 0),
    0,
  );
  return {
    correct,
    total: questions.length,
    score: correct * 250,
    result: correct >= 4 ? "Ganó" : "Perdió",
  };
}
export function ranking(rows, filter = "Todos") {
  return rows
    .filter((r) => filter === "Todos" || r.result === filter)
    .sort((a, b) => b.score - a.score);
}
