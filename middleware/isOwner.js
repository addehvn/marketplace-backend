const db=require('../db')

function isOwner(req,res,next){
  const product_id=req.params.id
  const sql=`
  SELECT user_id 
  FROM products
  WHERE product_id=?;
  `;
  db.query(sql,[product_id],(err,result)=>{
    
     if(err){
        return next(err);
    };

    if(result[0]===0){
      const error = new Error ('product not found');
      error.status=404;
      return next(error);
    };

    if(result[0].user_id!==req.user.user_id){
      const error = new Error ('owner can edit it');
      error.status=403;
      return next(error);
    };

   next();
  });
  

};
module.exports=isOwner