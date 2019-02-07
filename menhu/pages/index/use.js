// pages/index/use.js
import drawQrcode from '../../utils/weapp.qrcode.min.js';
var timeReset = require('../../utils/util.js');
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    authorize: true,
    cousuemeid:'',
    couponMsg:{},
    paytime:'',
    timeFlag:true,
    cendtime:'',
    fromPage:0,//1表示从模板消息今入
    useOver:false
  },
  bindGetUserInfo: function (e) {
    console.log(e)
    var that = this;
    console.log(e.detail.errMsg)
    if (e.detail.errMsg == "getUserInfo:ok") {
      app.getInfo();
      that.setData({
        authorize: true
      });
    } else {
      wx.showToast({
        title: '授权失败',
        icon: 'none'
      })
    }
  },
  back:function(){
    if(this.data.fromPage==1){
      wx.reLaunch({
        url: 'index',
      })
    }else{
      wx.navigateBack({
        delta: 1
      })
    }
  },
  comsumePage:function(){
    var that=this;
    var params={
      agentid: app.globalData.extMid,
      openid: app.globalData.openid,
      unionid: app.globalData.unionid,
      id: that.data.cousuemeid,
    }
    wx.request({
      url: app.globalData.httpHead +'/cashier/merchants.php?m=Api&c=wxadoc&a=comsumePage',
      data: params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        wx.hideLoading();
        if (res.data.err_code == 0) {
          var paytime = timeReset.formatTime(parseInt(res.data.err_msg[0].paytime), 'Y-M-D h:m:s');
          var cendtime = timeReset.formatTime(parseInt(res.data.err_msg[0].cendtime), 'Y-M-D h:m:s');
          that.setData({
            couponMsg: res.data.err_msg,
            paytime: paytime,
            cendtime: cendtime
          })
          var orderid = res.data.err_msg[0].card_no_url;
          drawQrcode({
            width: 150,
            height: 150,
            canvasId: 'myQrcode',
            correctLevel:1,
            text: orderid
          });
        }
        if (that.data.timeFlag==true){
          setTimeout(function(){
            that.comsumePage();
          },1000)
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    console.log(options)
    that.setData({
      cousuemeid: options.cousuemeid
    })
    if(options.sbak){//从模板消息进入
      that.setData({
        fromPage:1
      })
    }
    if(options.useOver){
      that.setData({
        useOver:true
      })
    }else{
      that.setData({
        useOver: false
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
    wx.setNavigationBarTitle({
      title: '核销',
    })
    wx.showLoading({
      title: '加载中...',
    })
    that.setData({
      timeFlag: true
    })
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
    if (app.globalData.mid == '') {
      app.userInfoReadyCallback = function () {
        that.comsumePage();
      }
    }else{
      that.comsumePage();
    }
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      timeFlag:false
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      timeFlag: false
    })
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