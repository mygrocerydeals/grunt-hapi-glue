'use strict';
var Glue = require('glue');

process.on('message', function(gruntOptions) {
  if (gruntOptions.manifest){
      Glue.compose(gruntOptions.manifest, gruntOptions.options, function(err, server) {
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
  }
});

process.on('disconnect', function(){
  process.exit();
});