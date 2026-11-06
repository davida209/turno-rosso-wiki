# Turno Rosso PWA

Guía instalable con personajes giratorios, mecánicas ilustradas y un simulador de decisiones.

Producción [Turno Rosso](https://prototipo-wiki-ten.vercel.app).

## Simular un turno

Elige un escenario y dos acciones en orden. El simulador muestra sus efectos en seguridad, ventas y satisfacción, y enlaza las mecánicas relacionadas. Puedes guardar un plan, abrirlo para editarlo, buscarlo o eliminarlo. Al elegir otro plan del mismo escenario, se comparan sus indicadores.

La guía y las simulaciones funcionan offline después de la primera descarga. Guardar, consultar y modificar los planes requiere conexión. La API vincula los planes a una cookie privada del navegador. Borrarla o cambiar de navegador impide recuperar los planes anteriores.

Desde Ajustes puedes instalar la PWA y enviar una notificación de prueba.

## API

La función de Vercel en /api/plans admite GET para listar, POST para crear, PATCH para editar y DELETE para eliminar. PATCH y DELETE reciben el parámetro id. El servidor valida las dos decisiones, filtra cada operación por navegador y almacena los planes en Supabase. La tabla simulator_plans tiene RLS y solo permite acceso a service_role.

Vercel suministra SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY mediante su integración. Esas variables son exclusivas del servidor. La migración del simulador está en supabase/migrations.

## Desarrollo y pruebas

Node.js 22.12 o superior. Ejecuta npm ci y npm run dev para trabajar en la interfaz. Para probar la API, usa un despliegue de Vercel con Supabase conectado o vercel dev con las variables del servidor. npm test verifica los recursos y la lógica del simulador. npm run build genera el sitio y el service worker. Para verificar el modo offline local, sirve el resultado con npm run preview.

Gitflow usa ramas feature, develop, release y main. Los hotfix salen de main y se fusionan de vuelta a main y develop. Vercel publica main.
