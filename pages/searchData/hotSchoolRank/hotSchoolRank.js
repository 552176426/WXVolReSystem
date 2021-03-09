import {getRequest} from "../../../utils/request";

Page({
    data: {
        choose:1,
        pageSize: 10,
        levels:['本科','专科'],
        page:1,
        schoolBatchShadow: false,
        animationData: {},
        moreData:true,
        title: ["全部榜单","月榜单","周榜单"],
        currentIndex:2,
        left:334.16668701171875,
        orderType:['view_total','view_month','view_week']
    },
    changeTab:function(e){
        this.setData({
            currentIndex: e.currentTarget.dataset.index,
            page:1,
        })
        this.changeline()
        this.searchSchool()

    },
    changeline:function(){
        const query = wx.createSelectorQuery()
        var _this = this
        query.select('.tabTrue').boundingClientRect()
        query.exec(function (res) {
            let left = res[0].left+(res[0].width-_this.data.width)/2
            _this.setData({
                left: left
            })
        })
    },
    onLoad: function (options) {
        wx.getSystemInfo({
            success: (res) => {
                this.setData({
                    windowHeight: (res.windowHeight * (750 / res.windowWidth)),
                    windowWidth: (res.windowWidth * (750 / res.windowWidth)),
                });
            }
        })
        const query = wx.createSelectorQuery()
        let _this = this
        query.select('.b').boundingClientRect()
        query.exec(function (res) {
            _this.setData({
                width: res[0].width
            })
        })
        this.changeline()
        this.searchSchool()
    },
    searchSchool(){
        console.log(this.data.orderType[this.data.currentIndex])
        getRequest("/search/rankByType?pageSize="+this.data.pageSize+"&page="+this.data.page+"&type=3"+"&orderType="+this.data.orderType[this.data.currentIndex]).then(res=>{
            this.setData({
                specialVW:res.data
            })
        })
    },
    loadMore() {
        if (this.data.moreData) {
            this.setData({
                page: ++this.data.page,
            })
            getRequest("/search/rankByType?pageSize="+this.data.pageSize+"&page="+this.data.page+"&type=3"+"&orderType="+this.data.orderType[this.data.currentIndex]).then(res=>{
                let specialVW = res.data
                console.log(specialVW)
                if (specialVW.length < this.data.pageSize) {
                    this.setData({
                        moreData: false
                    })
                } else {
                    specialVW = this.data.specialVW.concat(specialVW)
                    this.setData({
                        moreData: true,
                        specialVW: specialVW
                    })
                }
            })
        }
    },

    goSpecialDetail(e){
        console.log("/pages/specials/special-4/special-4?id=" + e.currentTarget.dataset.param[0]+"&name="+e.currentTarget.dataset.param[1])
        wx.navigateTo({
            url: "/pages/specials/special-4/special-4?id=" + e.currentTarget.dataset.param[0]+"&name="+e.currentTarget.dataset.param[1]
        })
    },
    goSchoolDetail(e){
        console.log("/pages/schoolDetail/schoolDetail?id=" + e.currentTarget.dataset.param[0]+"&name="+e.currentTarget.dataset.param[1])
        wx.navigateTo({
            url: "/pages/schoolDetail/schoolDetail?id=" + e.currentTarget.dataset.param[0]+"&name="+e.currentTarget.dataset.param[1]
        })
    },

});