var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var Flickr = require('flickrapi');
var mongoose = require('mongoose');
var searchModel = require('./models/searchModel');

var app = express();

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(cors());

var db = process.env.MONGOLAB_URI;

mongoose.connect(db, function(err){
  if(err){
   console.log(err);
  }else {
   console.log('mongoose connection is successful');
  }
 });



app.get('/flickrlist/:searchval*', function(req, res) {
    var searchvalP = req.params.searchval;
    var searchvalE = decodeURI(searchvalP);
    
    var offsetE = req.query.offset;
    
    
    var data = new searchModel(
        {
            searchString: searchvalE
        }
      );
      
     
      data.save(err=> {
          if(err) {
              return res.send('Error saving to database');
          }
      });
    
    
  flickrOptions = {
      api_key: "f41dc14c732520b51790802885b75c30",
      secret: "0296e79f2a7aca42",
      format: "json"
  };
    
  Flickr.tokenOnly(flickrOptions, function(error, flickr) {
  if (error) {
      throw error;
  } else {
      flickr.photos.search({
        text: searchvalE,
        content_type: 1,
        per_page: 10,
        sort: "relevance",
        page: offsetE
        
      }, function(err, result) {
          if(err) { throw new Error(err); }
          
          var content = [];
          
          for (i = 0; i < 10; i++) {
          content[i] = ['title: ' + result.photos.photo[i].title + ', url: ' + 'https://farm' +           result.photos.photo[i].farm + '.staticflickr.com/' + 
            result.photos.photo[i].server + '/' + result.photos.photo[i].id + '_' + result.photos.photo[i].secret  + '.jpg'];
         content.push(content[i]);
                
         }
          
          res.json ({ contentType: "photos", page: result.photos.page, pages: result.photos.pages, perpage: result.photos.perpage, total: result.photos.total, searchResult: content });
   
            
      });
    }
      

  });

});

app.get('/recentsearch', function(req, res) {
    searchModel.find({}, function (err, data) {
        if (err) {
          throw err; 
        } else {
            res.json(data);
        }
        
    }).sort({ $natural: -1 }).limit(10);
      
});




app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});