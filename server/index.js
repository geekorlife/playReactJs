const express = require('express');
const mongoose = require('mongoose');

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
        if (callBack) callBack(ar,true);
    });
    return foundArticle;
}

// APP CONFIGURATION
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ROUTES FOR THE API
var router = require('./controlers/route');

// USE ROUTER IN EXPRESS
app.use('/api', router);

// LAUNCH APP EXPRESS
app.listen(port);
console.log("ReactShop server listening on port %d",port);





// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

router.route('/all')
    // Get all article in DB
    .get(function(req, res) {
        Schema.articles.find(function(err, art) {
            if (err)
                res.send(err);

            res.json(art);
        });
    });

router.route('/add')
    // Create a new article (accessed at POST http://localhost:8080/api/add)
    .post(function(req, res) {
        var data = req.body;
        findArticle (data, (art, existindb) => {
            if (existindb) {
                console.log('ARTICLE ALREADY EXIST');
                res.json({ message: 'article_exist' });
                return;
            }

            let Article = new Schema.articles({
                id: art.id,
                name: art.name,
                brand: art.brand,
                desc: art.desc,
                price:art.price,
                img: art.img,
                qty: art.qty
            });
            Article.save((err, arti) => {
                if (err) {
                    res.send(err);
                    return console.error(err);
                }
                console.log('NEW ARTICLE ADDED IN DB');
                res.json({ message: 'article_added' });
            });
        })
    });

router.route('/add/:id')
    // Get an article via the ID
    .get(function(req, res) {           // Get artilce
        var data = req.params;
        findArticle (data, (art, existindb) => {
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
    .put(function(req, res) {           // Update article
        var data = req.params;   
        var dataBody = req.body;   
        findArticle (data, (art, existindb) => {
            if (existindb) {
                var articleFnd = art[0];
                articleFnd.name = dataBody.name || articleFnd.name;
                articleFnd.brand = dataBody.brand || articleFnd.brand;
                articleFnd.desc = dataBody.desc || articleFnd.desc;
                articleFnd.price = dataBody.price || articleFnd.price;
                articleFnd.qty = dataBody.qty || articleFnd.qty;
                
                articleFnd.save(function(err) {
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
    .delete(function(req, res) {
        Schema.articles.remove({id: req.params.id}, function(err, bear) {
            if (err)
                res.send(err);

            res.json({ message: 'article_deleted' });
        });
    });