# Demostración de la PWA

1. Abrir la portada, mostrar el logotipo y entrar como invitado.
2. Navegar por Mecánicas y Personajes; girar, arrastrar y reproducir caminata.
3. En Mi cuenta, instalar la PWA. Esperar el indicador Lista sin conexión.
4. Desconectar internet y abrir la guía y los sprites. Crear una nota y guardar un borrador; recargar y comprobar que persisten.
5. Volver a internet. Registrar una cuenta y confirmar el correo (las URLs de Auth deben estar configuradas), o entrar con una cuenta de demostración propia.
6. Importar las notas de invitado. Mostrar en la pestaña Network del navegador las llamadas reales a PostgREST: POST al crear, GET al consultar, PATCH al editar y DELETE al eliminar.
7. Buscar y filtrar notas. Editar offline y volver a internet para mostrar la sincronización.
8. Usar otra cuenta y comprobar que no puede ver las notas privadas anteriores.
9. Mostrar el marcador de solo lectura y sus filtros. Explicar que no se inventan puntos: estará vacío hasta integrar Unity y validar las partidas. Las estadísticas indican los resultados mostrados, no un total ilimitado.
10. Solicitar notificaciones mediante el botón, enviar una prueba local y, con cuenta, activar push y enviar una prueba de servidor. En un dispositivo real compatible, cerrar la PWA y recibir un recordatorio diario previamente activado.

El navegador y la cuenta de prueba deben tener acceso al servicio. La entrega de correos depende de la configuración y los límites del proveedor; la prueba de notificaciones debe realizarse con permiso concedido. Una notificación local no demuestra por sí sola push con la app cerrada.

## Cobertura de rúbrica

- Portada: nombre, logotipo e identidad visual.
- Inicio y navegación: portada, inicio, personajes, mecánicas, marcador, bitácora y cuenta.
- API externa: Supabase Auth + Data REST API, datos reales y estados de carga/error.
- CRUD: notas personales con GET/POST/PATCH/DELETE reales y RLS por propietario.
- Funciones adicionales: búsquedas, filtros y consultas ordenadas del ranking; estadísticas sobre filas mostradas.
- Dispositivo: Service Worker Notifications API, Web Push opcional, almacenamiento persistente de notas/borradores e instalación PWA.
- Diseño: estilos adaptables, foco visible, controles accesibles, fuentes e imágenes locales.
- Presentación: este guion y pruebas automatizadas. La evaluación final corresponde al docente.
