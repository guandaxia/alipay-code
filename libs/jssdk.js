const http = require('superagent')
const cache = require('./cache')
const crypto = require('crypto')


class JSSDK {

    constructor(option) {
        this.wechatConfig = option
    }

    async getAccessToken() {
        let accessTokenCache = 'access_token', accessToken = null

        accessToken = cache.readCache(accessTokenCache)
        if (accessToken) {
            return accessToken
        }

        let appid = this.wechatConfig.appid
        let secret = this.wechatConfig.appsecret
        let url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`

        let result = await http.get(url)

        result = JSON.parse(result.text)

        if (result.errcode) {
            throw result.errmsg
        }
        accessToken = result.access_token
        let expiresIn = result.expires_in * 1000

        cache.saveCache(accessTokenCache, accessToken, expiresIn)
        return accessToken
    }

    async getJsTicket() {
        let accessToken, jsTicket, expiresIn = 0
        let jsTicketCache = "js_ticket"

        jsTicket = cache.readCache(jsTicketCache)
        console.log({ jsTicket })
        if (jsTicket) {
            return jsTicket
        }

        accessToken = await this.getAccessToken()
        let url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${accessToken}&type=jsapi`
        console.log({ url })
        let result = await http.get(url)
        console.log(result.text)
        result = JSON.parse(result.text)
        if (result.errcode) {
            throw result.errmsg
        }
        jsTicket = result.ticket
        expiresIn = result.expires_in * 1000

        cache.saveCache(jsTicketCache, jsTicket, expiresIn)
        return jsTicket
    }

    randomWord(length = 32) {
        let str = "",
            arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
                'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
                'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
                'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
            arrLen = arr.length
        let pos = 0
        for (let i = 0; i < length; i++) {
            pos = Math.round(Math.random() * (arrLen - 1))
            str += arr[pos]
        }
        return str
    }

    async sign(url) {
        let timestamp, nonceStr, jsapiTicket, signature, signStr

        timestamp = parseInt(new Date().getTime() / 1000)
        nonceStr = this.randomWord()
        jsapiTicket = await this.getJsTicket()

        signStr = `jsapi_ticket=${jsapiTicket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`
        console.log(signStr)
        let sha1 = crypto.createHash('sha1')
        sha1.update(signStr)

        signature = sha1.digest('hex')

        return {
            appId: this.wechatConfig.appid,
            timestamp,
            nonceStr,
            signature
        }
    }


}

module.exports = {
    JSSDK
}
