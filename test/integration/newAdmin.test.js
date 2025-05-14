const express = require('express');
const Admin = require('../../models/AdminModel');
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../app');

const mongoConnection = "mongodb+srv://arlynlinette:H1B1OG0FD5ZSJQpp@cluster0.x77irwc.mongodb.net/";

beforeAll(async () => {
  // Set up the database connection before tests start
  await mongoose.connect(mongoConnection, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  // Close the connection after all tests are done
  await mongoose.disconnect();
});

describe('Database and API Tests', () => {

  test('should connect to MongoDB', async () => {
    const db = mongoose.connection;
    
    // This should log once the connection is established
    db.on('connected', () => {
      console.log("Conectado a la base exitosamente");
      console.log(mongoose.connection.readyState); 
    });

    // Wait for the connection to complete
    await new Promise((resolve, reject) => {
      db.on('connected', resolve);
      db.on('error', reject);
    });

    // Ensure connection state is 1 (connected)
    expect(mongoose.connection.readyState).toBe(1);
  });

  test('should create a new admin user with status 201', async () => {
    const newAdminData = {
      nombre: "New Admin",
      domicilio: "Some address",
      edad: 30,
      fechaDeNacimiento: "1991-05-15",
      ocupacion: "Manager",
      telefono: "123456789",
    };

    const response = await request(app).post('/admins').send(newAdminData);
    expect(response.status).toBe(201);
    expect(response.body.nombre).toBe(newAdminData.nombre);
    expect(response.body.domicilio).toBe(newAdminData.domicilio);
    expect(response.body.edad).toBe(newAdminData.edad);
    expect(response.body.fechaDeNacimiento).toBe(newAdminData.fechaDeNacimiento);
    expect(response.body.ocupacion).toBe(newAdminData.ocupacion);
    expect(response.body.telefono).toBe(newAdminData.telefono);
  });

});

