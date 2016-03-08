//TODO better error handling & logging

/******************** INCLUDES **********************/
var config = require('./config');
var helper = require('./helper');
var alexa = require('alexa-app');

var wolfram = require('./lib/wolfram');

// Load supporting library depending on the configured Home Automation controller
if (config.HA_name === 'OpenHAB') {
    var HA = require('./lib/openhab');
}
else {
    console.log ('FATAL ERROR: the configured HA_name "' + config.HA_name + '" is not currently supported.');
    process.exit(1);
}

// Reloaded by hotswap when code has changed (by alexa-app-server)
module.change_code = 1;

var appName = config.applicationName;

/******************* ASK MAIN ROUTINES **************/
// Define an alexa-app
var app = new alexa.app(appName);
app.launch(function(request,response) {
    if (config.chime) {
        response.say(config.greeting).say(config.chime).reprompt("How can I help?").shouldEndSession(false);
    }
    else {
        response.say(config.greeting).reprompt("How can I help?").shouldEndSession(false);
    }
});

app.sessionEnded(function(request,response) {
    logout( request.userId );
});

app.messages.NO_INTENT_FOUND = "I am uncertain what you mean.  Kindly rephrase...";

// Pre-execution security checks - before handling ensure the request applicationId / userId / password match configured values
app.pre = function(request,response,type,id) {
    if (request.sessionDetails.application.applicationId !== config.applicationId) {
        console.log('ERROR: Invalid application ID in request:' + request.sessionDetails.application.applicationId);
        response.fail("Invalid application ID");
    }
    if (request.sessionDetails.userId !== config.userId) {
        console.log('ERROR: Invalid userId in request: ' + request.sessionDetails.userId );
        response.fail("Invalid user ID");
    }
    if (request.data.password !== config.password) {
        console.log('ERROR: Invalid password in request: ' + request.data.password);
        response.fail("Invalid password");
    }

    console.log('AWS ASK ' + type + ' received, sessionID: ' + request.sessionId);
};

// Post commands
//app.post = function(request,response,type,exception) {
    // Always turn an exception into a successful response, so it can be spoken to the user
    //response.clear().say("An error occurred: " + exception).send();
//};

// Generic error handler
//app.error = function(exception,request,response) {
//    request.say("I have captured an exception! It was: "+exception.message);
//};

/*************** Define ALEXA ASK Intents *****************************/
//TODO: move all Intent say/card verbiage to config.js
//TODO: response.reprompt(String phrase) - ask for details as needed, requires use of sessions

// Switch devices ON/OFF
app.intent('Switch', {
    "slots":{"Action":"LITERAL","ItemName":"LITERAL","Location":"LOCATION_TYPE"}
    ,"utterances":config.utterances.Switch
},function(request,response) {
    var action = request.slot('Action').toUpperCase();
    var itemName = request.slot('ItemName');
    var location = request.slot('Location');

    // DEBUG response
    //console.log('RawResponseData: ',request.data);
    console.log('Switch Intent hit!  Slots are:' + action + '/' + itemName + '/' + location);

    // Handle undefined ASK slots
    if (itemName && location) {
        var HA_item = helper.getItem(itemName, location);
    }
    else {
        response.say('I cannot switch that');
        response.send();
        return;
    }
    
    if (action && itemName && location && HA_item) {
        // Get current state
        HA.getState(HA_item, function (err, state) {
            if (err) {
                console.log('HA getState failed:  ' + err.message);
            }
            // Check if the items current state and action match
            if (state === action) {
                console.log ('Your ' + location + ' ' + itemName + ' is already ' + action);
                response.say('Your ' + location + ' ' + itemName + ' is already ' + action);
                response.send();
            }
            // Set the new state for the item
            else if (state !== action) {
                HA.setState(HA_item, action);
                response.say('Switching ' + action + ' your ' + location + ' ' + itemName);
                response.card(appName,'I have switched ' + action + ' your ' + location + ' ' + itemName + '.');
                response.send();
            }
            // Unidentified item
            else {
                response.say('I could not switch ' + action + ' your ' + location + ' ' + itemName);
                response.send();
            }
        });
    } else {
        response.say('I cannot currently switch your ' + location + ' ' + itemName);
        response.send();
    }
    return false;
});

