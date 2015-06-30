// Require our dependencies
var express = require('express'),
    fs = require('fs'),
    template = '',
  exphbs = require('express-handlebars'),
  http = require('http');
var request = require('request-promise');
var nodemailer = require('nodemailer');
var mailer = require('express-mailer');

logger = require('../shared/lib/log');
var user = 'solidsydney@gmail.com',
    pass = 'hetalksinme2';
// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: user,
        pass: pass
    }
});
fs.readFile(__dirname + '/html/pages-newsletter.html', function (err, data) {
    if (err) throw err;
    template = (data.toString());
});
// Create an express instance and set a port variable
var app = exports.app = express();
app.set('view engine', 'ejs');  
app.set('views', 'web/views/');

// Create `ExpressHandlebars` instance with a default layout.
var hbs = exphbs.create({
    defaultLayout: 'main',
    layoutsDir: 'web/views/layouts/',
    partialsDir: 'web/views/partials/',
    compilerOptions: undefined
});

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

mailer.extend(app, {
	from: "TradeDepot <michaelukpong@gmail.com>",
  	host: 'smtp.gmail.com', // hostname
  	secureConnection: true, // use SSL
  	port: 465, // port for secure SMTP
  	transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
  	auth: {
    	user: "michaelukpong@gmail.com",
    	pass: "Dumbled0re*#*"
  	}
});


// Disable etag headers on responses
app.disable('etag');

// Index Route
app.get('/geo', function (){});

app.get('/sendmail', function(req, res){

    var message = '';
    if(req.query.html) message = template.replace('@message', req.query.html);

    var mailOptions = {
        from: req.query.from || 'TradeDepot ✔ <workflow@tradedepot.com>', // sender address
        to: req.query.to || 'mukpong@c2gconsulting.com, solidsydney@gmail.com, omocheje@gmail.com', // list of receivers
        subject: req.query.subject || 'Transaction Notification ✔', // Subject line
        text: req.query.text || 'Successful Transaction ✔', // plaintext body
        html: message || '<b>Successful Transaction ✔</b>' // html body
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            res.end(error);
            return console.log(error);
        }
        res.end('Message sent: ' + JSON.stringify(info));
        logger.info('Email sent ');

    });
    
    ////send success email
	//app.mailer.send('email-template.ejs',
	//		{
	//    		to: req.query.to,
	//    		subject: 'TradeDeport Order Alert'
     //           /*Add other parameters that correspond with the <%=parameter%> variable in the .ejs template */
	//  		}, function (err) {
	//	    	if (err) {
	//	      		logger.error("Error while sending confirmation email " + err);
    //
	//	    	}
	//	  });
    });

app.get('/sendsms', function(req, res){
    // http request format http://www.smslive247.com/http/index.aspx?cmd=sendquickmsg&owneremail=user.com&subacct=tradedepot&subacctpwd=pass&message=xxx&sender=TRADEDEPOT&sendto=xxx&msgtype=0
    var message = req.query.message || 'successful transaction',
        sendto = req.query.sendto || '08090607605';
    var url = 'http://www.smslive247.com/http/index.aspx?cmd=sendquickmsg&owneremail=' + user + '&subacct=tradedepot&subacctpwd=' + pass + '&message=' + message + '&sender=TRADEDEPOT&sendto=' + sendto + '&msgtype=0'
    var requrl = {
        'url': url,
        'method': 'get'
    };
    request(requrl)
        //did not consider serer response messages and status yet
        .then(function(success){
            logger.info('Sent SMS to ' + sendto + ' message : ' + message);
            res.end(success);
        }, function(error){
            logger.error('SMS Message not sent');
            res.end(error);
        });


});
// Set /public as our static content dir
app.use("/", express.static(__dirname + "/html/"));