// pages/index/privilege.js
var app = getApp();
var timeReset = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:4,
    mainHeight:0,
    showRights:true,
    start:false,
    rotate:false,
    circular:true,
    vertical:true,
    indicatorDots:false,
    allData:[],
    cardInfo:{},
    allByCard:[],
    countArr:{},
    memberDetail:{},
    num:0,
    currentPage:1,
    validitytime:'',
    loadAll:false,
    loadComplete:false,
  },
  scrollLoad:function(){
    var that=this;
    if(that.data.loadAll){
      return
    };
    that.data.currentPage++
    that.setData({
      currentPage: that.data.currentPage
    }) 
    that.cityBouns();
  },
  toDetail:function(e){
    console.log(e)
    var id = e.detail.target.dataset.id,
      formId = e.detail.formId;
    wx.navigateTo({
      url: 'foodDetail?id=' + id + '&formId=' + formId + '&minitype=1&sbak=1',
    })
  },
  cityBouns:function(){
    var that=this;
    var params = {
      agentid: app.globalData.extMid,
      openid: app.globalData.openid,
      unionid: app.globalData.unionid,
      page: that.data.currentPage,
    }
    app.ajax('POST', params, '/cashier/merchants.php?m=Api&c=wxadoc&a=cityBouns', (res) => {
      console.log(res);
      wx.hideLoading();
      if (res.data.err_code == 0) {
        wx.stopPullDownRefresh();
        var cardInfo = res.data.err_msg.cardInfo;
        cardInfo.open_card = parseInt(cardInfo.open_card);
        cardInfo.salenum = parseInt(cardInfo.salenum);
        if (res.data.err_msg.allData.length<5){
          that.setData({
            loadAll:true
          })
        }else {
          that.setData({
            loadAll: false
          })
        }
        var allData = res.data.err_msg.allData
        that.setData({
          allData: that.data.allData.concat(allData),
          cardInfo: cardInfo,
          allByCard: res.data.err_msg.allByCard,
          countArr: res.data.err_msg.countArr,
          memberDetail: res.data.err_msg.memberDetail,
          num: res.data.err_msg.num,
          loadComplete:true
        })
      }
    }, (res) => {

    })
  },
  openNow:function(){
    wx.navigateTo({
      url: 'buyCard',
    })
  },
  clickTitle:function(){
    var that=this;
    var rights=!that.data.showRights;
    var rotate=!that.data.rotate;
    that.setData({
      showRights: rights,
      start:true,
      rotate:rotate,
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
    var that = this;
    wx.setNavigationBarTitle({
      title: app.globalData.title,
    })
    var time = timeReset.formatTime(parseInt(app.globalData.validitytime), 'Y-M-D');
    wx.getSystemInfo({
      success: function (res) {
        // 可使用窗口宽度、高度
        console.log('height=' + res.windowHeight);
        console.log('width=' + res.windowWidth);
        var height = 48;
        if (res.windowHeight <= 572 && res.windowHeight > 504) {
          height = 48;
        } else if (res.windowHeight <= 504) {
          height = 43;
        }
        // 计算主体部分高度,单位为px
        that.setData({
          // second部分高度 = 利用窗口可使用高度 - first部分高度（这里的高度单位为px，所有利用比例将300rpx转换为px）
          mainHeight: res.windowHeight - height
        })
      }
    });
    that.setData({
      validitytime: time
    })
    that.cityBouns();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      loadAll:false,
      currentPage:1,
      allData: [],
      loadComplete:false,
      start:false,
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      loadAll: false,
      currentPage: 1,
      allData:[],
      loadComplete:false,
      start: false,
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      loadAll: false,
      currentPage: 1,
      allData: [],
      start: true,
    });
    this.cityBouns();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log(123)
    var that = this;
    if (that.data.loadAll) {
      return
    };
    that.data.currentPage++
    that.setData({
      currentPage: that.data.currentPage
    })
    that.cityBouns();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})