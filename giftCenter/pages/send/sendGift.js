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
    inputNum:0,
    errorNum:false,
    thankWord:'细碎的日子，珍藏美好的记忆，感谢你一直以来对我的支持与厚爱！',
    sumNum:0,
  },
  inputNum:function(e){//输入领取份数
    if (e.detail.value > this.data.sumNum){
      this.setData({
        errorNum: true
      })
    }else{
      this.setData({
        errorNum: false
      })
    }
    this.setData({
      inputNum: e.detail.value
    })
  },
  
  inputWord:function(e){//输入祝福语
    this.setData({
      thankWord: e.detail.value
    })
  },
  send:function(e){
    if (this.data.inputNum == ''){
      wx.showToast({
        title: '请输入领取份数',
        icon: 'none',
        duration: 2000
      })
    } else if (this.data.inputNum == 0){
      wx.showToast({
        title: '领取份数不能为0',
        icon: 'none',
        duration: 2000
      })
    } else if (this.data.thankWord==''){
      wx.showToast({
        title: '请输入祝福语',
        icon: 'none',
        duration: 2000
      })
    } else if (this.data.inputNum > this.data.sumNum){
      return false;
    }else{
      getApp().globalData.sumNum = this.data.sumNum;
      getApp().globalData.inputNum = this.data.inputNum;
      getApp().globalData.thankWord = this.data.thankWord;
      wx.request({
        url: 'https://np.pigcms.com/cashier/merchants.php?m=Api&c=wxadoc&a=giveFriend',
        data: { 
                mid: 2155, 
                sumNum: this.data.sumNum, 
                inputNum: this.data.inputNum, 
                thankWord: this.data.thankWord,
                allids: getApp().globalData.allids
              },
        method: 'POST',
        header: { 
          "Content-Type": "application/x-www-form-urlencoded" 
        },
        success:function(res){
           console.log(res)
           var src=res.data.err_msg.image
          wx.navigateTo({
            url: 'share?src=https://np.pigcms.com/cashier'+src,
          })
        },
        fail:function(res){
          console.log(res)
        }
      })
      
    }
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
    console.log(getApp().globalData.sendData.allPresentData)
    wx.showLoading({
      title: '加载中',
    })
    var that=this;
    that.setData({
      cardDetail: getApp().globalData.sendData.allPresentData,
      sumNum: getApp().globalData.sendData.sumNum
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