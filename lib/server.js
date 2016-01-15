'use strict';
process.on('message', function(message){
  var Glue = require('glue');

  Glue.compose(message.manifest, message.glueOptions, function(err, server) {
    if(err) {
      process.send({error: 'Hapi server failed to start with error: ' + err});
    }
    server.start(function (error) {
      var ports = server.connections.map(function(connection) {
        return connection.info.port;
      }).join(',');
      process.send({message: 'Started the server on port(s): '+ ports + '\n'});
      if(error) {
        process.send({error: 'Hapi server failed to start with error: ' + error});
      }
      if (!message.keepAlive) {
        process.send({ done: true });
      }
    });
  });
});

process.on('disconnect', function(){
  process.exit();
});
