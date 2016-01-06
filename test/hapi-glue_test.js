'use strict';
var http = require('http');

exports.hapiGlue = {
  basicOptions: function(test) {
    console.log("Testing!");
    http.get('http://localhost:8000', function(response) {
      console.log(response.statusCode);
      test.equal(response.statusCode, 200, 'should respond 200');
      test.done();
    });
  }
};
