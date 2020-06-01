# express-cidr
This is working on test. I recommend to using when version is 1.0.0

An [express.js]( https://github.com/visionmedia/express ) middleware for
[cidr]( https://github.com/KanghoonYi/express-cidr ).
`Only for IPv4`

- [Installation](#installation)
- [Usage](#Usage)
- [Options](#Options)
- [Example](#Example)

## Installation
```
npm install express-cidr
```

## Usage
```
const expressCIDR = require('express-cidr');

const CIDRMiddleware = expressCIDR(IPRules: Array, Options: Object);

app.get('/', CIDRMiddleware, (req, res) => {
    return res.send('ok');
});
```

#### IPRules
About [CIDR](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing)
```
[
    '192.168.1.1/16',
    '127.0.0.1/32'
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
```
const express = require('express');
const expressCIDR = require('express-cidr');

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

```
