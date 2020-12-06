import {getRequest} from "../../../utils/request";

Page({
    data: {
        windowHeight: 100,
        current: 0,
        special: {},
        infoOpen: false,
        schoolList: [],
        page: 5,
        pageCount: 10,
        moreData: true,

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log("onload")
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


        wx.setNavigationBarTitle({
            title: options.name
        })

        getRequest("/special/findOne?id=" + options.id).then(res => {
            this.setData({
                special: res.data
            })
            let special = this.data.special
            let job = special.jobDetail['type2']
            if (job!=null){
                for (let i = 0; i < job.length; i++) {
                    if (i == 0) {
                        job[i].checked = true
                    } else {
                        job[i].checked = false
                    }
                }
            }
            special.baseInfo.content = this.convertHtmlToText(special.baseInfo.content)

            this.setData({
                special: special
            })
            console.log(this.data.special)
            wx.hideLoading()
            this.findSchool(options.id).then(res => {

            })
        })


    },

    goSpecial(e){
        wx.navigateTo({
            url: "/pages/specials/special-4/special-4?name="+e.currentTarget.dataset.id[1]+"&id="+e.currentTarget.dataset.id[0]
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

    async findSchool(id) {
        return new Promise((resolve, reject) => {
            getRequest("/special/findSchool?id=" + id + "&page=" + this.data.page + "&pageCount=" + this.data.pageCount).then(res => {
                this.setData({
                    schoolList: res.data
                })
                resolve()
            })
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

    toCurrent(e){

        this.setData({
            current:++e.currentTarget.dataset.current,
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
    }

})