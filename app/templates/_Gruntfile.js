(function () {
  'use strict';

  module.exports = function (grunt) {
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      copy: {
        build: {
          cwd: 'source',
          src: [ '**' ],
          dest: 'build',
          expand: true
        }
      },
      csslint: {
        // Make sure you lint your css files after you've converted the SASS into CSS,
        // Otherwise it will fail because there are no CSS files to inspect :
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
          src: ['app/css/**/*.css']
        },
        lax: {
          options: {
            import: false
          },
          src: ['app/css/**/*.css']
        }
      },

      assemble: {
        options: {
          layout: ['source/markdown/layout/default.hbs'],
          flatten: true
        },
        pages: {
          files: {
            'content/': ['source/markdown/pages/*.hbs']
          }
        }
      },

      jshint: {
          // We  have to separate hinting processes.
          // As we develop the Gruntfile it is a good idea to hint it periodically
          // or use the watch:gruntfile task created below.
          gruntfile: {
            src: ['_Gruntfile.js'],
            options: {
              jshintrc: '.jshintrc'
            }
          },
          // Hinting the rest of the other Javascript files
          source: {
            src: ['build/js/**/*.js'],
            options: {
              jshintrc: '.jshintrc'
            }
          }
        },

        coffee: {
          compile: {
            files: {
              //compile the coffee files into their own js files, we'll handle concatenation and
              // minification in a different task
              'app/js/**/*.js': ['build/coffee/**/*.coffee']
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
            cwd: 'build/sass/',
            src: ['*.scss'],
            dest: 'app/css/*.css',
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
            cwd: 'build/sass/',
            src: ['*.scss'],
            dest: 'app/css/',
            ext: '.css'
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
            src: ['build/js/**/*.js'],
            dest: ['build/js/<%= pkg.name %>-<%= pkg.version %>-concat.js'],
            nonull: true
          },
          css: {
            // concatenate the css files
            src: ['build/css/**/*.css'],
            dest: ['app/css/<%= pkg.name %>-<%= pkg.version %>-concat.css'],
            nonull: true
          }
        },

        uglify: {
          options: {
            banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
            report: 'min',
            mangle: true,
            sourceMap: 'app/js/<%= pkg.name %>-<%= pkg.version %>.map.js',
            sourceMapRoot: '/',
            sourceMapPrefix: 1,
            sourceMappingURL: 'app/js/<%= pkg.name %>-<%= pkg.version %>.map.js'
          },
          // We name the target production because there is no need to uglify
          // our code unless we're staging a production build.
          production: {
            files: {
              'app/js/<%= pkg.name %>-<%= pkg.version %>.min.js': ['build/js/<%= pkg.name %>-<%= pkg.version %>-concat.js']
            }
          }
        },

        cssmin: {
          dist: {
            // We want to pick the concatenated package for minimizing, otherwise it makes no sense
            // we pick up the name from the concat:css task.
            // We only do this in production as development we want to see the  code as is, not as it was
            // minimized
            src: 'build/css/<%= pkg.name %>-<%= pkg.version %>-concat.css',
            dest: 'app/css/<%= pkg.name %>-<%= pkg.version %>-min.css'
          }
        },

        bower:  {
          // Rather than have another app to remember, we've configured Grunt to handle
          // the bower installation process. Look at the bower.json file if you have questions as to
          // what will get installed where.
          // Currently configured for installation: jQuery, D3, Bootstrap-sass
          install: {
            options: {
              targetDir: 'app/lib',
              layout: 'byType',
              install: true,
              verbose: true,
              cleanTargetDir: false,
              cleanBowerDir: false,
              bowerOptions: {}
            }
          }
        },

        watch: {
          // Tracks changes on files and runs  specific tasks when changes are detected
          // While developing the Gruntfile.js it's a good idea to watch it and run jshint  whenever we make a change
          // otherwise bugs become harder to track
          gruntfile: {
            files: '_Gruntfile.js',
            tasks: ['jshint:gruntfile'],
          },
          // Watch all other files, and peform the appropriate task. We have Javascript, SASS and coffee.  We have both
          // Javascript and Coffee because we have the choice to pull in Javascript from third party sources and we can
          // work on either Javascript or Coffeescript as we prefer.
          all: {
            files: ['build/js/**/*.js', 'build/sass/**/*.scss', 'build/coffee/**/*.coffee'],
            tasks: ['jshint:source', 'sass:dev', 'coffee:compile']
          }
        },

        clean: {
            js: {
              src: [ 'app/js/<%= pkg.name %>-<%= pkg.version %>.min.js', 'build/js/**/*.js']
            },
            css: {
              src: ['app/css/<%= pkg.name %>-<%= pkg.version %>-min.css', 'build/css/**/*.css']
            },
            build: {
              src: ['build']
            }
          }
        });

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // this will be our eventual default task once I figure out what it should be
    //grunt.registerTask('default', ['jshint', 'connect', 'jasmine', 'sass:dev']);
    grunt.registerTask('cleanAll', ['clean:js', 'clean:css']);
    grunt.registerTask('jslint', ['jshint']);
  };
}()); // This closes the anonymous function that wraps the use strict call
