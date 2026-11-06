export const indicators = ['Seguridad', 'Ventas', 'Satisfacción']

export const scenarios = [
  {
    id: 'hora-pico', title: 'Hora pico', context: 'Hay leche derramada en el pasillo, el anaquel de básicos está vacío y tres clientes esperan en caja.',
    initial: [35, 45, 45],
    actions: [
      { id: 'limpiar', title: 'Limpiar el derrame', detail: 'Cierra el paso unos minutos y deja el piso seguro.', effects: [48, 0, 8], delay: [14, 0, 0], mechanic: 'limpieza' },
      { id: 'cobrar', title: 'Atender la fila', detail: 'Cobra las compras y reduce la espera.', effects: [0, 23, 33], delay: [0, 6, 14], mechanic: 'clientes' },
      { id: 'reponer', title: 'Reponer básicos', detail: 'Lleva una caja al anaquel vacío.', effects: [0, 39, 13], delay: [0, 10, 4], mechanic: 'reponer' },
    ],
  },
  {
    id: 'caja-vulnerable', title: 'Caja vulnerable', context: 'Ves a alguien rondar la registradora mientras llega un cliente y quedan pocas bebidas en el anaquel.',
    initial: [30, 46, 50],
    actions: [
      { id: 'vigilar', title: 'Asegurar la caja', detail: 'Vuelve a la registradora y mantente atento.', effects: [52, 12, 0], delay: [20, 7, 0], mechanic: 'ladron' },
      { id: 'orientar', title: 'Orientar al cliente', detail: 'Ayúdalo a encontrar el producto que busca.', effects: [0, 17, 38], delay: [0, 4, 12], mechanic: 'clientes' },
      { id: 'bebidas', title: 'Reponer las bebidas', detail: 'Abastece el anaquel antes de que se agote.', effects: [0, 38, 15], delay: [0, 12, 3], mechanic: 'reponer' },
    ],
  },
  {
    id: 'visita-sorpresa', title: 'Visita sorpresa', context: 'El dueño acaba de entrar. Hay una mancha cerca de la puerta, faltan productos y un cliente está molesto.',
    initial: [44, 42, 33],
    actions: [
      { id: 'entrada', title: 'Limpiar la entrada', detail: 'Quita la mancha antes de que alguien resbale.', effects: [44, 0, 10], delay: [13, 0, 0], mechanic: 'limpieza' },
      { id: 'ordenar', title: 'Abastecer el anaquel', detail: 'Revisa la mercancía y llena los espacios vacíos.', effects: [0, 43, 12], delay: [0, 9, 5], mechanic: 'auditoria' },
      { id: 'escuchar', title: 'Atender la queja', detail: 'Escucha al cliente y ofrécele una alternativa.', effects: [0, 10, 49], delay: [0, 4, 18], mechanic: 'reputacion' },
    ],
  },
]

export function evaluatePlan(scenario, actions) {
  if (!scenario || !Array.isArray(actions) || actions.length !== 2 || actions[0] === actions[1]) return null
  const steps = actions.map(id => scenario.actions.find(action => action.id === id))
  if (steps.some(step => !step)) return null

  const values = scenario.initial.map((value, index) => {
    const improvement = steps[0].effects[index] + steps[1].effects[index] - steps[1].delay[index]
    return Math.min(100, Math.max(0, value + improvement))
  })

  return { values, steps, deferred: scenario.actions.find(action => !actions.includes(action.id)) }
}
