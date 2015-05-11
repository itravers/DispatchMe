module.exports = function(app, passport) {
  
//load up the Site model
  var Site       = require('../models/site');

// normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get('/site', function(req, res) {
    //possibly create a new site here?
    res.render('createSite.jade');
  });
  
  // INDIVIDUAL SITES =========================
  app.get('/site/:siteName', function(req, res){
    var siteName = req.params.siteName;
    var regexSiteName = new RegExp(["^",siteName,"$"].join(""),"i"); //ignore capitalization
    Site.findOne({ 'name' :  regexSiteName }, "name configCategories", function(err, site) {
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
        
        errors.push("No Site Found: " + siteName);
        console.log("No Site Found: " + errors);
        //later this code will be used to sign up a new site
        var newSite            = new Site();
        newSite.name = siteName;
        newSite.configCategories = [{name: "AvailableLoginServices",
                                     configs: [{name: "Facebook", value: true},
                                               {name: "DispatchMyself", value: true},
                                               {name: "Twitter", value: true},
                                               {name: "Google", value: true}]
                                    },
                                    {name: "AvailableSocialServices",
                                      configs: [{name: "Facebook", value: true}]
                                     }];
        newSite.save(function(err) {
            if (err){
              console.log("error saving new user - database indexes?" + err);
              throw err;
            } 
            console.log("new site created " + newSite);
        });
        res.render('site.jade',
            {error: errors});
      }else{
        console.log("Rendering Site: " + site);
        res.render('site.jade',
            {site: site});
      }
      
        
  });
    
  });

  
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}