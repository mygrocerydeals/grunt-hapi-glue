'use strict';
var Glue = require('glue');

process.on('message', function(gruntOptions) {
    var manifest;

    if (typeof gruntOptions.manifest === 'string' || gruntOptions.mainfest instanceof String) {
      manifest = require(gruntOptions.manifest);
    } else if (typeof gruntOptions.manifest === 'object') {
      manifest = gruntOptions.manifest;
    }

    if (manifest) {
      Glue.compose(manifest, gruntOptions.options, function(err, server) {
        server.start(function (error) {
          console.log("Server Started!");
          if(error) {
            process.send('Hapi server failed to start with error: ' + error);
          }
          if (!gruntOptions.noasync) {
            process.send(null);
          }
        });
      });
    } else {
      process.send('Hapi Glue: You must provide a manifest');
      process.exit();
    }

});

process.on('disconnect', function(){
  process.exit();
});
