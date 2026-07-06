const express = require ('express');
const router=express.Router();
const db= require('../db');

router.get('/',(req,res)=>{
const sql=`
SELECT * FROM products ;
`;

db.query(sql,(err,result)=>{
  if(err){
    return res.status(500).send(err.message);
  };
  res.json(result);
});
});

router.post('/yourProduct',(req,res)=>{
  const {
    user_id,
    title,
    price,
    description,
    image
  }=req.body;
  const sql = `
  INSERT INTO products(user_id,title,price,description,image)
  VALUES(?,?,?,?,?);
  `;
  db.query(sql,[user_id,title,price,description,image],(err,result)=>{
    if(err){
      return res.status(500).send(err.message);
    };
    res.status(201).json({
      message:'product created sucessfully',
      product_id: result.insertId
    }
    );
  });
});

router.get('/product/:id',(req,res)=>{
  const id = req.params.id;

  sql=`
  SELECT * FROM products
  WHERE product_id=?
  `
db.query(sql,[id],(err,result)=>{
  if(err){
    return res.status(500).send(err.message);
  };
  if(result.length===0){
    return res.status(400).send('product not found')
  };
  res.json(result[0]);
});
});

router.put('/:id',(req,res)=>{
  res.send('update  product');
});
router.delete('/:id',(req,res)=>{
  res.send('delete product ')
});

module.exports=router;