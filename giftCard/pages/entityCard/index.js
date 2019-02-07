//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    authorize:true,
    focus:false,
    enterErr:false,
    passWord:'',
    inputVal:'',
    merchant:[],
    cardinfo:[],
    receive:[],
    data:[],
    cardExt1:'',
    loadComplete:false,
    cardFlag:0
  },
  focus:function(){
    this.setData({
      focus:true
    })
  },
  blur:function(){
    this.setData({
      focus: false
    })
  },
  enterPass:function(e){
    var that=this;
    that.setData({
      passWord:e.detail.value,
      inputVal: e.detail.value,
      enterErr: false,
    })
  },
  receiveCard:function(){
    var that=this;
    if (that.data.cardFlag==1){
      wx.addCard({
        cardList: [
          {
            cardId: that.data.cardinfo.wxcard_id,
            cardExt: that.data.cardExt1
          },
        ],
        success: function (res) {
          console.log(res)
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else if (that.data.cardFlag == 2){
      wx.navigateToMiniProgram({
        appId: 'wxeb490c6f9b154ef9', // 固定为此appid，不可改动
        extraData: that.data.cardExt1, // 包括encrypt_card_id outer_str biz三个字段，须从step3中获得的链接中获取参数   
        success: function (res) {
          console.log(res)
        }, fail: function (res) {
          console.log(res)
        }, complete: function (res) {

        }
      })
    }
    
  },
  recharge:function(){
    var that=this;
    if (that.data.passWord == '' || that.data.passWord.length<18){
      wx.showToast({
        title: '请输入18位卡密',
        icon:'none'
      })
    }else{
      that.getPreCode();
    }
  },
  getPreCode:function(){
     var that=this;
    var _that = this;
    wx.request({
      url: app.globalData.urlHead + '/cashier/merchants.php?m=Api&c=wxadoc&a=getPreCode',
      data: {
        mid: getApp().globalData.mid,
        openid: getApp().globalData.openid,
        unionid: getApp().globalData.unionid,
        appid: getApp().globalData.appid,
        hcode: that.data.passWord,
        is_store:1
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success:function(res){
        console.log(res)
        console.log(_that)
        if (res.data.err_code ==1){
          _that.setData({
            enterErr:true,
            passWord:'',
            inputVal:''
          })
        } 
        else if (res.data.err_code == 2){
          wx.showModal({
            title: '提示',
            content: res.data.err_msg,
            success: function (res) {
              if (res.confirm) {
               
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        } 
        else if (res.data.err_code == 0){
          console.log(res.data)
          
          console.log(_that)
          var msg=res.data;
          if (_that.data.receive == false) {//没有领取
            wx.showModal({
              title: '提示',
              content: '成功领取会员卡后，将自动充值到会员卡余额里',
              confirmText: '立即领取',
              success: function (res) {
                if (res.confirm) {
                  if (_that.data.cardFlag == 1) {
                    wx.addCard({
                      cardList: [
                        {
                          cardId: _that.data.cardinfo.wxcard_id,
                          cardExt: msg.err_dom
                        }
                      ],
                      success: function (res) {
                        console.log(res.cardList) // 卡券添加结果
                      }
                    })
                  } else if (_that.data.cardFlag == 2){
                    wx.navigateToMiniProgram({
                      appId: 'wxeb490c6f9b154ef9', // 固定为此appid，不可改动
                      extraData: _that.data.cardExt1, // 包括encrypt_card_id outer_str biz三个字段，须从step3中获得的链接中获取参数   
                      success: function (res) {
                        console.log(res)  
                      }, fail: function (res) {
                        console.log(res)
                      }, complete: function (res) {

                      }
                    })
                  }
                  
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
          else if (_that.data.cardinfo == false) {//商家删卡
            wx.showModal({
              title: '提示',
              content: '商家尚未配置会员卡，您无法充值到会员卡余额里，只有线下到店使用。',
              confirmText: '知道了',
              showCancel: false,
              success: function () {
                if (res.confirm) {

                }
              },
            })
          }
          else if (_that.data.receive.isdel == 1) {//会员卡已删除(会员删)
            var that = this;
            wx.showModal({
              title: '提示',
              content: '当前会员卡已被您删除，请先重新领卡，才能充值',
              confirmText: '重新领卡',
              success: function (res) {
                if (res.confirm) {
                  wx.openCard({
                    cardList: [
                      {
                        cardId: _that.data.receive.cardid,
                        code: _that.data.receive.cardcode
                      }
                    ],
                    success: function (res) {
                      console.log(res.cardList) // 卡券添加结果
                    }
                  })
                  
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
          else if (_that.data.receive.isdel == 0) {//此人有主卡
            wx.showModal({
              title: '提示',
              content: '该礼品卡卡内还有{' + msg.err_msg + '}元，充值到会员卡余额后，将无法再转赠给他人，确定充值吗？',
              confirmText: '确定',
              success: function (res) {
                if (res.confirm) {
                  _that.makeToStrod(msg);
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
          else if (_that.data.cardinfo != '' && cardinfo.is_storedvalu == 0) {//未开启储值功能
            wx.showModal({
              title: '提示',
              content: '商家尚未开启余额储值功能，当前无法充值到会员卡余额里',
              showCancel: false,
              confirmText: '知道了',
              success: function (res) {
                if (res.confirm) {

                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
        }  
      }
    })
  },
  makeToStrod: function (msg){//充值到会员卡
    var that = this;
    wx.request({
      url: app.globalData.urlHead + '/cashier/merchants.php?m=Api&c=wxadoc&a=makeToStrod',
      data: {
        mid: getApp().globalData.mid,
        openid: getApp().globalData.openid,
        unionid: getApp().globalData.unionid,
        appid: getApp().globalData.appid,
        ids: msg.makeid,
        is_store:1
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        wx.hideLoading();
        console.log(res);
         wx.openCard({
            cardList: [
              {
                cardId: that.data.receive.cardid,
                code: that.data.receive.cardcode
              }
            ],
            success: function (res) {
              console.log(res.cardList) // 卡券添加结果
            }
          })
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
  bindGetUserInfo: function (e) {
    if (e.detail.errMsg == 'getUserInfo:fail auth deny'){
      this.setData({
        authorize: false,
      });
      wx.hideLoading();
    }else{
      app.getInfo();
      this.setData({
        authorize: true,
      });
      wx.showLoading({
        title: '加载中...',
      })
    }
  },
  modalHidden: function (e) {
    this.setData({
      authorize: true,
    })
  },
  //事件处理函数
  onLoad: function () {
    
  },
  onShow:function(){
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
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
        that.getPreCard();
      }
    }
    else {
      that.getPreCard();
    } 
  },
  getPreCard:function(){
    var that=this;
    wx.request({
      url: app.globalData.urlHead + '/cashier/merchants.php?m=Api&c=wxadoc&a=getPreCard',
      data: {
        mid: getApp().globalData.mid,
        openid: getApp().globalData.openid,
        unionid: getApp().globalData.unionid,
        appid: getApp().globalData.appid,
        is_store:1
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        wx.hideLoading();
        console.log(res);
        that.setData({
          merchant: res.data.err_msg.merchant,
          cardinfo:res.data.err_msg.cardinfo,
          receive: res.data.err_msg.receive,
          cardExt1: res.data.err_msg.cardExt1,
          loadComplete:true,
          cardFlag: res.data.err_msg.cardFlag
        })
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
