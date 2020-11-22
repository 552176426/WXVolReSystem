import request, {getRequest} from "../../utils/request";

Page({
    data: {
        openProvince: false,
        openYear: false,
        chooseTF:[false,false,false],
        windowHeight: 1000,
        provinceList: [],
        yearList: [2020, 2019, 2018, 2017, 2016, 2015, 2014],
        scoreParagraphList: [],
        chooseProvince: "北京",
        chooseYear: 2020,
        chooseType:'综合',
        chooseList:[[
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
        ],[],[]],
    },
    findYears(provinceName) {
        let data = {
            chooseProvince: this.data.chooseProvince
        }
        getRequest("/scoreParagraph/years", data).then(res=>{
            let chooseList = this.data.chooseList
            chooseList[1] = res.data
            this.setData({
                chooseList: chooseList
            })
        })
    },
    findTypes(provinceName,year){
        let data = {
            chooseProvince: this.data.chooseProvince,
            chooseYear: this.data.chooseYear
        }
        getRequest("/scoreParagraph/types", data).then(res=>{
            let chooseList = this.data.chooseList
            chooseList[2] = res.data
            this.setData({
                chooseList: chooseList
            })
        })
    },
    findScoreParagraph(){
        let data = {
            chooseProvince: this.data.chooseProvince,
            chooseYear: this.data.chooseYear,
            chooseType:this.data.chooseType
        }
        getRequest("/scoreParagraph/scoreParagraphs", data).then(res=>{
            this.setData({
                scoreParagraphList: res.data
            })
        })
    },

    openProvince() {
        this.setData({
            openYear: false,
            openProvince: !this.data.openProvince,
        })
    },

    openYear() {
        this.setData({
            openProvince: false,
            openYear: !this.data.openYear
        })
    },
    closeShadow() {
        this.setData({
            openProvince: false,
            openYear: false
        })
    },
    setProvince(e) {
        this.setData({
            chooseProvince: e.currentTarget.dataset.sel,
            openProvince: false,
            openYear: false
        })
        this.findProvinceScore()

    },

    setYear(e) {
        this.setData({
            chooseYear: e.currentTarget.dataset.sel,
            openProvince: false,
            openYear: false
        })
        this.findProvinceScore()
    },
    findProvinceScore: function () {
        let url = "/provinceScore/all?provinceName=" + this.data.chooseProvince + "&year=" + this.data.chooseYear
        getRequest(url).then(res=>{
            this.setData({
                provinceScoreList: res.data
            })
        })
    },

    onLoad: function (options) {
        wx.showLoading({
            title:"加载中"
        })
        this.findScoreParagraph()
        wx.hideLoading()
        //设置遮罩层高度
        wx.getSystemInfo({
            success: (res) => {
                this.setData({
                    windowHeight: (res.windowHeight * (750 / res.windowWidth))
                });
            }
        })
    }
});