<h2 id="top">Introduction</h2>

One of the things I see a lot when I read the [#eprdctn](https://twitter.com/hashtag/eprdctn?f=realtime) twitter hashtag (a great resource for anyone interested in working in digital publishing) is how hard it is to build a coherent set of tools to  make the work of creating a coherent and valid set of HTML, CSS and Javascript resources.  This article proposes a solution to this issue and a set of tools Javascript to attempt to resolve the issue.

The project also addresses best practices in front end development performance and usability. Most people who work in front end development will tell you that it is best to concatenate and minimize your Javascript and CSS because it reduces the weight (how many bytes) your resources weigh in terms of bandwidth and in terms of how many connections you have to make over the wire to fetch resources.

For ebooks and other closed publishing systems the bandwidth is not as important but it is still good practice to get into as these publishing platforms have a size constraint. All local resources must be under 2GB in size. by Making your Javascript and CSS as small as possible you save the space

I chose to implement thr project in Node.js because it already has access to the tools and features I need for the project and its package management and delivery tools are easy to use. If you have Node installed (see below for how to check if Node is intalled or not) you most likely know how to install the requred packages already :-)

One final warning. This is a command line tool and, as such, it requires you to be familiar with the command line tools for your operating system (Terminal/XTerm for OS X and Linux and PowerShell and similar tools in WIndows). This project was created in a Mac and tested on Both Macintosh and Linux. If you have questions shoot me a line and I'll try to help but can't guarantee anything.

## Installing and using the generator

