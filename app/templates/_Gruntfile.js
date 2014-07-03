/* global module:false indent:2 */
(function () {
  "use strict";

  module.exports = function (grunt) {
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),

      uglify: {
        options: {
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
          report: 'min',
          mangle: true,
          sourceMap: 'js/<%= pkg.name %>-<%= pkg.version %>.map.js',
          sourceMapRoot: '/',
          sourceMapPrefix: 1,
          sourceMappingURL: 'js/<%= pkg.name %>-<%= pkg.version %>.map.js'
          },
          // We name the target production because there is no need to uglify
          // our code unless we're staging a production build.
          production: {
            files: {
              'js/<%= pkg.name %>-<%= pkg.version %>.min.js': ['js/<%= pkg.name %>-<%= pkg.version %>-concat.js']
              }
            }
        },

        jshint: {
        // We  have to separate hinting processes.
        // As we develop the Gruntfile it is a good idea to hint it periodically
        gruntfile: {
          src: ['Gruntfile.js'],
          options: {
            jshintrc: 'jshintrc'
          }
        },
        // Hinting the rest of the other Javascript files
        source: {
          src: ['js/**/*.js'],
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
            cwd: 'sass/',
            src: ['*.scss'],
            dest: 'css/*.css',
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
            cwd: 'sass/',
            src: ['*.scss'],
            dest: 'css/',
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
           src: ['js/**/*.js'],
           dest: ['js/<%= pkg.name %>-<%= pkg.version %>-concat.js'],
           nonull: true
           },
         css: {
          // concatenate the css files
           src: ['css/**/*.css'],
           dest: ['css/<%= pkg.name %>-<%= pkg.version %>-concat.css'],
           nonull: true
         }
       },

        markdown: {
          // All the documentation is written in Markdown and we also have the option of
          // writing the content in Markdown using this task. Be aware that we will not
          // rewrite your HTML to point it to the final location of the CSS and JS files.
          create: {
                expand: true,
                cwd: 'markdown',
                src: '**/*.md',
                dest: 'html',
                ext: '.html'
              },
            },
          // We've enabled Github Flavored Markdown for this project
              options: {
                markdownOptions: {
                  gfm: true,
            }
          },

         cssmin: {
         dist: {
            // We want to pick the concatenated package for minimizing, otherwise it makes no sense
            // we pick up the name from the concat:css task.
            // We only do this in production as development we want to see the  code as is, not as it was
            // minimized
           src: 'css/<%= pkg.name %>-<%= pkg.version %>-concat.css',
           dest: 'css/<%= pkg.name %>-<%= pkg.version %>-min.css'
           }
         },

       coffee: {
           compile: {
             files: {
              //compile the coffee files into their own js files, we'll handle concatenation and
              // minification in a different task
               'js/**/*.js': ['coffee/**/*.coffee']
             }
           }
        },

        bower:{
          // Rather than have another app to remember, we've configured Grunt to handle
          // the bower installation process. Look at the bower file if you have questions as to
          // what will get installed where.
          //
          // Currently configured for installation:
          install: {
            options: {
              targetDir: './lib',
              layout: 'byType',
              install: true,
              verbose: false,
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
            files: 'Gruntfile.js',
            tasks: ['jshint:gruntfile'],
          },
          // Watch all other files, and peform the appropriate task. We have Javascript, SASS and coffee.  We have both
          // Javascript and Coffee because we have the choice to pull in Javascript from third party sources and we can
          // work on either Javascript or Coffeescript as we prefer.
          all: {
            files: ['js/**/*.js', 'sass/**/*.scss', 'coffee/**/*.coffee'],
            tasks: ['jshint:source', 'sass:dev', 'coffee:compile']
          }
        },

        clean: {
            js: {
              src: [ 'js/<%= pkg.name %>-<%= pkg.version %>.min.js', 'js/<%= pkg.name %>-<%= pkg.version %>-concat.js']
            },
            css: {
              src: ['css/<%= pkg.name %>-<%= pkg.version %>-concat.css', 'css/<%= pkg.name %>-<%= pkg.version %>-min.css']
            }
          },

        csslint: {
          // Make sure you lint your css files after you've converted the SASS into CSS,
          // Otherwise it will fail because there are no CSS files to inspect :)
          options: {
            // We are using an external file to load the rules  to make sure we can change them easier.
            csslintrc: 'csslintrc',
            formatters: [
            {
              id: 'text', dest: 'report/csslint.txt'
            },
            {
              id: 'csslint-xml', dest: 'report/csslint.xml'
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
        }
});

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  // this will be our eventual default task once I figure out what it should be
  //grunt.registerTask('default', ['jshint', 'connect', 'jasmine', 'sass:dev']);
  grunt.registerTask('cleanAll', ['clean:js', 'clean:css']);
  grunt.registerTask('jslint', ['jshint']);
  };
}()); // This closes the anonymous function that wraps the use strict call