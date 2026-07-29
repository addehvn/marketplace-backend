const request=require('supertest');
const app=require('../../app');

describe('searching product',()=>{
  test('searching successfully',async()=>{
    const response= await request(app)
    .get('/products/search')
    .query({
      search:'test'
    })
    
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);

  });
  test('search product does not exists',async()=>{
    const response = await request(app)
    .get('/products/search')
    .query({
      search:'phone'
    });
    expect(response.statusCode).toBe(404);
  });
});