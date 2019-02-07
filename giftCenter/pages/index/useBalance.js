import drawQrcode from '../../utils/weapp.qrcode.min.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    number: 0,
    balance:0,
    gcid:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    var that=this;
    this.setData({
      balance:options.balance,
      gcid:options.gcid
    })
    setInterval(that.updateCode, 30000);
    that.updateCode();
  },
  updateCode:function(){
    var that=this;
    wx.request({
      url: 'https://np.pigcms.com/cashier/merchants.php?m=Api&c=wxadoc&a=getAllCode',
      data: {
        mid: getApp().globalData.mid,
        openid: getApp().globalData.openid,
        unionid: getApp().globalData.unionid,
        appid: 'wxf3a9a02997b0c4b9',
        gcid:that.data.gcid
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        wx.hideLoading();
        var str = res.data.err_msg.replace(/\s/g, '').replace(/(.{4})/g, "$1 ")
        that.setData({
          number: str
        })
        drawQrcode({
          width: 200,
          height: 200,
          canvasId: 'myQrcode',
          text: that.data.number
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
    
  }
})