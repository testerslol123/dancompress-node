var express = require('express');
var path = require('path')
var router = express.Router();
var multer  = require('multer');

var fs = require('fs')
var rle = require('bitfield-rle')
var bitfield = require('bitfield')

var arithmetic = require(path.join(__dirname, '../assets/arithmetic.js'))
var Parser = require("binary-parser").Parser;

var bits = bitfield(1024)
bits.set(400, true) // set bit 400

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'))
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '_' + file.originalname)
  }
})

var upload = multer({ storage: storage })

router.post('/compressFile', upload.array('file'), function(req, res, next) {
  // jadikan ke bufferFile and
  // lakukan RLE


  var tampungRLE = null
  var masukString = null
  req.files.forEach((item, index) => {
    var pathFile = path.join(__dirname, '../uploads', item.filename)

    // var readStream = fs.createReadStream(pathFile)
    var readStream = fs.readFileSync(pathFile)
    console.log('original')
    console.log(readStream)
    console.log(readStream.length)
    // var bufferFile = Buffer.from(readStream)

    tampungRLE = rle.encode(readStream)
    console.log('Run Length Encoding Algorithm')
    console.log(tampungRLE)
    console.log(tampungRLE.length)

    // masukString = tampungRLE.toString('utf8')

    // console.log(masukString)
    // tampungRLE berbentuk array


    // console.log('voxel')
    // var size = require("voxel-crunch").size(readStream)
    // tampungRLE = require("voxel-crunch").encode(readStream)


    // console.log(encodedRLE)
    // console.log(size)
    // console.log('foreach content')

    // encodedRLE.forEach((item, index) => {
    //   console.log(index)
    //   console.log('skip here')
    //   console.log(item)
    //   console.log('  ')
    // })
  })


  var pathFile = path.join(__dirname, '../uploads', req.files[0].filename)

  // var readStream = fs.createReadStream(pathFile)
  var readStream = fs.readFileSync(pathFile)
  console.log('original')
  console.log(readStream)
  console.log(readStream.length)
  // var bufferFile = Buffer.from(readStream)

  tampungRLE = rle.encode(readStream)
  console.log('Run Length Encoding Algorithm')
  console.log(tampungRLE)
  console.log(tampungRLE.length)


  console.log(tampungRLE.toString())

  // lakukan compression Arithmetic Coding
  var hasil = arithmetic.encode(tampungRLE.toString())

  // arithmetic.main()
  console.log('hasil Arithmetic')


  // berisi array sekarang
  console.log(hasil)

  var pathname = path.join(__dirname, '../result', Date.now() + '_hello.danzip')
  var file = fs.writeFileSync(pathname, hasil)
  res.download(pathname)
});


// using Algorithm Arithmetic Coding
function compress (file) {

}


router.post('/decompressFile', (req, res, next) => {
  res.send('Sorry, This Page In Development')
})


// function decompress (file) {

// }


module.exports = router;
