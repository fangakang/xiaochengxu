Page({

  /**
   * 页面的初始数据
   */
  data: {
      cardDetail:[],
      gcid:'',
      count:0,
      receive: [],
      is_store: 1,
      memberCardDetails: [],
      receive: [],
      member_info: [],
      wxcardid: '',
      cardExt1: '',
      cardExt: '',
      theCardData:[],
      cardIsBelong:false,
      allids:[],
      loadComplete:false,
      recharge: false,
      personUse: false,
      cardFlag:0
  },
  toList: function () {
    wx.navigateTo({
      url: 'list',
    })
  },
  canUse: function () {//自用
    console.log(this.data.cardIsBelong)
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    console.log(that.data.cardDetail)
    console.log(that.data.cardDetail[0].id)
      if (that.data.cardIsBelong==false){
        wx.addCard({
          cardList: [{
            cardId: that.data.theCardData[0].card_id,
            cardExt: that.data.cardExt
          }],
          success: function (res) {
            console.log(res)
            wx.hideLoading();
            console.log(res.cardList) // 卡券添加结果
           wx.request({
             url: getApp().globalData.urlHead + '/cashier/merchants.php?m=Api&c=wxadoc&a=code',
             data:{
               mid: getApp().globalData.mid,
               openid: getApp().globalData.openid,
               unionid: getApp().globalData.unionid,
               appid: getApp().globalData.appid,
               is_store:that.data.is_store,
               code: res.cardList[0].code
             },
             header: {
               "Content-Type": "application/x-www-form-urlencoded"
             },
             method: 'POST',
             success:function(res){
               wx.hideLoading();
               console.log(res)
               wx.openCard({
                 cardList: [
                   {
                     cardId: that.data.theCardData[0].card_id,
                     code: res.data.err_msg,
                   }
                 ],
                 success: function (res) {
                   wx.hideLoading();
                   console.log(res)
                   that.setData({
                     personUse:true
                   })
                 },
                 fail: function (res) {
                   wx.hideLoading();
                   console.log(res)
                 }
               })
             }
           })
            wx.hideLoading();
          },
          fail:function(res){
            console.log(res)
          }
        })
      }else{
        wx.request({
          url: getApp().globalData.urlHead + '/cashier/merchants.php?m=Api&c=wxadoc&a=canUse',
          data: {
            mid: getApp().globalData.mid,
            openid: getApp().globalData.openid,
            unionid: getApp().globalData.unionid,
            appid: getApp().globalData.appid,
            ids:that.data.allids,
            is_store:that.data.is_store
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: 'POST',
          success: function (res) {
            wx.openCard({
              cardList: [
                {
                  cardId: that.data.theCardData[0].card_id,
                  code: that.data.cardIsBelong.cardcode,
                }
              ],
              success: function (res) {
                wx.hideLoading();
                console.log(res)
                that.setData({
                  personUse: true
                })
              },
              fail:function(res){
                console.log(res)
              }
            })
          },
          fail: function (res) {
            console.log(res)
          }
        })
      }
  },
  recharge: function () {
    var that = this;
    console.log(that.data.is_store);
    if (that.data.memberCardDetails != '' && that.data.receive != false && that.data.receive.isdel != 1) {//此人有主卡
      wx.showModal({
        title: '提示',
        content: '充值到会员卡余额后，将无法再转赠给他人，确定充值吗？',
        success: function (res) {
          if (res.confirm) {
            wx.request({//充值
              url: getApp().globalData.urlHead + '/cashier/merchants.php?m=Api&c=wxadoc&a=toStrod',
              data: {
                mid: getApp().globalData.mid,
                openid: getApp().globalData.openid,
                unionid: getApp().globalData.unionid,
                appid: getApp().globalData.appid,
                ids: that.data.allids,
                pigcms_id: that.data.member_info.pigcms_id,
                uc_id: that.data.member_info.uc_id
              },
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              method: 'POST',
              success: function (res) {
                console.log(res)
                console.log(that.data.member_info.card_no)
                wx.openCard({
                  cardList: [
                    {
                      cardId: that.data.wxcardid,
                      code: that.data.member_info.card_no,
                    }
                  ],
                  success: function (res) {
                    console.log(res)
                    wx.hideLoading();
                    that.setData({
                      recharge:true
                    })
                  }
                })
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } 
    else if (that.data.memberCardDetails != '' && that.data.member_info == false) {//此人还没有主卡
      wx.showModal({
        title: '提示',
        content: '成功领取会员卡后，将自动充值到会员卡余额里',
        confirmText: '立即领取',
        success: function (res) {
          if (res.confirm) {
            if (that.data.cardFlag==1){
              wx.addCard({
                cardList: [{
                  cardId: that.data.wxcardid,
                  cardExt: that.data.cardExt1
                }],
                success: function (res) {
                  console.log(res.cardList) // 卡券添加结果
                  wx.hideLoading();
                  that.setData({
                    recharge: true
                  })
                },
                fail: function (res) {
                  console.log(res)
                }
              })
            } else if (that.data.cardFlag == 2){
              wx.navigateToMiniProgram({
                appId: 'wxeb490c6f9b154ef9', // 固定为此appid，不可改动
                  extraData: that.data.cardExt1, // 包括encrypt_card_id outer_str biz三个字段，须从step3中获得的链接中获取参数   
                  success: function(res) {
                    console.log(res)
                    // wx.navigateTo({
                    //   url: '../index/personMsg',
                    // })
                    that.setData({
                      recharge: true
                    })
                  },   fail: function(res) {   
                    console.log(res)
                  },   complete: function(res) {   

                  } 
                })
            }
            
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } 
    else if (that.data.memberCardDetails != '' && that.data.receive != false && that.data.receive.isdel != 0) {//用户将卡删除
      wx.showModal({
        title: '提示',
        content: '成功领取会员卡后，将自动充值到会员卡余额里',
        confirmText: '重新领卡',
        success: function (res) {
          if (res.confirm) {
            if (that.data.cardFlag == 1){
              wx.addCard({
                cardList: [{
                  cardId: that.data.wxcardid,
                  cardExt: that.data.cardExt1
                }],
                success: function (res) {
                  wx.hideLoading();
                  console.log(res.cardList) // 卡券添加结果
                  that.setData({
                    recharge: true
                  })
                }
              })
            } else if (that.data.cardFlag == 2){
              wx.navigateToMiniProgram({
                appId: 'wxeb490c6f9b154ef9', // 固定为此appid，不可改动
                extraData: that.data.cardExt1, // 包括encrypt_card_id outer_str biz三个字段，须从step3中获得的链接中获取参数   
                success: function (res) {
                  console.log(res)
                  that.setData({
                    recharge: true
                  });
                  wx.navigateTo({
                    url: '../index/personMsg',
                  })
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
    } else if (that.data.memeberCardDetail == '' && that.data.receive != false && that.data.receive.isdel != 0) {
      wx.showModal({
        title: '提示',
        content: '商家尚未开启余额储值功能，当前无法充值到会员卡余额里',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }  
  },
  viewShop: function () {
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {//未进行位置授权
          wx.authorize({//进行地理位置授权
            scope: 'scope.userLocation',
            success(res) {
              console.log('获取地理位置授权成功');
              wx.getLocation({
                type: 'wgs84',
                success: function (res) {
                  var latitude = res.latitude
                  var longitude = res.longitude
                  wx.navigateTo({
                    url: '../index/allShop?latitude=' + latitude + '&longitude=' + longitude,
                  })
                }
              })

            },
            fail() {
              console.log('获取地理位置授权失败')
            }
          })
        } else {//地理位置已授权
          wx.getLocation({
            type: 'wgs84',
            success: function (res) {
              var latitude = res.latitude
              var longitude = res.longitude
              wx.navigateTo({
                url: '../index/allShop?latitude=' + latitude + '&longitude=' + longitude,
              })
            }
          })

        }
      }
    })
  },
  send: function () {
      wx.showLoading({
        title: '加载中',
      })
      var that=this;
      // var ids = [];
      // ids.push(that.data.cardDetail[0].id)
      // console.log(ids);
      // getApp().globalData.allids = ids;
      wx.request({
        url: getApp().globalData.urlHead +'/cashier/merchants.php?m=Api&c=wxadoc&a=send_gift',
        data: {
          mid: getApp().globalData.mid,
          openid: getApp().globalData.openid,
          unionid: getApp().globalData.unionid,
          appid: getApp().globalData.appid,
          ids: that.data.allids
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        success: function (res) {
          wx.hideLoading();
          getApp().globalData.sendData = res.data.err_msg
          console.log(res)
          wx.navigateTo({
            url: '../send/sendGift?gcid='+that.data.gcid+'&count='+that.data.count,
          })
        },
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showLoading({
      title: '加载中',
    })
    this.gift_index();
  },
  gift_index:function(){
    var that = this;
    wx.request({
      url: getApp().globalData.urlHead + '/cashier/merchants.php?m=Api&c=wxadoc&a=gift_index',
      data: {
        mid: getApp().globalData.mid,
        openid: getApp().globalData.openid,
        unionid: getApp().globalData.unionid,
        appid: getApp().globalData.appid,
        cardpayid: getApp().globalData.cardpayid,
        presentId: getApp().globalData.presentId,
        is_store: getApp().globalData.is_store
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        wx.hideLoading();
        console.log(789)
        console.log(res);
        console.log(10)
        var key;
        var cardDetail = [];
        getApp().globalData.allids = res.data.err_msg.allids;
        for (var key in res.data.err_msg.cardDetail) {
          cardDetail.push(res.data.err_msg.cardDetail[key])
        }
        that.setData({
          cardDetail: cardDetail,
          gcid: getApp().globalData.presentId,
          count: 1,
          is_store: getApp().globalData.is_store,
          receive: res.data.err_msg.receive,
          memberCardDetails: res.data.err_msg.memberCardDetails,
          receive: res.data.err_msg.receive,
          member_info: res.data.err_msg.member_info,
          cardExt1: res.data.err_msg.cardExt1,
          cardExt: res.data.err_msg.cardExt,
          wxcardid: res.data.err_msg.wxcardid,
          theCardData: res.data.err_msg.theCardData,
          cardIsBelong: res.data.err_msg.cardIsBelong,
          allids: res.data.err_msg.allids,
          loadComplete: true,
          cardFlag: res.data.err_msg.cardFlag
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      loadComplete: false,
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

  }
})