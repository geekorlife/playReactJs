const conf = require('./settings');

const express = require('express');
const mongoose = require('mongoose');
const fs = require("fs");
const path = require("path");
const sendMail = require("./mailer");
const randomId = require("./randomId");
const usr = require("./usr");

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
        console.log('req', req.query);

        if (req.query.type != 'GET_LIST_ARTICLE') {
            res.json({ message: 'error' });
            return;
        }

        // Generate mongo geo position with max radius in meter
        const loc = {
            "$near": {
                "$geometry": {
                    "type": "Point",
                    "coordinates": [parseFloat(req.query.geo[1]), parseFloat(req.query.geo[0])]
                },
                "$maxDistance": (parseFloat(req.query.dist) + 5) * 1609.344 // Convert miles in meters
            }
        }
        
        let sortFind = req.query._id ? { _id: { $lt: req.query._id }, cat: req.query.catId, activ: true, loc: loc } : { cat: req.query.catId, activ: true, loc: loc };
        if(req.query.idSize) {
            sortFind.idSize = req.query.idSize;
        }
        if(req.query.gender) {
            sortFind.gender = req.query.gender;
        }
        if(req.query.shoes) {
            sortFind.idShoes = JSON.parse(req.query.shoes);
            console.log('req.query.shoes',req.query.shoes);
            console.log('sortFind.idShoes',sortFind.idShoes);
        }
        const nbrArticle = req.query.nbr || 9;
        
        const lastNineCmd = Schema.articles.find(sortFind).sort({ _id: -1 }).limit(nbrArticle);

        lastNineCmd.exec(function (err, art) {
            if (err) {
                res.send(err);
            }

            Schema.articles.count({ cat: req.query.catId, activ: true, loc: loc }, function (err, ar) {
                // SIZE ['Divers','0-3M', '3M', '3-6M', '6M', '6-12M', '12M', '12-18M', '18M', '18-24M', '2T', '3T', '4T', '5T', '6T', '7', '8', '9', '10', '11', '12', '14', '16', '18', '20'];
		
                const listArticle = art.filter( (a) => {
                    if(a.activ) {
                        return {
                            _id: a._id,
                            brand: a.brand,
                            cat: a.cat,
                            desc: a.desc,
                            gender: a.gender,
                            idSize: a.idSize,
                            idShoes: a.idShoes,
                            img: a.img,
                            name: a.name,
                            price: a.price,
                            shopName: a.shopName,
                            updatedAt: a.updatedAt,
                            zip: a.zip
                        }
                    }
                })

                res.json({ article: listArticle, length: ar });
                console.log('count', ar);
            })
        });
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
        let fullPath = __dirname + '/../../../var/www/kidndeals/img/adImg/';
        fullPath = __dirname + '/../img/adImg/'; //DEV server
        let currentId = null;
        let finished = false;
        let fileCnt = 0;
        req.pipe(req.busboy);

        req.busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated) {
            if (fieldname === '_id' && val) {
                currentId = val;
            }
        });

        req.busboy.on('file', function (fieldname, file, filename) {
            fileCnt++;
            console.log("Uploading: " + filename, ' count:', fileCnt);
            let extensionImg = filename.split('.')[1];
            extensionImg =  extensionImg ? extensionImg : 'jpeg';
            var newNameImg = (Math.floor(Math.random() * 100000) + Date.now()) + '.' + extensionImg;

            gm(file)
                .resize(600, 600, '>') // Resize only if w or h is taller than 600
                .quality(0)
                .write(fullPath + newNameImg, function (err) {
                    if (err) {
                        console.log('ERROR RESIZING...', err);
                    }
                    else {
                        console.log('done resizing and save...');

                        //var cmd = data.add ? { $push: { img: data.img } } : { $pull: { img: data.img } }
                        Schema.articles.findOneAndUpdate(
                            { _id: currentId },
                            { $push: { img: newNameImg } },
                            { new: true },
                            ( err, doc) => {
                                if (err) {
                                    console.log("Something wrong when updating data!", err);
                                }
                                else if (--fileCnt === 0 && finished) {
                                    console.log('SEND OK 200', doc)
                                    res.send({ message: 'img_added', _id: currentId });
                                    res.end("");
                                }

                            }
                        );

                    }
                });

        });

        req.busboy.on('finish', function () {
            finished = true;
        });
    });

