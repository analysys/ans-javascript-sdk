console.oldLog = console.log
console.log = a = function () {
    if (console.constructor === Object && console.log) {
        try {
            console.oldLog.apply(console, arguments);
        } catch (e) {
            console.oldLog(arguments[0]);
        }
    }
    // console.log(arguments)
    if (arguments[0] && arguments[0].constructor === String && arguments[0].indexOf("Send") > -1) {
        try {
            document.getElementById("upLog").innerText = arguments[0]
        } catch (e) {}
    }
}