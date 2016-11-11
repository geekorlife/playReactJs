// LOAD MONGOOSE SCHEMA
const Schema = require('./models/schema');
const randomId = require("./randomId");
const sendMail = require("./mailer");

/**
 * Check if credential is out of Date
 */

exports.check_Credential = (data, res) => {
    Schema.users.findOne({ credential: data.credential, id_shop: data.id_shop }, (err, resp) => {
        if (!err && resp) {
            console.log('FOUND ID USER', resp);
            const haveToUpdate = new Date() - new Date(resp.updatedAt) > 1000 * 60 * 60 * 24 * 2;     // Credential Created more than 2days ago ?

            if (haveToUpdate) {
                res.send({ message: 'usr_exist', timeout: true });
            }
            else {
                res.send({ message: 'usr_exist' });
            }

        }
        else {
            console.log('USR NOT FOUND', resp);
            res.send({ message: 'error_usr' });
        }
        res.end('');
    })
}


const newCredentialAndSend = (usrData, res) => {
    usrData.credential = randomId();
    usrData.save((error) => {
        if (error) {
            throw error;
        }
        else {
            console.log('UPDATE USER OK - SEND OK 200', usrData)
            res.send({
                message: 'usr_exist',
                credential: usrData.credential,
                id_shop: usrData.id_shop,
                shpnme: usrData.shopName,
                email: usrData.login
            });
        }
        res.end("");
    });
}

const errorLoggin = (res, msg) => {
    const errorMsg = { message: 'error_usr' };
    if (msg) {
        errorMsg.type = msg;
    }
    res.send(errorMsg);
    res.end('');
}

/**
 * Check if usr exist
 */
exports.log_Usr = (data, res) => {
    Schema.users.findOne({ login: data.l }, (err, usrData) => {
        if (!err && usrData) {
            console.log('FOUND ID USER', usrData);

            // test a matching password
            usrData.comparePassword(data.p, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    newCredentialAndSend(usrData, res);
                }
                else {
                    console.log('USR NOT FOUND', usrData);
                    errorLoggin(res);
                }
            });


        }
        else {
            console.log('USR NOT FOUND', usrData);
            errorLoggin(res);
        }
    })
};

/**
 * Create new usr account
 */

exports.addUsr = (data, res) => {
    console.log('data USER', data);
    const id_connect = randomId();
    const shopNme = data.account.shpnme ? data.account.shpnme.split(' ').join('').toLowerCase() : null;

    let User = new Schema.users({
        id_shop: randomId(),
        credential: randomId(),
        shopName: shopNme,
        login: data.account.email,
        pass: data.account.pass,
        desc: data.account.desc || null,
        avatar: data.account.avatar === '0' ? '/img/usrAv/women.jpg' : '/img/usrAv/men.jpg'
    });

    User.save((err, resp) => {
        if (err) {
            let error_account = {
                error: true
            }
            if (err.code && err.code == 11000) {
                error_account = { duplicate_key: err.message.split('dup key: { : "')[1].split('" }')[0] };
            }

            errorLoggin(res, error_account);
            return;
        }

        const msg = '<h4>Welcome to CutiDeals.com !</h4>' +
            '<br/>' +
            '<p>' +
            'Your personal shop is ready and you can start to create ads' +
            '<br/>' +
            '<a href="www.CutiDeals.com">www.CutiDeals.com</a>' +
            '</p>';
        const msgPlain = 'Welcome to CutiDeals.com ! Your personal shop is ready and you can already add ads';
        sendMail(data.account.email, msg, msgPlain, 'Welcome to CutiDeals.com');
        res.send({ message: 'usr_added', credential: resp.credential, id_shop: resp.id_shop, shpnme: shopNme, email: data.account.email });
        res.end('');
    });
}

/**
 * Change password
 */
exports.changePass = (data, res) => {
    Schema.users.findOne({ credential: data.credential }, (err, usrData) => {
        if (!err && usrData) {
            // test a matching password
            usrData.comparePassword(data.oldPass, function (err, isMatch) {
               
                if (err){   
                    console.log('BAD PASSWORD',err);
                    errorLoggin(res);
                }
                if (isMatch) {
                    usrData.pass = data.newPass;
                    usrData.save( (err,resp) => {
                        if (err){
                            errorLoggin(res);
                        }
                        else {
                            res.send({ message: 'pass_updated'});
                            res.end('');
                        }
                    })
                }
                else {
                    console.log('USR NOT FOUND', usrData);
                    errorLoggin(res);
                }
            });
        }
        else {
            console.log('USR CREDENTIAL NOT FOUND',data);
            errorLoggin(res);
        }
    })
}

/**
 * Update usr shop account
 */
exports.upUsr = (data, res) => {
    Schema.users.findOne({ credential: data.credential, shopName: data.shopName }, (err, usrData) => {
        if (!err && usrData) {
            console.log('FOUND ID USER');
            let nName = false;
            if (data.nShpNme !== data.shopName) {
                usrData.shopName = data.nShpNme;
                nName = true;
            }

            usrData.desc = data.desc;

            usrData.save((er, nusrdata) => {
                const nData = {
                    shop: nusrdata
                };
                if (nName) {
                    nData.newName = true;
                    updateShopNameArticle(data.shopName, data.nShpNme);
                }
                res.send({ 'message': 'shop_updated', data: nData });
                res.end('');
            });
        }
        else {
            console.log('USR NOT FOUND', usrData);
            errorLoggin(res);
        }
    })
}

const updateShopNameArticle = (oldName, newName) => {
    const sortFind = { shopName: oldName };

    const lastNineCmd = Schema.articles.find(sortFind);
    lastNineCmd.exec(function (err, art) {
        if (err) {
            return false;
        }
        // update shop name for each article
        for(let i=0; i < art.length; i++) {
            art[i].shopName = newName;
            art[i].save();
        }
        return true;
        
    });
}

/**
 * Check shop name
 */
exports.checkShopName = (data, res) => {
    Schema.users.findOne({ shopName: data.shopName }, (err, usrData) => {
        if (!err && usrData) {
            console.log('FOUND SHOP NAME');
            res.send({ shopName: true });;
        }
        else {
            res.send({ shopName: false });
        }
        res.end('');
    })
}