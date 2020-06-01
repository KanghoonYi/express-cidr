# express-cidr
This is working on test. I recommend to using when version is 1.0.0

An [express.js]( https://github.com/visionmedia/express ) middleware for
[cidr]( https://github.com/KanghoonYi/express-cidr ).

- [Installation](#installation)
- [usage](#usage)

## Installation
```
npm install express-cidr
```

## usage
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
    return req.send('OK');
});

```
