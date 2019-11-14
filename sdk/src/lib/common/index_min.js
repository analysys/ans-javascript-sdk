// import { decodeGBK } from './decodeGBK.js'
var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="

function _utf8_encode(string) {
    string = string.replace(/\r\n/g, "\n")
    var utftext = ""
    for (var n = 0; n < string.length; n++) {
        var c = string.charCodeAt(n)
        if (c < 128) {
            utftext += String.fromCharCode(c)
        } else if ((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192)
            utftext += String.fromCharCode((c & 63) | 128)
        } else {
            utftext += String.fromCharCode((c >> 12) | 224)
            utftext += String.fromCharCode(((c >> 6) & 63) | 128)
            utftext += String.fromCharCode((c & 63) | 128)
        }

    }
    return utftext
}

function _utf8_decode(utftext) {
    var string = "",
        i = 0,
        c = 0,
        c1 = 0,
        c2 = 0,
        c3 = 0
    while (i < utftext.length) {
        c = utftext.charCodeAt(i)
        if (c < 128) {
            string += String.fromCharCode(c)
            i++
        } else if ((c > 191) && (c < 224)) {
            c2 = utftext.charCodeAt(i + 1)
            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63))
            i += 2
        } else {
            c2 = utftext.charCodeAt(i + 1)
            c3 = utftext.charCodeAt(i + 2)
            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63))
            i += 3
        }
    }
    return string
}

