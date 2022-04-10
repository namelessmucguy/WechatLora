// pages/capacitys/capacitys.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
        data: {
             list:[]
        },

    onShow: function () {
        this.setData({
            ['list[1]']:  app.globalData.capacity
          });
    },
})