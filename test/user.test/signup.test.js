const request= require('supertest');
const app=require ('../../app');

describe("user sign up test",()=>{
  test('user sign up sucessfully ',async ()=>{
    const response=await request(app)
  .post('/users/signup')
  .send({
     username:'testtest2',
    first_name:'test',
    last_name:'test',
    email:'test5@gmail.com',
    password:'Test1234!',
    phone_number:'12345677'
     
  });
  expect(response.statusCode).toBe(200);
  });
  test('user sign up with wrong information',async()=>{

    const response=await request(app)
  .post('/users/signup')
  .send({
     username:'test',
    first_name:'test',
    last_name:'test',
    email:'test2gmail.com',
    password:'Test1234!',
    phone_number:'12345678'
     
  });
  expect(response.statusCode).toBe(400)

  });

  });


  
 
  
