'use strict';

var should = require('should'),
    sinon = require('sinon'),
    reflekt = require('reflekt'),
    handler = require('../handlers/mongo-collection-update');

describe('mongo-collection-update', function() {
    beforeEach(function() {
        var self = this;

        this.update = sinon.spy(function(query, data, options, callback) {
            callback(null, data);
        });

        this.collection = { update: this.update };

        this.$mongo = {
            collection: sinon.spy(function(name) {
                self.name = name;
                return self.collection;
            })
        };

        this.$resolver = sinon.spy(new reflekt.ObjectResolver({ bar: 'bar', $body: '$body' }));
        this.$caller = reflekt.caller(this.$resolver);
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

    it('should inject the results if no error occurred and inject is defined', function(done) {
        var self = this;
        handler({ inject: 'ducks' })(null, this.$caller, this.$$resolver, this.$resolver, function() {
            should(self.$resolver('ducks')).equal('$body');
            done();
        });
    });

    it('should use the defined resource', function(done) {
        var collection = {
                update: sinon.spy(function(query, data, options, callback) {
                    callback(null, data);
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

    it('should use the defined source', function(done) {
        var self = this;
        handler({ source: 'bar' })(null, this.$caller, this.$$resolver, this.$resolver, function() {
            self.update.called.should.equal(true);
            self.update.calledWith({}, 'bar').should.equal(true);
            done();
        });
    });

    it('should use `$body` if no source is defined', function(done) {
        var self = this;
        handler({})(null, this.$caller, this.$$resolver, this.$resolver, function() {
            self.update.called.should.equal(true);
            self.update.calledWith({}, '$body').should.equal(true);
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

    it('should resolve the source if it is defined as a string', function(done) {
        var self = this;
        handler({ source: 'bar' })(null, this.$caller, this.$$resolver, this.$resolver, function() {
            self.$resolver.called.should.equal(true);
            self.$resolver.calledWith('bar').should.equal(true);
            done();
        });
    });

    it('should call update on the collection with the defined data', function(done) {
        var self = this,
            source = { foo: 'foo' };
        handler({ source: source })(null, this.$caller, this.$$resolver, this.$resolver, function() {
            self.update.called.should.equal(true);
            self.update.calledWith({}, source).should.equal(true);
            done();
        });
    });
});
