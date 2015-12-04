'use strict';
var path = require('path');

var createPattern = function(path) {
  return {pattern: path, included: true, served: true, watched: false};
};

var Gherkin = require('gherkin');
var parser = new Gherkin.Parser();

var createPreprocessor = function(logger, files) {
  files.unshift(createPattern(__dirname + '/adapter.js'));
  files.unshift(createPattern(require.resolve('apolog')));
  files.unshift(createPattern(require.resolve('is-generator')));
  files.unshift(createPattern(__dirname + '/module.js')); // is it a joke!??
  var log = logger.create('preprocessor.apolog');
  log.info("loading Gherkin parser");

  return function processor(content, file, done) {
    var result = parser.parse(content);
    return done('___loadFeature___(' + JSON.stringify(result) + ', ' + JSON.stringify(file) + ');');
  }
}

createPreprocessor.$inject = ['logger', 'config.files']

module.exports = {
  'preprocessor:apolog': ['factory', createPreprocessor]
};
