const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback'
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({
        $or: [
          { facebookEmail: profile.emails[0].value },
          { googleEmail: profile.emails[0].value }
        ]
      }).then(existingUser => {
        if (existingUser) {
          User.findOne(
            {
              $and: [
                { googleId: { $exists: false } },
                { facebookEmail: profile.emails[0].value }
              ]
            }
          )
          .then(facebookUser => {
            if (facebookUser) {
              User.findOneAndUpdate(
            {
              $and: [
                { googleId: { $exists: false } },
                { facebookEmail: profile.emails[0].value }
              ]
            },
            { $set: { googleId: profile.id } },
            { new: true }
          )
            } else {
              done(null, facebookUser);}
          });
        } else {
          new User({
            googleId: profile.id,
            googleEmail: profile.emails[0].value
          })
            .save()
            .then(user => done(null, user));
        }
      });
    }
  )
);


passport.use(
  new FacebookStrategy(
    {
      clientID: keys.FACEBOOK_APP_ID,
      clientSecret: keys.FACEBOOK_APP_SECRET,
      callbackURL: '/auth/facebook/callback',
      profileFields: ['id', 'email', 'name']
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({
        $or: [
          { facebookEmail: profile.emails[0].value },
          { googleEmail: profile.emails[0].value }
        ]
      }).then(existingUser => {
        if (existingUser) {
          User.findOne(
            {
              $and: [
                { facebookId: { $exists: false } },
                { googleEmail: profile.emails[0].value }
              ]
            }
          )
          .then(googleUser => {
            if (googleUser) {
              User.findOneAndUpdate(
            {
              $and: [
                { facebookId: { $exists: false } },
                { googleEmail: profile.emails[0].value }
              ]
            },
            { $set: { facebookId: profile.id } },
            { new: true }
          )
            } else {
              done(null, googleUser);}
          });
        } else {
          new User({
            facebookId: profile.id,
            facebookEmail: profile.emails[0].value
          })
            .save()
            .then(user => done(null, user));
        }
      });
    }
  )
);
