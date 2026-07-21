const multer= require ('multer');
const path = require ('path');

const storage=multer.diskStorage({
  destination: (req,file,cb)=>{
    cb(null,'upload/');
  },
  filename:(req,file,cb)=>{
    
    const uniqueName=Date.now() +
    '-'+
    Math.round(Math.random()*1E9)+
    path.extname(file.originalname);
    cb(null,uniqueName)
  }
});
const fileFilter=(req,file,cb)=>{
    if(file.mimetype.startsWith('image/')){
      cb(null,true)
    }else{
      cb(  new Error ('only image file are allowed '),false)
    }
  }

  const upload=multer({
    storage: storage,
    fileFilter: fileFilter
  });

module.exports=upload