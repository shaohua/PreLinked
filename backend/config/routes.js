require('../controllers/passport.js');  //necessary to init passport?

var site      = require('../controllers/site.js');
var jobsCRUD      = require('../controllers/jobsCRUD.js');
var jobsSorted= require('../controllers/jobsSorted.js');
var linkedin  = require('../controllers/linkedin.js');
var persons   = require('../controllers/persons.js');
var getdb     = require('../controllers/getDb.js');
var personsCRUD = require('../controllers/personsCRUD.js');

var util      = require('../controllers/util.js');
var restrict  = util.restrict;

var testController = require('../controllers/testController.js');

module.exports = function(app) {

  //Jobs
  app.get('/jobs/search', jobsSorted.searchSorted);

  //LinkedIn Oauth
  app.get('/auth/linkedin', util.authLinkedinPassport, util.authLinkedinFunc );
  app.get('/auth/linkedin/callback', util.authLinkedinCallback);

  // User Session
  app.get('/logout', util.logout);
  app.get('/session', util.getSession);

  // LinkedIn API
  // currently decide whether live or dummy data is used
  app.get('/people/search', restrict, linkedin.searchConnections);
  app.get('/people/:id', restrict, linkedin.getProfile);
  app.get('/people', restrict, linkedin.searchFirstDegree);

  // Persons: data from our database
  app.get('/persons/searchRecent', restrict, persons.searchRecent);
  app.get('/persons/related', persons.getRelated);

  // /user
  app.get('/persons', personsCRUD.get);
  app.get('/persons/:id', personsCRUD.get);
  app.put('/persons', personsCRUD.put);  //this should NOT be allowed too
  app.put('/persons/:id', personsCRUD.put);
  app.post('/persons', personsCRUD.post);
  app.post('/persons/:id', personsCRUD.post);
  app.del('/persons', util.badIdea);
  app.del('/persons/:id', personsCRUD.delete);

  //server side rendering
  //used for /aboutus etc.
  app.get('/serverindex', site.index);

  //getDb
  // app.get('/getdb', restrict, getdb.testKeyword);
  // app.get('/savetodb', restrict, persons.getLinkedin);
  //test score
  app.get('/testScore', jobsSorted.testScore);

  //this is where you test random backend functions
  app.get('/test', testController.test);
};