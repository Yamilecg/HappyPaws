const express = require('express');
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../app');
const User = require('../../models/UserModel');


const mongoConnection = "mongodb+srv://arlynlinette:H1B1OG0FD5ZSJQpp@cluster0.x77irwc.mongodb.net/";

beforeAll(async () => {
  // Set up the database connection before tests start
  await mongoose.connect(mongoConnection, { useNewUrlParser: true, useUnifiedTopology: true });

  // Create a test user
  const testUser = new User({
    nombre: 'John',
    apellidos: 'Doe',
    correo: 'john.doe@example.com',
    contra: User.prototype.encriptarContra('password123'),
    perrosDadosEnAdopcion: ['Buddy', 'Max'],
    verificado: true,
  });
  await testUser.save();
});

afterAll(async () => {
  // Clean up: Remove test data and close the database connection
  await User.deleteMany({});
  await mongoose.disconnect();
});

describe('User Authentication Tests', () => {

  test('should authenticate user with valid credentials', async () => {
    const correo = 'john.doe@example.com';
    const contra = 'password123';

    const response = await request(app).get(`/users/${correo}/${contra}`);
    
    expect(response.status).toBe(200);
    expect(response.body.correo).toBe(correo);
    expect(response.body.nombre).toBe('John');
    expect(response.body.apellidos).toBe('Doe');
    expect(response.body.perrosDadosEnAdopcion).toEqual(['Buddy', 'Max']);
    expect(response.body.verificado).toBe(true);
  });

  test('should return 404 for non-existing user', async () => {
    const correo = 'nonexistent.user@example.com';
    const contra = 'password123';

    const response = await request(app).get(`/users/${correo}/${contra}`);
    
    expect(response.status).toBe(404);
    expect(response.body.mensaje).toBe('Usuario no encontrado');
  });

  test('should return 401 for incorrect password', async () => {
    const correo = 'john.doe@example.com';
    const contra = 'wrongpassword';

    const response = await request(app).get(`/users/${correo}/${contra}`);
    
    expect(response.status).toBe(401);
    expect(response.body.mensaje).toBe('Usuario y contras no coinciden');
  });

});

