var time = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:[],
    noData:false,
    page:1,
    tempnum:'',
    loading:false,
    loadAll:false,
  },
  loadMore:function(){
    var that=this;
    if (!that.data.loadAll){
      that.data.page++
      that.setData({
        page: that.data.page,
        loading: true
      })
      that.getConsume();
    }
    
  },
  getConsume:function(){
    var that=this;
    wx.request({
      url: getApp().globalData.urlHead + '/cashier/merchants.php?m=Api&c=wxadoc&a=ajax_getConsume',
      data: {
        mid: getApp().globalData.mid,
        openid: getApp().globalData.openid,
        unionid: getApp().globalData.unionid,
        appid: getApp().globalData.appid,
        tempnum: that.data.tempnum,
        page:that.data.page
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        wx.hideLoading();
        if (that.data.page == 1 && res.data.err_code == 105){
          that.setData({
            noData: true,
          })
          return;
        }
        if (that.data.page != 1 &&res.data.err_code ==105) {
          that.setData({
            loadAll: true,
            loading:false,
          })
        }

          var dataList = res.data.err_msg;
          for (var i = 0; i < dataList.length; i++) {
            dataList[i].time = time.formatTime(parseInt(dataList[i].time), 'Y-M-D h:m:s')
          }
          that.setData({
            dataList: that.data.dataList.concat(dataList),
            loading: false
          })
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.setData({
      tempnum: options.tempnum
    })
    wx.showLoading({
      title: '加载中',
    })
    that.getConsume();
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
    
  },
})