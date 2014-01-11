'use strict';

var
  path = require('path'),
  liveReloadPort = 35729;

/** 
 * Directory and File Path Configuration
 */

var paths = {
  
  // Client Directory and Paths
  client: {
    tld: __dirname + '/src', // directory path to top level
    dirs: {
      images: '<%= paths.client.tld %>/assets/images',
      styles: '<%= paths.client.tld %>/assets/styles',
      fonts: '<%= paths.client.tld %>/assets/fonts',
      videos: '<%= paths.client.tld %>/assets/videos',
    },
    files: {
      index: '<%= paths.client.tld %>/index.html',
      scripts: ['<%= paths.client.tld %>/app/**/*.js'],
      templates: ['<%= paths.client.tld %>/app/**/*.tpl.html'], // angular templates
    }
  },

  // Server Directory
  srv: {
    tld: path.normalize(__dirname + '../../server')
  },

  // Compiled Assets Directory (for dev)
  compiled: {
    tld: __dirname + '/src/.tmp' // directory path to top level
  },

  // Distribution Directory and Paths
  dist: {
    tld: __dirname + '/dist', // directory path to top level
    dirs: {
      images: '<%= paths.dist.tld %>/images',
      scripts: '<%= paths.dist.tld %>/scripts',
      styles: '<%= paths.dist.tld %>/styles',
      fonts: '<%= paths.dist.tld %>/fonts',
      videos: '<%= paths.dist.tld %>/videos',
    },
    files: {
      templates: ['<%= paths.dist.tld %>/app/**/*.tpl.html'], // angular templates
    }
  },

  heroku: {
    tld: path.normalize(__dirname + '../../_heroku'),
    dirs: {
      client: '<%= paths.heroku.tld %>/client'
    }
  }
};

