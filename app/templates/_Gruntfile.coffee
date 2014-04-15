(->
  "use strict"
  module.exports = (grunt) ->
    grunt.initConfig
      pkg: grunt.file.readJSON("package.json")

      #     copy: {
      #        source: {
      #          cwd: 'source',
      #          src: [ '**' ],
      #          dest: 'source',
      #          expand: true
      #        }
      #      },
      csslint:

        # Make sure you lint your css files after you've converted the SASS into CSS,
        # Otherwise it will fail because there are no CSS files to inspect :
        options:

          # We are using an external file to load the rules  to make sure we can change them easier.
          csslintrc: ".csslintrc"
          formatters: [
            {
              id: "text"
              dest: "report/csslint.txt"
            }
            {
              id: "csslint-xml"
              dest: "report/csslint.xml"
            }
          ]

        strict:
          options:
            import: 2

          src: ["source/css/**/*.css"]

        lax:
          options:
            import: false

          src: ["source/css/**/*.css"]

      assemble:
        options:
          layout: ["source/markdown/layout/default.hbs"]
          expand: true

          # Do we want all the content flatened?
          flatten: true
          dest: ["app"]

        pages:
          files:
            "content/": ["source/markdown/pages/*.hbs"]

      jshint:

        # We  have to separate hinting processes.
        # As we develop the Gruntfile it is a good idea to hint it periodically
        # or use the watch:gruntfile task created below.
        gruntfile:
          src: ["Gruntfile.js"]
          options:
            jshintrc: ".jshintrc"


        # Hinting the rest of the other Javascript files
        source:
          src: ["source/js/**/*.js"]
          options:
            jshintrc: ".jshintrc"

      coffee:
        compile:
          files:

            #compile the coffee files into their own js files, we'll handle concatenation and
            # minification in a different task
            "source/js/**/*.js": ["source/coffee/**/*.coffee"]

      sass:

        # We have two different targets for SASS.
        # The dist target produced code in the compressed format, less bytes to push through the wire
        # both versions will generate a sourcemap
        dist:
          options:
            style: "compressed"
            sourcemap: true

          expand: true
          cwd: "source/sass/**"
          src: ["*.scss"]
          dest: "source/css/"
          ext: ".css"


        # dev will create an expanded version of the file to make sure that we can troubleshoot any problems.
        dev:
          options:
            style: "expanded"
            debugInfo: true
            lineNumbers: true
            lineComments: true
            sourcemap: true

          expand: true
          cwd: "source/sass/"
          src: ["*.scss"]
          dest: "source/css/"
          ext: ".css"

      concat:

        # Concatenates the specified files so we can reduce the number of HTTP requests
        # Note that we do not concatenate the files in the lib directory as those are third
        # party modules and I don't want to mess up with that
        options:
          separator: ";"

        js:

          # concatenates all files under the JS directory.
          src: ["source/js/**/*.js"]
          dest: ["source/js/<%= pkg.name %>-<%= pkg.version %>-concat.js"]
          nonull: true

        css:

          # concatenate the css files
          src: ["source/css/**/*.css"]
          dest: ["source/css/<%= pkg.name %>-<%= pkg.version %>-concat.css"]
          nonull: true

      uglify:
        options:
          banner: "/*! <%= pkg.name %> <%= grunt.template.today(\"dd-mm-yyyy\") %> */\n"
          report: "min"
          mangle: true
          sourceMap: "source/js/<%= pkg.name %>-<%= pkg.version %>.map.js"
          sourceMapRoot: "/"
          sourceMapPrefix: 1
          sourceMappingURL: "source/js/<%= pkg.name %>-<%= pkg.version %>.map.js"


        # We name the target production because there is no need to uglify
        # our code unless we're staging a production source.
        production:
          files:
            "source/js/<%= pkg.name %>-<%= pkg.version %>.min.js": ["source/js/<%= pkg.name %>-<%= pkg.version %>-concat.js"]

      cssmin:
        dist:

          # We want to pick the concatenated package for minimizing, otherwise it makes no sense
          # we pick up the name from the concat:css task.
          # We only do this in production as development we want to see the  code as is, not as it was
          # minimized
          src: "source/css/<%= pkg.name %>-<%= pkg.version %>-concat.css"
          dest: "app/css/<%= pkg.name %>-<%= pkg.version %>-min.css"

      bower:

        # Rather than have another app to remember, we've configured Grunt to handle
        # the bower installation process. Look at the bower.json file if you have questions as to
        # what will get installed where.
        # Currently configured for installation: lodash, jquery 1.9.0, d3, bootstrap-sass and polymer
        install:
          options:
            targetDir: "app/lib"
            layout: "byType"
            install: true
            verbose: true
            cleanTargetDir: true
            cleanBowerDir: false
            bowerOptions: {}

      watch:

        # Tracks changes on files and runs  specific tasks when changes are detected
        # While developing the Gruntfile.js it's a good idea to watch it and run jshint  whenever we make a change
        # otherwise bugs become harder to track
        gruntfile:
          files: "Gruntfile.js"
          tasks: ["jshint:gruntfile"]


        # Watch all other files, and peform the appropriate task. We have Javascript, SASS and coffee.  We have both
        # Javascript and Coffee because we have the choice to pull in Javascript from third party sources and we can
        # work on either Javascript or Coffeescript as we prefer.
        all:
          files: [
            "source/js/**/*.js"
            "source/sass/**/*.scss"
            "source/coffee/**/*.coffee"
          ]
          tasks: [
            "jshint:source"
            "sass:dev"
            "coffee:compile"
          ]

      clean:
        js:
          src: [
            "app/js/<%= pkg.name %>-<%= pkg.version %>.min.js"
            "source/js/**/*.js"
          ]

        css:
          src: [
            "app/css/<%= pkg.name %>-<%= pkg.version %>-min.css"
            "source/css/**/*.css"
          ]

        source:
          src: ["app/**"]

    require("matchdep").filterDev("grunt-*").forEach grunt.loadNpmTasks

    # this will be our eventual default task once I figure out what it should be
    #grunt.registerTask('default', ['jshint', 'connect', 'jasmine', 'sass:dev']);
    grunt.registerTask "cleanAll", [
      "clean:js"
      "clean:css"
    ]
    grunt.registerTask "jslint", ["jshint"]
    return

  return
)() # This closes the anonymous function that wraps the use strict call