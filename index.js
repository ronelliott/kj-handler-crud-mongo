'use strict';

module.exports = function($$resolver) {
    $$resolver.add({
        'mongo-collection-create': require('./handlers/mongo-collection-create'),
        'mongo-collection-delete': require('./handlers/mongo-collection-delete'),
        'mongo-collection-get': require('./handlers/mongo-collection-get'),
        'mongo-collection-list': require('./handlers/mongo-collection-list'),
        'mongo-collection-update': require('./handlers/mongo-collection-update')
    });
};
