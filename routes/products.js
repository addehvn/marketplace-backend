const express = require ('express');
const router=express.Router();
const db= require('../db');
const auth=require('../middleware/auth.js');
const isOwner= require('../middleware/isOwner.js');
const productValidation=require('../middleware/productValidation.js');
const upload= require('../middleware/multer.js');

router.get('/',auth,(req,res,next)=>{
  const page = Number(req.query.page)|| 1;

  const LIMIT = 10;

  const OFFSET=(page-1)*10;

const sql=`
SELECT *
FROM products
ORDER BY product_id ASC 
LIMIT ?
OFFSET ?
`;

db.query(sql,[LIMIT,OFFSET],(err,result)=>{
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


db.query(sql,[product_id],(err,result,)=>{
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

router.get('/search',(req,res,next)=>{
  const search =req.query.search 
  
  const sql =`
  SELECT* 
  FROM products 
  WHERE title LIKE ?;
  `;
  db.query(sql,[`%${search}%`],(err,result)=>{
    if(err){
      return next(err);
    };
    if(result.length===0){
      const error = new Error('no product found');
      error.status=404;
      return next(error);
    };
    res.status(200).send(result)
  });
});

router.get('/filter',(req,res,next)=>{
  const {maxPrice,
      minPrice,
      sort 
  }=req.query

  let  sql=`
  SELECT * 
  FROM products 
  WHERE 1=1;
  `;
  const value=[]
  if(maxPrice){
    sql+=`And price<=?`;
    value.push(maxPrice);
  };
  if(minPrice){
    sql+=`AND price>=?`;
    value.push(minPrice)
  };
  if(sort==='low'){
    sql+=`ORDER BY price ASC`
  };
  if(sort==='high'){
    sql+=`ORDER BY price DESC`
  };

  db.query(sql,value,(err,result)=>{
    if(err){
      return next(err)
    };
    if(result.length===0){
      const error = new Error('something went wrong');
      error.status=500;
      return next (error);
    };
  });
})


module.exports=router;