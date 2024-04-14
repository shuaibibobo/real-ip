const requestIp = require('request-ip');


const checkIPFormat = (user_ip) => {
    try {
        return !user_ip || user_ip === undefined || user_ip === null || (String(user_ip).indexOf('.') <= -1 && String(user_ip).indexOf(':') <= -1)
    } catch (err) {
        return null
    }
}


function detect({ req, config }) {
    try {
        var user_ip = config.cloudflare ? req.headers['cf-connecting-ip'] : null
        var rhost = req.headers['remote-host'],
        forwarded = req.headers['x-forwarded-for'],
        real = req.headers['x-real-ip']

        if (rhost) {
            forwarded = forwarded.replace(new RegExp(', ' + rhost, 'g'), '');
            forwarded = forwarded.replace(new RegExp(',' + rhost, 'g'), '');
        }

        if (checkIPFormat(user_ip)) {
            var hdip = String(forwarded).split(',')
            user_ip = hdip[hdip.length - 1]
        }

        if (checkIPFormat(user_ip)) {
            var hdip2 = String(real).split(',')
            user_ip = hdip2[hdip2.length - 1]
        }


        if (checkIPFormat(user_ip)) {
            user_ip = requestIp.getClientIp(req)
        }


        if (checkIPFormat(user_ip)) {
            user_ip = null
        }


        if (!checkIPFormat(user_ip)) {
            user_ip = String(user_ip)
                .replace(/::ffff:/g, '')
                .trim()
        }
        return user_ip

    } catch (err) {
        return null
    }
}

module.exports = {
    detect
}