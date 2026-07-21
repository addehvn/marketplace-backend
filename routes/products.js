const express = require ('express');
const router=express.Router();
const db= require('../db');
const auth=require('../middleware/auth.js');
const isOwner= require('../middleware/isOwner.js');
const productValidation=require('../middleware/productValidation.js');
const upload= require('../middleware/multer.js');

router.get('/',auth,(req,res,next)=>{
const sql=`
SELECT * FROM products ;
`;

db.query(sql,(err,result)=>{
  if(err){
    return next(err);
  };
  res.json(result);
});
});

router.post('/newProduct',auth,upload.single('image'),productValidation,(req,res,next )=>{
  const {
    title,
    price,
    description,
  }=req.body;

  const image = req.file
  ?req.file.filename
  :null;
  const user_id=req.user.user_id
  const sql = `
  INSERT INTO products(user_id,title,price,description,image)
  VALUES(?,?,?,?,?);
  
  `;
  db.query(sql,[user_id,title,price,description,image],(err,result)=>{
    if(err){
      return next(err);
    };
    res.status(201).json({
      message:'product created sucessfully',
      product_id: result.insertId
    }
    );
  });
});

router.get('/:id',auth,(req,res,next)=>{
  const product_id = req.params.id;

  sql=`
  SELECT * FROM products
  WHERE product_id=?
  `
db.query(sql,[product_id],(err,result)=>{
  if(err){
    return next(err);
  };
  if(result.length===0){
    const error= new Error('product not found');
    error.status=404;
    return next(error);
  };
  res.json(result[0]);
});
});

router.patch('/update/:id',auth,isOwner,upload.single('image'),productValidation,(req,res,next )=>{
const id=req.params.id;
const fields =[];
const values=[];

if(req.file){
  req.user.image=req.file.filname
}
for(let key in req.body){
  fields.push(`${key}=?`);
  values.push(req.body[key])
};
values.push(id)
const sql=`
UPDATE products 
SET ${fields.join(',')}, update_at = NOW()
WHERE product_id=?
;
`;
db.query(sql,values,(err,result)=>{
  if(err){
    return next(err)
  };
  if(result.affectedRows===0){
    const error=new Error()
    return res.status(404).send('product not found')
  }
  res.send('updated successfully');
})
});


router.delete('/deleteProduct/:id',auth,isOwner,(req,res,next)=>{
  
const product_id=req.params.id;

const sql =`
DELETE FROM  products
WHERE product_id=? ;
`;


db.query(sql,[product_id],(err,result)=>{
  if(err){
    return res.status(500).send(err.message);
  };
  if(result.affectedRows===0){
    const error= new Error('product not found');
    error.status= 404;
    return next(error);
  };
  res.send('product deleted sucessfully');

});
});

module.exports=router;