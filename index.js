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
        var rel = req.headers['remote-host']
        if (rel) {
            var hd_str = req.headers['x-forwarded-for']
            req.headers['x-forwarded-for'] = hd_str.replace(new RegExp(', ' + rel, 'g'), '');
            req.headers['x-forwarded-for'] = hd_str.replace(new RegExp(',' + rel, 'g'), '');
        }
        if (checkIPFormat(user_ip)) {
            var hdip = String(req.headers['x-forwarded-for']).split(',')
            user_ip = hdip[hdip.length - 1]
        }

        if (checkIPFormat(user_ip)) {
            var hdip2 = String(req.headers['x-real-ip']).split(',')
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