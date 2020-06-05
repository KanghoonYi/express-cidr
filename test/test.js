const assert = require('assert');
const { describe, it } = require('mocha');
const httpMocks = require('node-mocks-http');

const { generateMiddleware: expressCIDR, OutOfRangeError } = require('../src');

const expressMiddleware = expressCIDR([
	'10.10.1.32/27',
], {
	reqTargetPath: 'headers.x-forwarded-for',
	reqProcessFn: (ipAddrs) => {
		const [ipAddr] = ipAddrs.split(',');
		return ipAddr;
	}
});


const successRequest = httpMocks.createRequest({
	method: 'GET',
	url: '/',
	headers: {
		'x-forwarded-for': '10.10.1.44'
	}
});

const falseRequest = httpMocks.createRequest({
	method: 'GET',
	url: '/',
	headers: {
		'x-forwarded-for': '10.10.1.90'
	}
});

const response = httpMocks.createResponse();

describe('test basic running', function () {
	it('should return true', function () {
		assert.strictEqual(expressMiddleware(successRequest, response, function () {
			return true;
		}), true);
		assert.ok(true);
	});
	it('should throw error', function () {
		assert.throws(() => {
			expressMiddleware(falseRequest, response, function () {
				return false;
			});
		}, new OutOfRangeError());
		assert.ok(true);
	});
});

describe('stress test', function () {
	it('should return true', function () {
		for (let i = 0;  i < 1000000; i += 1) {
			assert.strictEqual(expressMiddleware(successRequest, response, function () {
				return true;
			}), true);
		}
		assert.ok(true);
	});
});
