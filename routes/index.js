var express = require('express');
const userModel=require('./users')
const passport = require('passport');
var router = express.Router();
const localStrategy=require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));

// '/' route
router.get('/',function(req,res){
  res.render("index");
});
// '/profile' route
router.get('/profile',isLoggedIn,function(req,res){
  res.render("profile");
});
//register route
router.post('/register',function(req,res){
  var userdata=new userModel({
    username:req.body.username,
    secret:req.body.secret
  });
  userModel.register(userdata,req.body.password)
  .then (function(registereduser){
    passport.authenticate("local")(req,res,function(){
      res.redirect('/');
    })
  })
});


// route for login
router.post('/login',passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/"
}),function(req,res){

})

// route for logout
router.get('/logout',function(req,res,next){
  req.logout(function(err){
    if(err){
      return next(err);
    }
    res.redirect('/');
  });
});
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}
module.exports = router;
