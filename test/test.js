const assert = require('assert');
const { describe, it } = require('mocha');
const httpMocks = require('node-mocks-http');

const expressCIDR = require('../src');

const { getMiddleware } = expressCIDR([
	// '127.0.0.1/32',
	'192.168.1.1/16',
	'61.78.79.0/16'
]);

const expressMiddleware = getMiddleware({
	reqTargetPath: 'headers.x-forwarded-for',
	reqProcessFn: (ipAddrs) => {
		const [ipAddr] = ipAddrs.split(',');
		return ipAddr;
	}
});

const request = httpMocks.createRequest({
	method: 'GET',
	url: '/',
	headers: {
		'x-forwarded-for': '61.78.79.204, 52.46.53.141'
	}
});

const response = httpMocks.createResponse();

describe('test basic running', function () {
	it('should return true', function () {
		assert.strictEqual(expressMiddleware(request, response, function () {
			return true;
		}), true);
		assert.ok(true);
	});
});

describe('stress test', function () {
	it('should return true', function () {
		for (let i = 0;  i < 1000000; i += 1) {
			assert.strictEqual(expressMiddleware(request, response, function () {
				return true;
			}), true);
		}
		assert.ok(true);
	});
});
