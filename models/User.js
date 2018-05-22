const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: String,
  googleEmail: String,
  facebookId: String,
  facebookEmail: String
});

mongoose.model('users', userSchema);
