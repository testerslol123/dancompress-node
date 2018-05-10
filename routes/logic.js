var express = require('express');
var path = require('path')
var router = express.Router();
var multer  = require('multer');
// var upload = multer({ dest: 'uploads/' });

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'))
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '_' + file.originalname)
  }
})

var upload = multer({ storage: storage })

router.post('/compressFile', upload.single('file'), function(req, res, next) {
  console.log(req)
  console.log(JSON.stringify(req.files));
  res.send('kekekeke')
});




module.exports = router;
