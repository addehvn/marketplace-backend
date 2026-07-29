const request= require('supertest');
const app=require('../../app');

describe('deleting product ',()=>{


  test('deleting product successfully ',async()=>{
    const loginResponse=await request(app)
    .post('/users/login')
    .send({
      email:'test@gmail.com',
      password:'Test1234!'
    });
    const token=loginResponse.body.token;

    const response=await request(app)
    .delete('/products/deleteProduct/29')
    .set('Authorization',`Bearer ${token}`)
    expect(response.statusCode).toBe(200);
  });


  test('deleting product from another user',async ()=>{
    const loginResponse=await request(app)
    .post('/users/login')
    .send({
      email:'admin@gmail.com',
      password:'Admin1234!'
    });
    const token=loginResponse.body.token;

    const response=await request(app)
    .delete('/products/deleteProduct/32')
    .set('Authorization',`Bearer ${token}`)
    expect(response.statusCode).toBe(403);
  });

  
   test('deleting product without login',async ()=>{
    const response=await request(app)
    .delete('/products/deleteProduct/33')
    
    expect(response.statusCode).toBe(401)
   });


})