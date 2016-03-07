var config = require('./config');

/************** CONFIG HELPER *********************/
// Get itemName from itemType & location
function getItem(itemType, location) {
    //Handle variances of itemType for config value lookup
    if (itemType === 'lighting' || itemType === 'light') {
        //console.log('getItem itemType modified:' + itemType);
        itemType = 'lights';
    }

    //Strip dangling ' room' in utterance for config value lookup
    var suffix = ' room';
    if (location.substr(-suffix.length) === suffix) {
        //console.log('getItem location trimmed:' + location);
        location = location.replace(' room','');
    }

    for(var key in config.item) {
        console.log('getItem key:' + key);
        if(config.item.hasOwnProperty(itemType)) {
            //console.log('getItem val:' + config.item[itemType][location]);
            return config.item[itemType][location];
        }
    }
    return false;
}

// Get itemName from metricName & location
function getMetric(metricName, location) {
    //Strip dangling ' room' suffix for for config value lookup
    var suffix = ' room';
    if (location.substr(-suffix.length) === suffix) {
        //console.log('getMetric location trimmed:' + location);
        location = location.replace(' room','');
    }

    for(var key in config.metric) {
        if(config.metric.hasOwnProperty(metricName)) {
            //console.log('getMetric val:' + config.metric[metricName][location]);
            return config.metric[metricName][location];
        }
    }
    return false;
}

// Get unit from metricName
function getUnit(metricName) {
    for(var key in config.unit) {
        if(config.unit.hasOwnProperty(metricName)) {
            return config.unit[metricName];
        }
    }
    return false;
}

// Get HSB value from colorName
function getColor(colorName) {
    for(var key in config.color) {
        if(config.color.hasOwnProperty(colorName)) {
            return config.color[colorName];
        }
    }
    return false;
}

// Get itemName from modeType & modeName
function getMode(modeType,modeName) {
    for(var key in config.mode) {
        if(config.mode.hasOwnProperty(modeType)) {
            //console.log('getMode val:' + config.mode[modeType][modeName]);
            return config.mode[modeType][modeName];
        }
    }
    return false;
}

// Get modeName from modeType & modeId
function getModeName(modeType,modeId) {    
    for(var key in config.mode[modeType]) {
        if (config.mode[modeType][key] === modeId) {
          return key;
        }
    }
    return false;
}

// Exports
module.exports.getItem = getItem;
module.exports.getMetric = getMetric;
module.exports.getUnit = getUnit;
module.exports.getColor = getColor;
module.exports.getMode = getMode;
module.exports.getModeName = getModeName;