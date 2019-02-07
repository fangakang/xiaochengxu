// pages/index/consumeDetail.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentPage:1,
    noData:false,
    orderData:[],
    loadAll:false,
    from:0,
    mid:'',
    loadComplete:false
  },
  getRechargeUserOrder:function(){
    let that=this;
    let params={
      page:that.data.currentPage,
      mid: app.globalData.mid,
      appid: app.globalData.appid,
      unionid: app.globalData.unionid,
      openid: app.globalData.openid
    }
    app.ajax('POST', params, '/cashier/merchants.php?m=Api&c=wxadoc&a=getRechargeUserOrder',(res)=>{
      wx.hideLoading();
      if(!res.data.err_code){
        console.log(res)
        let orderData = res.data.err_msg.orderData;
        if (orderData.length<10){
          that.setData({
            loadAll:true
          })
        }else{
          that.setData({
            loadAll: false
          })
        };
        if (that.data.currentPage == 1 && orderData.length==0){
          that.setData({
            noData:true,
            loadAll:false
          })
        }else{
          that.setData({
            noData: false
          })
        }
        that.setData({
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
    console.log(1111111111111111111)
    if(options.from){
      that.setData({
        from:options.from,
        mid:options.mid
      })
    };
    that.setData({
      orderData: []
    })
    that.getRechargeUserOrder();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
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
    // let that=this;
    // that.setData({
    //   currentPage:1,
    //   orderData:[],
    //   loadAll: false,
    // })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let that=this;
    that.setData({
      currentPage: 1,
      orderData: [],
      loadAll: false,
    })
    if(that.data.from){
      wx.navigateTo({
        url: 'pay?init=1&mid='+that.data.mid,
      })
    }
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
    let that = this;
    if (!that.data.loadAll && that.data.loadComplete) {
      that.data.currentPage++;
      that.setData({
        currentPage: that.data.currentPage
      });
      that.getRechargeUserOrder();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})