function Util() {}
Util.prototype.paramType = function (param) {
    return Object.prototype.toString.call(param).replace('[object ', '').replace(']', '')
}
Util.prototype.objHasKay = function (obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key)
}
Util.prototype.ArrayToObj = function (arr) {
    var obj = {}
    for (var i = 0; i < arr.length; i++) {
        obj[arr[i]] = ''
    }
    return obj
}
Util.prototype.keyValueToObje = function (key, value) {
    var obj = {}
    obj[key] = value
    return obj
}
Util.prototype.toDeepObj = function (param1, param2, level) {
    var obj = {}

    if (this.paramType(param1) === 'String') {
        obj = this.keyValueToObje(param1, param2)
        return obj
    }

    if (this.paramType(param1) === 'Array') {
        obj = this.ArrayToObj(param1)
        return obj
    }

    if (this.paramType(param1) === 'Object') {
        for (var key in param1) {
            obj[key] = this.toDeepObj(param1[key])
        }
    }
    return obj
}
Util.prototype.toObj = function (param1, param2, level) {
    var obj = {}

    if (this.paramType(param1) === 'String') {
        obj = this.keyValueToObje(param1, param2)
        return obj
    }

    if (this.paramType(param1) === 'Array') {
        obj = this.ArrayToObj(param1)
        return obj
    }

    if (this.paramType(param1) === 'Object') {

        return param1

    }
    return obj
}
Util.prototype.objMerge = function (parentObj, part) {
    if (this.paramType(parentObj) !== 'Object' || this.paramType(part) !== 'Object') {
        return parentObj
    }
    var obj = {}
    for (var key in parentObj) {
        obj[key] = parentObj[key]
    }
    for (var key in part) {
        if (obj[key] && this.paramType(obj[key]) === 'Object' && this.paramType(part[key]) === 'Object') {
            obj[key] = this.objMerge(obj[key], part[key])
        } else if (this.paramType(obj[key]) === 'Array' && this.paramType(part[key]) === 'Array') {
            obj[key] = this.arrayMergeUnique(obj[key], part[key])
        } else {
            obj[key] = part[key]
        }
    }
    return obj
}
Util.prototype.compose = function () {
    var args = arguments;
    var start = args.length - 1;
    return function () {
        var i = start;
        var result = args[start].apply(this, arguments);
        while (i--) result = args[i].call(this, result);
        return result;
    };
};
Util.prototype.fnMerge = function (parentObj, part) {
    if (this.paramType(parentObj) !== 'Object' || this.paramType(part) !== 'Object') {
        return parentObj
    }
    var obj = {}
    for (var key in parentObj) {
        obj[key] = parentObj[key]
    }
    for (var key in part) {
        if (obj[key] && this.paramType(obj[key]) === 'Object' && this.paramType(part[key]) === 'Object') {
            obj[key] = this.fnMerge(obj[key], part[key])
        } else if (this.paramType(obj[key]) === 'Function' && this.paramType(part[key]) === 'Function') {
            obj[key] = this.compose(obj[key], part[key])
        } else {
            obj[key] = part[key]
        }
    }
    return obj
}
Util.prototype.arrayUnique = function (arr) {
    var tmpArr = [],
        hash = {}; //hash为hash表
    for (var i = 0; i < arr.length; i++) {
        if (!hash[arr[i]]) { //如果hash表中没有当前项
            hash[arr[i]] = true; //存入hash表
            tmpArr.push(arr[i]); //存入临时数组
        }
    }
    return tmpArr
}
Util.prototype.arrayMerge = function (arr1, arr2) {
    arr1.push.apply(arr1, arr2)
    return arr1
}
Util.prototype.arrayMergeUnique = function (arr1, arr2) {
    arr1.push.apply(arr1, arr2)
    return this.arrayUnique(arr1)
}
Util.prototype.encode = function (input) {
    var output = "",
        chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0
    input = _utf8_encode(input)
    while (i < input.length) {
        chr1 = input.charCodeAt(i++)
        chr2 = input.charCodeAt(i++)
        chr3 = input.charCodeAt(i++)
        enc1 = chr1 >> 2
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4)
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6)
        enc4 = chr3 & 63
        if (isNaN(chr2)) {
            enc3 = enc4 = 64
        } else if (isNaN(chr3)) {
            enc4 = 64
        }
        output = output +
            _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
            _keyStr.charAt(enc3) + _keyStr.charAt(enc4)
    }
    return output
}
Util.prototype.decode = function (input) {
    var output = "",
        chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "")
    while (i < input.length) {
        enc1 = _keyStr.indexOf(input.charAt(i++))
        enc2 = _keyStr.indexOf(input.charAt(i++))
        enc3 = _keyStr.indexOf(input.charAt(i++))
        enc4 = _keyStr.indexOf(input.charAt(i++))
        chr1 = (enc1 << 2) | (enc2 >> 4)
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4
        output = output + String.fromCharCode(chr1)
        if (enc3 != 64) {
            output = output + String.fromCharCode(chr2)
        }
        if (enc4 != 64) {
            output = output + String.fromCharCode(chr3)
        }
    }
    output = _utf8_decode(output)
    return output
}
Util.prototype.isEmptyObject = function (obj) {
    var name;
    for (name in obj) {
        return false;
    }
    return true;
}
Util.prototype.format = function (time, format) {
    var offset_GMT = time.getTimezoneOffset();
    time = new Date(time.getTime() + offset_GMT * 60 * 1000 + 8 * 60 * 60 * 1000) //转换为东八区时间
    var o = {
        "M+": time.getMonth() + 1, //month
        "d+": time.getDate(), //day
        "h+": time.getHours(), //hour
        "m+": time.getMinutes(), //minute
        "s+": time.getSeconds(), //second
        "q+": Math.floor((time.getMonth() + 3) / 3), //quarter
        "S+": time.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
        (time.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1,
                RegExp.$1.length == 3 ? (("" + o[k]).length < 3 ? ("00" + o[k]).substr(("00" + o[k]).length - 3, ("00" + o[k]).length) : o[k]) :
                ("00" + o[k]).substr(("" + o[k]).length));

    return format;
}
Util.prototype.MD5 = function (value, bit) {
    var sMessage = value;

    function RotateLeft(lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }

    function AddUnsigned(lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (lX4 & lY4) return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        if (lX4 | lY4) {
            if (lResult & 0x40000000) return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            else return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
        } else return (lResult ^ lX8 ^ lY8);
    }

    function F(x, y, z) {
        return (x & y) | ((~x) & z);
    }

    function G(x, y, z) {
        return (x & z) | (y & (~z));
    }

    function H(x, y, z) {
        return (x ^ y ^ z);
    }

    function I(x, y, z) {
        return (y ^ (x | (~z)));
    }

    function FF(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    }

    function GG(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    }

    function HH(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    }

    function II(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    }

    function ConvertToWordArray(sMessage) {
        var lWordCount;
        var lMessageLength = sMessage.length;
        var lNumberOfWords_temp1 = lMessageLength + 8;
        var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
        var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
        var lWordArray = Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (sMessage.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    }

    function WordToHex(lValue) {
        var WordToHexValue = "",
            WordToHexValue_temp = "",
            lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
        }
        return WordToHexValue;
    }
    var x = Array();
    var k, AA, BB, CC, DD, a, b, c, d
    var S11 = 7,
        S12 = 12,
        S13 = 17,
        S14 = 22;
    var S21 = 5,
        S22 = 9,
        S23 = 14,
        S24 = 20;
    var S31 = 4,
        S32 = 11,
        S33 = 16,
        S34 = 23;
    var S41 = 6,
        S42 = 10,
        S43 = 15,
        S44 = 21;
    // Steps 1 and 2. Append padding bits and length and convert to words 
    x = ConvertToWordArray(sMessage);
    // Step 3. Initialise 
    a = 0x67452301;
    b = 0xEFCDAB89;
    c = 0x98BADCFE;
    d = 0x10325476;
    // Step 4. Process the message in 16-word blocks 
    for (k = 0; k < x.length; k += 16) {
        AA = a;
        BB = b;
        CC = c;
        DD = d;
        a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
        d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
        c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
        b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
        a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
        d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
        c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
        b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
        a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
        d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
        c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
        b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
        a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
        d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
        c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
        b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
        a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
        d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
        c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
        b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
        a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
        d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
        c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
        b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
        a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
        d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
        c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
        b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
        a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
        d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
        c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
        b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
        a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
        d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
        c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
        b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
        a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
        d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
        c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
        b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
        a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
        d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
        c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
        b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
        a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
        d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
        c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
        b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
        a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
        d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
        c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
        b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
        a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
        d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
        c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
        b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
        a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
        d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
        c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
        b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
        a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
        d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
        c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
        b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
        a = AddUnsigned(a, AA);
        b = AddUnsigned(b, BB);
        c = AddUnsigned(c, CC);
        d = AddUnsigned(d, DD);
    }
    if (bit == 32) {
        return WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);
    } else {
        return WordToHex(b) + WordToHex(c);
    }
}
Util.prototype.clientTimeZone = function () {

    var munites = new Date().getTimezoneOffset();

    var hour = parseInt(munites / 60);

    var munite = munites % 60;

    var prefix = "-";

    if (hour <= 0 || munite < 0) {

        prefix = "+";

        hour = -hour;

        if (munite < 0) {

            munite = -munite;

        }

    }

    hour = hour + "";

    munite = munite + "";

    if (hour.length == 1) {

        hour = "0" + hour;

    }

    if (munite.length == 1) {

        munite = "0" + munite;

    }

    return prefix + hour + ':' + munite;
}

