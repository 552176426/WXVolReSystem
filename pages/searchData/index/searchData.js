import {getRequest} from "../../../utils/request";

Page({
    data: {},
    onLoad: function (options) {
        wx.getSystemInfo({
            success: (res) => {
                this.setData({
                    windowHeight: (res.windowHeight * (750 / res.windowWidth)),
                    windowWidth: (res.windowWidth * (750 / res.windowWidth)),
                });
            }
        })

        getRequest("/search/rank?pageSize=3").then(res=>{
            this.setData({
                schoolVW:res.data.schoolVW,
                schoolCD:res.data.schoolCD,
                specialVW:res.data.specialVW,
                specialSal:res.data.specialSal
            })
        })
    },
    goSchoolDetail(e){
        console.log("/pages/schoolDetail/schoolDetail?id=" + e.currentTarget.dataset.param[0]+"&name="+e.currentTarget.dataset.param[1])
        wx.navigateTo({
            url: "/pages/schoolDetail/schoolDetail?id=" + e.currentTarget.dataset.param[0]+"&name="+e.currentTarget.dataset.param[1]
        })
    },
    goSpecialDetail(e){
        console.log("/pages/specials/special-4/special-4?id=" + e.currentTarget.dataset.param[0]+"&name="+e.currentTarget.dataset.param[1])
        wx.navigateTo({
            url: "/pages/specials/special-4/special-4?id=" + e.currentTarget.dataset.param[0]+"&name="+e.currentTarget.dataset.param[1]
        })
    },
    goSpecialJob(e){
        wx.navigateTo({
            url: "/pages/searchData/specialJob/specialJob?type="+e.currentTarget.dataset.type,
        })
    },
    goSearch(e){
        wx.navigateTo({
            url: "/pages/search/search-1/search?type="+e.currentTarget.dataset.type,
        })
    },
    seeMore(e){
        let type = e.currentTarget.dataset.type
        if (type==2){
            wx.navigateTo({
                url: "/pages/searchData/hotSpecialRank/hotSpecialRank"
            })
        } else if (type==1){
            wx.navigateTo({
                url: "/pages/searchData/hotSchoolRank/hotSchoolRank"
            })
        } else if (type==3){
            wx.navigateTo({
                url: "/pages/searchData/schoolHistoryRank/schoolHistoryRank"
            })
        }

    }
});