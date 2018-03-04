var mongoose=require('mongoose');
var schema = mongoose.Schema({
   originalURL: String,
   shortURL: String
});
var modelClass = mongoose.model("ShortUrl", schema);
module.exports=modelClass;