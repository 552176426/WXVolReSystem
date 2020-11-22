//index.js
import request, {getRequest, postRequest} from "../../utils/request";
import * as echarts from '../../ec-canvas/echarts';
//获取应用实例
const app = getApp()
let navigationBar
Page({
  data: {
    motto: 'AAA',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    chooseLocations:'江西',
    page:1,
    pageCount:10,
    schoolList: [],
    ec: {
      lazyLoad: true,
    },
    remCounts: 1000,
  },
  goProvinceScore:function (){
    wx.navigateTo({
      url:"/pages/provinceScore/provinceScore"
    })
  },
  goFindSchool:function (){
    wx.navigateTo({
      url:"/pages/findSchool/findSchool"
    })
  },
  goSpecial:function (){
    wx.navigateTo({
      url:"/pages/specials/special-1/special-1"
    })
  },

  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  processDataForRead(schoolList) {
    for (let i = 0; i < schoolList.length; i++) {
      let city = schoolList[i].city
      let type = schoolList[i].type
      let schoolType = schoolList[i].schoolType
      let nature = schoolList[i].nature
      if (schoolType == 6000) {
        schoolType = '本科'
      } else if (schoolType == 6001) {
        schoolType = '专科'
      } else if (schoolType == 6002) {
        schoolType = '独立学院'
      } else {
        schoolType = ''
      }
      if (nature == 36000) {
        nature = '公办'
      } else if (nature == 36001) {
        nature = '民办'
      } else if (nature == 36002) {
        nature = '中外合作办学'
      } else {
        nature = ''
      }
      schoolList[i].schoolType = schoolType
      schoolList[i].nature = nature
      schoolList[i].city = city.substring(0, city.length - 1);
      if (type != '' && type != '其他') {
        schoolList[i].type = type.substring(0, type.length - 1);
      }

    }
    return schoolList
  },

  onLoad: function () {
    navigationBar = this.selectComponent("#navigationBar")
   this.init()
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    let paramsMap = {
      chooseLocations:this.data.chooseLocations,
      chooseSchoolTypes: [],
      chooseBanxueTypes: [],
      chooseSchoolLevels: [],
      page:this.data.page,
      pageCount:this.data.pageCount,
    }
    postRequest("/school/findSchools",paramsMap).then(res=>{
      let schoolList = this.processDataForRead(res.data)
      this.setData({
        schoolList:schoolList
      })
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  init: function () {
    let that = this
    this.selectComponent("#mychart-dom-gauge").init(function (canvas, width, height, dpr) {
          const chart = echarts.init(canvas, null, {
            width: width,
            height: height,
            devicePixelRatio: dpr // new
          })
          chart.setOption(that.getOption());
          return chart;
        }
    )
  },


  getOption: function () {
    let option = {
      /*title: {
          text: "Main Title",
          subtext: "Sub Title",
          left: "center",
          top: "center",
          textStyle: {
              fontSize: 30
          },
          subtextStyle: {
              fontSize: 20
          },
      },*/
      backgroundColor: "#1888f7",
      color: ["#37A2DA", "#32C5E9", "#67E0E3"],
      series: [{
        center:['50%',140],
        name: '业务指标',
        type: 'gauge',
        radius: '130%',
        min: 0,
        max: 2944,
        splitNumber: 1,
        startAngle: 180,
        endAngle: 0,
        detail: {
          formatter: '{value}组',
          offsetCenter: [0, "-35%"],
          color: 'white',
          fontSize: 40,
          fontFamily: "sans-serif",
        },

        pointer: {
          show: false
        },
        splitLine: {
          show: false,
          length: 10
        },
        axisTick: {
          show: true,
          splitNumber: 70,
          length: 3,
          lineStyle: {
            color: "rgb(240,240,240,0.5)",
            width: 2.5,
          },
        },
        axisLabel: {
          show: true,
          distance: -5,
          color: "white",
          fontStyle: "normal",
          fontSize: 12,
        },
        title: {
          show: true,
          offsetCenter: [0, -10],
          color: 'white',
          fontSize: 13,
        },
        axisLine: {
          show: false,
          lineStyle: {
            width: 5,
            shadowBlur: 1,
            color: [
              [0.3, 'green'],
              [1, 'dodgerblue']
            ]
          },
        },
        data: [{
          value: this.data.remCounts,
          name: '适合我的大学',
        }]

      }]
    }
    return option;
  },
})
