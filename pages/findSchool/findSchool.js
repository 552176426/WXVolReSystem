// pages/findSchool/findSchool.js
import {postRequest} from "../../utils/request";


Page({

    /**
     * 页面的初始数据
     */
    data: {
        windowHeight: 100,
        chooseLocations: [],
        chooseSchoolTypes: [],
        chooseBanxueTypes: [],
        chooseSchoolLevels: [],
        schoolName: '',
        schoolList: [],
        removeItem: [],
        schoolsCount:2844,
        moreData: true,
        page: 1,
        pageCount: 10,
        openByCondition: [false, false, false, false],
        TFArr: [false, false, false, false],
        chooseList: [[
            {name: '北京', checked: false},
            {name: '天津', checked: false},
            {name: '河北', checked: false},
            {name: '河南', checked: false},
            {name: '山东', checked: false},
            {name: '山西', checked: false},
            {name: '陕西', checked: false},
            {name: '内蒙古', checked: false},
            {name: '辽宁', checked: false},
            {name: '吉林', checked: false},
            {name: '黑龙江', checked: false},
            {name: '上海', checked: false},
            {name: '江苏', checked: false},
            {name: '安徽', checked: false},
            {name: '江西', checked: false},
            {name: '湖北', checked: false},
            {name: '湖南', checked: false},
            {name: '重庆', checked: false},
            {name: '四川', checked: false},
            {name: '贵州', checked: false},
            {name: '云南', checked: false},
            {name: '广东', checked: false},
            {name: '广西', checked: false},
            {name: '福建', checked: false},
            {name: '甘肃', checked: false},
            {name: '宁夏', checked: false},
            {name: '新疆', checked: false},
            {name: '西藏', checked: false},
            {name: '海南', checked: false},
            {name: '浙江', checked: false},
            {name: '青海', checked: false},
        ], [
            {name: '综合', checked: false},
            {name: '理工', checked: false},
            {name: '农林', checked: false},
            {name: '医药', checked: false},
            {name: '师范', checked: false},
            {name: '语言', checked: false},
            {name: '财经', checked: false},
            {name: '政法', checked: false},
            {name: '体育', checked: false},
            {name: '艺术', checked: false},
            {name: '民族', checked: false},
            {name: '军事', checked: false},
        ], [
            {name: '普通本科', checked: false},
            {name: '独立学院', checked: false},
            {name: '专科(高职)', checked: false},
            {name: '中外合作办学', checked: false},
        ], [
            {name: '985', checked: false},
            {name: '211', checked: false},
            {name: '双一流', checked: false},
            {name: '中央部委', checked: false},
            {name: '教育部直属', checked: false},
            {name: '强基计划', checked: false},
        ]],
    },
    TFArr() {
        let locationList = this.data.chooseList[0]
        let schoolTypeList = this.data.chooseList[1]
        let banxueTypeList = this.data.chooseList[2]
        let schoolLevelList = this.data.chooseList[3]
        let TFArr = [false, false, false, false]
        for (let i = 0; i < locationList.length; i++) {
            if (locationList[i].checked) {
                TFArr[0] = true
            }
        }
        for (let i = 0; i < schoolTypeList.length; i++) {
            if (schoolTypeList[i].checked) {
                TFArr[1] = true
            }
        }
        for (let i = 0; i < banxueTypeList.length; i++) {
            if (banxueTypeList[i].checked) {
                TFArr[2] = true
            }
        }
        for (let i = 0; i < schoolLevelList.length; i++) {
            if (schoolLevelList[i].checked) {
                TFArr[3] = true
            }
        }
        this.setData({
            TFArr: TFArr
        })
    },

    chooseReset: function () {
        let locationList = this.data.chooseList[0]
        let schoolTypeList = this.data.chooseList[1]
        let banxueTypeList = this.data.chooseList[2]
        let schoolLevelList = this.data.chooseList[3]

        let chooseList = new Array()
        for (let i = 0; i < locationList.length; i++) {
            locationList[i].checked = false
        }
        for (let i = 0; i < schoolTypeList.length; i++) {
            schoolTypeList[i].checked = false
        }
        for (let i = 0; i < banxueTypeList.length; i++) {
            banxueTypeList[i].checked = false
        }
        for (let i = 0; i < schoolLevelList.length; i++) {
            schoolLevelList[i].checked = false
        }
        chooseList.push(locationList, schoolTypeList, banxueTypeList, schoolLevelList)
        this.setData({
            removeItem: [],
            TFArr: [false, false, false, false],
            chooseList: chooseList,
            moreData: true,
            chooseLocations: [],
            chooseSchoolTypes: [],
            chooseBanxueTypes: [],
            chooseSchoolLevels: [],
        })
        this.closeShadow()
        this.findSchoolsOrderByXyhRank()
    },

    chooseItem: function (e) {
        let itemIdx = e.currentTarget.dataset.item[0]
        let typeIdx = e.currentTarget.dataset.item[1]
        let removeItem = this.data.removeItem
        let chooseList = this.data.chooseList
        let remove = {
            typeIdx: typeIdx,
            itemIdx: itemIdx
        }
        removeItem.push(remove)
        console.log("choose===> typeIdx:" + typeIdx + ",itemIdx:" + itemIdx)
        chooseList[typeIdx][itemIdx].checked = !chooseList[typeIdx][itemIdx].checked

        this.setData({
            removeItem: removeItem,
            chooseList: chooseList,
            moreData: true
        })
        this.TFArr()
        this.findSchoolsCount()
    },

    setParam: function () {
        let locationList = this.data.chooseList[0]
        let schoolTypeList = this.data.chooseList[1]
        let banxueTypeList = this.data.chooseList[2]
        let schoolLevelList = this.data.chooseList[3]
        let chooseLocations = new Array()
        let chooseBanxueTypes = new Array()
        let chooseSchoolTypes = new Array()
        let chooseSchoolLevels = new Array()
        for (let i = 0; i < locationList.length; i++) {
            if (locationList[i].checked) {
                chooseLocations.push(locationList[i].name)
            }
        }
        for (let i = 0; i < schoolTypeList.length; i++) {
            if (schoolTypeList[i].checked) {
                chooseSchoolTypes.push(schoolTypeList[i].name)
            }
        }
        for (let i = 0; i < banxueTypeList.length; i++) {
            if (banxueTypeList[i].checked) {
                chooseBanxueTypes.push(banxueTypeList[i].name)
            }
        }
        for (let i = 0; i < schoolLevelList.length; i++) {
            if (schoolLevelList[i].checked) {
                chooseSchoolLevels.push(schoolLevelList[i].name)
            }
        }

        this.setData({
            chooseLocations: chooseLocations,
            chooseBanxueTypes: chooseBanxueTypes,
            chooseSchoolTypes: chooseSchoolTypes,
            chooseSchoolLevels: chooseSchoolLevels,
        })
    },

    openByCondition(e) {
        if (e.currentTarget.dataset.idx == 0) {
            this.setData({
                openByCondition: [!this.data.openByCondition[0], false, false, false]
            })
        } else if (e.currentTarget.dataset.idx == 1) {
            this.setData({
                openByCondition: [false, !this.data.openByCondition[1], false, false]
            })
        } else if (e.currentTarget.dataset.idx == 2) {
            this.setData({
                openByCondition: [false, false, !this.data.openByCondition[2], false]
            })
        } else if (e.currentTarget.dataset.idx == 3) {
            this.setData({
                openByCondition: [false, false, false, !this.data.openByCondition[3]]
            })
        }
    },

    closeShadow() {
        this.setData({
            openByCondition: [false, false, false, false]
        })
        let removeItem = this.data.removeItem
        let chooseList = this.data.chooseList
        if (removeItem.length != 0) {
            for (let i = 0; i < removeItem.length; i++) {
                let typeIdx = removeItem[i].typeIdx
                let itemIdx = removeItem[i].itemIdx
                console.log("remove===> " + "typeIdx:" + typeIdx + ",itemIdx:" + itemIdx)
                chooseList[typeIdx][itemIdx].checked = !chooseList[typeIdx][itemIdx].checked
            }
            this.setData({
                chooseList: chooseList,
                removeItem: []
            })
            this.TFArr()
        }
        this.findSchoolsCount()
    },

    loadMore() {
        if (this.data.moreData) {
            let paramsMap = {
                page: ++this.data.page,
                pageCount: this.data.pageCount,
                chooseLocations: this.data.chooseLocations,
                chooseSchoolLevels: this.data.chooseSchoolLevels,
                chooseSchoolTypes: this.data.chooseSchoolTypes,
                chooseBanxueTypes: this.data.chooseBanxueTypes
            }
            console.log("findSchoolsOrderByXyhRank参数为:")
            console.log("page：" + paramsMap["page"] + ",pageCount：" + paramsMap["pageCount"] + ",chooseLocations：" + paramsMap["chooseLocations"]
                + ",chooseSchoolLevels：" + paramsMap["chooseSchoolLevels"] + ",chooseSchoolTypes：" + paramsMap["chooseSchoolTypes"] + "，chooseBanxueTypes：" + paramsMap["chooseBanxueTypes"])
            postRequest("/school/findSchools", paramsMap).then(res => {
                let schoolList = res.data
                if (schoolList.length < 10) {
                    this.setData({
                        moreData: false
                    })
                } else {
                    schoolList = this.data.schoolList.concat(this.processDataForRead(schoolList))
                    this.setData({
                        moreData: true,
                        schoolList: schoolList
                    })
                }
            })
        }

    },
    findSchoolsCount(){
        this.setParam()
        let paramsMap = {
            chooseLocations: this.data.chooseLocations,
            chooseSchoolLevels: this.data.chooseSchoolLevels,
            chooseSchoolTypes: this.data.chooseSchoolTypes,
            chooseBanxueTypes: this.data.chooseBanxueTypes
        }
        // console.log("查询参数为:{"
        //     + ",chooseLocations：" + paramsMap.chooseLocations
        //     + ",chooseSchoolLevels：" + paramsMap.chooseSchoolLevels
        //     + ",chooseSchoolTypes：" + paramsMap.chooseSchoolTypes
        //     + "，chooseBanxueTypes：" + paramsMap.chooseBanxueTypes + " }")
        postRequest("/school/findSchoolsCount", paramsMap).then(res => {
            let schoolsCount = this.processDataForRead(res.data)
            this.setData({
                schoolsCount: schoolsCount
            })
        })

    },

    findSchoolsOrderByXyhRank() {
        wx.showLoading({
            title: '加载中'
        })
        this.setParam()
        let paramsMap = {
            page: 1,
            pageCount: this.data.pageCount,
            chooseLocations: this.data.chooseLocations,
            chooseSchoolLevels: this.data.chooseSchoolLevels,
            chooseSchoolTypes: this.data.chooseSchoolTypes,
            chooseBanxueTypes: this.data.chooseBanxueTypes
        }
        console.log("查询参数为:{"
            + " page：" + paramsMap.page
            + ",pageCount：" + paramsMap.pageCount
            + ",chooseLocations：" + paramsMap.chooseLocations
            + ",chooseSchoolLevels：" + paramsMap.chooseSchoolLevels
            + ",chooseSchoolTypes：" + paramsMap.chooseSchoolTypes
            + "，chooseBanxueTypes：" + paramsMap.chooseBanxueTypes + " }")
        postRequest("/school/findSchools", paramsMap).then(res => {
            let schoolList = this.processDataForRead(res.data)
            this.setData({
                removeItem:[],
                page:1,
                schoolList: schoolList
            })
            if (schoolList.length < 10) {
                this.setData({
                    moreData: false
                })
            } else {
                this.setData({
                    moreData: true
                })
            }
            this.closeShadow()
        })

        wx.hideLoading()
    },

    findSchoolById(e) {
        let id = e.currentTarget.dataset.param[0]
        let name = e.currentTarget.dataset.param[1]
        console.log(id)
        wx.navigateTo({
            url: "/pages/schoolDetail/schoolDetail?id=" + id+"&name="+name
        })
    },

    processDataForRead(schoolList) {
        for (let i = 0; i < schoolList.length; i++) {
            let city = schoolList[i].city
            let type = schoolList[i].type
            let schoolType = schoolList[i].schoolType
            let nature = schoolList[i].nature
            if (schoolType == 6000) {
                schoolType = '本科'
            } else if (schoolType == 6001) {
                schoolType = '专科'
            } else if (schoolType == 6002) {
                schoolType = '独立学院'
            } else {
                schoolType = ''
            }
            if (nature == 36000) {
                nature = '公办'
            } else if (nature == 36001) {
                nature = '民办'
            } else if (nature == 36002) {
                nature = '中外合作办学'
            } else {
                nature = ''
            }
            schoolList[i].schoolType = schoolType
            schoolList[i].nature = nature
            schoolList[i].city = city.substring(0, city.length - 1);
            if (type != '' && type != '其他') {
                schoolList[i].type = type.substring(0, type.length - 1);
            }

        }
        return schoolList
    },
    goSearch(){
        wx.navigateTo({
            url: "/pages/search/search-1/search"
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        //设置遮罩层高度
        wx.getSystemInfo({
            success: (res) => {
                this.setData({
                    windowHeight: (res.windowHeight * (750 / res.windowWidth))
                });
            }
        })
        this.findSchoolsOrderByXyhRank()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})