// pages/index/personMsg.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    userInfo: {},
    nickname:'',
    phone:'',
    hadPhone:false
  },
  enterNick:function(e){
    this.setData({
      nickname:e.detail.value
    })
  },
  saveRechargeUserInfo:function(){
    let that=this;
    if (that.data.date =='请选择日期'){
      wx.showToast({
        title: '请选择出生日期',
        icon:'none'
      });
      return;
    };
    if(!that.data.phone){
      wx.showToast({
        title: '请先获取手机号',
        icon: 'none'
      });
      return;
    }
    if (!that.data.nickname) {
      wx.showToast({
        title: '用户昵称不能为空',
        icon: 'none'
      });
      return;
    }
    let params={
      openid: app.globalData.openid,
      unionid: app.globalData.unionid,
      appid: app.globalData.appid,
      phone:that.data.phone,
      nickname:that.data.nickname,
      birthday:that.data.date
    }
    app.ajax('POST', params,'/cashier/merchants.php?m=Api&c=wxadoc&a=saveRechargeUserInfo',(res)=>{
      console.log(res);
      wx.hideLoading();
      if(!res.data.err_code){
        app.globalData.nickname=that.data.nickname;
        wx.navigateBack({
          delta:1
        })
      }else{
        wx.showToast({
          title: res.data.errMsg,
          icon:"none"
        })
      }
    },(res)=>{
      console.log(res)
    })
  },
  getPhoneNumber:function(e){
    console.log(e)
    let that=this;
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      wx.checkSession({
        success: function () {
          //session 未过期，并且在本生命周期一直有效
        },
        fail() {
          wx.login();//重新登录
        }
      });
    };
    that.getUserPhone(e);
  },
  getUserPhone: function (e) {
    var that = this;
    var params = {
      agentid: app.globalData.extMid,
      openid: app.globalData.openid,
      unionid: app.globalData.unionid,
      appid: app.globalData.appid,
      encryptedData: e.detail.encryptedData,
      session_key: app.globalData.session_key,
      iv: e.detail.iv
    }
    app.ajax('POST', params, '/cashier/merchants.php?m=Api&c=wxadoc&a=getUserPhone', (res) => {
      wx.hideLoading();
      if (res.data.err_code != 0) {
        wx.showToast({
          title: '手机号获取失败',
          icon:'none'
        })
      } else {
        that.setData({
          phone: res.data.err_dom,
          hadPhone: true,
        });
        app.globalData.phone = res.data.err_dom;
      }

    }, (res) => {

    })
  },
  getRechargeUserInfo: function () {
    let that = this;
    let params = {
      openid: app.globalData.openid,
      unionid: app.globalData.unionid,
      appid: app.globalData.appid,
      nickname: app.globalData.nickname,
      phone: app.globalData.phone
    };
    app.ajax('POST', params, '/cashier/merchants.php?m=Api&c=wxadoc&a=getRechargeUserInfo', (res) => {
      console.log(res);
      wx.hideLoading();
      if (!res.data.err_code) {
        var date;
        if (res.data.err_msg.birthday==0){
          date="请选择日期";
        }else{
          date = res.data.err_msg.birthday;
        }
        that.setData({
          userInfo: res.data.err_msg,
          date: date,
          nickname: res.data.err_msg.nickname
        })
      } else {
        wx.showToast({
          title: res.data.errMsg,
        })
      }
    }, (res) => {

    })
  },
  bindDateChange:function(e){
    console.log(e);
    this.setData({
      date:e.detail.value
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
    let that = this;
    that.getRechargeUserInfo();
    if (app.globalData.phone) {
      that.setData({
        phone: app.globalData.phone,
        hadPhone: true,
      })
    } else {
      that.setData({
        phone: '',
        hadPhone: false,
      })
    }
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