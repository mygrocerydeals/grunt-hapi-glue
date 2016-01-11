'use strict';

var path = require('path');
var Glue = require('glue');

module.exports = function(grunt) {
  var runningServers = {};
  grunt.registerMultiTask("hapiGlue", "Start a Hapi web server using Glue", function() {

    var done = this.async();
    var options = this.options({
      keepAlive: false
    });
    var manifestOption = this.data.manifest;
    var glueOptions = this.data.glueOptions;
    var target = this.target;
    var manifest;

    if (typeof manifestOption === 'string' || manifestOption instanceof String) {
      manifest = require(manifestOption);
    } else if (typeof manifestOption === 'object') {
      manifest = manifestOption;
    }
    if (manifest) {
      var runServer = function() {
        Glue.compose(manifest, glueOptions, function(err, server) {
          if(err) {
            grunt.fatal('Hapi server failed to start with error: ' + err);
          }
          server.start(function (error) {
            var ports = server.connections.map(function(connection) {
              return connection.info.port;
            }).join(',');
            grunt.log.write('Started the plot device on port(s): '+ ports + '\n');
            if(error) {
              grunt.fatal('Hapi server failed to start with error: ' + error);
            }
            runningServers[target] = this;
            if (!options.keepAlive) {
              done();
            }
          });
        });
      };
      if (runningServers.hasOwnProperty(target)) {
        runningServers[target].stop(function(err) {
          runServer();
        });
      } else {
        runServer();
      }
      if (options.keepAlive){
        grunt.log.write("Waiting forever....\n");
      }
    } else {
      grunt.fatal('Hapi Glue: You must provide a manifest');
    }
  });
};
