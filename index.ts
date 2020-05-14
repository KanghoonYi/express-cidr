

export = function (rules: Array<String>) {
    const ruleFunctions: Array<Function> = rules.map((value: string) => {
        const [prefix, range] = value.split('/');
        const block: Array<number> = prefix.split('.').map((block: string) => {
            const binary = parseInt(block, 2);
            return binary;
        });
        return () => {
            
        };
    });
    return (req, res, next) => {

    };
};
