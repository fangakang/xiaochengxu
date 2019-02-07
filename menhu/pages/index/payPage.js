// pages/index/payPage.js
var app=getApp();
var timeReset = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    orderDetail: {},
    quan:{},
    add_time:'',
    num:0,
    desc:''
  },
  descInput:function(e){
    var that=this;
    that.setData({
      desc: e.detail.value
    })
  },
  agentPayCard:function(e){
    var that=this;
    console.log(e);
    var params={};
    if (that.data.orderDetail.goods_price==0){
      params = {
        agentid: app.globalData.extMid,
        appid: app.globalData.appid,
        id: that.data.orderDetail.id,
        coupon_id: that.data.quan.id,
        desc: that.data.desc,
        formId: e.detail.formId
      }
    }else{
      params = {
        agentid: app.globalData.extMid,
        appid: app.globalData.appid,
        id: that.data.orderDetail.id,
        coupon_id: that.data.quan.id,
        desc: that.data.desc,
      }
    }
    app.ajax('POST',params,'/cashier/merchants.php?m=Api&c=wxadoc&a=agentPayCard',(res)=>{
      console.log(res)
      wx.hideLoading();
      if(res.data.err_code==0){
        wx.requestPayment({
          'timeStamp': res.data.err_msg.timeStamp,
          'nonceStr': res.data.err_msg.nonceStr,
          'package': res.data.err_msg.package,
          'signType': res.data.err_msg.signType,
          'paySign': res.data.err_msg.paySign,
          'success': function (res) {
            wx.navigateTo({
              url: 'orderList?type=2&page=2',
            })
          },
          'fail': function (res) {
          }
        })
      } else if (res.data.err_code == 200){
        wx.showToast({
          title: '支付成功',
        })
        wx.navigateTo({
          url: 'orderList?type=2&page=2',
        })
      }else{
        wx.showToast({
          title: res.data.err_msg,
          icon:'none'
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.setData({
      id: options.id,
      num: options.num
    });
    
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
    var that = this;
    wx.setNavigationBarTitle({
      title: app.globalData.title,
    })
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    console.log(currentPage)
    var params = {
      id: that.data.id
    };
    app.ajax('POST', params, '/cashier/merchants.php?m=Api&c=wxadoc&a=agOrderDetail', (res) => {
      console.log(res)
      wx.hideLoading();
      if (res.data.err_code == 0) {
        var add_time = timeReset.formatTime(parseInt(res.data.err_msg.orderDetail.add_time), 'Y-M-D h:m:s')
        that.setData({
          orderDetail: res.data.err_msg.orderDetail,
          quan: res.data.err_msg.quan,
          add_time: add_time,
        })
      }
    }, (res) => {

    })  
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
    wx.navigateBack({
      delta:1
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