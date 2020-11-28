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
        location: '江西',
        chooseLocations: [],
        chooseSchoolTypes: [],
        chooseBanxueTypes: [],
        chooseSchoolLevels: [],
        page: 1,
        pageCount: 10,
        schoolList: [],
        ec: {
            lazyLoad: true,
        },
        chart:'',
        remCounts: 280,
        endAngle: 160,
        splitNumber: 1,

        paramsMap: {
            provinceName: '',
            curriculum: '',
            score: '',
            scoreOrder: '',
            batchName: '',
            year: 2020,
            batches: []
        },
    },
    goProvinceScore: function () {
        wx.navigateTo({
            url: "/pages/provinceScore/provinceScore"
        })
    },
    goFindSchool: function () {
        wx.navigateTo({
            url: "/pages/findSchool/findSchool"
        })
    },
    goSpecial: function () {
        wx.navigateTo({
            url: "/pages/specials/special-1/special-1"
        })
    },

    //事件处理函数
    bindViewTap: function () {
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
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
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
            chooseLocations: this.data.location,
            chooseSchoolTypes: [],
            chooseBanxueTypes: [],
            chooseSchoolLevels: [],
            page: this.data.page,
            pageCount: this.data.pageCount,
        }
        postRequest("/school/findSchools", paramsMap).then(res => {
            let schoolList = this.processDataForRead(res.data)
            this.setData({
                schoolList: schoolList
            })
        })
    },
    getUserInfo: function (e) {
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
                chart.setOption(that.getOption(),true);
                return chart;
            }
        )
    },

    editInfo() {
        wx.navigateTo({
            url: "/pages/inputInfo/inputInfo"
        })
    },

    onShow() {
        let paramsMap = wx.getStorageSync('paramsMap')
        if (paramsMap!=''){
            this.setData({
                paramsMap:paramsMap
            })
        }

        let paramsM = this.data.paramsMap
        console.log(paramsM)
        if (paramsM.score.length == 0 || paramsM.provinceName.length == 0 || paramsM.curriculum.length == 0) {
            wx.navigateTo({
                url: "/pages/inputInfo/inputInfo"
            })
            return
        }
        if (wx.getStorageSync('flag')) {
            wx.showToast({title: '修改成功', duration: 1000})
            wx.removeStorageSync('flag')
        }

        let remCounts = wx.getStorageSync('length')
        this.setData({
            remCounts:remCounts
        })
        this.init()
        let endAngle = (1 - this.data.remCounts / 2934) * 180
        endAngle = Math.round(endAngle / 3) * 3
        let splitNumber = (180 - endAngle) / 3
        this.setData({
            endAngle: endAngle,
            splitNumber: splitNumber
        })
    },


    getOption: function () {
        let option = {
            backgroundColor: "#1888f7",
            series: [{
                center: ['50%', 130],
                name: '业务指标',
                type: 'gauge',
                radius: '130%',
                min: 0,
                max: 2944,
                splitNumber: 1,
                startAngle: 180,
                endAngle: 0,
                detail: {
                    formatter: '{value}',
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
                    splitNumber: 60,
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
                    offsetCenter: [0, 0],
                    color: 'white',
                    fontSize: 13,
                },
                axisLine: {
                    show: false,
                },
                data: [{
                    value: this.data.remCounts,
                    name: '可报考大学  (所)',
                }]

            }, {
                center: ['50%', 130],
                name: '业务指标',
                type: 'gauge',
                radius: '130%',
                min: 0,
                max: 2944,
                splitNumber: 1,
                startAngle: 180,
                endAngle: this.data.endAngle,
                detail: {
                    formatter: '{value}',
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
                    splitNumber: this.data.splitNumber,
                    length: 3,
                    lineStyle: {
                        color: "white",
                        width: 2.5,
                    },
                },
                axisLabel: {
                    show: false,
                },
                title: {
                    show: true,
                    offsetCenter: [0, 0],
                    color: 'white',
                    fontSize: 13,
                },
                axisLine: {
                    show: false,
                },
                data: [{
                    value: this.data.remCounts,
                    name: '可报考大学  (所)',
                }]

            }]
        }
        return option;
    },


    goSchoolFirst(){
        wx.navigateTo({
            url:"/pages/schoolFirst/schoolFirst"
        })
    }
})
