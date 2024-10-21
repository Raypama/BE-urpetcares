// require('dotenv').config() //harus diimport di main index tkt ada error
const {User} = require('../models');
const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt
// require('dotenv').config();

passport.use(new JWTStrategy(
  {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY
  },

  
  async (payload, done) => {
    try {
      const users = await User.findByPk(payload.id);
      console.log("jalan");
      console.log(users);

// console.log(secretOrKey);

      if (!users) {
        console.log('user not found');
        return done(null, false);
      }


      const usersAvail = {
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone
      };

      //dia akan meneruskan masuk ke req.user
      return done(null, payload); //agar bisa masuk ke req.user
    
    } catch (error) {
      console.log(error);
      return done(null, false);
    }
  }
));

module.exports = passport; // Pastikan passport diekspor dengan benar
//memverivikasi token 