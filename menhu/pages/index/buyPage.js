// pages/index/buyPage.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    allData:{},
    amount:1,
    totalMoney:0,
    phone:'',
    name:'',
    hadPhone:false,
    btnClick:true,
    memberDetail:{},
    oldPrice:0,
    nowPrice:0
  },
  getPhoneNumber:function(e){
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
        })
      } else {
        that.setData({
          phone: res.data.err_dom,
          hadPhone: true,
        });
        console.log(res.data.err_dom);
        app.globalData.phone = res.data.err_dom;
        console.log(app.globalData)
        that.agentPayUserCoupon();
      }

    }, (res) => {

    })
  },
  cancel:function(){
    wx.navigateBack({
      delta:1
    })
  },
  buyNow:function(){
    var that=this;
    var reg = /^1[3|4|5|7|8][0-9]{9}$/;
    if(!reg.test(that.data.phone)){
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      });
      return;
    }
    if (that.data.name == '' || that.data.name == null){
      wx.showToast({
        title: '请输入姓名',
        icon:'none'
      })
    } else if (that.data.phone == '' || that.data.phone.length!=11){
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
    }else{
      that.agentPayUserCoupon();
    }
    
  },
  bindNameInput:function(e){
    var that=this;
    that.setData({
      name:e.detail.value
    })
  },
  bindPhoneInput:function(e){
    var that = this;
    that.setData({
      phone: e.detail.value
    })
  },
  add:function(){
    var that=this;
    var amount=that.data.amount;
    amount = ++amount;
    var totalMoney = parseFloat(that.data.nowPrice * amount).toFixed(2);
    that.setData({
      amount: amount,
      totalMoney: totalMoney
    })
  },
  less: function () {
    var that = this;
    var amount = that.data.amount;
    amount = --amount;
    var totalMoney = parseFloat(that.data.nowPrice * amount).toFixed(2);
    if(amount==0){
      return;
    }
    that.setData({
      amount: amount,
      totalMoney: totalMoney
    })
  },
  agentPayUserCoupon:function(){
    var that=this;
    if(that.data.btnClick){
      that.setData({
        btnClick:false
      })
      var params = {
        agentid: app.globalData.extMid,
        openid: app.globalData.openid,
        unionid: app.globalData.unionid,
        coupon_id: that.data.id,
        phone: that.data.phone,
        truename: that.data.name,
        total: that.data.totalMoney,
        num: that.data.amount
      };
      app.ajax('POST', params, '/cashier/merchants.php?m=Api&c=wxadoc&a=agentPayUserCoupon', (res) => {
        console.log(res);
        if (res.data.err_code == 0) {
          wx.navigateTo({
            url: 'payPage?id=' + res.data.err_msg + '&num=' + that.data.amount,
          });
          that.setData({
            btnClick: true
          })
        } else {
          wx.showToast({
            title: res.data.err_msg,
            icon: 'none'
          })
          that.setData({
            btnClick: true
          })
        }
      }, (res) => {

      })
    }
    
  },
  agentBuyDetail:function(){
    var that = this;
    var params = {
      agentid: app.globalData.extMid,
     id:that.data.id,
     unionid: app.globalData.unionid
    };
    app.ajax('POST', params,'/cashier/merchants.php?m=Api&c=wxadoc&a=agentBuyDetail',(res)=>{
      wx.hideLoading();
      console.log(res)
      if (res.data.err_code == 0){
        that.setData({
          allData:res.data.err_msg.allData,
          name: res.data.err_msg.truename,
          memberDetail: res.data.err_msg.memberDetail
        });
        if (that.data.memberDetail.is_member == 0) {//非会员
          that.setData({
            oldPrice: that.data.allData.price,
            nowPrice: that.data.allData.saleprice,
            totalMoney: that.data.allData.saleprice
          })
        }

        if (that.data.memberDetail.is_member != 0 && that.data.allData.memberprice != -1) {//会员且会员价格存在
          that.setData({
            oldPrice: that.data.allData.price,
            nowPrice: that.data.allData.memberprice,
            totalMoney: that.data.allData.memberprice
          })
        }

        if (that.data.memberDetail.is_member != 0 && that.data.allData.memberprice == -1) {//会员且会员价格不存在
          that.setData({
            oldPrice: that.data.allData.price,
            nowPrice: that.data.allData.saleprice,
            totalMoney: that.data.allData.saleprice
          })
        }
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
    },(res)=>{

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.setData({
      id:options.id
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
      title: app.globalData.title,
    })
    console.log(app.globalData)
    that.agentBuyDetail();
    if (app.globalData.phone){
      that.setData({
        phone: app.globalData.phone,
        hadPhone:true,
      })
    }else{
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
    var that=this;
    that.setData({
      btnClick:true
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var that = this;
    that.setData({
      btnClick: true
    })
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