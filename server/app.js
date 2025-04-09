const express=require('express')
const app=express();
const mongoose=require('mongoose');
require('dotenv').config();
const cors=require('cors');
const productRouters=require('./routers/productRoutes.js');
const authentication=require('./routers/authentication.js');
const  productOrder=require('./routers/productOrder.js');
const admin =require('./routers/admin');
const Product =require('./models/product');
const Tempdata =require('./models/temdata');
const AddToCart =require('./models/addtocart');
const Review =require('./models/review');
const Order =require('./models/order');
const Owner=require('./models/owner');
mongoose.connect(process.env.CONN).then(()=> console.log("database is connected") 
).catch((e)=>{

    console.log('error is ',e);
})
app.use(express.json());

app.use(cors({
    credentials:true
}));

app.use('/ecomm/product', productRouters);
app.use('/ecomm/authentication', authentication);
app.use('/ecomm/productOrder',productOrder);
app.use('/ecomm/admin',admin)

app.listen(8080,()=>{ 
    console.log('app is listing');
})

app.get('/allData', async (req, res) => {
    //  await Product.deleteMany({}); 
    //  await Tempdata .deleteMany({}); 
    //  await AddToCart.deleteMany({}); 
    //  await Review.deleteMany({}); 
    //  await Order.deleteMany({}); 
    //  await Owner.deleteMany({}); 
    let allValue = await Product.find({});
    console.log(allValue);
    res.json(allValue);
  });
  app.all('*',(req,res)=>{
    console.log('hi');
    res.redirect('http://localhost:5173/notfoundpage')
  })
  
  
