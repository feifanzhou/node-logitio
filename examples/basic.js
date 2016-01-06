/*
Usage:

$ node ./examples/basic.js <APIKEY>

*/

var logit = require('../lib/');

var apikey = process.argv[2];

logit.init( apikey, { logToConsole: true } );

logit.log( 'hello, from basic node example' );
