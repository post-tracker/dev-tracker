if (typeof Object.assign !== 'function') {
    Object.assign = function(target, varArgs) { // .length of function is 2
        'use strict';
        if (target == null) { // TypeError if undefined or null
            throw new TypeError('Cannot convert undefined or null to object');
        }

        var to = Object(target);

        for (var index = 1; index < arguments.length; index++) {
            var nextSource = arguments[index];

            if (nextSource != null) { // Skip over if undefined or null
                for (var nextKey in nextSource) {
                    // Avoid bugs when hasOwnProperty is shadowed
                    if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
        }
        return to;
    };
}

// Add window.location.origin to IE & Edge
if ( !window.location.origin ) {
    window.location.origin = window.location.protocol + '//' + window.location.hostname;

    if ( window.location.port ) {
        window.location.origin = window.location.origin + ':' + window.location.port;
    }
}

Number.isNaN = Number.isNaN || function(value) {     
    return value !== null && (value != value || +value != value);
}
