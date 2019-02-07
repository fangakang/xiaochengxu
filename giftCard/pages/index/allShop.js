Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopList:[],
    latitude:0,
    longitude:0
  },
  openLocation:function(e){
    console.log(e)
    var that=this;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        console.log(res)
        wx.openLocation({
          latitude: parseFloat(e.currentTarget.dataset.latitude),
          longitude: parseFloat(e.currentTarget.dataset.longitude),
          scale: 28,
          name: e.currentTarget.dataset.name
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    });
    var that=this;
    that.setData({
      latitude: options.latitude,
      longitude: options.longitude
    })
    wx.request({
      url: getApp().globalData.urlHead +'/cashier/merchants.php?m=Api&c=wxadoc&a=getLocation',
      data: {
        mid: getApp().globalData.mid,
        openid: getApp().globalData.openid,
        unionid: getApp().globalData.unionid,
        appid: getApp().globalData.appid,
        latitude: options.latitude,
        longitude: options.longitude,
        getLocation: 'ok'
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        wx.hideLoading();
        console.log(res);
        that.merchantStore();
      }
    })
  },
  merchantStore:function(){
    wx.showLoading({
      title: '加载中',
    });
    var that=this;
    wx.request({
      url: getApp().globalData.urlHead +'/cashier/merchants.php?m=Api&c=wxadoc&a=merchantStore',
      data: {
        mid: getApp().globalData.mid,
        openid: getApp().globalData.openid,
        unionid: getApp().globalData.unionid,
        appid: getApp().globalData.appid,
        latitude: that.data.latitude,
        longitude: that.data.longitude,
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        wx.hideLoading();
        console.log(res);
        that.setData({
          shopList: res.data.err_msg.shoplist
        })
      }
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