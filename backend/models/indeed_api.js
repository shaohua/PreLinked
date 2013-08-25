var request = require('request');

var IndeedApi = module.exports = {};

var endPoint = 'http://api.indeed.com/ads/apisearch',
    defaults = {
      publisher: app.get('indeed-id'),
      v:        '2',      // API version
      format:   'json',   // json/xml
      latlong:  '1',      // return geo coordiantes for each result
      filter:   '1',      // filter duplicate results
      sort:     'relevance',
      limit:    '25', // max limit per page is 25
      highlight: '0'
    };

// GET /jobs/search
IndeedApi.search = function (query, start, testCallback) {
  console.log('- GET /jobs/search - query >> ', query);


  var deferred = Q.defer();
  request({
    method: 'GET',
    url: endPoint,
    qs: _.extend(defaults, query, start) // query properties will override defaults
    },function(error, response, body){
      if (error) {
        deferred.reject(error);
      } else {
        try {
          if (testCallback){
            testCallback(body);
          }
          body = JSON.stringify(JSON.parse(body).results);
          deferred.resolve(body);
        } catch (error){
          console.log('- IndeedApi error: ', error, body);
          deferred.reject(body);
        }
      }
  });
  return deferred.promise;
};

var parseJobQueryForIndeed = function(query) {

    var apiQuery = {};
    var title    = query.jobTitle,
        company  = query.company,
        keywords = query.jobKeywords;

    if(title.length) {
      apiQuery.title = "title:(";
      for(var i = 0; i < title.length; i++) {
        apiQuery.title += "'" + title[i] + "'";
        if (i !== title.length - 1 ){
          apiQuery.title += " or ";
        }
      }
      apiQuery.title += ")";
    }

    if(company.length) {
      apiQuery.company = "company:(";
      for(var i = 0; i < company.length; i++) {
        apiQuery.company += "'" + company[i] + "'";
        if (i !== company.length - 1 ){
          apiQuery.company += " or ";
        }
      }
      apiQuery.company += ")";
    }

    if(keywords.length) {
      apiQuery.keywords = "(";
      for(var i = 0; i < keywords.length; i++) {
        apiQuery.keywords += "'" + keywords[i] + "'";
        if (i !== keywords.length - 1 ){
          apiQuery.keywords += " or ";
        }
      }
      apiQuery.keywords += ")";
    }

    apiQuery.q
    apiQuery.l      = query.location;
    apiQuery.radius = query.distance;
    return apiQuery;
  }

/*

&q=
  with all word: <word> <word> <word>
  exact phrase: "software engineer"
  or: (high school teacher or plumber)
  title:   title:(elementary school teacher)
           title:(elementary school teacher) or title:(high school teacher)

&l= *     // location: zipcode or city, state combo
  l=12345
  l=San+Francisco%2C+CA

&co=us        // default=us. country
&sort=        // default = relevance. Options: relevance / date
&radius=      // default =25. radius from location
&st=          // Site Type: jobsite / employer
&jt=          // Job Type:  fulltime / partime / contract / internship / temporary
&start=       // start result at, default=0
&limit= *     // max number of result per query, default is 10
&fromage= *   // number of days back to search
&highlight=   // default=0, 1 will bold terms in the query
&chnl         // Not Applicable
&userip= *    // client IP number
&useragent= * // User-Agent from client's http requst header

*/