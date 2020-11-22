import {getRequest} from "../../../utils/request";

Page({
    data: {
        current: 1,
        windowHeight: 100,
        specialMap: {},
        type1Map: {},
        type2Map: {},
        choose1Level1: '农学',
        choose2Level1: '公安与司法大类',
        backgroundColor: {
            btnName: '',
            color: 'white'
        },
    },

    start(e) {
        this.setData({
            backgroundColor: {
                btnName: e.currentTarget.dataset.ch[2],
                color: 'rgb(237,237,237)'
            }
        })
    },
    end(e) {
        this.setData({
            backgroundColor: {
                btnName: e.currentTarget.dataset.ch[2],
                color: 'white'
            }
        })
    },

    choose(e) {
        let current = e.currentTarget.dataset.choose[0]
        let choose = e.currentTarget.dataset.choose[1]
        console.log(current + ":" + choose)
        if (current == 1) {
            this.setData({
                choose1Level1: choose,
            })
        } else {
            this.setData({
                choose2Level1: choose,
            })
        }
    },
    chooseRight(e) {
        let current = e.currentTarget.dataset.ch[0]
        let choose1 = e.currentTarget.dataset.ch[1]
        let choose2 = e.currentTarget.dataset.ch[2]
        console.log(e.currentTarget.dataset.ch)
        wx.setStorageSync('type1Map', this.data.type1Map)
        wx.setStorageSync('type2Map', this.data.type2Map)
        wx.navigateTo({
            url: "/pages/specials/special-2/special-2?current=" + current + "&choose1=" + choose1 + "&choose2=" + choose2
        })
    },

    onReady() {

    },
    onLoad() {
        wx.getSystemInfo({
            success: (res) => {
                this.setData({
                    windowHeight: (res.windowHeight * (750 / res.windowWidth))
                });
            }
        })
        wx.showLoading({
            title: '加载中'
        })
        getRequest("/special/findSpecials").then(res => {
            this.setData({
                specialMap: res.data
            })
            let map = this.data.specialMap
            for (let key in map) {
                if (key == 1) {
                    this.setData({
                        type1Map: map[key]
                    })
                } else if (key == 2) {
                    this.setData({
                        type2Map: map[key]
                    })
                }
            }
        })
        wx.hideLoading()


    },
    handleChange({detail}) {
        this.setData({
            current: detail.key,
        });
    },


})