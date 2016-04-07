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
    console.log('FATAL ERROR: the configured HA_name "' + config.HA_name + '" is not currently supported.');
    process.exit(1);
}

// Reloaded by hotswap when code has changed (by alexa-app-server)
module.change_code = 1;

var appName = config.applicationName;

/******************* ASK MAIN ROUTINES **************/
// Define an alexa-app
var app = new alexa.app(appName);
app.launch(function(request,response) {
    // Store the Launch Intent in session, which later keeps the session going for multiple requests/commands
    response.session ('launched', 'true');
    
    response.say(config.greeting);
    if (config.chime) {
        response.say(config.chime);
    }
    
    response.shouldEndSession(false, "How can I help?");
});

app.sessionEnded(function(request,response) {
    response.say('Bye');
});

app.messages.NO_INTENT_FOUND = "I am uncertain what you mean.  Kindly rephrase...";

// Pre-execution security checks - ensure each requests applicationId / userId / password match configured values
app.pre = function(request,response,type) {    
    // Extract values from various levels of the nested request object
    var address = request.data.remoteAddress;
    var password = request.data.password;
    var timestamp = request.data.request.timestamp;
    var requestId = request.data.request.requestId;
    var sessionId = request.sessionId;
    var userId = request.sessionDetails.userId;
    var applicationId = request.sessionDetails.application.applicationId;
    
    // Log the request
    console.log(address + ' - ' + timestamp + ' - ' + ' AWS ASK ' + type + ' received: ' + requestId + ' / ' + sessionId);
    
    if (applicationId !== config.applicationId) {
        console.log(address + ' - ' + timestamp + ' - ERROR: Invalid application ID in request:' + applicationId);
        response.fail("Invalid application ID");
    }
    if (userId !== config.userId) {
        console.log(address + ' - ' + timestamp + ' - ERROR: Invalid userId in request: ' + userId );
        response.fail("Invalid user ID");
    }
    if (password !== config.password) {
        console.log(address + ' - ' + timestamp + ' - ERROR: Invalid password in request: ' + password);
        response.fail("Invalid password");
    }
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
    console.log('REQUEST: Switch Intent slots are: ' + action + '/' + itemName + '/' + location);
    
    // Handle undefined ASK slots
    if (itemName && location) {
        var HA_item = helper.getItem(itemName, location);
    }
    else {
        replyWith('I cannot switch that', response);
        return;
    }
    
    // TODO validate location slot with checkLocation(location)
    
    if (action && itemName && location && HA_item) {
        // Get current state
        HA.getState(HA_item, function (err, state) {
            if (err) {
                console.log('HA getState failed:  ' + err.message);
            }
            // Check if the items current state and action match
            if (state === action) {
                replyWith('Your ' + location + ' ' + itemName + ' is already ' + action, response);
            }
            // Set the new state for the item
            else if (state !== action) {
                HA.setState(HA_item, action);
                replyWith('Switching ' + action + ' your ' + location + ' ' + itemName, response);
            }
            // Unidentified item
            else {
                replyWith('I could not switch ' + action + ' your ' + location + ' ' + itemName, response);
            }
        });
    } else {
        replyWith('I cannot currently switch your ' + location + ' ' + itemName, response);
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
    console.log('REQUEST: SetColor Intent slots are: ' + color + '/' + location);

    // Handle undefined ASK slots
    if (location && color) {
        //Set color intent, assume we are dealing with lighting...
        var HA_item = helper.getItem('lights',location);
        var HSBColor = helper.getColor(color);
    }
    else {
        replyWith('I cannot set that color', response);
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
                replyWith('Your ' + location + ' lights color is already ' + color, response);
            }
            // Set the new state for the item
            else if (state !== HSBColor) {
                HA.setState(HA_item, HSBColor);
                replyWith('Setting your ' + location + ' lights color to ' + color, response);
            }
            // Unidentified item
            else {
                replyWith('I could not set your ' + location + ' lights color to ' + color, response);
            }
        });
    }
    else {
        replyWith('I cannot currently set your ' + location + ' lights color to ' + color, response);
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
    console.log('REQUEST: Dim Intent slots are: ' + percent + '/' + itemName + '/' + location);

    // Handle undefined ASK slots
    if (itemName && location) {
        var HA_item = helper.getItem(itemName,location);
    }
    else {
        replyWith('I cannot dim that device', response);
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
                replyWith('Your ' + location + ' lights color are already at ' + percent + ' percent', response);
            }
            // Set the new state for the item
            else if (state !== percent) {
                HA.setState(HA_item, percent);
                replyWith('Dimming your ' + location + ' ' + itemName + ' to ' + percent + ' percent', response);
            }
            // Unidentified item
            else {
                replyWith('I could not dim your ' + location + ' ' + itemName + ' to ' + percent + ' percent', response);
            }
        });
    }
    else {
        replyWith('I cannot currently set your ' + location + ' lights to ' + percent + ' percent', response);
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
    console.log('REQUEST: SetTemp Intent slots are: ' + degree + '/' + location);

    // Handle undefined ASK slots
    if (degree && location) {
        var HA_item = helper.getItem('thermostat',location);
    }
    else {
        replyWith('I cannot set that temperature', response);
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
                replyWith('Your ' + location + ' target temperature is already set to ' + degree + ' degrees', response);
            }
            // Set the new state for the item
            else if (state !== degree) {
                HA.setState(HA_item, degree);
                replyWith('Setting your ' + location + ' target temperature to ' + degree + ' degrees', response);
            }
            // Unidentified item
            else {
                replyWith('I could not set your ' + location + ' to ' + degree + ' degrees.  Try something between 60 and 80 degrees fahrenheit.', response);
            }
        });
    }
    else {
        replyWith('I cannot currently set your ' + location + ' temperature to ' + degree + ' degrees', response);
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
    console.log('REQUEST: SetMode Intent slots are: ' + modeType + '/' + modeName);

    if (modeType && modeName) {
        var modeId = helper.getMode(modeType, modeName);
        var HA_item = helper.getItem('mode', modeType);
    }
    else {
        replyWith('I cannot set that mode', response);
        return;
    }

    if (modeId && HA_item) {
        HA.setState(HA_item, modeId);
        replyWith('Changing your ' + modeType + ' mode to ' + modeName, response);
    }
    else {
        replyWith('I cannot currently set your ' + modeType + ' mode to ' + modeName);
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
    console.log('REQUEST: GetState Intent slots are: ' + metricName + '/' + location);

    if (metricName && location) {
        var HA_item = helper.getMetric(metricName,location);
        var HA_unit = helper.getUnit(metricName);
    }
    else {
        replyWith('I cannot get that devices state', response);
        return;
    }

    if (HA_item && HA_unit) {
        HA.getState(HA_item, function (err, state) {
            if (err) {
                console.log('HA getState failed:  ' + err.message);
            } else if (state) {
                replyWith('Your ' + location + ' ' + metricName + ' is currently ' + state + ' ' + HA_unit, response);
            }
        });
    }
    else {
        replyWith('I cannot currently get the ' + metricName + ' in the ' + location, response);
    }
    return false;
});

