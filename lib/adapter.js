(function(window) {
  'use strict';
  var gherkin = new Gherkin(),
      karma = window.__karma__,
      initLoadedFn = karma.loaded;

  karma.loaded = function loaded() {
    gherkin.run();
    initLoadedFn.call(karma);
    gherkin.reset();
  }

  // private function
  window.___loadFeature___ = function loadFeature(feature, file){
    return gherkin.loadFeature(feature, file);
  }

  /**
   * Function that is passed to describe|it process.
   *
   * @function bodyTestFn
   * @param {...*} args - multiple args filled by matching a given description from feature with the RegExp
   * @param {Function} done - used for the test framework to indicate async execution
   */

  /**
   * Function to define a feature
   * @param {String|RegExp} name
   * @param {bodyTestFn} fn
   * @param {Object} thisArg
   */
  var featureId = 0, scenarioId = 0, stepId = 0;
  window.feature = function feature(name, fn, thisArg) {
    fn.featureId = ++featureId;
    return gherkin.feature(name, fn, thisArg);
  }
  /**
   * Function to define an scenario
   * @param {String|RegExp} name
   * @param {bodyTestFn} fn
   * @param {Object} thisArg
   */
  window.scenario = function scenario(name, fn, thisArg) {
    fn.scenarioId = ++scenarioId;
    return gherkin.scenario(name, fn, thisArg);
  }
  /**
   * Function to define an step.
   * @param {String|RegExp} name
   * @param {bodyTestFn} fn
   * @param {Object} thisArg
   */
  window.step = function step(name, fn, thisArg) {
    fn.stepId = ++stepId;
    return gherkin.step(name, fn, thisArg);
  }
  /**
   * Function to define a given step.
   * @param {String|RegExp} name
   * @param {bodyTestFn} fn
   * @param {Object} thisArg
   */
  window.given = function given(name, fn, thisArg) {
    fn.stepId = ++stepId;
    return gherkin.given(name, fn, thisArg);
  }
  /**
   * Function to define a when step.
   * @param {String|RegExp} name
   * @param {bodyTestFn} fn
   * @param {Object} thisArg
   */
  window.when = function when(name, fn, thisArg) {
    fn.stepId = ++stepId;
    return gherkin.when(name, fn, thisArg);
  }
  /**
   * Function to define a then step.
   * @param {String|RegExp} name
   * @param {bodyTestFn} fn
   * @param {Object} thisArg
   */
  window.then = function then(name, fn, thisArg) {
    fn.stepId = ++stepId;
    return gherkin.then(name, fn, thisArg);
  }

})(typeof window !== 'undefined' ? window : global);
