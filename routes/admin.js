const express=require('express');
const router=express.Router();
const db = require('../db');
const bcrypt= require('bcrypt');
const isAdmin= require('../middleware/admin.js');
const jwt= require ('jsonwebtoken');
const auth=require ('../middleware/auth.js');
const updateUserValidtion=require('../middleware/updateUserValidation.js')
const productValidation=require('../middleware/productValidation.js')
const upload= require('../middleware/multer.js');


router.post('/login',async(req,res,next)=>{
  const {
    email,
    password
  }= req.body ;
  const sql= `
    SELECT * FROM users 
    WHERE user_role='Admin' AND email=?
  `;
  db.query(sql,[email],(err,result)=>{

    if(err){
      return next(err)
    }

    if(result.length===0){
      const error = new Error('youre not allowed');
      error.status=403;
      return next(error);
    }
    const user = result[0]
     const match= bcrypt.compare(password,user.password);
    if(!match){
       const error =new Error('wrong password');
       error.status=401;
       return next(error);
    };
    const token = jwt.sign({
      email:user.email,
      user_role:user.user_role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn :'1h'
    }
  );

    res.status(200).send({
      message:'logged in sucessfully...',
      token :token 
    })
  });
});


router.get('/users',auth,isAdmin,(req,res,next)=>{

  const page = Number(req.query.page)||1;

  const LIMIT =10;

  const OFFSET =(page-1)*10;


const sql=`
SELECT first_name,last_name,username, user_role FROM users
ORDER BY user_role
LIMIT ? 
OFFSET ?
`;
db.query(sql,[LIMIT , OFFSET],(err,result)=>{
   if(err){
    return (err);
  };
  if(result.length===0){
     const error = new Error('something went wrong !');
    error.status=401;
    return next(error)
  };
  res.status(200).send({
    message: 'All users',
    json: result
  });
});
});


router.get('/products',auth,isAdmin,(req,res,next)=>{

  const page = Number(req.query.page)

  const LIMIT =10;
  const  OFFSET =(page-1)*10


 const sql =`

 SELECT * FROM products
 ORDER BY product_id ASC 
 LIMIT ?
OFFSET ?
 `;
 db.query(sql,[LIMIT,OFFSET],(err,result)=>{
  if(err){
    return res.status('something went wrong!');

  };
  res.status(200).send({
    message :'All products',
    json :result
  });
 });
});


router.patch('/updateUser/:id',auth,isAdmin,updateUserValidtion,upload.single('image'),async(req,res)=>{
  const user_id=req.params.id

  if(req.fil){
    req.body.image=req.file.filename;
  }
  if(req.user.password){
    req.user.password=await bcrypt.hash(req.user.password,10);
  };

  const fields=[];
  const values=[];

  for(key in req.body){
    fields.push(`${key}=?`);
    values.push(req.body[key]);
  };
  values.push(user_id)

  const sql=`
  UPDATE users 
  SET ${fields.join(',')} , update_at=NOW()
  WHERE user_id=?;
  `;

  db.query(sql,values,(err,result)=>{
    if (err){
       return next(err);
    };

    if(result.length===0){
      const error = new Error ('you entered wrong detail');
      error.status=401;
    };

    
  });

});

router.patch('/updateProduct/:id',auth,productValidation,upload.single('image'),(req,res,next)=>{
  const product_id=req.params.id

  if(req.file){
    req.body.file=req.file.filename;
  }

  const fields=[];
  const values=[];
  for(key in req.body){
    fields.push(`${key}=?`);
    values.push(req.body[key]);
  }
  values.push(product_id);

  const sql=`
  UPDATE products
  SET ${fields.join(',')}, update_at=NOW()
  WHERE product_id=?;
  `;
  db(sql,values,(err,result)=>{
      if(err){
        return next(err);
      };

      if(result.affectedRows===0){
        const error = new Error ('user not found');
        error.status=404;
        return next(error);
      };

  });

});

router.get('/searchUser',(req,res,next)=>{
  const search =req.query.search

  const sql=`
  SELECT * FROM users
  WHERE username LIKE ?;
  `;

  db.query(sql,[`%${search}%`],(err,result)=>{
    if(err){
      return next(err);
    };
    if(result.length===0){
      const error=new Error('user not found');
      error.status=404;
      return next(error);
    };
    res.status(200).send(result);
  });
});

router.get('/searchProduct',(req,res,next)=>{
  const search =req.query.search

  const sql=`
  SELECT * FROM product
  WHERE username LIKE ?;
  `;

  db.query(sql,[`%${search}%`],(err,result)=>{
    if(err){
      return next(err);
    };
    if(result.length===0){
      const error=new Error('product not found');
      error.status=404;
      return next(error);
    };
    res.status(200).send(result);
  });
});


module.exports=router;