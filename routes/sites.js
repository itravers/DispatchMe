module.exports = function(app, passport) {
  var mongoose = require('mongoose');
  
//load up the Site model
  var Site              = require('../models/site');
  var FormElement       = require('../models/formElement');

// normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get('/site', function(req, res) {
    //possibly create a new site here?
    res.render('createSite.jade', {csrfToken: req.csrfToken()});
  });
  
  // a User is trying to make a new site
  app.post('/site/create', function(req, res){
    var siteName = req.body.siteName;
    var tagLine = req.body.tagLine;
    if(req.body.facebookShare == 'on'){
      facebookShare = true;
    }else{
      facebookShare = false;
    }
    if(req.body.Facebook == 'on'){
      facebookLogin = true;
    }else{
      facebookLogin = false;
    }
    if(req.body.Twitter == 'on'){
      twitterLogin = true;
    }else{
      twitterLogin = false;
    }
    if(req.body.Google == 'on'){
      googleLogin = true;
    }else{
      googleLogin = false;
    }
    var regexSiteName = new RegExp(["^",siteName,"$"].join(""),"i"); //ignore capitalization
    var owner = req.user;
    Site.findOne({ 'name' :  regexSiteName }, "name configCategories", function(err, site) {
      var errors = [];
      if (err){ // if there are any errors, return the error to createSite.jade to be displayed to user
        errors.push(err);
        res.render('createSite.jade',
                   {message: errors,
                    csrfToken: req.csrfToken()}
        );
      }
      if (!site){ //No site was found by this name, lets create one.
        console.log("User " + owner + " is creating new site " + siteName);
        var newSite            = new Site();
        
        var formElement        = new FormElement();
        formElement.name = "MainTitle";
        formElement.value = siteName;
        formElement.type = "text";
        formElement.label = "Main Title";
        formElement.explaination = "The Main Title/Header of your new page.";
        
        var formElement2        = new FormElement();
        formElement2.name = "TagLine";
        formElement2.value = tagLine;
        formElement2.type = "text";
        formElement2.label = "Tag Line";
        formElement2.explaination = "The Tag Line of your new page.";
        
        newSite.name = siteName;
        newSite.templateFile = 'landing-page.jade';
        newSite.owners = [owner._id];
        newSite.formElements = [formElement, formElement2];
        newSite.configCategories = [{name: "AvailableLoginServices",
                                     configs: [{name: "Facebook", value: facebookLogin},
                                               {name: "DispatchMyself", value: true},
                                               {name: "Twitter", value: twitterLogin},
                                               {name: "Google", value: googleLogin}]
                                    },
                                    {name: "AvailableSocialServices",
                                      configs: [{name: "Facebook", value: facebookShare}]
                                     }];
        newSite.save(function(err) {// save the new site to the database.
            if (err){//error adding new site
              console.log("error saving new user - database indexes?" + err);
               res.render('createSite.jade',
                  {message: err,
                   csrfToken: req.csrfToken()}
               );
            } 
            console.log("new site created " + newSite);
            res.redirect('/site/'+newSite.name+'/');
        });
        
      }else{
        console.log("Rendering Site: " + site);
        res.render('createSite.jade',
            {message: "A site by that name already exists.",
             csrfToken: req.csrfToken()}
         );
      }
      
        
  });
    
    
    
    
    
    //res.render("createSite.jade", {message: "this is the message", csrfToken: req.csrfToken()});
  });
  
  app.get('/site/demo/:siteName', function(req, res){
    /*
    var siteName = req.params.siteName;
    var fs = require('fs');
    var Grid = require('gridfs-stream');
    Grid.mongo = mongoose.mongo;
    var conn = mongoose.connection;
    console.log('open');
    var gfs = Grid(conn.db);
         
    //read from mongodb
    var readstream = gfs.createReadStream({
         filename: 'views/'+siteName+'.jade'
    });
        
    var buffers = [];
    readstream.on('data', function(buffer) {
      buffers.push(buffer);
    });
    readstream.on('end', function() {
      var buffer = Buffer.concat(buffers);
      var jade = require('jade');
      var fn = jade.compile(buffer);
      var html = fn();
      console.log("here is the html " + html);
      res.status('200').send(html);
    });
 */
  });
  
  // INDIVIDUAL SITES =========================
  app.get('/site/:siteName', function(req, res){
    var siteName = req.params.siteName;
    var regexSiteName = new RegExp(["^",siteName,"$"].join(""),"i"); //ignore capitalization
    Site.findOne({ 'name' :  regexSiteName }, "name tagLine configCategories templateFile owners formElements", function(err, site) {
      var errors = [];
      // if there are any errors, return the error
      if (err){
        console.log("error getting site " + err);
        errors.push(err);
        res.render('dataDisplay.jade',
            {error: errors});
      }
      // if no user is found, return the message
      if (!site){
        res.send({message: "That site was not found"});
      }else{
        console.log("Rendering Site: " + site);
        res.render(site.templateFile,
            {site: site});
        //res.send({site: site});
      }
      
        
    
    });

  });
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()){
    console.log("isLoggedIn: yes");
    return next();
  }else{
    console.log("isLoggedIn: no");
    res.redirect('/');
  }
}