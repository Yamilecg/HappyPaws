const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Admin = require('../../models/AdminModel');
const app = require('../../app');

jest.mock('../../models/AdminModel');

describe('Admin Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  // Test 1: GET /admins - Get all admin users
  describe('GET /admins', () => {
    it('should return all admin users with status 200', async () => {
      // Mock data
      const mockAdmins = [
        {
          _id: '1',
          nombre: 'Juan Pérez',
          ocupacion: 'Gerente',
          domicilio: 'Calle Principal 123',
          telefono: '5551234567',
          edad: 35,
          fechaDeNacimiento: '1990-01-15'
        },
        {
          _id: '2',
          nombre: 'María López',
          ocupacion: 'Coordinadora',
          domicilio: 'Avenida Central 456',
          telefono: '5559876543',
          edad: 28,
          fechaDeNacimiento: '1997-08-22'
        }
      ];

      // Setup mock
      Admin.find.mockResolvedValue(mockAdmins);

      // Execute test
      const response = await request(app).get('/admins');

      // Assert response
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockAdmins);
      expect(Admin.find).toHaveBeenCalledTimes(1);
    });

    it('should return 500 when database query fails', async () => {
      // Setup mock to throw error
      Admin.find.mockRejectedValue(new Error('Database error'));

      // Execute test
      const response = await request(app).get('/admins');

      // Assert response
      expect(response.status).toBe(500);
      expect(response.text).toContain('No se pudieron obtener los usuarios admins');
      expect(Admin.find).toHaveBeenCalledTimes(1);
    });
  });

  // Test 2: GET /admins/:id - Get admin by ID
  describe('GET /admins/:id', () => {
    it('should return admin user when found with status 200', async () => {
      // Mock data
      const mockAdmin = {
        _id: '507f1f77bcf86cd799439011',
        nombre: 'Juan Pérez',
        ocupacion: 'Gerente',
        domicilio: 'Calle Principal 123',
        telefono: '5551234567',
        edad: 35,
        fechaDeNacimiento: '1990-01-15'
      };

      // Setup mock
      Admin.findOne.mockResolvedValue(mockAdmin);

      // Execute test
      const response = await request(app).get('/admins/507f1f77bcf86cd799439011');

      // Assert response
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockAdmin);
      expect(Admin.findOne).toHaveBeenCalledWith({ _id: '507f1f77bcf86cd799439011' });
    });

    it('should return 404 when admin user not found', async () => {
      // Setup mock to return null (user not found)
      Admin.findOne.mockResolvedValue(null);

      // Execute test
      const response = await request(app).get('/admins/nonexistentid');

      // Assert response
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ mensaje: 'Usuario no encontrado' });
      expect(Admin.findOne).toHaveBeenCalledWith({ _id: 'nonexistentid' });
    });

    it('should return 500 when database query fails', async () => {
      // Setup mock to throw error
      Admin.findOne.mockRejectedValue(new Error('Database error'));

      // Execute test
      const response = await request(app).get('/admins/errorid');

      // Assert response
      expect(response.status).toBe(500);
      expect(response.text).toContain('Error al obtener el usuario');
      expect(Admin.findOne).toHaveBeenCalledWith({ _id: 'errorid' });
    });
  });

  // Test 3: POST /admins - Create a new admin
  describe('POST /admins', () => {
    it('should create a new admin user with status 201', async () => {
      // Mock admin data to be sent
      const newAdminData = {
        nombre: 'Carlos Rodríguez',
        ocupacion: 'Supervisor',
        domicilio: 'Calle Norte 789',
        telefono: '5553216547',
        edad: 42,
        fechaDeNacimiento: '1983-04-10'
      };

      // Expected saved admin data
      const savedAdminData = {
        ...newAdminData,
        _id: '3'
      };

      // Mock admin instance methods
      const mockAdminInstance = {
        ...newAdminData,
        save: jest.fn().mockResolvedValue(savedAdminData)
      };

      // Mock the Admin constructor
      Admin.mockImplementation(() => mockAdminInstance);

      // Execute test
      const response = await request(app)
        .post('/admins')
        .send(newAdminData);

      // Assert response
      expect(response.status).toBe(201);
      expect(response.body).toEqual(savedAdminData);
      expect(mockAdminInstance.save).toHaveBeenCalledTimes(1);
    });

    it('should return 400 when validation fails', async () => {
      // Mock admin data with missing required fields
      const invalidAdminData = {
        nombre: 'Carlos Rodríguez'
        // Missing other required fields
      };

      // Mock save to throw validation error
      const mockAdminInstance = {
        ...invalidAdminData,
        save: jest.fn().mockRejectedValue(new Error('Validation error'))
      };

      // Mock the Admin constructor
      Admin.mockImplementation(() => mockAdminInstance);

      // Execute test
      const response = await request(app)
        .post('/admins')
        .send(invalidAdminData);

      // Assert response
      expect(response.status).toBe(400);
      expect(mockAdminInstance.save).toHaveBeenCalledTimes(1);
    });

    it('should handle duplicate key errors', async () => {
      // Mock admin data 
      const adminData = {
        nombre: 'Carlos Rodríguez',
        ocupacion: 'Supervisor',
        domicilio: 'Calle Norte 789',
        telefono: '5553216547',
        edad: 42,
        fechaDeNacimiento: '1983-04-10'
      };

      // Create a MongoDB duplicate key error
      const duplicateError = new Error('Duplicate key error');
      duplicateError.name = 'MongoError';
      duplicateError.code = 11000; // MongoDB duplicate key error code

      // Mock save to throw duplicate key error
      const mockAdminInstance = {
        ...adminData,
        save: jest.fn().mockRejectedValue(duplicateError)
      };

      // Mock the Admin constructor
      Admin.mockImplementation(() => mockAdminInstance);

      // Execute test
      const response = await request(app)
        .post('/admins')
        .send(adminData);

      // Assert response
      expect(response.status).toBe(400);
      expect(mockAdminInstance.save).toHaveBeenCalledTimes(1);
    });
  });
});