const path = require('path');
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

describe('POST /upload - File Upload', () => {
    test('should connect to MongoDB', async () => {
    const db = mongoose.connection;

        await new Promise((resolve, reject) => {
        db.once('connected', () => {
            console.log("Conectado a la base exitosamente");
            console.log(mongoose.connection.readyState);
            resolve();
        });
        db.once('error', reject);
        });

        expect(mongoose.connection.readyState).toBe(1);
});

});
