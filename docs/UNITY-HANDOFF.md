# Conectar Unity con Turno Rosso PWA

## Mensaje para el otro chat

Trabaja solo en la integración del juego Unity con la PWA de Turno Rosso, sin modificar la web ni desplegar cambios en ella. Antes de implementar, lee docs/UNITY-HANDOFF.md y supabase/001_pwa.sql del repositorio https://github.com/davida209/turno-rosso-wiki. La PWA está en https://prototipo-wiki-ten.vercel.app. Comparte Supabase Auth y el contrato de datos existente; no crees otra base ni otro sistema de cuentas. Respeta el modo invitado/offline y separa las partidas locales de las verificadas. Implementa con Gitflow y presenta las limitaciones reales de verificación. No incluyas claves privadas dentro del juego.

## Estado existente

- Solo se implementó la PWA. No hay cambios en el proyecto Unity.
- PWA: React + Vite, hospedada en Vercel.
- Supabase: proyecto dedicado turno-rosso-pwa, ref heiasvzrsfskpbrchpwu.
- URL pública del proveedor: https://heiasvzrsfskpbrchpwu.supabase.co
- La clave pública se obtiene de Supabase → Settings → API Keys, o de la variable pública VITE_SUPABASE_ANON_KEY del proyecto Vercel. La clave pública no sustituye las políticas RLS.
- Nunca usar SUPABASE_SERVICE_ROLE_KEY, SUPABASE_SECRET_KEY, POSTGRES_PASSWORD, JWT_SECRET, CRON_SECRET o VAPID_PRIVATE_KEY en Unity, builds WebGL, repositorios ni mensajes del cliente.
- Las cuentas se registran y confirman por correo. Las mismas credenciales sirven para el juego.

## Autenticación compartida

Usar el SDK oficial compatible con Unity elegido y verificado en ese chat, o HTTPS contra Supabase Auth:

- POST /auth/v1/token?grant_type=password: body email y password. Envía apikey con la clave pública.
- POST /auth/v1/token?grant_type=refresh_token: renovar sesión con refresh_token.
- GET /auth/v1/user: Authorization: Bearer access_token y apikey.
- POST /auth/v1/logout: cerrar sesión del juego según el alcance elegido.

No guardar contraseñas en PlayerPrefs. Guardar tokens usando almacenamiento seguro disponible para la plataforma, con estrategia de revocación/renovación. Nunca imprimir tokens o contraseñas en logs. Un fallo de red no debe impedir jugar localmente.

## Tablas existentes

profiles:
- id UUID = auth.users.id
- display_name texto 2–40 caracteres
- created_at

notes (CRUD exclusivo de la bitácora de la PWA):
- id UUID, user_id, title (1–100), body (0–4000), category, updated_at
- category: general, inventario, limpieza, seguridad, clientes
- Solo su propietario puede leer/escribir. Unity no necesita modificar esta tabla.

game_runs:
- id UUID: identificador único e idempotente de la partida
- user_id UUID
- score entero entre 0 y 100000000 (límite técnico, no prueba de legitimidad)
- result: won | lost
- duration_seconds entero 1–86400
- verification: pending | verified | offline | rejected
- game_version texto
- played_at fecha UTC

El cliente autenticado puede consultar solo sus game_runs, pero NO insertarlos, modificarlos ni borrarlos. No abrir permisos de escritura para simplificar la integración.

leaderboard (tabla de agregados pública de solo lectura, mantenida por triggers del servidor):
- player_id, display_name, best_score, played, wins
- Incluye únicamente game_runs con verification=verified.
- La PWA consulta GET /rest/v1/leaderboard y permite buscar/ordenar. El ranking no incluye emails.

## Partidas sin internet e invitado

El juego debe guardar localmente todas las partidas, incluso como invitado. Definir un formato versionado que incluya id UUID, puntuación, resultado, duración, versión y fecha UTC. Hacer la escritura local al terminar antes de cualquier intento de red. Conservar historial y mejor marca personal después de cerrar el juego.

Si el invitado crea una cuenta, ofrecer importar las partidas mediante una acción explícita. Estas partidas tendrán verification=offline; nunca convertirlas en verified al sincronizar. La PWA podrá mostrarlas en Mis partidas cuando el backend de ingesta esté implementado.

No usar el reloj local o la presencia de una cuenta como prueba de legitimidad. Gestionar envíos repetidos con la misma id sin duplicar registros. Reintentar cuando regrese internet y permitir conservar la copia local aunque falle la API.

## Backend de resultados: trabajo pendiente del chat del juego

Todavía NO existen rutas de ingesta del juego. La PWA no ha implementado ni simulado /api/game/start, /api/game/finish o /api/game/import-offline. No intentar llamarlas antes de crearlas. El ranking estará vacío hasta que exista una fuente válida de resultados.

Diseñar las rutas de ingesta en un backend autorizado, preferentemente mediante Supabase Edge Functions en este mismo proyecto, con un contrato versionado antes de tocar Unity. Esa función debe validar el JWT con Auth, derivar user_id del token y nunca confiar en user_id o verification recibidos en el body. La clave service_role solo permanece en el entorno del servidor.

Contrato propuesto para acordar e implementar (no disponible hoy):

1. POST game-session/start: requiere sesión online, genera partida/ticket con identificador, versión y tiempo del servidor. Si se pierde conexión, la partida debe degradarse a offline o pending según una regla explícita.
2. POST game-session/finish: recibe session_id y telemetría/resumen del resultado; valida ticket, propiedad, duración, duplicados, límites y versión. Asigna pending mientras no exista una validación suficiente.
3. POST game-session/import-offline: acepta historial local autenticado, valida formato y guarda siempre offline. Idempotencia por user_id + id de partida.

Las políticas y el SQL actuales impiden que cualquier usuario marque sus propios resultados como verified. Mantener esa propiedad. Un secreto incrustado en el ejecutable no es una solución anti-trampas. Si solo se comprueban rangos y duración, documentar que es validación básica y no una garantía de ranking íntegro. Para garantía fuerte se necesita validar los eventos o la simulación de manera autoritativa en el servidor.

Si hacen falta columnas nuevas o tablas de sesiones, añadir una migración nueva, mantener compatibilidad con las columnas consultadas por la PWA y coordinar el contrato antes de cambiarlo.

## Criterios de aceptación para Unity

- Se puede jugar sin cuenta y sin internet.
- Invitado conserva puntuaciones localmente.
- La misma cuenta inicia sesión en PWA y juego.
- No hay contraseñas ni claves privadas en PlayerPrefs/build/logs.
- Importar offline no altera el ranking competitivo.
- Envíos repetidos no duplican partidas.
- Una cuenta no puede escribir o validar resultados de otra.
- La PWA muestra las partidas propias con su etiqueta y el ranking solo refleja verified.
- Conservar el diseño, las mecánicas y las animaciones del juego existentes.
