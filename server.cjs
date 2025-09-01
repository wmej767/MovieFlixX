require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// ⚠️ Ruta al nuevo disco E:
const MEDIA_DIR = 'F:/Movies';

// Estas carpetas están en localhost
const POSTER_DIR = path.join(__dirname, 'posters');
const BG_DIR     = path.join(__dirname, 'backgrounds');

app.use(cors({
  origin: 'http://localhost:8080', // Cambia este si usas otro puerto
  methods: ['GET', 'POST'],
  credentials: true
}));

// Sirve videos desde el disco E:
app.use('/movies', express.static(MEDIA_DIR));

// Sirve imágenes locales
app.use('/posters', express.static(POSTER_DIR));
app.use('/backgrounds', express.static(BG_DIR));

// Endpoint opcional para listar los archivos de video disponibles
app.get('/api/videos', (_, res) => {
  fs.readdir(MEDIA_DIR, (err, files) => {
    if (err) return res.status(500).json({ error: 'Error leyendo carpeta de videos' });
    const videos = files.filter(file => ['.mp4', '.mkv', '.avi'].includes(path.extname(file).toLowerCase()));
    res.json(videos);
  });
});

// Streaming con soporte para Range (necesario para reproducir video)
app.get('/play/:file', (req, res) => {
  const fileName = req.params.file;
  const filePath = path.join(MEDIA_DIR, fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Archivo no encontrado');
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
    const start = parseInt(startStr, 10);
    const end = endStr ? parseInt(endStr, 10) : fileSize - 1;
    const chunkSize = (end - start) + 1;

    const fileStream = fs.createReadStream(filePath, { start, end });
    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4'
    });
    fileStream.pipe(res);
  } else {
    res.writeHead(200, {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4'
    });
    fs.createReadStream(filePath).pipe(res);
  }
});

app.listen(PORT, () => {
  console.log(`🎬 Servidor de medios corriendo en http://localhost:${PORT}`);
  console.log(`📂 Películas desde: ${MEDIA_DIR}`);
  console.log(`🖼️ Posters desde: ./posters`);
  console.log(`🌄 Fondos desde: ./backgrounds`);
});
