Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: '',
    shareImg:'',
    shareTitle:'',
    smallflag:''
  },
  saveImg:function(){
    var that=this;
    wx.downloadFile({
      url: that.data.imgUrl,  
      success:function(res){
        console.log(res);
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success:function(res){
            console.log(res);
          },
          fail: function (res) {
            console.log(res)
            console.log('fail')
          }  
        })
      },
      fail: function () {
        console.log('fail')
      }  
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      smallflag: options.smallflag
    })
    wx.showLoading({
      title: '加载中',
    })
      wx.request({
        url: 'https://np.pigcms.com/cashier/merchants.php?m=Api&c=wxadoc&a=creatActImg',
        data: {
          mid: getApp().globalData.mid,
          openid: getApp().globalData.openid,
          unionid: getApp().globalData.unionid,
          appid: getApp().globalData.appid,
          actType: 4,
          gid: options.smallflag,
          type: 1
        },
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          wx.hideLoading()
          console.log(res)
          that.setData({
            imgUrl: res.data.data.path
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
    this.share()
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
  share:function(){
    wx.showLoading({
      title: '加载中',
    })
    var that=this;
    wx.request({
      url: 'https://np.pigcms.com/cashier/merchants.php?m=Api&c=wxadoc&a=creatActImg',
      data: {
        mid: getApp().globalData.mid,
        openid: getApp().globalData.openid,
        unionid: getApp().globalData.unionid,
        appid: getApp().globalData.appid,
        actType: 2,
        type: 1
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        wx.hideLoading()
        console.log(res)
        that.setData({
          shareImg:res.data.data.path,
          shareTitle:res.data.data.title
        })
      }
    })
  },
  onShareAppMessage: function (e) {
    var that = this;
    console.log(123)
    return {
      title: that.data.shareTitle,
      path: '/pages/index/index?mid=' + getApp().globalData.mid + '&unionid=' + getApp().globalData.unionid,
      imageUrl: that.data.shareImg,
      desc: '最具人气的小程序开发联盟!',
      success: function (res) {
        wx.navigateTo({
          url: 'index',
        })
      },
      fail: function (res) {
        console.log(res)
      }
    }
  },
})