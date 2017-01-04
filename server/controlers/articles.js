"use strict";

const Schema = require('../models/schema');
const randomId = require("../randomId");
const gm = require('gm').subClass({ imageMagick: true });
const sendMail = require("../mailer");
const conf = require('../settings');

exports.addImg = (req, res) => {
    let fullPath = __dirname + '/../../../../var/www/kidndeals/img/adImg/';
    //fullPath = __dirname + '/../../img/adImg/'; //DEV server

    let currentId = null,
        finished = false,
        fileCnt = 0,
        countImg = [];

    req.pipe(req.busboy);

    req.busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated) {
        console.log('fieldname', fieldname, ' val', val);
        if (fieldname === '_id' && val) {
            currentId = val;
        }
    });

    req.busboy.on('file', function (fieldname, file, filename) {
        fileCnt++;
        console.log("Uploading: " + filename, ' count:', fileCnt);
        let extensionImg = filename.split('.')[1];
        extensionImg = extensionImg ? extensionImg : 'jpeg';
        var newNameImg = (Math.floor(Math.random() * 100000) + Date.now()) + '.' + extensionImg;
        countImg.push(newNameImg);

        gm(file)
            .resize(600, 600, '>') // Resize only if w or h is taller than 600
            .quality(0)
            .write(fullPath + newNameImg, function (err) {
                if (err) {
                    console.log('ERROR RESIZING...', err);
                }
                else {
                    console.log('done resizing and save... ' + filename);

                    //var cmd = data.add ? { $push: { img: data.img } } : { $pull: { img: data.img } }
                    Schema.articles.findOneAndUpdate(
                        { _id: currentId },
                        { $set: { img: countImg } },
                        { new: true },
                        (err, doc) => {
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
};

exports.createArticle = (req, res) => {
    const data = req.body;
    console.log('receive data', data);
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
            return false;
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
}

exports.updateArticle = (req, res) => {
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

                if (data.cat === '1' && data.idSize) {
                    dataProduct.idSize = data.idSize;
                }
                else if (data.cat === '2' && typeof data.idShoes === 'object') {
                    dataProduct.idShoes = { who: Number(data.idShoes.who), size: Number(data.idShoes.size) };
                }
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
    });
};

exports.deleteArticle = (req, res) => {
    const data = req.body;

    if (!data._id || !data.id_connect) {
        res.json({ 'message': 'error' });
        res.end('');
    }

    const cmd = { _id: data._id, id_connect: data.id_connect };
    Schema.articles.remove(cmd, (err, dt) => {
        console.log('err', err);
        res.json({ message: 'article_deleted' });
        res.end("");
    });
};

exports.getPage = (req, res) => {
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
    if (req.query.idSize) {
        sortFind.idSize = req.query.idSize;
    }
    if (req.query.gender) {
        sortFind.gender = req.query.gender;
    }
    if (req.query.string) {
        let strTxt = req.query.string;
        sortFind.$or = [ 
            {'name':{$regex: strTxt, $options:'i'}}, 
            {'brand':{$regex: strTxt, $options:'i'}}, 
            {'desc':{$regex: strTxt, $options:'i'}} 
        ];
    }
    if (req.query.shoes) {
        sortFind.idShoes = JSON.parse(req.query.shoes);
    }


    const nbrArticle = req.query.nbr || 9;

    const lastNineCmd = Schema.articles.find(sortFind).sort({ _id: -1 }).limit(nbrArticle);

    lastNineCmd.exec(function (err, art) {
        if (err) {
            res.send(err);
        }

        Schema.articles.count(sortFind, function (err, ar) {
            // SIZE ['Divers','0-3M', '3M', '3-6M', '6M', '6-12M', '12M', '12-18M', '18M', '18-24M', '2T', '3T', '4T', '5T', '6T', '7', '8', '9', '10', '11', '12', '14', '16', '18', '20'];

            const listArticle = art.filter((a) => {
                if (a.activ) {
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
};

exports.getArticle = (req, res) => {
    console.log('GET SPECIFIC ARTICLE');
    console.log('req', req.query);

    //{type: 'GET_ARTICLE_ADMIN', id_connect: 'li8*TooGzN9F6oVIfYirPCTpYJcR5Rik' }

    if (req.query.type != 'GET_ARTICLE' && req.query.type != 'GET_ARTICLE_ADMIN') {
        res.json({ message: 'error' });
        return false;
    }

    const cmd = req.query.type == 'GET_ARTICLE' ? { _id: req.query._id } : { id_connect: req.query.id_connect };

    Schema.articles.findOne(cmd, (art, existindb) => {
        if (existindb) {
            let arti = null;
            if (existindb.desc && existindb.name) {
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
                };
                if (typeof existindb.idSize == 'number') arti.idSize = existindb.idSize;
                if (existindb.idShoes && typeof existindb.idShoes.who === 'number') arti.idShoes = existindb.idShoes;
            }

            res.json({
                message: 'article_exist',
                article: arti
            });
            return art;
        }

        res.json({ message: 'article_doesnt_exist' });
        res.end("");
    });
};

exports.updateQa = (req, res) => {
    var dataBody = req.body;

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
};

exports.sendMail = (req, res) => {
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
};