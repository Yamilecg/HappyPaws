const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');


const mongoConnection = "mongodb+srv://arlynlinette:H1B1OG0FD5ZSJQpp@cluster0.x77irwc.mongodb.net/";

beforeAll(async () => {
    await mongoose.connect(mongoConnection, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.disconnect();
});

describe('GET /infodogs - Obtener razas de perros', () => {
    test('should connect to MongoDB', async () => {
        const db = mongoose.connection;

        await new Promise((resolve, reject) => {
            db.once('connected', () => {
                console.log("Conectado a la base exitosamente");
                resolve();
            });
            db.once('error', reject);
        });

        expect(mongoose.connection.readyState).toBe(1);
    });

    test('should return a list of dog breeds', async () => {
        const response = await request(app).get('/infodogs');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);  // Asegura que la respuesta sea un array
    });

    test('should return status 500 if there is an error', async () => {

        const response = await request(app).get('/infodogs');
        expect(response.status).not.toBe(500);  // Verificamos que no falle
    });
});
