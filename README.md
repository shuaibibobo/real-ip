# REAL IP
This library allows you to get the real ip address of a user. It gives you the real ip address even if the request header is modified.

## Usage

```js
const app = require('express')();

app.listen(3000, () => { console.log('Server is running') });

const realip = require('real-ip')

app.use((req, res, next) => {
    res.json({
        user_ip: realip.detect({ 
            req: req, 
            config: { cloudflare: false } 
        })
    })
})

```

`cloudflare` If you are using Cloudflare, the ip address is sent in the cf-connecting-ip variable in the header. However, if Cloudflare is not used, the request can be manipulated by changing the header information. For this reason, if you are not using Cloudflare, you should send false.
# real-ip
