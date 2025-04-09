const mongoose =require('mongoose');

const tempData=mongoose.Schema({
  name:{
    type:String,
    require:true
  },
  email:{
    type:String,
    require:true
  },
  password:{
    type:String,
    require:true
  },
  otp:{
    type:String,
    require:true
  }
});
let Tempdata=mongoose.model('Tempdata',tempData);
module.exports=Tempdata