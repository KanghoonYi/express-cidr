# express-cidr
An [express.js]( https://github.com/visionmedia/express ) middleware for
[cidr]( https://github.com/KanghoonYi/express-cidr ).
`Only for IPv4`

- [Installation](#installation)
- [Usage](#usage)
- [Example](#example)
- [Errors](#errors)

## Installation
```
npm install express-cidr
```

## Usage
```
const { generateMiddleware } = require('express-cidr');

const CIDRMiddleware = generateMiddleware(IPRules: Array, Options: Object);

app.get('/', CIDRMiddleware, (req, res) => {
    return res.send('ok');
});
```

#### IPRules
About [CIDR](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing)
```
[
    '10.10.1.32/27',
]
```

#### Options
```
{
    reqTargetPath: String, // required, property path for filtering on request
    reqProcessFn: Function // process function for target property
}
```

## Example
#### Basic Usage
```
const express = require('express');
const { generateMiddleware: expressCIDR } = require('express-cidr');

const app = express();

app.get('/', expressCIDR([
    '10.10.1.32/27'
], { // options
    reqTargetPath: 'headers.x-forwarded-for',
    reqProcessFn: (ipAddrs) => {
        const [ipAddr] = ipAddrs.split(',');
        return ipAddr;
    }
}), (req, res) => {
    return res.send('OK');
});

```
`10.10.1.44` will be passed.
`10.10.1.90` will be failed.

#### Error Handling
```
const express = require('express');
const { generateMiddleware: expressCIDR, OutOfRangeError } = require('express-cidr');

const app = express();

app.get('/', expressCIDR([
    '192.168.1.1/16'
], { // options
    reqTargetPath: 'headers.x-forwarded-for',
    reqProcessFn: (ipAddrs) => {
        const [ipAddr] = ipAddrs.split(',');
        return ipAddr;
    }
}), (req, res) => {
    return res.send('OK');
});

app.use((req, res, next, error) => { // error handler
    if (error instanceOf OutOfRangeError) {
        return res.statusCode(400).send();
    }
    return res.status(500).send();
});

```

## Errors

#### OutOfRangeError
Error object:

* name: 'OutOfRangeError'
* message: 'IP address is out of range'

```
class OutOfRangeError extends Error {
    constructor() {
        super('IP address is out of range');
    }
}
```
