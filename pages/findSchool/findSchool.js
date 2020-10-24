// pages/findSchool/findSchool.js
import request from "../../utils/request";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        condition_image_url1: '/static/images/icon/up.png',
        condition_image_url2: '/static/images/icon/down.png',
        condition_text1: 'condition-group-item-text',
        condition_text2: 'condition-group-item-text-up',
        index: 0,
        location_black_weight:0,

    },

    /**
     * 改变条件中图片方向
     */
     changeDirection: function (e) {
        request.adds(1,2);

        const i = e.currentTarget.dataset.index
        //console.log(this.data.index+":"+ i)
        if (this.data.index != i) {
            this.setData({
                index: i
            })
        } else {
            this.setData({
                index: 0
            })
        }

    },

    /**
     * 生命周期函数--监听页面加载
     */
     onLoad:  function (options) {
        wx.getSystemInfo({
            success(res) {
                this.setData({
                    location_black_weight:res.windowHeight-200

                })
            }
        })
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