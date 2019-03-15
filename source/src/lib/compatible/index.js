/**
 * 兼容低版本API
 */
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function forEach(callback, thisArg) {
        var T, k;
        if (this == null) {
            throw new TypeError("this is null or not defined");
        }
        var O = Object(this);
        var len = O.length >>> 0;
        if (typeof callback !== "function") {
            throw new TypeError(callback + " is not a function");
        }
        if (arguments.length > 1) {
            T = thisArg;
        }
        k = 0;
        while (k < len) {

            var kValue;
            if (k in O) {
                kValue = O[k];
                callback.call(T, kValue, k, O);
            }
            k++;
        }
    };
}
if (!Array.prototype.isArray) {
    Array.prototype.isArray = function isArray(str) {
        return Object.prototype.toString.call(str) == "[object Array]";
    };
}
Object.keys = Object.keys || function(obj) { //ecma262v5 15.2.3.14
    var result = [];
    for (var key in obj)
        if (hasOwn.call(obj, key)) {
            result.push(key);
        }
    if (DONT_ENUM && obj) {
        for (var i = 0; key = DONT_ENUM[i++];) {
            if (hasOwn.call(obj, key)) {
                result.push(key);
            }
        }
    }
    return result;
};