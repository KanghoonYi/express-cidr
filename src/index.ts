

export = function (rules: Array<String>, options:object ) {
    const ruleFunctions: Array<Function> = rules.map((value: string): Function => {
        const [prefix, range] = value.split('/');
        if (prefix) {
            throw new Error('IP Address part is empty');
        }
        if (range) {
            throw new Error('range part(after /) is empty');
        }
        const blocks: Array<number> = prefix.split('.').map((block: string): number => {
            return parseInt(block, 10);
        });
        return (ipAddr) => {
            const ipBlocks: Array<number> = ipAddr.split('.').map((block: string): number => {
                return parseInt(block, 10);
            });
        };
    });
    return (req, res, next) => {

    };
};
