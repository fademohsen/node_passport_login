const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport')
//user model
const User = require('../models/User');
//login page
router.get('/login' , (req , res)=> res.render('login'));
//register page
router.get('/Register' , (req , res)=> res.render('register'));
//register handle
router.post('/register' , (req , res) => {
  const {name , email , password , password2  } = req.body;
  let errors = [];
  //check required fields
  if(!name || !email || !password || !password2 ) {
      errors.push({msg: 'please fill in all fields'}) ;

  }
//check password matchs
if (password !== password2) {
    errors.push({msg: "password do not match"});
}
//check password length
if(password.length < 6) {
    errors.push({msg: "password should be at least 6 chracters"})
}
if(errors.length > 0) {
res.render('register' , {
    errors,
    name,
    email,
    password,
    password2

})
}else{
    //Validation passed
User.findOne({email : email})
.then(user => {
    if(user){
        //user exists
        errors.push({msg: 'email is already registerd'})
        res.render('register' , {
            errors,
            name,
            email,
            password,
            password2
        
        })

     } else {
        const newUser = new User({
            name,
            email,
            password
        });
//    hash password
   bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password,salt,(err , hash)=> {
        if(err) throw err ;
       //set password to hashed
       newUser.password = hash ;
// save user
newUser.save()
.then(user => {
    req.flash("success_msg",'you are now registered and can log in');
    res.redirect('/users/login')
})
.catch(err => console.log(err))

   })
})

    }
}) ;

}

})
//login handle
router.post('/login' , (req , res , next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard' ,
        failureRedirect: '/users/login' ,
        failureFlash: true
    }) (req , res , next);
})
//logout
router.get('/logout' , (req , res) => {
    req.logOut();
    req.flash('success_msg' , 'Your Are looged out')
    res.redirect('/users/login')
})
module.exports = router ;