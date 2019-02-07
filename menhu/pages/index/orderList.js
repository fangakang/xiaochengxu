// pages/index/orderList.js
var app=getApp();
var timeReset=require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    authorize: true,
    bannerList:[
      { name: '全部', id: 0 },
      { name: '待付款', id: 1 },
      { name: '待使用', id: 2 },
      { name: '已使用', id: 3 }
    ],
    canScroll:true,
    page:1,
    allData:[],
    willUseData:[],
    userPersonData:[],
    hadUse:[],
    type:'0',
    scrollTop:0,
    allComplete:false,
    willUseComplete:false,
    userPersonComplete:false,
    hadUseComplete:false,
    noAll:false,
    noWillUse:false,
    noUsePerson:false,
    noHadUse:false,
    mainHeight:0,
    prevPage:'',//1.我的页面，2.购买页面
  },
  toDetail:function(e){
    var id=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "foodDetail?id="+id+"&formId=''",
    })
  },
  bindGetUserInfo: function (e) {
    console.log(e)
    var that = this;
    console.log(e.detail.errMsg)
    if (e.detail.errMsg == "getUserInfo:ok") {
      app.getInfo();
      that.setData({
        authorize: true
      });
    } else {
      wx.showToast({
        title: '授权失败',
        icon: 'none'
      })
    }
  },
  scrollLoad:function(){
    var that=this;
    that.data.page++
    that.setData({
      page: that.data.page
    })
    if (that.data.type == 0) {//全部
      if (that.data.allComplete){
        return
      }
      that.allAgentOrder();
    } else if (that.data.type == 1) {//待付款
      if (that.data.userPersonComplete){
        return;
      }
      that.userPerson();
    } else if (that.data.type == 2) {//待使用
      if (that.data.willUseComplete) {
        return;
      }
      that.allWillUse()
    } else if (that.data.type == 3) {//已用完
      if (that.data.hadUseComplete) {
        return;
      }
      that.hadUse()
    }
    
  },
  use:function(e){
    wx.navigateTo({
      url: 'use',
    })
  },
  agentPayCard: function (e) {
    var that = this;
    console.log(e);
    var params = {
      agentid: app.globalData.extMid,
      appid: app.globalData.appid,
      id: e.currentTarget.dataset.id,
      coupon_id: e.currentTarget.dataset.coupon,
    };
    app.ajax('POST', params, '/cashier/merchants.php?m=Api&c=wxadoc&a=agentPayCard', (res) => {
      console.log(res)
      wx.hideLoading();
      if (res.data.err_code == 0) {
        wx.requestPayment({
          'timeStamp': res.data.err_msg.timeStamp,
          'nonceStr': res.data.err_msg.nonceStr,
          'package': res.data.err_msg.package,
          'signType': 'MD5',
          'paySign': res.data.err_msg.paySign,
          'success': function (res) {
            wx.navigateBack({
              delta:1
            })
          },
          'fail': function (res) {
          }
        })
      } else if (res.data.err_code == 200){
        wx.showToast({
          title: '支付成功',
          icon:'none'
        })
        setTimeout(function(){
          wx.navigateBack({
            delta: 1
          })
        },500)
      }
    })
  },
  selectPage:function(e){
    console.log(e);
    var that=this;
    var type = e.currentTarget.dataset.id
    that.setData({
      type:type,
      scrollTop:0,
      page:1,
      allData: [],
      willUseData: [],
      userPersonData: [],
      hadUse: [],
      allComplete: false,
      willUseComplete: false,
      userPersonComplete: false,
      hadUseComplete: false,
    });
    if(type==0){
      that.allAgentOrder();
    }else if(type==1){
      that.userPerson();
    }else if(type==2){
      that.allWillUse();
    }else if(type==3){
      that.hadUse();
    }
  },
  mergeArray:function(arr1,arr2){
    var _arr=new Array();
    for(var i=0;i<arr1.length;i++){
      _arr.push(arr1[i])
    }
    for(var i=0;i<arr2.length;i++){
      var flag=true;
      for(var j=0;j<arr1.length;j++){
        if (arr1[j].order_id==arr2[i].order_id){
          flag=false;
          break;
        }
      }
      if(flag){
        _arr.push(arr2[i])
      }
    }
    return _arr;
  },
  allAgentOrder: function () {//全部
    var that=this;
    var params={
      agentid: app.globalData.extMid,
      openid: app.globalData.openid,
      unionid: app.globalData.unionid,
      page:that.data.page
    }
    app.ajax('POST', params,'/cashier/merchants.php?m=Api&c=wxadoc&a=allAgentOrder',(res)=>{
      wx.hideLoading();
      console.log(res)
      if(res.data.err_code==0){
        if(res.data.err_msg.length==0&&that.data.page==1){
            that.setData({
              noAll:true,
              canScroll:false
            })
            return;
        }
        if (res.data.err_msg.length<8){
          that.setData({
            allComplete:true,
          })
        }
        if (res.data.err_msg.length >= 3) {
          that.setData({
            canScroll: true
          })
        }
        var allData = res.data.err_msg;
        var dataInit = that.data.allData;
        var newArr = [];
        for (var i = 0; i < allData.length; i++) {
          allData[i].paytime = timeReset.formatTime(parseInt(allData[i].paytime), 'Y-M-D h:m:s');
          allData[i].add_times = timeReset.formatTime(parseInt(allData[i].add_times), 'Y-M-D h:m:s');
          allData[i].etime = timeReset.formatTime(parseInt(allData[i].etime), 'Y-M-D h:m:s');
        }
        if (dataInit.length != 0) {
          newArr = that.mergeArray(dataInit,allData)
        } else {
          newArr = allData
        }
        console.log(newArr)
        that.setData({
          allData: newArr
        })
      }
    },(res)=>{

    })
   },
  allWillUse:function(){//待使用
    var that=this;
    var params = {
      agentid: app.globalData.extMid,
      openid: app.globalData.openid,
      unionid: app.globalData.unionid,
      page: that.data.page
    }
    app.ajax('POST', params, '/cashier/merchants.php?m=Api&c=wxadoc&a=allWillUse', (res) => {
      wx.hideLoading();
      console.log(res)
      if (res.data.err_code == 0) {
        if (res.data.err_msg.length == 0 && that.data.page == 1) {
          that.setData({
            noWillUse: true,
            canScroll:false
          })
          return;
        }
        if (res.data.err_msg.length < 8) {
          that.setData({
            willUseComplete: true,
          })
        }
        if (res.data.err_msg.length >= 3) {
          that.setData({
            canScroll: true
          })
        }
        var willUseData = res.data.err_msg;
        for (var i = 0; i < willUseData.length; i++) {
           willUseData[i].paytime = timeReset.formatTime(parseInt(willUseData[i].paytime), 'Y-M-D h:m:s');
          willUseData[i].end_time = timeReset.formatTime(parseInt(willUseData[i].end_time), 'Y-M-D h:m:s');
        }
        that.setData({
          willUseData: that.data.willUseData.concat(willUseData)
        })
      }
    }, (res) => {

    })
  },
  userPerson: function () {//待付款
    var that = this;
    var params = {
      agentid: app.globalData.extMid,
      openid: app.globalData.openid,
      unionid: app.globalData.unionid,
      page: that.data.page
    }
    app.ajax('POST', params, '/cashier/merchants.php?m=Api&c=wxadoc&a=userPerson', (res) => {
      wx.hideLoading();
      console.log(res)
      if (res.data.err_code == 0) {
        if (that.data.page == 1 && res.data.err_msg.data.length == 0) {
          that.setData({
            noUsePerson: true,
            canScroll:false
          })
          return;
        }
        if (res.data.err_msg.data.length < 8) {
          that.setData({
            userPersonComplete: true,
          })
        }
        if (res.data.err_msg.data.length >= 3) {
          that.setData({
            canScroll: true
          })
        }
        var userPersonData = res.data.err_msg.data;
        var dataInit=that.data.userPersonData;
        var newArr=[];
        for (var i = 0; i < userPersonData.length; i++) {
          userPersonData[i].add_time = timeReset.formatTime(parseInt(userPersonData[i].add_time), 'Y-M-D h:m:s');
          userPersonData[i].end_time = timeReset.formatTime(parseInt(userPersonData[i].end_time), 'Y-M-D h:m:s');
        }
        if(dataInit.length!=0){
          newArr = that.mergeArray(dataInit, userPersonData)
        }else{
          newArr = userPersonData
        }
        that.setData({
          userPersonData: newArr
        })
      }
    }, (res) => {

    })
  },
  hadUse:function(){//已使用
    var that=this;
    var params = {
      agentid: app.globalData.extMid,
      openid: app.globalData.openid,
      unionid: app.globalData.unionid,
      page: that.data.page
    }
    app.ajax('POST', params, '/cashier/merchants.php?m=Api&c=wxadoc&a=hadUse', (res) => {
      wx.hideLoading();
      console.log(res)
      if (res.data.err_code == 0) {
        if (res.data.err_msg.length == 0 && that.data.page == 1) {
          that.setData({
            noHadUse: true,
            canScroll: false
          })
          return;
        }
        if (res.data.err_msg.length < 8) {
          that.setData({
            hadUseComplete: true,
          })
        }
        if (res.data.err_msg.length >= 3) {
          that.setData({
            canScroll: true
          })
        }
        var hadUse = res.data.err_msg;
        for (var i = 0; i < hadUse.length; i++) {
          hadUse[i].destroy_time = timeReset.formatTime(parseInt(hadUse[i].destroy_time), 'Y-M-D h:m:s');
        }
        that.setData({
          hadUse: that.data.hadUse.concat(hadUse)
        })
      }
    }, (res) => {

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    console.log(options)
    that.setData({
      type:options.type,
      prevPage:options.page
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
      title: '订单列表',
    })
    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        // 可使用窗口宽度、高度
        console.log('height=' + res.windowHeight);
        console.log('width=' + res.windowWidth);
        // 计算主体部分高度,单位为px
        that.setData({
          // second部分高度 = 利用窗口可使用高度 - first部分高度（这里的高度单位为px，所有利用比例将300rpx转换为px）
          mainHeight: res.windowHeight - 50
        })
      }
    })
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          that.setData({
            authorize: false
          })
          wx.hideLoading();
        } else {
          that.setData({
            authorize: true
          })
        }
      }
    });
    if (app.globalData.mid == '') {
      app.userInfoReadyCallback = function () {
        if (that.data.type == 0) {//全部
          that.allAgentOrder();
        } else if (that.data.type == 1) {//待付款
          that.userPerson();
        } else if (that.data.type == 2) {//待使用
          that.allWillUse()
        } else if (that.data.type == 3) {//已使用
          that.hadUse()
        }
      }
    } else {
      if (that.data.type == 0) {//全部
        that.allAgentOrder();
      } else if (that.data.type == 1) {//待付款
        that.userPerson();
      } else if (that.data.type == 2) {//待使用
        that.allWillUse()
      } else if (that.data.type == 3) {//已使用
        that.hadUse()
      }
    }
    

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var that = this;
    that.setData({
      willUseData: [],
      hadUse: [],
      allComplete: false,
      willUseComplete: false,
      userPersonComplete: false,
      hadUseComplete: false,
      noAll: false,
      noWillUse: false,
      noUsePerson: false,
      noHadUse: false,
      page:1
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var that = this;
    console.log(that.data.prevPage)
    if (that.data.prevPage==2){
      wx.navigateBack({
        delta:1
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})