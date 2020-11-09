import config from "./config";
export async function getRequest (url,data={}){
    return new Promise((resolve, reject) => {
        /*wx.showLoading({
            title:"加载中"
        })*/
        wx.request({
            url:config.host+url,
            data:data,
            method:'get',
            success(res) {
                console.log(config.host+url+"   ===>success")
                console.log(res)
                resolve(res.data)
                // wx.hideLoading()
            },
            fail(err) {
                console.log(config.host+url+"   ===>fail")
                console.log(err)
                reject(err)
                // wx.hideLoading()
            }
        })
    })
}

export async function postRequest(url,data={}){
    return new Promise((resolve, reject) => {
        /*wx.showLoading({
            title:"加载中"
        })*/
        wx.request({
            url:config.host+url,
            data:data,
            method:'post',
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success(res) {
                console.log(config.host+url+"   ===>success")
                console.log(res)
                resolve(res.data)
                // wx.hideLoading()
            },
            fail(err) {
                console.log(config.host+url+"   ===>fail")
                console.log(err)
                reject(err)
                // wx.hideLoading()
            }
        })
    })
}


