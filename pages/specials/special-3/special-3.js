import {getRequest} from "../../../utils/request";

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
        scrollTop: 100,
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
            let job = special.jobDetail[2]
            for (let i = 0; i < job.length; i++) {
                if (i == 0) {
                    job[i].checked = true
                } else {
                    job[i].checked = false
                }
            }
            special.baseInfo.content = this.convertHtmlToText(special.baseInfo.content)

            this.setData({
                special: special
            })
            console.log(this.data.special)
            wx.hideLoading()
            this.findSchool(options.id).then(res => {
                this.getToTop()
            })
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

    getToTop() {
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
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        /*let that = this;
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
        }, 3000)*/
    },


    onReachBottom() {
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


    /**
     * 函数节流
     * @param fn
     * @param interval
     * @returns {function(): void}
     */
    throttle(fn, interval) {
        var enterTime = 0;//触发的时间
        var gapTime = interval || 300;//间隔时间，如果interval不传，则默认300ms
        return function () {
            var context = this;
            var backTime = new Date();//第一次函数return即触发的时间
            if (backTime - enterTime > gapTime) {
                fn.call(context, arguments);
                enterTime = backTime;//赋值给第一次触发的时间，这样就保存了第二次触发的时间
            }
        };
    },

    /*函数防抖*/
    debounce(fn, interval) {
        var timer;
        var gapTime = interval || 200;//间隔时间，如果interval不传，则默认1000ms
        return function () {
            clearTimeout(timer);
            var context = this;
            var args = arguments;//保存此处的arguments，因为setTimeout是全局的，arguments不是防抖函数需要的。
            timer = setTimeout(function () {
                fn.call(context, args);
            }, gapTime);
        };
    },

    /**
     * 监听页面滑动事件
     */
    onPageScroll: function (e) {
        let that = this;
        setInterval(function () {
            let scrollTop = parseInt(e.scrollTop) + 1; //滚动条距离顶部高度

            //判断'滚动条'滚动的距离 和 '元素在初始时'距顶部的距离进行判断
            let isSatisfy = scrollTop >= that.data.navbarInitTop ? true : false;
            //为了防止不停的setData, 这儿做了一个等式判断。 只有处于吸顶的临界值才会不相等

            // console.log("scrollTop:"+scrollTop+"comment1Top:"+that.data.comment1Top+"comment2Top:"+that.data.comment2Top)
            if (scrollTop >= 0 && (scrollTop) < that.data.comment1Top && (scrollTop) < that.data.comment2Top) {
                that.setData({
                    isFixedTop: isSatisfy,
                    current: 0
                });

            } else if (scrollTop >= 0 && (scrollTop) >= that.data.comment1Top && (scrollTop) < that.data.comment2Top) {
                that.setData({
                    isFixedTop: isSatisfy,
                    current: 1
                });

            } else if (scrollTop >= 0 && (scrollTop) >= that.data.comment1Top && (scrollTop) >= that.data.comment2Top) {
                that.setData({
                    isFixedTop: isSatisfy,
                    current: 2
                });

            }
        }, 1000)

    },

    toComment0() {
        console.log(this.data.comment0Top)
        wx.pageScrollTo({
            scrollTop: this.data.comment0Top,
            duration: 0
        })
    },

    toComment1() {
        console.log(this.data.comment1Top)
        wx.pageScrollTo({
            scrollTop: this.data.comment1Top,
            duration: 0
        })
    },


    toComment2() {
        console.log(this.data.comment2Top)
        wx.pageScrollTo({
            scrollTop: this.data.comment2Top,
            duration: 0
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