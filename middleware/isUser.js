function  isUser (req,res,next){
  const id=Number(req.params.id);
      console.log(req.user);
      console.log(id);
  if(id!==req.user.user_id){
    const error= new Error('you can only edit your own user');
    error.status=403;
    return next(error);
  };
  next();
};

module.exports=isUser