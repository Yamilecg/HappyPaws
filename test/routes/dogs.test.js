const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const Dog = require('../../models/DogModel');
const app = require('../../app');

// Mock dependencies
jest.mock('../../models/DogModel');
jest.mock('../../database', () => {
  return {
    collection: jest.fn().mockReturnValue({
      findOne: jest.fn(),
      deleteOne: jest.fn()
    })
  };
});

// Get the mock collection
const db = require('../../database');
const mockCollection = db.collection('dogs');

// Mock ObjectId.isValid function
jest.mock('mongoose', () => {
  const originalModule = jest.requireActual('mongoose');
  return {
    ...originalModule,
    Types: {
      ObjectId: {
        isValid: jest.fn(),
        prototype: {
          constructor: jest.fn()
        }
      }
    }
  };
});

describe('Dog Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Set default mock for ObjectId.isValid
    ObjectId.isValid.mockImplementation(() => true);
    // Mock the ObjectId constructor
    global.ObjectId = jest.fn((id) => ({
      toString: () => id
    }));
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  // Test 1: GET /dogs - Get all dogs
  describe('GET /dogs', () => {
    it('should return all dogs with status 200', async () => {
      // Mock data
      const mockDogs = [
        {
          _id: '1',
          nombre: 'Max',
          edad: 3,
          raza: 'Labrador',
          color: 'Negro',
          energia: 'Alta',
          historialMedico: 'Vacunado',
          problemasSalud: 'Ninguno',
          medicamentos: 'Ninguno',
          descripcion: 'Perro amigable',
          imagen: 'url_imagen.jpg',
          direccion: 'Calle Principal',
          telefono: '1234567890',
          correo: 'dueño@example.com'
        },
        {
          _id: '2',
          nombre: 'Luna',
          edad: 2,
          raza: 'Beagle',
          color: 'Tricolor',
          energia: 'Media',
          historialMedico: 'Vacunada',
          problemasSalud: 'Ninguno',
          medicamentos: 'Ninguno',
          descripcion: 'Perrita juguetona',
          imagen: 'url_imagen.jpg',
          direccion: 'Calle Secundaria',
          telefono: '0987654321',
          correo: 'dueño2@example.com'
        }
      ];

      // Setup mock
      Dog.find.mockResolvedValue(mockDogs);

      // Execute test
      const response = await request(app).get('/dogs');

      // Assert response
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockDogs);
      expect(Dog.find).toHaveBeenCalledTimes(1);
    });

    it('should return 500 when database query fails', async () => {
      // Setup mock to throw error
      Dog.find.mockRejectedValue(new Error('Database error'));

      // Execute test
      const response = await request(app).get('/dogs');

      // Assert response
      expect(response.status).toBe(500);
      expect(response.text).toBe('No se pudieron obtener los perritos');
      expect(Dog.find).toHaveBeenCalledTimes(1);
    });
  });

  // Test 2: GET /dogs/:nombre - Get dog by name
  describe('GET /dogs/:nombre', () => {
    it('should return dog when found with status 200', async () => {
      // Mock data
      const mockDog = {
        _id: '1',
        nombre: 'Max',
        edad: 3,
        raza: 'Labrador',
        color: 'Negro',
        energia: 'Alta',
        historialMedico: 'Vacunado',
        problemasSalud: 'Ninguno',
        medicamentos: 'Ninguno',
        descripcion: 'Perro amigable',
        imagen: 'url_imagen.jpg',
        direccion: 'Calle Principal',
        telefono: '1234567890',
        correo: 'dueño@example.com'
      };

      // Setup mock
      Dog.findOne.mockResolvedValue(mockDog);

      // Execute test
      const response = await request(app).get('/dogs/Max');

      // Assert response
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockDog);
      expect(Dog.findOne).toHaveBeenCalledWith({ nombre: 'Max' });
    });

    it('should return 404 when dog not found', async () => {
      // Setup mock to return null (dog not found)
      Dog.findOne.mockResolvedValue(null);

      // Execute test
      const response = await request(app).get('/dogs/PerroInexistente');

      // Assert response
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ mensaje: 'Perro no encontrado' });
      expect(Dog.findOne).toHaveBeenCalledWith({ nombre: 'PerroInexistente' });
    });

    it('should return 500 when database query fails', async () => {
      // Setup mock to throw error
      Dog.findOne.mockRejectedValue(new Error('Database error'));

      // Execute test
      const response = await request(app).get('/dogs/ErrorPerro');

      // Assert response
      expect(response.status).toBe(500);
      expect(response.text).toContain('No se pudo obtener el perro');
      expect(Dog.findOne).toHaveBeenCalledWith({ nombre: 'ErrorPerro' });
    });
  });

  // Test 3: GET /dogs/id/:id - Get dog by ID
  describe('GET /dogs/id/:id', () => {
    it('should return dog when found with status 200', async () => {
      // Mock data
      const mockDog = {
        _id: '507f1f77bcf86cd799439011',
        nombre: 'Max',
        edad: 3,
        raza: 'Labrador'
      };

      // Setup mock for collection.findOne with callback
      mockCollection.findOne.mockImplementation((query, callback) => {
        callback(null, mockDog);
      });

      // Execute test
      const response = await request(app).get('/dogs/id/507f1f77bcf86cd799439011');

      // Assert response
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockDog);
      expect(mockCollection.findOne).toHaveBeenCalled();
      expect(ObjectId.isValid).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    it('should return 400 when ID is invalid', async () => {
      // Mock ObjectId.isValid to return false
      ObjectId.isValid.mockReturnValue(false);

      // Execute test
      const response = await request(app).get('/dogs/id/invalid-id');

      // Assert response
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Id no válido' });
      expect(ObjectId.isValid).toHaveBeenCalledWith('invalid-id');
      expect(mockCollection.findOne).not.toHaveBeenCalled();
    });

    it('should handle database error correctly', async () => {
      // Setup mock for collection.findOne with error
      mockCollection.findOne.mockImplementation((query, callback) => {
        callback(new Error('Database error'), null);
      });

      // Mock console.error to avoid polluting test output
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      // Execute test
      const response = await request(app).get('/dogs/id/507f1f77bcf86cd799439011');

      // Assert console.error was called
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error en la busqueda del perro:", expect.any(Error));
      
      // Clean up spy
      consoleErrorSpy.mockRestore();
    });
  });

  // Test 4: DELETE /dogs/id/:id - Delete dog by ID
  describe('DELETE /dogs/id/:id', () => {
    it('should delete dog and return success with status 200', async () => {
      // Setup mock for collection.deleteOne with successful deletion
      mockCollection.deleteOne.mockImplementation((query, callback) => {
        callback(null, { deletedCount: 1 });
      });

      // Execute test
      const response = await request(app).delete('/dogs/id/507f1f77bcf86cd799439011');

      // Assert response
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ mensaje: 'Perro eliminado correctamente' });
      expect(mockCollection.deleteOne).toHaveBeenCalled();
      expect(ObjectId.isValid).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    it('should return 400 when ID is invalid', async () => {
      // Mock ObjectId.isValid to return false
      ObjectId.isValid.mockReturnValue(false);

      // Execute test
      const response = await request(app).delete('/dogs/id/invalid-id');

      // Assert response
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Id no válido' });
      expect(ObjectId.isValid).toHaveBeenCalledWith('invalid-id');
      expect(mockCollection.deleteOne).not.toHaveBeenCalled();
    });

    it('should return 404 when dog not found', async () => {
      // Setup mock for collection.deleteOne with no deletion
      mockCollection.deleteOne.mockImplementation((query, callback) => {
        callback(null, { deletedCount: 0 });
      });

      // Execute test
      const response = await request(app).delete('/dogs/id/507f1f77bcf86cd799439011');

      // Assert response
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Perro no encontrado' });
      expect(mockCollection.deleteOne).toHaveBeenCalled();
    });

    it('should return 500 when database deletion fails', async () => {
      // Setup mock for collection.deleteOne with error
      mockCollection.deleteOne.mockImplementation((query, callback) => {
        callback(new Error('Database error'), null);
      });

      // Execute test
      const response = await request(app).delete('/dogs/id/507f1f77bcf86cd799439011');

      // Assert response
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Error interno del servidor' });
      expect(mockCollection.deleteOne).toHaveBeenCalled();
    });
  });

  // Test 5: POST /dogs - Create a new dog
  describe('POST /dogs', () => {
    it('should create a new dog with status 200', async () => {
      // Mock dog data to be sent
      const newDogData = {
        nombre: 'Rocky',
        edad: 1,
        raza: 'Bulldog',
        color: 'Marrón',
        energia: 'Media',
        historialMedico: 'Vacunado',
        problemasSalud: 'Ninguno',
        medicamentos: 'Ninguno',
        descripcion: 'Perro tranquilo',
        imagen: 'url_imagen.jpg',
        direccion: 'Calle Nueva',
        telefono: '5555555555',
        correo: 'dueño3@example.com'
      };

      // Expected saved dog data
      const savedDogData = {
        ...newDogData,
        _id: '3'
      };

      // Mock dog instance methods
      const mockDogInstance = {
        ...newDogData,
        save: jest.fn().mockResolvedValue(savedDogData)
      };

      // Mock the Dog constructor
      Dog.mockImplementation(() => mockDogInstance);

      // Execute test
      const response = await request(app)
        .post('/dogs')
        .send(newDogData);

      // Assert response
      expect(response.status).toBe(200);
      expect(response.body).toEqual(savedDogData);
      expect(mockDogInstance.save).toHaveBeenCalledTimes(1);
    });

    it('should return 400 when validation fails', async () => {
      // Mock dog data with missing required fields
      const invalidDogData = {
        nombre: 'Rocky'
        // Missing other required fields
      };

      // Mock save to throw validation error
      const mockDogInstance = {
        ...invalidDogData,
        save: jest.fn().mockRejectedValue(new Error('Validation error'))
      };

      // Mock the Dog constructor
      Dog.mockImplementation(() => mockDogInstance);

      // Execute test
      const response = await request(app)
        .post('/dogs')
        .send(invalidDogData);

      // Assert response
      expect(response.status).toBe(400);
      expect(mockDogInstance.save).toHaveBeenCalledTimes(1);
    });
  });
});