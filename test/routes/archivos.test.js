const request = require('supertest');
const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const app = express();

// Importa las rutas
const uploadRouter = require('../../routes/archivos'); // Actualiza esta ruta a tu archivo real

// Configura el middleware de la API de Express
app.use(uploadRouter);

describe('POST /upload', () => {
  it('should upload a file and return the file path', async () => {
    // Crea un archivo temporal para simular la subida
    const filePath = path.join(__dirname, 'testFile.txt');
    fs.writeFileSync(filePath, 'Hello World'); // Crear un archivo de texto simple

    const response = await request(app)
      .post('/upload')
      .attach('archivo', filePath) // Este nombre debe coincidir con el nombre del campo en el formulario
      .expect(200);

    // Esperamos que la respuesta sea el nombre del archivo
    expect(response.text).toBe('testFile.txt');

    // Elimina el archivo temporal después de la prueba
    fs.unlinkSync(filePath);
  });
});

afterAll(() => {
  // Eliminar la carpeta de destino y los archivos después de las pruebas si es necesario
  const directoryPath = path.join(__dirname, 'assets', 'img', 'uploadedDogs');

  // Verifica si el directorio existe antes de intentar eliminarlo
  if (fs.existsSync(directoryPath)) {
    fs.rmSync(directoryPath, { recursive: true, force: true }); // Usamos fs.rmSync en lugar de rmdirSync
  }
});

