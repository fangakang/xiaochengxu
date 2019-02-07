// pages/index/cardList.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadAll:false,
    currentPage:1,
    cardList:[],
    noData:false
  },
  toDetail:function(e){
    var that=this;
    console.log(e)
    wx.navigateTo({
      url: 'cardDetail?memberId='+e.currentTarget.dataset.id,
    })
  },
  getRechargeUserCard:function(){
    let that=this;
    let params={
      phone:app.globalData.phone,
      page:that.data.currentPage,
      openid: app.globalData.openid
    };
    app.ajax('POST',params,'/cashier/merchants.php?m=Api&c=wxadoc&a=getRechargeUserCard',(res)=>{
        wx.hideLoading();
        console.log(res);
        wx.stopPullDownRefresh();
        if(!res.data.err_code){
          let cardList=res.data.err_msg;
          if (that.data.currentPage == 1 && cardList.length == 0) {
            that.setData({
              noData: true
            })
          } else {
            that.setData({
              noData: false
            })
          }
          that.setData({
            cardList: that.data.cardList.concat(cardList),
            loadAll: true
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
    that.getRechargeUserCard();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      cardList: [],
      loadAll: false,
      currentPage: 1
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      cardList: [],
      loadAll: false,
      currentPage: 1
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that=this;
    that.setData({
      loadAll:false,
      currentPage:1,
      cardList:[]
    });
    that.getRechargeUserCard();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that=this;
    // if(that.data.loadAll){
    //   return;
    // };
    // that.data.currentPage++;
    // that.setData({
    //   currentPage: that.data.currentPage
    // });
    // that.getRechargeUserCard();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})