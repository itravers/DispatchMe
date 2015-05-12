module.exports = function(app, passport) {
  
//load up the Site model
  var Site       = require('../models/site');

// normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get('/', function(req, res) {
    res.render('index.jade');
  });
  
  // INDIVIDUAL SITES =========================
  /*
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
*/
  // PROFILE SECTION =========================
  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.jade', {
      user : req.user
    });
  });

  // LOGOUT ==============================
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

  // locally --------------------------------
    // LOGIN ===============================
    // show the login form
    app.get('/login', function(req, res) {
      res.render('login.jade', { message: req.flash('loginMessage'),
        csrfToken: req.csrfToken() });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
      successRedirect : '/profile', // redirect to the secure profile section
      failureRedirect : '/login', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
    }));

    // SIGNUP =================================
    // show the signup form
    app.get('/signup', function(req, res) {
      res.render('signup.jade', { message: req.flash('loginMessage'),
        csrfToken: req.csrfToken() });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
      successRedirect : '/profile', // redirect to the secure profile section
      failureRedirect : '/signup', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
    }));

  // facebook -------------------------------

    // send to facebook to do the authentication
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
      passport.authenticate('facebook', {
        successRedirect : '/profile',
        failureRedirect : '/'
      }));

  // twitter --------------------------------

    // send to twitter to do the authentication
    app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

    // handle the callback after twitter has authenticated the user
    app.get('/auth/twitter/callback',
      passport.authenticate('twitter', {
        successRedirect : '/profile',
        failureRedirect : '/'
      }));


  // google ---------------------------------

    // send to google to do the authentication
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
      passport.authenticate('google', {
        successRedirect : '/profile',
        failureRedirect : '/'
      }));

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

  // locally --------------------------------
    app.get('/connect/local', function(req, res) {
      res.render('connect-local.jade', { message: req.flash('loginMessage'),
        csrfToken: req.csrfToken() });
    });
    app.post('/connect/local', passport.authenticate('local-signup', {
      successRedirect : '/profile', // redirect to the secure profile section
      failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
    }));

  // facebook -------------------------------

    // send to facebook to do the authentication
    app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

    // handle the callback after facebook has authorized the user
    app.get('/connect/facebook/callback',
      passport.authorize('facebook', {
        successRedirect : '/profile',
        failureRedirect : '/'
      }));

  // twitter --------------------------------

    // send to twitter to do the authentication
    app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

    // handle the callback after twitter has authorized the user
    app.get('/connect/twitter/callback',
      passport.authorize('twitter', {
        successRedirect : '/profile',
        failureRedirect : '/'
      }));


  // google ---------------------------------

    // send to google to do the authentication
    app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

    // the callback after google has authorized the user
    app.get('/connect/google/callback',
      passport.authorize('google', {
        successRedirect : '/profile',
        failureRedirect : '/'
      }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', function(req, res) {
    var user            = req.user;
    user.local.email    = undefined;
    user.local.password = undefined;
    user.save(function(err) {
      res.redirect('/profile');
    });
  });

  // facebook -------------------------------
  app.get('/unlink/facebook', function(req, res) {
    var user            = req.user;
    user.facebook.token = undefined;
    user.save(function(err) {
      res.redirect('/profile');
    });
  });

  // twitter --------------------------------
  app.get('/unlink/twitter', function(req, res) {
    var user           = req.user;
    user.twitter.token = undefined;
    user.save(function(err) {
      res.redirect('/profile');
    });
  });

  // google ---------------------------------
  app.get('/unlink/google', function(req, res) {
    var user          = req.user;
    user.google.token = undefined;
    user.save(function(err) {
      res.redirect('/profile');
    });
  });


};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}