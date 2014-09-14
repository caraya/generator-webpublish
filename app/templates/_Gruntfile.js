/* global module:false indent:2 */


(function () {
  'use strict';

  module.exports = function (grunt) {
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),


      sass: {
      /** SASS AND CSS TASKS
       *
       * We use SASS as the default for our stylesheets for a number of reasons
       * 1. It generates sourcemaps
       * 2. It allows for modular design
       *
       * The dist target produced code in the expanded format, 
       * since we'll concatenate and minimize the code later
       */
        dist: {
          options: {
            style: 'expanded',
            sourcemap: true
          },
          expand: true, // do we need this?
          cwd: 'source/sass/',
          src: ['*.scss'],
          dest: 'source/css/',
          ext: '.css'
        }
      },

      autoprefixer: {
        // Experimenally creating an autoprefixer task using caniuse's database
        // It is configured to check the last two versions of a browser (Firefox,
        // Opera, IE and Safari)
        //
        // The last two versions of IE are 11 and 10 so IE 9 abd IE8 have to be specified
        //
        // We also test for Firefox ESR as it may be different than the 'last 2' rule
        // See https://www.mozilla.org/en-US/firefox/organizations/faq/ for more on
        // Firefox ESR
        //
        // Chrome is an evergreen browser, it updates automatically which can be 
        // good or bad.See https://support.google.com/a/answer/33864 for 
        // Google's version of the 'last 2' rule
        //
        // We've added specific support for mobile browsers (safari, Opera, Chrome,
        // Firefox and IE)
        options: {
          browsers: ['last 2 version',  'ie 8', 'ie9', 'Firefox ESR',
          'iOS', 'OperaMobile', 'ChromeAndroid', 'FirefoxAndroid', 'ExplorerMobile'],
          map: true
        },

        // prefix the specified file
        dist: {
          options: {
            // Target-specific options go here.
          },
          src: 'source/css/<%= pkg.name %>-concat.css',
          dest: 'source/css/<%= pkg.name %>-concat-prefixed.css'
        }
      },

/*
      uncss: {
        // UNCSS will look at the specified HTML and CSS files and generate new 
        // stylesheet that will only contain the CSS selectors that are actually used in 
        // the HTML files.
        // This has two advantages:
        // 1. It allows us to use large external libraries without being concerned with 
        // the size of of the resulting CSS and eliminating the bloated stylesheets they 
        // sometimes create
        // 2. It allows the creation of a master CSS / SCSS library for all our projects 
        // and then only using the selectors we need
        // 
        // This needs to be separated from the other CSS/SASS tasks as it requires the 
        // pages to be already creataed.
        dist: {
          options: {
            ignore       : ['#added_at_runtime', /test\-[0-9]+/],
            media        : ['(min-width: 700px) handheld and (orientation: landscape)'],
            csspath      : '../public/css/',
            raw          : 'h1 { color: green }',
            // stylesheets  : ['lib/bootstrap/dist/css/bootstrap.css', 'src/public/css/main.css'],
            ignoreSheets : [/fonts.googleapis/],
            // urls         : ['http://localhost:3000/mypage', '...'], // Deprecated
            timeout      : 1000,
            htmlroot     : 'public',
            report       : 'min'
          },
          files: {
            'dist/css/tidy.css': ['app/index.html', 'app/about.html']
          }
        }
      },
*/
      cssmin: {
        options: {
          banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */'
        },
        dist: {
          files: {
            src: 'src/input.css',
            dest: 'dist/output.min.css'
          }
        }
      },

      csslint: {
        dist: {
          src: 'themes/base/*.css',
          rules: {}
        }
      },

      // JAVASCRIPT AND COFFEESCRIPT TASKS

      coffee: {
        compile: {
          files: {
            // Compile the coffee files into their own js files, we'll handle 
            // concatenation and minification in a different task
            'source/js/': ['source/coffee/**/*.coffee']
          }
        }
      },

      jshint: {
        // Hint the Gruntfile as you add things to it. You may or may not need this task.
        gruntfile: {
          src: 'Gruntfile.js'
        },
        // Hinting the other Javascript files
        source: {
          src: ['source/js/**/*.js'],
          options: {
            jshintrc: 'jshintrc'
          }
        }
      },

      uglify: {
        options: {
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
          report: 'min',
          mangle: true,
          sourceMap: 'source/js/<%= pkg.name %>-<%= pkg.version %>.map.js',
          sourceMapRoot: '/',
          sourceMapPrefix: 1,
          sourceMappingURL: 'source/js/<%= pkg.name %>-<%= pkg.version %>.map.js'
        },
        // We name the target production because there is no need to uglify
        // our code unless we're staging a production build.
        production: {
            files: {
              'source/js/<%= pkg.name %>-<%= pkg.version %>.min.js': ['source/js/source/css/<%= pkg.name %>-<%= pkg.version %>-concat-prefixed.css']
            }
          }
        },

        /* XHTML GENERATION TASKS */

          assemble: {
            // All the content (documentation and publishable material) is written in
            // Markdown and use it to populate pre-created templates.
            //
            // Be aware that we will only rewrite your css to make use of UNCSS later on.
            options: {
              // metadata
              data: ['data/*.{json,yml}'],

              // templates
              partials: ['source/content/partials/*.hbs'],
              layout: ['source/content/layouts/default.hbs'],

              // extensions are not being used as I don't know if we'll want to use
              // permalinks in all our projects. Uncomment if you want to use.
              //middlweare: ['assemble-middleware-permalinks'],

              marked: {
                //highlight: function  (lang, code)  {
                //  return  hljs.highlightAuto(lang, code).value;
                //}
                breaks: false,
                gfm: true,
                langPrefix: 'language-',
                pedantic: false,
                sanitize: false,
                silent: false,
                smartLists: true,
                smartypants: true,
                tables: true
              }
            },

            // This is really all you need!
            pages: {
              src: ['docs/*.hbs'],
              dest:'app/'
            }
          },

          /* UTILITY FUNCTIONS */
          bower: {
          // We have configured bower to install additional libraries. See the bower.json
          // for more information and http://bower.io for more informaton about
          // Bower
          install: {
            options: {
              targetDir: 'app/lib',
              layout: 'byType',
              install: true,
              verbose: false,
              cleanTargetDir: false,
              cleanBowerDir: false,
              bowerOptions: {}
            }
          }
        },

        clean: {
          html: {
            src: [
              'app/**/*.html'
              ]
            },

            js: {
              src: [
                'source/js/<%= pkg.name %>-<%= pkg.version %>.min.js',
                'source/js/<%= pkg.name %>-<%= pkg.version %>-concat.js'
              ]
            },

            css: {
              src: [
                'source/css/<%= pkg.name %>-<%= pkg.version %>-concat.css',
                'source/css/<%= pkg.name %>-<%= pkg.version %>-concat-prefixed.css',
                'source/css/<%= pkg.name %>-<%= pkg.version %>-min.css'
              ]
            }
          },

          watch: {
            // Tracks changes on files and runs  specific tasks when changes are detected
            // While developing the Gruntfile.js it's a good idea to watch it and run jshint
            // whenever we make a change otherwise bugs become harder to track
            //
            
            gruntfile: {
              files: 'Gruntfile.js',
              tasks: ['jshint:gruntfile'],
            },

            // Watch all other files, and peform the appropriate task. We have Javascript,
            // SASS and coffee.  We have both Javascript and Coffee because we have the
            // choice to pull in Javascript from third party sources and we can work on
            // either Javascript or Coffeescript as we prefer.
            js: {
              files: ['source/js/**/*.js'],
              tasks: ['jshint:source']
            },

            css: {
              files: ['source/css/**/*.css'],
              tasks: ['csslint:strict'],
              options: {
              // Start a live reload server on the default port 35729
              livereload: true
              }
            },

            sass: {
              files: ['source/sass/**/*.scss'],
              tasks: ['sass:dev']
            },

            coffee: {
              files: ['source/coffee/**/*.coffee'],
              tasks: ['coffee:compile']
            }
          },

          concat: {
            // Concatenates the specified files so we can reduce the number of HTTP requests
            // Note that we do not concatenate the files in the lib directory as those are third
            // party modules and I don't want to mess up with that
            options: {
              separator: ';',
            },

            js: {
              // concatenates all files under the JS directory.
              src: ['source/js/**/*.js'],
              dest: ['source/js/<%= pkg.name %>-concat.js'],
              nonull: true
            },

            css: {
              // concatenate the css files
              src: ['source/css/**/*.css'],
              dest: ['source/css/<%= pkg.name %>-concat.css'],
              nonull: true
            }
          },

      copy: {
      // Copy files from one location to another.
      // We use this to copy our finished css and Javascript to their production location
        js: {
          files: [
            {
              expand: true,
              src: ['/source/js/**/*.js'],
              dest: 'dest/'
            }
          ]
        },

        css: {
          files: [
            {
              src: ['js/**/*.js'],
              dest: 'dest/'
            }
          ]
        }
      },
        });

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    // this will be our eventual default task once I figure out what it should be
    //grunt.registerTask('default', ['jshint', 'connect', 'jasmine', 'sass:dev']);
    grunt.registerTask('cleanAll', ['clean:html', 'clean:js', 'clean:css']);
    grunt.registerTask('jslint', ['jshint']);
  };
}()); // This closes the anonymous function that wraps the use strict call

