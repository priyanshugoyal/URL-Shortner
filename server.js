 /******************************************************
 * PLEASE DO NOT EDIT THIS FILE
 * the verification process may break
 * ***************************************************/

'use strict';

var fs = require('fs');
var express = require('express');
var app = express();
var mongoose=require('mongoose');
const ShortUrl=require('./models/urlshortner.js');
if (!process.env.DISABLE_XORIGIN) {
  app.use(function(req, res, next) {
    var allowedOrigins = ['https://narrow-plane.gomix.me', 'https://www.freecodecamp.com'];
    var origin = req.headers.origin || '*';
    if(!process.env.XORIG_RESTRICT || allowedOrigins.indexOf(origin) > -1){
         console.log(origin);
         res.setHeader('Access-Control-Allow-Origin', origin);
         res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }
    next();
  });
}

app.use('/public', express.static(process.cwd() + '/public'));

app.route('/_api/package.json')
  .get(function(req, res, next) {
    console.log('requested');
    fs.readFile(__dirname + '/package.json', function(err, data) {
      if(err) return next(err);
      res.type('txt').send(data.toString());
    });
  });
var dbURL='mongodb://'+process.env.USER+':'+process.env.PASSWORD+'@'+process.env.HOST+':'+process.env.DBPORT+'/'+process.env.DB;
mongoose.connect(dbURL);
app.route('/')
    .get(function(req, res) {
		  res.sendFile(process.cwd() + '/views/index.html');
    })
app.get('/new/:urlToShorten(*)',function(req,res,next)
        {
  var urlToShorten=req.params.urlToShorten;
  var expression=/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
  var randomNumber=Math.floor(Math.random()*10000).toString();
  if(expression.test(urlToShorten)===true)
  {
    var data=new ShortUrl(
      {
        originalURL:urlToShorten,
        shortURL:randomNumber
      });
   data.save(function(err, ShortUrl){
         if(err)
            res.send('error in saving');
         
      });
    res.json(data);
  }
  else
    res.json({'error':'invalid url'});
  
});
app.get('/:urlToForward',function(req,res,next)
        {
  var shorterUrl=req.params.urlToForward;
  console.log(shorterUrl);
  ShortUrl.findOne({'shortURL':shorterUrl},function (err,data)
                   {
    console.log(data);
    if(err)
      res.send('error in retriving');
    else
    {
      var re=new RegExp('^(http|https)://','i');
      var str=data.originalURL;
      console.log(str);
      if(re.test(str)){
    res.redirect(301,data.originalURL);}
      else
      {res.redirect(301,'http://'+data.originalURL);}
    }
  });
});

// Respond not found to all the wrong routes
app.use(function(req, res, next){
  res.status(404);
  res.type('txt').send('Not found');
});

// Error Middleware
app.use(function(err, req, res, next) {
  if(err) {
    res.status(err.status || 500)
      .type('txt')
      .send(err.message || 'SERVER ERROR');
  }  
})

app.listen(process.env.PORT, function () {
  console.log('Node.js listening ...');
});

