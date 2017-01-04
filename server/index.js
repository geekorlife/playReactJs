const conf = require('./settings');

const express = require('express');
const mongoose = require('mongoose');
const fs = require("fs");
const path = require("path");
const randomId = require("./randomId");
const usr = require("./usr");
const art = require("./controlers/articles");

const gm = require('gm').subClass({ imageMagick: true });

const app = express();
const bodyParser = require('body-parser');      // Body JSON parser
const busboy = require('connect-busboy');       // Multipart Form data parser

// MongoDB CONNECTION WITH MONGOOSE
mongoose.connect('mongodb:' + conf.MONGO);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Mongoose connection done ! ' + conf.MONGO);
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
app.use(busboy());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


// ROUTES FOR THE API
var router = require('./controlers/route');

app.use(conf.CROS);

// USE ROUTER IN EXPRESS
app.use('/api', router);

// STATIC CONTENT 
app.use(express.static(path.join(__dirname, "../")));

// LAUNCH APP EXPRESS
app.listen(conf.PORT);
console.log("Server listening on port %d", conf.PORT);


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// Get all articles in DB
router.route('/all')
    // Get all article in DB
    .get(function (req, res) {
        console.log('GET ALL');
        Schema.articles.find(function (err, art) {
            if (err)
                res.send(err);
            res.json(art);
        });
    })

// Get 9 articles by category
router.route('/page')
    // Get paginated article
    .get(function (req, res) {
        return art.getPage(req, res);
    });


router.route('/myShop')
    .get(function (req, res) {
        console.log('req GET MY SHOP', req.query);

        if (req.query.type != 'GET_SHOP_ARTICLE' || !req.query.shopName) {
            res.json({ message: 'error' });
            return;
        }
        console.log('req.query', req.query);
        
        const sortFind = { shopName: req.query.shopName};
        if(req.query.cat) {
            sortFind.cat = req.query.cat;
        }
        if(req.query.gender) {
            sortFind.gender = req.query.gender;
        }
        const lastNineCmd = Schema.articles.find(sortFind).sort({ _id: -1 });

        lastNineCmd.exec(function (err, art) {
            if (err) {
                res.send({'message':err});
            }

            Schema.articles.count(sortFind, (err, ar) => {
                console.log('COUNT',ar);
                
                Schema.users.findOne({ shopName: req.query.shopName}, (errp, resp) => {
                    console.log('USER SHOP', resp);
                    let shopResp = null;
                    let article_list = null;
                    if(resp && resp.shopName) {
                        
                        shopResp = {
                            shopName: resp.shopName,
                            createdAt: resp.createdAt,
                            id_shop: resp.id_shop,
                            desc: resp.desc,
                            avatar: resp.avatar
                        }

                        if(req.query.adminMode && req.query.adminMode === 'true') {
                            shopResp.id_connect = resp.id_connect;
                        }
                        
                        article_list = art.map((ar) => {    
                            let a = Object.assign({},ar._doc);
                            if(!req.query.adminMode || req.query.adminMode && req.query.adminMode !== 'true') {
                                delete a.id_connect;
                            }
                            return a;
                        });
                        console.log('SEND',shopResp);
                        console.log('article_list',article_list);
                    }
                    res.json({ article: article_list, length: ar, shop: shopResp });
                })
            })
        });
    });

// ADD img to a new article
router.route('/addImg')
    .post(function (req, res) {
        return art.addImg(req, res);
    });

// Update article
router.route('/updateArticle')
    .post(function (req, res) {
        return art.updateArticle(req, res);
    })

// Delete an existing article
router.route('/deleteArticle')
    .delete(function (req, res) {
        return art.deleteArticle(req, res);
    })

// Create a new article
router.route('/add')
    // Create a new article (accessed at POST http://localhost:8080/api/add)
    .post(function (req, res) {
        return art.createArticle(req, res);
    });

// Get or PUT an article
router.route('/getOne')
    // Get an article via the ID
    .get(function (req, res) {           // Get artilce
        return art.getArticle(req, res);
    })

    // Update QA about an article via the ID
    .post(function (req, res) {
        return art.updateQa(req, res);
    })
    .delete(function (req, res) {
        Schema.articles.remove({ id: req.params.id }, function (err, bear) {
            if (err)
                res.send(err);

            res.json({ message: 'article_deleted' });
        });
    });

// Send private email
router.route('/sendPrv')
    .post(function (req, res) {
        return art.sendMail(req, res);
    });

// Find zip code
router.route('/zipCode')
    // Get an article via the ID
    .get(function (req, res) {           // Get artilce
        console.log('GET SPECIFIC ZIP');
        console.log('req', req.query);
        let reqs = ['find', 'findOne'];
        let cmd = null;

        //{ type: 'GET_ZIPCODE', _id: '95050' }
        if (req.query.type != 'GET_ZIPCODE') {
            res.json({ message: 'error' });
            return;
        }

        if (!req.query.zip) {
            cmd = { _id: Number(req.query._id) };
            reqs = 'findOne';
        }
        else {
            cmd = { _id: Number(req.query.zip.code) };
            reqs = 'findOne';
            if (req.query.zip.type != 'zip') {
                reqs = 'find';
                let nameCity = req.query.zip.code.split(' ');

                let namm = [];
                nameCity.forEach((nm) => {
                    let nme = nm.split('');
                    if (nme[0]) {
                        for (var i = 0; i < nme.length; i++) {
                            nme[i] = i == 0 ? nme[i].toUpperCase() : nme[i].toLowerCase();
                        }
                        namm.push(nme.join(''));
                    }
                })
                const finalNameCity = namm.join(' ');

                cmd = {nm: { $regex: "^" + finalNameCity}};
            }
        }
        
        Schema.zipCode[reqs](cmd, (art, existindb) => {
            if (existindb) {
                if (req.query.zip && req.query.zip.type != 'zip') {

                    // Avoid duplicate city
                    let savedCity = {};
                    for (var i = 0, len = existindb.length; i < len; i++)
                        savedCity[existindb[i]['st']] = existindb[i];

                    existindb.length = 0;

                    for (var key in savedCity)
                        existindb.push(savedCity[key]);

                }
                
                res.json({ message: 'zip_exist', city: existindb });
                return art;
            }

            res.json({ message: 'zip_doesnt_exist' });
            res.end("");
        })
    })

// Create a new User
router.route('/addUsr')
    .post(function (req, res) {
        const data = req.body;
        usr.addUsr(data, res); 
    })
    .put( function(req, res) {
        const data = req.body;
        usr.upUsr(data, res);
    })
    .get( function(req, res) {
        const data = req.query;
        if(data.type && data.type === 'GET_SHOP_NAME') {
            usr.checkShopName(data, res);
        }
    })


//Get usr information
router.route('/usrLog')
    .get(function (req, res) {
        console.log('GET USR req.query', req.query);
        const data = req.query;

        if (data.id_shop && data.credential) {
            console.log(' usr query check');
            //Check credential timeout
            usr.check_Credential(data, res);
        }
        else if (data.l && data.p) {
            console.log(' usr query log');
            //Check usr account
            usr.log_Usr(data, res);
        }
        else {
            console.log('error usr query');
            res.send({ message: 'error_usr' });
        }

    })
    .put(function(req, res){
        const data = req.body;
        if (data.oldPass && data.credential) {
            console.log(' usr query check');
            //Check credential timeout
            usr.changePass(data, res);
        }
        else {
            res.end('');
        }
    })