# Karma Apolog

## How to use  
1. npm install --save-dev karma-apolog
1. configure the preprocessor apolog in karma.conf.js
1. write features and specs
1. run karma

In order to configure the preprocessor in _karma.conf.js_ just add a path that points to "apolog". E.g:
```
preprocessor: {
  'features/**/*.feature': 'apolog'
},
...
```
So, the example above will preprocess all files located at _"features/**/*.feature"_ with [Apolog](https://github.com/rianby64/apolog).
Don't forget to setup the path for features. E.g.:
```
    // list of files / patterns to load in the browser
    files: [
        'features/**/*.features',
        'test/**/*.test.js',
        'src/**/*.js'
    ],
```