module.exports = function (grunt) {

  /**
   * Register all Grunt Tasks
   */

  // For Heroku - task format is 'heroku:env' where env is the NODE_ENV variable
  grunt.registerTask('heroku:production', 'dist');

  // Run 'grunt dev' for live-reloading development environment
  grunt.registerTask('dev', ['build:dev', 'concurrent:dev', 'watch']);

  // Run 'grunt dist' to build and run the distribution environment
  grunt.registerTask('dist', ['build:dist', 'concurrent:dist', 'optimize', 'optimize:templates']);

  // Run 'grunt heroku' to prepare the client files for deployment to heroku
  grunt.registerTask('heroku', ['dist', 'clean:heroku', 'copy:heroku']);

  // Clean, validate & compile web-accessible resources
  grunt.registerTask('build:dev', ['clean:dev', 'jshint', 'ngtemplates:dev']);
  grunt.registerTask('build:dist', ['clean:dist', 'jshint', 'copy:dist']);

  // Optimize pre-built, web-accessible resources for production, primarily 'uglify', 'rev', and 'usemin'
  grunt.registerTask('optimize', ['useminPrepare', 'concat', 'ngmin', 'uglify', 'rev:dist', 'usemin']);

  // Optimize ng-templates
  grunt.registerTask('optimize:templates', ['ngtemplates:dist', 'uglify:templates', 'rev:templates', 'usemin']);


  /**
   * Grunt Configurations
   */

  grunt.initConfig({

    paths: paths,

    pkg: grunt.file.readJSON('package.json'),

    banner: grunt.file.read('banner.txt'),

    // Wipe the compiled files and/or build directory
    clean: {
      options: {
        force: true // lets us delete stuff outside the current working directory
      },
      dev: {
        files: '<%= paths.compiled.tld %>'
      },
      dist: {
        files: [{
          dot: true,
          src: [
            '<%= paths.compiled.tld %>/*',
            '<%= paths.dist.tld %>/*',
            '!<%= paths.dist.tld %>/.git*'
          ]
        }]
      },
      heroku: {
        files: [{
          dot: true,
          src: '<%= paths.heroku.dirs.client %>'
        }]
      },
      ngtemplates: '<%= paths.compiled.tld %>/scripts/*.templates.js'
    },

    // Files to watch for changes in order to make the browser reload
    watch: {
      compass: {
        files: ['<%= paths.client.dirs.styles %>/{,*/}*.{scss,sass}'],
        tasks: ['compass:dev']
      },

      dev: {
        options: {
          livereload: liveReloadPort
        },
        files: [
          '<%= paths.client.files.index %>', // client side index file
          '<%= paths.client.files.scripts %>', // client side scripts
          '<%= paths.client.dirs.images %>/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= paths.compiled.tld %>/scripts/{,*/}*.js', // compiled scripts
          '<%= paths.compiled.tld %>/styles/{,*/}*.css', // compiled styles

          // TODO figure out how to move this into the server directory and combine watch tasks
          // '<%= paths.srv.tld %>/api/**/*.js' // server files
        ]
      },

      // Angular templates need to be recompiled
      ngtemplates: {
        files: [
          '<%= paths.client.files.templates %>' // angular template files
        ],
        tasks: ['clean:ngtemplates', 'ngtemplates:dev']
      }
    },

    // Check javascript for errors
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%= paths.client.files.scripts %>',
        '!<%= paths.client.tld %>/bower_components/**/*'
      ]
    },

    // Compass SASS -> CSS Compiler
    compass: {
      options: {
        sassDir: '<%= paths.client.dirs.styles %>',
        imagesDir: '<%= paths.client.dirs.images %>',
        fontsDir: '<%= paths.client.dirs.fonts %>',
        importPath: '<%= paths.client.tld %>/bower_components',
        httpImagesPath: '/images',
        httpGeneratedImagesPath: '/images/generated',
        httpFontsPath: '/styles/fonts',
      },
      dev: {
        options: {
          debugInfo: true,
          cssDir: '<%= paths.compiled.tld %>/styles',
          generatedImagesDir: '<%= paths.compiled.tld %>/images/generated'
        }
      },
      dist: {
        options: {
          cssDir: '<%= paths.dist.dirs.styles %>',
          generatedImagesDir: '<%= paths.dist.dirs.images %>/generated',
          environment: 'production'
        }
      }
    },

    // Handle cache busting for static files
    rev: {
      dist: {
        files: {
          src: [
            '<%= paths.dist.dirs.scripts %>/{,*/}*.js',
            '<%= paths.dist.dirs.styles %>/{,*/}*.css',
            '<%= paths.dist.dirs.images %>/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= paths.dist.dirs.fonts %>/*',

            // Ignored Files
            '!<%= paths.dist.dirs.images %>/hotels/*.{png,jpg,jpeg,gif,webp,svg}',
            '!<%= paths.dist.dirs.scripts %>/app.templates.js'
          ]
        }
      },
      templates: {
        src: '<%= paths.dist.dirs.scripts %>/app.templates.js'
      }
    },

    // Detects special construction (blocks) in the HTML files and update the grunt config to run 
    // concat/uglify/cssmin/requirejs on the files referenced in the block. Does not change the HTML.
    useminPrepare: {
      html: ['<%= paths.client.files.index %>'],
      options: {
        dest: '<%= paths.dist.tld %>'
      }
    },

    // Replaces references to non-optimized files in html and css files with the minified version
    usemin: {
      html: [
        '<%= paths.dist.tld %>/{,*/}*.html',
        '<%= paths.dist.tld %>/app/**/*.tpl.html',
      ],
      css: ['<%= paths.dist.dirs.styles %>/*.css'],
      options: {
        dirs: ['<%= paths.dist.tld %>']
      },
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= paths.client.dirs.images %>',
          src: [
            '{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          ],
          dest: '<%= paths.dist.dirs.images %>'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          // removeComments: true,
          // collapseWhitespace: true, //https://github.com/yeoman/grunt-usemin/issues/44
        },
        files: {
          '<%= paths.dist.tld %>/index.html': '<%= paths.client.files.index %>'
        }
      }
    },

    // Put files not handled in other tasks here
    copy: {

      dist: {
        files: [

          // Copy fonts from app -> dist          
          {
            expand: true,
            cwd: '<%= paths.client.tld %>/assets/fonts',
            src: '*.{woff,svg,eot,ttf}',
            dest: '<%= paths.dist.dirs.fonts %>'
          },

          // copy ng-templates from app -> dist/app
          {
            expand: true,
            cwd: '<%= paths.client.tld %>/app',
            src: '**/*.tpl.html',
            dest: '<%= paths.dist.tld %>/app'
          },

          // Copy video files from app -> dist
          {
            expand: true,
            cwd: '<%= paths.client.dirs.videos %>/',
            src: '*.{mp4,webm}',
            dest: '<%= paths.dist.dirs.videos %>'
          },

          // Copy various files from app -> dist
          {
            expand: true,
            cwd: '<%= paths.client.tld %>',
            src: ['.htaccess', '*.{ico,png,txt}'],
            dest: '<%= paths.dist.tld %>'
          },

          // Copy various vendor files from app -> dist
          {
            expand: true,
            cwd: '<%= paths.client.tld %>/vendor',
            src: '**/*.swf',
            dest: '<%= paths.dist.tld %>/vendor'
          }
        ]
      },

      // copy client/dist directory to heroku/client
      heroku: {
        files: [{
          expand: true,
          cwd: '<%= paths.dist.tld %>',
          src: ['**/*'],
          dest: '<%= paths.heroku.dirs.client %>'
        }]
      }
    },

    // Tasks to run concurrently to speed up the build process
    concurrent: {
      dev: ['compass:dev'],
      test: ['compass:dev'],
      dist: ['compass:dist', 'imagemin', 'htmlmin']
    },

    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },

    cdnify: {
      dist: {
        html: ['<%= paths.dist.tld %>/*.html']
      }
    },

    // Make all AngularJS files min safe
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= paths.dist.dirs.scripts %>',
          src: '*.js',
          dest: '<%= paths.dist.dirs.scripts %>'
        }]
      }
    },

    // Concat JS files not handled by usemin and useminPrepare
    concat: {},

    // Optimize JS not handled by usemin and useminPrepare
    uglify: {
      templates: {
        files: {
          '<%= paths.dist.dirs.scripts %>/app.templates.js' : '<%= paths.dist.dirs.scripts %>/app.templates.js'
        }
      }
    },

    // Convert Angular templates to '.js'
    ngtemplates: {
      options: {
        module: {
          name: 'templates',
          define: true
        }
      },
      dev: {
        options: {
          base: '<%= paths.client.tld %>/app', // $templateCache ID is relative to this dir
        },
        src: ['<%= paths.client.files.templates %>'],
        dest: '<%= paths.compiled.tld %>/scripts/app.templates.js'
      },
      dist: {
        options: {
          base: '<%= paths.dist.tld %>/app', // $templateCache ID is relative to this dir
          htmlmin: {
            collapseWhitespace: true
          }
        },
        src: ['<%= paths.dist.files.templates %>'],
        dest: '<%= paths.dist.dirs.scripts %>/app.templates.js'
      }
    }
  });


  /**
   * Load all dev grunt task dependencies
   */
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
};
