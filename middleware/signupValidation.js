function signupValidation(req,res,next){

  const {
    username,
  first_name,
  last_name,
  email,
  password,
  phone_number
  }=req.body 
  
  if (!username || !first_name || !last_name || !email || !password ||  !phone_number ){
    const error=new Error('invalid info');
    error.status=403;
    return next(error);
  };
  
  const emailRegex= /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const usernameRegex = /^(?=.{4,}$)[a-zA-Z0-9](?:[a-zA-Z0-9._]*[a-zA-Z0-9])?$/;
  const passwordRegex= /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).{8,}$/;
  const phone_numberRegex=/^[1-9][0-9]{7}$/;
  const first_nameRegex=/^[A-Za-z]{2,30}$/;
  const last_nameRegex=/^[A-Za-z]{2,30}$/;


  if(!emailRegex.test(email)){
    const error=new Error('invalid email format');
    error.status=400;
    return next(error);
  };
  if(!passwordRegex.test(password)){
    const error= new Error('password must be at least 8 characters and must have "a-z,A-Z,0-9,! @ # $ % ^ & *..."');
    error.status=400;
    return next(error);
  };

  if(!usernameRegex.test(username)){
    const error = new Error('username must be at least 4 characters and can have "a-z,A-Z,0-9,.,_,"');
    error.status=400;
    return next(error);
  };
  if(!phone_numberRegex.test(phone_number)){
    const error= new Error('phone number must be at least 8 characters and ');
    error.status=400;
    return next(error);
  };
  if(!first_nameRegex.test(first_name)){
    const error= new Error ('first name can only be letters');
    error.status=400;
    return next(error);
  };
  if(!last_nameRegex.test(last_name)){
    const error = new Error  ('last name can only be letters');
    error.status=400;
    return next(error);
  };
  next();
}

module.exports= signupValidation