// Set HSB color for lights
app.intent('SetColor', {
    "slots":{"Location":"LOCATION_TYPE", "Color":"COLOR_TYPE"}
    ,"utterances":config.utterances.SetColor
},function(request,response) {
    var color = request.slot('Color');
    var location = request.slot('Location');

    // DEBUG response
    //console.log('RawResponseData: ',request.data);
    console.log('SetColor Intent hit!  Slots are:' + color + '/' + location);

    // Handle undefined ASK slots
    if (location && color) {
        //Set color intent, assume we are dealing with lighting...
        var HA_item = helper.getItem('lights',location);
        var HSBColor = helper.getColor(color);
    }
    else {
        response.say('I cannot set that color');
        response.send();
        return;
    }
    
    if (color && location && HSBColor && HA_item) {
        // Get current color
        HA.getState(HA_item, function (err, state) {
            if (err) {
                console.log('HA getState failed:  ' + err.message);
            }
            // Check if the current color and new color match
            if (state === HSBColor) {
                response.say('Your ' + location + ' lights color is already ' + color);
                response.send();
            }
            // Set the new state for the item
            else if (state !== HSBColor) {
                HA.setState(HA_item, HSBColor);
                response.say('Setting your ' + location + ' lights color to ' + color);
                response.card(appName,'I have set your ' + location + ' lights color to ' + color + '.');
                response.send();
            }
            // Unidentified item
            else {
                response.say('I could not set your ' + location + ' lights color to ' + color);
                response.send();
            }
        });
    }
    else {
        response.say('I cannot currently set your ' + location + ' lights color to ' + color);
        response.send();
    }
    return false;
});

// Set dimming levels of lights
app.intent('SetLevel', {
    "slots":{"Percent":"NUMBER","ItemName":"LITERAL","Location":"LOCATION_TYPE"}
    ,"utterances":config.utterances.SetLevel
},function(request,response) {
    var percent = request.slot('Percent');
    var itemName = request.slot('ItemName');
    var location = request.slot('Location');

    // DEBUG response
    //console.log('RawResponseData: ',request.data);
    console.log('Dim Intent hit!  Slots are:' + percent + '/' + itemName + '/' + location);

    // Handle undefined ASK slots
    if (itemName && location) {
        var HA_item = helper.getItem(itemName,location);
    }
    else {
        response.say('I cannot dim that device');
        response.send();
        return;
    }
    
    if ((percent && itemName && location && HA_item) && (percent >= 0 && percent <= 100)) {
        // Get current color
        HA.getState(HA_item, function (err, state) {
            if (err) {
                console.log('HA getState failed:  ' + err.message);
            }
            // Check if the current dimmer level and new level match
            if (state === percent) {
                response.say('Your ' + location + ' lights color are already at ' + percent + ' percent');
                response.send();
            }
            // Set the new state for the item
            else if (state !== percent) {
                HA.setState(HA_item, percent);
                response.say('Dimming your ' + location + ' ' + itemName + ' to ' + percent + ' percent');
                response.card(appName,'I have dimmed your ' + location + ' ' + itemName + ' to ' + percent + ' percent.');
                response.send();
            }
            // Unidentified item
            else {
                response.say('I could not dim your ' + location + ' ' + itemName + ' to ' + percent + ' percent');
                response.send();
            }
        });
    }
    else {
        response.say('I cannot currently set your ' + location + ' lights to ' + percent + ' percent');
        response.send();
    }
    return false;
});

