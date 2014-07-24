/* global module:false indent:2 */
(function () {
  'use strict';

  module.exports = function (grunt) {
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),

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

        sass: {
          // We have two different targets for SASS.
          // The dist target produced code in the compressed format, less bytes to push through the wire
          // both versions will generate a sourcemap
          dist: {
            options: {
              style: 'compressed',
              sourcemap: true
            },
            expand: true,
            cwd: 'source/sass/',
            src: ['**/*.scss'],
            dest: 'source/css/',
            ext: '.css'
          },

          // dev will create an expanded version of the file to make sure that we can troubleshoot any problems.
          dev: {
            options: {
              style: 'expanded',
              debugInfo: true,
              lineNumbers: true,
              lineComments: true,
              sourcemap: true
            },
            expand: true,
            cwd: 'source/sass/',
            src: ['**/*.scss'],
            dest: 'source/css/',
            ext: '.css'
          }
        },

        autoprefixer: {
          // Experimenally creating an autoprefixer task using caniuse's database
          // It is configured to check the last two versions of a browser, IE8
          // The last two versions of IE are 9 and 10 so IE 9 should be taken care of
          options: {
            browsers: ['last 2 version',  'ie 8'],
            map: true
          },

          // prefix the specified file
          singleFile: {
            options: {
              // Target-specific options go here.
            },
            src: 'source/css/<%= pkg.name %>-<%= pkg.version %>-concat.css',
            dest: 'source/css/<%= pkg.name %>-<%= pkg.version %>-concat-prefixed.css'
          },
          sourcemap: {
            options: {
              map: true
            },
            src: 'source/css/<%= pkg.name %>-<%= pkg.version %>-concat.css',
            dest: 'source/css/<%= pkg.name %>-<%= pkg.version %>-concat-prefixed.css.map'
            // -> dest/css/file.css, dest/css/file.css.map
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
            dest: ['source/js/<%= pkg.name %>-<%= pkg.version %>-concat.js'],
            nonull: true
          },
          css: {
            // concatenate the css files
            src: ['source/css/**/*.css'],
            dest: ['source/css/<%= pkg.name %>-<%= pkg.version %>-concat.css'],
            nonull: true
          }
        },

        cssmin: {
          dist: {
            // We want to pick the concatenated package for minimizing, otherwise it makes no sense
            // we pick up the name from the concat:css task.
            // We only do this in production as development we want to see the  code as is, not as it was
            // minimized
            src: 'source/css/<%= pkg.name %>-<%= pkg.version %>-concat-prefixed.css',
            dest: 'source/css/<%= pkg.name %>-<%= pkg.version %>-min.css'
          }
        },

        coffee: {
          compile: {
            files: {
              //compile the coffee files into their own js files, we'll handle concatenation and
              // minification in a different task
              'source/js/**/*.js': ['source/coffee/**/*.coffee']
            }
          }
        },

        bower: {
          // We have configured bower to install additional libraries. See the bower.json
          // for more information and http://bower.io/ for more informaton about
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
          // Clean up any compiled files. Zeroes the project to start again
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

          copy: {
            js: {
              files: [
                {
                  expand: true,
                  src: ['/source/js/{a,b}'],
                  dest: 'dest/'
                }
              ]
            },
            css: {
              files: [
                {expand: true, src: ['path/**'], dest: 'dest/'}
              ]
            }
          },

          csslint: {
            // Make sure you lint your css files after you've converted the SASS into CSS,
            // Otherwise it will fail because there are no CSS files to inspect :)
            options: {
            // We are using an external file to load the rules  to make sure we can change them easier.
              csslintrc: '.csslintrc',
              formatters: [
                {
                  id: 'text',
                  dest: 'report/csslint.txt'
                },
                {
                  id: 'csslint-xml',
                  dest: 'report/csslint.xml'
                }
              ]
            },
            strict: {
              options: {
                import: 2
              },
              src: ['css/**/*.css']
            },
            lax: {
              options: {
                import: false
              },
              src: ['css/**/*.css']
            }
          },

          assemble: {
            // All the content (documentation and publishable material) is written in
            // Markdown and we also have the option of writing the content in
            // Markdown using this task. Be aware that we will only rewrite your css
            // to make use of UNCSS later on. That will require the templates to use
            options: {
              // metadata
              data: ['data/*.{json,yml}'],

              // templates
              partials: ['templates/includes/*.hbs'],
              layout: ['templates/layouts/default.hbs'],

              // extensions
              middlweare: ['assemble-middleware-permalinks'],
            },

            // This is really all you need!
            pages: {
              src: ['docs/*.hbs'],
              dest: './'
            }
          },

          uncss: {
            // UNCSS will look at the specified HTML and CSS files and generate new stylesheet
            // that will only contain the CSS selectors that are actually used in the HTML files.
            // This has two advantages:
            // 1. It allows us to use large external libraries without being concerned with the size of
            // of the resulting CSS and eliminating the bloated stylesheets they sometimes create
            // 2. It allows the creation of a master CSS / SCSS library for all our projects and then
            // only using the selectors we need
            dist: {
              options: {
                ignore       : ['#added_at_runtime', /test\-[0-9]+/],
                media        : ['(min-width: 700px) handheld and (orientation: landscape)'],
                csspath      : '../public/css/',
                raw          : 'h1 { color: green }',
                stylesheets  : ['lib/bootstrap/dist/css/bootstrap.css', 'src/public/css/main.css'],
                ignoreSheets : [/fonts.googleapis/],
                urls         : ['http://localhost:3000/mypage', '...'], // Deprecated
                timeout      : 1000,
                htmlroot     : 'public',
                report       : 'min'
              },
              files: {
                'dist/css/tidy.css': ['app/index.html', 'app/about.html']
              }
            }
          },

          watch: {
            // Tracks changes on files and runs  specific tasks when changes are detected
            // While developing the Gruntfile.js it's a good idea to watch it and run jshint
            // whenever we make a change otherwise bugs become harder to track
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
              tasks: ['csslint:strict']
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

        });

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    // this will be our eventual default task once I figure out what it should be
    //grunt.registerTask('default', ['jshint', 'connect', 'jasmine', 'sass:dev']);
    grunt.registerTask('cleanAll', ['clean:html', 'clean:js', 'clean:css']);
    grunt.registerTask('jslint', ['jshint']);
  };
}()); // This closes the anonymous function that wraps the use strict call

