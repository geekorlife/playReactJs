/**
 * 
 * SERVER SETTINGS
 * 
 */
const PROD_MONGO = '//geekorlifedb:18091979pB@127.0.0.1/kidsndeals';
const DEV_MONGO = '//127.0.0.1/reactShop';

module.exports = {

    EMAIL_PARAM: 'smtps://geekorlife%40gmail.com:18091979pB@smtp.gmail.com',

    EMAIL_TEXTE: 'geekorlife@gmail.com',

    DOMAIN_NAME_PARAM: 'KidsnDeals.com',

    PARAM_DOMAIN: 'http://192.168.2.8',

    DOMAIN_NAME: 'My moms closet',

    MONGO: DEV_MONGO,

    PORT: '8080',

    CROS: function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

        // intercept OPTIONS method
        if ('OPTIONS' == req.method) {
            res.send(200);
        }
        else {
            next();
        }
    }

}