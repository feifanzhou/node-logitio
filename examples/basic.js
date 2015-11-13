/*
Usage:

$ node ./examples/basic.js <APIKEY>

*/

var logit = require('../lib/');

var apikey = process.argv[0];

logit.init( apikey );

logit.log( 'hello, from basic node example' );
