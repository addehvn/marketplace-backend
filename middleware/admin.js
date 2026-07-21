function isAdmin(req,res,next){
 if(req.user.user_role!=='Admin'){
  const error = new Error('user invalid');
  error.status=401;
  return next(error);
 };
 next();
}
module.exports=isAdmin