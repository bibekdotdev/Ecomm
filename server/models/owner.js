const mongoose =require('mongoose');

const ownerSchema=mongoose.Schema({
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
  }
});
let Owner=mongoose.model('Owner',ownerSchema);
module.exports=Owner