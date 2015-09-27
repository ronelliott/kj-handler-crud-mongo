'use strict';

var is = require('is');

module.exports = function($opts) {
    var collection = $opts.collection,
        inject = $opts.inject,
        resource = $opts.resource || '$mongo',
        source = $opts.source || '$body',
        options = $opts.options || {};

    return function(err, $caller, $$resolver, $resolver, $next) {
        if (err) {
            $next(err);
            return;
        }

        var query = {};

        if (is.function($opts.query)) {
            query = $caller($opts.query);
        }

        resource = is.string(resource) ? $$resolver(resource) : resource;
        var data = is.string(source) ? $resolver(source) : source;
        resource
            .collection(collection)
            .update(query, data, options, function(err, created) {
                !err && inject && $resolver.add(inject, created);
                $next(err);
            });
    };
};