// Set thermostat temperatures
app.intent('SetTemp', {
    "slots":{"Degree":"NUMBER","Location":"LOCATION_TYPE"}
    ,"utterances":config.utterances.SetTemp
},function(request,response) {
    var degree = request.slot('Degree');
    var location = request.slot('Location');

    // DEBUG response
    //console.log('RawResponseData: ',request.data);
    console.log('SetTemp Intent hit!  Slots are:' + degree + '/' + location);

    // Handle undefined ASK slots
    if (degree && location) {
        var HA_item = helper.getItem('thermostat',location);
    }
    else {
        response.say('I cannot set that temperature');
        response.send();
        return;
    }
    
    if (degree && degree > 60 && degree < 80 && HA_item) {
        // Get current temp
        HA.getState(HA_item, function (err, state) {
            if (err) {
                console.log('HA getState failed:  ' + err.message);
            }
            // Check if the current target temp and new target temp match
            if (state === degree) {
                response.say('Your ' + location + ' target temperature is already set to ' + degree + ' degrees');
                response.send();
            }
            // Set the new state for the item
            else if (state !== degree) {
                HA.setState(HA_item, degree);
                response.say('Setting your ' + location + ' target temperature to ' + degree + ' degrees');
                response.card(appName, 'I have set your ' + location + ' target temperature to ' + degree + ' degrees.');
                response.send();
            }
            // Unidentified item
            else {
                response.say('I could not set your ' + location + ' to ' + degree + ' degrees.  Try something between 60 and 80 degrees fahrenheit.');
                response.send();
            }
        });
    }
    else {
        response.say('I cannot currently set your ' + location + ' temperature to ' + degree + ' degrees');
        response.send();
    }
    return false;
});

// Set modes (house/lighting/security scenes)
app.intent('SetMode', {
    "slots":{"ModeType":"LITERAL","ModeName":"LITERAL"}
    ,"utterances":config.utterances.SetMode
},function(request,response) {
    var modeType = request.slot('ModeType');
    var modeName = request.slot('ModeName');

    // DEBUG response
    //console.log('RawResponseData: ',request.data);
    console.log('SetMode Intent hit!  Slots are:' + modeType + '/' + modeName);

    if (modeType && modeName) {
        var modeId = helper.getMode(modeType, modeName);
        var HA_item = helper.getItem('mode', modeType);
    }
    else {
        response.say('I cannot set that mode');
        response.send();
        return;
    }

    if (modeId && HA_item) {
        HA.setState(HA_item, modeId);
        response.say('Changing your ' + modeType + ' mode to ' + modeName);
        response.card(appName, 'I have changed your ' + modeType + ' mode to ' + modeName + '.');
    }
    else {
        response.say('I could currently set your ' + modeType + ' mode to ' + modeName);
        response.send();
    }
});

// Check the state of an itemName
app.intent('GetState', {
    "slots":{"MetricName":"LITERAL", "Location":"LOCATION_TYPE"}
    ,"utterances":config.utterances.GetState
},function(request,response) {
    var metricName = request.slot('MetricName');
    var location = request.slot('Location');

    if (typeof(location) === "undefined" || location === null) { location = 'house'; }

    // DEBUG response
    //console.log('RawResponseData: ',request.data);
    console.log('GetState Intent hit!  Slots are:' + metricName + '/' + location);

    if (metricName && location) {
        var HA_item = helper.getMetric(metricName,location);
        var HA_unit = helper.getUnit(metricName);
    }
    else {
        response.say('I cannot get that devices state');
        response.send();
        return;
    }

    if (HA_item && HA_unit) {
        HA.getState(HA_item, function (err, state) {
            if (err) {
                console.log('HA getState failed:  ' + err.message);
            } else if (state) {
                response.say('Your ' + location + ' ' + metricName + ' is currently ' + state + ' ' + HA_unit);
                response.card(appName, 'Your ' + location + ' ' + metricName + ' is currently ' + state + ' ' + HA_unit + '.');
                response.send();
            }
        });
    }
    else {
        response.say('I cannot currently get the ' + metricName + ' in the ' + location);
        response.send();
    }
    return false;
});

