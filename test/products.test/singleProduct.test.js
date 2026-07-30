const request= require('supertest');
const app= require('../../app.js');

describe('testing single product',()=>{
  test('successfully recives single product',async()=>{
    const response= await request(app)
    .get('/products/60')
    expect(response.statusCode).toBe(200)
  });
  test('product doesnt exists ',async()=>{
    const response= await request(app)
    .get('/products/1111')
    expect(response.statusCode).toBe(404);
  });
})