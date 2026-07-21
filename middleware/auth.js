const jwt=require('jsonwebtoken')
function auth(req,res,next){
const token= req.headers.authorization?.replace("Bearer ","");
if(!token){
  const error= new Error ('token didnt found');
  error.status=401;
  return next(error);
};
try{
  const decoded= jwt.verify(
    token,
    process.env.JWT_SECRET
  )
  req.user=decoded;
  
}catch(err){
  const error = new Error('token did not provided '); 
  error.status=401;
  return next(error);
};
next();
};
module.exports=auth;