// Update article
router.route('/updateArticle')
    .post(function (req, res) {
        const dataReq = req.body;
        let data;
        if (dataReq.product) {
            data = dataReq.product;
        }
        console.log('UPDATE data product', data);

        const cmd = { id_connect: data.id_connect };

        Schema.articles.findOne(cmd, (art, dataProduct) => {
            if (dataProduct) {
                if (data.name) {
                    dataProduct.name = data.name;
                    dataProduct.brand = data.brand;
                    dataProduct.desc = data.desc;
                    dataProduct.price = data.price;
                    dataProduct.gender = data.gender;
                    dataProduct.cat = data.cat;
                }
                else if (typeof Number(data.idQa) === 'number') {
                    let newqa = dataProduct.qa.map((q, i) => {
                        if (i == data.idQa) {
                            return { qa: q.qa, own: data.resp }
                        }
                        let ob = { qa: q.qa };
                        if (q.own) ob.own = q.own;
                        return ob;
                    })
                    dataProduct.qa = newqa;
                }

                dataProduct.save((error) => {
                    if (error) {
                        throw error;
                    }
                    else {
                        console.log('UPDATE OK - SEND OK 200', dataProduct)
                        res.send({ message: 'article_updated', article: dataProduct });
                        res.end("");
                    }
                });
                return art;
            }
            console.log('art', art);
            console.log('existindb', dataProduct);
            res.json({ message: 'article_doesnt_exist' });
            res.end("");
        })
    })

// Delete an existing article
router.route('/deleteArticle')
    .delete(function (req, res) {
        const data = req.body;
        if (!data._id || !data.id_connect) {
            res.json({ 'message': 'error' });
            res.end('');
        }

        const cmd = { _id: data._id, id_connect: data.id_connect };
        Schema.articles.remove(cmd, (err, dt) => {
            console.log('err', err);
            console.log('dt', dt);
            res.json({ message: 'article_deleted' });
            res.end("");
        })
    })

// Create a new article
router.route('/add')
    // Create a new article (accessed at POST http://localhost:8080/api/add)
    .post(function (req, res) {
        const data = req.body;
        console.log('receive data',data);
        const id_connect = randomId();
        const shopNme = data.shpnme != 'false' ? data.shpnme.split(' ').join('').toLowerCase() : null;
        const Article = new Schema.articles({
            id: data.id,
            id_connect: id_connect,
            name: data.name,
            brand: data.brand,
            desc: data.desc,
            price: data.price,
            email: data.email,
            shopName: shopNme,
            img: [],
            gender: data.gender,
            cat: data.cat,
            idSize: data.idSize,
            idShoes: data.idShoes,
            activ: true,
            qty: data.qty,
            zip: data.zip,
            loc: { type: "Point", coordinates: [Number(data.zip.pos[1]), Number(data.zip.pos[0])] },
            qa: []
        });

        

        Article.save((err, arti) => {
            if (err) {
                res.send(err);
                return console.error(err);
            }

            const linkManage = conf.PARAM_DOMAIN + '/manageProd?id=' + id_connect;
            const msg = '<h3>Congrats ! Your ads has been created and is online.</h3>' +
                '<br/>' +
                '<h4>' +
                'The link to manage your ad: <a href="' + linkManage + '">' + linkManage + '</a>' +
                '</h4>';
            const msgPlain = 'Congrats ! Your ad on CutiDeals.com has been created. The link to manage your ad: ' + linkManage;
            sendMail(data.email, msg, msgPlain);
            res.send({ message: 'article_added', _id: arti._id, id_connect: id_connect });
        });
    });

