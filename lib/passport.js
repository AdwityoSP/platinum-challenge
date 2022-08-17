const passport = require('passport')
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt')
const { User } = require('../models')
require('dotenv').config()

const options = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: process.env.secretkey_jwt
}

passport.use(new JwtStrategy(options, (payload, done) => {
    User.findByPk(payload.id)
    .then(user => done(null, user))
    .catch(err => done(err, false))
}))

module.exports = passport