const express = require('express');
const mongoose = require('mongoose');
const fs = require("fs");

const app = express();
const bodyParser = require('body-parser');

const port = 8080;

// MongoDB CONNECTION WITH MONGOOSE
mongoose.connect('mongodb://127.0.0.1/reactShop');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Mongoose connection done !');
});

// LOAD MONGOOSE SCHEMA
const Schema = require('./models/schema');

// METHOD TO FIND AN ARTICLE IN DB WITH A CALLBACK
const findArticle = (art, callBack) => {
    let foundArticle = null;
    Schema.articles.find({ id: art.id }, function (err, ar) {
        if (err || !ar || ar.length == 0) {
            if (callBack) callBack(art);
            return;
        }
        foundArticle = ar;
        if (callBack) callBack(ar, true);
    });
    return foundArticle;
}

// APP CONFIGURATION
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


// ROUTES FOR THE API
var router = require('./controlers/route');

// USE ROUTER IN EXPRESS
app.use('/api', router);


// LAUNCH APP EXPRESS
app.listen(port);
console.log("ReactShop server listening on port %d", port);


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

router.route('/all')
    // Get all article in DB
    .get(function (req, res) {
        console.log('GET ALL');
        Schema.articles.find(function (err, art) {
            if (err)
                res.send(err);
            console.log(art);
            res.json(art);
        });
    })


router.route('/page')
    // Get paginated article
    .get(function (req, res) {
        console.log('GET SPECIFIC ARTICLE FROM X TO Y');
        console.log('req', req.query);

        if (req.query.type != 'GET_LIST_ARTICLE') {
            res.json({ message: 'error' });
            return;
        }

        var sortFind = req.query._id ? { _id: { $lt: req.query._id }, cat: req.query.catId} : {cat:req.query.catId};
        var nbrArticle = req.query.nbr || 9;
        
        var lastTenCmd = Schema.articles.find(sortFind).sort({ _id: -1 }).limit(nbrArticle);

        lastTenCmd.exec(function (err, art) {
            if (err) {
                res.send(err);
            }

            console.log(art);
            console.log('length art', art.length);

            Schema.articles.count({}, function (err, ar) {
                res.json({ article: art, length: ar });
                console.log('count', ar);
            })
        });
    });


router.route('/add')
    // Create a new article (accessed at POST http://localhost:8080/api/add)
    .post(function (req, res) {
        var data = req.body;
        console.log('ADD ARTICLE ', data);
        let Article = new Schema.articles({
            id: data.id,
            name: data.name,
            brand: data.brand,
            desc: data.desc,
            price: data.price,
            img: data.img,
            gender: data.gender,
            cat: data.cat,
            qty: data.qty
        });

        const imageTypeRegularExpression      = /\/(.*?)$/;  
        function decodeBase64Image(dataString) {
          var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
          var response = {};

          if (!matches || matches.length !== 3) {
            return new Error('Invalid input string');
          }

          response.type = matches[1];
          response.data = new Buffer(matches[2], 'base64');

          return response;
        }

        Article.save((err, arti) => {
            if (err) {
                res.send(err);
                return console.error(err);
            }
            var imageBuffer = decodeBase64Image(data.img);
            if(imageBuffer && imageBuffer.type){
            var imageTypeDetected = imageBuffer.type.match(imageTypeRegularExpression);
            fs.writeFile("arghhhh."+imageTypeDetected[1], imageBuffer.data, function(err) {});
            }

            console.log('NEW ARTICLE ADDED IN DB');
            res.json({ message: 'article_added' });
        });
    });


router.route('/add/:id')
    // Get an article via the ID
    .get(function (req, res) {           // Get artilce
        var data = req.params;
        findArticle(data, (art, existindb) => {
            if (existindb) {
                res.json({
                    message: 'article_exist',
                    article: art
                });
                return art;
            }
            res.json({ message: 'article_doesnt_exist' });
        })
    })
    // Update an article via the ID
    .put(function (req, res) {           // Update article
        var data = req.params;
        var dataBody = req.body;
        findArticle(data, (art, existindb) => {
            if (existindb) {
                var articleFnd = art[0];
                articleFnd.name = dataBody.name || articleFnd.name;
                articleFnd.brand = dataBody.brand || articleFnd.brand;
                articleFnd.desc = dataBody.desc || articleFnd.desc;
                articleFnd.price = dataBody.price || articleFnd.price;
                articleFnd.qty = dataBody.qty || articleFnd.qty;

                articleFnd.save(function (err) {
                    if (err)
                        res.send(err);

                    res.json({
                        message: 'article_updated',
                        article: articleFnd
                    });
                });

                return articleFnd;
            }
            res.json({ message: 'article_doesnt_exist' });
        })
    })
    .delete(function (req, res) {
        Schema.articles.remove({ id: req.params.id }, function (err, bear) {
            if (err)
                res.send(err);

            res.json({ message: 'article_deleted' });
        });
    });