const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const User = require('../../models/UserModel'); // Adjust path if needed

jest.mock('../../models/UserModel');
const app = require('../../app');



describe('User Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  // Test 1: GET /users - Get all users
  describe('GET /users', () => {
    it('should return all users with status 200', async () => {
      // Mock data
      const mockUsers = [
        { 
          _id: '1', 
          nombre: 'Juan', 
          apellidos: 'Perez', 
          correo: 'juan@test.com',
          contra: 'hashedpassword',
          perrosDadosEnAdopcion: [],
          verificado: true
        },
        { 
          _id: '2', 
          nombre: 'Maria', 
          apellidos: 'Lopez', 
          correo: 'maria@test.com',
          contra: 'hashedpassword',
          perrosDadosEnAdopcion: ['dog1'],
          verificado: false
        }
      ];

      // Setup mock
      User.find.mockResolvedValue(mockUsers);

      // Execute test
      const response = await request(app).get('/users');

      // Assert response
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsers);
      expect(User.find).toHaveBeenCalledTimes(1);
    });

    it('should return 500 when database query fails', async () => {
      // Setup mock to throw error
      User.find.mockRejectedValue(new Error('Database error'));

      // Execute test
      const response = await request(app).get('/users');

      // Assert response
      expect(response.status).toBe(500);
      expect(response.text).toContain('No se pudieron obtener los usuarios');
      expect(User.find).toHaveBeenCalledTimes(1);
    });
  });

  // Test 2: GET /users/:correo - Get user by email
  describe('GET /users/:correo', () => {
    it('should return user when found with status 200', async () => {
      // Mock data
      const mockUser = {
        _id: '1', 
        nombre: 'Juan', 
        apellidos: 'Perez', 
        correo: 'juan@test.com',
        contra: 'hashedpassword',
        perrosDadosEnAdopcion: [],
        verificado: true
      };

      // Setup mock
      User.findOne.mockResolvedValue(mockUser);

      // Execute test
      const response = await request(app).get('/users/juan@test.com');

      // Assert response
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
      expect(User.findOne).toHaveBeenCalledWith({ correo: 'juan@test.com' });
    });

    it('should return 404 when user not found', async () => {
      // Setup mock to return null (user not found)
      User.findOne.mockResolvedValue(null);

      // Execute test
      const response = await request(app).get('/users/nonexistent@test.com');

      // Assert response
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ mensaje: 'Usuario no encontrado' });
      expect(User.findOne).toHaveBeenCalledWith({ correo: 'nonexistent@test.com' });
    });

    it('should return 500 when database query fails', async () => {
      // Setup mock to throw error
      User.findOne.mockRejectedValue(new Error('Database error'));

      // Execute test
      const response = await request(app).get('/users/error@test.com');

      // Assert response
      expect(response.status).toBe(500);
      expect(response.text).toContain('Error al obtener el usuario');
      expect(User.findOne).toHaveBeenCalledWith({ correo: 'error@test.com' });
    });
  });

  // Test 3: GET /users/:correo/:contra - Authenticate user
  describe('GET /users/:correo/:contra', () => {
    it('should return user when credentials are correct with status 200', async () => {
      // Mock data
      const mockUser = {
        _id: '1', 
        nombre: 'Juan', 
        apellidos: 'Perez', 
        correo: 'juan@test.com',
        contra: 'hashedpassword',
        perrosDadosEnAdopcion: [],
        verificado: true,
      };

      // Setup mock
      User.findOne.mockResolvedValue(mockUser);

      // Execute test
      const response = await request(app).get('/users/juan@test.com/password123');

      // Assert response
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
      expect(User.findOne).toHaveBeenCalledWith({ correo: 'juan@test.com' });
      expect(mockUser.compararContra).toHaveBeenCalledWith('password123');
    });

    it('should return 404 when user not found', async () => {
      // Setup mock to return null (user not found)
      User.findOne.mockResolvedValue(null);

      // Execute test
      const response = await request(app).get('/users/nonexistent@test.com/password123');

      // Assert response
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ mensaje: 'Usuario no encontrado' });
      expect(User.findOne).toHaveBeenCalledWith({ correo: 'nonexistent@test.com' });
    });

    it('should return 500 when password is incorrect', async () => {
      // Mock data with incorrect password
      const mockUser = {
        _id: '1', 
        nombre: 'Juan', 
        apellidos: 'Perez', 
        correo: 'juan@test.com',
        contra: 'hashedpassword',
        perrosDadosEnAdopcion: [],
        verificado: true,
        compararContra: jest.fn().mockReturnValue(false) // Password comparison fails
      };

      // Setup mock
      User.findOne.mockResolvedValue(mockUser);

      // Execute test
      const response = await request(app).get('/users/juan@test.com/wrongpassword');

      // Assert response
      expect(response.status).toBe(500);
      expect(response.text).toBe('Usuario y contras no coinciden');
      expect(User.findOne).toHaveBeenCalledWith({ correo: 'juan@test.com' });
      expect(mockUser.compararContra).toHaveBeenCalledWith('wrongpassword');
    });

    it('should return 500 when database query fails', async () => {
      // Setup mock to throw error
      User.findOne.mockRejectedValue(new Error('Database error'));

      // Execute test
      const response = await request(app).get('/users/error@test.com/password123');

      // Assert response
      expect(response.status).toBe(500);
      expect(response.text).toContain('Error al obtener el usuario');
      expect(User.findOne).toHaveBeenCalledWith({ correo: 'error@test.com' });
    });
  });

  // Test 4: POST /users - Create a new user
  describe('POST /users', () => {
    it('should create a new user with status 201', async () => {
      // Mock user data to be sent
      const newUserData = {
        nombre: 'Pedro',
        apellidos: 'Garcia',
        correo: 'pedro@test.com',
        contra: 'password123',
        perrosDadosEnAdopcion: [],
        verificado: false
      };

      // Mock user instance methods
      const mockEncryptedPassword = 'hashedpassword123';
      const mockUserInstance = {
        ...newUserData,
        encriptarContra: jest.fn().mockReturnValue(mockEncryptedPassword),
        save: jest.fn().mockResolvedValue({
          ...newUserData,
          _id: '3',
          contra: mockEncryptedPassword
        })
      };

      // Mock the User constructor
      User.mockImplementation(() => mockUserInstance);

      // Execute test
      const response = await request(app)
        .post('/users')
        .send(newUserData);

      // Assert response
      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        ...newUserData,
        _id: '3',
        contra: mockEncryptedPassword
      });
      expect(mockUserInstance.encriptarContra).toHaveBeenCalledWith('password123');
      expect(mockUserInstance.save).toHaveBeenCalledTimes(1);
    });

    it('should return 400 when validation fails', async () => {
      // Mock user data to be sent (missing required fields)
      const invalidUserData = {
        nombre: 'Pedro',
        // Missing other required fields
      };

      // Mock save to throw validation error
      const mockUserInstance = {
        ...invalidUserData,
        encriptarContra: jest.fn().mockReturnValue('hashedpassword'),
        save: jest.fn().mockRejectedValue(new Error('Validation error'))
      };

      // Mock the User constructor
      User.mockImplementation(() => mockUserInstance);

      // Execute test
      const response = await request(app)
        .post('/users')
        .send(invalidUserData);

      // Assert response
      expect(response.status).toBe(400);
      expect(mockUserInstance.save).toHaveBeenCalledTimes(1);
    });
  });

  // Test 5: PUT /users/:correo - Update user verification status
  describe('PUT /users/:correo', () => {
    it('should update user verification status to true with status 200', async () => {
      // Mock updated user data
      const updatedUser = {
        _id: '1',
        nombre: 'Juan',
        apellidos: 'Perez',
        correo: 'juan@test.com',
        contra: 'hashedpassword',
        perrosDadosEnAdopcion: [],
        verificado: true
      };

      // Setup mock
      User.findOneAndUpdate.mockResolvedValue(updatedUser);

      // Execute test
      const response = await request(app).put('/users/juan@test.com');

      // Assert response
      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedUser);
      expect(User.findOneAndUpdate).toHaveBeenCalledWith(
        { correo: 'juan@test.com' },
        { $set: { verificado: true } },
        { new: true }
      );
    });

    it('should return 404 when user not found', async () => {
      // Setup mock to return null (user not found)
      User.findOneAndUpdate.mockResolvedValue(null);

      // Execute test
      const response = await request(app).put('/users/nonexistent@test.com');

      // Assert response
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ mensaje: 'Usuario no encontrado' });
      expect(User.findOneAndUpdate).toHaveBeenCalledWith(
        { correo: 'nonexistent@test.com' },
        { $set: { verificado: true } },
        { new: true }
      );
    });

    it('should return 500 when database update fails', async () => {
      // Setup mock to throw error
      User.findOneAndUpdate.mockRejectedValue(new Error('Database error'));

      // Execute test
      const response = await request(app).put('/users/error@test.com');

      // Assert response
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Database error' });
      expect(User.findOneAndUpdate).toHaveBeenCalledWith(
        { correo: 'error@test.com' },
        { $set: { verificado: true } },
        { new: true }
      );
    });
  });

  // Test 6: PUT /users/updateList/:correo - Update user's dogs list
  describe('PUT /users/updateList/:correo', () => {
    it('should update user dogs list with status 200', async () => {
      // Mock updated user data
      const updatedUser = {
        _id: '1',
        nombre: 'Juan',
        apellidos: 'Perez',
        correo: 'juan@test.com',
        contra: 'hashedpassword',
        perrosDadosEnAdopcion: ['dog1', 'dog2'],
        verificado: true
      };

      // New dogs list to be sent
      const newDogsList = ['dog1', 'dog2'];

      // Setup mock
      User.findOneAndUpdate.mockResolvedValue(updatedUser);

      // Execute test
      const response = await request(app)
        .put('/users/updateList/juan@test.com')
        .send({ perrosDadosEnAdopcion: newDogsList });

      // Assert response
      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedUser);
      expect(User.findOneAndUpdate).toHaveBeenCalledWith(
        { correo: 'juan@test.com' },
        { perrosDadosEnAdopcion: newDogsList },
        { new: true }
      );
    });

    it('should return 404 when user not found', async () => {
      // New dogs list to be sent
      const newDogsList = ['dog1', 'dog2'];

      // Setup mock to return null (user not found)
      User.findOneAndUpdate.mockResolvedValue(null);

      // Execute test
      const response = await request(app)
        .put('/users/updateList/nonexistent@test.com')
        .send({ perrosDadosEnAdopcion: newDogsList });

      // Assert response
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ mensaje: 'Usuario no encontrado' });
      expect(User.findOneAndUpdate).toHaveBeenCalledWith(
        { correo: 'nonexistent@test.com' },
        { perrosDadosEnAdopcion: newDogsList },
        { new: true }
      );
    });

    it('should return 500 when database update fails', async () => {
      // New dogs list to be sent
      const newDogsList = ['dog1', 'dog2'];

      // Setup mock to throw error
      User.findOneAndUpdate.mockRejectedValue(new Error('Database error'));

      // Execute test
      const response = await request(app)
        .put('/users/updateList/error@test.com')
        .send({ perrosDadosEnAdopcion: newDogsList });

      // Assert response
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ mensaje: 'Error interno del servidor' });
      expect(User.findOneAndUpdate).toHaveBeenCalledWith(
        { correo: 'error@test.com' },
        { perrosDadosEnAdopcion: newDogsList },
        { new: true }
      );
    });
  });
});