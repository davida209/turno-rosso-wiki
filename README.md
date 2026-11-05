# Turno Rosso Wiki

Requiere Node.js. Ejecuta npm install y npm run dev desde esta carpeta.
Abre http://localhost:5173/personajes.

Se incluyen seis personajes originales en src/assets/personajes, sin depender de OneDrive.
Selecciona un personaje y arrastra horizontalmente para girarlo. También puedes usar los botones, las flechas del teclado al enfocar el visor o el giro automático. El botón Ver caminar reproduce sus pasos.
El visor usa las cuatro vistas reales de los sprites 2D: frente, izquierda, espalda y derecha.

Verificación: compilación correcta; 24 vistas, carga de imágenes, caminata, teclado, arrastre y giro automático comprobados en Edge a 390 px, sin errores de JavaScript.

## Gitflow

main contiene las versiones publicadas en Vercel. develop reúne las integraciones. Los cambios se preparan en feature/* y las versiones en release/*. Cada release se fusiona a main y develop, y se etiqueta con su versión.

La versión 1.1.0 integra la aplicación completa de davida209/prototipo-wiki: páginas, sprites, visor de personajes, mecánicas ilustradas, paleta y mockups. No incluye enlaces al portafolio. Los puntajes del marcador siguen siendo datos de ejemplo.

Para validar: npm test y npm run build. Vercel usa npm ci y sirve dist; vercel.json permite abrir directamente /inicio, /personajes, /mecanicas y /marcador.
