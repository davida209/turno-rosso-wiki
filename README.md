# Turno Rosso Wiki

App complementaria de Turno Rosso, basada en el contenido visible de la wiki original: una tienda durante el turno de noche. El encargado repone anaqueles, limpia, cobra y protege la caja ante el ladrón. Los clientes y la auditoría del dueño afectan la reputación y el balance.

## Funcionalidades

- Inicio con la portada original y una lista de objetivos persistente.
- Guía de seis mecánicas: reposición, limpieza, caja, ladrón, reputación y auditoría.
- Búsqueda de mecánicas, guías guardadas y notas personales.
- Encargado, ladrón, clientes y dueño, con enlaces a sus mecánicas.
- Marcador con registros de muestra y resultados locales de práctica.
- Evaluación de cinco decisiones del turno con revisión de respuestas.
- Reinicio de datos locales.

## Desarrollo

Requiere Node.js 22.12 o superior.

```bash
npm ci
npm run dev
npm test
npm run build
```

Puedes abrir INICIAR-DEMO.cmd para instalar las dependencias si faltan e iniciar Vite.

## Recorrido de prueba

1. En Inicio, marca un objetivo y recarga para comprobar su persistencia.
2. Abre Mecánicas y busca reputación.
3. Lee una guía, guárdala y escribe una nota del turno.
4. Explora los cuatro personajes.
5. Completa Practicar un turno y revisa el resultado en Marcador.

La práctica otorga 250 puntos por respuesta correcta. Cuatro o cinco aciertos se clasifican como Ganó. Es una evaluación de conocimiento, no una partida del juego.

## Persistencia

Usa localStorage con la clave les-rosso-v2. Los datos no se sincronizan con el juego ni entre dispositivos. Los registros iniciales del marcador están identificados como ejemplos. El marcador no representa una clasificación global real. Usa Reiniciar mis datos para restaurar la demo.

## Identidad y recursos

Azul marino, rojo Rosso, amarillo y crema. Bebas Neue e IBM Plex Sans se incluyen localmente en public/fonts, con licencias OFL. La portada procede de la wiki original y el sprite del encargado procede de los recursos locales de Lester David. Consulta CREDITOS.md.

## Git y Vercel

Sube esta carpeta a su propio repositorio vacío.

```bash
git init -b main
git add .
git commit -m "feat: add Turno Rosso wiki"
git remote add origin URL_DE_TU_REPOSITORIO
git push -u origin main
```

Para conservar https://prototipo-wiki-ten.vercel.app/, conecta el nuevo repositorio al mismo proyecto de Vercel. Usa Vite, npm ci, npm run build y salida dist. vercel.json resuelve las rutas /inicio, /mecanicas, /marcador y /personajes. La navegación interna también usa fragmentos para permitir la recarga local.

No incluye el juego ejecutable ni un backend. Los archivos del sitio anterior son una referencia de contenido y arte, no una recuperación de su repositorio.
