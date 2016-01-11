var passport = require('passport');
var constants = require('./../../constants');
var FacebookStrategy = require('passport-facebook').Strategy;
var usersController = require('./../components/users/usersController');

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: constants.API_URL + "/api/auth/facebook/callback",
    enableProof: true,
    profileFields: ['id', 'name','picture.type(large)', 'emails', 'displayName', 'about', 'gender']
  },
  function(accessToken, refreshToken, profile, done) {

    // //TODO Hack to log by driver
    // profile.id = "2";
    // profile.displayName = "Leonel Messi";
    // profile.photos[0].value = "https://38.media.tumblr.com/avatar_09149a3e01bd_128.png";
    // //TODO end

    process.nextTick(function () {
      usersController
        .findByFacebookId(profile.id)
        .then(function(user){
          if (user){
            user.name = profile.displayName;
            user.picture = profile.photos[0].value;
            user.gender = profile._json.gender;
            user.save();
            return done(null, user);
          } else {
            usersController.create({
              facebookId: profile.id,
              name: profile.displayName,
              picture: profile.photos[0].value,
              gender: profile._json.gender
            })
            .then(function(newUser){
              return done(null, newUser);
            })
            .fail(function (error) {
              console.log(error);
              next(error);
            });
          }
        });
    });
  }
));

module.exports = passport;