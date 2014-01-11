'use strict';

var path = require('path');
module.exports = function (grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    src: {
      // This will cover all JS files in 'js' and sub-folders
      js: ['app/js/**/*.js'],
      templates: ['app/partials/**/*.html']
    },

    //JS Test files
    test: {
      karmaConfig: 'test/karma.conf.js',
      unit: ['test/unit/**/*.js']
    },

    // Configure Lint\JSHint Task
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      files: {
        src: ['Gruntfile.js', '<%= src.js %>', '<%= test.unit %>']
      }
    },

    karma: {
      dev: {
        configFile: '<%= test.karmaConfig %>',
        singleRun: false
      }
    },

    connect: {
      web: {
        options: {
          port: 9000,
          bases: '.',
          keepalive: true
        }
      }
    },

    watch: {
      jshint: {
        files: ["<%= src.js %>", "<%= test.unit %>"],
        tasks: ['jshint']
      }
    },

    express: {
      api: {
        options: {
          port: 3000,
          server: path.resolve('./demorestapi/server')
        }
      }
    },    

    concurrent: {
      dev: {
        tasks: ['watch', 'watch-tests', 'web'],
        options: {
          logConcurrentOutput: true
        }
      },
      runuiandrest: {
        tasks: ['runexpress', 'web'],
        options: {
          logConcurrentOutput: true
        }        
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-express');

  grunt.registerTask('web', ['connect:web']);
  grunt.registerTask('watch-tests', ['karma:dev']);
  //grunt.registerTask('default', ['concurrent:dev']);
  grunt.registerTask('runexpress', ['express:api', 'express-keepalive']);
  grunt.registerTask('server', ['express:api', 'express-keepalive']);

  /** This will do the following:
      Start Web\UI server on port:  9000
      Start REST service on port:  3000   (This will be replaced with PHP backend)
  **/
  grunt.registerTask('default', ['concurrent:runuiandrest']);
};
