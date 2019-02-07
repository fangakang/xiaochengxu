Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:'',
    smallflag:'',
    shareImg:'',
    gcid:'',
    count:0,
  },
  
  onShareAppMessage:function(e){
    console.log(getApp().globalData.allids)
    var that=this;
    var smallflag = that.data.smallflag;
    return{
      title:'送您一份心意',
      path: '/pages/send/sendStatus?smallflag=' + smallflag + '&mid=' + getApp().globalData.mid + '&openid=' + getApp().globalData.openid + '&unionid=' + getApp().globalData.unionid + '&appid=' + getApp().globalData.appid + '&allids=' + getApp().globalData.allids,
      imageUrl: that.data.shareImg,
      desc: '最具人气的小程序开发联盟!',
      success:function(res){
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
            appid: 'wxf3a9a02997b0c4b9',
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
      fail:function(res){
        console.log(res)
      }
    }
  },
  guanbi:function(){
    wx.navigateBack()
  },
  saveImg:function(){
    var that=this;
    wx.getSetting({
      success(res){
        if (!res.authSetting['scope.writePhotosAlbum']) {//对保存图片或视频授权
          console.log(res)
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              console.log('访问相册授权成功');
              that.downFile();
            },
            fail() {
              console.log('访问相册授权失败');
              wx.showToast({
                title: '访问相册授权失败',
                icon: 'none',
                duration: 2000
              })
            }
          })
        }else{
          that.downFile();
        }
      }
    })
  },
  downFile:function(){
    wx.downloadFile({
      url: this.data.imgUrl,
      success: function (res) {
        console.log(res);
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (res) {
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
  shareMsg:function(){
    var that=this;
    wx.request({
      url: getApp().globalData.urlHead +'/cashier/merchants.php?m=Api&c=wxadoc&a=gettest',
      data: {
        appid: getApp().globalData.appid,
        smallflag: that.data.smallflag,
        unionid: getApp().globalData.unionid,
        mid: getApp().globalData.mid,
        type: 6,
        isshare: 0,
        typeFlag:1,
        gcid: that.data.gcid,
        count: that.data.count
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        that.setData({
          shareImg: res.data.err_msg
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
    })
    console.log(options)
    var that=this;
    that.setData({
      smallflag:options.smallflag,
      gcid:options.gcid,
      count:options.count
    })
    wx.request({
      url: getApp().globalData.urlHead +'/cashier/merchants.php?m=Api&c=wxadoc&a=gettest',
      data:{
        appid: getApp().globalData.appid,
        smallflag:that.data.smallflag,
        unionid: getApp().globalData.unionid,
        mid: getApp().globalData.mid,
        type:6,
        isshare:1,
        typeFlag:1,
        gcid:that.data.gcid,
        count:that.data.count
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        wx.hideLoading();
        console.log(res)
        that.setData({
          imgUrl:res.data.err_msg
        })
      }

    })
    that.shareMsg()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    
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