'use strict';

var path = require('path');
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
      if (runningServers.hasOwnProperty(target)) {
        runningServers[target].disconnect();
      }

      var message = {
        keepAlive: options.keepAlive,
        manifest: manifest,
        glueOptions: glueOptions
      };

      var runningServer = require('child_process').fork(__dirname + '/../lib/server');
      runningServers[target] = runningServer;
      runningServer.send(message);
      runningServer.on('message', function(message){
        if (message.message){
          grunt.log.write(message.message);
        }
        if (message.error){
          grunt.fatal(message.error);
        }
        if (message.error || message.done){
          done();
        }
      });
      if (options.keepAlive){
        grunt.log.write("Waiting forever....\n");
      }
    } else {
      grunt.fatal('Hapi Glue: You must provide a manifest');
    }
    process.on('exit', function() {
      for (var key in runningServers) {
        if(runningServers.hasOwnProperty(key) && runningServers[key].connected) {
          runningServers[key].disconnect();
        }
      }
    });
  });
};
