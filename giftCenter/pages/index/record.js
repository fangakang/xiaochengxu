Page({

  /**
   * 页面的初始数据
   */
  data: {
    allCard:[],
    viewFail:false,
    available:0,
    notAvailable:0
  },
  // showDetail:function(e){
  //   var target=e.currentTarget.dataset.id
  //   for (var i = 0; i < this.data.recordList.length;i++){
  //     if(target==i){
  //       if (this.data.recordList[i].detailFlag == false){
  //         this.data.recordList[i].detailFlag=true;
  //       }else{
  //         this.data.recordList[i].detailFlag = false;
  //       }
  //     }    
  //   }
  //   this.setData({
  //     recordList: this.data.recordList
  //   })
  // },
  viewFail:function(e){//查看失效
    this.setData({
      viewFail:true
    })
  },
  viewUse: function (e) {//查看可用
    this.setData({
      viewFail: false
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
    wx.showLoading({
      title: '加载中',
    })
    var that=this;
    setTimeout(function(){
      that.myCardPackage();
    },3000)
  },
  myCardPackage:function(){
    var that=this;
    wx.request({
      url: 'https://np.pigcms.com/cashier/merchants.php?m=Api&c=wxadoc&a=myCardPackage',
      data: {
        mid: 2155,
        openid: getApp().globalData.openid,
        unionid: getApp().globalData.unionid,
        appid: 'wxf3a9a02997b0c4b9',
        latitude: getApp().globalData.latitude,
        longitude: getApp().globalData.longitude
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        wx.hideLoading();
        console.log(res);
        var allCard = res.data.err_msg.allCard;
        for(var i=0;i<allCard.length;i++){
          if(allCard[i].price<=0){
            that.data.notAvailable++
          }else{
            that.data.available++
          }
        }
        that.setData({
          allCard: allCard,
          available: that.data.available,
          notAvailable: that.data.notAvailable
        })
      }
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