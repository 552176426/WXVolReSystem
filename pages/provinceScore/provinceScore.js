import request, {getRequest} from "../../utils/request";

Page({
    data: {
        openProvince: false,
        openYear: false,
        windowHeight: 1000,
        provinceList: [],
        yearList: [2020, 2019, 2018, 2017, 2016, 2015, 2014],
        provinceScoreList: [],
        chooseProvince: "北京",
        chooseYear: 2020
    },

    openProvince() {
        this.setData({
            openYear: false,
            openProvince: !this.data.openProvince,
        })
    },

    openYear() {
        this.setData({
            openProvince: false,
            openYear: !this.data.openYear
        })
    },
    closeShadow() {
        this.setData({
            openProvince: false,
            openYear: false
        })
    },
    setProvince(e) {
        this.setData({
            chooseProvince: e.currentTarget.dataset.sel,
            openProvince: false,
            openYear: false
        })
        this.findProvinceScore()

    },

    setYear(e) {
        this.setData({
            chooseYear: e.currentTarget.dataset.sel,
            openProvince: false,
            openYear: false
        })
        this.findProvinceScore()
    },
    findProvinceScore: function () {
        let url = "/provinceScore/all?provinceName=" + this.data.chooseProvince + "&year=" + this.data.chooseYear
        getRequest(url).then(res=>{
            this.setData({
                provinceScoreList: res.data
            })
        })
    },

    onLoad: function (options) {
        getRequest("/provinceScore/allProvince").then(res=>{
            this.setData({
                provinceList: res.data
            })
        })
        let chooseYear = this.data.yearList[0]
        this.setData({
            chooseYear:chooseYear
        })
        wx.showLoading({
            title:"加载中"
        })
        this.findProvinceScore()
        wx.hideLoading()
        //设置遮罩层高度
        wx.getSystemInfo({
            success: (res) => {
                this.setData({
                    windowHeight: (res.windowHeight * (750 / res.windowWidth))
                });
            }
        })
    }
});