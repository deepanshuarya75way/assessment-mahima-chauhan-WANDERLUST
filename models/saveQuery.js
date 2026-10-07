const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const saveQuerySchema=new Schema({
  user : {
    type:Schema.Types.ObjectId,
    ref:"User" ,
    required : true
  } ,

  query : {
    type : "String" ,
    required : true
  } ,

  notification : {
    type : Boolean ,
    default : true
  }
});

module.exports=mongoose.model("SaveQuery", saveQuerySchema);