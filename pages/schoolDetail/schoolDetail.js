import {getRequest} from "../../utils/request";

Page({
    data: {
        windowHeight: 100,
        animationData: {},
        windowWidth: 100,
        specialOpen: false,
        nationOpen: false,
        current: 0,
        school: {},
        infoOpen: false,
        schoolList: [],
        nations: [],
        yearList: ['2019', '2018', '2017', '2016', '2015'],
        specials: [],
        page: 1,
        pageCount: 10,
        moreData: true,
        navbarInitTop: 0, //导航栏初始化距顶部的距离
        isFixedTop: false, //是否固定顶部
        paramsMap: {},
        batchShadow: false,
        specialBatchShadow: false,
        specialYearShadow: false,
        schoolBatchShadow: false,

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        console.log("onload")
        console.log(options)
        wx.getSystemInfo({
            success: (res) => {
                this.setData({
                    windowHeight: (res.windowHeight * (750 / res.windowWidth)),
                    windowWidth: (res.windowWidth * (750 / res.windowWidth))
                });
            }
        })
        wx.showLoading({
            title: '加载中'
        })

        if (options.type==1 || options.type==2 || options.type==3){
            this.setData({
                current:options.type
            })
        }

        wx.setNavigationBarTitle({
            title: options.name
        })


        getRequest("/school/findSchool?id=" + options.id).then(res => {
            let school = res.data
            school.baseInfo.content = this.convertHtmlToText(school.baseInfo.content)
            this.filterSpecialList(school.specialList)
            this.filterNations(school.nation_feature)
            this.setData({
                school: school
            })
            wx.hideLoading()
            let paramsMap = wx.getStorageSync('paramsMap')
            this.setData({
                paramsMap: paramsMap,
                chooseBatchName: paramsMap.batchName,
                chooseSpecialBatchName: paramsMap.batchName,
                chooseSpecialYear: this.data.yearList[0],
                chooseSchoolBatchName: paramsMap.batchName,
            })
            paramsMap.schoolName = this.data.school.baseInfo.name
            this.findSpecialPlanCount(paramsMap)
            this.findSchoolMinScore(paramsMap)
            this.findSpecialPlanRecentYear(paramsMap)
            paramsMap.year = this.data.yearList[0]
            this.findSpecialScore(paramsMap)
            this.findSchoolScore(paramsMap)
        })


    },

    findSpecialScore(paramsMap) {
        getRequest("/special/findSpecialScore", paramsMap).then(res => {
            let school = this.data.school
            school.specialScore = res.data
            this.setData({
                school: school
            })
        })
    },

    batchActionSheet: function (e) {
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
            batchShadow: true
        })
        // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
        setTimeout(function () {
            animation.translateY(0).step()
            that.setData({
                animationData: animation.export()
            })
        }, 50)
    },
    changeBatch(e) {
        this.closeBatchShadow()
        let paramsMap = this.data.paramsMap
        paramsMap.batchName = e.currentTarget.dataset.batch
        console.log(e.currentTarget.dataset.batch)
        this.findSpecialPlanRecentYear(paramsMap)
        this.setData({
            chooseBatchName: e.currentTarget.dataset.batch
        })
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

    specialBatchActionSheet: function (e) {
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
            specialBatchShadow: true
        })
        // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
        setTimeout(function () {
            animation.translateY(0).step()
            that.setData({
                animationData: animation.export()
            })
        }, 50)
    },
    changeSpecialBatch(e) {
        this.closeSpecialBatchShadow()
        let paramsMap = this.data.paramsMap
        paramsMap.batchName = e.currentTarget.dataset.batch
        console.log(e.currentTarget.dataset.batch)
        this.findSpecialScore(paramsMap)
        this.setData({
            chooseSpecialBatchName: e.currentTarget.dataset.batch
        })

    },
    closeSpecialBatchShadow: function (e) {
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
                specialBatchShadow: false
            })
        }, 100)
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
    changeSchoolBatch(e) {
        this.closeSchoolBatchShadow()
        let paramsMap = this.data.paramsMap
        paramsMap.batchName = e.currentTarget.dataset.batch
        console.log(e.currentTarget.dataset.batch)
        this.findSchoolScore(paramsMap)
        this.setData({
            chooseSchoolBatchName: e.currentTarget.dataset.batch
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


    specialYearActionSheet: function (e) {
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
            specialYearShadow: true
        })
        // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
        setTimeout(function () {
            animation.translateY(0).step()
            that.setData({
                animationData: animation.export()
            })
        }, 50)
    },
    changeSpecialYear(e) {
        this.closeSpecialYearShadow()
        let paramsMap = this.data.paramsMap
        paramsMap.year = e.currentTarget.dataset.year
        console.log(e.currentTarget.dataset.year)
        this.findSpecialScore(paramsMap)
        this.setData({
            chooseSpecialYear: e.currentTarget.dataset.year
        })

    },
    closeSpecialYearShadow: function (e) {
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
                specialYearShadow: false
            })
        }, 100)
    },

    findSpecialPlanRecentYear(paramsMap) {
        getRequest("/special/findSpecialPlanRecentYear", paramsMap).then(res => {
            let school = this.data.school
            school.specialPlan = res.data
            this.setData({
                school: school
            })
        })
    },
    switchCurrent(e) {
        this.setData({
            current: e.currentTarget.dataset.to
        })
    },
    findSpecialPlanCount(paramsMap) {
        getRequest("/special/findSpecialPlanCount", paramsMap).then(res => {
            let school = this.data.school
            school.baseInfo.specialPlanCount = res.data
            this.setData({
                school: school
            })
        })
    },

    showInfo() {
        wx.showToast({
            title: '分科不能更改',
            duration: 1000,
            icon: "none"
        })
    },

    findSchoolMinScore(paramsMap) {
        getRequest("/school/findMinScore", paramsMap).then(res => {
            let school = this.data.school
            school.baseInfo.minScore = res.data
            this.setData({
                school: school
            })
        })
    },

    findSchoolScore(paramsMap) {
        getRequest("/school/findSchoolScore", paramsMap).then(res => {
            let school = this.data.school
            school.schoolScore = res.data
            this.setData({
                school: school
            })
        })
    },

    filterNations(nationsList) {
        if (nationsList.length != 0) {
            if (nationsList.length > 10) {
                let nations = []
                for (let i = 0; i < 10; i++) {
                    nations.push(nationsList[i])
                }
                this.setData({
                    nations: nations
                })
            } else {
                this.setData({
                    nations: nationsList
                })
            }
        }
    },

    filterSpecialList(specialList) {
        if (specialList.length != 0) {
            if (specialList.length > 10) {
                let specials = []
                for (let i = 0; i < 10; i++) {
                    specials.push(specialList[i])
                }
                this.setData({
                    specials: specials
                })
            }
        }
    },


    specialOpen() {
        this.setData({
            specialOpen: !this.data.specialOpen
        })
    },

    nationOpen() {
        this.setData({
            nationOpen: !this.data.nationOpen
        })
    },


    switchCheck(e) {
        let special = this.data.special
        let job = special.jobDetail[2]
        for (let i = 0; i < job.length; i++) {
            if (i == e.currentTarget.dataset.idx) {
                job[e.currentTarget.dataset.idx].checked = !job[e.currentTarget.dataset.idx].checked
            } else {
                job[i].checked = false
            }
        }
        this.setData({
            special: special
        })
    },


    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },


    loadMore() {
        console.log("loadMore")

        if (this.data.moreData) {
            this.setData({
                page: ++this.data.page
            })
            getRequest("/special/findSchool?id=" + 1 + "&page=" + this.data.page + "&pageCount=" + this.data.pageCount).then(res => {
                let schoolList = this.data.schoolList
                if (res.data.length < this.data.pageCount) {
                    this.setData({
                        moreData: false
                    })
                }
                schoolList = schoolList.concat(res.data)
                this.setData({
                    schoolList: schoolList,
                })
                console.log(this.data.schoolList)
            })
        }
    },


    bindChange(e) {
        let current = e.detail.current
        this.setData({
            current: current
        })

    },
    switchTab(e) {
        let current = e.currentTarget.dataset.current
        this.setData({
            current: current
        })
    },
    infoOpen() {

        this.setData({
            infoOpen: !this.data.infoOpen
        })
    },

    toCurrent(e) {

        this.setData({
            current: ++e.currentTarget.dataset.current,
        })
    },

    convertHtmlToText(inputText) {
        var returnText = "" + inputText;
        returnText = returnText.replace(/[\r\n]/g, "");
        returnText = returnText.replace(/<\/div>/ig, '\r\n');
        returnText = returnText.replace(/<\/li>/ig, '\r\n');
        returnText = returnText.replace(/<li>/ig, ' * ');
        returnText = returnText.replace(/<\/ul>/ig, '\r\n');
        //-- remove BR tags and replace them with line break
        returnText = returnText.replace(/<br\s*[\/]?>/gi, "\r");

        //-- remove P and A tags but preserve what's inside of them
        returnText = returnText.replace(/<p.*?>/gi, "\r\n");
        returnText = returnText.replace(/[\r\n]/g, "");
        returnText = returnText.replace(/\s/g, "\r\n");
        returnText = returnText.replace(/^\s+|\s+$/g, '')
        returnText = returnText.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, " $2 ($1)");

        //-- remove all inside SCRIPT and STYLE tags
        returnText = returnText.replace(/<script.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/script>/gi, "");
        returnText = returnText.replace(/<style.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/style>/gi, "");
        //-- remove all else
        returnText = returnText.replace(/<(?:.|\s)*?>/g, "");

        //-- get rid of more than 2 multiple line breaks:
        returnText = returnText.replace(/(?:(?:\r\n|\r|\n)\s*){2,}/gim, "\r\n\r\n");

        //-- get rid of more than 2 spaces:
        returnText = returnText.replace(/ +(?= )/g, '');

        //-- get rid of html-encoded characters:
        returnText = returnText.replace(/&nbsp;/gi, " ");
        returnText = returnText.replace(/&amp;/gi, "&");
        returnText = returnText.replace(/&quot;/gi, '"');
        returnText = returnText.replace(/&lt;/gi, '<');
        returnText = returnText.replace(/&gt;/gi, '>');

        return returnText;
    },


})