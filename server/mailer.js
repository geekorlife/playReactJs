const conf = require('./settings');

var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport(conf.EMAIL_PARAM);

// send mail with defined transport object

const sendMail = (to,msg,msgplain,subject) => {
    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: conf.DOMAIN_NAME+' <'+conf.EMAIL_TEXTE+'>', // sender address
        to: to, // list of receivers
        subject: subject || 'Your ad on '+conf.DOMAIN_NAME_PARAM+' ✔', // Subject line
        text: msgplain, // plaintext body
        html: msg // html body
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });

}

module.exports = sendMail;