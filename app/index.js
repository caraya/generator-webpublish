'use strict';
//var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');


var StarterGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = yeoman.file.readJSON(path.join(__dirname, '../package.json'));

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.npmInstall();
      }
    });
  },

  askFor: function () {
    var done = this.async();

    // have Yeoman greet the user
    console.log(this.yeoman);

    // replace it with a short and sweet description of your generator
    console.log(chalk.magenta('You\'re using the fantastic Starter generator.'));

    var prompts = [{
      type: 'confirm',
      name: 'loadBowerDeps',
      message: 'Would you like to load the dependencies configured in Bower?',
      default: false
    },
    {
      type: 'confirm',
      name: 'skip-install',
      message: 'Install NPM dependencies',
      default: true
    }];

    this.prompt(prompts, function (props) {
      this.someOption = props.someOption;

      done();
    }.bind(this));
  },

  app: function () {
    this.mkdir('app');
    //this.mkdir('templates');

    // Create the local source directories that will be required by grunt

    // CSS is converted from SASS/SCSS
    this.mkdir('app/css');
    this.mkdir('source/sass');
    // JS is converted from COFFEE
    this.mkdir('app/js');
    this.mkdir('source/coffee');
    // Create the files required for markdown/assemble use
    // They wil be saved to the root of the app directory that has already
    // been created
    this.mkdir('source/markdown/layout');
    this.mkdir('source/markdown/pages');

    // Copy the package templates into their final location
    this.copy('_package.json', 'package.json');
    this.copy('_bower.json', 'bower.json');
    this.copy('_Gruntfile.js', 'Gruntfile.js');
  },

  projectfiles: function () {
    this.copy('editorconfig', '.editorconfig');
    // JSHint
    this.copy('jshintrc', '.jshintrc');
    // CSSLint configuration file
    this.copy('csslintrc', '.csslintrc');
    // Git related
    this.copy('gitattributes', '.gitattributes');
    this.copy('gitignore', '.gitignore');
    // Travis (if needed)
    this.copy('travis.yml', '.travis.yml');
  }
});

module.exports = StarterGenerator;
