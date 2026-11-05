# Validación de la release 1.2.0

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

Pendientes externos o que requieren dispositivo real:

1. URL Configuration de Supabase. Se verificó generando enlaces de recuperación para una cuenta temporal, sin enviar correos: tanto el enlace predeterminado como el solicitado para la PWA terminan en http://localhost:3000. Hay que cambiar Site URL y Redirect URLs por los indicados en README antes de considerar verificados el registro por correo y la recuperación. El conector disponible administra datos, pero no expone esta configuración; el panel requiere sesión de usuario.
2. Recepción real de un push con la PWA cerrada en cada plataforma objetivo. El servidor, suscripciones y cron están desplegados; probar en un dispositivo que pueda generar una suscripción real y permita notificaciones.
3. Unity: autenticación dentro del juego e ingesta/validación de partidas. No forman parte de esta entrega de PWA; ver UNITY-HANDOFF.md.

La protección adicional contra contraseñas filtradas aparece desactivada en el proveedor. No se cambió la configuración de autenticación sin acceso al panel. Referencia: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection
