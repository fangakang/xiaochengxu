Page({

  /**
   * 页面的初始数据
   */
  data: {
    navList: [
      { name: '全部', active: true, status: 0 },
      { name: '拼团', active: false, status: 1 },
      { name: '砍价', active: false, status: 2 },
      { name: '秒杀', active: false, status: 3 },
    ],
    orderList: []
  },
  select: function (e) {
    var target = e.currentTarget.dataset.id;
    for (var i = 0; i < this.data.navList.length; i++) {
      if (i == target) {
        this.data.navList[i].active = true;
      } else {
        this.data.navList[i].active = false;
      }
    };
    var showTarget = e.currentTarget.dataset.status;
    for (var i = 0; i < this.data.orderList.length; i++) {
      if (showTarget == 0) {//全部显示
        this.data.orderList[i].show = true;
      } else {//显示选择的状态
        if (this.data.orderList[i].activityType == showTarget) {
          this.data.orderList[i].show = true;
        } else {
          this.data.orderList[i].show = false;
        }
      }
    }
    this.setData({
      navList: this.data.navList,
      orderList: this.data.orderList
    })
  },
  activityList:function(){
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: getApp().globalData.urlHead+'/cashier/merchants.php?m=Api&c=wxadoc&a=activityList',
      data: {
        mid: getApp().globalData.mid,
        openid: getApp().globalData.openid,
        unionid: getApp().globalData.unionid,
        appid: getApp().globalData.appid,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        wx.hideLoading();
        console.log(res)
        that.setData({
          orderList:res.data.err_msg.data
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
    var that=this;
    setTimeout(function(){
      that.activityList()
    },5000)
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

  }
})