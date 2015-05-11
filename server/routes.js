/**
 * Main application routes
 */

'use strict';

var imagedata = require('./components/imagedata');
var errors = require('./components/errors');

module.exports = function(app) {
    // Insert routes below
    app.route('/device')
        .get(function(req, res) {
            console.log(req);
            res.sendFile(app.get('appPath') + '/device.html')
        });
    app.route('/imagedata')
        .post(imagedata.post)

    // All undefined asset or api routes should return a 404
    app.route('/:url(api|auth|components|app|bower_components|assets)/*')
        .get(errors[404]);

    // All other routes	should redirect to the index.html
    app.route('/*')
        .get(function(req, res) {
            console.log(req);
            res.sendFile(app.get('appPath') + '/index.html')
        });
};
