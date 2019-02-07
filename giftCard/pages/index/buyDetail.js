Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadComplete:false,
    theCardData:[],
    cardDetail:[],
    totalNum:0,
    totalMoney:0,
    tempNum:0,
    cardAllNum:[],
    allids:[],
    receive:[],
    is_store:0,
    memberCardDetails:[],
    receive:[],
    member_info:[],
    wxcardid:'',
    cardExt1:'',
    cardExt:'',
    cardIsBelong: false,
    times:5,
    recharge:false,
    personUse:false,
    cardFlag:0
  },
  send:function(){
    var that=this;
    console.log(that.data.cardDetail);
    if(this.data.is_store==1){
      wx.request({
        url: getApp().globalData.urlHead + '/cashier/merchants.php?m=Api&c=wxadoc&a=send_gift',
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
          wx.navigateTo({
            url: '../send/sendGift?count=1&gcid='+that.data.cardDetail[0].gcid,
          })
        },
        fail: function (res) {
          console.log(res)
        }
      })
    }else if (this.data.tempNum==1){//只有一张    
      wx.request({
        url: getApp().globalData.urlHead+'/cashier/merchants.php?m=Api&c=wxadoc&a=send_gift',
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
          wx.navigateTo({
            url: '../send/sendGift?count=1&gcid=' + that.data.cardDetail[0].gcid,
          })
        },
        fail: function (res) {
          console.log(res)
        }
      })
    }else{
      wx.navigateTo({
        url: 'list',
      })
    }
    
  },
  recharge:function(){
    var that=this;
    console.log(that.data.is_store);
    if(that.data.is_store==1){//单店版
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
                  wx.hideLoading();
                  wx.openCard({
                    cardList: [
                      {
                        cardId: that.data.wxcardid,
                        code: that.data.member_info.card_no,
                      }
                    ],
                    success: function (res) {
                      console.log(res)
                      that.setData({
                        recharge:true
                      })
                    },
                    // complete: function (res) {
                    //   console.log('complete')
                    //   that.gift_index();
                    // }
                  })
                }
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      } 
      else if (that.data.memberCardDetails != '' && that.data.member_info  == false){//此人还没有主卡
        console.log('此人还没有主卡');
        wx.showModal({
          title: '提示',
          content: '成功领取会员卡后，将自动充值到会员卡余额里',
          confirmText:'立即领取',
          success: function (res) {
            if (res.confirm) {
              if (that.data.cardFlag == 1){
                wx.addCard({
                  cardList: [{
                    cardId: that.data.wxcardid,
                    cardExt: that.data.cardExt1
                  }],
                  success: function (res) {
                    that.code(res);
                    that.setData({
                      recharge: true
                    })
                  }
                })
              } 
              else if(that.data.cardFlag == 2){
                wx.navigateToMiniProgram({
                  appId: 'wxeb490c6f9b154ef9', // 固定为此appid，不可改动
                  extraData: that.data.cardExt1, // 包括encrypt_card_id outer_str biz三个字段，须从step3中获得的链接中获取参数   
                  success: function (res) {
                    console.log(res)
                    that.setData({
                      recharge: true
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
      } 
      else if (that.data.memberCardDetails != '' && that.data.receive != false && that.data.receive.isdel != 0){//用户将卡删除
        console.log('用户将卡删除')
        wx.showModal({
          title: '提示',
          content: '成功领取会员卡后，将自动充值到会员卡余额里',
          confirmText: '重新领卡',
          success: function (res) {
            if (res.confirm) {
              if (that.data.cardFlag == 1) {
                wx.addCard({
                  cardList: [{
                    cardId: that.data.wxcardid,
                    cardExt: that.data.cardExt1
                  }],
                  success: function (res) {
                    that.code(res);
                    that.setData({
                      recharge: true
                    })
                  }
                })
              }
              else if (that.data.cardFlag == 2) {
                wx.navigateToMiniProgram({
                  appId: 'wxeb490c6f9b154ef9', // 固定为此appid，不可改动
                  extraData: that.data.cardExt1, // 包括encrypt_card_id outer_str biz三个字段，须从step3中获得的链接中获取参数   
                  success: function (res) {
                    console.log(res)
                    that.setData({
                      recharge: true
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
      } 
      else if (that.data.memeberCardDetail == '' && that.data.receive != false && that.data.receive.isdel!= 0 ){
        console.log('未开启余额储值功能')
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
    }
  },
  canUse: function () {//充值到余额
    console.log(this.data.cardIsBelong)
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    console.log(that.data.cardDetail)
    console.log(that.data.cardDetail[0].id)
      if (that.data.cardIsBelong == false) {
        wx.addCard({
          cardList: [{
            cardId: that.data.theCardData.card_id,
            cardExt: that.data.cardExt
          }],
          success: function (res) {
            console.log(res)
            wx.hideLoading();
            console.log(res.cardList) // 卡券添加结果
            that.code(res)
            that.setData({
              personUse: true
            })
            wx.hideLoading();
          },
          fail: function (res) {
            console.log(res)
          }
        })
      } 
      else {
        wx.request({
          url: getApp().globalData.urlHead + '/cashier/merchants.php?m=Api&c=wxadoc&a=canUse',
          data: {
            mid: getApp().globalData.mid,
            openid: getApp().globalData.openid,
            unionid: getApp().globalData.unionid,
            appid: getApp().globalData.appid,
            ids: that.data.allids,
            is_store: that.data.is_store
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: 'POST',
          success: function (res) {
            wx.hideLoading();
            wx.openCard({
              cardList: [
                {
                  cardId: that.data.theCardData.card_id,
                  code: that.data.cardIsBelong.cardcode,
                }
              ],
              success: function (res) {
                wx.hideLoading();
                console.log(res);
                that.setData({
                  personUse: true
                })
              },
              fail: function (res) {
                console.log(res)
              },
              // complete: function (res) {
              //   console.log('complete')
              //   that.gift_index();
              // }
            })
          },
          fail: function (res) {
            console.log(res)
          }
        })
      }
  },
  code: function (code) {
    var that = this;
    wx.request({
      url: getApp().globalData.urlHead + '/cashier/merchants.php?m=Api&c=wxadoc&a=code',
      data: {
        mid: getApp().globalData.mid,
        openid: getApp().globalData.openid,
        unionid: getApp().globalData.unionid,
        appid: getApp().globalData.appid,
        is_store: that.data.is_store,
        code: code.cardList[0].code
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        wx.hideLoading();
        console.log(123)
        console.log(res)
        wx.openCard({
          cardList: [
            {
              cardId: that.data.theCardData.card_id,
              code: res.data.err_msg,
            }
          ],
          success: function (res) {
            wx.hideLoading();
            console.log(res)
          },
          fail: function (res) {
            wx.hideLoading();
            console.log(res);
          },
          // complete: function (res) {
          //   console.log('complete')
          //   that.gift_index();
          // }
        })
      }
    })
  },
  viewShop:function(){
    wx.getSetting({
      success(res){
        if (!res.authSetting['scope.userLocation']) {//未进行位置授权
          wx.authorize({//进行地理位置授权
            scope: 'scope.userLocation',
            success(res){
              console.log('获取地理位置授权成功');
              wx.getLocation({
                type: 'wgs84',
                success: function (res) {
                  var latitude = res.latitude
                  var longitude = res.longitude
                  wx.navigateTo({
                    url: 'allShop?latitude=' + latitude + '&longitude=' + longitude,
                  })
                }
              })
              
            },
            fail() {
              console.log('获取地理位置授权失败')
            }
          })
        }else{//地理位置已授权
          wx.getLocation({
            type: 'wgs84',
            success: function (res) {
              var latitude = res.latitude
              var longitude = res.longitude
              wx.navigateTo({
                url: 'allShop?latitude=' + latitude + '&longitude=' + longitude,
              })
            }
          })
          
        }
      }
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
      title: '加载中...',
    })
    console.log(getApp().globalData.orderid)
    var that = this;
    that.gift_index();
  },
  gift_index:function(){
    wx.showLoading({
      title: '加载中...',
    })
    var that = this;
    console.log(getApp().globalData.mid);
    wx.request({
      url: getApp().globalData.urlHead + '/cashier/merchants.php?m=Api&c=wxadoc&a=gift_index',
      data: {
        mid: getApp().globalData.mid,
        openid: getApp().globalData.openid,
        unionid: getApp().globalData.unionid,
        appid: getApp().globalData.appid,
        orderid: getApp().globalData.orderid,
        is_store: getApp().globalData.is_store
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        if (!res.data.err_msg.theCardData){
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            content: '网络延迟，点击确定前往我的卡包查看',
            showCancel:false,
            confirmText:'确定',
            success:function(){
              wx.switchTab({
                url: '/pages/userCenter/record',
              })
            }
          })
          return;
        }
          wx.hideLoading();
          var jsonStr = res.data.err_msg.cardDetail
          var cardDetail = [],
            totalNum = 0,
            totalMoney = 0;
          for (var key in jsonStr) {
            cardDetail.push(jsonStr[key]);
            totalNum += parseInt(jsonStr[key].giftnum);
            totalMoney += parseInt(jsonStr[key].giftnum) * jsonStr[key].price
          };
          console.log(cardDetail)
          getApp().globalData.allids = res.data.err_msg.allids;
          that.setData({
            theCardData: res.data.err_msg.theCardData,
            cardDetail: cardDetail,
            totalNum: totalNum,
            totalMoney: totalMoney,
            tempNum: res.data.err_msg.tempNum,
            cardAllNum: res.data.err_msg.cardAllNum,
            allids: res.data.err_msg.allids,
            is_store: getApp().globalData.is_store,
            receive: res.data.err_msg.receive,
            memberCardDetails: res.data.err_msg.memberCardDetails,
            receive: res.data.err_msg.receive,
            member_info: res.data.err_msg.member_info,
            cardExt1: res.data.err_msg.cardExt1,
            cardExt: res.data.err_msg.cardExt,
            wxcardid: res.data.err_msg.wxcardid,
            cardIsBelong: res.data.err_msg.cardIsBelong,
            theCardData: res.data.err_msg.theCardData,
            loadComplete:true,
            cardFlag: res.data.err_msg.cardFlag
          })
        }
    })
  },
  timerFunction:function(){
    var that=this;
    wx.showLoading({
      title: '加载中...',
    })
    this.data.interval = setInterval(function () {
      that.data.times--;
      if (that.data.times>0) {
        that.gift_index()
      }
      that.setData({
        times: that.data.times
      });
    }, 1000)
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
    clearInterval(this.data.interval);
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