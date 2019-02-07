Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    orderDetail:{},
  },
  orderDetail: function () {
    var that=this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://np.pigcms.com/cashier/merchants.php?m=Api&c=wxadoc&a=orderDetail',
      data: {
        mid: 2155,
        openid: getApp().globalData.openid,
        unionid: getApp().globalData.unionid,
        appid: 'wxf3a9a02997b0c4b9',
        id: that.data.id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        wx.hideLoading();
        console.log(res)
        that.setData({
          orderDetail:res.data.err_msg.orderDetail
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    console.log(options.id)
    that.setData({
      id:options.id
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