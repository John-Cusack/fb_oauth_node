const AWS = require('aws-sdk');
const uuid = require('uuid');
const requireLogin = require('../middlewares/requireLogin');
const keys = require('../config/key');

const s3 = new AWS.s3({
  accessKeyId: keys.AWS_ACCESS,
  secretAccessKey: keys.AWS_SECRET
});

module.export = app => {
  app.get('/api/upload', requireLogin, (req, res) => {
    const key = `${req.user.id}/${uuid()}.jpg`;
    s3.getSignedUrl(
      'putObject',
      {
        Bucket: 's3-video-bucket',
        ContentType: 'jpeg',
        Key: key
      },
      (err, url) => res.send({ key, url })
    );
  });
};
