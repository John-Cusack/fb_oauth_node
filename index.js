const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');
const https = require('https')
const fs = require('fs')

require('./models/User');
require('./services/passport');

mongoose.connect(keys.mongoURI);

const app = express();

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);

const PORT = process.env.PORT || 5000;

//app.listen(PORT, process.env.IP);




app.get('/', (req, res) => {
  res.send('WORKING!')
})

const httpsOptions = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem')
}
const server = https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log('server running at ' + PORT)
})
