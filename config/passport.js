const LocakStrategy = require('passport-local').Strategy ;
const mongoose = require('mongoose') ;
const bcrypt = require('bcryptjs');

// load User Model
const User = require('../models/User');
module.exports = function(passport) {
    passport.use(
        new LocakStrategy({usernameField: 'email'} , (email , password , done) => {
            //Match User
            User.findOne({email:email})
            .then(user => {
                if(!user) {
                    return done(null, false, {message: 'that email is not registred'});


                }
                // Mtach passowrd
                bcrypt.compare(password , user.password , (err , isMatch) => {
                    if(err) throw err ;
                    if(isMatch) {
                        return done(null, user) ;
                    } else {
                        return done(null , false , {message: 'password incorrect'});

                    }
                    });

                })
            .catch(err => console.log(err))

        })
    );
    passport.serializeUser((user, done) => {
        done(null, user.id);n
      });
      
      passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
          done(err, user);
        });
      });

}