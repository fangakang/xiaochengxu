//app.js
App({
  onLoad: function(options) {
  // options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
  var scene = decodeURIComponent(options.scene)
  },
  
  onShow: function (data) {
    var that = this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.checkSession({
      success:function(){
        //session 未过期，并且在本生命周期一直有效
      },
      fail(){
        wx.login();//重新登录
      }
    });
    // 登录
    wx.login({
      success: res => {
      getApp().globalData.code=res.code;
      console.log('0------------------0');
      getApp().globalData.openCardData = data;
      console.log(data)
      console.log(getApp().globalData.openCardData)
      //  if (data.referrerInfo==undefined ){
      //    wx.navigateBack({
      //      delta: 1
      //    })
      // }else{
         if (data.referrerInfo != undefined && data.referrerInfo.appId == 'wxeb490c6f9b154ef9') {
           wx.navigateTo({
             url: '/pages/index/personMsg',
           })
         }
      // }
       
      console.log('0------------------0');
      var extConfig = wx.getExtConfigSync();
      console.log(extConfig)
      if (wx.getExtConfig) {
          wx.getExtConfig({
              success: function (res) {
                extConfig = res.extConfig;
              },
              fail:function(){
                console.log(123)
              }
          })
          getApp().globalData.extMid = extConfig.mid;
          getApp().globalData.appid = extConfig.appid;
      }
      //getApp().globalData.is_store = extConfig.is_store
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    });
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {//未对获取用户信息授权
          getApp().globalData.authorize=false;
          console.log(getApp().globalData.authorize)
          
        } else {//已对获取用户信息授权 
            console.log('已授权');
            getApp().globalData.authorize = true;
            console.log(getApp().globalData.authorize)
            that.getInfo(); 
            //调用获取用户信息   
        };
      }
    })
    //that.titleList();
  }, 
  getInfo:function () {//获取用户信息方法
    var that = this;
    getApp().globalData.authorize = true
    wx.getUserInfo({
      lang: "zh_CN",
      success: function (userRes) {
        console.log(userRes)
        that.globalData.userInfo = userRes.userInfo
        console.log(that.globalData.userInfo)
        
        getApp().globalData.encryptedData = userRes.encryptedData;
        getApp().globalData.iv = userRes.iv; 
        wx.request({
          url: getApp().globalData.urlHead +'/cashier/merchants.php?m=Api&c=wxadoc&a=getPublic',
          data: {
            code: getApp().globalData.code,
            appid: getApp().globalData.appid,
            encryptedData: userRes.encryptedData,
            iv: userRes.iv,
            mid: getApp().globalData.extMid
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: 'POST',
          //服务端的回掉  
          success: function (result) {
            console.log(result)
            getApp().globalData.session_key = result.data.err_msg.session_key;
            that.addUser()
          }
        })  
      }
    })
  },
  
  addUser:function () {
      var that=this;
      wx.request({
        url: getApp().globalData.urlHead +'/cashier/merchants.php?m=Api&c=wxadoc&a=addUser',
        data: {
          code: getApp().globalData.code,
          appId: getApp().globalData.appid,
          encryptedData: getApp().globalData.encryptedData,
          iv: getApp().globalData.iv,
          session_key: getApp().globalData.session_key,
          mid: getApp().globalData.extMid
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
          getApp().globalData.phone = res.data.err_msg.phone;
          console.log(getApp().globalData)
          var pages = getCurrentPages();
          var load=false;
          if (pages[0].route == 'pages/index/index' || pages[0].route == 'pages/send/sendStatus' || pages[0].route == 'pages/entityCard/index' || pages[0].route == 'pages/cutPrice/index' || pages[0].route == 'pages/userCenter/useBalance' || pages[0].route == 'pages/userCenter/saveCard' || pages[0].route == 'pages/index/personMsg' || pages[0].route == 'pages/secondCard/index/index' || pages[0].route == 'pages/quickPay/index'){
            load=true;
          }
            if(res.data.err_dom){
                getApp().globalData.pigcms_id = res.data.err_dom.pigcms_id;
                getApp().globalData.isMember = true;
            }else{
                getApp().globalData.isMember = false;
            }
          if (that.userInfoReadyCallback && load) {
            that.userInfoReadyCallback()
          }
        }
      })
      
  },
    ajax:function(Type,params,url,successData,errorData){
        wx.showLoading({
            title: '加载中...',
        });
        var methonType='application/json';
        var https = "https://np.pigcms.com/cashier/merchants.php";
        var st = new Date().getTime();
        if(Type=='POST'){
            methonType='application/x-www-form-urlencoded';
        }
        wx.request({
            url:https+url,
            method:Type,
            data:params,
            header: {
                "Content-Type": methonType
            },
            success: (res) => {
            successData(res)
        },
            error(res) {
            errorData(res)
        }
    })
    },
  globalData: {//全局变量
    token:"",
    extMid:"",
    mid: "",
    unionid: "",
    encryptedData: "",
    iv: "",
    session_key: "",
    code: "",
    openid: '',
    orderid: '',
    allids: [],//选择的所有卡的id
    inputNum: 0,
    sumNum: 0,
    thankWord: '',
    sendData: {},
    userInfo: null,
    urlHead:'https://np.pigcms.com',
    appid:'',
    phone:'',
    latitude: 0,
    longitude: 0,
    is_store:1,
    noPersonMsg:false,
    authorize:true,
    cardpayid:'',
    presentId:'',
    gcid:'',
    openCardData:{},
      pigcms_id:'',
      https:'https://np.pigcms.com/cashier/pay/wxpay/index.php',//请求的域名
  },
})