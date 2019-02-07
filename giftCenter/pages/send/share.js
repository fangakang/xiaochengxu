Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:'',
    smallflag:''
  },
  
  onShareAppMessage:function(e){
    var that=this;
    var date = new Date();
    var year = date.getFullYear(),
      month = date.getMonth() + 1,
      strDate = date.getDate(),
      hour = date.getHours(),
      minute = date.getMinutes(),
      second = date.getSeconds();
    if (month < 10) {
      month = "0" + month;
    }
    if (strDate < 10) {
      strDate = "0" + strDate;
    }
    if (hour < 10) {
      hour = '0' + hour
    }
    if (minute < 10) {
      minute = '0' + minute
    }
    if (second < 10) {
      second = '0' + second
    }
    var currentdate = year + '' + month + '' + strDate + '' + hour + '' + minute + '' + second;
    var random = Math.floor(Math.random() * 900000) + 100000;
    var smallflag=currentdate + random;
    this.setData({
      smallflag: smallflag
    })
    return{
      title:'送您一份心意',
      path: '/pages/send/sendStatus?smallflag=' + smallflag + '&mid=' + getApp().globalData.mid + '&openid=' + getApp().globalData.openid + '&unionid=' + getApp().globalData.unionid + '&appid="wxf3a9a02997b0c4b9"',
      imageUrl:this.data.imgUrl,
      desc: '最具人气的小程序开发联盟!',
      success:function(res){
        wx.showLoading({
          title: '加载中',
        })
        wx.request({
          url: 'https://np.pigcms.com/cashier/merchants.php?m=Api&c=wxadoc&a=giveCallback',
          data: {
            smallflag: that.data.smallflag,
            allids: getApp().globalData.allids,
            sumNum: getApp().globalData.sumNum,
            inputNum: getApp().globalData.inputNum,
            thankWord: getApp().globalData.thankWord,
            mid: getApp().globalData.mid,
            openid: getApp().globalData.openid,
            unionid: getApp().globalData.unionid,
            appid: 'wxf3a9a02997b0c4b9',
          },
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            wx.hideLoading();
            wx.navigateTo({
              url: 'sendSuccess?image=' + that.data.imgUrl + '&smallflag=' + that.data.smallflag,
            })
            console.log(res);
          },
          fail: function (res) {
            console.log(res);
          }
        })
      },
      fail:function(res){
        console.log(res)
      }
    }
  },
  guanbi:function(){
    wx.navigateBack()
  },
  saveImg:function(){
    wx.downloadFile({
      url: this.data.imgUrl,  
      success:function(res){
        console.log(res);
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success:function(res){
            wx.showToast({
              title: '图片已保存到相册，可以分享到朋友圈了呦~',
              icon: 'none',
              duration: 2000
            })
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
    this.setData({
      imgUrl:options.src
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
})