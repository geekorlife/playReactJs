/**
 * 
 * SERVER SETTINGS
 * 
 */
const PROD_MONGO = '//geekorlifedb:18091979pB@127.0.0.1/kidsndeals';
const DEV_MONGO = '//127.0.0.1/reactShop';

module.exports = {

    EMAIL_PARAM: 'smtps://hello%40cutideals.com:18091979pB@smtp.gmail.com',

    EMAIL_TEXTE: 'hello@cutideals.com',

    DOMAIN_NAME_PARAM: 'CutiDeals.com',

    PARAM_DOMAIN: 'http://www.cutideals.com',

    DOMAIN_NAME: 'CutiDeals',

    MONGO: PROD_MONGO,

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