// Get or PUT an article
router.route('/getOne')
    // Get an article via the ID
    .get(function (req, res) {           // Get artilce
        console.log('GET SPECIFIC ARTICLE');
        console.log('req', req.query);

        //{type: 'GET_ARTICLE_ADMIN', id_connect: 'li8*TooGzN9F6oVIfYirPCTpYJcR5Rik' }

        if (req.query.type != 'GET_ARTICLE' && req.query.type != 'GET_ARTICLE_ADMIN') {
            console.log('req.query.type', req.query.type);
            res.json({ message: 'error' });
            return;
        }
        console.log('TEST ARTICLE SEARCH');
        const cmd = req.query.type == 'GET_ARTICLE' ? { _id: req.query._id } : { id_connect: req.query.id_connect }

        Schema.articles.findOne(cmd, (art, existindb) => {
            if (existindb) {
                let arti = null;
                if(existindb.desc && existindb.name) {
                    arti = {
                        _id: existindb._id,
                        updatedAt: existindb.updatedAt,
                        createdAt: existindb.createdAt,
                        id: existindb.id,
                        name: existindb.name,
                        brand: existindb.brand,
                        desc: existindb.desc,
                        price: existindb.price,
                        shopName: existindb.shopName,
                        gender: existindb.gender,
                        cat: existindb.cat,
                        qty: 1,
                        zip: existindb.zip,
                        qa: existindb.qa,
                        img: existindb.img
                    }
                }

                res.json({
                    message: 'article_exist',
                    article: arti
                });
                return art;
            }
            
            res.json({ message: 'article_doesnt_exist' });
            res.end("");
        })
    })

    // Update an article via the ID
    .post(function (req, res) {
        console.log('GET PUT');
        var dataBody = req.body;
        console.log('databody', dataBody);
        if (!dataBody.qa || !dataBody._id) throw 'error';
        Schema.articles.findOneAndUpdate({ _id: dataBody._id }, { $push: { qa: dataBody.qa } }, { new: true }, function (err, doc) {
            if (err) {
                console.log("Something wrong when updating data!", err);
            }
            else {
                console.log('SEND OK 200', doc);

                const linkManage = conf.PARAM_DOMAIN + '/manageProd?id=' + doc.id_connect;
                const msg = '<h3>Somebody asks you a question about your ad.</h3>' +
                    '<br/>' +
                    '<h4>' +
                    'The link to manage your ad and repond to the question: <a href="' + linkManage + '">' + linkManage + '</a>' +
                    '</h4>';
                const msgPlain = 'Somebody asks you a question about your ad. The link to manage your ad and repond to the question:: ' + linkManage;
                sendMail(doc.email, msg, msgPlain, 'Question about your ad on ' + conf.DOMAIN_NAME_PARAM + '...');

                res.send({
                    message: 'qa_added',
                    article: doc
                });
            }
            res.end("");

        });
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
    // Create a new article (accessed at POST http://localhost:8080/api/add)
    .post(function (req, res) {
        var data = req.body;
        console.log('ASK MSG', data);
        Schema.articles.findOne({ _id: data._id }, (err, doc) => {
            if (err) {
                console.log("Something wrong when fetching data!", err);
            }
            else {
                console.log('SEND OK 200', doc);

                const linkManage = conf.PARAM_DOMAIN + "/manageProd?id=" + doc.id_connect;
                const msg = '<h3>From: <a href="mailto:' + data.from + '" target="_top">' + data.from + '</a></h3>' +
                    '<br/>' +
                    '<a style="background:#dd127b; border-radius:5px; color:#ffffff; padding:10px" href="mailto:' + data.from + '" target="_top"> REPLY HERE </a>' +
                    '<br/>' +
                    '<h4>Message: </h4>' + data.msg + '' +
                    '<br/><br/>The link to manage your ad and repond to the question: <a href="' + linkManage + '">' + linkManage + '</a>';

                const msgPlain = 'From:' + data.from + ' Msg:' + data.msg;
                sendMail(doc.email, msg, msgPlain, 'Private question about your ad on CutiDeals.com...');

                res.send({
                    message: 'qap_added'
                });
            }
            res.end("");

        });
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
                cmd = { nm: finalNameCity }
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