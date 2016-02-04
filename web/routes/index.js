var express = require('express');
var router = express.Router();
var fs = require('fs');
var secrets = require('../secrets.js');

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}

module.exports = function(passport){

    /* GET home page. */
    router.get('/', function(req, res) {
      res.render('index');
    });

	/* Handle Login POST */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/home',
		failureRedirect: '/',
		failureFlash : true  
	}));
    
	/* GET Registration Page */
	router.get('/signup', function(req, res){
		res.render('register',{message: 'message'});
	});

	/* Handle Registration POST */
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/comfort',
		failureRedirect: '/signup',
		failureFlash : true  
	}));

    /* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
    	// route for facebook authentication and login
	// different scopes while logging in
	router.get('/login/facebook', 
		passport.authenticate('facebook', { scope : ['email']}
	));

	// handle the callback after facebook has authenticated the user
	router.get('/login/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect : '/comfort',
			failureRedirect : '/'
		})
	);

// this is called by the esp8266 to let us know latest sensor data
router.get('/postComfort',function(req,res){
    var key=req.param("secret","");
    // this request as it is not authenticated using Facebook it needs to provide a secret key associated with the key account
    
    var t=req.param("temp",21.5);
    //double decimals precision only
    t=Math.floor(parseFloat(t)*100)/100;
    if (t>-25&&t<40){
      var f=__dirname + '/states/temp'+key;
      fs.writeFileSync(f,JSON.stringify({temp:t,lastUpdate:new Date()}));
    }
    var c=getCalib(key);
    //return ok, target temp and delta
    res.status(200).json({prg:parseFloat(getPrg(key))-parseFloat(c), delta:getDelta(key)});

    if (t>-25&&t<40){
      // save temp data to plot/ly
       try{
           var plotly = require('plotly')('<account name>','<api key>');
           var data = [{x:[], y:[], stream:{token:'<token>', maxpoints:100000}}];
           var graphOptions = {fileopt : "extend", filename : "<graphname>"};
           plotly.plot(data,graphOptions,function() {
           var stream = plotly.stream('<token>', function (res) {
               console.log(res);
             });
             stream.on("error", function (err) {})
             var Moment = require('moment-timezone');
             d=Moment().tz('Europe/Bucharest').format("YYYY-MM-DD HH:mm:ss");
               t+=parseFloat(c);
             var streamObject = JSON.stringify({ x : d, y : t });
             stream.write(streamObject+'\n');
             console.log('written to plotly:'+streamObject);
           });
       }catch(e){console.log('exception from plotly:'+e);}
     }
});

// this is called by the UI to programm the heating station
router.get('/postProgr',isAuthenticated, function(req,res){
    try{        
    var key=req.user.fb.id;//req.param("key","mrcat");
    key=secrets[key];
        
    var p=parseFloat(req.param("progr"));
    var c=parseFloat(req.param("calib"));
    var d=parseFloat(req.param("delta"));
    if (c<-5||c>5)
        res.status(500).send('illegal value calibration');
    if (p<0||p>30)
        res.status(500).send('illegal value prg');
    if (d<0||d>1)
        res.status(500).send('illegal value delta');
    var f=__dirname + '/states/progr'+key;
    fs.writeFileSync(f,p);
    var f=__dirname + '/states/calib'+key;
    fs.writeFileSync(f,c);
    var f=__dirname + '/states/delta'+key;
    fs.writeFileSync(f,d);
    computeNewState(key);
    }catch(e){console.log(e);}
    res.status(200).send('ok');
});


// this loads the UI and returns last state as json
router.get('/comfort', isAuthenticated, function(req,res){
//		res.render('home', { user: req.user });

    var key=req.user.fb.id; //req.param("key","mrcat");
    key=secrets[key];
    var json=req.param("json","0");
    var f=__dirname + '/states/temp'+key;
    var lastTemp=0;
    try{lastTemp=JSON.parse(fs.readFileSync(f, 'utf8'));}catch(e){}

    var p=getPrg(key);
    var c=getCalib(key);
    var d=getDelta(key);

    var st=computeNewState(key)

    if (json=="1"){
       res.status(200).json({temp:lastTemp["temp"],progr:p,update:lastTemp["lastUpdate"],state:st,calibration:c, delta:d});
    }else
    {
       res.render('comfort',{temp:lastTemp["temp"],progr:p,update:lastTemp["lastUpdate"],state:st,calibration:c, key:key, delta:d, user: req.user});
    }
});

function getPrg(key){
    var f=__dirname + '/states/progr'+key;
    var p=0;
    try{p=parseFloat(fs.readFileSync(f,'utf8'));}catch(e){}
    return p;
}
function getCalib(key){
    var f=__dirname + '/states/calib'+key;
    var c=0;
    try{p=parseFloat(fs.readFileSync(f,'utf8'));}catch(e){}
    return c;
}
function getDelta(key){
    var f=__dirname + '/states/delta'+key;
    var d=0;
    try{d=parseFloat(fs.readFileSync(f,'utf8'));}catch(e){}
    return d;
}

function computeNewState(key){
    var f=__dirname + '/states/temp'+key;
    var lastTemp=0;
    try {lastTemp=JSON.parse(fs.readFileSync(f, 'utf8'));}catch(e){}
    var t=parseFloat(lastTemp["temp"]);
    var p=getPrg(key);
    var c=getCalib(key);
    var d=getDelta(key);
    f=__dirname + '/states/state'+key;
    var curState=0;
    try{curState=parseInt(fs.readFileSync(f,'utf8'));}catch(e){}
    if (curState!=1&&curState!=0)
        curState=0;
    if ((curState==0)&&(t+c+d<p))
        curState=1;
    else if ((curState==1)&&(t+c-d>p))
        curState=0;
    fs.writeFileSync(f,curState);
    return curState;
}

    return router;
    
}
