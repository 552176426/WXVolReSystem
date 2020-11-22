import {getRequest} from "../../utils/request";

Page({
    data: {
        provinceName: '江西',
        curriculum: '理科',
        score: 600,
        scoreOrder: '',
        batchName: '本科一批',
        batchNameMap: {
            江西: ['本科一批', '本科二批', '专科批'],
            河南: ['本科一批', '本科二批', '专科批'],
            内蒙古: ['本科一批', '本科二批', '专科批'],
            安徽: ['本科一批', '本科二批', '专科批'],
            四川: ['本科一批', '本科二批', '专科批'],
            贵州: ['本科一批', '本科二批', '专科批'],
            云南: ['本科一批', '本科二批', '专科批'],
            广西: ['本科一批', '本科二批', '专科批'],
        },
        curriculumMap: {
            江西: ['文科', '理科'],
            河南: ['文科', '理科'],
            内蒙古: ['文科', '理科'],
            安徽: ['文科', '理科'],
            四川: ['文科', '理科'],
            贵州: ['文科', '理科'],
            云南: ['文科', '理科'],
            广西: ['文科', '理科'],
        },
        year: 2020,

    },

    remSchools: function () {
        let paramsMap = {
            provinceName: this.data.provinceName,
            curriculum: this.data.curriculum,
            score: this.data.score,
            scoreOrder: this.data.scoreOrder,
            batchName: this.data.batchName,
            year: this.data.year,
        }
        wx.setStorageSync('paramsMap',paramsMap)
        wx.navigateTo({
            url: "/pages/remSchool/remSchool"
        })
    },
    onLoad: function (options) {

    }

})
;