//app.js
App({
  globalData: {//全局变量
    mid: "",
    unionid: "",
    encryptedData: "",
    iv: "",
    session_key: "",
    code: "",
    openid: '',
    orderid: '',
    urlHead: 'https://np.pigcms.com',
    appid: 'wxf3a9a02997b0c4b9'
  },
  onLaunch: function () {
    var that=this;
    console.log('launch')
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.checkSession({
      success: function (res) {
        //session 未过期，并且在本生命周期一直有效
        console.log(res)
      },
      fail(res) {
        console.log(res)
        wx.login();//重新登录
      }
    });
    // 登录
    wx.login({
      success: res => {
        getApp().globalData.code = res.code;
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var extConfig = wx.getExtConfigSync();
        if (wx.getExtConfig) {
          wx.getExtConfig({
            success: function (res) {
              extConfig = res.extConfig;
            }
          })
        }
        extConfig = {
          mid: 2155
        }
      }
    });
    wx.getSetting({
      success(res) {
        console.log(res);
        if (!res.authSetting['scope.userInfo']) {
          
        } else {
          that.getInfo();//调用获取用户信息         
        };
        if (!res.authSetting['scope.writePhotosAlbum']) {//保存图片或视频授权
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              console.log('访问相册授权成功')
            },
            fail() {
              console.log('访问相册授权失败')
            }
          })
        }
      }
    })
  },
  getInfo: function () {//获取用户信息方法
    var that = this;
    wx.getUserInfo({
      lang: "zh_CN",
      success: function (userRes) {
        getApp().globalData.encryptedData = userRes.encryptedData;
        getApp().globalData.iv = userRes.iv;
        wx.request({
          url: 'https://np.pigcms.com/cashier/merchants.php?m=Api&c=wxadoc&a=getPublic',
          data: {
            code: getApp().globalData.code,
            mid:2155,
            appId: 'wxf3a9a02997b0c4b9',
            encryptedData: userRes.encryptedData,
            iv: userRes.iv
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: 'POST',
          //服务端的回掉  
          success: function (result) {
            console.log(result)
            getApp().globalData.session_key = result.data.err_msg.session_key;
            that.addUser();
          }
        })
      }
    })
  },
  addUser: function () {
    var that=this;
    wx.request({
      url: 'https://np.pigcms.com/cashier/merchants.php?m=Api&c=wxadoc&a=addUser',
      data: {
        code: getApp().globalData.code,
        mid: 2155,
        appId: 'wxf3a9a02997b0c4b9',
        encryptedData: getApp().globalData.encryptedData,
        iv: getApp().globalData.iv,
        session_key: getApp().globalData.session_key
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        getApp().globalData.unionid = res.data.err_msg.unionid;
        getApp().globalData.mid = res.data.err_msg.mid;
        getApp().globalData.openid = res.data.err_msg.openid;
        console.log(getApp().globalData)
        if (that.userInfoReadyCallback) {
          that.userInfoReadyCallback()
        }
      }
    })
  },
})