// Set modes (house/lighting/security scenes)
app.intent('GetMode', {
    "slots":{"ModeType":"LITERAL"}
    ,"utterances":config.utterances.GetMode
},function(request,response) {
    var modeType = request.slot('ModeType');

    // DEBUG response
    //console.log('RawResponseData: ',request.data);
    console.log('GetMode Intent hit!  Slots are:' + modeType);

    if (modeType) {
        var HA_item = helper.getItem('mode', modeType);
        
        if (!HA_item) {
            response.say('I could not get the ' + modeType + ' mode');
            response.send();
            return;
        }
        
        HA.getState(HA_item, function (err, modeId) {
            if (err) {
                console.log('HA getState failed:  ' + err.message);
            } else if (modeId) {
                var modeName = helper.getModeName(modeType,modeId);
                response.say('Your ' + modeType + ' mode is set to ' + modeName);
                response.card(appName, 'Your ' + modeType + ' mode is set to ' + modeName + '.');
                response.send();
            }
        });
    }
    else {
        response.say('I cannot currently get the ' + modeType + ' mode');
        response.send();
        return;
    }
    return false;
});

// Handle arbitrary commands, passed to HA VoiceCommand item which then executes server side rules
app.intent('VoiceCMD', {
    "slots":{"Input":"LITERAL"}
    ,"utterances":config.utterances.VoiceCMD
},function(request,response) {
    var voiceCMD = request.slot('Input');

    // DEBUG response
    //console.log('RawResponseData: ',request.data);
    console.log('VoiceCMD Intent hit!  Slots are:' + voiceCMD);

    HA.setState(config.HA_item_processed, 'OFF');
    HA.setState(config.HA_item_voicecmd, voiceCMD);

    HA.runVoiceCMD(function(err,msg) {
        if (err) {
            console.log('Cannot reach HA API: ' + err.message);
            response.fail('Cannot reach HA API');
        } else if (msg) {
            response.say(msg);
            response.card(appName,msg);
            response.send();
        }
    });
    return false;
});

// Research anything via wolfram alpha API calls
app.intent('Research', {
    "slots":{"Question":"LITERAL"}
    ,"utterances":config.utterances.Research
},function(request,response) {
    var question = request.slot('Question');

    // DEBUG response
    //console.log('RawResponseData: ',request.data);
    console.log('Research Intent hit!  Question is:' + question);

    // Handle request/response/error from Wolfram
    wolfram.askWolfram(question, function (err,msg) {
        if (err) {
            console.log('Wolfram API call failed for ' + question + ': ' + err.toString());
            response.say("I could'nt quickly determine an answer to your question");
            response.send();
        } else if (msg) {
            console.log('Wolfram response:' + msg);
            response.say(msg);
            response.card(appName,msg);
            response.send();
        }
    });
    return false;
});

app.intent('StopIntent',
    {"utterances":config.utterances.Stop
    },function(request,response) {
        console.log('Stopping...');
        response.say("Stopping").send();
    });

app.intent('CancelIntent',
    {"utterances":config.utterances.Cancel
    },function(request,response) {
        console.log('Cancelling...');
        response.say("Cancelling").send();
    });

app.intent('HelpIntent',
    {"utterances":config.utterances.Help
    },function(request,response) {
        response.say(config.help.say.toString()).reprompt('What would you like to do?').shouldEndSession(false);
        response.card(appName, config.help.card.toString());
    });

//TODO implement the yes/no/repeat intents
//app.intent('YesIntent',
//    {"utterances":config.utterances.Yes
//    },function(request,response) {
//        response.say('I heard you say yes, this has not been implemented yet');
//    });
//
//app.intent('NoIntent',
//    {"utterances":config.utterances.No
//    },function(request,response) {
//        response.say('I heard you say no, this has not been implemented yet');
//    });
//
//app.intent('RepeatIntent',
//    {"utterances":config.utterances.Repeat
//    },function(request,response) {
//        response.say('I heard you say repeat, this has not been implemented yet');
//    });

// TODO - Alexa-HA still needs tested as an AWS Lambda function!
// Connect the alexa-app to AWS Lambda
//exports.handler = app.lambda();

module.exports = app;