# Historial de versiones

## 1.1.0

- Integra la aplicación React de davida209/prototipo-wiki.
- Añade seis personajes con vistas de frente, espalda y perfiles, caminata, giro automático, arrastre y controles de teclado.
- Añade imágenes originales del juego a las seis mecánicas.
- Aplica la paleta del proyecto Unity a las páginas.
- Mantiene eliminados los enlaces al portafolio.
- Conserva la configuración de Vercel para rutas directas y GitHub Actions para pruebas y compilación.

Validación: siete pruebas de recursos; compilación de producción; 24 vistas y controles del visor; imágenes de mecánicas a 320, 390 y 1440 px.

## 1.2.0

- PWA instalable con manifiesto, iconos y service worker que precarga la guía y sprites.
- Fuentes locales y logotipo original.
- Cuenta compartida preparada con Supabase Auth y perfil propio.
- Bitácora con CRUD REST real, borradores, modo invitado, cola offline e importación explícita.
- Políticas RLS para perfiles y notas; resultados del juego sin permisos de escritura para clientes.
- Ranking e historial conectados a la API, búsquedas, filtros y estadísticas, sin datos ficticios.
- Notificaciones locales, suscripción Web Push y recordatorio diario mediante cron protegido.
- Contrato documentado para una futura integración de Unity; el juego no se modificó.

## 1.2.1

- Corrige Site URL y Redirect URLs de Supabase para devolver los correos de confirmación y recuperación a la PWA pública.
- Añade una prueba de enlaces reales de Auth, cambio de contraseña de cuenta temporal y rechazo de redirecciones no autorizadas.
- Actualiza la documentación para cerrar el pendiente de configuración de correos.
