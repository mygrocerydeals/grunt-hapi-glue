'use strict';
var http = require('http');

exports.hapiGlue = {
  basicOptions: function(test) {
    http.get('http://localhost:8000', function(response) {
      test.equal(response.statusCode, 200, 'should respond 200');
      test.done();
    });
  },
  multipleWeb: function(test) {
    http.get('http://localhost:8001', function(response){
      test.equal(response.statusCode, 200, 'should respond 200');
      test.done();
    });
  },
  multipleApi: function(test) {
    http.get('http://localhost:8002', function(response){
      test.equal(response.statusCode, 200, 'should respond 200');
      test.done();
    });
  }
};
