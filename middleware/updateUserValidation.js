function updateUserValidtion(req,res,next){
  const {
    username,
    first_name,
    last_name,
    email,
    password,
    phone_number
  }=req.body
  
  const emailRegex= /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const usernameRegex = /^(?=.{4,}$)[a-zA-Z0-9](?:[a-zA-Z0-9._]*[a-zA-Z0-9])?$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).{8,}$/;
  const phone_numberRegex=/^[1-9][0-9]{7}$/;
  const first_nameRegex=/^[A-Za-z]{2,30}$/;
  const last_nameRegex=/^[A-Za-z]{2,30}$/;

  if(email!== undefined && !emailRegex.test(email)){
    const error= new Error('email is not correct');
    error.status=400;
    return next(error);
  };

  if(username !== undefined && !usernameRegex.test(username)){
    const error = new Error('username must be at least 4 characters and can have "a-z,A-Z,0-9,.,_,"');
    error.status=400;
    return next(error);
  };

  if(password!== undefined && !passwordRegex.test(password)){
    const error = new Error('password must be at least 8 characters and must have "a-z,A-Z,0-9,! @ # $ % ^ & *..."');
    error.status=401
    return next(error);
  }


  if(phone_number!== undefined && !phone_numberRegex.test(phone_number)){
    const error= new Error('phone number should be at 8 characters');
    error.status=400;
    return next(error);
  };
  if(first_name !== undefined && !first_nameRegex.test(first_name)){
    const error= new Error ('first name can only be letters');
    error.status=400;
    return next(error);
  };
  if(last_name !== undefined && !last_nameRegex.test(last_name)){
    const error = new Error  ('last name can only be letters');
    error.status=400;
    return next(error);
  };
  

  next();
};

module.exports=updateUserValidtion;