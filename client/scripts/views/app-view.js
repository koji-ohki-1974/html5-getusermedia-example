var app = app || {};

(function($) {
    'use strict';

    var WIDTH = 320;
    var HEIGHT = 240;
    var THRESHOLD = 1000000;

    app.AppView = Backbone.View.extend({

        el: '#app',

        events: {
            'click #record': 'record',
            'click #stop': 'stop',
        },

        initialize: function() {
            this.$video = $('video');
            this.$record = $('#record');
            this.$stop = $('#stop');
            this.$canvas = $('<canvas>');
            this.rafId = null;
            this.startTime = null;
            this.endTime = null;
            this.oldData = null;

            this.turnOnCamera();
        },

        render: function() {

        },

        turnOnCamera: function() {
            this.$record.attr('disabled', false);

            this.$video.attr('controls', false);

            app.Utils.getUserMedia({
                video: true,
                audio: false
            }, (function(stream) {
                this.$video.attr('src', app.Utils.createObjectURL(stream));
                this.finishVideoSetup();
            }).bind(this), (function(e) {
                alert('XXXXX');

                this.$video.attr('src', 'Chrome_ImF.mp4');
                this.finishVideoSetup();
            }).bind(this));
        },

        finishVideoSetup: function() {
            setTimeout((function() {
                this.$video.get(0).width = WIDTH;
                this.$video.get(0).height = HEIGHT;
                this.$canvas.get(0).width = this.$video.get(0).width;
                this.$canvas.get(0).height = this.$video.get(0).height;
            }).bind(this), 1000);
        },

        record: function() {
            this.startTime = Date.now();
            this.$record.attr('disabled', true);
            this.$stop.attr('disabled', false);

            this.ctx = this.$canvas.get(0).getContext('2d');

            this.rafId = app.Utils.requestAnimationFrame(this.drawVideoFrame.bind(this));
        },

        drawVideoFrame: function() {
            var CANVAS_WIDTH = this.$canvas.get(0).width;
            var CANVAS_HEIGHT = this.$canvas.get(0).height;

            this.ctx.drawImage(this.$video.get(0), 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

            var imageData = this.ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data;
            if (this.oldData) {
                if (THRESHOLD < this.dist(imageData, this.oldData)) {
                    this.postImageData(this.$canvas.get(0));
                }
            } else {
                this.postImageData(this.$canvas.get(0));
            }
            this.oldData = imageData;

            this.rafId = app.Utils.requestAnimationFrame(this.drawVideoFrame.bind(this));
        },

        dist: function(a, b) {
            var d = 0;
            for (var i = 0; i < a.length; ++i) {
                d += Math.abs(a[i] - b[i]);
            }
            return d;
        },

        postImageData: function(canvas) {
            var oReq = new XMLHttpRequest();
            oReq.open('post', 'imagedata', true);
            var webp = canvas.toDataURL('image/webp', 1);
            oReq.send(webp);
        },

        stop: function() {
            app.Utils.cancelAnimationFrame(this.rafId);
            this.endTime = Date.now();
            this.$record.attr('disabled', false);
            this.$stop.attr('disabled', true);
        },
    });
})(jQuery);
