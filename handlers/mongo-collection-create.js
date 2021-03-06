'use strict';

const is = require('is');

module.exports = function($opts) {
    var collection = $opts.collection,
        inject = $opts.inject,
        resource = $opts.resource || '$mongo',
        source = $opts.source || '$body';

    return function(err, $$resolver, $resolver, $next) {
        if (err) {
            $next(err);
            return;
        }

        resource = is.string(resource) ? $$resolver(resource) : resource;
        var data = is.string(source) ? $resolver(source) : source;
        resource
            .collection(collection)
            .insert(data, function(err, created) {
                !err && inject && $resolver.add(inject, created);
                $next(err);
            });
    };
};
