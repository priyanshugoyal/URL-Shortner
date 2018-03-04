var mongoose=require('mongoose');
var schema = mongoose.Schema({
   originalURL: String,
   ShortURL: Number,
});
var modelClass = mongoose.model("ShortUrl", schema);
module.exports=modelClass;