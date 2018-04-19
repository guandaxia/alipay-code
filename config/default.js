const config = {
  // 启动端口
  port: 3000,

  name: '帮个忙',

  url: 'http://tgy.dianzan800.com',

  // 数据库配置
  database: {
    DATABASE: 'alipay_code',
    USERNAME: 'root',
    PASSWORD: 'root',
    PORT: '3306',
    HOST: 'localhost'
  },

  wechat: {
    appid: '',
    appsecret: ''
  }
}

module.exports = config
