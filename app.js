// app.js
const app = getApp()
var mqtt = require('utils/mqtt.min.js') 
var client = null;
var timer;
App({
    globalData:{    
      capacity: {},
      location: {}
    },
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    //mqtt
    this.connectMqtt()

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },

  connectMqtt: function () {
    const options = {
      connectTimeout: 4000, // 超时时间
      clientId: 'esp',
      port: 8084, 
      username: '25ecb5c1008729a137b06f8c571488e5',
      password: '741',
    }

    client = mqtt.connect('wxs://t.yoyolife.fun/mqtt', options)
     client.on('reconnect', (error) => {
      console.log('正在重连:', error)
    })

    client.on('error', (error) => {
      console.log('连接失败:', error)
    })

    client.on('connect', (_e) => {
      console.log('成功连接服务器')
      //订阅主题
      client.subscribe('/iot/70/lora/esp', {
        qos: 0
      }, function (err) {
        if (!err) {
           client.publish('/iot/70/lora/pub', 'Hello ESP32')
          console.log("订阅成功")
        }
      }
      )
    })
     client.on('message', function (_topic, message) {
       // console.log('received msg:' + message.toString());
          if (String.fromCharCode(message[0]=="L")) 
          {
            this.globalData.location[parseInt(String.fromCharCode(message[1]))-1] = (message.slice(2,message.length)).toString();
            console.log(this.globalData.location);
          }
          if(String.fromCharCode(message[0]=="C"))
          {
            this.globalData.capacity[parseInt(String.fromCharCode(message[1]))-1] = (message.slice(2,message.length)).toString();
            console.log(this.globalData.capacity);
          }
        }.bind(this))
    },
})
var interval = setInterval(function () {  
  client.publish('/iot/70/lora/pub', 'Hello MQTT')
}, 20000) //ms