Util.prototype.delEmpty = function (obj) {
    var newObj = {}
    for (var key in obj) {
        var inType = true
        var valueType = this.paramType(obj[key])

        if (valueType !== 'Object') {
            if (!obj[key] &&
                (valueType !== 'Number' || isNaN(obj[key])) &&
                valueType !== 'Boolean') {
                inType = false
            }
            if (inType === true) {
                newObj[key] = obj[key]
            }
        } else {
            newObj[key] = this.delEmpty(obj[key])
        }


    }
    for (var key in newObj) {
        var values = [];
        for (var key1 in newObj[key]) {
            values.push(newObj[key][key1])
        }
        if (values.length === 0 && newObj[key].constructor === Object) {
            delete newObj[key]
        }
    }
    return newObj
};
// //兼容bind函数
// if(!Function.prototype.bind){
//     Function.prototype.bind = function(){
//         if(typeof this !== 'function'){
// 　　　　　　throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
// 　　　　}
//         var _this = this;
//         var obj = arguments[0];
//         var ags = Array.prototype.slice.call(arguments,1);
//         return function(){
//             _this.apply(obj,ags);
//         };
//     };
// }
Util.prototype.addEvent = function (el, type, fn, useCapture) {
    if (document.addEventListener) {
        if (el.length && el !== window) {

            for (var i = 0; i < el.length; i++) {
                this.addEvent(el[i], type, fn, useCapture);
            }
        } else {
            el.addEventListener(type, fn, useCapture);
        }
    } else {
        if (el.length && el !== window) {
            for (var i = 0; i < el.length; i++) {
                this.addEvent(el[i], type, fn);
            }
        } else {
            el.attachEvent('on' + type, function () {
                return fn.call(el, window.event);
            });
        }
    }
}

