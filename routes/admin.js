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
  
  if(result.length===0){
     const error = new Error('something went wrong !');
    error.status=404;
    return next(error)
  };
   if(err){
    return (err);
  };
  res.status(200).json({
    message: 'All users',
    json: result
  });
});
});


router.get('/products',auth,isAdmin,(req,res,next)=>{

  const page = Number(req.query.page)||1;

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
    return next(err)

  };
  if(result.length===0){
     const error = new Error('something went wrong !');
    error.status=404;
    return next(error)
  };
  res.status(200).json({
    message :'All products',
    json :result
  });
 });
});


router.patch('/updateUser/:id',auth,isAdmin,upload.single('image'),updateUserValidtion,async(req,res,next)=>{
  console.log(req.file)
  console.log(req.body)
  const user_id=req.params.id

  if(req.file){
    req.body.image=req.file.filename;
  }
  if(req.body.password){
    req.body.password=await bcrypt.hash(req.body.password,10);
  };

  const fields=[];
  const values=[];

  for(const key in req.body){
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

    if(result.affectedRows===0){
      const error = new Error ('you entered wrong detail');
      error.status=404;
      return next(error);
    };
    
    res.status(200).send('user updated successfully ')
  });

});

router.patch('/updateProduct/:id',auth,upload.single('image'),productValidation,(req,res,next)=>{
  const product_id=req.params.id

  if(req.file){
    req.body.image=req.file.filename;
  }

  const fields=[];
  const values=[];
  for(const key in req.body){
    fields.push(`${key}=?`);
    values.push(req.body[key]);
  }
  values.push(product_id);

  const sql=`
  UPDATE products
  SET ${fields.join(',')}, update_at=NOW()
  WHERE product_id=?;
  `;
  db.query(sql,values,(err,result)=>{
      if(err){
        return next(err);
      };

      if(result.affectedRows===0){
        const error = new Error ('user not found');
        error.status=404;
        return next(error);
      };
        res.status(200).send('product updated successfully');
  });

});

router.get('/searchUser',auth,isAdmin,(req,res,next)=>{
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

router.get('/searchProduct',auth,isAdmin,(req,res,next)=>{
  const search =req.query.search

  const sql=`
  SELECT * FROM products
  WHERE title LIKE ?;
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