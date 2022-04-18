// 引入SDK核心类，js文件根据自己业务，位置可自行放置
const app = getApp();
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
var timer;
Page({
    data: {
      long: 113.324520,
      lat: 23.099994,
      passpoint : "41.845196,123.724788",
      Capacity_set:0
  },
  setcapacity: function (e) {
    this.setData({
      Capacity_set: e.detail.value
    })
    console.log(e.detail.value)
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
      //var m = _this.data.passpoint.split(",");//以“,”为标记分段取数组m[0],m[1]....
      var location1 = app.globalData.location[0];
      var location2 = app.globalData.location[1];
      var poins = ";";
      //调用距离计算接口
      for (var i = 0; i < 10; i++) {
          if(app.globalData.location[i] === undefined)break;
          poins += app.globalData.location[i] + ";";
      }
      poins = poins.slice(1,poins.length);
      console.log(poins);
     /* mypoins = poins.split(";");
      for (let p = 0; p < i; p++) {
        this.setData({
          markers: [{
            iconPath: "../../images/location.png",
            id: p,
            latitude: mypoins[p].split(",")[p],
            longitude: mypoins[p].split(",")[p+1],
            width: 30,
            height: 30,
          }
        ]
        })
      }*/
      if (this.data.Capacity_set == 0) { 
        this.setData({
          passpoint : "41.845196,123.724788",
          markers: [/*{
            iconPath: "../../images/location.png",
            id: 0,
            latitude: m[0],
            longitude: m[1],
            width: 30,
            height: 30,
          },  */
          {
            iconPath: "../../images/终点.png",
            id: 1,
            latitude: (e.detail.value.dest.split(","))[0],
            longitude: (e.detail.value.dest.split(","))[1],
            width: 50,
            height: 50,
          },
          {
            iconPath: "../../images/location.png",
            id: 2,
            latitude: (location1.split(","))[0],
            longitude: (location1.split(","))[1],
            width: 30,
            height: 30,
          },
          {
            iconPath: "../../images/location.png",
            id: 3,
            latitude: (location2.split(","))[0],
            longitude: (location2.split(","))[1],
            width: 30,
            height: 30,
          },
          {
            iconPath: "../../images/location_none.png",
            id: 4,
            latitude: 41.851951,
            longitude: 123.785760,
            width: 30,
            height: 30,
          },
          {
            iconPath: "../../images/location_none.png",
            id: 5,
            latitude: 41.852951,
            longitude: 123.786760,
            width: 30,
            height: 30,
          }
        ]
        })
      }
      if (this.data.Capacity_set == 50) {
        this.setData({
          passpoint:"41.845196,123.724788;41.851951,123.785760;41.852951,123.786760",
          markers: [/*{
            iconPath: "../../images/location.png",
            id: 0,
            latitude: m[0],
            longitude: m[1],
            width: 30,
            height: 30,
          },  */
          {
            iconPath: "../../images/终点.png",
            id: 1,
            latitude: (e.detail.value.dest.split(","))[0],
            longitude: (e.detail.value.dest.split(","))[1],
            width: 50,
            height: 50,
          },
          {
            iconPath: "../../images/location.png",
            id: 2,
            latitude: (location1.split(","))[0],
            longitude: (location1.split(","))[1],
            width: 30,
            height: 30,
          },
          {
            iconPath: "../../images/location.png",
            id: 3,
            latitude: (location2.split(","))[0],
            longitude: (location2.split(","))[1],
            width: 30,
            height: 30,
          },
          {
            iconPath: "../../images/location.png",
            id: 4,
            latitude: 41.851951,
            longitude: 123.785760,
            width: 30,
            height: 30,
          },
          {
            iconPath: "../../images/location.png",
            id: 5,
            latitude: 41.852951,
            longitude: 123.786760,
            width: 30,
            height: 30,
          }
        ]
        })
      }
      qqmapsdk.direction({
        waypoints:poins + _this.data.passpoint,//e.detail.value.start,
        mode: 'driving',//可选值：'driving'（驾车）、'walking'（步行）、'bicycling'（骑行），不填默认：'driving',可不填
        //from参数不填默认当前地址
        from: myPoints,
        to: e.detail.value.dest, 
        success: function (res) {
          console.log(res);
          var ret = res;
          var coors = ret.result.routes[0].polyline, pl = [];
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
