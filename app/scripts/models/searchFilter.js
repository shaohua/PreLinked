/*global PreLinked, Backbone*/

PreLinked.Models.SearchfilterModel = Backbone.Model.extend({

  initialize: function() {
    this.set('jobTitle', []);
    this.set('company', []);
    this.set('jobLocation', "");
    this.set('jobKeywords', []);
    this.set('distance', 25);
    this.set('minSalary', 'none');
    this.set('maxSalary', 'none');
    this.on('addSearchFilter', this.addSearchFilter);
    this.on('addSearchFilterOnSubmit', this.addSearchFilterOnSubmit);
    this.on('removeSearchFilter', this.removeSearchFilter);
  },

  isDuplicateFilter: function(filterType, filterWord) {
    var filterArray = this.get(filterType);
    return _.contains(filterArray, filterWord)
  },

  addSearchFilter: function(e, title, company, location, keywords) {
    if(title && !this.isDuplicateFilter('jobTitle', title)) {
      this.attributes.jobTitle.push(title);
    } 
    if(company && !this.isDuplicateFilter('company', company)) {
      this.attributes.company.push(company);
    }
    if(location) {
      this.set('jobLocation', location);
    }
    if(keywords && !this.isDuplicateFilter('jobKeywords', keywords)) {
      this.attributes.jobKeywords.push(keywords);
    }
  },

  addSearchFilterOnSubmit: function(title, company, location, keywords, minSalary, maxSalary) {
    if(title && !this.isDuplicateFilter('jobTitle', title)) {
      this.attributes.jobTitle.push(title);
    }
    if(company && !this.isDuplicateFilter('company', company)) {
      this.attributes.company.push(company);
    }
    if(location) {
      this.set('jobLocation', location);
    }
    if(keywords && !this.isDuplicateFilter('jobKeywords', keywords)) {
      this.attributes.jobKeywords.push(keywords);
    }
    if(minSalary) {
      this.set('minSalary', minSalary);
    }
    if(maxSalary) {
      this.set('maxSalary', maxSalary);
    }
    console.log(this.attributes);
  },

  removeSearchFilter: function(e) {
    var filterType = e.target.className.split(' ')[1];
    var elToRemove = e.target.className.split(' ')[2];
    if(filterType === 'removeJobTitleFilter') {
      var jobTitleArray = this.get('jobTitle');
      var indexToRemove = _.indexOf(jobTitleArray, elToRemove);
      jobTitleArray.splice(indexToRemove, 1);
      this.set('jobTitle', jobTitleArray);
    } else if(filterType === 'removeCompanyFilter') {
      var companyArray = this.get('company');
      var indexToRemove = _.indexOf(companyArray, elToRemove);
      companyArray.splice(indexToRemove, 1);
      this.set('company', companyArray);
    } else if(filterType === 'removeJobLocationFilter') {
      this.set('jobLocation', '');
    } else if(filterType === 'removeJobKeywordsFilter') {
      var jobKeywordsArray = this.get('jobKeywords');
      var indexToRemove = _.indexOf(jobKeywordsArray, elToRemove);
      jobKeywordsArray.splice(indexToRemove, 1);
      console.log('keywords after splice', jobKeywordsArray);
      this.set('jobKeywords', jobKeywordsArray);
      console.log('keywords after set', this.get('jobKeywords'));
    }
  },

  parseDataForSearch: function() {
    var searchQuery = {};
    searchQuery.location = this.get('jobLocation');

    var minSalary = this.get('minSalary');
    var maxSalary = this.get('maxSalary');
    var salary;

    if(minSalary > maxSalary) {
      minSalary = '$' + minSalary + ',000';
      maxSalary = null;
    } else {
      if(typeof minSalary === 'number') {
        minSalary = '$' + minSalary + ',000';
      } else {
        minSalary = 0;
      }
      if(typeof maxSalary === 'number') {
        maxSalary = '$' + maxSalary + ',000';
      } else {
        maxSalary = 0;
      }
    }

    if(minSalary && maxSalary) {
      salary = minSalary + '-' + maxSalary;
    } else if(minSalary && !maxSalary) {
      salary = minSalary;
    } else {
      salary = '$0,000-' + maxSalary;
    }

    

    console.log('SALARIES >>>>>>>>',minSalary, maxSalary);

    var title = this.get('jobTitle');
    var company = this.get('company');
    var keywords = this.get('jobKeywords');

    if(title.length) {
      searchQuery.title = "title:(";
      for(var i = 0; i < title.length; i++) {
        searchQuery.title += "'" + title[i] + "'";
        if (i !== title.length - 1 ){
          searchQuery.title += " or ";
        }
      }
      searchQuery.title += ")";
    } else {
      searchQuery.title = '';
    }
    console.log('title qued >>>>>> ', searchQuery.title);

    if(company.length) {
      searchQuery.company = "company:(";
      for(var i = 0; i < company.length; i++) {
        searchQuery.company += "'" + company[i] + "'";
        if (i !== company.length - 1 ){
          searchQuery.company += " or ";
        }
      }
      searchQuery.company += ")";
    } else {
      searchQuery.company = '';
    }
    console.log('company qued >>>>>> ', searchQuery.company);
    console.log('keywords >>>>>> ', keywords);

    if(keywords.length) {
      searchQuery.keywords = "(";
      for(var i = 0; i < keywords.length; i++) {
        searchQuery.keywords += "'" + keywords[i] + "'";
        if (i !== keywords.length - 1 ){
          searchQuery.keywords += " or ";
        }
      }
      searchQuery.keywords += ")";
    } else {
      searchQuery.keywords = '';
    }
    console.log('keywords qued >>>>>> ', searchQuery.keywords);

    return searchQuery;
  }
});
