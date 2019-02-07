//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    page:1,
    authorize: true,
    currentPage:1,
    shopList:[],
    loadComplete:false,
    loadAll:false,
    noData:false
  },
  scanCode:function(e){
    wx.scanCode({
      success(res) {
        var data = res.path.split('=');
        wx.navigateTo({
          url: 'pay?scene='+data[1],
        })
      }
    })
  },
  jupmPage:function(e){
    var that=this;
    wx.navigateTo({
      url: "pay?mid=" + e.currentTarget.dataset.id,
    })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  getUserHistory:function(){
    let that=this;
    let params={
      mid: app.globalData.mid,
      appid: app.globalData.appid,
      unionid: app.globalData.unionid,
      page:that.data.currentPage,
      openid:app.globalData.openid
    };
    app.ajax('POST', params,'/cashier/merchants.php?m=Api&c=wxadoc&a=getUserHistory',(res)=>{
      console.log(res);
      wx.hideLoading();
      wx.stopPullDownRefresh();
      if(res.data.err_code==0){
        let shopList = res.data.err_msg;
        if (that.data.currentPage == 1 && shopList.length==0){
          that.setData({
            noData:true
          })
        }else{
          that.setData({
            noData: false
          })
        }
        if(shopList.length<10){
          that.setData({
            loadAll:true
          })
        }else{
          that.setData({
            loadAll: false
          })
        }
        that.setData({
          shopList: that.data.shopList.concat(shopList),
          loadComplete:true,
        })
      }
    },(res)=>{

    })
  },
  onLoad: function () {
    let that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          that.setData({
            authorize: false
          })
          wx.hideLoading();
        } else {
          that.setData({
            authorize: true
          })
        }
      }
    });
    if (!app.globalData.initComplete) {
      app.userInfoReadyCallback = function () {
        that.getUserHistory();
      }
    } else {
      that.getUserHistory();
    }
  },
  onShow:function(){
    
    
  },
  onHide:function(){
    // let that=this;
    // that.setData({
    //   shopList:[],
    //   currentPage:1,
    //   loadAll:false,
    //   loadComplete:false
    // })
  },
  onUnload:function(){
    let that = this;
    that.setData({
      shopList:[],
      currentPage: 1,
      loadAll: false,
      loadComplete: false
    })
  },
  bindGetUserInfo: function (e) {
    console.log(e)
    var that = this;
    console.log(e.detail.errMsg)
    if (e.detail.errMsg == "getUserInfo:ok") {
      app.getInfo();
      that.setData({
        authorize: true
      });
    } else {
      wx.showToast({
        title: '授权失败',
        icon: 'none'
      })
    }
  },
  getUserInfo: function(e) {
    
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that=this;
    that.setData({
      currentPage:1,
      shopList:[],
      loadAll:false,
    });
    that.getUserHistory();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that=this;
    if(!that.data.loadAll){
      that.data.currentPage++;
      that.setData({
        currentPage: that.data.currentPage
      });
      that.getUserHistory();
    }
  }
})
