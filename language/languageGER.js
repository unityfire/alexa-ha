/******************* ASK Utterances ************************/
// Configure ASK Intent utterances using Alexa-App - reference:
//  https://www.npmjs.com/package/alexa-app#schema-and-utterances for syntax
var language = {};

language.utterances = {
    // Switch devices ON/OFF in a particular room
    'Switch': [
      "{schalte|mache|mach|fahre} {den|die|das|mein|meinen|meins|meine|} {-|ItemName} {in der|im|an der|am} {-|Location} {-|Action}",
      "{schalte|mache|mach|fahre} {den|die|das|mein|meinen|meins|meine|} {-|Location} {-|ItemName} {-|Action}",

    ],
    // Set HSB color values for lights in a particular room
    'SetColor': [
        "{to |} {set|change|switch} {the|my |} {-|Location} {light|lights|lighting} color {to |} {-|Color}",
        "{to |} {set|change|switch} {the|my |} {light|lights|lighting} color in the {-|Location} {to |} {-|Color}",
        "color {the|my |} {light|lights|lighting} in the {-|Location} {to |} {-|Color}",
        "color {the|my |} {-|Location} {light|lights} {to |} {-|Color}",
        "make {the|my |} {-|Location} {light|lights} {-|Color}"
    ],
    // Dim lights in a particular room
    'SetLevel': [
        "{to |} {dim|turn down|turn up|soften|adjust} {the|my |} {light|lights|lighting|ItemName} {in the |} {-|Location} to {0-100 by 5|Percent} {percent |}",
        "{to |} {dim|turn down|turn up|soften|adjust} {the|my |} {-|Location} {light|lights|lighting|ItemName} to {0-100 by 5|Percent} {percent |}",
        "{to |} {set|turn down|turn up|adjust} {the|my |} {-|Location} {volume|ItemName} to {0-100 by 5|Percent} {percent |}"
    ],
    // Set target temperature for house HVAC
    'SetTemp': [
        "{to |} {set|change|adjust} {the|my |} {-|Location} {thermostat|temperature} to {60-80|Degree} {degrees |}",
        "{to |} {set|change|adjust} {the|my |} {thermostat|temperature} {in the|in my |} {-|Location} to {60-80|Degree} {degrees |}"
    ],
    // Set house/lighting/security/etc scenes
    'SetMode': [
        "{to |} {set|change|switch} {the|my |} {house|ModeType} mode to {off|work|dinner|party|bed|away|panic|relax|gaming|theatre|shower|wake up|TV|ModeName}",
        "{to |} {set|change|switch} {the|my |} {lighting|ModeType} mode to {all off|all on|focus|energize|relax|party|night light|bed time|love shack|lava|ModeName}",
        "{to |} {set|change|switch} {the|my |} {security|ModeType} mode to {off|sleep|home|away|ModeName}",
        "{to |} {set|change|switch} {the|my |} {house|ModeType} to {off|work|dinner|party|bed|away|panic|relax|gaming|theatre|shower|wake up|TV|ModeName} mode",
        "{to |} {set|change|switch} {the|my |} {lighting|ModeType} to {all off|all on|focus|energize|relax|party|night light|bed time|love shack|lava|ModeName} mode",
        "{to |} {set|change|switch} {the|my |} {security|ModeType} to {off|sleep|home|away|ModeName} mode"
    ],
    // Get current item state values
    'GetState': [
        // "{to |} {get|check} {the|my |} {-|Location} {temperature|humidity|luminance|power consumption|visibility|pressure|wind|humidex|MetricName}",
        // "{to |} {get|check} {the|my |} {temperature|humidity|luminance|power consumption|visibility|pressure|wind|humidex|MetricName} {in the |} {-|Location}",
        // "whats {the|my |} {-|Location} {temperature|humidity|luminance|power consumption|visibility|pressure|wind|humidex|MetricName}",
        // "whats {the|my |} {temperature|humidity|luminance|power consumption|visibility|pressure|wind|humidex|MetricName} {in the |} {-|Location}"
        "wie ist {die|der|das|} {-|MetricName} {in der|im|an der|am} {-|Location}",

    ],
    // Get current house/lighting/security/etc scene
    'GetMode': [
        "{to |} {get|check} {the|my |} {house|lighting|security|ModeType} mode {set to |}",
        "whats {the|my |} {house|lighting|security|ModeType} mode {set to |}"
    ],
    // Execute 'raw' voice commands, request/response handled entirely by custom HA server rules
    'VoiceCMD': [
        "{lets party|Input}",
        "{call my bank|call my phone|call work|Input}",
        "{status update|Input}",
        "{for a |}{status update|Input}",
        "{whats the |}{weather like|Input}",
        "{say a |} {quote|Input}",
        "{its} {cold in here|Input}",
        "{its} {hot in here|Input}"
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
        "{to |} stop {that |}",
        "{to |} quit {that |}",
        "{to |} exit {that |}",
        "{to |} never mind {that |}"
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
language.help = {
    'say':  [
            'Im Moment behersche ich das schalten von Lampen und das hoch und runter fahren von Rolläden' ],
    'card': [
            'Cheat sheet: kommt noch'
            ]
};
  language.bye = 'tschüss!';

  language.launch = "Wie kann ich helfen";
  language.noIntent = "Ich bin unsicher was du meinst. Bitte versuche es noch einmal!";

  //Switches
  language.noSwitch = 'Das kann ich nicht schalten! Es gibt kein solches Item!';
  language.switchAlreadyInState = function switchAlreadyInState(location,itemName,action){
    return 'Dein '+ itemName  + ' ist bereits ' +action;
  }
  language.switchToState = function switchToState(location, itemName, action) {
    if (itemName === 'licht' || itemName === 'lampe'){
      return 'Ich habe das Licht' + ' ' + action + ' geschaltet';
    }
    if (itemName === 'rolladen'){
      return 'Ich habe den Rolladen' + ' ' + action + ' gefahren';
    }

  }
  language.switchUndefinedItem = function switchUndefinedItem(location,itemName,action) {
    return 'Ich kann ' + itemName + 'nicht ' + action + ' schalten'
  }
  language.switchError = function switchError(location,itemName) {
    console.log('schaltfehler' + location + ' ' + itemName);
    return 'Ich kann ' + itemName + ' nicht schalten';
  }
  language.translateAction = function translateAction(action){
    if (action === 'EIN' || action === 'AN'){
      return 'ON'
    }
    if (action === 'AUS') {
      return 'OFF'
    }
    if (action === 'HOCH'|| action === 'NACH OBEN'){
      return '0'
    }
    if (action === 'RUNTER'|| action === 'NACH UNTEN'){
      return '100'
    }
  }

  language.couldNotGetState = 'ich konnte den Wert nicht holen';
  language.replyGetState = function replyGetState (location, metricName, state, HA_unit ){
    state = state.replace('.',',');
    state = state.substr(0,4);
    return 'die aktuelle ' + metricName + ' beträgt ' + state  +' '+HA_unit;
  }
  language.greeting = "openhab zu Diensten!"

module.exports = language;
