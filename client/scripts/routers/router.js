var app = app || {};

(function() {
    'use strict';

    var AppRouter = Backbone.Router.extend({
        routes: {},
        dummy: function() {}
    });

    app.AppRouter = new AppRouter();
    Backbone.history.start();
})();
