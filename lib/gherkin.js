'use strict';
function Gherkin() {
  var _definitions = {},
      _features = [],
      _parent,
      world = new World(),
      lastId = 0,
      that = this;

  function World() { }

  function setParent(parent) {
    _parent = parent;
  }
  function getParent() {
    return _parent;
  }

  /**
   * Add a definition to the stack.
   * @param {RegExp, String} name - The identificator to match with a defition from .feature content.
   * @param {Function} fn - The function that will be executed.
   * @param {Object} thisArg.
   * @param {String} type - can be one of the values "feature", "scenario" or "step"
   */
  function addDefinition(type, name, fn, thisArg) {
    var definitions,
        id,
        _thisArg = thisArg,
        parent = getParent();

    if ((type === that.CONST_FEATURE) || (type === that.CONST_SCENARIO)) {
      definitions = {};
    }

    if (type === that.CONST_FEATURE) { id = fn.featureId; }
    else if (type === that.CONST_SCENARIO) { id = fn.scenarioId; }
    else { id = fn.stepId; }

    // Inherits the thisArg context from parent
    if (!_thisArg && parent) {
      _thisArg = parent.thisArg;
    }
    // And if nothing is given, set the world by default
    if (!_thisArg) {
      _thisArg = world;
    }

    if (parent) {
      parent.definitions[lastId] = {
        id: id,
        name: name,
        type: type,
        fn: fn,
        thisArg: _thisArg,
        parent: parent,
        definitions: definitions
      }
    }
    else {
      _definitions[lastId] = {
        id: id,
        name: name,
        type: type,
        fn: fn,
        thisArg: _thisArg,
        parent: undefined,
        definitions: definitions
      }
    }
    lastId++;
  }

  function getDefinitions() {
    return _definitions;
  }

  function addFeature(feature) {
    _features.push(feature)
  }

  function getFeatures() {
    return _features;
  }

  function reset() {
    _definitions = {};
    _features = [];
    _parent = undefined;
    this.featureId = this.scenarioId = this.stepId = 0;
  }

  this.addDefinition = addDefinition;
  this.addFeature = addFeature;

  this.getDefinitions = getDefinitions;
  this.getFeatures = getFeatures;

  this.setParent = setParent;
  this.getParent = getParent;
  this.reset = reset;

  this.world = world;
}

Gherkin.prototype.CONST_FEATURE = "Feature";
Gherkin.prototype.CONST_SCENARIO = "Scenario";
Gherkin.prototype.CONST_STEP = "Step";
Gherkin.prototype.CONST_WHEN = "When";
Gherkin.prototype.CONST_THEN = "Then";
Gherkin.prototype.CONST_GIVEN = "Given";
Gherkin.prototype.featureId = 0;
Gherkin.prototype.scenarioId = 0;
Gherkin.prototype.stepId = 0;

/**
 * apply definition to describe() or it()
 * @param {object} feature given from .feature
 * @param {function} definitionFn given from .test.js
 * @param {array} args given by matching feature.name with definitionFn.regExp
 */
Gherkin.prototype.applyDefinition = function applyDefinition(feature, definition, args) {
  var that = this,
      currentParent = this.getParent();

  function enveloper() {
    that.setParent(definition);
    return definition.fn.apply(definition.thisArg, args);
  }
  function appendFilePathToScenario(scenario) {
    scenario.file = feature.file;
    return this.processDefinition(that.CONST_SCENARIO, scenario);
  }
  function appendFilePathToStep(step) {
    step.file = feature.file;
    return this.processStep(step);
  }
  describe(feature.name, enveloper);
  if (feature.hasOwnProperty('scenarioDefinitions')) {
    feature.scenarioDefinitions.forEach(appendFilePathToScenario, this);
  }
  else if (feature.hasOwnProperty('steps')) {
    feature.steps.forEach(appendFilePathToStep, this);
  }
  this.setParent(currentParent);
}

/**
 * applying (object)feature.name against the regexp (feature)definition.(regexp)name
 * in order to define the args and define the fn
 * @param {object} feature - a feature from parsing the .feature file
 * @param {object} definition - a definition given by using feature(regexp|string, function)
 * @return {function} definitionFn, {array}args
 */
