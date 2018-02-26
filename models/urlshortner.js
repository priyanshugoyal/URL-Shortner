var mongoose=require('mongoose');
var schema = mongoose.Schema({
   originalURL: String,
   ShortURL: Number,
});
var modelClass = mongoose.model("url", schema);
module.exports=modelClass;