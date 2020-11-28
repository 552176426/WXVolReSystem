import {getRequest} from "../../utils/request";

const app = getApp();
Page({
    data: {
        //普通选择器：（普通数组）
        provinceArray: [
            '江西',
            '河南',
            '内蒙古',
            '安徽',
            '四川',
            '贵州',
            '云南',
            '广西',
        ],
        pIndex: 0,//默认显示位置
        curriculumMap: app.globalData.curriculumMap,
        curriculumArray: ['理科', '文科'],
        cIndex: 0,

        paramsMap: {
            provinceName: null,
            curriculum: null,
            score: null,
            scoreOrder: null,
            batchName: null,
            year: 2020,
            batches: []
        },

    },

    bindPickerChange1: function (e) {
        let pIndex = e.detail.value
        let provinceName = this.data.provinceArray[pIndex]
        let paramsMap = this.data.paramsMap
        paramsMap.provinceName = provinceName

        let curriculumArray = new Array()
        let curriculumList = this.data.curriculumMap[provinceName]
        for (let i = 0; i < curriculumList.length; i++) {
            curriculumArray[i] = curriculumList[i]
        }
        this.setData({
            pIndex: pIndex,
            curriculumArray: curriculumArray,
            paramsMap: paramsMap
        })

    },
    bindPickerChange2: function (e) {
        let cIndex = e.detail.value
        let curriculum = this.data.curriculumArray[cIndex]
        let paramsMap = this.data.paramsMap
        paramsMap.curriculum = curriculum

        this.setData({
            cIndex: cIndex,
            paramsMap: paramsMap
        })

    },
    scoreInput(e) {
        let paramsMap = this.data.paramsMap
        paramsMap.score = e.detail.value
        this.setData({
            paramsMap: paramsMap
        })
    },
    scoreOrderInput(e) {
        let paramsMap = this.data.paramsMap
        paramsMap.scoreOrder = e.detail.value
        this.setData({
            paramsMap: paramsMap
        })
    },

    onLoad() {
        let paramsMap = wx.getStorageSync('paramsMap')
        if (paramsMap!=''){
            this.setData({
                paramsMap: paramsMap
            })
        }

    },

    save() {
        if (this.data.paramsMap.score == null) {
            wx.showToast({
                title: '请输入高考分数',
                icon: 'none',
                duration: 1500
            })
        } else {
            let provinceName = this.data.provinceArray[this.data.pIndex]
            let batches = app.globalData.batchNameMap[provinceName]
            let curriculum = this.data.curriculumArray[this.data.cIndex]
            let paramsMap = {
                provinceName: provinceName,
                batches: batches,
                year: this.data.paramsMap.year,
                curriculum: curriculum,
                score: this.data.paramsMap.score,
                scoreOrder:this.data.paramsMap.scoreOrder,
            }
            getRequest("/recommend/findBatch", paramsMap).then(res => {
                if (res.data == null) {
                    wx.showToast({
                        title: '当前分数无可推荐批次',
                        icon:'none',
                        duration: 1500
                    })
                } else {
                    let batchName = res.data
                    paramsMap.batchName = batchName
                    wx.setStorageSync('paramsMap', paramsMap)
                    wx.setStorageSync('flag', true)

                    /*wx.showToast({
                        title: '修改成功',
                        icon: 'success',
                        duration: 1500
                    })*/

                    paramsMap.page=1
                    paramsMap.pageCount=10
                    paramsMap.type='冲'
                    let length = 0
                    getRequest("/recommend/findSchools",paramsMap).then(res => {
                        length+=res.data.length
                        paramsMap.type='稳'
                        getRequest("/recommend/findSchools",paramsMap).then(res => {
                            length+=res.data.length
                            paramsMap.type='保'
                            getRequest("/recommend/findSchools",paramsMap).then(res => {
                                length+=res.data.length
                                console.log(length)
                                wx.setStorageSync('length', length)
                                wx.navigateBack({
                                    url: "/pages/schoolFirst/schoolFirst"
                                })
                            })
                        })
                    })
                }
            })
        }
    }


})