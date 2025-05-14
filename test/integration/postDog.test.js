const express = require('express');
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../app');
const Dog = require('../../models/DogModel');

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

  test('should create a new dog with status 200', async () => {
    const newDogData = {
      nombre: "Buddy",
      edad: 3,
      raza: "Golden Retriever",
      color: "Gold",
      energia: 5,
      historialMedico: ["No previous illnesses"],  // Array for historialMedico
      problemasSalud: ["None"],  // Array for problemasSalud
      medicamentos: "None",
      descripcion: "Friendly and playful",
      imagen: "image_url",
      direccion: "123 Dog St.",
      telefono: "9876543210",
      correo: "buddy@example.com"
    };
  
    const response = await request(app).post('/dogs').send(newDogData);
    console.log(response.body);  // Log the response body for debugging
  
    expect(response.status).toBe(200);  // Check if the status is 200 (OK)
    expect(response.body.nombre).toBe(newDogData.nombre);
    expect(response.body.edad).toBe(newDogData.edad);
    expect(response.body.raza).toBe(newDogData.raza);
    expect(response.body.color).toBe(newDogData.color);
    expect(response.body.energia).toBe(newDogData.energia);
    expect(response.body.historialMedico).toEqual(newDogData.historialMedico);  // Use toEqual for arrays
    expect(response.body.problemasSalud).toEqual(newDogData.problemasSalud);  // Same for problemasSalud
    expect(response.body.medicamentos).toBe(newDogData.medicamentos);
    expect(response.body.descripcion).toBe(newDogData.descripcion);
    expect(response.body.imagen).toBe(newDogData.imagen);
    expect(response.body.direccion).toBe(newDogData.direccion);
    expect(response.body.telefono).toBe(newDogData.telefono);
    expect(response.body.correo).toBe(newDogData.correo);
  });
});