Gherkin.prototype.match = function match(feature, definition) {
  var result, args;
  if (feature.type !== definition.type) { return };
  if (definition.name.constructor === RegExp) {
    args = definition.name.exec(feature.name);
    if (args) { // the given regexp seems to fit the feature.name
      // seems that I need to study how to match strings to regexp
      if (args[0] === feature.name) { // because here I do an strange comparison
        args = args.slice(1); // and then eliminate the first element
      }
      result = definition;
    }
  }
  // just define the fn
  else if (definition.name.constructor === String) {
    if (definition.name === feature.name) {
      result = definition;
      args = [];
    }
  }
  // show error if nothing was found
  else {
    console.error('undefined type to identify the ' + feature.type + '"' + feature.name + '"' + ". This should be a regexp or an string object");
  }

  if (result) {
    return {
      definition: result,
      args: args
    };
  }
  return;
}

Gherkin.prototype.processStep = function processStep(step) {
  var parent = this.getParent(),
      definitions = parent.definitions,
      item, args, definitionFn, result;

  function enveloperAsync(done) {
    args.push(done); // TODO> is this enough? check the way to pass last arg to definitionFn
    return definitionFn.apply(result.definition.thisArg, args);
  }

  function enveloper() {
    return definitionFn.apply(result.definition.thisArg, args);
  }

  // Search process
  while (true) {
    for (item in definitions) {
      step.name = step.text;
      result = this.match(step, definitions[item]);

      if (result) {
        break;
      }
    }
    if (!parent || result) {
      break;
    }
    parent = parent.parent;
    if (!parent) {
      definitions = this.getDefinitions();
    }
    else {
      definitions = parent.definitions;
    }
  }

  if (result) { // if definitionFn found
    definitionFn = result.definition.fn;
    args = result.args;
    if (args.length < definitionFn.length) {
      it(step.text, enveloperAsync); // send to it the final version for definitionFn enveloped into an enveloper
    }
    else {
      it(step.text, enveloper); // send to it the final version for definitionFn enveloped into an enveloper
    }
    return;
  }
  // If no definition matchet at all
  else {
    // TODO> make the standard format for this warning
    // TODO> take in count the info given at definition.location
    console.error(step.type + '" not found "' + step.name + '" at ' + step.file.path);
  }
}

Gherkin.prototype.processDefinition = function processDefinition(type, definition) {
  var definitions, item, args, definitionFn, result, parent = this.getParent();

  if (parent) {
    definitions = parent.definitions;
  }
  else {
    definitions = this.getDefinitions();
  }

  while (true) {
    for (item in definitions) {
      result = this.match(definition, definitions[item]);

      if (result) {
        break;
      }
    }
    if (!parent || result) {
      break;
    }
    definitions = this.getDefinitions();
    parent = undefined;
  }
  // if definitionFn found
  if (result) {
    return this.applyDefinition(definition, result.definition, result.args);
  }
  // If no definition matchet at all
  else {
    // TODO> make the standard format for this warning
    // TODO> take in count the info given at definition.location
    console.error(definition.type + '" not found "' + definition.name + '" at ' + definition.file.path);
  }
}

Gherkin.prototype.run = function run() {
  this.getFeatures().forEach(this.processDefinition.bind(this, this.CONST_FEATURE), this);
}

Gherkin.prototype.loadFeature = function loadFeature(feature, file) {
  feature.file = file;
  this.addFeature(feature);
};

Gherkin.prototype.feature = function feature(name, fn, thisArg) {
  fn.featureId = ++this.featureId;
  return this.addDefinition(this.CONST_FEATURE, name, fn, thisArg);
};

Gherkin.prototype.scenario = function scenario(name, fn, thisArg) {
  fn.scenarioId = ++this.scenarioId;
  return this.addDefinition(this.CONST_SCENARIO, name, fn, thisArg);
};

Gherkin.prototype.step = function step(name, fn, thisArg) {
  fn.stepId = ++this.stepId;
  return this.addDefinition(this.CONST_STEP, name, fn, thisArg);
};

Gherkin.prototype.given = function given(name, fn, thisArg) {
  fn.stepId = ++this.stepId;
  return this.addDefinition(this.CONST_STEP, name, fn, thisArg);
};

Gherkin.prototype.when = function when(name, fn, thisArg) {
  fn.stepId = ++this.stepId;
  return this.addDefinition(this.CONST_STEP, name, fn, thisArg);
};

Gherkin.prototype.then = function then(name, fn, thisArg) {
  fn.stepId = ++this.stepId;
  return this.addDefinition(this.CONST_STEP, name, fn, thisArg);
};

// TODO> very poor way to support nodeJS and browser
var module = module || undefined;
if (module) {
  module.exports = Gherkin;
}
