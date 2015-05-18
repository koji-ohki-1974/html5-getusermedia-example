/**
 * ImageData services
 */

'use strict';

var Whammy = require('../../lib/whammy_nd.js');

var images = [];
var timerId;
var delay = 10 * 1000;
var fps = 3.0;
var dir = 'video';
var fs = require('fs');
fs.mkdir(dir, function() {});

function putVideo() {
    var frames = [];
    var d = 1000.0 / fps;

    var startTime = images[0].time;
    var endTime = images[images.length - 1].time;
    var i = 0;
    for (var t = startTime; t < endTime; t += d) {
        if (i < images.length - 1 && images[i].time <= t && t < images[i + 1].time) {
            frames.push(images[i].data);
        } else {
            while (i < images.length - 1 && images[i + 1].time <= t) {
                ++i;
            }
            frames.push(images[i].data);
        }
    }
    frames.push(images[images.length - 1].data);

    var webmArray = Whammy.fromImageArray(frames, fps, true);
    var buffer = new Buffer(webmArray.buffer.byteLength);
    for (var i = 0; i < buffer.length; ++i) {
        buffer[i] = webmArray[i];
    }

    var date = new Date(startTime);
    var fmtd = date.getFullYear().toString() +
        ('0' + (date.getMonth() + 1)).slice(-2) +
        ('0' + date.getDate()).slice(-2) +
        ('0' + date.getHours()).slice(-2) +
        ('0' + date.getMinutes()).slice(-2) +
        ('0' + date.getSeconds()).slice(-2);
    console.log('write: [' + fmtd + '.webm' + ']');
    var fs = require('fs');
    fs.writeFile(dir + '/' + fmtd + '.webm', buffer);

    images = [];
    timerId = null;
}

module.exports.post = function post(req, res) {
    //    var viewFilePath = '200';
    var statusCode = 200;
    var result = {
        status: statusCode
    };

    var data = '';
    req.on('data', function(chunk) {
        data += chunk;
    });
    req.on('end', function() {
        //        console.log(data);
        //        var buf = new Buffer(data.toString('binary'), 'binary');
        //        console.log(new Date());
        //        console.log(new Date().toISOString());
        //        console.log(buf);
        images.push({
            time: Date.now(),
            //            data: buf
            data: data
        });
        if (timerId) {
            clearTimeout(timerId);
        }
        timerId = setTimeout(putVideo, delay);
        res.writeHead(statusCode);
        res.end();
    });


    res.status(result.status);
};
