
(function(window) {
  'use strict';

  var apolog = window.apolog,
      karma = window.__karma__,
      initLoadedFn = karma.loaded;

  karma.loaded = function loaded() {
    // indeed for karma we don't need any parser
    apolog.setup({ parser: true }); // check index.js line 19: BUG!
    var result = apolog.run();
    if (result instanceof Array) {
      result.forEach(function(item) {
        karma.log('error', [item.message]);
      });
    }
    initLoadedFn.call(karma);
  }

  // private function
  window.___loadFeature___ = function loadFeature(feature, file){
    return apolog.loadFeature(feature, file);
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
  window.feature = function feature(name, fn, thisArg) {
    return apolog.feature(name, fn, thisArg);
  }
  /**
   * Function to define a background
   * @param {String|RegExp} name
   * @param {bodyTestFn} fn
   * @param {Object} thisArg
   */
  window.background = function background(name, fn, thisArg) {
    return apolog.background(name, fn, thisArg);
  }
  /**
   * Function to define an scenario
   * @param {String|RegExp} name
   * @param {bodyTestFn} fn
   * @param {Object} thisArg
   */
  window.scenario = function scenario(name, fn, thisArg) {
    return apolog.scenario(name, fn, thisArg);
  }
  /**
   * Function to define an step.
   * @param {String|RegExp} name
   * @param {bodyTestFn} fn
   * @param {Object} thisArg
   */
  window.step = function step(name, fn, thisArg) {
    return apolog.step(name, fn, thisArg);
  }
  /**
   * Function to define a given step.
   * @param {String|RegExp} name
   * @param {bodyTestFn} fn
   * @param {Object} thisArg
   */
  window.given = function given(name, fn, thisArg) {
    return apolog.given(name, fn, thisArg);
  }
  /**
   * Function to define a when step.
   * @param {String|RegExp} name
   * @param {bodyTestFn} fn
   * @param {Object} thisArg
   */
  window.when = function when(name, fn, thisArg) {
    return apolog.when(name, fn, thisArg);
  }
  /**
   * Function to define a then step.
   * @param {String|RegExp} name
   * @param {bodyTestFn} fn
   * @param {Object} thisArg
   */
  window.then = function then(name, fn, thisArg) {
    return apolog.then(name, fn, thisArg);
  }
  /**
   * Function to define a but step.
   * @param {String|RegExp} name
   * @param {bodyTestFn} fn
   * @param {Object} thisArg
   */
  window.but = function but(name, fn, thisArg) {
    return apolog.but(name, fn, thisArg);
  }
  /**
   * Function to define an and step.
   * @param {String|RegExp} name
   * @param {bodyTestFn} fn
   * @param {Object} thisArg
   */
  window.and = function and(name, fn, thisArg) {
    return apolog.and(name, fn, thisArg);
  }



})(typeof window !== 'undefined' ? window : global);

