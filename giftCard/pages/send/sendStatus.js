const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    authorize:true,
    receive:false,
    received:false,
    receiveOver:false,
    expired:false,
    smallflag:'',
    shareImg:'',
    photo:'',
    nickName:'',
    send_unionid:'',
    seeOther:false,
    formId:'',
    sendUnionid:'',
    userFlag:'',
    loadComplate:false,
  },
  openSubmit:function(e){
    console.log(e)
    console.log(e.detail.formId)
    this.setData({
      formId:e.detail.formId
    })
    this.getCard(2)
  },
  seeList:function(){
    this.getCard(1)
  },
  personReceive:function(){
    wx.navigateTo({
      url: 'receiveList?card=1&smallflag=' + this.data.smallflag + '&send_unionid=' + this.data.send_unionid + '&from=0&userFlag=' + this.data.userFlag
    })
  },
  getCard:function(flag){
    var that=this;
    wx.showLoading({
      title: '加载中',
    })
    if(flag==2){
      wx.request({
        url: getApp().globalData.urlHead + '/cashier/merchants.php?m=Api&c=wxadoc&a=getCard',
        data: {
          smallflag: that.data.smallflag,
          allids: getApp().globalData.allids,
          mid: getApp().globalData.mid,
          openid: getApp().globalData.openid,
          unionid: getApp().globalData.unionid,
          appid: getApp().globalData.appid,
          formId: that.data.formId
        },
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          wx.hideLoading();
          wx.navigateTo({
            url: 'receiveList?card=' + flag + '&smallflag=' + that.data.smallflag + '&send_unionid=' + that.data.send_unionid + '&from=' + flag + '&userFlag=' + that.data.userFlag,
          })
        }
      })
    }else if(flag==1){
      wx.hideLoading();
      wx.navigateTo({
        url: 'receiveList?card=' + flag + '&smallflag=' + that.data.smallflag + '&send_unionid=' + that.data.send_unionid + '&from=' + flag + '&userFlag=' + that.data.userFlag,
      })
    }
    
  },
  bindGetUserInfo: function (e) {//获取用户权限
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().globalData.allids = options.allids;
    var that=this;
    that.setData({
      smallflag: options.smallflag,
      send_unionid: options.unionid,
    })
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
    if (getApp().globalData.mid==''){//第一次进入小程序
      app.userInfoReadyCallback = function () {
        that.userGet();
      } 
    }else{
      that.userGet();
    }
    
    
  },
  userGet:function(){
    console.log()
    var that=this;
    wx.request({
      url: getApp().globalData.urlHead +'/cashier/merchants.php?m=Api&c=wxadoc&a=userGet',
      data: {
        smallflag: that.data.smallflag,
        allids: getApp().globalData.allids,
        mid: getApp().globalData.mid,
        openid: getApp().globalData.openid,
        unionid: getApp().globalData.unionid,
        appid: getApp().globalData.appid,
        sendUnionid: that.data.send_unionid
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        var receive = false,
          received = false,
          receiveOver = false,
          expired = false;
        // if (res.data.err_msg.userFlag == 4) {//已领完
        //   receiveOver = true;
        // }else if (res.data.err_msg.userFlag == 1) {//已领取
        //   received = true;
        // }else if (res.data.err_msg.userFlag == 3) {//已过期
        //   expired = true;
        // } else {//领取
        //   receive = true
        // }
        if (res.data.err_msg.userFlag == 8) {//赠送本人已经领取过且领完
          received = true;
        } else if (res.data.err_msg.userFlag == 1){//已领取没过期
          received = true;
        } else if (res.data.err_msg.userFlag == 2){//拥有过未过期
          received = true;
        } else if (res.data.err_msg.userFlag == 3){//可领取
          receive = true
        } else if (res.data.err_msg.userFlag == 4){//过期
          expired = true;
        } else if (res.data.err_msg.userFlag == 5){//过期了且已领取
          received = true;
        } else if (res.data.err_msg.userFlag == 6) {//过期未领取
          expired = true;
        } else if (res.data.err_msg.userFlag == 7){//已领完
          receiveOver = true;
        } else if (res.data.err_msg.userFlag == 9){//领取过未过期
          received = true;
        }
        that.setData({
          receive: receive,
          received: received,
          receiveOver: receiveOver,
          expired: expired,
          photo: res.data.err_msg.userDetail.avatarurl,
          nickName: res.data.err_msg.userDetail.nickname,
          userFlag: res.data.err_msg.userFlag,
          loadComplate:true
        })
        console.log(that.data)
        wx.hideLoading();
      }
    })
    if (that.data.send_unionid == getApp().globalData.unionid) {
      that.setData({
        seeOther: true
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