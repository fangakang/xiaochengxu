// pages/index/cardDetail.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    memberId:'',
    currentPage:1,
    memberInfo:{},
    orderData:[],
    loadAll:false,
    noData: false,
    loadComplete:false
  },
  getRechargeUserCardDetail:function(){
    let that=this;
    let params={
      memberId:that.data.memberId,
      page:that.data.currentPage,
      openid: app.globalData.openid
    };
    app.ajax('POST', params,'/cashier/merchants.php?m=Api&c=wxadoc&a=getRechargeUserCardDetail',(res)=>{
      wx.hideLoading();
      console.log(res)
      wx.stopPullDownRefresh();
      if(!res.data.err_code){
        var orderData = res.data.err_msg.orderData;
        if (that.data.currentPage == 1 && orderData.length == 0) {
          that.setData({
            noData: true
          })
        } else {
          that.setData({
            noData: false
          })
        }
        if (orderData.length<10){
          that.setData({
            loadAll:true
          })
        }
        that.setData({
          memberInfo:res.data.err_msg.memberInfo,
          orderData: that.data.orderData.concat(orderData),
          loadComplete:true
        })
      }
    },(res)=>{

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    that.setData({
      memberId: options.memberId
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
    let that=this;
    that.getRechargeUserCardDetail();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      orderData:[],
      loadAll:false
    })
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
    let that=this;
    that.setData({
      currentPage:1,
      orderData: [],
      loadAll: false
    });
    that.getRechargeUserCardDetail();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    if (that.data.loadAll) {
      return;
    };
    that.data.currentPage++;
    that.setData({
      currentPage: that.data.currentPage
    });
    that.getRechargeUserCardDetail();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})