// Datos de ejemplo. Cuando exista el backend real, estas funciones se
// reemplazan por llamadas fetch/axios a la API sin tocar los componentes
// que las consumen (todos reciben los datos ya resueltos).

export const mechanics = [
  {
    id: 'reponer',
    title: 'Reponer anaqueles',
    description:
      'Lleva una caja de la bodega y transfiere su contenido a un anaquel con espacio disponible.',
  },
  {
    id: 'limpieza',
    title: 'Limpieza',
    description:
      'Toma el trapeador y mantén presionada la interacción sobre una mancha hasta que desaparezca.',
  },
  {
    id: 'ladron',
    title: 'Ladrón',
    description:
      'Aparece por sorpresa; si nadie está en la caja, roba el dinero en 3 segundos y huye.',
  },
  {
    id: 'reputacion',
    title: 'Reputación',
    description:
      'Baja con manchas activas, anaqueles vacíos y clientes insatisfechos. Si llega a 0, pierdes la tienda.',
  },
  {
    id: 'clientes',
    title: 'Clientes',
    description:
      'Compran de los anaqueles con stock disponible; si están vacíos, se marchan insatisfechos.',
  },
  {
    id: 'auditoria',
    title: 'Auditoría del dueño',
    description:
      'Llega sin avisar; si la reputación está baja al momento de la visita, aplica una multa al balance.',
  },
]

export const characters = [
  {
    id: 'encargado',
    name: 'Encargado',
    role: 'Protagonista',
    description: 'El responsable de mantener la tienda a flote, reponer inventario, cobrar y limpiar.',
  },
  {
    id: 'ladron',
    name: 'Ladrón',
    role: 'Amenaza',
    description: 'Entra sin avisar y busca dinero fácil en la caja si la descuidas.',
  },
  {
    id: 'clientes',
    name: 'Clientes',
    role: 'Compradores',
    description: 'Visitan la tienda en busca de productos; su satisfacción mantiene tu reputación en alto.',
  },
  {
    id: 'dueno',
    name: 'El Dueño',
    role: 'Auditor',
    description: 'Realiza inspecciones sorpresa y multa la mala gestión de la tienda.',
  },
]

export const leaderboard = [
  { rank: 1, name: 'Les', score: 1240, result: 'gano' },
  { rank: 2, name: 'Ana', score: 980, result: 'gano' },
  { rank: 3, name: 'Marco', score: 760, result: 'perdio' },
  { rank: 4, name: 'Fer', score: 540, result: 'perdio' },
  { rank: 5, name: 'Dani', score: 410, result: 'perdio' },
]