// Get current mode (house/lighting/security scenes)
app.intent('GetMode', {
    "slots":{"ModeType":"LITERAL"}
    ,"utterances":config.utterances.GetMode
},function(request,response) {
    var modeType = request.slot('ModeType');

    // DEBUG response
    //console.log('RawResponseData: ',request.data);
    console.log('REQUEST: GetMode Intent slots are: ' + modeType);

    if (modeType) {
        var HA_item = helper.getItem('mode', modeType);
        
        if (!HA_item) {
            replyWith('I could not get the ' + modeType + ' mode', response);
        }
        
        HA.getState(HA_item, function (err, modeId) {
            if (err) {
                console.log('HA getState failed:  ' + err.message);
            } else if (modeId) {
                var modeName = helper.getModeName(modeType,modeId);
                replyWith('Your ' + modeType + ' mode is set to ' + modeName, response);
            }
        });
    }
    else {
        replyWith('I cannot currently get the ' + modeType + ' mode', response);
    }
    return false;
});

// Handle arbitrary voice commands, passed to HA VoiceCommand item which then executes server side rules
app.intent('VoiceCMD', {
    "slots":{"Input":"LITERAL"}
    ,"utterances":config.utterances.VoiceCMD
},function(request,response) {
    var voiceCMD = request.slot('Input');

    // DEBUG response
    //console.log('RawResponseData: ',request.data);
    console.log('REQUEST: VoiceCMD Intent slots are: ' + voiceCMD);

    HA.setState(config.HA_item_processed, 'OFF');
    HA.setState(config.HA_item_voicecmd, voiceCMD);

    HA.runVoiceCMD(function(err,msg) {
        if (err) {
            replyWith('I could not reach your Home Automation controller', response);
        } else if (msg) {
            replyWith(msg, response);
        }
    });
    return false;
});

// Research almost anything via wolfram alpha (API Key required)
app.intent('Research', {
    "slots":{"Question":"LITERAL"}
    ,"utterances":config.utterances.Research
},function(request,response) {
    var question = request.slot('Question');

    // DEBUG response
    //console.log('RawResponseData: ',request.data);
    console.log('REQUEST: Research Intent hit! Question is: ' + question);

    // Handle request/response/error from Wolfram
    wolfram.askWolfram(question, function (err,msg) {
        if (err) {
            replyWith('I could not quickly determine an answer to your question', response);
        } else if (msg) {
            replyWith(msg, response);
        }
    });
    return false;
});

app.intent('StopIntent',
    {"utterances":config.utterances.Stop
    },function(request,response) {
        console.log('REQUEST:  Stopping...');
        response.say("Bye").send();
    });

app.intent('CancelIntent',
    {"utterances":config.utterances.Cancel
    },function(request,response) {
        console.log('REQUEST:  Cancelling...');
        response.say("Bye").send();
    });

app.intent('HelpIntent',
    {"utterances":config.utterances.Help
    },function(request,response) {
        console.log('REQUEST:  Help...');
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

// Custom ASK response handler
function replyWith(speechOutput,response) {
    // Log the response to console
    console.log('RESPONSE: ' + speechOutput);
    
    // 'Say' the response on the ECHO
    response.say(speechOutput);
    
    // Show a 'Card' in the Alexa App
    response.card(appName,speechOutput);
    
    // If this is a Launch request, do not end session and handle multiple commands
    if (response.session ('launched') === 'true') { 
        response.shouldEndSession (false); 
    }
    
    // 'Send' the response to end upstream asynchronous requests
    response.send();
}

// TODO - Alexa-HA still needs tested as an AWS Lambda function!
// Connect the alexa-app to AWS Lambda
//exports.handler = app.lambda();

module.exports = app;