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
    let User = new Schema.users({
        id_shop: randomId(),
        credential: randomId(),
        shopName: data.account.shpnme,
        login: data.account.email,
        pass: data.account.pass
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
        
        const msg = '<h4>Welcome to CutieDeals.com !</h4>' +
            '<br/>' +
            '<p>' +
            'Your personal shop is ready and you can start to create ads' +
            '<br/>'+
            '<a href="www.cutiesdeals.com">www.cutiesdeals.com</a>'+
            '</p>';
        const msgPlain = 'Welcome to CutieDeals.com ! Your personal shop is ready and you can already add ads';
        sendMail(data.account.email, msg, msgPlain, 'Welcome to CutieDeals.com');
        res.send({ message: 'usr_added', credential: resp.credential, id_shop: resp.id_shop, shpnme: data.account.shpnme, email:data.account.email });
        res.end('');
    });
}