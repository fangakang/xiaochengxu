Page({

  /**
   * 页面的初始数据
   */
  data: {
    smallflag: '',
    shareImg: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      smallflag:options.smallflag
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
  onShareAppMessage: function (e) {
    var that = this;
    return {
      title: '送您一份心意',
      path: '/pages/send/sendStatus?smallflag=' + that.data.smallflag + '&mid=' + getApp().globalData.mid + '&openid=' + getApp().globalData.openid + '&unionid=' + getApp().globalData.unionid + '&appid="wxf3a9a02997b0c4b9"',
      imageUrl: that.data.shareImg,
      desc: '最具人气的小程序开发联盟!',
      success: function (res) {
        wx.showLoading({
          title: '加载中',
        })
        wx.request({
          url: getApp().globalData.urlHead +'/cashier/merchants.php?m=Api&c=wxadoc&a=giveCallback',
          data: {
            smallflag: that.data.smallflag,
            allids: getApp().globalData.allids,
            sumNum: getApp().globalData.sumNum,
            inputNum: getApp().globalData.inputNum,
            thankWord: getApp().globalData.thankWord,
            mid: getApp().globalData.mid,
            openid: getApp().globalData.openid,
            unionid: getApp().globalData.unionid,
            appid: getApp().globalData.appid,
          },
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            wx.hideLoading();
            wx.navigateTo({
              url: 'sendSuccess?image=' + that.data.shareImg + '&smallflag=' + that.data.smallflag,
            })
            console.log(res);
          },
          fail: function (res) {
            console.log(res);
          }
        })
      },
      fail: function (res) {
        console.log(res)
      }
    }
  },
  toIndex:function(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  }
})