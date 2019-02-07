var time = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    giftList: [],
    selectAll:false,
    selectTotal:0,
    gcid:'',
    count:0,
  },
  select:function(e){
    const length = this.data.giftList.length;
    if (this.data.selectTotal>=5){
      wx.showToast({
        title: '最多选择5张礼品卡',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    for(let i=0;i<length;i++){
      if (i == e.currentTarget.dataset.id){
        if (this.data.giftList[i].selectFlag == false){
          this.data.giftList[i].selectFlag = true;
          this.data.selectTotal++;
        }else{
          this.data.giftList[i].selectFlag = false;
          this.data.selectAll=false;
          this.data.selectTotal--;
        }
      }
    };
    this.setData({
      selectAll: this.data.selectAll,
      giftList:this.data.giftList,
      selectTotal:this.data.selectTotal,
    })
  },
  canUse: function () {//自用
    var ids = [];
    for (var i = 0; i < this.data.giftList.length; i++) {
      if (this.data.giftList[i].selectFlag == true) {
        ids.push(this.data.giftList[i].id)
      }
    }
    var that = this;
    console.log(that.data.cardDetail)
    console.log(that.data.cardDetail[0].id)
    wx.request({
      url: getApp().globalData.urlHead +'/cashier/merchants.php?m=Api&c=wxadoc&a=canUse',
      data: {
        mid: getApp().globalData.mid,
        openid: getApp().globalData.openid,
        unionid: getApp().globalData.unionid,
        appid: getApp().globalData.appid,
        ids: ids
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        wx.redirectTo({
          url: 'index',
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  selectAll:function(){//全选
    if (this.data.selectAll==false){
      const length = this.data.giftList.length;
      for (let i = 0; i < length; i++) {
          this.data.giftList[i].selectFlag = true;
      };
      this.data.selectALL=true;
      this.setData({
        giftList: this.data.giftList,
        selectAll: this.data.selectALL
      })
    }else{
      const length = this.data.giftList.length;
      for (let i = 0; i < length; i++) {
        this.data.giftList[i].selectFlag = false;
      };
      this.data.selectALL = false;
      this.setData({
        giftList: this.data.giftList,
        selectAll: this.data.selectALL
      })
    }
  },
  send:function(){
    var that=this;
    var select=0;
    for(var i=0;i<this.data.giftList.length;i++){
      if (this.data.giftList[i].selectFlag==true){
        select++;
      }
    }
    if(select==0){
      wx.showToast({
        title: '请选择要赠送的礼品卡',
        icon: 'none',
        duration: 2000
      })
    }else{
      wx.showLoading({
        title: '加载中',
      })
      var ids=[],
          count=0;

      for (var i = 0; i < that.data.giftList.length;i++){
        if (that.data.giftList[i].selectFlag==true){
          ids.push(that.data.giftList[i].id);
          that.setData({
            gcid: that.data.giftList[i].gcid
          })
          count++
        }
      }
      console.log(count)
      getApp().globalData.allids=ids;
      wx.request({
        url: getApp().globalData.urlHead +'/cashier/merchants.php?m=Api&c=wxadoc&a=send_gift',
        data: { 
          mid: getApp().globalData.mid, 
          openid: getApp().globalData.openid, 
          unionid: getApp().globalData.unionid, 
          appid: getApp().globalData.appid,
          ids: ids
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        success:function(res){
          console.log(count)
          wx.hideLoading();
          getApp().globalData.sendData=res.data.err_msg
          wx.navigateTo({
            url: '../send/sendGift?gcid=' + that.data.gcid + '&count=' +count
          })
        },
        fail:function(res){
          console.log(res)
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    var that=this;
    wx.request({
      url: getApp().globalData.urlHead +'/cashier/merchants.php?m=Api&c=wxadoc&a=use_gift',
      data: { 
        mid: 2155, 
        openid: getApp().globalData.openid, 
        unionid: getApp().globalData.unionid, 
        appid: getApp().globalData.appid
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        wx.hideLoading();
        console.log(res)
        var giftList = res.data.err_msg.allPresentData;
        for(var i=0;i<giftList.length;i++){
          giftList[i].addtime = time.formatTime(parseInt(giftList[i].addtime), 'Y-M-D')
        }
        that.setData({
          giftList: giftList
        })
      },
      fail: function(res) {
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