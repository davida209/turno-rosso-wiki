# Turno Rosso PWA

Guía instalable del juego con personajes giratorios, mecánicas ilustradas, cuenta, bitácora offline, ranking de solo lectura y notificaciones.

Producción: https://prototipo-wiki-ten.vercel.app
Repositorio: https://github.com/davida209/turno-rosso-wiki

## Desarrollo

Node.js 22.12 o superior.

1. npm ci
2. Configura las variables públicas de .env.example en .env.local. Nunca publiques claves privadas.
3. npm run dev

Para probar el service worker: npm run build y npm run preview. El modo de desarrollo no registra un service worker.

## Datos reales

Supabase dedicado: turno-rosso-pwa, referencia heiasvzrsfskpbrchpwu. Cuenta y notas usan Supabase Auth y PostgREST. No hay puntuaciones de ejemplo. El ranking consulta únicamente game_runs.verification=verified; el navegador no tiene permisos para escribir esa tabla.

Las migraciones supabase/001_pwa.sql y supabase/002_public_ranking.sql ya están aplicadas al proyecto dedicado. No se debe ejecutar sobre otra base. Las futuras migraciones deben ser incrementales.

## Offline

El service worker precarga el HTML, código, fuentes, iconos, logo y sprites. No guarda respuestas de Auth, Supabase ni /api. La bitácora usa almacenamiento local separado para invitado y cada cuenta; sus cambios pendientes se sincronizan al abrir la página o recuperar conexión. Las eliminaciones se mantienen como pendientes hasta enviarse. Importar notas de invitado es una acción explícita.

Las ediciones concurrentes de una nota se resuelven según la última escritura sincronizada. Las notas de invitado no se transmiten sin importarlas. Cerrar sesión deja las notas de cuenta guardadas localmente; se recomienda borrar los datos del sitio en un dispositivo compartido.

## Notificaciones

Mi cuenta permite solicitar permiso y mostrar una notificación local real. Los usuarios con cuenta pueden registrar hasta cinco dispositivos para Web Push, enviar una prueba y activar el recordatorio diario. El servidor usa VAPID y el cron de Vercel, sin exponer claves privadas.

El cron se solicita a las 23:00 UTC, alrededor de las 18:00 de Cancún. En el plan Hobby puede ejecutarse dentro de esa hora. La entrega depende del permiso, el navegador y la conexión. En iOS se necesita abrir la PWA instalada desde la pantalla de inicio. No es un temporizador que dependa de mantener la página abierta.

## Configuración de autenticación

En Supabase → Authentication → URL Configuration:

- Site URL: https://prototipo-wiki-ten.vercel.app
- Redirect URLs: https://prototipo-wiki-ten.vercel.app/cuenta

La confirmación de correo está habilitada. Mantenerla habilitada. Verificar estas URLs antes de presentar el registro y la recuperación. Para desarrollo, añadir solo las URLs localhost que se utilicen.

## Verificación

- npm test: inventario de sprites, búsqueda de notas y validación de destinos push.
- npm run build: aplicación y service worker de producción.
- node scripts/check-cloud.mjs: prueba real de Auth, GET/POST/PATCH/DELETE y aislamiento. Crea cuentas temporales de prueba y las elimina al terminar; requiere las variables de servidor en .env.local.
- node scripts/check-cloud.mjs --keep-one: prepara una cuenta desechable para la prueba de navegador, guardada fuera del repositorio en work/cloud-test.json.
- node scripts/check-browser.cjs: instalación, offline, imágenes, notas, sincronización, perfil y pantallas. Requiere un servidor preview en 4174 y la cuenta anterior; usa Edge instalado. PWA_TEST_URL permite probar otro origen. PWA_BROWSER permite elegir otro canal compatible.

GitHub Actions ejecuta npm ci, npm test y npm run build en main/develop. Las pruebas con credenciales no se ejecutan en CI.

## Gitflow

feature/* → develop → release/* → main, etiqueta de versión y fusión de la release de vuelta a develop. Vercel publica main. No trabajar sobre prototipo-wiki: aquel repositorio fue la fuente de la migración.

## Unity

Unity no se ha modificado. Lee docs/UNITY-HANDOFF.md para integrar posteriormente el mismo servicio de cuentas y los resultados. Consulta docs/DEMOSTRACION.md para presentar la PWA.
