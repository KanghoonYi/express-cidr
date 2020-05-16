

export = function (rules: Array<string>, options: {
    target: string
} ) { // closure
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

                const diffPosition = 8 - (Math.floor(Math.log(result) / Math.LOG2E) + 1);

                if (checkLength < diffPosition) {
                    return false;
                }

                return true;
            });
        };
    });
    return (req, res, next) => {
        const filteringResult = ruleFunctions.some((ruleFunction): boolean => {
            return !ruleFunction();
        });

        if (!filteringResult) {
            throw new Error('failed');
        }
        return next();
    };
};
