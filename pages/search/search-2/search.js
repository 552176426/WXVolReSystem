import {getRequest} from "../../../utils/request";

Page({
    data: {
        schoolList: [],
        specialList: [],
        searchStr: '',
        historySch: [],
        current:0,
    },
    onLoad: function (options) {
        let historySch = wx.getStorageSync('historySch')
        if (historySch.length != 0) {
            this.setData({
                historySch: historySch
            });
        }
        wx.getSystemInfo({
            success: (res) => {
                this.setData({
                    windowHeight: (res.windowHeight * (750 / res.windowWidth)),
                    windowWidth: (res.windowWidth * (750 / res.windowWidth)),
                });
            }
        })
    },
    changeStr(e) {
        console.log(e.detail.value)
        this.setData({
            searchStr: e.detail.value
        })
    },
    searchAll() {
        if (this.data.searchStr != '') {
            let historySch = this.data.historySch
            let index = historySch.findIndex(i => i == this.data.searchStr)
            console.log(index)
            if (index != -1) {
                historySch.splice(index, 1) //删除第index的元素
                historySch.unshift(this.data.searchStr) //添加到第一个
                console.log(historySch)
            } else if (historySch.length < 15) {
                historySch.unshift(this.data.searchStr)
            } else {
                historySch.pop()
                historySch.unshift(this.data.searchStr)
            }
            wx.setStorageSync('historySch', historySch)
            getRequest('/search/all?str=' + this.data.searchStr).then(res => {
                this.setData({
                    schoolList: res.data.schools,
                    specialList:res.data.specials,
                    historySch: historySch
                })
            })
        } else {
            this.setData({
                schoolList: [],
                specialList:[],
            })
        }
    },
    clearHistory() {
        wx.removeStorageSync('historySch')
        this.setData({
            historySch: []
        })
    },
    searchA(e) {
        getRequest('/search/all?str=' + e.currentTarget.dataset.str).then(res => {
            this.setData({
                schoolList: res.data.schools,
                specialList: res.data.specials,
                searchStr: e.currentTarget.dataset.str
            })
        })
    },
    goSchoolDetail(e){
        wx.navigateTo({
            url: "/pages/schoolDetail/schoolDetail?id=" + e.currentTarget.dataset.param[0]+"&name="+e.currentTarget.dataset.param[1]
        })
    },
    navigateBack(){
        wx.switchTab({
            url: "/pages/index/index"
        })
    },
    switchCurrent(e){
        this.setData({
            current:e.currentTarget.dataset.current
        })
    },
    goSpecialDetail(e){
        wx.navigateTo({
            url: "/pages/specials/special-4/special-4?id=" + e.currentTarget.dataset.param[0]+"&name="+e.currentTarget.dataset.param[1]
        })
    }
});