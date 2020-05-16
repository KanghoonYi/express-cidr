

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
        return (ipAddr) => {
            const ipBlocks: Array<number> = ipAddr.split('.').map((block: string): number => {
                return parseInt(block, 10);
            });

            return !ipBlocks.some((value: number, idx: number): boolean => {
                const result = value ^ blocks[idx];

                return true;
            });
        };
    });
    return (req, res, next) => {
        ruleFunctions.some((ruleFunction) => {
            return ruleFunction();
        });
    };
};
