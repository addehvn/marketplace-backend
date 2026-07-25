const express = require ('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db.js');
const jwt=require ('jsonwebtoken');
const auth=require('../middleware/auth.js');
const signupValidation= require('../middleware/signupValidation.js');
const loginValidation = require('../middleware/loginValidation.js');
const updateUserValidtion=require('../middleware/updateUserValidation.js');
const isUser=require('../middleware/isUser.js');
const upload= require('../middleware/multer.js');

router.post('/signup',upload.single('image'), signupValidation,async (req,res,next)=>{
 const {
  username,
  first_name,
  last_name,
  email,
  password,
  phone_number
 }=req.body;

 const image=req.file
 ?req.file.filename
 :null;
 const hashedPassword= await bcrypt.hash(password,10);
 const sql =`
 INSERT INTO users(username,first_name,last_name,email,password,phone_number,image)
 VALUES (?,?,?,?,?,?,?);
 `;
 db.query(sql,[username,first_name,last_name,email,hashedPassword,phone_number,image],(err,result)=>{
  if(err){
    if(err.code==='ER_DUP_ENTRY'){
    const error = new Error('email or username already exists');
    error.status=409;
    return next(error);
  };
  };
 
  if(err){

    
    return next(err)
  }
  if(result){
    res.send('Account creatred sucessfully ...');
  }
  
 });
});



router.post('/login',loginValidation,async (req,res,next)=>{
  console.log('LOGIN ROUTE STARTED');
 const {
  email,
  password 
 }=req.body;

 const sql=`
 SELECT * FROM users
 WHERE email=?;
 `;
 db.query(sql,[email],async (err,result)=>{
  if(err){
    return next(err)
  };

  

  const user=result[0];
  if(!user){
    const error= new Error ('email or password invalid');
    error.status=401;
    return next(error);
  }
  const match = await bcrypt.compare(password,user.password);
  if(!match){
    const error = new Error('email or password invalid');
    error.status=401;
    return next(error);
    
  }
  const token=jwt.sign({
    user_id:user.user_id,
    email:user.email
  },
  process.env.JWT_SECRET,
  {
    expiresIn:'1h'
  },
);
return res.json({
  message: 'logged in sucessfully...',
  token: token
 });
 });
});



router.patch('/update/:id',auth,isUser,upload.single('image'),updateUserValidtion,async(req,res,next)=>{
const user_id = req.params.id;

if(req.body.password){
 req.body.password = await bcrypt.hash(req.body.password,10);
}
if(req.file){
  req.body.image=req.file.filename
}
const fields=[];
const values=[];


for(key in req.body){
  fields.push(`${key}=?`);
  values.push(req.body[key]);
};
values.push(user_id);
const sql=`
UPDATE users
SET ${fields.join(',')} , update_at=NOW()
WHERE user_id=?
`;
db.query(sql,values,(err,result)=>{
  if(err){
    if(err.code==='ER_DUP_ENTRY'){
    const error = new Error('email or username already exists');
    error.status=409;
    return next(error)
  }
  }
  
  if(err){
    return next(err);
  };

  if(result.affectedRows===0){
      const error=new Error ('user not found');
      error.status=404;
      return next(error);
  };
  
  res.send('updated sucessfully...');

});

}); 




router.delete('/delete/:id',auth,isUser,(req,res,next)=>{
  const id = req.params.id
    
  const sql = `
    DELETE FROM  users 
    WHERE user_id=?
  `
  db.query(sql,[id],(err,result)=>{
    if(err){
      return next(err)
    };
    if(result.affectedRows===0){
      const error=new Error('user not found');
      error.status=404;
      return next(err);
    };
    return res.send('account deleted successfully!');
  });
});


module.exports=router;