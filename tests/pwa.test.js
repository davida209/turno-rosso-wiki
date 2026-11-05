import { test } from 'node:test'
import assert from 'node:assert/strict'
import { filterNotes } from '../src/lib/local.js'
import { validSubscription } from '../server/push.js'
test('buscar y filtrar notas excluye eliminadas',()=>{
 const notes=[{id:'a',title:'Caja',body:'Vigilar',category:'seguridad',updated_at:'2026-01-02'},{id:'b',title:'Piso',body:'Limpiar',category:'limpieza',updated_at:'2026-01-01'},{id:'c',title:'Caja',body:'',category:'seguridad',updated_at:'2026-01-03',deleted:true}]
 assert.deepEqual(filterNotes(notes,'caja','seguridad').map(n=>n.id),['a'])
 assert.equal(filterNotes(notes,'sin coincidencia').length,0)
 assert.equal(filterNotes(notes,'','all').length,2)
})
test('push solo permite proveedores y claves de navegador válidos',()=>{
 const keys={p256dh:'A'.repeat(87),auth:'B'.repeat(22)}
 assert.equal(validSubscription({endpoint:'https://fcm.googleapis.com/fcm/send/opaque',keys}),true)
 for(const endpoint of ['http://fcm.googleapis.com/x','https://localhost/x','https://127.0.0.1/x','https://fcm.googleapis.com.attacker.test/x','https://fcm.googleapis.com:444/x'])assert.equal(validSubscription({endpoint,keys}),false)
 assert.equal(validSubscription({endpoint:'https://fcm.googleapis.com/x',keys:{}}),false)
})
