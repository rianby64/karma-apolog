'use strict';
var path = require('path'),
    Gherkin = require('gherkin'),
    parser = new Gherkin.Parser();

function createPattern(path) {
  return {pattern: path, included: true, served: true, watched: false};
}

function createPreprocessor(logger, files) {
  var log = logger.create('preprocessor.apolog');
  log.info("loading Gherkin parser");

  files.unshift(createPattern(__dirname + '/adapter.js'));
  files.unshift(createPattern(require.resolve('apolog')));
  files.unshift(createPattern(__dirname + '/module.js')); // this joke is for is-generator module

  return function processor(content, file, done) {
    var result = parser.parse(content);
    return done('___loadFeature___(' + JSON.stringify(result) + ', ' + JSON.stringify(file) + ');');
  }
}

createPreprocessor.$inject = ['logger', 'config.files']

module.exports = {
  'preprocessor:apolog': ['factory', createPreprocessor]
};
