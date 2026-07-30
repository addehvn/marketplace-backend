const request = require('supertest');

const app= require('../../app.js');

describe('admin users list ',()=>{
  test('show all users successfully',async()=>{
    const loginResponse = await request(app)
    .post('/admin/login')
    .send({
      email:'admin@gmail.com',
      password:'Admin1234!'
    });

    const token=loginResponse.body.token

    const response= await request(app)
    .get('/admin/users')
    .set('Authorization',`Bearer ${token}`)

    expect(response.statusCode).toBe(200)


  });

  test('trying to see all users without login',async ()=>{
    const response = await request(app)
    .get('/admin/users')

    expect(response.statusCode).toBe(401);
  });
  


  test('show  users with paging successfully',async()=>{

    const loginResponse= await request(app)
    .post('/admin/login')
    .send({
      email:"admin@gmail.com",
      password:"Admin1234!"
    });

   const token=loginResponse.body.token;

   const response= await request(app)
   .get('/admin/users')
   .set('Authorization',`Bearer ${token}`)
   .query({
      page:1
   });
    
   expect(response.statusCode).toBe(200)
  
  });


  test('show  users on the page that does not exists',async()=>{

    const loginResponse= await request(app)
    .post('/admin/login')
    .send({
      email:"admin@gmail.com",
      password:"Admin1234!"
    });

   const token=loginResponse.body.token;

   const response= await request(app)
   .get('/admin/users')
   .set('Authorization',`Bearer ${token}`)
   .query({
      page:2
   });
    
   expect(response.statusCode).toBe(404)
  
  });


});

describe('admin users update',()=>{

  test('updating user successfully',async()=>{
    const loginResponse= await request(app)
    .post('/admin/login')
    .send({
      email:'admin@gmail.com',
      password:'Admin1234!'

    })

    const token = loginResponse.body.token

    const response= await request(app)
    .patch('/admin/updateUser/51')
    .set("Authorization",`Bearer ${token}`)
    .send({
      phone_number:12334567
    });
    expect(response.statusCode).toBe(200);
  });

  test('updating user without login ',async()=>{

    const response= await request(app)
    .patch('/admin/updateUser/51')
    .send({
      phone_number:12334567
    });
    expect(response.statusCode).toBe(401);
  });

  test('updating user with wrong information',async()=>{
    const loginResponse= await request(app)
    .post('/admin/login')
    .send({
      email:'admin@gmail.com',
      password:'Admin1234!'

    })

    const token = loginResponse.body.token

    const response= await request(app)
    .patch('/admin/updateUser/51')
    .set("Authorization",`Bearer ${token}`)
    .send({
      phone_number:'abc'
    });
    expect(response.statusCode).toBe(400);
  });


  test("updating user's image " ,async()=>{
    const loginResponse= await request(app)
    .post('/admin/login')
    .send({
      email:'admin@gmail.com',
      password:'Admin1234!'

    })

    const token = loginResponse.body.token

    const response= await request(app)
    .patch('/admin/updateUser/51')
    .set('Authorization',`Bearer ${token}`)
    .attach('image','test/image/alexander-startsev-ndNw_6QGR_c-unsplash 1.jpg')
    expect(response.statusCode).toBe(200);
  });

  test('updating user does not exists',async()=>{
    const loginResponse= await request(app)
    .post('/admin/login')
    .send({
      email:'admin@gmail.com',
      password:'Admin1234!'

    })

    const token = loginResponse.body.token

    const response= await request(app)
    .patch('/admin/updateUser/1000')
    .set("Authorization",`Bearer ${token}`)
    .send({
      phone_number:12334567
    });
    expect(response.statusCode).toBe(404);
  });

});

describe('admin user search',()=>{
  test('searching user successfully',async ()=>{
    const loginResponse= await  request(app)
    .post('/admin/login')
    .send({
      email:"admin@gmail.com",
      password:"Admin1234!"

    });
    const token = loginResponse.body.token

    const response=await request(app)
    .get('/admin/searchUser')
    .set('Authorization',`Bearer ${token}`)
    .query({
      search:'test'
    });
    expect(response.statusCode).toBe(200)
  });


  test('searching user without login',async ()=>{
    const response=await request(app)
    .get('/admin/searchUser')
    .query({
      search:'test'
    });
    expect(response.statusCode).toBe(401)
  });

  test('searching user doesnt exists',async ()=>{
    const loginResponse= await  request(app)
    .post('/admin/login')
    .send({
      email:"admin@gmail.com",
      password:"Admin1234!"

    });
    const token = loginResponse.body.token

    const response=await request(app)
    .get('/admin/searchUser')
    .set('Authorization',`Bearer ${token}`)
    .query({
      search:'hello'
    });
    expect(response.statusCode).toBe(404)
  });

})