var time = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadComplete:false,
    loadAll:false,
    id:'',
    orderDetail:{},
    order_no:'',
    cardpayid:''
  },
  orderDetail: function () {
    var that=this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: getApp().globalData.urlHead +'/cashier/merchants.php?m=Api&c=wxadoc&a=orderDetail',
      data: {
        mid: getApp().globalData.mid,
        openid: getApp().globalData.openid,
        unionid: getApp().globalData.unionid,
        appid: getApp().globalData.appid,
        id: that.data.order_no,
        is_store:1,
        cardpayid: that.cardpayid
        
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        wx.hideLoading();
        console.log(res)
        var orderDetail = res.data.err_msg.orderDetail;
        orderDetail.paytime = time.formatTime(parseInt(orderDetail.paytime), 'Y-M-D h:m:s')
        that.setData({
          orderDetail: orderDetail,
          loadAll:true,
          loadComplete:true
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    console.log(options.cardpayid)
    that.setData({
      order_no: options.order_no,
      cardpayid: options.cardpayid
    })
    that.orderDetail()
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
    
  }
})