Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardDetail: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    circular: true,
    indicatorActiveColor: '#ca292f', 
    inputNum:1,
    errorNum:false,
    thankWord:'细碎的日子，珍藏美好的记忆，感谢你一直以来对我的支持与厚爱！',
    sumNum:0,
    gcid:'',
    count:'',
    padding450:false,
    canScroll:false,
    scrollTop:0,
    smallflag:'',
    canSend:true
  },
  textAreaFocus:function(){
    this.setData({
      padding450:true,
      canScroll:true,
      scrollTop:100
    })
  },
  textAreaBlur:function(){
    this.setData({
      padding450: false,
      canScroll: false,
      scrollTop:0
    })
  },
  // inputNum:function(e){//输入领取份数
  //   if (e.detail.value > this.data.sumNum){
  //     this.setData({
  //       errorNum: true,
  //       canSend:false,
  //     })
  //   }else{
  //     this.setData({
  //       errorNum: false,
  //       canSend:true
  //     })
  //   }
  //   this.setData({
  //     inputNum: e.detail.value
  //   })
  //   this.setData({
  //     thankWord: this.data.thankWord
  //   })
  //   if (this.data.inputNum == '' || this.data.inputNum == 0){
  //     this.setData({
  //       canSend:false,
  //     })
  //   } else {
  //     this.setData({
  //       canSend: true,
  //     })
  //   }
  // },
  
  inputWord:function(e){//输入祝福语
    console.log(e)
    this.setData({
      thankWord: e.detail.value
    })
    if(this.data.thankWord==''){
      this.setData({
        canSend: false,
      })
    }else{
      this.setData({
        canSend: true,
      })
    }
  },
  notSend:function(e){//不能发送
    var that=this;
    if (that.data.inputNum == '') {
      wx.showToast({
        title: '请输入领取份数',
        icon: 'none',
        duration: 2000
      })
    } else if (that.data.inputNum == 0) {
      wx.showToast({
        title: '领取份数不能为0',
        icon: 'none',
        duration: 2000
      })
      return false;
    } else if (that.data.thankWord == '') {
      wx.showToast({
        title: '请输入祝福语',
        icon: 'none',
        duration: 2000
      })
    } else if (that.data.inputNum > that.data.sumNum) {
      return false;
    }
  },
  onShareAppMessage:function(e){
    var that=this;
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
    that.setData({
      smallflag: smallflag
    })
      console.log(getApp().globalData.allids)
      getApp().globalData.sumNum = that.data.sumNum;
      getApp().globalData.inputNum = that.data.inputNum;
      getApp().globalData.thankWord = that.data.thankWord;
      return {
        title: '送您一份心意',
        path: '/pages/send/sendStatus?smallflag=' + smallflag + '&mid=' + getApp().globalData.mid + '&openid=' + getApp().globalData.openid + '&unionid=' + getApp().globalData.unionid + '&appid=' + getApp().globalData.appid + '&allids=' + getApp().globalData.allids,
        imageUrl: that.data.cardDetail[0].background_loc_url,
        desc: '最具人气的小程序开发联盟!',
        success: function (res) {
          wx.showLoading({
            title: '加载中',
          })
          that.giveFriend();
        },
        fail: function (res) {
          console.log(res)
        }
      }
      
      
    
  },
  giveFriend:function(){
    var that=this;
    wx.request({
      url: getApp().globalData.urlHead + '/cashier/merchants.php?m=Api&c=wxadoc&a=giveFriend',
      data: {
        mid: 2155,
        sumNum: that.data.sumNum,
        inputNum: that.data.inputNum,
        thankWord: that.data.thankWord,
        allids: getApp().globalData.allids,
        appid: getApp().globalData.appid
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        console.log(that.data.cardDetail[0].background_loc_url)
        // var src=res.data.err_msg.image
        // wx.navigateTo({
        //   url: 'share?smallflag=' + smallflag+'&gcid='+that.data.gcid+'&count='+that.data.count
        // })
        that.giveCallback()
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  giveCallback:function(){
    var that=this;
    wx.request({
      url: getApp().globalData.urlHead + '/cashier/merchants.php?m=Api&c=wxadoc&a=giveCallback',
      data: {
        smallflag: that.data.smallflag,
        allids: getApp().globalData.allids,
        sumNum: getApp().globalData.sumNum,
        inputNum: getApp().globalData.inputNum,
        thankWord: getApp().globalData.thankWord,
        mid: getApp().globalData.mid,
        openid: getApp().globalData.openid,
        unionid: getApp().globalData.unionid,
        appid: 'wxf3a9a02997b0c4b9',
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        wx.hideLoading();
        console.log(res);
        wx.navigateTo({
          url: 'sendSuccess?smallflag='+that.data.smallflag,
        })
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
  // 轮播图切换
  swiperChange:function(e){
    const current = e.detail.current;
    for (let i = 0; i < this.data.cardDetail.length;i++){
      if(i==current){
        this.data.cardDetail[i].flasg = true;
      }else{
        this.data.cardDetail[i].flasg = false;
      }
    };
    this.setData({
      cardDetail: this.data.cardDetail
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    wx.showLoading({
      title: '加载中',
    })
    var that=this;
    if (getApp().globalData.sendData.allPresentData.length==1){
      that.setData({
        indicatorDots:false
      })
    }else{
      that.setData({
        indicatorDots: true
      })
    }
    that.setData({
      cardDetail: getApp().globalData.sendData.allPresentData,
      sumNum: getApp().globalData.sendData.sumNum,
      gcid:options.gcid,
      count:options.count
    });
    wx.hideLoading();
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