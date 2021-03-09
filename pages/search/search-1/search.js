import {getRequest} from "../../../utils/request";

Page({
    data: {
        schoolList: [],
        searchStr: '',
        historySch: [],
    },
    onLoad: function (options) {
        if (options.type !=undefined){
            this.setData({
                type:options.type
            })
        }

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
    searchSchool() {
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
            getRequest('/search/school?str=' + this.data.searchStr).then(res => {
                this.setData({
                    schoolList: res.data,
                    historySch: historySch
                })
            })
        } else {
            this.setData({
                schoolList: []
            })
        }
    },
    clearHistory() {
        wx.removeStorageSync('historySch')
        this.setData({
            historySch: []
        })
    },
    searchSch(e) {
        getRequest('/search/school?str=' + e.currentTarget.dataset.str).then(res => {
            this.setData({
                schoolList: res.data,
                searchStr: e.currentTarget.dataset.str
            })
        })
    },
    goSchoolDetail(e){
        if (this.data.type != undefined){
            wx.navigateTo({
                url: "/pages/schoolDetail/schoolDetail?id=" + e.currentTarget.dataset.param[0]+"&name="+e.currentTarget.dataset.param[1]+"&type="+this.data.type
            })
        } else {
            wx.navigateTo({
                url: "/pages/schoolDetail/schoolDetail?id=" + e.currentTarget.dataset.param[0]+"&name="+e.currentTarget.dataset.param[1]
            })
        }


    },
    navigateBack(){
        wx.navigateBack({
            url: "/pages/findSchool/findSchool"
        })
    }
});