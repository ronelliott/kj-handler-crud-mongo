'use strict';

var should = require('should'),
    sinon = require('sinon'),
    reflekt = require('reflekt'),
    handler = require('../handlers/mongo-collection-delete');

describe('mongo-collection-delete', function() {
    beforeEach(function() {
        var self = this;

        this.delete = sinon.spy(function(query, callback) {
            callback(null);
        });

        this.collection = { delete: this.delete };

        this.$mongo = {
            collection: sinon.spy(function(name) {
                self.name = name;
                return self.collection;
            })
        };

        this.$resolver = sinon.spy(new reflekt.ObjectResolver({ bar: 'bar', $body: '$body' }));
        this.$$resolver = sinon.spy(new reflekt.ObjectResolver({ $mongo: this.$mongo }));
    });

    it('should use the defined collection', function(done) {
        var self = this;
        handler({ collection: 'foo' })(null, this.$caller, this.$$resolver, this.$resolver, function() {
            self.name.should.equal('foo');
            done();
        });
    });

    it('should not run the query if an error is defined in the resolver', function(done) {
        var self = this;
        handler({ collection: 'foo' })({}, this.$caller, this.$$resolver, this.$resolver, function() {
            self.$mongo.collection.called.should.equal(false);
            done();
        });
    });

    it('should use the defined resource', function(done) {
        var collection = {
                delete: sinon.spy(function(query, callback) {
                    callback(null);
                })
            },
            $mongo = {
                collection: sinon.spy(function() {
                    return collection;
                })
            };
        handler({ resource: $mongo })(null, this.$caller, this.$$resolver, this.$resolver, function() {
            $mongo.collection.called.should.equal(true);
            done();
        });
    });

    it('should use `$mongo` if no resource is defined', function(done) {
        var self = this;
        handler({})(null, this.$caller, this.$$resolver, this.$resolver, function() {
            self.$mongo.collection.called.should.equal(true);
            done();
        });
    });

    it('should resolve the resource if it is defined as a string', function(done) {
        var self = this;
        handler({ resource: '$mongo' })(null, this.$caller, this.$$resolver, this.$resolver, function() {
            self.$$resolver.called.should.equal(true);
            self.$$resolver.calledWith('$mongo').should.equal(true);
            done();
        });
    });
});
