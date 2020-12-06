import {getRequest} from "../../utils/request";
import * as echarts from "../../ec-canvas/echarts";

var WxParse = require('../wxParse/wxParse.js');

const app = getApp();



Page({
    data: {
        navbarInitTop: 0, //导航栏初始化距顶部的距离
        isFixedTop: false, //是否固定顶部
        windowHeight: 100,
        current: 0,
        special: {},
        infoOpen: false,
        schoolList: [],
        page: 1,
        pageCount: 10,
        ec: {
            lazyLoad: true,
        },

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
        getRequest("/special/findOne?id=" + 1).then(res => {
            let content = res.data.baseInfo.content
            WxParse.wxParse('content', 'html', content, this, 5);
            this.setData({
                special: res.data
            })
        })
        this.findSchool()

        this.init()


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

        if (that.data.navbarInitTop == 0) {

            //获取节点距离顶部的距离
            wx.createSelectorQuery().select('#navbar').boundingClientRect(function (rect) {
                if (rect && rect.top > 0) {
                    let navbarInitTop = parseInt(rect.top);
                    that.setData({
                        navbarInitTop: navbarInitTop
                    });
                }
            }).exec();

        }
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
        if (that.data.isFixedTop === isSatisfy) {
            return false;
        }

        that.setData({
            isFixedTop: isSatisfy
        });
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


})