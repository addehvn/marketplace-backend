const express = require ('express');
const app = express();
require ('dotenv').config();
const PORT = process.env.PORT ||'3000';
const productsRouter=require('./routes/products.js');
const userRouter=require('./routes/users.js');
const db=require('./db.js');
const adminRouter=require('./routes/admin.js');
const auth= require('./middleware/auth.js');
const isAdmin=require('./middleware/admin.js');
const errorHandler=require('./middleware/errorHalndler.js')
app.use(express.json());
app.use(express.urlencoded({extended:true}));



app.use('/products',productsRouter);
app.use('/users',userRouter);
app.use('/admin',adminRouter);
app.use(errorHandler);

module.exports=app;