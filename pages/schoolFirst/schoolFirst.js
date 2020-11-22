import {getRequest} from "../../utils/request";

Page({
    data: {
        windowHeight:100,
        paramsMap: {
            provinceName: null,
            curriculum: null,
            score: null,
            scoreOrder: null,
            batchName: null,
            year: null,
        },
        current:0,
        schools: {},
    },
    bindChange(e){
        let current = e.detail.current
        this.setData({
            current:current
        })
    },
    switchTab(e){
        this.setData({
            current:e.currentTarget.dataset.current
        })
    },

    onLoad: function (options) {
        wx.getSystemInfo({
            success: (res) => {
                this.setData({
                    windowHeight: (res.windowHeight * (750 / res.windowWidth))-130
                });
            }
        })

        this.setData({
            paramsMap: wx.getStorageSync('paramsMap')
        })
        wx.removeStorage({
            key:'paramsMap',
            success(res) {
                // console.log("success remove")
            }
        })
        let paramsMap = {
            provinceName: '江西',
            curriculum: '理科',
            score: 600,
            scoreOrder: '',
            batchName: '本科一批',
            year: 2020,
        }

        getRequest("/recommend/findSchools",paramsMap).then(res=>{
            this.setData({
                schools:res.data
            })
            console.log(this.data.schools)
        })
    }
});