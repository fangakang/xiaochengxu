//app.js
App({
  onLaunch: function () {
    var that=this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.checkSession({
      success: function () {
        //session 未过期，并且在本生命周期一直有效
      },
      fail() {
        wx.login();//重新登录
      }
    });

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        getApp().globalData.code = res.code;
        var extConfig = wx.getExtConfigSync();
        if (wx.getExtConfig) {
          wx.getExtConfig({
            success: function (res) {
              extConfig = res.extConfig;
            },
            fail: function () {
            }
          });
          getApp().globalData.extMid = extConfig.mid;
          getApp().globalData.appid = extConfig.appid;
          if (that.extReadyCallback) {
            that.extReadyCallback()
          }
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          that.getInfo();
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log(res)
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              // if (this.userInfoReadyCallback) {
              //   this.userInfoReadyCallback(res)
              // }
            },
          })
        };
      },

    })
  },
  onLoad:function(option){
    var scene = decodeURIComponent(options.scene);
  },
  getInfo: function () {//获取用户信息方法
    var that=this;
    wx.getUserInfo({
      lang: "zh_CN",
      success: function (userRes) {
        console.log(userRes)
        that.globalData.userInfo = userRes.userInfo
        console.log(that.globalData.userInfo)

        getApp().globalData.encryptedData = userRes.encryptedData;
        getApp().globalData.iv = userRes.iv;
        var params = {
          code: getApp().globalData.code,
          appid: getApp().globalData.appid,
          encryptedData: userRes.encryptedData,
          iv: userRes.iv,
          agentid: getApp().globalData.extMid
        }
        getApp().ajax('POST', params, '/cashier/merchants.php?m=Api&c=wxadoc&a=getPublic',(res)=>{
          console.log(res)
          if(res.data.err_code==0){
            getApp().globalData.session_key = res.data.err_msg.session_key;
            that.addUser();
          }else{
            wx.showToast({
              title: res.data.err_msg.message,
              icon:'none'
            })
          }
        },(res)=>{
          console.log(res)
          wx.hideLoading()
        })
      }
    }) 
  },
  addUser:function(){
    var that=this;
    var params={
      code: getApp().globalData.code,
      appId: getApp().globalData.appid,
      encryptedData: getApp().globalData.encryptedData,
      iv: getApp().globalData.iv,
      agentid: getApp().globalData.extMid,
      session_key: getApp().globalData.session_key,
    };
    getApp().ajax('POST', params,'/cashier/merchants.php?m=Api&c=wxadoc&a=addUser',(res)=>{
      console.log(res);
      if(res.data.err_code==0){
        wx.hideLoading();
        getApp().globalData.unionid = res.data.err_msg.unionid;
        getApp().globalData.mid = res.data.err_msg.mid;
        getApp().globalData.agentid = res.data.err_msg.agentid;
        getApp().globalData.openid = res.data.err_msg.openid;
        getApp().globalData.phone = res.data.err_msg.phone
        getApp().globalData.validitytime = res.data.err_msg.validitytime
        if (that.userInfoReadyCallback) {
          that.userInfoReadyCallback();
        }
      }else{
        wx.hideLoading();
        wx.showModal({
          title: '温馨提示',
          content: res.data.err_msg,
          showCancel:false
        })
      }
     
    },(res)=>{
      console.log(res)
    })
  },
  // 接口请求封装
  ajax(Type, params, url, successData, errorData) {
    wx.showLoading({
      title: '加载中...',
    })
    var methonType = "application/json";
    var https = "https://k.pigcms.com.cn"
    var st = new Date().getTime()
    if (Type == "POST") {
      methonType = "application/x-www-form-urlencoded"
    }
    wx.request({
      url: https + url,
      method: Type,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: params,
      success: (res) => {
        successData(res)
      },
      error(res) {
        errorData(res)
      }
    })
  },
  globalData: {
    agentid:'',
    userInfo: null,
    code: '',
    appid: '',
    extMid: '',
    session_key:'',
    encryptedData:'',
    iv:'',
    unionid:'',
    openid:'',
    mid:'',
    latitude:'',
    longitude:'',
    phone:'',
    httpHead:'https://k.pigcms.com.cn',
    footHeight:0,
    title:'',
    validitytime:'',
  }
})