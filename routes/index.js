var express = require('express');
var router    = express.Router();
var upload    = require('./upload');
var mongoose  = require('mongoose');
var Photo     = mongoose.model('Photos');

/* GET home page. */
router.get('/', function(req, res, next) {

  Photo.find({}, ['path', 'caption'], { sort: { _id: -1 } })
  .then((photos) => {
    res.render('index', { title: 'NodeJS file upload tutorial', msg: req.query.msg, photolist: photos });
  })
  .catch((err) => {
    // Handle the error
    console.error(err);
  });


});

/** Upload file to path and add record to database */

router.post('/upload', function(req, res) {

  upload(req, res,(error) => {
      if(error){
         res.redirect('/?msg=3');
      }else{
        if(req.file == undefined){
          
          res.redirect('/?msg=2');

        }else{
             
            /**
             * Create new record in mongoDB
             */
            var fullPath = "files/"+req.file.filename;

            var document = {
              path:     fullPath, 
              caption:   req.body.caption
            };
  
          var photo = new Photo(document); 
          photo.save()
          .then(() => {
            res.redirect('/?msg=1');
          })
          .catch((error) => {
            throw error;
          });
        
      }
    }
  });    
});

module.exports = router;
