import {getRequest} from "../../utils/request";
import * as echarts from "../../ec-canvas/echarts";

var WxParse = require('../wxParse/wxParse.js');

const app = getApp();


Page({
    data: {
        navbarInitTop: 0, //导航栏初始化距顶部的距离
        comment0Top: 0, //导航栏初始化距顶部的距离
        comment1Top: 0, //导航栏初始化距顶部的距离
        comment2Top: 0, //导航栏初始化距顶部的距离
        isFixedTop: false, //是否固定顶部
        top0: true, //是否固定顶部
        top1: false, //是否固定顶部
        top2: false, //是否固定顶部
        windowHeight: 100,
        current: 0,
        special: {},
        infoOpen: false,
        schoolList: [],
        page: 5,
        pageCount: 10,
        ec: {
            lazyLoad: true,
        },
        scrollTop: 100,
        moreData:true,

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
            title:'加载中'
        })
        getRequest("/special/findOne?id=" + 1).then(res => {
            this.setData({
                special: res.data
            })
            let special = this.data.special
            let job = special.jobDetail[2]
            for (let i = 0; i < job.length; i++) {
                if (i==0){
                    job[i].checked = true
                }else{
                    job[i].checked = false
                }
            }
            special.baseInfo.content = this.convertHtmlToText(special.baseInfo.content)

            this.setData({
                special: special
            })
            console.log(this.data.special)
            wx.hideLoading()

        })
        this.findSchool()



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

    findSchool() {
        getRequest("/special/findSchool?id=" + 1 + "&page=" + this.data.page + "&pageCount=" + this.data.pageCount).then(res => {
            this.setData({
                schoolList: res.data
            })
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let that = this;
        const query = wx.createSelectorQuery()  //创建节点查询器
        if (that.data.navbarInitTop == 0) {
            //获取节点距离顶部的距离
            query.select('#navbar').boundingClientRect(function (rect) {
                if (rect && rect.top > 0) {
                    let navbarInitTop = parseInt(rect.top);

                    that.setData({
                        navbarInitTop: navbarInitTop
                    });
                }
            }).exec();
        }
        setTimeout(function () {
            if (that.data.comment0Top == 0) {
                //获取节点距离顶部的距离
                query.select('#comment0').boundingClientRect(function (rect) {
                    if (rect && rect.top > 0) {
                        let navbarInitTop = parseInt(rect.top);

                        that.setData({
                            comment0Top: navbarInitTop
                        });
                    }
                }).exec();
            }
            if (that.data.comment1Top == 0) {
                //获取节点距离顶部的距离
                query.select('#comment1').boundingClientRect(function (rect) {
                    if (rect && rect.top > 0) {
                        let navbarInitTop = parseInt(rect.top);

                        that.setData({
                            comment1Top: navbarInitTop
                        });
                    }
                }).exec();
            }
            if (that.data.comment2Top == 0) {
                //获取节点距离顶部的距离
                query.select('#comment2').boundingClientRect(function (rect) {
                    if (rect && rect.top > 0) {
                        let navbarInitTop = parseInt(rect.top);

                        that.setData({
                            comment2Top: navbarInitTop
                        });
                    }
                }).exec();
            }
        }, 300)
    },

    getOption() {
        let option = {
            title: {//标题
                text: '哲学',
                left: 'center'
            },
            renderAsImage: true, //支持渲染为图片模式
            color: ["#FFC34F", "#FF6D60", "#44B2FB"],//图例图标颜色
            legend: {
                show: true,
                itemGap: 25,//每个图例间的间隔
                top: 30,
                x: 30,//水平安放位置,离容器左侧的距离  'left'
                z: 100,
                textStyle: {
                    color: '#383838'
                },
                data: [//图例具体内容
                    {
                        name: '本专业',//图例名字
                        textStyle: {//图例文本样式
                            fontSize: 13,
                            color: '#383838'
                        },
                        icon: 'roundRect'//图例项的 icon，可以是图片
                    },
                    {
                        name: '所有专业',
                        textStyle: {
                            fontSize: 13,
                            color: '#383838'
                        },
                        icon: 'roundRect'
                    },
                ]
            },
            grid: {//网格
                left: 30,
                top: 100,
                containLabel: true,//grid 区域是否包含坐标轴的刻度标签
            },
            xAxis: {//横坐标
                splitLine: {//坐标轴在 grid 区域中的分隔线。
                    show: true,
                    lineStyle: {
                        type: 'dashed'
                    }
                },
                boundaryGap: false,//1.true 数据点在2个刻度直接  2.fals 数据点在分割线上，即刻度值上
                data: ['应届生', '2年', '5年', '10年'],
                axisLabel: {
                    textStyle: {
                        fontSize: 13,
                        color: '#5D5D5D'
                    }
                }
            },
            yAxis: {//纵坐标
                // nameLocation:'start',
                type: 'value',
                position: 'left',
                nameTextStyle: {//在name值存在下，设置name的样式
                    color: 'red',
                    fontStyle: 'normal'
                },
                splitNumber: 5,//坐标轴的分割段数
                splitLine: {//坐标轴在 grid 区域中的分隔线。
                    show: true,
                    lineStyle: {
                        type: 'dashed'
                    }
                },
                axisLabel: {//坐标轴刻度标签
                    textStyle: {
                        fontSize: 13,
                        color: '#5D5D5D',
                    }
                },
                min: 0,
                max: function (value) {

                    return Math.ceil(value.max * 1000 / 500)
                },
            },
            series: [{
                name: '本专业',
                type: 'line',
                data: [4.2 * 1000, 5.3 * 1000, 6.8 * 1000, 9.1 * 1000],
                symbol: 'none',
                itemStyle: {
                    normal: {
                        lineStyle: {
                            color: '#FFC34F'
                        }
                    }
                }
            }, {
                name: '所有专业',
                type: 'line',
                data: [4.5 * 1000, 5.7 * 1000, 7.5 * 1000, 10.4 * 1000],
                // data: ["80", "20", "50", "70", "80", "60", "70"],
                symbol: 'none',
                itemStyle: {
                    normal: {
                        lineStyle: {
                            color: '#FF6D60'
                        }
                    }
                }
            }],
        }
        return option;
    },


    init: function () {
        let that = this
        this.selectComponent("#mychart-dom-gauge").init(function (canvas, width, height, dpr) {
                const chart = echarts.init(canvas, null, {
                    width: width,
                    height: height,
                    devicePixelRatio: dpr // new
                })
                chart.setOption(that.getOption(), true);
                return chart;
            }
        )
    }
    ,

    /**
     * 监听页面滑动事件
     */
    onPageScroll: function (e) {
        let that = this;

        let scrollTop = parseInt(e.scrollTop); //滚动条距离顶部高度


        //判断'滚动条'滚动的距离 和 '元素在初始时'距顶部的距离进行判断
        let isSatisfy = scrollTop >= that.data.navbarInitTop ? true : false;
        //为了防止不停的setData, 这儿做了一个等式判断。 只有处于吸顶的临界值才会不相等

        if (scrollTop >= 0 && scrollTop <= that.data.comment1Top && scrollTop <= that.data.comment2Top ) {
            that.setData({
                isFixedTop: isSatisfy,
                current: 0
            });

        } else if (scrollTop >= 0 && scrollTop >= that.data.comment1Top&& scrollTop <= that.data.comment2Top ) {
            that.setData({
                isFixedTop: isSatisfy,
                current: 1
            });

        } else if (scrollTop >= 0 && scrollTop >= that.data.comment1Top && scrollTop >= that.data.comment2Top) {
            that.setData({
                isFixedTop: isSatisfy,
                current: 2
            });

        }
    },

    onReachBottom(){
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
        if (current == 0) {
            console.log("toComment0")
            this.toComment0()

        } else if (current == 1) {
            console.log("toComment1")
            this.toComment1()

        } else {
            console.log("toComment2")
            this.toComment2()

        }

    },
    infoOpen() {
        this.setData({
            infoOpen: !this.data.infoOpen
        })
    },

    toComment0() {
        console.log(this.data.comment0Top)
        wx.pageScrollTo({
            scrollTop: this.data.comment0Top,
            duration: 100
        })
    },

    toComment1() {
        console.log(this.data.comment1Top)
        wx.pageScrollTo({
            scrollTop: this.data.comment1Top,
            duration: 100
        })
    },


    toComment2() {
        console.log(this.data.comment2Top)
        wx.pageScrollTo({
            scrollTop: this.data.comment2Top,
            duration: 100
        })
    },

    convertHtmlToText: function convertHtmlToText(inputText) {
        var returnText = "" + inputText;
        returnText = returnText.replace(/[\r\n]/g,"");
        returnText = returnText.replace(/<\/div>/ig, '\r\n');
        returnText = returnText.replace(/<\/li>/ig, '\r\n');
        returnText = returnText.replace(/<li>/ig, ' * ');
        returnText = returnText.replace(/<\/ul>/ig, '\r\n');
        //-- remove BR tags and replace them with line break
        returnText = returnText.replace(/<br\s*[\/]?>/gi, "\r");

        //-- remove P and A tags but preserve what's inside of them
        returnText=returnText.replace(/<p.*?>/gi, "\r\n");
        returnText = returnText.replace(/[\r\n]/g,"");
        returnText = returnText.replace(/\s/g, "\r\n");
        returnText = returnText.replace(/^\s+|\s+$/g,'')
        returnText=returnText.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, " $2 ($1)");

        //-- remove all inside SCRIPT and STYLE tags
        returnText=returnText.replace(/<script.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/script>/gi, "");
        returnText=returnText.replace(/<style.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/style>/gi, "");
        //-- remove all else
        returnText=returnText.replace(/<(?:.|\s)*?>/g, "");

        //-- get rid of more than 2 multiple line breaks:
        returnText=returnText.replace(/(?:(?:\r\n|\r|\n)\s*){2,}/gim, "\r\n\r\n");

        //-- get rid of more than 2 spaces:
        returnText = returnText.replace(/ +(?= )/g,'');

        //-- get rid of html-encoded characters:
        returnText=returnText.replace(/&nbsp;/gi," ");
        returnText=returnText.replace(/&amp;/gi,"&");
        returnText=returnText.replace(/&quot;/gi,'"');
        returnText=returnText.replace(/&lt;/gi,'<');
        returnText=returnText.replace(/&gt;/gi,'>');

        return returnText;
    }

})