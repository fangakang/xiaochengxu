// pages/index/moreShop.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0
  },
  phoneCall: function (e) {
    var that = this;
    console.log(e)
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone //仅为示例，并非真实的电话号码
    })
  },
  getLocation: function (e) {
    console.log(e)
    var that = this;
    if (!e.currentTarget.dataset.latitude) {
      wx.showModal({
        title: '提示',
        content: '暂无该门店位置信息',
        confirmText: "确认",
        showCancel: false,
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options);
    that.setData({
      id: options.id
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
    var that = this;
    wx.setNavigationBarTitle({
      title: app.globalData.title,
    })
    that.agentCouponDetail();
    console.log(app.globalData)
  },
  agentCouponDetail: function () {
    var that = this;
    var params = {
      agentid: app.globalData.extMid,
      openid: app.globalData.openid,
      unionid: app.globalData.unionid,
      id: that.data.id,
      latitude: app.globalData.latitude,
      longitude: app.globalData.longitude,
    };
    app.ajax('POST', params, '/cashier/merchants.php?m=Api&c=wxadoc&a=agentCouponDetail', (res) => {
      console.log(res)
      wx.hideLoading()
      if (res.data.err_code == 0) {
        that.setData({
          shoplist: res.data.err_msg.shoplist,        
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