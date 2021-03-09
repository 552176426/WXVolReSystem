import {getRequest} from "../../utils/request";

const app = getApp();
Page({

    data: {
        changed: false,
        shadow: false,
        batchShadow: false,
        admissionShadow: false,
        provinceName: '江西',
        animationData: {},
        windowHeight: 100,
        chooseLocations: [],
        chooseSchoolTypes: [],
        chooseBanxueTypes: [],
        chooseSchoolLevels: [],
        admissionData:[],
        removeItem: [],
        paramsMap: {
            provinceName: '江西',
            curriculum: '理科',
            score: 535,
            scoreOrder: null,
            batchName: '本科一批',
            batches:[],
            year: 2020,
        },
        batchNameMap: app.globalData.batchNameMap,
        typeList: [
            {data: {}, page: 1, pageCount: 10, title: '加载中...', moreData: true},
            {data: {}, page: 1, pageCount: 10, title: '加载中...', moreData: true},
            {data: {}, page: 1, pageCount: 10, title: '加载中...', moreData: true},
            {data: {}, page: 1, pageCount: 10, title: '加载中...', moreData: true}
        ],
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
            {name: '公办', checked: false},
            {name: '民办', checked: false},
        ], [
            {name: '985', checked: false},
            {name: '211', checked: false},
            {name: '双一流', checked: false},
        ],],
        type: ['冲', '稳', '保', '更多'],
        current: 0,
        schools: [],
    },
    changeBatch(e) {
        this.closeBatchShadow()
        console.log(e.currentTarget.dataset.batch)
        let paramsMap = this.data.paramsMap
        paramsMap.batchName=e.currentTarget.dataset.batch
        console.log(paramsMap)
        this.setData({
            paramsMap:paramsMap,
            current:0,
            typeList: [
                {data: {}, page: 1, pageCount: 10, title: '加载中...', moreData: true},
                {data: {}, page: 1, pageCount: 10, title: '加载中...', moreData: true},
                {data: {}, page: 1, pageCount: 10, title: '加载中...', moreData: true},
                {data: {}, page: 1, pageCount: 10, title: '加载中...', moreData: true}
            ],
        })
        wx.showLoading({
            title:'加载中'
        })
        this.findSchools().then(res=>{
            wx.hideLoading()
        })

    },
    batchActionSheet: function (e) {
        // 用that取代this，防止不必要的情况发生
        var that = this;
        // 创建一个动画实例
        var animation = wx.createAnimation({
            // 动画持续时间
            duration: 100,
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
            batchShadow: true
        })
        // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
        setTimeout(function () {
            animation.translateY(0).step()
            that.setData({
                animationData: animation.export()
            })
        }, 100)
    },
    closeBatchShadow: function (e) {
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
                batchShadow: false
            })
        }, 100)
    },
    closeAdmissionShadow: function (e) {
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
                admissionShadow: false
            })
        }, 100)
    },
    admissionActionSheet: function (e) {
        let name = e.currentTarget.dataset.name
        let typeList = this.data.typeList
        let mapList = typeList[this.data.current].data.list
        let map
        for (let i = 0; i < mapList.length; i++) {
            if (mapList[i].school_name==name){
                map=mapList[i]
            }
        }
        this.setData({
            admissionData:map.admissionData
        })
        console.log(this.data.admissionData)
        // 用that取代this，防止不必要的情况发生
        var that = this;
        // 创建一个动画实例
        var animation = wx.createAnimation({
            // 动画持续时间
            duration: 100,
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
            admissionShadow: true
        })
        // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
        setTimeout(function () {
            animation.translateY(0).step()
            that.setData({
                animationData: animation.export()
            })
        }, 100)
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
            moreData: true,
            changed: true,
        })
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
            chooseList: chooseList,
            moreData: true,
            chooseLocations: [],
            chooseSchoolTypes: [],
            chooseBanxueTypes: [],
            chooseSchoolLevels: [],
            current: 0,
            typeList: [
                {data: {}, page: 1, pageCount: 10, title: '加载中...', moreData: true},
                {data: {}, page: 1, pageCount: 10, title: '加载中...', moreData: true},
                {data: {}, page: 1, pageCount: 10, title: '加载中...', moreData: true},
                {data: {}, page: 1, pageCount: 10, title: '加载中...', moreData: true}
            ],
        })
        wx.showLoading({
            title:'加载中'
        })
        this.findSchools().then(res=>{
            wx.hideLoading()
        })
        this.closeShadow()

    },
    batchSheet() {
        wx.showActionSheet({
            itemList: ['本科一批', '本科二批', '专科批'],
            itemColor: '#1888f7',
            success(res) {
                console.log(res.tapIndex);
                if (res.tapIndex === 0) {

                } else if (res.tapIndex === 1) {

                }
            }
        })
    },

    closeShadow() {
        this.setData({
            shadow: !this.data.shadow,
            changed: false,
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
                removeItem: [],
            })
        }

    },
    loadMore() {
        console.log("loadMore")
        let moreData = this.data.typeList[this.data.current].moreData
        if (moreData) {
            let typeList = this.data.typeList
            typeList[this.data.current].page += 1
            this.setData({
                typeList: typeList
            })
            let paramsMap = {
                provinceName: this.data.paramsMap.provinceName,
                curriculum: this.data.paramsMap.curriculum,
                score: this.data.paramsMap.score,
                scoreOrder: this.data.paramsMap.scoreOrder,
                batchName: this.data.paramsMap.batchName,
                batches: this.data.batchNameMap.batches,
                year: this.data.paramsMap.year,
                type: this.data.type[this.data.current],
                page: this.data.typeList[this.data.current].page,
                pageCount: this.data.typeList[this.data.current].pageCount,
                chooseLocations: this.data.chooseLocations,
                chooseSchoolTypes: this.data.chooseSchoolTypes,
                chooseBanxueTypes: this.data.chooseBanxueTypes,
                chooseSchoolLevels: this.data.chooseSchoolLevels,
            }

            getRequest("/recommend/findSchools", paramsMap).then(res => {
                let typeList = this.data.typeList
                if (res.data.list.length < typeList[this.data.current].pageCount) {
                    typeList[this.data.current].moreData = false
                }
                typeList[this.data.current].data.list = typeList[this.data.current].data.list.concat(res.data.list)
                this.setData({
                    typeList: typeList,
                })

            })
        }
    },


    Myconfirm(e) {
        if (this.data.changed) {
            this.setData({
                typeList: [
                    {data: {}, page: 1, pageCount: 10, title: '加载中...', moreData: true},
                    {data: {}, page: 1, pageCount: 10, title: '加载中...', moreData: true},
                    {data: {}, page: 1, pageCount: 10, title: '加载中...', moreData: true},
                    {data: {}, page: 1, pageCount: 10, title: '加载中...', moreData: true}
                ],
            })
            this.findSchools().then(res => {
                this.closeShadow()
            })
            console.log(this.data.changed)
        } else {
            this.closeShadow()
            console.log(this.data.changed)
        }

    },

    findSchools() {
        return new Promise((resolve, reject) => {
            this.setParam()
            let paramsMap = {
                provinceName: this.data.paramsMap.provinceName,
                curriculum: this.data.paramsMap.curriculum,
                score: this.data.paramsMap.score,
                scoreOrder: this.data.paramsMap.scoreOrder,
                batches: this.data.batches,
                year: this.data.paramsMap.year,
                batchName: this.data.paramsMap.batchName,
                type: this.data.type[this.data.current],
                page: this.data.typeList[this.data.current].page,
                pageCount: this.data.typeList[this.data.current].pageCount,
                chooseLocations: this.data.chooseLocations,
                chooseSchoolTypes: this.data.chooseSchoolTypes,
                chooseBanxueTypes: this.data.chooseBanxueTypes,
                chooseSchoolLevels: this.data.chooseSchoolLevels,
            }

            getRequest("/recommend/findSchools",paramsMap).then(res => {
                let typeList = this.data.typeList
                let data = res.data
                typeList[this.data.current].data = data
                typeList[this.data.current].title = data.length + '所'
                this.setData({
                    removeItem: [],
                    typeList: typeList,
                })
                let pageCount = this.data.typeList[this.data.current].pageCount
                let length = this.data.typeList[this.data.current].data.list.length
                if (length < pageCount) {
                    typeList[this.data.current].moreData = false
                    this.setData({
                        typeList: typeList
                    })
                }
                console.log(this.data.typeList)
                resolve()
            })

        })
    },
    onShow(){
        console.log("onshow:")
        let paramsMap = wx.getStorageSync('paramsMap')
        this.setData({
            paramsMap:paramsMap
        })
        if (wx.getStorageSync('flag')){
            wx.showToast({title:'修改成功',duration:1500})
            wx.removeStorageSync('flag')
            this.findSchools().then(res=>{})
        }
    },
    editInfo(){
      wx.navigateTo({
          url:"/pages/inputInfo/inputInfo"
      })
    },

    onLoad: function (options) {
        console.log("onload")
        wx.getSystemInfo({
            success: (res) => {
                this.setData({
                    windowHeight: (res.windowHeight * (750 / res.windowWidth)) - 130
                });
            }
        })
        if (!wx.getStorageSync('flag ')){
            let paramsMap = wx.getStorageSync('paramsMap')
            this.setData({
                paramsMap:paramsMap
            })
            wx.showLoading({title:'加载中'})
            this.findSchools().then(res=>{
                wx.hideLoading()
            })
        }

    },
    bindChange(e) {
        let current = e.detail.current
        this.setData({
            current: current
        })
        if (this.isEmptyObject(this.data.typeList[current].data)) {
            wx.showLoading({
                title:'加载中'
            })
            this.findSchools().then(res=>{
                wx.hideLoading()
            })
        }
    },
    switchTab(e) {
        let current = e.currentTarget.dataset.current
        this.setData({
            current: current
        })
        if (this.isEmptyObject(this.data.typeList[current].data)) {
            wx.showLoading({
                title:'加载中'
            })
            this.findSchools().then(res=>{
                wx.hideLoading()
            })
        }
    },

    isEmptyObject(obj) {
        for (let key in obj) {
            return false;
        }
        return true;
    },

    goSchoolDetail(e){
        console.log("/pages/schoolDetail/schoolDetail?id=" + e.currentTarget.dataset.param[0]+"&name="+e.currentTarget.dataset.param[1])
        wx.navigateTo({
            url: "/pages/schoolDetail/schoolDetail?id=" + e.currentTarget.dataset.param[0]+"&name="+e.currentTarget.dataset.param[1]
        })
    },
});