'use strict';

exports.register = function (server, options, next) {
  server.route({
    method: 'GET',
    path: '/',
    handler:  function(request, reply) {
      reply({status: 'ok'});
    }
  });
  next();
};

exports.register.attributes = {
    name: 'test',
    multiple: false
};
