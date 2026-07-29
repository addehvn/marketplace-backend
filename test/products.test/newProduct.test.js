const request=require('supertest');
const app=require('../../app');


describe('new product',()=>{
  test('creating new Product successfully',async()=>{
  const loginResponse=await request(app)
  .post('/users/login')
  .send({
    email:'test@gmail.com',
    password:'Test1234!'
  })
  const token=loginResponse.body.token

  const response = await request(app)
  .post('/products/newProduct')
  .set('Authorization',`Bearer ${token}`)
  .send({
      title:"test3",
      price:"200.00",
      description:"Testtesttest23"
  })
  expect(response.statusCode).toBe(201);
});

test('user not logged in',async ()=>{
  const response= await request(app)
  .post('/products/newProduct')
  .send({
    title:"test4",
    price:"200.00",
    description:"Testtesttest23"
  });
  expect(response.statusCode).toBe(401);
});

test('creating new product with image',async()=>{
  const loginResponse=await request(app)
  .post('/users/login')
  .send({
    email:'test@gmail.com',
    password:'Test1234!'
  });
  const token = loginResponse.body.token

  const response=await request(app)
  .post('/products/newProduct')
  .set('Authorization',`Bearer ${token}`)
  .field('title','test')
  .field('price','200.00')
  .field('description','testtesttesttest')
  .attach('image','test/image/alexander-startsev-ndNw_6QGR_c-unsplash 1.jpg')
  expect(response.statusCode).toBe(201)
});
})


