const request= require('supertest');
const app= require('../../app');

describe('all products', ()=>{
  test('showing all products successfully',async ()=>{
    const response =await request(app)
    .get('/products/')
    expect(response.statusCode).toBe(200);
  });

})