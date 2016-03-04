var _ = require('lodash');
var Error = require('./error');

var Validator = function(params, clientSafeFields) {
    var obj = _.pick(params, clientSafeFields);
    for(key in obj) {
        this[key] = obj[key];
    }
};

Validator.prototype.validationErrors = function() {
    return this.errMsg;
};

// First
Validator.prototype.checkBody = function(key) {
    this.key = key;
    return this;
};

// Second
Validator.prototype.notEmpty = function() {
    this.err = !(this.key in this);
    if(this.err) this.errMsg = this.key + Error.VALUE_EMPTY;
    return this;
};

// Third
Validator.prototype.isAlpha = function() {
    if(!this.err && (typeof this[this.key]) !== 'string') {
        this.err = true;
        this.errMsg = this.key + Error.IS_NOT_STRING;
    }
    return this;
};

// Third
Validator.prototype.isNum = function() {
    if(!this.err && (typeof this[this.key]) !== 'number') {
        this.err = true;
        this.errMsg = this.key + Error.IS_NOT_NUM;
    }
    return this;
};

// Fourth
Validator.prototype.isSupportedDevicePlatform = function() {
    if(!this.err) {
        var devicePlatforms = ['gcm', 'ios_sandbox', 'ios_production'];
        if( devicePlatforms.indexOf( this[this.key] ) < 0 ) {
            this.err = true;
            // this.errMsg = Error.INVALID_PLATFORM;
            this.errMsg = Error.SUPPORT_PLATFORM + devicePlatforms;
        }
    }
    return this;
};

module.exports = Validator;
