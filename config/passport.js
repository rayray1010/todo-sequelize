const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
module.exports = (app) => {
  app.use(passport.initialize())
  app.use(passport.session())
  passport.use(
    new LocalStrategy(
      { usernameField: 'email', passReqToCallback: true },
      (req, email, password, done) => {
        User.findOne({ where: { email } })
          .then((user) => {
            if (!user) {
              req.flash('warning_msg', 'This email is not registered!')
              return done(null, false, {
                message: 'That email is not registered!',
              })
            }
            return bcrypt.compare(password, user.password).then((isMatch) => {
              if (!isMatch) {
                req.flash('warning_msg', 'wrong Email or password.')
                return done(null, false, {
                  message: 'Email or Password incorrect.',
                })
              }
              return done(null, user)
            })
          })
          .catch((err) => done(err, false))
      }
    )
  )
  passport.use(
    new FacebookStrategy(
      {
        clientID: '3012786618988284',
        clientSecret: 'cad8a9ff2420f858d6f3410552732e93',
        callbackURL: 'http://localhost:3000/auth/facebook/callback',
        profileFields: ['email', 'displayName'],
      },
      async function (accessToken, refreshToken, profile, done) {
        const { name, email } = profile._json
        try {
          let user = await User.findOne({ where: { name } })
          if (user) return done(null, user)
          const randomPassword = Math.random().toString(36).slice(-8)
          const hash = await bcrypt.hash(randomPassword, bcrypt.genSaltSync(10))
          const newUser = await User.create({ name, email, password: hash })
          await done(null, newUser)
        } catch (err) {
          console.log(err)
        }
      }
    )
  )
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findByPk(id)
      .then((user) => {
        user = user.toJSON()
        done(null, user)
      })
      .catch((err) => done(err, null))
  })
}
