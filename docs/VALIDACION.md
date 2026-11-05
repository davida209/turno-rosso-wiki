# Validación de las releases 1.2.0 y 1.2.1

Pruebas completadas:

- 9 pruebas automatizadas de recursos, búsqueda y seguridad de destinos push.
- Compilación de producción con service worker y manifiesto válido.
- Navegación offline, imágenes de mecánicas y las 24 vistas de personajes.
- Notificación local registrada por el navegador con permiso concedido.
- Auth real con cuentas temporales de prueba confirmadas mediante administración, eliminadas tras las pruebas.
- GET/POST/PATCH/DELETE reales de notas en Supabase.
- Aislamiento entre usuarios y rechazo de acceso anónimo a notas.
- Rechazo de escrituras de puntuaciones desde el cliente.
- Exclusión del ranking de partidas offline y actualización de agregados mediante triggers.
- Inicio de sesión, perfil, importación de invitado, borradores y sincronización offline/online en navegador.
- Diseño a 320, 390 y 1440 px, sin errores de JavaScript.
- Funciones desplegadas de suscripciones y recordatorios: autenticación, validación, preferencias y cron protegido. Las pruebas sintéticas no enviaron push a proveedores externos.
- Comprobación de que las claves privadas no aparecen en el bundle.

Configuración de autenticación resuelta en 1.2.1:

- Site URL: https://prototipo-wiki-ten.vercel.app
- Única Redirect URL autorizada: https://prototipo-wiki-ten.vercel.app/cuenta
- Verificados enlaces reales de confirmación de registro y recuperación, consumo del enlace, cambio de contraseña de una cuenta desechable e inicio de sesión posterior. Los enlaces se generaron mediante administración sin enviar correos.
- Verificado que una redirección externa no autorizada vuelve a la URL pública.
- Cuenta temporal eliminada tras la prueba. La entrega efectiva de correo debe probarse con el buzón del usuario.

Pendientes que requieren dispositivo real o el trabajo posterior de Unity:

1. Recepción real de un push con la PWA cerrada en cada plataforma objetivo. El servidor, suscripciones y cron están desplegados; probar en un dispositivo que pueda generar una suscripción real y permita notificaciones.
2. Unity: autenticación dentro del juego e ingesta/validación de partidas. No forman parte de esta entrega de PWA; ver UNITY-HANDOFF.md.

La protección adicional contra contraseñas filtradas aparece desactivada en el proveedor. No se desactivó la confirmación de correo ni se amplió la lista de redirecciones con comodines. Referencia: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection
