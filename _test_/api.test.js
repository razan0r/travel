const request = require('supertest');
const app = require('../src/server/index.js'); 

describe('API tests', () => {
    it('should respond with index.html on GET /', async () => {
        const response = await request(app)
            .get('/')
            .expect('Content-Type', /html/)
            .expect(200);

        expect(response.text).toContain('<form id="trip">');
        expect(response.text).toContain('<label for="city">City:</label>');
    });
});
