const express = require ('express');
const app = express();
require ('dotenv').config();
const PORT = process.env.PORT ||'3000';
const productsRouter=require('./routes/products.js');
const userRouter=require('./routes/users.js');
const db=require('./db.js');

app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use('/products',productsRouter);
app.use('/users',userRouter);



app.listen(PORT,()=>{
  console.log('server started on port '+PORT );
});