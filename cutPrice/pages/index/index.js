//index.js
//获取应用实例
const app = getApp()
var time = require('../../utils/util.js');
Page({
  data: {
    authorize:true,
    loadComplete:false,
    barDetail:{},
    allFriends:[],
    rank:[],
    partsFriend:[],
    wxcardDrtail:{},
    old_price:'0',
    current_price:'0',
    directive:0,
    solidBar:0,
    cur:0,
    price:'0',
    goodsShow:true,
    rankShow:false,
    friendsMask:false,
    cutMoneyMask:false,
    payMask:false,
    cutSuccessMask:false,//是否砍至最低价
    day:'00',
    hour:'00',
    minute:'00',
    second:'00',
    scrollTop:0,
    starttime:'',
    endtime:'',
    notstart:true,
    beginDate:'',
    endDate:'',
    err_dom:'',//砍价金额
    payCount:'',//付款倒计时
    countFlag:true,
    footerShow:true,
    soldOver:false,//售罄
    activityEnd:false,//活动结束
    otherPop:false,//是否是本人
  },
  invite:function(){
    wx.navigateTo({
      url: 'invite',
    })
  },
  goodShow:function(){
    this.setData({
      goodsShow:true,
      rankShow: false
    })
  },
  rankShow:function(){
    this.setData({
      goodsShow: false,
      rankShow: true
    })
  },
  friendsMask:function(){//显示砍价亲友团遮罩
    this.setData({
      friendsMask: true
    })
  },
  closeCut:function(){//关闭砍价遮罩
    wx.navigateTo({
      url: 'index',
    })
  },
  closeMask:function(){//关闭遮罩
    this.setData({
      friendsMask: false,
      cutMoneyMask:false,     
    })
  },
  lower:function(){
    console.log('滚动')
  },
  pay: function () {//立即购买
    var that=this;
    wx.showLoading({
      title: '加载中',
    })
    that.setData({
      payMask: false,
      countFlag: false
    })
    wx.request({
      url: app.globalData.urlHead+'/cashier/merchants.php?m=Api&c=wxadoc&a=weixinPay',
      data: {
        mid: getApp().globalData.mid,
        total: that.data.current_price,
        openid: getApp().globalData.openid,
        unionid: getApp().globalData.unionid,
        appid: 'wxf3a9a02997b0c4b9',
        type:2,
        activityid:that.data.barDetail.id
      },

      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        wx.hideLoading();
        getApp().globalData.orderid = res.data.err_dom;
        console.log(res);
        var err_dom=res.data.err_dom
        wx.requestPayment({
          timeStamp: res.data.err_msg.timeStamp,
          nonceStr: res.data.err_msg.nonceStr,
          package: res.data.err_msg.package,
          signType: 'MD5',
          paySign: res.data.err_msg.paySign,
          success: function (res) {
          },
          fail: function (res) {
            wx.hideLoading();
            var now = new Date().getTime();
            now = Math.floor(now / 1000);
            var time = now + 1800;
            console.log(res)
            that.setData({
              payMask: true,
              countFlag: true
            })
            that.payCount(time);
            console.log(res)
            wx.request({//支付失败发送模板消息
              url: app.globalData.urlHead +'/cashier/merchants.php?m=Api&c=wxadoc&a=failCallBack',
              data: {
                mid: getApp().globalData.mid,
                openid: getApp().globalData.openid,
                unionid: getApp().globalData.unionid,
                appid: 'wxf3a9a02997b0c4b9',
                id: err_dom,
                activityid: that.data.barDetail.id
              },
              method: 'POST',
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              success:function(res){
            
              },
              fail:function(res){
                console.log(res)
              }
            })
          }
        })
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
  payCount: function (time) {
    console.log(this.data.countFlag);
    if (this.data.countFlag) {
      var that = this;
      var day = new Date().getTime(), seconds;
      day = Math.floor(day / 1000);
      if (time > day) {
        seconds = time - day;
      } else {
        that.setData({
          payMask: false,
        })
        return false;
      }
      var hour = Math.floor(seconds / 60 / 60);
      var minute = Math.floor(seconds / 60 % 60);
      var second = Math.floor(seconds % 60);
      if (hour < 10) {
        hour = '0' + hour
      };
      if (minute < 10) {
        minute = '0' + minute
      };
      if (second < 10) {
        second = '0' + second
      };
      that.setData({
        payCount: hour + ':' + minute + ":" + second
      })
      var payCount = setTimeout(function () {
        that.payCount(time);
        clearTimeout(payCount);
        payCount = null;
      }, 1000)
    }
  },
  closePayMask:function(){
    this.setData({
      payMask: false,
      countFlag:false
    })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  countDown: function () {//倒计时
    var that = this;
    var nowTime = new Date().getTime() / 1000;//当前时间;
    var endTime = 0;
    if (that.data.starttime > nowTime) {//尚未开始
      endTime = that.data.starttime;
      that.setData({
        notstart:true
      });
    } else {//已开始
      endTime = that.data.endtime;
      that.setData({
        notstart: false
      });
    }
    if (nowTime > that.data.endtime) {//已结束
      
    }
    var seconds = endTime - nowTime;
    var day = Math.floor(seconds / 60 / 60 / 24)
    var hour = Math.floor(seconds / 60 / 60 % 24);
    var minute = Math.floor(seconds / 60 % 60);
    var second = Math.floor(seconds % 60);
    if (day < 10) {
      day = '0' + day
    };
    if (hour < 10) {
      hour = '0' + hour
    };
    if (minute < 10) {
      minute = '0' + minute
    };
    if (second < 10) {
      second = '0' + second
    };
    that.setData({
      day: day,
      hour: hour,
      minute:minute,
      second:second,
    });
    setTimeout(function () {
      that.countDown();
    }, 1000)
  },
  add0: function (m) {
    return m < 10 ? '0' + m : m
  },
  cutMoney: function (e) {//我要砍
    var that = this;
    if (this.data.barDetail.flag == true) {
      wx.request({
        url: app.globalData.urlHead +'/cashier/merchants.php?m=Api&c=wxadoc&a=userBargain',
        data: {
          mid: getApp().globalData.mid,
          detailid: that.data.barDetail.detailid,
          unionid: getApp().globalData.unionid,
          openid: getApp().globalData.openid,
          activityid: that.data.barDetail.detailid,
          activeid: that.data.barDetail.id
        },
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          console.log(res)
          if (res.data.err_code == 0) {
            that.data.barDetail.dhonum--;//剩余次数减一
            var current_price = that.data.current_price - res.data.err_dom;//砍后当前价
            that.setData({
              cutMoneyMask: true,
              err_dom: res.data.err_dom,
              barDetail: that.data.barDetail,
              current_price:current_price.toFixed(2)
            })
          }
        }
      })
    } else {
      wx.request({
        url: app.globalData.urlHead +'/cashier/merchants.php?m=Api&c=wxadoc&a=userActive',
        data: {
          mid: getApp().globalData.mid,
          activityid:this.data.barDetail.id,
          unionid: getApp().globalData.unionid,
          openid: getApp().globalData.openid,
          activityid: that.data.barDetail.detailid,
          activeid: that.data.barDetail.id,
          flagtest: 1,
          a: 'userActive',
          formId:e.detail.formId
        },
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          var detailid=res.data.err_msg
          console.log(res)
          wx.request({
            url: app.globalData.urlHead +'/cashier/merchants.php?m=Api&c=wxadoc&a=userBargain',
            data: { 
              mid: getApp().globalData.mid, 
              detailid: detailid,
              unionid: getApp().globalData.unionid,
              openid: getApp().globalData.openid,
              activityid: that.data.barDetail.detailid,
              activeid: that.data.barDetail.id
            },
            method: 'POST',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              console.log(res);
              that.data.barDetail.dhonum--;//剩余次数减一
              var current_price = that.data.current_price - res.data.err_dom;//砍后当前价
              if (res.data.err_code == 0) {
                that.setData({
                  cutMoneyMask: true,
                  err_dom: res.data.err_dom,
                  barDetail:that.data.barDetail,
                  current_price:current_price.toFixed(2)
                })
              }
            }
          })
        },
        fail: function (res) { },
      })
    }
  },
  bargain:function(){
    var that=this;
    wx.request({
      url: app.globalData.urlHead +'/cashier/merchants.php?m=Api&c=wxadoc&a=bargain',
      data: {
        mid: getApp().globalData.mid,
        unionid: getApp().globalData.unionid,
        openid: getApp().globalData.openid,
        appid: getApp().globalData.appid,
        activeid: 5
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        wx.hideLoading();
        console.log(res)
        that.setData({
          loadComplete:true
        });
        if (res.data.err_msg.barDetail.endtime < new Date().getTime() / 1000) {//活动已结束
          that.setData({
            footerShow:false,
            activityEnd:true
          })
          wx.showModal({
            title: '温馨提示',
            content: '来晚一步,活动已结束',
            showCancel: false,
            confirmText: '我知道了',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          })
        }
        if (res.data.err_msg.barDetail.intonum==0){//已售罄
          that.setData({
            footerShow: false,
            soldOver:true
          })
          wx.showModal({
            title: '温馨提示',
            content: '来晚一步,已售罄',
            showCancel: false,
            confirmText: '我知道了',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          })
        }
        if (!that.data.activityEnd && !that.data.soldOver && res.data.err_msg.barDetail.nowprice == res.data.err_msg.barDetail.price){//已砍至最低价切活动时间未结束未售罄
          if (res.data.err_msg.otherPop==false){//自砍人
            that.setData({
              cutSuccessMask: true
            })
          }     
        }
        var current_price = 0;
        if (res.data.err_msg.barDetail.flag == false) {//尚未砍价时
          current_price = res.data.err_msg.barDetail.old_price
        } else {
          current_price = res.data.err_msg.barDetail.nowprice
        }
        var beginDate = time.formatTime(parseInt(res.data.err_msg.barDetail.starttime), 'Y-M-D h:m:s'),//时间戳转化为时间
          endDate = time.formatTime(parseInt(res.data.err_msg.barDetail.endtime), 'Y-M-D h:m:s');
        var allData = res.data.err_msg.allData;
        var partsFriend=[];
        for(var i=0;i<allData.length;i++){
          var resetTime = time.formatTime(parseInt(allData[i].time),'Y-M-D h:m:s');
          allData[i].time = resetTime;
        }
        if (allData.length>4){
          partsFriend = allData.slice(0, 4);
        }else{
          partsFriend = allData
        }
        that.setData({
          barDetail: res.data.err_msg.barDetail,
          wxcardDrtail: res.data.err_msg.wxcardDrtail,
          old_price: res.data.err_msg.barDetail.old_price,
          price: res.data.err_msg.barDetail.price,
          current_price: current_price,
          starttime: res.data.err_msg.barDetail.starttime,
          endtime: res.data.err_msg.barDetail.endtime,
          beginDate: beginDate,
          endDate: endDate,
          allFriends: allData,
          rank: allData,
          partsFriend: partsFriend,
          otherPop: res.data.err_msg.otherPop,
        })
        that.countDown();
        //计算砍价进度
        var cur = ((that.data.current_price - that.data.price) / (that.data.old_price - that.data.price)) * 100;
        // 处理各种价格（后端价格要除以100）
        that.setData({
          cur: cur,
        });
      },
      fail: function (res) { }
    })
  },
  bindGetUserInfo: function (e) {
    if (e.detail.errMsg == 'getUserInfo:fail auth deny') {
      this.setData({
        authorize: false,
      });
      wx.hideLoading();
    } else {
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
  onLoad: function () {
    console.log('show')
    console.log(getApp().globalData);
    wx.showLoading({
      title: '加载中',
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
    var that = this;
    if (getApp().globalData.mid==''){
      app.userInfoReadyCallback = function () {
        console.log(getApp().globalData)
        that.bargain();
      }   
    }else{//非首次进入小程序
      that.bargain();
    }
    
  }, 
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
 
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
