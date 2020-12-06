
Page({
    data: {
        type1Map:{},
        type2Map:{},
        current:1,
        choose1:'',
        choose2:'',
        backgroundColor:'',
    },
    onLoad: function (options) {
        this.setData({
            current:options.current,
            choose1:options.choose1,
            choose2:options.choose2,
            type1Map: wx.getStorageSync('type1Map'),
            type2Map: wx.getStorageSync('type2Map')
        })
        wx.removeStorage({
            key:'type1Map',
            success(res) {
                // console.log("success remove")
            }
        })
        wx.removeStorage({
            key:'type2Map',
            success(res) {
                // console.log("success remove")
            }
        })
        console.log(this.data.current+":"+this.data.choose1+":"+this.data.choose2)
    },

    goSpecial(e){
        wx.navigateTo({
            url: "/pages/specials/special-4/special-4?name="+e.currentTarget.dataset.id[1]+"&id="+e.currentTarget.dataset.id[0]
        })
    }
});