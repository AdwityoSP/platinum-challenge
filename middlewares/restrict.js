const passport = require('../lib/passport');
const restrict = passport.authenticate('jwt', {
    session: false
});

module.exports = restrict;