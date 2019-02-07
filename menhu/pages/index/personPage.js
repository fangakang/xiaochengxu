// pages/index/personPage.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:3,
    willPay:0,
    willUse:0,
    userDetail:{},
    cardInfo:{}
  },
  privilege:function(){
    wx.redirectTo({
      url: 'privilege',
    })
  },
  toList:function(e){
    console.log(e);
    var type=e.currentTarget.dataset.type
    wx.navigateTo({
      url: 'orderList?type=' + type+'&page=1',
    })
  },
  userPerson:function(){
    var that=this;
    var params={
      agentid: app.globalData.extMid,
      openid: app.globalData.openid,
      unionid: app.globalData.unionid,
    }
    app.ajax('POST', params,'/cashier/merchants.php?m=Api&c=wxadoc&a=userPerson',(res)=>{
     console.log(res); 
     wx.hideLoading();
     if(res.data.err_code==0){
       that.setData({
         willPay: res.data.err_msg.willPay,
         willUse: res.data.err_msg.willUse,
         userDetail: res.data.err_msg.userDetail,
         cardInfo: res.data.err_msg.cardInfo
       })
     }
    },(res)=>{

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.setData({
      userInfo: app.globalData.userInfo
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
    var that=this;
    wx.setNavigationBarTitle({
      title: app.globalData.title,
    })
    that.userPerson()
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