Util.prototype.removeEvent = function (el, type, fn, useCapture) {
    if (document.removeEventListener) {
        if (el.length) {

            for (var i = 0; i < el.length; i++) {
                this.removeEvent(el[i], type, fn, useCapture);
            }
        } else {
            el.removeEventListener(type, fn, useCapture);
        }
    } else {
        if (el.length) {
            for (var i = 0; i < el.length; i++) {
                this.removeEvent(el[i], type, fn);
            }
        } else {
            el.detachEvent('on' + type, function () {
                return fn.call(el, window.event);
            });
        }
    }
}
Util.prototype.addWindowEvent = function (type) {
    var orig = history[type];
    return function () {
        var rv = orig.apply(this, arguments);
        if (!document.createEvent) {
            // IE浏览器支持fireEvent方法
            var evt = document.createEventObject();
            evt.arguments = arguments
            document.fireEvent('on' + type, evt)
        } else {
            // 其他标准浏览器使用dispatchEvent方法
            var evt = document.createEvent('HTMLEvents');
            evt.initEvent(type, true, true);
            evt.arguments = arguments

            window.dispatchEvent(evt);
        }
        return rv;
    };
}
Util.prototype.extend = function (subClass, superClass) {
    var F = function () {};
    F.prototype = superClass.prototype;
    subClass.prototype = new F();
    subClass.prototype.constructor = subClass;

    subClass.superclass = superClass.prototype;
    if (superClass.prototype.constructor == Object.prototype.constructor) {
        superClass.prototype.constructor = superClass;
    }
}
Util.prototype.addEleLable = function (eleName, className, id, parent) {
    var dom = document
    var createEle = dom.createElement(eleName)
    var domBody = parent || dom.body || dom.getElementsByTagName('body')[0]
    if (id) {
        createEle.id = id
    }
    if (className) {
        createEle.className = className
    }
    domBody.appendChild(createEle)
    return createEle
}
Util.prototype.addScript = function (fileName) {
    var dom = document
    var createScript = dom.createElement('script')
    var domHead = dom.getElementsByTagName('script')
    createScript.type = 'text/javascript'
    createScript.async = true
    createScript.id = fileName

    var sdkUrl = ''
    if (dom.getElementById("ARK_SDK")) {
        sdkUrl = dom.getElementById("ARK_SDK").src
    } else {
        for (var i = 0; i < domHead.length; i++) {
            if (domHead[i].src && domHead[i].src.indexOf("AnalysysAgent_JS_SDK") > -1) {
                sdkUrl = domHead[i].src
                break
            }
        }
    }

    var sdkPath = sdkUrl.substring(0, sdkUrl.lastIndexOf("\/") + 1);
    var date = new Date()
    var time = new String(date.getFullYear()) + new String(date.getMonth() + 1) + new String(date.getDate()) + new String(date.getDate());
    createScript.src = sdkPath + fileName + '.min.js?v=' + this.format(new Date(), 'yyyyMMddhhmm') //方舟B SDK地址
    domHead[0].parentNode.insertBefore(createScript, domHead[0]);
}
Util.prototype.unique = function (arr) {
    var a = {};
    for (var i = 0; i < arr.length; i++) {
        if (typeof a[arr[i]] == "undefined")
            a[arr[i]] = 1;
    }
    arr.length = 0;
    for (var i in a)
        arr[arr.length] = i;
    return arr;
}

function CheckChinese(val) {
    var reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
    if (reg.test(val)) {
        return true
    }
    return false
}
Util.prototype.GetUrlParam = function (paraName) {
    var url = document.location.toString();
    var arrObj = url.split("?");
    if (arrObj.length > 1) {
        var arrPara = [] //arrObj[1].split("&");
        for (var i = 1; i < arrObj.length; i++) {
            arrPara.push.apply(arrPara, arrObj[i].split("&"))
        }
        var arr;
        for (var i = 0; i < arrPara.length; i++) {
            arr = arrPara[i].split("=");

            if (arr != null && arr[0] == paraName) {
                var value = arr[1]
                if (value.indexOf("%") > -1) {
                    try {
                        var utfValue = decodeURI(arr[1]);
                        if (CheckChinese(utfValue)) {
                            return utfValue
                        }
                    } catch (e) {
                        return arr[1];
                    }

                }
                return arr[1];
            }
        }
        return "";
    } else {
        return "";
    }
}
Util.prototype.isInArray = function (arr, value) {
    for (var i = 0; i < arr.length; i++) {
        if (value === arr[i]) {
            return true;
        }
    }
    return false;
}
Util.prototype.stringSlice = function (str, length) {
    return str.slice(0, length);
}
Util.prototype.trim = function (str) {
    if (this.paramType(str) === 'String') {
        return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "")
    } else {
        return str
    }
}
Util.prototype.changeHash = function (callback) {
    if ('onpopstate' in window) {
        if (!('onpushState' in window)) {
            window.history.pushState = this.addWindowEvent('pushState');
        }
        if (!('onreplaceState' in window)) {
            window.history.replaceState = this.addWindowEvent('replaceState');
        }
        this.addEvent(window, 'popstate', callback)
        this.addEvent(window, 'pushState', callback)
        this.addEvent(window, 'replaceState', callback)
        if (!!window.ActiveXObject || "ActiveXObject" in window) {
            if ('onhashchange' in window) {
                this.addEvent(window, 'hashchange', callback)
            }
        }
    } else if ('onhashchange' in window) {
        if (document.addEventListener) {
            this.addEvent(window, 'hashchange', callback)
        }
    }
}

Util.prototype.deviceType = function () {
    var u = navigator.userAgent

    if ((u.indexOf('Tablet') > -1 && u.indexOf('PC') < 0) || u.indexOf('Pad') > -1 || u.indexOf('Nexus 7') > -1) {
        return 'tablet'
    }
    if (u.indexOf('Mobi') > -1 || u.indexOf('iPh') > -1 || u.indexOf('480') > -1) {
        return 'phone'
    }
    return 'desktop'
}
export default new Util()