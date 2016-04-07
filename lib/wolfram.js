// Originally written by: http://analyticphysics.com/Diversions/An%20Alexa%20Skills%20Kit%20%28ASK%29%20JavaScript%20Cookbook.htm
// JS code provided by: https://github.com/hsw28

var config = require('../config');

function askWolfram(input, callback) {
    var https = require( 'https' );

    var url = 'https://api.wolframalpha.com/v2/query?input=' + input;
    url += '&format=plaintext&podindex=1,2,3';
    url += '&appid='+config.wolframAppId;
    
    var request = https.get( url, function( response ) {
        var xml = '';
        response.on( 'data', function( x ) { xml += x; } );
        response.on( 'end', function() {
            xml = xml.replace( /\n/g, ' ' );

            var pattern = /plaintext>(.*?)<\/plaintext/g;
            var answers = [];
            var msg = null;

            while ( ( match = pattern.exec( xml )) !== null ) {
                answers.push( match[1] );
            }
                      
            //Determine which slot in the response to use
            if ( answers[1] === '' ) {
                msg = answers[2];
            }
            else {
                msg = answers[1];
            }

            //Callback to index.js with wolfram results (err vs msg)
            if (msg) {
                callback(null, msg);
            }
            else {
                callback('No results!',null);
            }
        } );
    } );
}

module.exports.askWolfram = askWolfram;
