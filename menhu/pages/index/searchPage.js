// pages/index/searchPage.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:2,
    canScroll:true,
    allData:[],
    name:'',
    search:[],
    pageInit:true,
    currentPage:1,
    searchNo:false,
    inputValue:false,
    mainHeight:0,
    loadAll:false,
  },
  scrollLoad:function(){
    var that=this;
    if(that.data.loadAll){
      return;
    }
    that.data.currentPage++;
    that.setData({
      currentPage: that.data.currentPage
    })
    that.cityIndex()
  },
  clearSearchKeyWord:function(){
    var that=this;
    var params = {
      agentid: app.globalData.extMid,
      unionid: app.globalData.unionid,
      type: 1
    };
    app.ajax('POST', params, '/cashier/merchants.php?m=Api&c=wxadoc&a=clearSearchKeyWord', (res) => {
      console.log(res)
      wx.hideLoading()
      if (res.data.err_code == 0) {
        that.cityIndex();
      } else {
        wx.showModal({
          title: '提示',
          content: res.data.err_msg,
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        })
      }
    }, (res) => {

    })
  },
  bindKeyInput:function(e){
    var that=this;
    if(e.detail.value!=''){
      that.setData({
        inputValue: true,
      })
    }else{
      that.setData({
        inputValue: false,
      })
    }
  },
  deleteInput:function(){
    var that=this;
    that.setData({
      name:'',
      allData: [],
      pageInit: true,
      inputValue: false,
    })
  },
  backIndex:function(e){
    wx.redirectTo({
      url: 'index',
    })
  },
  buy: function (e) {
    console.log(e)
    var id = e.detail.target.dataset.id,
    formId=e.detail.formId;
    wx.navigateTo({
      url: 'foodDetail?id=' + id + '&formId=' + formId + '&minitype=1&sbak=1',
    })
  },
  searchBtn:function(e){
    console.log(e)
    var that=this;
    that.setData({
      name:e.currentTarget.dataset.target,
      allData: [],
      pageInit: false,
      searchNo: false,
      inputValue:true,
      currentPage:1
    });
    that.cityIndex();
  },
  searchSubmit:function(e){
    console.log(e)
    var that=this;
    that.setData({
      name:e.detail.value,
      allData: [],
      pageInit: false,
      searchNo: false,
      currentPage: 1,
      loadAll: false,
    })
    that.cityIndex();
  },
  cityIndex: function () {
    var that = this;
    var params = {
      agentid: app.globalData.extMid,
      openid: app.globalData.openid,
      unionid: app.globalData.unionid,
      page: that.data.currentPage,
      name:that.data.name
    };
    app.ajax('POST', params, '/cashier/merchants.php?m=Api&c=wxadoc&a=cityIndex', (res) => {
      console.log(res)
      wx.hideLoading()
      if (res.data.err_code == 0) {
        if (res.data.err_msg.allData.length==0){
          that.setData({
            searchNo:true
          })
        }
        if (res.data.err_msg.allData.length < 8) {
          that.setData({
            loadAll: true
          })
        } else {
          loadAll: false
        }
        var allData = res.data.err_msg.allData
        that.setData({
          advertisementList: res.data.err_msg.advertisementList,
          allCateGory: res.data.err_msg.allCateGory,
          allData: that.data.allData.concat(allData),
          search:res.data.err_msg.search,
        })
      } else {
        wx.showModal({
          title: '提示',
          content: res.data.err_msg,
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        })
      }
    }, (res) => {

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
    var that=this;
    wx.setNavigationBarTitle({
      title: app.globalData.title,
    })
    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        // 可使用窗口宽度、高度
        console.log('height=' + res.windowHeight);
        console.log('width=' + res.windowWidth);
        var height=118;
        if (res.windowHeight <= 504) {
          height = 100;
        }
        // 计算主体部分高度,单位为px
        that.setData({
          // second部分高度 = 利用窗口可使用高度 - first部分高度（这里的高度单位为px，所有利用比例将300rpx转换为px）
          mainHeight: res.windowHeight - height
        })
      }
    })
    that.cityIndex();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var that=this;
    that.setData({
      allData: [],
      currentPage:false,
      loadAll:false,
      pageInit:true,
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