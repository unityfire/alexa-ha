//TODO consider OpenHAB item discovery via 'config.HA_server + '/rest/items'

var config = require('../config');
var request = require('request');

// If https is used, allow default and self signed SSL certificates
var agent;
if ( config.HA_protocol === 'https' ) {
    var https = require('https');
    var agentOptions;
    agentOptions = {
        host: config.HA_host,
        port: config.HA_port,
        path: '/',
        rejectUnauthorized: false
    };
    agent = new https.Agent(agentOptions);
}
/***************** OPENHAB REST API ********************/
// Get state of an OpenHAB item
function getState(itemName, callback) {
    var url = config.HA_server + "/rest/items/" + itemName + "/state";
    request({
        uri:url,
        method: 'GET',
        agent: agent
    }, function (err, response) {
        if (err) {
            callback(new Error('Cannot reach OpenHAB API @ ' + config.HA_server + "/rest/items/" + itemName + "/state"));
        } else if (response.statusCode !== 200) {
            callback(new Error('Cannot fetch OpenHAB API Data:  ' + config.HA_server + "/rest/items/" + itemName + "/state"));
        } else {
            //console.log('OpenHAB getState Results: ', response.body);
            callback(null, response.body);
        }
    });
}

// Send command or set state of an OpenHAB item
function setState(itemName, state) {
    var url = config.HA_server + "/rest/items/" + itemName;
    request.post({
        uri:url,
        headers:{
            'Content-Type': 'text/plain',
            'Content-Length': state.length
        },
        body:state,
        agent:agent
    }, function(err,response){
        // DEBUG
        //console.log('setState call: ' + url + '/' + state);
        //console.log('setState response code: ' + response.statusCode);
        //console.log('setState response: ', response);

        // Handle errors or bad OpenHAB HTTP response codes
        if (err) {
            console.log('There was an error during during setState! Error message: ' + err.message);
            return false;
        }
        else if (response.statusCode !== 201) {
            console.log('There was an error during during setState! HTTP response code: ' + response.statusCode);
            return false;
        }
        else {
            // Success!
            return true;
        }
    });
}

/***************** VOICE COMMANDS **********************/
// Execute voice command, wait for server side 'processed' flag, and return the HA response/answer
// TODO make this fail after 10 seconds!
function runVoiceCMD(callback) {
    setTimeout(function () {
        waitTilProcessed(function (msg) {
            if (msg !== 'ON') {
                runVoiceCMD(callback);
            }
            else {
                getState(config.HA_item_answer, function (err,msg) {
                    if (err) {
                        callback('Cannot reach OpenHAB API: ' + err.message, null);
                    } else if (msg) {
                        callback(null, msg);
                    }
                });

            }
        });
    }, 500);
}

// Wait until HA server has processed the response
function waitTilProcessed(callback) {
    var processed = null;

    getState(config.HA_item_processed, function (err,msg) {
        if (err) {
            console.log('Cannot reach OpenHAB API: ' + err.message, null);
        } else if (msg) {
            processed = msg.toString();
            if (processed !== 'ON') {
                callback('OFF');
            }
            else{
                callback('ON');
            }
        }
    });
}

module.exports.getState = getState;
module.exports.setState = setState;
module.exports.runVoiceCMD = runVoiceCMD;
