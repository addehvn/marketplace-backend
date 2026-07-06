const express = require ('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db.js');

router.post('/signup',async (req,res)=>{
 const {
  username,
  first_name,
  last_name,
  email,
  password,
  phone_number
 }=req.body;
 const hashedPassword= await bcrypt.hash(password,10);
 const sql =`
 INSERT INTO users(username,first_name,last_name,email,password,phone_number)
 VALUES (?,?,?,?,?,?);
 `;
 db.query(sql,[username,first_name,last_name,email,hashedPassword,phone_number],(err,result)=>{
  if(err){
    return res.status(500).send(err.message);
  }
  if(result)
  res.send('Account creatred sucessfully ...');
 });
});



router.post('/login',async (req,res)=>{
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
    return res.status(500).send(err.message);
  };
  const user=result[0];
  const match = await bcrypt.compare(password,user.password);
  if(!match){
    return res.status(404).send('email or password invalid')
  };
  res.send('logged in sucessfully')
 });
});

router.patch('/update/:id',async(req,res)=>{
const id = req.params.id;

if(req.body.password){
 req.body.password = await bcrypt.hash(req.body.password,10);
}

const fields=[];
const values=[];

for(key in req.body){
  fields.push(`${key}=?`);
  values.push(req.body[key]);
};
values.push(id);
const sql=`
UPDATE users
SET ${fields.join(',')} , update_at=NOW()
WHERE user_id=?
`;
db.query(sql,values,(err,result)=>{
  if(err){
    return res.status(500).send(err.message);
  };
  if(result.affectedRows===0){
      return res.status(401).send('user not found');
  };
  res.send('updated sucessfully...');

});

});



router.delete('/delete/:id',(req,res)=>{
  const id = req.params.id

  const sql = `
    DELETE FROM  users 
    WHERE user_id=?
  `
  db.query(sql,[id],(err,result)=>{
    if(err){
      res.status(500).json('something went wrong!')
    };
    if(result.affectedRows===0){
     return  res.status(404).json('user not found')
    }
    return res.send('account deleted successfully!');
  });
});


module.exports=router;