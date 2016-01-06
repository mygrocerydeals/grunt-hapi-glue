'use strict';
var path = require('path');
module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      all: [
        "Gruntfile.js",
        "tasks/*.js",
        "lib/*.js"
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    nodeunit: {
     tests: ['test/*_test.js'],
   },
   clean: {
     tests: ['tmp']
   },
   hapiGlue: {
     basic: {
       manifest: {
         connections: [{
           port: 8000
         }],
         registrations: [{ plugin: './index.js'}]
       },
       options: {
         relativeTo: path.resolve('./test/fixtures/')
       }
     }
   }
  });
  grunt.loadTasks('tasks');
  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('test', ['clean', 'hapiGlue', 'nodeunit']);
  // By default, lint
  grunt.registerTask('default', ['jshint', 'test']);

};
