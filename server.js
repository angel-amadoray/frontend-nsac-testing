// server.js (ESM, Express 5 compatible)
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// 1. Archivos estáticos generados por Vite (JS, CSS, imágenes, fuentes)
app.use(express.static(path.join(__dirname, 'dist')));

// 2. Fallback SPA: cualquier ruta que no haya matcheado un archivo
//    estático recibe index.html para que React Router maneje el routing.
//    Usamos app.use() (no app.get('*')) porque Express 5 cambió la
//    sintaxis de wildcards y este patrón funciona en ambas versiones.
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Frontend server listening on port ${port}`);
});