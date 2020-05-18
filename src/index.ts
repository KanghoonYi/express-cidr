import * as _ from 'lodash';

export = function (rules: Array<string>): object { // closure
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

                const diffPosition = 8 - Math.floor(Math.log(result) / Math.LOG2E);

                if (checkLength < diffPosition) {
					checkLength -= 8;
                    return false;
                }

                return true;
            });
        };
    });
    return {
    	getMiddleware(options: {
			reqTargetPath: string,
			reqProcessFn: Function
		}) {
    		const { reqTargetPath, reqProcessFn } = options;
			return (req, res, next: Function | undefined) => {
				let ipAddr: string = _.get(req, reqTargetPath);
				if (reqProcessFn) {
					ipAddr = reqProcessFn(ipAddr);
				}
				const filteringResult = ruleFunctions.some((ruleFunction): boolean => {
					return ruleFunction(ipAddr);
				});

				if (!filteringResult) {
					throw new Error('failed');
				}
				return next();
			};
		},
		ruleFunctions
	};
};
