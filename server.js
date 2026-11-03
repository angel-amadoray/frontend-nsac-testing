const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Sirve los archivos estáticos generados por Vite
app.use(express.static(path.join(__dirname, 'dist')));

// Redirige todas las rutas a index.html para el SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Frontend server listening on port ${port}`);
});