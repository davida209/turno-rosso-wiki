# Turno Rosso PWA

Guía instalable con personajes giratorios, mecánicas ilustradas y reportes de la guía y del juego.

[Producción](https://prototipo-wiki-ten.vercel.app).

## Reportes

En Reportes puedes describir un problema de la guía o una situación del juego. Cada mecánica incluye un enlace que rellena la sección del formulario. Mis reportes permite consultar el estado, editar el contenido y retirar un reporte. Editar el contenido devuelve su estado a Nuevo para que se revise la versión actual.

Los reportes se vinculan a una cookie privada del navegador. Cambiar de navegador o borrar las cookies impide recuperar su acceso. El servicio de reportes requiere conexión. La guía, los personajes y sus imágenes están disponibles offline después de la primera descarga.

## Bandeja privada

Abre [Revisión de reportes](https://prototipo-wiki-ten.vercel.app/revision) o usa Ajustes → Panel de revisión. La bandeja lista reportes de ambos orígenes y permite filtrar y actualizar sus estados.

La clave se configura en Vercel como REPORT_ADMIN_KEY, variable exclusiva del servidor. Se envía en la cabecera Authorization y permanece en memoria mientras la bandeja está abierta. Mantén la clave fuera del repositorio y del código público.

## API

/api/reports admite GET, POST, PATCH y DELETE. PATCH y DELETE reciben el parámetro id. Las operaciones del visitante se limitan a su navegador. GET y PATCH con admin=1 requieren la clave de revisión. PATCH de revisión solo modifica el estado.

Vercel suministra SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY mediante la integración. La tabla wiki_reports tiene RLS y permisos de acceso solo para service_role. La migración está en supabase/migrations.

## Desarrollo

Node.js 22.12 o superior. Usa npm ci y npm run dev para la interfaz, y vercel dev con las variables del servidor para la API. npm test verifica los recursos. npm run build genera el sitio y el service worker. Puedes instalar la PWA y probar una notificación desde Ajustes.

Gitflow usa ramas feature, develop, release y main. Vercel publica main.
