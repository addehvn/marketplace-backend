const request= require ('supertest');
const app= require('../../app');


describe('deleting user',()=>{
  test('delete user successfully',async ()=>{
    const loginResponse = await request(app)
    .post('/users/login')
    .send({
      email:'test4@gmail.com',
      password:'Test1234!'
    });
    const token=loginResponse.body.token

    const response=await request(app)
    .delete('/users/delete/49')
    .set('Authorization',`Bearer ${token}`)

    expect(response.statusCode).toBe(200);
    
  });

  test('delete another user',async()=>{
      const loginResponse=await request(app)
      .post('/users/login')
      .send({
        email:'test@gmail.com',
        password:'Test1234!'
      });

    const token=loginResponse.body.token;

    const response=await request(app)
    .delete('/users/delete/51')
    .set('Authorization',`Bearer ${token}`);

    expect(response.statusCode).toBe(403)
  });

  test('delete user does not exists',async()=>{
    const loginResponse=await request(app)
    .post('/users/login')
    .send({
      email:'test4@gmail.com',
      password:'Test1234!'
    });
    const token =loginResponse.body.token 
    const response =await  request(app)
    .delete('/users/delete/1000')
    .set('Authorization',` Bearer ${token}`)

    expect(response.statusCode).toBe(401)
     
  })
});