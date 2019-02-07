import drawQrcode from '../../utils/weapp.qrcode.min.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    number: 0,
    balance:'--',
    gcid:0,
    time:30,
    useFlag:false,
    noCode:false,
    authorize: true,
    loadComplete:false,
  },
  detail:function(){
    wx.navigateTo({
      url: "balanceDetail?tempnum=0",
    })
  },
  backToBuy:function(){
    wx.switchTab({
      url: '/pages/index/index',
    }) 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function(options){
    var that=this;
    console.log(options)
    if (options.gcid) {
      that.setData({
        gcid: options.gcid
      })
    }
  },
  onShow: function (options) {
    
    var that = this;
    wx.showLoading({
      title: '加载中...',
    });
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          that.setData({
            authorize: false
          });
          wx.hideLoading();
          return false;
        } else {
          that.setData({
            authorize: true
          })
          if (getApp().globalData.mid == '') {
            getApp().userInfoReadyCallback = function () {
              that.getAllCode();
            }
          }
          else {
            that.getAllCode();
          }
          
          if (!that.data.noCode) {
            that.data.interval = setInterval(function () {
              that.data.time--;
              if (that.data.time == 0) {
                that.getAllCode()
                that.data.time = 30
              }
              that.setData({
                time: that.data.time
              });
            }, 1000)
          }
        }
      }
    });
  },
  countDown:function(){
    var that=this;
    that.data.time--;
    if(that.data.time==0){
      that.getAllCode()
      that.data.time=30
    }
    that.setData({
      time:that.data.time
    });
   var countDown= setTimeout(function(){                                                                                                              
      that.countDown();
      clearTimeout(countDown);
      countDown=null;
    },1000)
    
  },
  getAllCode:function(){
    wx.showLoading({
      title: '加载中...',
    })
    var that=this;
    wx.request({
      url: getApp().globalData.urlHead +'/cashier/merchants.php?m=Api&c=wxadoc&a=getAllCode',
      data: {
        mid: getApp().globalData.mid,
        openid: getApp().globalData.openid,
        unionid: getApp().globalData.unionid,
        appid: getApp().globalData.appid,
        gcid: that.data.gcid,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        // wx.setNavigationBarTitle({
        //   title: res.data.err_title
        // });
        console.log(res)
        wx.hideLoading();
        if (res.data.err_code == 1 || res.data.err_code == 2){
          that.setData({
            loadComplete: true,
            noCode:true
          })
        }else{
          var str = res.data.err_msg.replace(/\s/g, '').replace(/(.{4})/g, "$1 ")
          that.setData({
            number: str,
            time: 30,
            balance: res.data.err_dom,
            loadComplete:true,
          })
          drawQrcode({
            width: 200,
            height: 200,
            canvasId: 'myQrcode',
            text: that.data.number
          });
        }
       // that.data.interval;
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


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.interval);
    this.setData({
      time: 30,
      balance:'--',
      //loadComplete:false
    })
  }, 

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.interval);
    this.setData({
      time: 30,
      balance: '--',
      //loadComplete:false
    })
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