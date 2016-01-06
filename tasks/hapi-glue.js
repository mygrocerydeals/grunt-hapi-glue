'use strict';

var path = require('path');

module.exports = function(grunt) {
  var runningServers = {};
  grunt.registerMultiTask("hapiGlue", "Start a Hapi web server using Glue", function() {
    var done = this.async();

    var server;

    if (runningServers[this.target]) {
      runningServers[this.target].disconnect();
    }

    server = require('child_process').fork(path.resolve('./lib/server'));
    runningServers[this.target] = server;

    var options = this.options();
    var manifest = this.data.manifest;
    server.send({manifest: manifest, options: options});
    server.on('message', function(error){
      if(error){
        grunt.fatal(error);
      }
      done();
    });
    process.on('exit', function() {
      for (var target in runningServers) {
        if(runningServers.hasOwnProperty(target) && runningServers[target].connected) {
          runningServers[target].disconnect();
        }
      }
    });
  });
};
