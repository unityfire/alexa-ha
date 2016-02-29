/* This is the default configuration file.  Copy this to 'config.js' and adapt as needed! */
var config = {};

/******************************** GENERAL CONFIGURATION *****************************************/
// Name of the application/skill, which does not need to match the skills 'Invocation Name',
// Defines both the Alexa-App-Server endpoint and the skills own name used in cards.
config.applicationName = 'Alexa-HA';
// AWS ASK applicationId, resembles 'amzn1.echo-sdk-ams.app.[your-unique-value-here]'
config.applicationId = 'amzn1.echo-sdk-ams.app.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
// AWS ASK userID, resembles 'amzn1.echo-sdk-account.[your-unique-value-here]'
config.userId = 'amzn1.echo-sdk-account.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

// Greeting, when saying 'Alexa, open...'
config.greeting = "OpenHAB, at your service";
// URL of an MP3 to play when opening the skill (optional; must be MPEG v2 codec / 48kbps bit rate / 16000 sample rate)
//config.chime = "\ <audio src=\"https://MY_FQDN/files/chime.mp3\" /> ";

// TODO Array of IPs permitted to call the application
//config.allowed_ips = {'AWS':'72.21.217.159', 'Desktop':'192.168.1.5'};

// Wolfram Alpha API key (Optional, used for Research Intent), resembles 'XXXXXX-XXXXXXXXXX' - https://developer.wolframalpha.com/portal/apisignup.html
config.wolframAppId ='XXXXXX-XXXXXXXXXX';

/***************************** HOME AUTOMATION CONFIGURATION ********************************************/
// Choose which Home Automation Controller you are using
// TODO Only 'OpenHAB' is supported at this time.  SmartThings, INSTEON, Vera, etc support is planned.
config.HA_name = 'OpenHAB';

// HA server URL, with credentials - i.e. 'http://USERNAME:PASSWORD@HA_SERVER_IP:PORT'
config.HA_server = 'http://ohuser:ohpassword@192.168.1.50:8080';
// TODO HA String Item which stores the ASK requestID
//config.HA_item_requestId = 'ECHO_RequestId';
// HA Switch Item which determines if the latest request been processed
config.HA_item_processed = 'ECHO_Processed';
// HA String Item which stores the voice command
config.HA_item_voicecmd = 'ECHO_VoiceCMD';
// HA String Item which stores the servers response/answer, to be spoken by ECHO
config.HA_item_answer = 'ECHO_Answer';

// TODO Utilize Array of available rooms that HA has devices in, used for validations & re-prompts (i.e. 'which room did you mean?')
//config.HA_locations = ['all','house','living','great','kitchen','bedroom','data center','garage','office','foyer','utility','powder','outside'];

// Item configuration - itemType / Location / itemName mappings
config.item = {
    'lights': {
        'bedroom': 'Light_Group_Bed',
        'office': 'Light_Group_Office',
        'kitchen': 'Light_Group_Kitchen',
        'living': 'Light_Group_Living',
        'great': 'Light_Group_Great',
        'house': 'Light_Group_All',
        'all': 'Light_Group_All',
        default: 'Light_Group_All'
    },
    'motion': {
        'office': 'Lights_Motion_Office',
        'kitchen': 'Lights_Motion_Kitchen',
        'living': 'Lights_Motion_Living',
        default: 'Lights_Motion_All'
    },
    'fan': {
        'office': 'SmartSwitch1',
        'house': 'HVAC_Fan',
        default: 'HVAC_Fan'
    },
    'stove': {
        'living': 'HVAC_Living_Stove',
        'great': 'HVAC_Great_Stove',
        default: 'HVAC_Great_Stove'
    },
    'music': {
        'living': 'PC_HTPC_Pandora',
        default: 'PC_Desktop_Pandora'
    },
    'mode': {
        'house': 'Scene_General',
        'lighting': 'Scene_Lighting',
        'security': 'Scene_Security',
        default: 'Scene_General'
    },
    'thermostat': {
        'house': 'HVAC_Target_Temp',
        'home': 'HVAC_Target_Temp',
        default: 'HVAC_Target_Temp'
    }
};

