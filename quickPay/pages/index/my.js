// pages/index/my.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:2,
    userInfo:{},
    avatarurl:''
  },
  getRechargeUserInfo:function(){
    let that=this;
    let params={
      openid:app.globalData.openid,
      unionid:app.globalData.unionid,
      appid: app.globalData.appid,
      nickname:app.globalData.nickname,
      phone:app.globalData.phone
    };
    app.ajax('POST', params,'/cashier/merchants.php?m=Api&c=wxadoc&a=getRechargeUserInfo',(res)=>{
      console.log(res);
      wx.hideLoading();
      if(!res.data.err_code){
        that.setData({
          userInfo:res.data.err_msg
        })
      }else{
        wx.showToast({
          title: res.data.errMsg,
        })
      }
    },(res)=>{

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    let that=this;
    that.getRechargeUserInfo();
    that.setData({
      avatarurl: app.globalData.avatarurl
    })
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