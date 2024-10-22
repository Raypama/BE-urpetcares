const passport = require('../lib/passport');

// console.log("test");

const checkAuth = passport.authenticate('jwt', { session: false })


module.exports = checkAuth;