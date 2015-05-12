module.exports = function(app, passport) {
  var mongoose = require('mongoose');
  
//load up the Site model
  var Site              = require('../models/site');
  var ProtoSite              = require('../models/proto-site');
  var FormElement       = require('../models/formElement');

// normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get('/site', isLoggedIn, function(req, res) {
    ProtoSite.find({}, {}, function(err, sites) {
      var errors = [];
      if (err){ // if there are any errors, return the error to createSite.jade to be displayed to user
        errors.push(err);
        res.render('createSite.jade',
                   {message: errors,
                    csrfToken: req.csrfToken()}
        );
      }
      if (!sites){ //No site was found by this name, lets create one.
    
        
      }else{
        console.log("Rendering Site: " + sites);
        res.render('createSite.jade',
            {csrfToken: req.csrfToken(),
             sites: sites}
         );
      }
      
        
  });
    
    
    //possibly create a new site here?
   // res.render('createSite.jade', {csrfToken: req.csrfToken()});
  });
  
  // a User is trying to make a new site
  app.post('/site/create', isLoggedIn, function(req, res){
    var siteName = req.body.siteName;
    var tagLine = req.body.tagLine;
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
        
        var MainTitle        = new FormElement();
        MainTitle.name = "MainTitle";
        MainTitle.value = req.body.MainTitle;
        MainTitle.type = "text";
        MainTitle.label = "Main Title";
        MainTitle.explaination = "The Main Title/Header of your new page.";
        
        var TagLine        = new FormElement();
        TagLine.name = "TagLine";
        TagLine.value = req.body.TagLine;
        TagLine.type = "text";
        TagLine.label = "Tag Line";
        TagLine.explaination = "The Tag Line of your new page.";
        
        var TwitterLink        = new FormElement();
        TwitterLink.name = "TwitterLink";
        TwitterLink.value = req.body.TwitterLink;
        TwitterLink.type = "text";
        TwitterLink.label = "Twitter Link";
        TwitterLink.explaination = "A Link to your twitter page.";
        
        var GithubLink        = new FormElement();
        GithubLink.name = "GithubLink";
        GithubLink.value = req.body.GithubLink;
        GithubLink.type = "text";
        GithubLink.label = "Github Link";
        GithubLink.explaination = "A Link to your Github page.";
        
        var FacebookLink        = new FormElement();
        FacebookLink.name = "FacebookLink";
        FacebookLink.value = req.body.FacebookLink;
        FacebookLink.type = "text";
        FacebookLink.label = "Facebook Link";
        FacebookLink.explaination = "A Link to your Facebook page.";
        
        var ServicesHeading        = new FormElement();
        ServicesHeading.name = "ServicesHeading";
        ServicesHeading.value = req.body.ServicesHeading;
        ServicesHeading.type = "text";
        ServicesHeading.label = "Services Heading";
        ServicesHeading.explaination = "The Heading to your 'Service' Section.";
        
        var ServicesSubheading        = new FormElement();
        ServicesSubheading.name = "ServicesSubheading";
        ServicesSubheading.value = req.body.ServicesSubheading;
        ServicesSubheading.type = "text";
        ServicesSubheading.label = "Services Subheading";
        ServicesSubheading.explaination = "The Subheading to your 'Service' Section.";
        
        var ServicesParagraph        = new FormElement();
        ServicesParagraph.name = "ServicesParagraph";
        ServicesParagraph.value = req.body.ServicesParagraph;
        ServicesParagraph.type = "text";
        ServicesParagraph.label = "Services Paragraph";
        ServicesParagraph.explaination = "A short paragraph explaining your services.";
        
        var GoogleLink        = new FormElement();
        GoogleLink.name = "GoogleLink";
        GoogleLink.value = req.body.GoogleLink;
        GoogleLink.type = "text";
        GoogleLink.label = "Google Link";
        GoogleLink.explaination = "A Link to your Google page.";
        
        var LinkedinLink        = new FormElement();
        LinkedinLink.name = "LinkedinLink";
        LinkedinLink.value = req.body.LinkedinLink;
        LinkedinLink.type = "text";
        LinkedinLink.label = "Linked-In Link";
        LinkedinLink.explaination = "A Link to your Linked-In page.";
        
        newSite.name = req.body.siteName;
        newSite.email = req.body.email;
        newSite.templateFile = req.body.templateFile;
        newSite.thumbnail = req.body.thumbnail;
        newSite.owner = owner._id;
        newSite.formElements = [MainTitle, TagLine, TwitterLink, GithubLink, FacebookLink, ServicesHeading, ServicesSubheading, ServicesParagraph, GoogleLink, LinkedinLink];
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
  
  app.post('/site/edit/:siteName', isLoggedIn, function(req, res){
    var siteName = req.params.siteName;
    var regexSiteName = new RegExp(["^",siteName,"$"].join(""),"i"); //ignore capitalization
    var formElements = [];
    
    
    var MainTitle        = new FormElement();
    MainTitle.name = "MainTitle";
    MainTitle.value = req.body.MainTitle;
    MainTitle.type = "text";
    MainTitle.label = "Main Title";
    MainTitle.explaination = "The Main Title/Header of your new page.";
    formElements.push(MainTitle);
    
    var TagLine        = new FormElement();
    TagLine.name = "TagLine";
    TagLine.value = req.body.TagLine;
    TagLine.type = "text";
    TagLine.label = "Tag Line";
    TagLine.explaination = "The Tag Line of your new page.";
    formElements.push(TagLine);
    
    
    var TwitterLink        = new FormElement();
    TwitterLink.name = "TwitterLink";
    TwitterLink.value = req.body.TwitterLink;
    TwitterLink.type = "text";
    TwitterLink.label = "Twitter Link";
    TwitterLink.explaination = "A Link to your twitter page.";
    formElements.push(TwitterLink);
    
    var GithubLink        = new FormElement();
    GithubLink.name = "GithubLink";
    GithubLink.value = req.body.GithubLink;
    GithubLink.type = "text";
    GithubLink.label = "Github Link";
    GithubLink.explaination = "A Link to your Github page.";
    formElements.push(GithubLink);
    
    var FacebookLink        = new FormElement();
    FacebookLink.name = "FacebookLink";
    FacebookLink.value = req.body.FacebookLink;
    FacebookLink.type = "text";
    FacebookLink.label = "Facebook Link";
    FacebookLink.explaination = "A Link to your Facebook page.";
    formElements.push(FacebookLink);
    
    var ServicesHeading        = new FormElement();
    ServicesHeading.name = "ServicesHeading";
    ServicesHeading.value = req.body.ServicesHeading;
    ServicesHeading.type = "text";
    ServicesHeading.label = "Services Heading";
    ServicesHeading.explaination = "The Heading to your 'Service' Section.";
    formElements.push(ServicesHeading);
    
    var ServicesSubheading        = new FormElement();
    ServicesSubheading.name = "ServicesSubheading";
    ServicesSubheading.value = req.body.ServicesSubheading;
    ServicesSubheading.type = "text";
    ServicesSubheading.label = "Services Subheading";
    ServicesSubheading.explaination = "The Subheading to your 'Service' Section.";
    formElements.push(ServicesSubheading);
    
    var ServicesParagraph        = new FormElement();
    ServicesParagraph.name = "ServicesParagraph";
    ServicesParagraph.value = req.body.ServicesParagraph;
    ServicesParagraph.type = "text";
    ServicesParagraph.label = "Services Paragraph";
    ServicesParagraph.explaination = "A short paragraph explaining your services.";
    formElements.push(ServicesParagraph);
    
    var GoogleLink        = new FormElement();
    GoogleLink.name = "GoogleLink";
    GoogleLink.value = req.body.GoogleLink;
    GoogleLink.type = "text";
    GoogleLink.label = "Google Link";
    GoogleLink.explaination = "A Link to your Google page.";
    formElements.push(GoogleLink);
    
    var LinkedinLink        = new FormElement();
    LinkedinLink.name = "LinkedinLink";
    LinkedinLink.value = req.body.LinkedinLink;
    LinkedinLink.type = "text";
    LinkedinLink.label = "Linked-In Link";
    LinkedinLink.explaination = "A Link to your Linked-In page.";
    formElements.push(LinkedinLink);
    
    
    
    
    req.body.formElements = formElements;
    Site.findOneAndUpdate({name:regexSiteName}, req.body, function (err, site) {
      //res.send(site);
      res.redirect('/site/'+siteName);
    });
   // res.send({message : "editing Site " + siteName, body: req.body});
  });
  
  app.get('/site/edit/:siteName', isLoggedIn, function(req, res){
    var siteName = req.params.siteName;
    var regexSiteName = new RegExp(["^",siteName,"$"].join(""),"i"); //ignore capitalization
    ProtoSite.find({}, {}, function(err, sites) {
      var errors = [];
      if (err){ // if there are any errors, return the error to createSite.jade to be displayed to user
        errors.push(err);
        res.send({message: errors,
                    csrfToken: req.csrfToken()}
        );
      }
      if (!sites){ //No site was found by this name, lets create one.
        res.send({message: "no proto sites found"});
        
      }else{ // proto sites were found, now we want to find *this site*
        //start of site finder
        Site.findOne({name: siteName}, {}, function(err, site) {
          var errors = [];
          if (err){ // if there are any errors, return the error to createSite.jade to be displayed to user
            errors.push(err);
            res.send({message: errors,
                        csrfToken: req.csrfToken()}
            );
          }
          if (!site){ //No site was found by this name, lets create one.
            res.send({message: "this site not found"});
            
          }else{ // proto sites were found, now we want to find *this site*
            res.render('editSite.jade', {csrfToken: req.csrfToken(),
                                         thisSite: site,
                                         sites : sites});
          } 
        });
        //end of site finder
      }
      
        
    });
  });
  
  // INDIVIDUAL SITES =========================
  app.get('/site/:siteName', function(req, res){
    var siteName = req.params.siteName;
    var regexSiteName = new RegExp(["^",siteName,"$"].join(""),"i"); //ignore capitalization
    Site.findOne({ 'name' :  regexSiteName }, "name email tagLine configCategories templateFile owners formElements", function(err, site) {
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
            {site: site,
              csrfToken: req.csrfToken()});
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