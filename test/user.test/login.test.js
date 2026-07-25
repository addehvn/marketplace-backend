const request = require ('supertest');
const app = require ('../../app.js');

describe('Testing user login ',()=>{
  
  test('user logges in sucessfully',async()=>{
    const response=await request(app)
    .post('/users/login')
    .send({
      email:'test@gmail.com',
      password:'Test1234!'
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
  
  test('wrong password error ',async()=>{
    const response=await request(app)
  .post('/users/login')
    .send({
      email:'test@gmail.com',
      password:'Test12'
    });


  expect(response.statusCode).toBe(401)
    });

    test('user does not exists error',async()=>{
      const response = await request(app)
      .post('/users/login')
      .send({
        email:'test123@gmail.com',
        password:'testtest123'
      })
       expect(response.statusCode).toBe(401)
    });
});
   
  