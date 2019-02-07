Page({

  /**
   * 页面的初始数据
   */
  data: {
    giftList:[],
    cardDetail:[],
    giveUser:[],
    recoedd:[],
    cardShow:true,
    hanum:0,
    total:0,
    cardList:[],
    is_store:1,
    memberCard:[],
    cardExt1:[],
    receive: [], 
    member_info:[],
    ids:[],
    options:[],
    used:false,
    myRecord:false,
    titleTemp:''
  },
  add0:function(m){
    return m < 10 ? '0' + m : m
  },
  toIndex:function(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  recharge: function () {//充值到余额
      var that = this;
      if (that.data.memberCard != '' && that.data.receive != false && that.data.receive.isdel != 1) {//此人有主卡
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
                  ids: that.data.ids,
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
                        cardId: that.data.memberCard.wxcardid,
                        code: that.data.member_info.card_no,
                      }
                    ],
                    success: function (res) {
                      console.log(res)
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
      else if (that.data.memberCard != '' && that.data.memberi_info == false) {//此人还没有主卡
        console.log('此人还没有主卡');
        wx.addCard({
          cardList: that.data.cardList,
          success: function (res) {
            console.log(res)
            wx.showToast({
              title: '领卡成功',
              icon:'none'
            })
            that.setData({
              used:true
            })
            // wx.request({
            //   url: getApp().globalData.urlHead + '/cashier/merchants.php?m=Api&c=wxadoc&a=code',
            //   data: {
            //     mid: getApp().globalData.mid,
            //     openid: getApp().globalData.openid,
            //     unionid: getApp().globalData.unionid,
            //     appid: getApp().globalData.appid,
            //     is_store: that.data.is_store,
            //     code: res.cardList[0].code
            //   },
            //   header: {
            //     "Content-Type": "application/x-www-form-urlencoded"
            //   },
            //   method: 'POST',
            //   success: function (res) {
            //     wx.hideLoading();
            //     console.log(res)
            //     var code = res.data.err_msg;
            //     wx.openCard({
            //       cardList: [
            //         {
            //           cardId: that.data.memberCard.wxcardid,
            //           code: code,
            //         }
            //       ],
            //       success: function (res) {
            //         wx.hideLoading();
            //         console.log(res)
            //       },
            //       fail: function (res) {
            //         wx.hideLoading();
            //         console.log(res)
            //       },
            //     })
            //   }
            // })
          },
          fail:function(res){
            console.log(res)
          }
        })
        
        
      } 
      else if (that.data.memberCard != '' && that.data.receive != false && that.data.receive.isdel != 0) {//用户将卡删除
        console.log('用户将卡删除')

        wx.showModal({
          title: '提示',
          content: '成功领取会员卡后，将自动充值到会员卡余额里',
          confirmText: '重新领卡',
          success: function (res) {
            if (res.confirm) {
              wx.request({//充值
                url: getApp().globalData.urlHead + '/cashier/merchants.php?m=Api&c=wxadoc&a=toStrod',
                data: {
                  mid: getApp().globalData.mid,
                  openid: getApp().globalData.openid,
                  unionid: getApp().globalData.unionid,
                  appid: getApp().globalData.appid,
                  ids: that.data.ids,
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
                        cardId: that.data.memberCard.wxcardid,
                        code: that.data.member_info.card_no,
                      }
                    ],
                    success: function (res) {
                      console.log(res)
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
      else if (that.data.memeberCardDetail == '' && that.data.receive != false && that.data.receive.isdel != 0) {//未开启余额储值功能
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
  },
  canUse: function () {//自用
    console.log(123)
    var that = this;
    console.log(that.data.cardList)
    wx.showLoading({
      title: '加载中',
    })
    
    if (that.data.cardList != '') {
      console.log(that.data.cardList);
      wx.addCard({
        cardList: that.data.cardList,
        success: function (res) {

          console.log(res)
          wx.hideLoading();
          console.log(res.cardList) // 卡券添加结果
          // wx.request({
          //   url: getApp().globalData.urlHead + '/cashier/merchants.php?m=Api&c=wxadoc&a=code',
          //   data: {
          //     mid: getApp().globalData.mid,
          //     openid: getApp().globalData.openid,
          //     unionid: getApp().globalData.unionid,
          //     appid: getApp().globalData.appid,
          //     is_store: that.data.is_store,
          //     // code: res.cardList[0].code
          //   },
          //   header: {
          //     "Content-Type": "application/x-www-form-urlencoded"
          //   },
          //   method: 'POST',
          //   success: function (res) {
          //     wx.hideLoading();
          //     console.log(123)
          //     console.log(res)
          //     wx.openCard({
          //       cardList: [
          //         {
          //           cardId: that.data.cardDetail.card_id,
          //           code: res.data.err_msg,
          //         }
          //       ],
          //       success: function (res) {
          //         wx.hideLoading();
          //         console.log(res)
          //       },
          //       fail: function (res) {
          //         wx.hideLoading();
          //         console.log(res)
          //       },
          //       // complete: function (res) {
          //       //   console.log('complete')
          //       //   that.gift_index();
          //       // }
          //     })
          //   }
          // })
          that.setData({
            used:true
          })
          wx.hideLoading();
        },
        fail: function (res) {
          console.log(res)
        }
      })
    } 
    else {
      console.log(getApp().globalData.allids)
      wx.request({
        url: getApp().globalData.urlHead + '/cashier/merchants.php?m=Api&c=wxadoc&a=canUse',
        data: {
          mid: getApp().globalData.mid,
          openid: getApp().globalData.openid,
          unionid: getApp().globalData.unionid,
          appid: getApp().globalData.appid,
          ids: that.data.ids,
          is_store: that.data.is_store
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        success: function (res) {
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            content: '自用成功，点击确定前往我的卡包页面查看！',
            confirmText:'确定',
            showCancel:false,
            success: function (res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '/pages/userCenter/record',
                })
              }
            }
          })
        },
        fail: function (res) {
          console.log(res)
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    console.log(getApp().globalData.allids);
    
    var that=this;
    that.setData({
      options:options
    })
    if (options.myRecord) {
      that.setData({
        myRecord: true
      })
      wx.setNavigationBarTitle({
        title: '我的领取',
      })
    }
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
    wx.hideLoading();
    var that=this;
    if (that.data.options.card == 2 || that.data.options.userFlag == 1 || that.data.options.userFlag == 2 || that.data.options.userFlag == 5 || that.data.options.userFlag == 8 || that.data.options.userFlag == 9) {
      that.setData({
        cardShow: true
      })
    } else {
      that.setData({
        cardShow: false
      })
    }

    wx.request({
      url: getApp().globalData.urlHead + '/cashier/merchants.php?m=Api&c=wxadoc&a=allGetCard',
      data: {
        from: that.data.options.from,
        send_unionid: that.data.options.send_unionid,//赠送人的unionid
        smallflag: that.data.options.smallflag,
        allids: getApp().globalData.allids,
        mid: getApp().globalData.mid,
        openid: getApp().globalData.openid,
        unionid: getApp().globalData.unionid,//领取人的unionid
        appid: getApp().globalData.appid,
        is_store: 1
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        console.log(res.data.err_msg.cardList)
        //  var  n={};
        // for (var key in res.data.err_msg.cardList){
        //   n = { cardid: key, cardExt: res.data.err_msg.cardList[key].cardExt};
        //   cardList.push(n);
        //   console.log(res.data.err_msg.cardList[key].cardExt.slice(1, -1))
        // }

        var giftList = res.data.err_msg.dataDetail;
        for (var i = 0; i < giftList.length; i++) {//将时间戳转化为时间
          var timestamp = parseInt(giftList[i].addtime) * 1000,
            time = new Date(timestamp),
            year = time.getFullYear(),
            month = time.getMonth() + 1,
            date = time.getDate(),
            hours = time.getHours(),
            minutes = time.getMinutes(),
            seconds = time.getSeconds();
          giftList[i].addtime = year + '-' + that.add0(month) + '-' + that.add0(date) + ' ' + that.add0(hours) + ':' + that.add0(minutes) + ':' + that.add0(seconds);
        }
        that.setData({
          giftList: giftList,
          giveUser: res.data.err_msg.giveUser,
          recoedd: res.data.err_msg.recoedd,
          hanum: res.data.err_msg.hdnum,
          total: res.data.err_msg.total,
          cardDetail: res.data.err_msg.cardDetail,
          cardList: res.data.err_msg.cardList,
          memberCard: res.data.err_msg.memberCard,
          cardExt1: res.data.err_msg.cardExt1,
          receive: res.data.err_msg.receive,
          member_info: res.data.err_msg.member_info,
          ids: res.data.err_msg.ids,
          titleTemp: res.data.err_msg.titleTemp
        })
      }
    })
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
    
  }
})