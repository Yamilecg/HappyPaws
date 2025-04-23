const request = require('supertest');
const InfoDog = require('../../models/InfodogModel'); // Adjust path if needed
const app = require('../../app');

// Mock InfoDog model
jest.mock('../../models/InfodogModel');

describe('InfoDog Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  // Test 1: GET /infodogs - Get all dog guides
  describe('GET /infodogs', () => {
    it('should return all dog guides with status 200', async () => {
      // Mock data
      const mockDogGuides = [
        { 
          _id: '1', 
          raza: 'Labrador',
          caracteristicas: 'Amigable, enérgico',
          cuidados: 'Ejercicio diario, cepillado semanal',
          alimentacion: 'Comida balanceada, tres veces al día'
        },
        { 
          _id: '2', 
          raza: 'Chihuahua',
          caracteristicas: 'Pequeño, territorial',
          cuidados: 'Proteger del frío, cuidado dental',
          alimentacion: 'Porciones pequeñas, alimento para razas pequeñas'
        }
      ];

      // Setup mock
      InfoDog.find.mockResolvedValue(mockDogGuides);

      // Execute test
      const response = await request(app).get('/infodogs');

      // Assert response
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockDogGuides);
      expect(InfoDog.find).toHaveBeenCalledTimes(1);
    });

    it('should return 500 when database query fails', async () => {
      // Setup mock to throw error
      InfoDog.find.mockRejectedValue(new Error('Database error'));

      // Execute test
      const response = await request(app).get('/infodogs');

      // Assert response
      expect(response.status).toBe(500);
      expect(response.text).toContain('No se pudieron obtener las guias');
      expect(InfoDog.find).toHaveBeenCalledTimes(1);
    });
  });

  // Test 2: GET /infodogs/:raza - Get dog guide by breed
  describe('GET /infodogs/:raza', () => {
    it('should return dog guide when found with status 200', async () => {
      // Mock data
      const mockDogGuide = {
        _id: '1', 
        raza: 'Labrador',
        caracteristicas: 'Amigable, enérgico',
        cuidados: 'Ejercicio diario, cepillado semanal',
        alimentacion: 'Comida balanceada, tres veces al día'
      };

      // Setup mock
      InfoDog.findOne.mockResolvedValue(mockDogGuide);

      // Execute test
      const response = await request(app).get('/infodogs/Labrador');

      // Assert response
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockDogGuide);
      expect(InfoDog.findOne).toHaveBeenCalledWith({ raza: 'Labrador' });
    });

    it('should return 404 when dog guide not found', async () => {
      // Setup mock to return null (dog guide not found)
      InfoDog.findOne.mockResolvedValue(null);

      // Execute test
      const response = await request(app).get('/infodogs/RazaInexistente');

      // Assert response
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ mensaje: 'Guia de cuidado no encontrada' });
      expect(InfoDog.findOne).toHaveBeenCalledWith({ raza: 'RazaInexistente' });
    });

    it('should return 500 when database query fails', async () => {
      // Setup mock to throw error
      InfoDog.findOne.mockRejectedValue(new Error('Database error'));

      // Execute test
      const response = await request(app).get('/infodogs/ErrorRaza');

      // Assert response
      expect(response.status).toBe(500);
      expect(response.text).toContain('No se pudo obtener la informacion del perro');
      expect(InfoDog.findOne).toHaveBeenCalledWith({ raza: 'ErrorRaza' });
    });
  });
});