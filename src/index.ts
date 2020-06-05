import * as _ from 'lodash';

import { OutOfRangeError } from './Errors';

const getFirstDigitPosition = function (value: number): number {
	let diffPosition = 0;
	for (let i = 1; i <= 8; i += 1) {
		if (value >> i === 0) {
			diffPosition = i;
			break;
		}
	}
	return diffPosition;
}

const generateMiddleware = function (rules: Array<string>, options: {
	reqTargetPath: string,
	reqProcessFn: Function
}): object { // closure
	const { reqTargetPath, reqProcessFn } = options;
	const ruleFunctions: Array<Function> = rules.map((value: string): Function => {
		const [prefix, prefixLength] = value.split('/');
		if (!prefix) {
			throw new Error('IP Address part is empty');
		}
		if (!prefixLength) {
			throw new Error('range part(after /) is empty');
		}
		const blocks: Array<number> = prefix.split('.').map((block: string): number => {
			return parseInt(block, 10);
		});
		return (ipAddr): boolean => {
			const ipBlocks: Array<number> = ipAddr.split('.').map((block: string): number => {
				return parseInt(block, 10);
			});

			let checkLength: number = parseInt(prefixLength, 10);
			return !ipBlocks.some((value: number, idx: number): boolean => {
				const result = value ^ blocks[idx];
				if (result === 0) { // same
					checkLength -= 8;
					return false;
				}

				let diffPosition = 8 - getFirstDigitPosition(result);

				if (checkLength < diffPosition) {
					checkLength -= 8;
					return false;
				}

				return true;
			});
		};
	});
	return (req, res, next: Function | undefined) => {
		let ipAddr: string = _.get(req, reqTargetPath);
		if (reqProcessFn) {
			ipAddr = reqProcessFn(ipAddr);
		}
		const filteringResult = ruleFunctions.some((ruleFunction): boolean => {
			return ruleFunction(ipAddr);
		});

		if (!filteringResult) {
			throw new OutOfRangeError();
		}
		return next();
	};
};

export = {
	generateMiddleware,
	OutOfRangeError
};
