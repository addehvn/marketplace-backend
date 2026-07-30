const request=require('supertest');
const app=require('../../app');

describe('updating products ',()=>{


  test('updating product successfully',async()=>{
    const loginResponse= await request(app)
    .post('/users/login')
    .send({
      email:"test@gmail.com",
      password:"Test1234!"
    });
    
    const token = loginResponse.body.token;

    const response= await request(app)
    .patch('/products/updateProducts/58')
    .set('Authorization',`Bearer ${token}`)
    .send({
      title:'test1234'
    });

    expect(response.statusCode).toBe(200);
  });
  

  test("updating another user's product",async ()=>{
    const loginResponse=await request(app)
    .post('/users/login')
    .send({
      email:'admin@gmail.com',
      password:'Admin1234!'

    });
    const token =loginResponse.body.token;

    const response=await request(app)
    .patch('/products/updateProducts/58')
    .set('Authorization',`Bearer ${token}`)
    .send({
      title:"test6",
    price:"200.00",
    description:"Testtesttest333"
    });
    expect(response.statusCode).toBe(403)
  });


  test('updating without login ',async ()=>{
    const response= await request(app)
    .patch('/products/updateProducts/58')
    .send({
      title:"test6",
    price:"200.00",
    description:"Testtesttest32223"
    })
    expect(response.statusCode).toBe(401)
  });
   
  
  test('updating with wrong information',async ()=>{
    const loginResponse=await request(app)
    .post('/users/login')
    .send({
      email:'test@gmail.com',
      password:'Test1234!'
    });
    
    const token = loginResponse.body.token;

    const response= await request(app)
    .patch('/products/updateProducts/58')
    .set('Authorization',`Bearer ${token}`)
    .send({
      price:"2000.00"
    })
    expect(response.statusCode).toBe(400);
  });
  test("updating product's image successfully",async()=>{
    const loginResponse= await request(app)
    .post('/users/login')
    .send({
      email:"test@gmail.com",
      password:"Test1234!"
    });
    
    const token = loginResponse.body.token;

    const response= await request(app)
    .patch('/products/updateProducts/58')
    .set('Authorization',`Bearer ${token}`)
    .attach('image','test/image/alexander-startsev-ndNw_6QGR_c-unsplash 1.jpg');
  });
})