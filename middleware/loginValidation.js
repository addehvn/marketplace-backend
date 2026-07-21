function loginValidation(req,res,next){
 const{
  email,
  password
 }=req.body

  const emailRegex=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  const passwordRegex=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).{8,}$/
 
  if(!emailRegex.test(email)){
    const error = new Error('invalid email format ');
    error.status=400;
    return next(error);
  };
  if (!passwordRegex.test(password)){
    const error = new Error('password must be at least 8 characters and must have "a-z,A-Z,0-9,! @ # $ % ^ & *..."');
    error.status=400;
    return next(error);
   };
  next();
}
module.exports=loginValidation