const request = require('supertest');
const express = require('express');
const path = require('path');
const fs = require('fs');
const uploadRouter = require('../../routes/archivos'); // Ajusta esta ruta al nombre de tu archivo

// Mock de multer para pruebas
jest.mock('multer', () => {
  const multerMock = {
    diskStorage: jest.fn().mockReturnValue({}),
    single: jest.fn().mockImplementation(fieldName => {
      return (req, res, next) => {
        // Simulamos el comportamiento de multer.single
        if (req.body && req.body._test_file_upload === 'error') {
          return next();
        }
        
        req.file = {
          originalname: req.body._test_filename || 'test-image.jpg',
          path: path.join(__dirname, 'assets/img/uploadedDogs/test-image.jpg'),
          filename: req.body._test_filename || 'test-image.jpg'
        };
        next();
      };
    })
  };
  
  return jest.fn().mockImplementation(() => multerMock);
});

describe('Upload Router Tests', () => {
  let app;
  
  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/api', uploadRouter);
    
    // Aseguramos que exista el directorio de destino para las pruebas
    const uploadDir = path.join(__dirname, 'assets/img/uploadedDogs');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('debería subir un archivo correctamente', async () => {
    const response = await request(app)
      .post('/api/upload')
      .field('_test_filename', 'perro.jpg')
      .attach('archivo', Buffer.from('contenido de prueba'), 'perro.jpg');
      
    expect(response.status).toBe(200);
    expect(response.text).toBe('perro.jpg');
  });
  
  test('debería devolver error 400 si no se proporciona un archivo', async () => {
    const response = await request(app)
      .post('/api/upload')
      .field('_test_file_upload', 'error');
      
    expect(response.status).toBe(400);
    expect(response.text).toBe('No file uploaded.');
  });
  
  test('debería manejar nombres de archivo correctamente', async () => {
    const nombreArchivo = 'test-especial-ñ-chars.png';
    
    const response = await request(app)
      .post('/api/upload')
      .field('_test_filename', nombreArchivo)
      .attach('archivo', Buffer.from('contenido de prueba'), nombreArchivo);
      
    expect(response.status).toBe(200);
    expect(response.text).toBe(nombreArchivo);
  });
});