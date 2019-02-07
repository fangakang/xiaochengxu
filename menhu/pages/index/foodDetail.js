var app=getApp();
var timeReset=require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots:true,
    autoplay:true,
    interval:3000,
    duration:500,
    maskShow:false,
    id:'',
    formId:'',
    allData:{},
    content:'',
    merchantInfo:{},
    shoplist:[],
    phone:'',
    collection:false,
    beiginTime:'',
    endTime:'',
    imgalist:[],
    hadPhone:false,
    shopShow:[],
    authorize: true,
    loadComplete:false,
    cardInfo:{},
    memberDetail:{},
    service_tel:'',
    minitype:1,
    sbak:0
  },
  quickOpen:function(){
    wx.redirectTo({
      url: 'privilege',
    })
  },
  bindGetUserInfo: function (e) {
    console.log(e)
    var that = this;
    console.log(e.detail.errMsg)
    if (e.detail.errMsg == "getUserInfo:ok") {
      app.getInfo();
      that.setData({
        authorize: true
      })
    }else{
      wx.showToast({
        title: '授权失败',
        icon:'none'
      })
    }
  },
  getSetting: function () {
    var that=this;
    wx.getSetting({
      success: res => {
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
                  that.agentCouponDetail();
                }
              })

            },
            fail() {
              wx.showToast({
                title: '获取地理位置授权失败',
                icon: 'none'
              })
            }
          })
        } else {
          wx.getLocation({
            type: 'wgs84',
            success: function (res) {
              getApp().globalData.latitude = res.latitude;
              getApp().globalData.longitude = res.longitude;
              console.log(res)
              that.agentCouponDetail();
            }
          })
        }
      }
    })
  },
  viewMore:function(e){
    var that=this;
    wx.navigateTo({
      url: 'moreShop?id='+that.data.id,
    })
  },
  getPhoneNumber: function (e) {
    var that=this;
    console.log(e)
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      wx.checkSession({
        success: function () {
          //session 未过期，并且在本生命周期一直有效
        },
        fail() {
          wx.login();//重新登录
        }
      });
    }
    that.getUserPhone(e);
  },
  getUserPhone:function(e){
    var that=this;
    var params={
      agentid: app.globalData.extMid,
      openid: app.globalData.openid,
      unionid: app.globalData.unionid,
      appid: app.globalData.appid,
      encryptedData: e.detail.encryptedData,
      session_key: app.globalData.session_key,
      iv: e.detail.iv
    }
    app.ajax('POST',params,'/cashier/merchants.php?m=Api&c=wxadoc&a=getUserPhone',(res)=>{
      wx.hideLoading();
      if(res.data.err_code!=0){
        wx.showToast({
          title: '手机号获取失败',
        })
      }else{
        that.setData({
          phone: res.data.err_dom,
          hadPhone: true,
        });
        app.globalData.phone = res.data.err_dom;
        console.log(app.globalData)
        wx.navigateTo({
          url: 'buyPage?id=' + that.data.allData.id,
        })
      }
        
    },(res)=>{

    })
  },
  getLocation:function(e){
    console.log(e)
    var that=this;
    if (!e.currentTarget.dataset.latitude){
      wx.showModal({
        title:'提示',
        content: '暂无该门店位置信息',
        confirmText: "确认",
        showCancel:false,
        success: function (res) {
          console.log(res);
          //点击“确认”时打开设置页面
          if (res.confirm) {
          } else {
            
          }
        }
      });
      return;
    }
    wx.openLocation({
      latitude: parseFloat(e.currentTarget.dataset.latitude),
      longitude: parseFloat(e.currentTarget.dataset.longitude),
      scale: 28
    })
  },
  collect:function(){
    var that=this;
    var params = {
      agentid: app.globalData.extMid,
      openid: app.globalData.openid,
      unionid: app.globalData.unionid,
      id: that.data.id,
      latitude: app.globalData.latitude,
      longitude: getApp().globalData.longitude,
    };
    app.ajax('POST', params,'/cashier/merchants.php?m=Api&c=wxadoc&a=toCollection',(res)=>{
      console.log(res)
      wx.hideLoading();
      if(res.data.err_code==0){
        that.setData({
          collection: !that.data.collection
        });
        if (that.data.collection){
          wx.showToast({
            title: '收藏成功',
            icon: 'none'
          })
        }else{
          wx.showToast({
            title: '取消收藏',
            icon: 'none'
          })
        }
        
      }else{
        wx.showToast({
          title: res.data.err_msg,
          icon:'none'
        })
      }
    },(res)=>{

    })
  },
  share:function(){
    var that=this;
    that.setData({
      maskShow:true,
    })
  },
  saveImg: function () {
    var that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {//对保存图片或视频授权
          console.log(res)
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              console.log('访问相册授权成功');
              that.downFile();
            },
            fail() {
              console.log('访问相册授权失败');
              wx.showToast({
                title: '访问相册授权失败',
                icon: 'none',
                duration: 2000
              })
            }
          })
        } else {
          that.downFile();
        }
      }
    })
  },
  downFile:function(){
    var that=this;
    var params={
      agentid: app.globalData.extMid,
      openid: app.globalData.openid,
      unionid: app.globalData.unionid,
      id: that.data.id,
    };
    app.ajax('POST', params,'/cashier/merchants.php?m=Api&c=wxadoc&a=sharePicture',(res)=>{
        wx.hideLoading()
        console.log(res)
        if(res.data.err_code==0){
          var img=res.data.err_msg;
          that.data.imgalist[0] = img
          that.setData({
            imgalist: that.data.imgalist
          })
          wx.previewImage({
            current: img, // 当前显示图片的http链接
            urls: that.data.imgalist // 需要预览的图片http链接列表
          })
        }else{
          wx.showToast({
            title: res.data.err_msg,
            icon:'none'
          })
        }
    },(res)=>{

    })
  },
  closeMask: function () {
    var that = this;
    that.setData({
      maskShow: false,
    })
  },
  toIndex:function(){
    if(this.data.sbak==1){
      wx.reLaunch({
        url: 'index',
      })
    }else{
      wx.navigateBack({
        delta:1
      })
    }
    
  },
  buy:function(){
    var that=this;
    wx.navigateTo({
      url: 'buyPage?id=' + that.data.allData.id 
    })
  },
  shopCall:function(e){
    let that=this;
    if (e.currentTarget.dataset.phone){
      wx.makePhoneCall({
        phoneNumber: e.currentTarget.dataset.phone
      })
    }else{
      wx.makePhoneCall({
        phoneNumber: that.data.service_tel
      })
    }
    
  },
  phoneCall:function(e){
    var that=this;
    console.log(e)
    wx.makePhoneCall({
      phoneNumber: that.data.service_tel
    })
  },
  agentCouponDetail:function(){
    var that = this;
    var params = {
      agentid: app.globalData.extMid,
      openid: app.globalData.openid,
      unionid: app.globalData.unionid,
      id: that.data.id,
      formId:that.data.formId,
      minitype:that.data.minitype,
      latitude: app.globalData.latitude,
      longitude: app.globalData.longitude,
    };
    app.ajax('POST', params, '/cashier/merchants.php?m=Api&c=wxadoc&a=agentCouponDetail', (res) => {
      console.log(res)
      wx.hideLoading()
      if (res.data.err_code == 0) {
        if (res.data.err_msg.allData.issale==2){
            wx.showToast({
              title: '该优惠活动已下架',
              icon: 'none'
            })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          },1000)
          return;
        }
        var article = res.data.err_msg.allData.imageDetail;
        WxParse.wxParse('article', 'html', article, that, 0);
        var begintime = timeReset.formatTime(parseInt(res.data.err_msg.merchantInfo.begintime), 'Y-M-D h:m:s'),//时间戳转化为时间
          endtime = timeReset.formatTime(parseInt(res.data.err_msg.merchantInfo.endtime), 'Y-M-D h:m:s');
        var allData = res.data.err_msg.allData;
        allData.memberprice = parseFloat(allData.memberprice);
        allData.saleprice = parseFloat(allData.saleprice);
        allData.reduceMoney = (allData.saleprice-allData.memberprice).toFixed(2);
          that.setData({
            allData:allData,
            merchantInfo: res.data.err_msg.merchantInfo,
            shoplist: res.data.err_msg.shoplist,
            collection: res.data.err_msg.collection,
            cardInfo: res.data.err_msg.cardInfo,
            service_tel: res.data.err_msg.service_tel,
            memberDetail: res.data.err_msg.memberDetail,
            shopShow: res.data.err_msg.shoplist.slice(0,3),
            loadComplete:true
          })
          wx.setNavigationBarTitle({
            title: res.data.err_msg.allData.themename,
          })
        console.log(that.data.shopShow);
      } else {
        wx.showModal({
          title: '提示',
          content: res.data.err_msg,
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        })
      }
    }, (res) => {

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    console.log(options);
    var scene = decodeURIComponent(options.scene);
    console.log(scene)
    if(options.sbak){//判断是否是模板消息进入
      that.setData({
        sbak:options.sbak
      })
    }else{
      that.setData({
        sbak: 0
      })
    }
    if (scene!='undefined'){
      var tem = scene.split('=');
      that.setData({
        id:tem[1],
        sbak: 1
      })
    }else{
      that.setData({
        id: options.id,
        formId:options.formId,
      }) 
    };
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          that.setData({
            authorize: false
          })
          wx.hideLoading();
        } else {
          that.setData({
            authorize: true
          })
        }
      }
    });
    if(app.globalData.mid==''){
      app.userInfoReadyCallback=function(){
        that.agentCouponDetail()
      }
    }else{
      that.agentCouponDetail()
    }
    if (app.globalData.phone) {
      that.setData({
        phone: app.globalData.phone,
        hadPhone: true,
      })
    } else {
      that.setData({
        phone: '',
        hadPhone: false,
      })
    } 
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
    var that=this;
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
  onShareAppMessage: function (res) {
    var that=this;
    if (res.from === 'button') {
    }
    return {
      title: that.data.allData.themename,
      path: '/pages/index/index',
      imageUrl:that.data.allData.imageArr[0]
    }
  }
})