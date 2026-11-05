import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, existsSync } from 'node:fs'
const assets = new URL('../src/assets/', import.meta.url)
for (const character of ['Jugador', 'NPC/Cliente01', 'NPC/Cliente02', 'NPC/Cliente03', 'NPC/Dueno', 'NPC/Ladron']) {
  test(`${character}: sprites disponibles en cada dirección y estado`, () => {
    for (const direction of ['Abajo', 'Izquierda', 'Arriba', 'Derecha']) {
      for (const state of ['Reposo', 'Caminar']) {
        const images = readdirSync(new URL(`personajes/${character}/${state}/${direction}/`, assets)).filter(name => name.endsWith('.png'))
        assert.ok(images.length >= (state === 'Caminar' ? 2 : 1), `${character}/${state}/${direction} incompleto`)
      }
    }
  })
}
test('recursos de las mecánicas incluidos en el repositorio', () => {
  for (const name of ['Caja_Carton.png', 'Caja_Registradora.png', 'Trapeador.png', 'Senal_PisoMojado.png', 'Estante_ConProductos.png']) {
    assert.ok(existsSync(new URL(`mecanicas/${name}`, assets)), name)
  }
})
