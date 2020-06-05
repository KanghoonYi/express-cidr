class OutOfRangeError extends Error {
	constructor() {
		super('IP address is out of range');
	}
}

export {
	OutOfRangeError
};
