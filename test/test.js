const assert = require('assert');

const expressCIDR = require('../src');
const { describe } = require('mocha');

const expressMiddleware = expressCIDR([
	// '127.0.0.1/32',
	'192.168.1.1/16'
]);

describe('test basic running', function () {
	assert.equal(expressMiddleware({}), true);
});
