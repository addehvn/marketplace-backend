const request = require('supertest');
const app=require('../../app.js');

describe('filtering products',()=>{
  test('successfully filtering maxPrice products',async ()=>{
    const response= await request(app)
    .get('/products/filter')
    .query({
      maxPrice:300.00
    });
    expect(response.statusCode).toBe(200);

  });


  test('successfully filtering minPrice products',async ()=>{
    const response= await request(app)
    .get('/products/filter')
    .query({
      minPrice:200.00
    });
    expect(response.statusCode).toBe(200);
  });


  test('filtering maxPrice to be lower than prices',async ()=>{

    const response = await request(app)
    .get('/products/filter')
    .query({
      maxPrice:100.00

    });
    expect(response.statusCode).toBe(404)
  })

  test('filtering minPrice to be higher than prices',async ()=>{

    const response = await request(app)
    .get('/products/filter')
    .query({
      minPrice:500.00

    });
    expect(response.statusCode).toBe(404)
  })


  test('filter maxPrice to be abc',async ()=>{

    const response = await request (app)
    .get('/products/filter')
    .query({
      maxPrice:'abc'
    });
    expect(response.statusCode).toBe(400);
  });


  test('filter minPrice to be abc',async ()=>{

    const response = await request (app)
    .get('/products/filter')
    .query({
      minPrice:'abc'
    });
    expect(response.statusCode).toBe(400);
  });


  test('successfully filtering minPrice products',async()=>{
    const response = await request(app)
    .get('/products/filter')
    .query({
      minPrice:'100.00'
    });

    expect(response.statusCode).toBe(200);
  });




  test('sorting products from low to high successfully ',async ()=>{

    const response = await request(app)
    .get('/products/filter')
    .query({
      sort:'low'
    });

    expect(response.statusCode).toBe(200);

  });

  test('sorting products from high to low',async ()=>{

    const response =await request(app)
    .get('/products/filter')
    .query({
      sort: 'high'
    });

    expect(response.statusCode).toBe(200);
  });


})