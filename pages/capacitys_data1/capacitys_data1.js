// pages/capacitys_data/capacitys_data.js
const app = getApp();
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
var mapId = 'myMap';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        percent: 0,
        status: 'normal',
        sta:'离线'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
        // 实例化API核心类
        qqmapsdk = new QQMapWX({
            key: 'XPSBZ-XP4W6-4T6SP-EGOLV-VMEQO-YVB6K'
        });
        var mythis = this;
        var location = app.globalData.location[1];
        if (location) {
            mythis.setData({
                sta:'在线'
            })
        }
         //loacation
         mythis.setData({
            markers: [{
              iconPath: "../../images/location.png",
              id: 0,
              latitude: location.split(",")[0],
              longitude: location.split(",")[1],
              width: 30,
              height: 30,
            },  
            ]
        })
        mythis.moveTolocation();
        setInterval(function () {  
            mythis.setData({
                percent:app.globalData.capacity[1],
                location:app.globalData.location[1]
            })
          }, 1000) //ms
    },

  /**
   * 移动到中心点
   */
  moveTolocation: function () {
    var mapCtx = wx.createMapContext(mapId);
    mapCtx.moveToLocation();
  },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {


    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})

