// pages/index/buyCard.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    hadPhone:false,
    cardList:[],
    id:'',
    money:0
  },
  buy: function (e) {
    console.log(e);
    var that = this;
    var target = e.currentTarget.dataset.index;
    var money = that.data.cardList[target].sale_price > 0 ? that.data.cardList[target].sale_price : that.data.cardList[target].original;
    
    that.setData({
      id: that.data.cardList[target].id,
      money:money
    });
    that.buyMemberCard();
  },
  buyMemberCard:function(){
    var that=this;
    console.log(that.data)
    var params = {
      agentid: app.globalData.extMid,
      openid: app.globalData.openid,
      appid: app.globalData.appid,
      unionid: app.globalData.unionid,
      card_id:that.data.id,
      total:that.data.money
    }
    app.ajax('POST', params, '/cashier/merchants.php?m=Api&c=wxadoc&a=buyMemberCard', (res) => {
      console.log(res);
      wx.hideLoading();
      if (res.data.err_code == 0) {
        wx.requestPayment({
          'timeStamp': res.data.err_msg.timeStamp,
          'nonceStr': res.data.err_msg.nonceStr,
          'package': res.data.err_msg.package,
          'signType': res.data.err_msg.signType,
          'paySign': res.data.err_msg.paySign,
          'success': function (res) {
            console.log(res)
            wx.navigateBack({
              delta:1
            })
          },
          'fail': function (res) {
            wx.showToast({
              title: '支付失败',
              icon:'none'
            })
          }
        })
      }else{
        wx.showToast({
          title: res.data.err_msg,
          icon:'none'
        })
      }
    }, (res) => {

    })

  },
  getPhoneNumber: function (e) {
    var that = this;
    console.log(e)
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      wx.checkSession({
        success: function () {
          //session 未过期，并且在本生命周期一直有效
        },
        fail() {
          wx.login();//重新登录
        }
      });
    }
    that.getUserPhone(e);
  },
  getUserPhone: function (e) {
    console.log(e)
    var that = this;
    var target=e.currentTarget.dataset.index;
    var money = that.data.cardList[target].sale_price > 0 ? that.data.cardList[target].sale_price : that.data.cardList[target].original;

    that.setData({
      id: that.data.cardList[target].id,
      money: money
    });
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
        })
      } else {
        that.setData({
          phone: res.data.err_dom,
          hadPhone: true,
        });
        app.globalData.phone = res.data.err_dom;
        that.buyMemberCard();
      }

    }, (res) => {

    })
  },
  memberCardList:function(e){
    var that=this;
    var params = {
      agentid: app.globalData.extMid,
      openid: app.globalData.openid,
      unionid: app.globalData.unionid,
    }
    app.ajax('POST', params, '/cashier/merchants.php?m=Api&c=wxadoc&a=memberCardList', (res) => {
      console.log(res);
      wx.hideLoading();
      wx.stopPullDownRefresh();
      if (res.data.err_code == 0) {
        that.setData({
          cardList:res.data.err_msg
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
    var that = this;
    wx.setNavigationBarTitle({
      title: app.globalData.title,
    });
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
    };
    that.memberCardList();
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
    var that=this;
    that.setData({
      cardList: [],
    });
    that.memberCardList();
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