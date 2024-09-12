const request = require('supertest');
const express = require('express');
const app = require('../src/server/app.js'); 

describe('API Tests', () => {
  it('should return trip data for a valid city', async () => {
    const response = await request(app)
      .post('/api/trip')
      .send({ city: 'London' })
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('weather');
    expect(response.body).toHaveProperty('imageUrl');
  });

  it('should return 404 for an invalid city', async () => {
    const response = await request(app)
      .post('/api/trip')
      .send({ city: 'InvalidCity' })
      .expect('Content-Type', /json/)
      .expect(404);

    expect(response.body).toHaveProperty('error', 'Location not found');
  });

  it('should handle server errors gracefully', async () => {
    
    process.env.GEONAMES_USERNAME = ''; 
    const response = await request(app)
      .post('/api/trip')
      .send({ city: 'London' })
      .expect('Content-Type', /json/)
      .expect(500);

    expect(response.body).toHaveProperty('error', 'Server error occurred');
  });
});
