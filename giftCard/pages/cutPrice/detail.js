Page({

  /**
   * 页面的初始数据
   */
  data: {
    theCardData:[],
    cardDetail:[],
    totalNum:0,
    totalMoney:0,
    tempNum:0,
    cardAllNum:[],
    allids:[]
  },
  send:function(){
    var date = new Date();
    var year = date.getFullYear(),
      month = date.getMonth() + 1,
      strDate = date.getDate(),
      hour = date.getHours(),
      minute = date.getMinutes(),
      second = date.getSeconds();
    if (month < 10) {
      month = "0" + month;
    }
    if (strDate < 10) {
      strDate = "0" + strDate;
    }
    if (hour < 10) {
      hour = '0' + hour
    }
    if (minute < 10) {
      minute = '0' + minute
    }
    if (second < 10) {
      second = '0' + second
    }
    var currentdate = year + '' + month + '' + strDate + '' + hour + '' + minute + '' + second;
    var random = Math.floor(Math.random() * 900000) + 100000;
    var smallflag = currentdate + random;
    wx.navigateTo({
      url: 'send?smallflag='+smallflag,
    })
  },
  personUse:function(){
    var that=this;
    wx.showModal({
      title: '提示',
      content: '充值到账户后，将无法再转赠给他人，确定充值吗？',
      success: function (res) {
        if (res.confirm) {
          that.canUse();
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  canUse:function(){
    var that=this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: getApp().globalData.urlHead+'/cashier/merchants.php?m=Api&c=wxadoc&a=canUse',
      data: {
        mid: getApp().globalData.mid,
        openid: getApp().globalData.openid,
        unionid: getApp().globalData.unionid,
        appid: getApp().globalData.appid,
        ids: that.data.allids,
        is_store:1
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        wx.hideLoading();
        wx.redirectTo({
          url: 'index',
        })
      },
      fail: function (res) {
        console.log(res)
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
    wx.showLoading({
      title: '加载中',
    })
    console.log(getApp().globalData.orderid)
    var that=this;
   setTimeout(function(){
     wx.request({
       url: getApp().globalData.urlHead +'/cashier/merchants.php?m=Api&c=wxadoc&a=gift_index',
       data: {
         mid: getApp().globalData.mid,
         openid: getApp().globalData.openid,
         unionid: getApp().globalData.unionid,
         appid: getApp().globalData.appid,
         orderid: getApp().globalData.orderid,
         is_store: 1
       },
       method: 'POST',
       header: {
         "Content-Type": "application/x-www-form-urlencoded"
       },
       success: function (res) {
         wx.hideLoading();
         console.log(res)
         var jsonStr = res.data.err_msg.cardDetail
         var cardDetail = [],
           totalNum = 0,
           totalMoney = 0;
         for (var key in jsonStr) {
           cardDetail.push(jsonStr[key]);
           totalNum += parseInt(jsonStr[key].giftnum);
           totalMoney += parseInt(jsonStr[key].giftnum) * jsonStr[key].price
         };
         that.setData({
           theCardData: res.data.err_msg.theCardData,
           cardDetail: cardDetail,
           totalNum: totalNum,
           totalMoney: totalMoney,
           tempNum: res.data.err_msg.tempNum,
           cardAllNum: res.data.err_msg.cardAllNum,
           allids:res.data.err_msg.allids
         })
       }
     })
   },3000)
    
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