/* Default Alexa HA configuration file.  Copy this to 'config.js' and adapt as needed! */
var config = {};
//change here for the required language

var configuredLanguage = './language/languageGER'
var language = require(configuredLanguage);

/******************************** GENERAL CONFIGURATION *****************************************/
// Name of the application/skill, which does not need to match the skills 'Invocation Name',
// Defines both the Alexa-App-Server endpoint and the skills own name used in cards.
config.applicationName = 'Alexa-HA';

// AWS ASK applicationId, resembles 'amzn1.echo-sdk-ams.app.[your-unique-value-here]'
config.applicationId = 'amzn1.ask.skill.xxxxxx';

// AWS ASK userID, resembles 'amzn1.echo-sdk-account.[your-unique-value-here]'
config.userId = 'amzn1.ask.account.xxxxxxxxx'
// AWS ASK password, randomly generated password to be included in the Skill's endpoint URL (i.e. '?password=XXXXXXXXXXXX')
config.password = '';

// Greeting, when saying 'Alexa, open...'
config.greeting = "OpenHAB, at your service";

// URL of an MP3 to play when opening the skill (optional; must be MPEG v2 codec / 48kbps bit rate / 16000 sample rate)
//config.chime = "\ <audio src=\"https://MY_FQDN/files/chime.mp3\" /> ";

// TODO Array of IPs permitted to call the application endpoint
//config.allowed_ips = {'AWS':'72.21.217.159', 'Desktop':'192.168.1.5'};

// Wolfram Alpha API key (Optional, used for Research Intent), resembles 'XXXXXX-XXXXXXXXXX' - https://developer.wolframalpha.com/portal/apisignup.html
config.wolframAppId ='XXXXXX-XXXXXXXXXX';

/***************************** HOME AUTOMATION CONFIGURATION ********************************************/
// Choose which Home Automation Controller you are using
// TODO Only 'OpenHAB' is supported at this time.  SmartThings, INSTEON, Vera, etc support is planned.
config.HA_name = 'OpenHAB';

// HA server protocol (http/https)
config.HA_protocol = 'http';

// HA server username
config.HA_user = '';

// HA server password
config.HA_password = '';

// HA server FQDN/IP
config.HA_host = '';

// HA server port
config.HA_port = '';

// HA server URL with credentials - i.e. 'http(s)://USERNAME:PASSWORD@HA_SERVER_IP:HA_SERVER_PORT' (constructed from above variables)
config.HA_server = config.HA_protocol + '://' + config.HA_user + ':' + config.HA_password + '@' + config.HA_host + ':' + config.HA_port;

 // TODO - HA Switch Item which toggles ECHO request handling ON/OFF
 //config.HA_item_switch = 'ECHO_Switch';

// TODO HA String Item which stores the ASK requestID
//config.HA_item_requestId = 'ECHO_RequestId';

//HA Switch Item which determines if the latest request been processed
config.HA_item_processed = 'ECHO_Processed';

// HA String Item which stores the voice command
config.HA_item_voicecmd = 'ECHO_VoiceCMD';

// HA String Item which stores the servers response/answer, to be spoken by ECHO
config.HA_item_answer = 'ECHO_Answer';

// Array of available rooms that HA has devices in, used for validations & re-prompts
config.HA_locations = ['Küche','Wohnzimmer','Esszimmer','Diele'];

// Item configuration - itemType / Location / itemName mappings
config.item = {
    'licht': {
        'bedroom': 'Light_Group_Bed',
        'office': 'Light_Group_Office',
        'kitchen': 'Light_Group_Kitchen',
        'living': 'Light_Group_Living',
        'great': 'Light_Group_Great',
        'house': 'Light_Group_All',
        'all': 'Light_Group_All',
        'wohnzimmer': 'LichtWohnzimmer_1',
        'diele': 'LichtDiele',
        default: 'Light_Group_All'
    },
    'motion': {
        'office': 'Lights_Motion_Office',
        'kitchen': 'Lights_Motion_Kitchen',
        'living': 'Lights_Motion_Living',
        'all': 'Lights_Motion_All',
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
        'office': 'PC_Desktop_Pandora',
        default: 'PC_Desktop_Pandora'
    },
    'volume': {
        'living room': 'Living_Volume',
        'office': 'Office_Volume',
        default: 'Office_Volume'
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
    },
    'lock': {
        'front door': 'Lock_Front_Door',
        'garage door': 'Lock_Garage_Door',
        default: 'Lock_All_Doors'
    },
    'roller shutter': {
        'bedroom': 'Shutter_Bed',
        'office': 'Shutter_Office',
        'kitchen': 'Shutter_Kitchen',
        'living': 'Shutter_Living',
        'great': 'Shutter_Great',
        'house': 'Shutter_All',
        'all': 'Shutter_All',
        default: 'Shutter_All'
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
        'data center': 'HVAC_DataCenter_Temp',
        'house': 'Avg_Temp',
        'inside': 'Avg_Temp',
        'indoor': 'Avg_Temp',
        'outside': 'Weather_Temp',
        'outdoor': 'Weather_Temp',
        default: 'Avg_Temp'
    },
    'humidity': {
        'office': 'Multi1_Humidity',
        'kitchen': 'Multi3_Humidity',
        'living': 'Multi2_Humidity',
        'great': 'HVAC_Humidity',
        'house': 'Avg_Humidity',
        'inside': 'Avg_Humidity',
        'indoor': 'Avg_Humidity',
        'outside': 'Weather_Humidity',
        'outdoor': 'Weather_Humidity',
        default: 'Avg_Humidity'
    },
    'luminance': {
        'office': 'Multi1_Luminance',
        'kitchen': 'Multi3_Luminance',
        'living': 'Multi2_Luminance',
        'house': 'Avg_Luminance',
        'inside': 'Avg_Luminance',
        'indoor': 'Avg_Luminance',
        default: 'Avg_Luminance'
    },
    'power consumption': {
        'house': 'HEM1_P2',
        default: 'HEM1_P2'
    },
    'visibility': {
        'outdoor': 'Weather_Visibility',
        'outside': 'Weather_Visibility',
        default: 'Weather_Visibility'
    },
    'pressure': {
        'outdoor': 'Weather_Pressure',
        'outside': 'Weather_Pressure',
        default: 'Weather_Pressure'
    },
    'wind': {
        'outdoor': 'Weather_Wind',
        'outside': 'Weather_Wind',
        default: 'Weather_Wind'
    },
    'humidex': {
        'outdoor': 'Weather_Humidex',
        'outside': 'Weather_Humidex',
        default: 'Weather_Humidex'
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
    'black': '0,0,0',
    default: '0,0,100'
};

/******************* ASK Utterances ************************/
// Configure ASK Intent utterances using Alexa-App - reference:
//  https://www.npmjs.com/package/alexa-app#schema-and-utterances for syntax
config.utterances = language.utterances

/******************* ASK Responses *************************/
// Help response & card
config.help = language.help
config.language = language
// Exports
module.exports = config;
// module.exports = language;