+ [Make sure that Node and NPM are installed](#node)
+ [Install Yeoman globally](#yeoman)
+ [Add Grunt and Bower if needed](#grunt)
+ [Installing the generator and the node packages](#generator)
+ [Using the generator](#using)
+ [Explanation of the tasks and tools](#tools)
    * [CSS toolchain](css)
    * [Javascript](#js)
+ [Optional tools and tool chains](#options)
    * [Using SASS instead of CSS](#sass)
    * [Using Coffeescript to generate Javascript](#coffee)
    * [Automatic dependency management with Bower](#bower)
    * [Automatically watching files for changes](#watch)
+ [Future ideas and directions](#future)
    * [UNCSS](#uncss)
    * [Using templates to generate content](#templates)
    * [JSDoc](#jsdoc)
    * [Creation of XML files](#xml)

<hr />

<h3 id="node">Make sure that Node and NPM are installed</h3>

If you've used any front end development tool recently it is likely you already have Node.js installed on your system. To test type <code>node</code> on your shell, the result should loook somewhat like the following:

```bash
$ node
>
```

If you get something like:

```bash
$ node
-bash: node: command not found
```

You need to install node as a package from [http://nodejs.org/](http://nodejs.org/).

<h3 id="yeoman">Install Yeoman Globally</h3>

The first step is to install the [Yeoman](http://yeoman.io/) tool. It provides scaffolding for different kinds of web projects. With it you can get scaffolds for Angular, Backbone, Ember and a [few hundred other projects](http://yeoman.io/generators/community.html) according to their website.

What made Yeoman attractive for this project is the fact that you package the generator once and then download it as many times as you want. Think of generators as a non Ruby version of a Ruby on Rails project.

As with most Node packages you'll get the best bennefit if you install the package globally hhusing the following command:

```bash
$ npm install -g yeoman
```

This will also install Grunt and Bower if they are not present globally.

<p><a href="#top">Top</a></p>

<h3 id="grunt">Add Grunt and Bower if needed</h3>

If you've installed a newer version of Node and NPM the Yeoman installation will have taken care of these additional tools for you. However, if you're running and older version of Node you may have to install the two packages individually.

To install Bower and grunt use the following commands.

```
$ npm install -g grunt

$ npm install -g grunt-cli

$ npm install -g bower
```

<p><a href="#top">Top</a></p>

<h3 id="generator">Installing the generator and creating a working copy</h3>

There are two ways to get the generator installed. One is using NPM (Node Package Manager) and the other one is to install directly from Github. Both install the same code, it's just a matter of convenience.

To install the generator using NPM type:

```bash
$ npm install -g  generator-starter
```

What this command does is install the specified package (our generator in this case) in a central location where all users in the system can access it.

The second way is to install it directly from the Github Repository. This may have some advantages when working with code in development but it is not recomended.  The command to install from Github is:


```bash
$ npm install -g  https://github.com/caraya/generator-webpublish/tarball/master/
```

<p><a href="#top">Top</a></p>

<h3 id="using">Using the generator</h3>

The generator is a command line tool that uses Grunt and grunt-cli, thus it needs to work from a sheel (Terminal in Mac and Linux, Command shell in Windows). Currently available tasks are:

<pre><code>        uglify  Minify files with UglifyJS. *
        jshint  Validate files with JSHint. *
         watch  Run predefined tasks whenever watched files change.
        concat  Concatenate files. *
        coffee  Compile CoffeeScript files into JavaScript *
          sass  Compile Sass to CSS *
       csslint  Lint CSS files with csslint *
          copy  Copy files. *
         bower  Install Bower packages. *
         clean  Clean files and folders. *
  autoprefixer  Prefix CSS files. *
      assemble  Compile template files with specified engines *
      cleanAll  Alias for "clean:html", "clean:js", "clean:css" tasks.
        jslint  Alias for "jshint" task.

Tasks run in the order specified. Arguments may be passed to tasks that accept
them by using colons, like "lint:files". Tasks marked with * are "multi tasks"
and will iterate over all sub-targets if no argument is specified.

The list of available tasks may change based on tasks directories or grunt
plugins specified in the Gruntfile or via command-line options.

For more information, see http://gruntjs.com/

</code></pre>

<p><a href="#top">Top</a></p>

<h3 id="tools">Explanation of the tasks and tools</h3>

The structure of our generator is outlined below:

<pre><code>app
├── css
└── js
bower.json
node_modules
package.json
source
├── coffee
├── css
├── js
├── markdown
└── sass
</code></pre>

Currently the generator works oncrating two primary outputs: **concatenated and minimized Javascript** and **concatenated, automatically frefixed and minimized CSS**.

+ For Javascript the generator will accept both plain Javascript and Cofffeescript as input and will convert Coffeescript to Javascript in the process.
+ For CSS the generator will take plain CSS or the SCSS version of SASS and convert it to CSS as part of the process

The goals of the project are to:

+ Reduce the number of requests made for each page loaded
+ Minimize the size of the files we use on our content
+ Automate the CSS and Javascript tooling process
+ Allow the use SASS and Coffeescript as alternatives to CSS and Javascript

Future ideas for the project include:

+ Allow the automated creation of content through [Assemble](assemble.io/)
+ Clean up CSS so it'll only use the rules that apply to the site (use UNCSS)
+ Generate the files needed to package an ePub book as part of the build process

See future directions for additional areas where the project may be directed.

<p><a href="#top">Top</a></p>

<h4 id="css">CSS toolchain</h4>

CSS

The CSS toolchain performs the following steps:

+ Concatenate all the source CSS files and the associated library CSS files if any
+ Automatically adds prefixes where needed using the [Grunt autoprefixer plugin](https://github.com/nDmitry/grunt-autoprefixer)
+ Minimizes the resulting CSS file and copies them to our production directory

<p><a href="#top">Top</a></p>


<h4 id="js">Javascript</h4>

+ Concatenate all the source Javascript files and any library files that have not been minimized already
+ Autoprefixes the files where vendor prefixes are needed
+ Automatically adds prefixes where needed using the [Grunt autoprefixer plugin](https://github.com/nDmitry/grunt-autoprefixer)
+ Minimizes the resulting CSS file and copies them to our production directory

<p><a href="#top">Top</a></p>

<h3 id="options">Optional tools and tool chains</h3>

The following tools are built in to the project but are not deemed essential. SASS and Coffeescript are offered as convenience for people who are interested in. Watching files for changes and automatically processing the files is the lazy way to work with our content.

<p><a href="#top">Top</a></p>

<h4 id="sass">Using SASS instead of CSS</h4>

You can change the build tasks to use compiled SASS instead of plain CSS, it's a mater of taste as it introduces an additional step of compiling the SASS into CSS with or without additional libraries. That said, we can write a lot more concise and expressive CSS with SASS than we can with CSS alone.

You can find more information about SASS on their [website](http://sass-lang.com/)

<p><a href="#top">Top</a></p>

<h4 id="coffee">Using Coffeescript to generate Javascript</h4>

Coffeescript is a scripting language that compiles to Javascript. Its syntax and features should be familiar to programmers coming from Ruby or Python to Javascript.

Like SASS, Coffeescript adds an aditional compilations step to the build process but if you like the language then you have the option to use it.

<p><a href="#top">Top</a></p>

<h4 id="watch">Automatically watching files for changes</h4>

+ [https://github.com/gruntjs/grunt-contrib-connect](https://github.com/gruntjs/grunt-contrib-connect)
+ [https://github.com/gruntjs/grunt-contrib-watch](https://github.com/gruntjs/grunt-contrib-watch)
+ [http://livereload.com/](http://livereload.com/)

<p><a href="#top">Top</a></p>

<h4 id="bower">Automatic dependency management with Bower</h4>

Dependency management is a pain. Using Bootstrap-sass as an example, you not only have to keep track of the version of Bootstrap you're using but also that of all the libraries that it depends on. The more libraries you use in a project the harder it gets and the more complicated the management of all these libraries becomes.

[Bower](http://bower.io) automates library management. Using a json file it downloads specific versions of libraries and stores them in a directoy you specify.


<p><a href="#top">Top</a></p>

<h3 id="future">Future Ideas and Directions</h3>

Below are some ideas I'm thinking about for possible inclusion in the generator. I make no promises but it should be interesting to explore these areas.

<p><a href="#top">Top</a></p>

<h4 id="uncss">UNCSS and ProcessHTML</h4>


+ [https://www.npmjs.org/package/grunt-uncss](https://www.npmjs.org/package/grunt-uncss)
+ [https://www.npmjs.org/package/grunt-processhtml](https://www.npmjs.org/package/grunt-processhtml)

<h4 id="jsdoc">JSDoc</h4>

<p><a href="#top">Top</a></p>

+ [https://www.npmjs.org/package/grunt-jsdoc](https://www.npmjs.org/package/grunt-jsdoc)

<p><a href="#top">Top</a></p>

<h4 id="templates">Using Assemble to generate content</h4>

+ [Assemble](assemble.io/)
+ [http://blog.parkji.co.uk/2013/07/06/building-a-static-site-using-grunt-and-assemble.html](http://blog.parkji.co.uk/2013/07/06/building-a-static-site-using-grunt-and-assemble.html)
+

<p><a href="#top">Top</a></p>


<h4 id='xml'>Creation of XML files</h4>

+ [https://github.com/travis-hilterbrand/grunt-file-creator/tree/master/test](https://github.com/travis-hilterbrand/grunt-file-creator/tree/master/test)
+ [http://gruntjs.com/api/grunt.file](http://gruntjs.com/api/grunt.file)

<p><a href="#top">Top</a></p>
