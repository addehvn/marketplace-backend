const request = require ('supertest');
const app = require('../../app');

describe('admin testing',()=>{

  test('login successfully ',async()=>{
    const response = await request(app)
    .post('/admin/login')
    .send({
      email:'admin@gmail.com',
      password:'Admin1234!'
    });
    
    expect(response.statusCode).toBe(200)
  });

  test('entring wrong information for login',async ()=>{
    const response = await request(app)
    .post('/admin/login')
    .send({
      email:'admmmin@gmail.com',
      password:'test1234!'
    });
    expect(response.statusCode).toBe(403);
  });
  
})