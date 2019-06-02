const express = require("express");
const router = express.Router();
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken') //to set up JSON web token to allow users to sign in and access protected routes
const keys = require('../../config/keys') //to set up token signing w/ jsonwebtoken
// const Validator = require('validator');
// const validText = require('../../validation/valid-text');
// const validateRegisterInput = require('../../validation/register')
const validateLoginInput = require('../../validation/login')
const validateRegisterInput = require('../../validation/register')
const passport = require('passport');

router.get("/test", (req, res) => res.json({ msg: "this is the users route"}));

// REGISTER ROUTE
router.post('/register', (req, res) => {
  // console.log(res)
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  // check to make sure email has not been used. Then, throw error or create user
  User.findOne({ handle: req.body.handle })
    .then(user => {
      if (user) {
        errors.handle = "User already exists"
        return res.status(400).json(errors)
      } else {
        const newUser = new User({
          handle: req.body.handle,
          email: req.body.email,
          password: req.body.password
        })
     
        // store the password in a salted and encrypted password hash with user
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          // if (err) throw err;
          newUser.password = hash;
          newUser.save()
            .then(user => {
              // set up the payload for web token signing that's returned to user when signed/logged in
              const payload = { id: user.id, name: user.name }

              jwt.sign(
                payload,
                keys.secretOrKey,
                // tell the key to expire in one hour
                { expiresIn: 3600 },
                (err, token) => {
                  res.json({
                    success: true,
                    token: 'Bearer ' + token
                  });
                }
              );
              // res.json(user) 
            })
            .catch(err => console.log(err));
        })
      })
    }
  })
})

// LOGIN ROUTE

router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // console.log(isValid)

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email })
    .then(user => {
      if (!user) {
        errors.handle = "This user does not exist";
        return res.status(404).json(errors);
      }

      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            // set up the payload for web token signing that's returned to user when signed/logged in
            const payload = { 
              id: user.id, 
              name: user.handle, 
              email: user.email 
            }

            jwt.sign(
              payload,
              keys.secretOrKey,
              // tell the key to expire in one hour
              {expiresIn: 3600},
              (err, token) => {
                res.json({
                  success: true,
                  token: 'Bearer ' + token
                });
              }
            );
            // res.json({ msg: 'Success' });
          } else {
            errors.password = "Incorrect password"
            return res.status(400).json(errors);
          }
        })
    })
})

// creating a private auth route with passport & JWTStrategy
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ msg: 'Success' });
})

module.exports = router;

// Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjZjM2MDM4MjdkNTYwMjU2NTY5MDEzNCIsImlhdCI6MTU1OTQ1Mzc1MiwiZXhwIjoxNTU5NDU3MzUyfQ.PXL - p_q0OYFuzNAb7XSRof6Z - Nt - PrPyvYS - 1Hlu65Y