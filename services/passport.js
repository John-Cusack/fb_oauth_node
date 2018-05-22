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
      User.findOne({ facebookEmail: profile.emails[0].value }).then(
        existingUser => {
          if (existingUser) {
            User.findOneAndUpdate(
              { facebookEmail: profile.emails[0].value },
              { googleId: profile.id },
              { new: true }
            ).then(done(null, existingUser));
          } else {
            new User({
              googleId: profile.id,
              googleEmail: profile.emails[0].value
            })
              .save()
              .then(user => done(null, user));
          }
        }
      );
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
      User.findOne({ googleEmail: profile.emails[0].value }).then(
        existingUser => {
          if (existingUser) {
            User.findOneAndUpdate(
              { googleEmail: profile.emails[0].value },
              { facebookId: profile.id },
              { new: true }
            ).then(done(null, existingUser));
          } else {
            new User({
              facebookId: profile.id,
              facebookEmail: profile.emails[0].value
            })
              .save()
              .then(user => done(null, user));
          }
        }
      );
    }
  )
);

// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: keys.FACEBOOK_APP_ID,
//       clientSecret: keys.FACEBOOK_APP_SECRET,
//       callbackURL: '/auth/facebook/callback',
//       profileFields: ['id', 'email', 'name']
//     },
//     (accessToken, refreshToken, profile, done) => {
//       User.findOne({ googleEmail: profile.emails[0].value }).then(
//         existingUser => {
//           if (existingUser) {
//             done(null, existingUser);
//           } else {
//             new User({
//               facebookId: profile.id,
//               facebookEmail: profile.emails[0].value
//             })
//               .save()
//               .then(user => done(null, user));
//           }
//         }
//       );
//     }
//   )
// );
