var app = app || {};

(function(exports) {
    'use strict';

    exports.URL = exports.URL || exports.webkitURL;

    exports.requestAnimationFrame = exports.requestAnimationFrame ||
        exports.webkitRequestAnimationFrame || exports.mozRequestAnimationFrame ||
        exports.msRequestAnimationFrame || exports.oRequestAnimationFrame;

    exports.cancelAnimationFrame = exports.cancelAnimationFrame ||
        exports.webkitCancelAnimationFrame || exports.mozCancelAnimationFrame ||
        exports.msCancelAnimationFrame || exports.oCancelAnimationFrame;

    navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia || navigator.mozGetUserMedia ||
        navigator.msGetUserMedia;

    var Util = {
        createObjectURL: function() {
            return exports.URL.createObjectURL.apply(exports.URL, arguments);
        },
        requestAnimationFrame: function() {
            return exports.requestAnimationFrame.apply(exports, arguments);
        },
        cancelAnimationFrame: function() {
            return exports.cancelAnimationFrame.apply(exports, arguments);
        },
        getUserMedia: function() {
            return navigator.getUserMedia.apply(navigator, arguments);
        },
    };

    app.Utils = Util;
})(window);
