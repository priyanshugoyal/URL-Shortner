var mongoose=require('mongoose');
var schema = mongoose.Schema({
   originalURL: String,
   ShortURL: String
});
var modelClass = mongoose.model("ShortUrl", schema);
module.exports=modelClass;