// Mode/Scene names to Scene ID mappings
config.mode = {
    'house': {
        'off': '0',
        'work': '1',
        'dinner': '2',
        'party': '3',
        'bed': '4',
        'away': '5',
        'panic': '6',
        'relax': '7',
        'gaming': '8',
        'theater': '9',
        'shower': '10',
        'wake up': '11',
        'TV': '12'
    },
    'lighting': {
        'all off': '0',
        'all on': '1',
        'focus': '2',
        'energize': '3',
        'relax': '4',
        'party': '5',
        'night light': '6',
        'bed time': '7',
        'love shack': '8',
        'lava': '9'
    },
    'security': {
        'off': '0',
        'sleep': '1',
        'home': '2',
        'away': '3'
    }
};

// Metric names to Item mappings
config.metric = {
    'temperature': {
        'office': 'Multi1_Temp',
        'kitchen': 'Multi3_Temp',
        'living': 'Multi2_Temp',
        'great': 'HVAC_Temp',
        'house': 'Avg_Temp',
        default: 'Avg_Temp'
    },
    'humidity': {
        'office': 'Multi1_Humidity',
        'kitchen': 'Multi3_Humidity',
        'living': 'Multi2_Humidity',
        'great': 'HVAC_Humidity',
        'house': 'Avg_Humidity',
        default: 'Avg_Humidity'
    },
    'luminance': {
        'office': 'Multi1_Luminance',
        'kitchen': 'Multi3_Luminance',
        'living': 'Multi2_Luminance',
        'house': 'Avg_Luminance',
        default: 'Avg_Luminance'
    },
    'power consumption': {
        'house': 'HEM1_P2',
        default: 'HEM1_P2'
    }
};

// Unit to metric mappings
config.unit = {
    'temperature': 'degrees',
    'humidity': 'percent',
    'luminance': 'lux',
    'power consumption': 'watts'
};

// Color name to HSB value mappings
config.color = {
    'white': '0,0,100',
    'red': '0,100,100',
    'orange': '40,100,100',
    'yellow': '60,100,100',
    'green': '100,100,100',
    'aqua': '180,100,100',
    'blue': '240,100,100',
    'purple': '290,100,100',
    'magenta': '310,100,100',
    'pink': '330,100,100',
    'black': '80,1,1',
    default: '0,0,100'
};

