const { Router } = require('express');
const multer = require('multer');
const router = Router();
const path = require('path');
const fs = require('fs');

// Aseguramos que el directorio de destino exista
const uploadDir = './assets/img/uploadedDogs';
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (err) {
  console.error(`Error al crear el directorio de subidas: ${err.message}`);
}

// Configuración mejorada de multer
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    // Genera un nombre de archivo único para evitar sobrescribir archivos existentes
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const filename = path.basename(file.originalname, extension) + '-' + uniqueSuffix + extension;
    cb(null, filename);
  }
});

// Filtro de archivos - solo permite imágenes
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no soportado. Solo se permiten imágenes (JPEG, PNG, GIF)'), false);
  }
};

// Límites para prevenir abusos
const limits = {
  fileSize: 5 * 1024 * 1024, // 5MB máximo
};

// Instanciamos multer con la configuración mejorada
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: limits
});

// Middleware para manejar errores de multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Errores específicos de multer
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'El archivo es demasiado grande. Máximo 5MB.' });
    }
    return res.status(400).json({ error: `Error en la subida: ${err.message}` });
  } else if (err) {
    // Otros errores
    return res.status(400).json({ error: err.message });
  }
  next();
};

// Ruta para subir archivos con mejor manejo de errores
router.post('/upload', (req, res, next) => {
  upload.single('archivo')(req, res, (err) => {
    if (err) {
      return handleMulterError(err, req, res, next);
    }
    
    // Verificamos si se subió un archivo
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó ningún archivo' });
    }
    
    try {
      const { filename, originalname } = req.file;
      // Creamos la ruta relativa para acceder al archivo
      const rutaFinal = path.join('assets/img/uploadedDogs', filename);
      
      // Respondemos con información útil
      res.status(200).json({
        originalname,
        filename,
        path: rutaFinal
      });
    } catch (error) {
      console.error('Error al procesar archivo:', error);
      res.status(500).json({ error: 'Error al procesar el archivo subido' });
    }
  });
});

// Ruta adicional para eliminar archivos (opcional)
router.delete('/upload/:filename', (req, res) => {
  const filename = req.params.filename;
  // Verificar que el filename no contenga caracteres peligrosos
  if (filename.includes('..') || filename.includes('/')) {
    return res.status(400).json({ error: 'Nombre de archivo no válido' });
  }
  
  const filePath = path.join(uploadDir, filename);
  
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }
    
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Error al eliminar archivo ${filename}:`, err);
        return res.status(500).json({ error: 'Error al eliminar el archivo' });
      }
      res.status(200).json({ message: 'Archivo eliminado correctamente' });
    });
  });
});

module.exports = router;