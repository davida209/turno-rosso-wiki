import assert from 'node:assert/strict'
import { test } from 'node:test'
import { evaluatePlan, scenarios } from '../src/data/scenarios.js'

test('el orden cambia el resultado y señala la acción pendiente', () => {
  const scenario = scenarios[0]
  const safetyFirst = evaluatePlan(scenario, ['limpiar', 'cobrar'])
  const checkoutFirst = evaluatePlan(scenario, ['cobrar', 'limpiar'])
  assert.ok(safetyFirst.values[0] > checkoutFirst.values[0])
  assert.ok(checkoutFirst.values[2] > safetyFirst.values[2])
  assert.equal(safetyFirst.deferred.id, 'reponer')
})

test('el plan requiere dos acciones distintas del escenario', () => {
  for (const actions of [['limpiar'], ['limpiar', 'limpiar'], ['limpiar', 'vigilar'], 'limpiar']) {
    assert.equal(evaluatePlan(scenarios[0], actions), null)
  }
})
