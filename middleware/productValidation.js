function productValidation(req,res,next){
  const{
    title,
    price,
    description,
  }=req.body;
  


  const titleRegex=/^[A-Za-z0-9\s.,!?'"()-]{3,100}$/;
  const priceRegex=/^\d{1,3}\.\d{2}$/;
  const descriptionRegex=/^.{10,1000}$/;

  if(title!== undefined && !titleRegex.test(title)){
    const error=new Error('it can be at least 3 characters ');
    error.status=400;
    return next(error);
  };

  if(price!==undefined &&!priceRegex.test(price)){
    const error = new Error('The price can be up to 5 digits long and must have two decimal places.');
    error.status=400;
    return next(error);
  };
  if(description !== undefined  && !descriptionRegex.test(description)){
    const error= new Error('it should be at least 10 charachters');
    error.status=400;
    return next(error);
  };

  next();
}

module.exports=productValidation;