Page({

  /**
   * 页面的初始数据
   */
  data: {
      cardDetail:[]
  },
  toList: function () {
    wx.navigateTo({
      url: 'list',
    })
  },
  recharge: function () {
    wx.showModal({
      title: '提示',
      content: '充值到账户后，将无法再转赠给他人，确定充值吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  send: function () {
      wx.showLoading({
        title: '加载中',
      })
      var that=this;
      var ids = [];
      ids.push(that.data.cardDetail[0].id)
      console.log(ids);
      getApp().globalData.allids = ids;
      wx.request({
        url: 'https://np.pigcms.com/cashier/merchants.php?m=Api&c=wxadoc&a=send_gift',
        data: {
          mid: getApp().globalData.mid,
          openid: getApp().globalData.openid,
          unionid: getApp().globalData.unionid,
          appid: 'wxf3a9a02997b0c4b9',
          ids: ids
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        success: function (res) {
          wx.hideLoading();
          getApp().globalData.sendData = res.data.err_msg
          console.log(res)
          wx.navigateTo({
            url: '../send/sendGift',
          })
        },
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://np.pigcms.com/cashier/merchants.php?m=Api&c=wxadoc&a=gift_index',
      data: {
        mid: getApp().globalData.mid,
        openid: getApp().globalData.openid,
        unionid: getApp().globalData.unionid,
        appid: 'wxf3a9a02997b0c4b9',
        cardpayid: options.cardpayid,
        presentId: options.presentId
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        wx.hideLoading();
        console.log(res);
        var key;
        var cardDetail=[];
        for (var key in res.data.err_msg.cardDetail){
          cardDetail.push(res.data.err_msg.cardDetail[key])
        }
        that.setData({
          cardDetail: cardDetail
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