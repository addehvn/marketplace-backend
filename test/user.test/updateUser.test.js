const request = require('supertest');
const app = require ('../../app.js');


describe('updating user infromation',()=>{
 
  test('successfully updating user ',async ()=>{
    const loginResponse = await request(app)
    .post('/users/login')
    .send({
      email:"test3@gmail.com",
      password:"Test1234!"
    });
    
    const token = loginResponse.body.token 

    const response = await request(app)
    .patch('/users/update/45')
    .set('Authorization',`Bearer ${token}`)
    .send({
      email:'test5@gmail.com'
    });
    expect(response.statusCode).toBe(200);
  });


  
  test('wrong information error',async()=>{
    const loginResponse = await request(app)
    .post('/users/login')
    .send({
      email:'test5@gmail.com',
      password:'Test1234!'
    });


    const token = loginResponse.body.token

    const response= await request(app)
    .patch('/users/update/45')
    .set('Authorization',`Bearer ${token}`)
    .send({
      email:'testtesttesetgmil.com'
    });
    expect(response.statusCode).toBe(400);
  });


  test('updating without login  ',async()=>{
    const response =await request(app)
    .patch('/users/update/27')
    .send({
      email:'test2@gmail.com'
    });
    expect(response.statusCode).toBe(401);
  });


  test('updating another user ',async ()=>{
    const loginResponse=await request(app)
    .post('/users/login')
    .send({
      email:'test@gmail.com',
      password:'Test1234!'
    });
    const token =  loginResponse.body.token

    const response=await request(app)
    .patch('/users/update/27')
    .set('Authorization',`Bearer ${token}`)
    .send({
      email:'admin2@gmail.com'
    });

    expect(response.statusCode).toBe(403)
  })
})