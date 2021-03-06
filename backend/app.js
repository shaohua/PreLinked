var express = require('express');
var http = require('http');

global._    = require('underscore');
global.Q    = require('q');
global.app  = express();
global.analytics = require('analytics-node');

require('./config/environments.js')(app);
require('./config/db.js')(app);
require('./config/middleware.js')(app);
require('./config/routes.js')(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port') + ' in env: ' + app.get('env') );
});