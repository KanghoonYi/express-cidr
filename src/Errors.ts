class OutOfRange extends Error {
	constructor() {
		super('IP address is out of range');
	}
}

export {
	OutOfRange
};