/******************* ASK Utterances ************************/
// Configure ASK Intent utterances using Alexa-App - reference:
//  https://www.npmjs.com/package/alexa-app#schema-and-utterances for syntax
// NOTE - the custom slot support (i.e. '{-|Location}') currently requires a patched version of Alexa Utterances index.js:
//  https://github.com/rickwargo/alexa-utterances/commit/43fbe74c69205ede8cd2663bd13cfb7a734cbe53
// After modifying utterances or intents, be sure to visit the alexa-app-server endpoint to grab and manually update the skill on the AWS ASK developer page!
config.utterances = {
    // Switch devices ON/OFF in a particular room
    'Switch': [
        "{to |} {turn|switch|flip} {ON|OFF|Action} {the|my |} {light|lights|motion lighting|fan|stove|music|ItemName} {in the |} {-|Location}",
        "{turn|switch|flip} {ON|OFF|Action} {the|my |} {-|Location} {light|lights|motion lighting|fan|stove|music|ItemName}",
        "{to |}{turn|switch|flip} {ON|OFF|Action} {-|Location} the {light|lights|motion lighting|fan|stove|music|ItemName}"
    ],
    // Set HSB color values for lights in a particular room
    'SetColor': [
        "{to |} {set|change|switch|color} {the |} {-|Location} {light|lights} {to |} {-|Color}",
        "{to |} {set|change|switch|color} {the |} {light|lights} in the {-|Location} {to |} {-|Color}"
    ],
    // Dim lights in a particular room
    'SetLevel': [
        "{to |} {dim|turn down|turn up|soften|set} {the |} {light|lights|ItemName} {in the |} {-|Location} to {0-100 by 5|Percent} {percent |}",
        "{dim|turn down|turn up|soften|set} {the |} {-|Location} {light|lights|ItemName} to {0-100 by 5|Percent} {percent |}",
        "{dim|turn down|turn up|soften|set} {light|lights|ItemName} {in the|} {-|Location} to {0-100 by 5|Percent} {percent |}"
    ],
    // Set target temperature for house HVAC
    'SetTemp': [
        "{to |} set {the |} {-|Location} {thermostat|temperature} to {60-80|Degree} {degrees |}"
    ],
    // Set house/lighting/security/etc scenes
    'SetMode': [
        "{to |} {set|change|switch} {the |} {house|ModeType} mode to {off|work|dinner|party|bed|away|panic|relax|gaming|theatre|shower|wake up|TV|ModeName}",
        "{to |} {set|change|switch} {the |} {lighting|ModeType} mode to {all off|all on|focus|energize|relax|party|night light|bed time|love shack|lava|ModeName}",
        "{to |} {set|change|switch} {the |} {security|ModeType} mode to {off|sleep|home|away|ModeName}"
    ],
    // Get current item state values
    'GetState': [
        "{to |} {get|check|whats} {the |} {temperature|humidity|luminance|power consumption|MetricName} {in the |} {-|Location}",
        "{get|check|whats} {the |} {-|Location} {temperature|humidity|luminance|power consumption|MetricName}"
    ],
    // Execute 'raw' voice commands, request/response handled entirely by custom HA server rules
    'VoiceCMD': [
        "{lets party|Input}",
        "{call my bank|call my phone|call work|Input}",
        "{status update|Input}",
        "{for a |}{status update|Input}",
        "{whats the |}{weather like|Input}",
        "{say a quote|Input}",
        "{its cold in here|Input}",
        "{its hot in here|Input}"
    ],
    // Research something arbitrary via Wolfram API call
    'Research': [
        "{to |} research {what is the atomic weight of boron|Question}",
        "{to |} research {what is thirty divided by five|Question}",
        "{to |} research {what did Alexander Graham Bell invent|Question}",
        "{to |} research {what does eleven plus seven equal|Question}",
        "{to |} research {when is sunset tonight|Question}",
        "{to |} research {how tall is mount everest|Question}",
        "{to |} research {how many miles in an acre|Question}",
        "{to |} research {how do you take a derivative|Question}",
        "{to |} research {where did George Washington die|Question}",
        "{to |} research {where are the pyramids|Question}",
        "{to |} research {Why is the sky blue|Question}"
    ],
    // Stop Intent
    'Stop': [
        "{to |} stop {that |}"
    ],
    // Cancel Intent
    'Cancel': [
        "{to |} cancel {that |}"
    ],
    // Help Intent
    'Help': [
        "{for|to |} help {me |}"
    ]

    //TODO implement the yes/no/repeat intents
    //// Yes Intent
    //'Yes': [
    //    "yes {please |}",
    //    "sure",
    //    "do it",
    //    "affirmative"
    //],
    //// No Intent
    //'No': [
    //    "no {thanks |}",
    //    "nope",
    //    "negative",
    //    "negatory"
    //],
    //// Repeat Intent
    //'Repeat': [
    //    "{please |} repeat {that |}",
    //    "say that again",
    //    "what did you say"
    //]
};

/******************* ASK Responses *************************/
// Help response & card
config.help = {
    'say': ['You can ask or tell me to do all sorts of things.  For example, try saying turn all lights on, dim living lights to 50 percent, ' +
    'change office color to blue, set house thermostat to 72 degrees, or research why is the sky blue.  ' +
    'I have sent a cheat sheet of commands to your Alexa App for further reference.'],
    'card': ['Cheat sheet: Switch on all lights / Dim living room lights to 50%  / Set office color to Blue' +
    ' / Set house thermostat to 72 degrees / Set house mode to relax / What is the kitchen humidity / What is the house power consumption / ' +
    'Research why is the sky blue']
};

// Exports
module.exports = config;
