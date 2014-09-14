'use strict';
//var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');


var GeneratorWebpublish = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = yeoman.file.readJSON(path.join(__dirname, '../package.json'));
    console.log(chalk.magenta('Initiating generator'));
    console.log(chalk.magenta('webpublish generator is designed to ease your workload for  generating digital content.'));
  },
/*
  askFor: function () {
    var done = this.async();

    // have Yeoman greet the user
    console.log(this.yeoman);


// replace it with a short and sweet description of your generator
    console.log(chalk.magenta('webpublish generator is designed to ease your workload for  generating digital content.'));
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
*/
  app: function () {
    this.mkdir('app');
    //this.mkdir('templates');

    // Create the local source directories that will be required by grunt

    // CSS is converted from SASS/SCSS but we can feed CSS directly
    this.mkdir('app/css');
    // We populated the source/sass directory with content from
    // https://github.com/caraya/sass-repo to provide a starting point
    this.mkdir('source/sass');
    this.mkdir('source/css');

    // JS is converted from COFFEE but we have the option to feed JS directly
    this.mkdir('app/js');
    this.mkdir('source/coffee');
    this.mkdir('source/js');

    // Copy our master Modernizr build to the source directory
    // so we can use the modernizr grunt task
    this.copy('modernizr-dev.js', 'source/modernizr-dev.js'
              
    // Copy the content from src/sass to source/sass to make it easier
    this.copy('sass/**/*.scss', 'source/sass/');

    // Create the files required for markdown/assemble use
    // They wil be saved to the root of the app directory that has already
    // been created
    this.mkdir('source/content/layout');
    // Right now we are not using partials, this may change in the future as we get lazy
    this.mkdir('source/content/partials')
    this.mkdir('source/content/ pages');
    // Copy sample files to the right directories under markdown
    this.copy('**/*.md', 'source/markdown/pages/');
    // Copy templates
    this.copy('**/*.hbs', 'source/markdown/layout/');
    // Copy partials, if any
    this.copy('partials/**/*.hbs', 'source/markdown/layout/');

    // Copy the package templates into their final location
    this.copy('_package.json', 'package.json');
    this.copy('_bower.json', 'bower.json');
    this.copy('_Gruntfile.js', 'Gruntfile.js');
  },
GeneratorWebpublish
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

module.exports = GeneratorWebpublish;
