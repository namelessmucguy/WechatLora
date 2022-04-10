// 引入SDK核心类，js文件根据自己业务，位置可自行放置
const app = getApp();
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({
    data: {
      long: 113.324520,
      lat: 23.099994,
  },
 /*41.886461,123.937122*/
    onLoad: function () {
        // 实例化API核心类
        qqmapsdk = new QQMapWX({
            key: 'XPSBZ-XP4W6-4T6SP-EGOLV-VMEQO-YVB6K'
        });
         //loacation
         var mythis = this;
    wx.getLocation({
      success(res) {
        mythis.setData({
          long: res.longitude,
          lat: res.latitude,
        })
      }
    })
    },
    formSubmit(e) {
      var _this = this;
      var lat = _this.data.lat;
      var long = _this.data.long;
      var myPoints = lat+','+long;
      var m = e.detail.value.start.split(",");//以“,”为标记分段取数组m[0],m[1]....
      var location1 = app.globalData.location[1];
      var location2 = app.globalData.location[2];
      this.setData({
        markers: [{
          iconPath: "../../images/location.png",
          id: 0,
          latitude: m[0],
          longitude: m[1],
          width: 30,
          height: 30,
        }]
      })
      //调用距离计算接口
      qqmapsdk.direction({
        waypoints:e.detail.value.start+";"+location1+";"+location2,
        mode: 'driving',//可选值：'driving'（驾车）、'walking'（步行）、'bicycling'（骑行），不填默认：'driving',可不填
        //from参数不填默认当前地址
        from: myPoints,
        to: e.detail.value.dest, 
        success: function (res) {
          console.log(res);
          var ret = res;
          //var coors = ret.result.routes[0].polyline, pl = [];
          //坐标解压（返回的点串坐标，通过前向差分进行压缩）
          var kr = 1000000;
          for (var i = 2; i < coors.length; i++) {
            coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
          }
          //将解压后的坐标放入点串数组pl中
          for (var i = 0; i < coors.length; i += 2) {
            pl.push({ latitude: coors[i], longitude: coors[i + 1] })
          }
          console.log(pl)
          //设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
          _this.setData({
            latitude:pl[0].latitude,
            longitude:pl[0].longitude,
            polyline: [{
              points: pl,
              color: '#006effdd',
              width: 4
            }]
          })
        },
        fail: function (error) {
          console.error(error);
        },
        complete: function (res) {
          console.log(res);
        }
      });
    }
})