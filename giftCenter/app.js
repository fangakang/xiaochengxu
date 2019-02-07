//app.js
App({
  onLaunch: function () {
    var that=this;
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
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          that.getInfo();
        }else{
          wx.authorize({
            scope: 'scope.userInfo',
            success(e) {
              // 用户已经同意小程序获取用户信息，后续调用 wx.startRecord 接口不会弹窗询问
              that.getInfo();//调用获取用户信息
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }

        if (!res.authSetting['scope.userLocation']) {//未进行位置授权
          wx.authorize({//进行地理位置授权
            scope: 'scope.userLocation',
            success(res) {
              console.log('获取地理位置授权成功');
              wx.getLocation({
                type: 'wgs84',
                success: function (res) {          
                  getApp().globalData.latitude = res.latitude;
                  getApp().globalData.longitude = res.longitude;                 
                }
              })

            },
            fail() {
              console.log('获取地理位置授权失败')
            }
          })
        } else {//地理位置已授权
          wx.getLocation({
            type: 'wgs84',
            success: function (res) {
              getApp().globalData.latitude = res.latitude;
              getApp().globalData.longitude = res.longitude; 
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
      }
    })
  },
  globalData: {
    mid: "",
    unionid: "",
    encryptedData: "",
    iv: "",
    session_key: "",
    code: "",
    openid: '',
    orderid: '',
    latitude:0,
    longitude:0,
    allids:[],
    sendData:[]
  }
})