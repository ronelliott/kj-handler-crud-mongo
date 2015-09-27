'use strict';

var is = require('is');

module.exports = function($opts) {
    var resource = $opts.resource || '$mongo';
    return function (err, $caller, $$resolver, $resolver, $next) {
        if (err) {
            $next(err);
            return;
        }

        var query = {};

        if (is.function($opts.query)) {
            query = $caller($opts.query);
        }

        resource = is.string(resource) ? $$resolver(resource) : resource;
        resource
            .collection($opts.collection)
            .delete(query, $next);
    };
};
