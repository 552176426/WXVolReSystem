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
        this.searchSpecial()

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
        this.searchSpecial()
    },
    searchSpecial(){
        console.log(this.data.orderType[this.data.currentIndex])
        getRequest("/search/rankByType?pageSize="+this.data.pageSize+"&page="+this.data.page+"&type=2"+"&choose="+this.data.choose+"&orderType="+this.data.orderType[this.data.currentIndex]).then(res=>{
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
            getRequest("/search/rankByType?pageSize="+this.data.pageSize+"&page="+this.data.page+"&type=2"+"&choose="+this.data.choose+"&orderType="+this.data.orderType[this.data.currentIndex]).then(res=>{
                let specialVW = res.data
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

    closeSchoolBatchShadow: function (e) {
        var that = this;
        var animation = wx.createAnimation({
            duration: 50,
            timingFunction: 'linear'
        })
        that.animation = animation
        animation.translateY(200).step()
        that.setData({
            animationData: animation.export()
        })
        setTimeout(function () {
            animation.translateY(0).step()
            that.setData({
                animationData: animation.export(),
                schoolBatchShadow: false
            })
        }, 100)
    },
    changeSchoolBatch(e) {
        this.closeSchoolBatchShadow()
        let level1 = e.currentTarget.dataset.batch
        if (level1=='本科'){
            this.setData({
                choose:1
            })
        } else {
            this.setData({
                choose:2
            })
        }
        console.log(e.currentTarget.dataset.batch)
        this.searchSpecial()
    },
    schoolBatchActionSheet: function (e) {
        // 用that取代this，防止不必要的情况发生
        var that = this;
        // 创建一个动画实例
        var animation = wx.createAnimation({
            // 动画持续时间
            duration: 10,
            // 定义动画效果，当前是匀速
            timingFunction: 'linear'
        })
        // 将该变量赋值给当前动画
        that.animation = animation
        // 先在y轴偏移，然后用step()完成一个动画
        animation.translateY(200).step()
        // 用setData改变当前动画
        that.setData({
            // 通过export()方法导出数据
            animationData: animation.export(),
            // 改变view里面的Wx：if
            schoolBatchShadow: true
        })
        // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
        setTimeout(function () {
            animation.translateY(0).step()
            that.setData({
                animationData: animation.export()
            })
        }, 50)
    },
});