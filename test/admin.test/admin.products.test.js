const request=require('supertest');
const app= require('../../app.js');

describe('admin products lists ',()=>{
  test('show all products successfully',async()=>{
    const loginResponse= await request(app)
    .post('/admin/login')
    .send({
      email:"admin@gmail.com",
      password:"Admin1234!"
    });
    
    const token = loginResponse.body.token

    const response=await request(app)
    .get('/admin/products')
    .set('Authorization',`Bearer ${token}`)
    
    expect(response.statusCode).toBe(200);
  });


  test('show all products withot login',async()=>{
    const response=await request(app)
    .get('/admin/products')
    expect(response.statusCode).toBe(401);
  });



  test('show all products with paging successfully',async ()=>{
    const loginResponse= await request(app)
    .post('/admin/login')
    .send({
      email:"admin@gmail.com",
      password:"Admin1234!"
    });

    const token= loginResponse.body.token
    
    const response= await request(app)
    .get('/admin/products')
    .set('Authorization',`Bearer ${token}`)
    .query({
      page:1
    });

    expect(response.statusCode).toBe(200);
  });

  
  test('showing products on the page that does not exist',async ()=>{
    const loginResponse= await request(app)
    .post('/admin/login')
    .send({
      email:"admin@gmail.com",
      password:"Admin1234!"
    });

    const token= loginResponse.body.token
    
    const response= await request(app)
    .get('/admin/products')
    .set('Authorization',`Bearer ${token}`)
    .query({
      page:11
    });

    expect(response.statusCode).toBe(404);
  });


});

describe('admin product update',()=>{

  test('update product successfully',async()=>{

    const loginResponse=await request(app)
    .post('/admin/login')
    .send({
      email:'admin@gmail.com',
      password:'Admin1234!'
    });

    const token = loginResponse.body.token

    const response = await request(app)
    .patch('/admin/updateProduct/44')
    .set('Authorization',`Bearer ${token}`)
    .send({
      description:'description has been changed'
    });

    expect(response.statusCode).toBe(200);

  });


  test('update product doesnt exists',async()=>{

    const loginResponse=await request(app)
    .post('/admin/login')
    .send({
      email:'admin@gmail.com',
      password:'Admin1234!'
    });

    const token = loginResponse.body.token

    const response = await request(app)
    .patch('/admin/updateProduct/10000')
    .set('Authorization',`Bearer ${token}`)
    .send({
      description:'description has been changed'
    });

    expect(response.statusCode).toBe(404);

  });



  test('update product without login',async()=>{

    const response = await request(app)
    .patch('/admin/updateProduct/44')
    .send({
      description:'description has been changed'
    });
    expect(response.statusCode).toBe(401);
  });

  
  test('update product with wrong information',async()=>{

    const loginResponse=await request(app)
    .post('/admin/login')
    .send({
      email:'admin@gmail.com',
      password:'Admin1234!'
    });

    const token = loginResponse.body.token

    const response = await request(app)
    .patch('/admin/updateProduct/44')
    .set('Authorization',`Bearer ${token}`)
    .send({
      price:'abc'
    });

    expect(response.statusCode).toBe(400);

  });


  test("update product's image ",async()=>{

    const loginResponse=await request(app)
    .post('/admin/login')
    .send({
      email:'admin@gmail.com',
      password:'Admin1234!'
    });

    const token = loginResponse.body.token

    const response = await request(app)
    .patch('/admin/updateProduct/44')
    .set('Authorization',`Bearer ${token}`)
    .attach('image','test/image/alexander-startsev-ndNw_6QGR_c-unsplash 1.jpg');

    expect(response.statusCode).toBe(200);

  });



});

describe('admin product search',()=>{
  test('search product successfully',async ()=>{

    const loginResponse=await request(app)
    .post('/admin/login')
    .send({
      email:'admin@gmail.com',
      password:'Admin1234!'
    });

    const token =loginResponse.body.token

    const response=await request(app)
    .get('/admin/searchProduct')
    .set('Authorization',`Bearer ${token}`)
    .query({
      search:'test'
    });

    expect(response.statusCode).toBe(200);

  });

  test('search product without login',async ()=>{

    const response=await request(app)
    .get('/admin/searchProduct')
    .query({
      search:'test'
    });

    expect(response.statusCode).toBe(401);

  });

  test('search product doesnt exists',async ()=>{

    const loginResponse=await request(app)
    .post('/admin/login')
    .send({
      email:'admin@gmail.com',
      password:'Admin1234!'
    });

    const token =loginResponse.body.token

    const response=await request(app)
    .get('/admin/searchProduct')
    .set('Authorization',`Bearer ${token}`)
    .query({
      search:'phone'
    });

    expect(response.statusCode).toBe(404);

  });

});