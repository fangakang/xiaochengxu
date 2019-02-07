var time = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navList: [
      { name: '全部', active: true, status: 2 },
      { name: '已购买', active: false, status: 1 },
      { name: '转赠中', active: false, status: 3 },
      { name: '已收到', active: false, status: 0 },
    ],
    allPresentData:[],
    chooseShow:false,
    selectAll:false,
    selectTotal:0
  },
  chooseCard:function(e){
    const length = this.data.allPresentData.length;
    if (this.data.selectTotal >= 5) {
      wx.showToast({
        title: '最多选择5张礼品卡',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    for (let i = 0; i < length; i++) {
      if (i == e.currentTarget.dataset.id) {
        if (this.data.allPresentData[i].selectFlag == false) {
          this.data.allPresentData[i].selectFlag = true;
          this.data.selectTotal++;
        } else {
          this.data.allPresentData[i].selectFlag = false;
          this.data.selectAll = false;
          this.data.selectTotal--;
        }
      }
    };
    this.setData({
      selectAll: this.data.selectAll,
      allPresentData: this.data.allPresentData,
      selectTotal:this.data.selectTotal
    })
  },
  select: function (e) {
    var target = e.currentTarget.dataset.id;
    for (var i = 0; i < this.data.navList.length; i++) {
      if (i == target) {
        this.data.navList[i].active = true;
      } else {
        this.data.navList[i].active = false;
      }
    };
    var showTarget = e.currentTarget.dataset.status;
    for (var i = 0; i < this.data.allPresentData.length; i++) {
      if (showTarget == 2) {//全部显示
        this.data.allPresentData[i].show = true;
      } else {//显示选择的状态
        if (this.data.allPresentData[i].isgo == showTarget) {
          this.data.allPresentData[i].show = true;
        } else {
          this.data.allPresentData[i].show = false;
        }
      }
      if(showTarget==1){
        this.data.chooseShow=true;
        if (this.data.allPresentData[i].status == 8) {//选择已购买时不显示赠送中的数据
          this.data.allPresentData[i].show = false;
        }
      }else{
        this.data.chooseShow = false
      }
      if (showTarget == 3){//显示赠送中状态数据
        if (this.data.allPresentData[i].status == 8 && this.data.allPresentData[i].isgo==1) {
          this.data.allPresentData[i].show = true;
        }
      }
    }
    this.setData({
      navList: this.data.navList,
      allPresentData: this.data.allPresentData,
      chooseShow: this.data.chooseShow
    })
  },
  selectAll: function () {
    if (this.data.selectAll == false) {
      const length = this.data.allPresentData.length;
      for (let i = 0; i < length; i++) {
        this.data.allPresentData[i].selectFlag = true;
      };
      this.data.selectAll = true;
      this.setData({
        allPresentData: this.data.allPresentData,
        selectAll: this.data.selectAll
      })
    } else {
      const length = this.data.allPresentData.length;
      for (let i = 0; i < length; i++) {
        this.data.allPresentData[i].selectFlag = false;
      };
      this.data.selectAll = false;
      this.setData({
        allPresentData: this.data.allPresentData,
        selectAll: this.data.selectAll
      })
    }
  },
  detail:function(e){
    console.log(e)
    var i = e.currentTarget.dataset.id,
      type = e.currentTarget.dataset.type,
      status = e.currentTarget.dataset.status;
    if (type == 14 || status == 6 || status == 7 || status==8){
      return false;
    }else{
      console.log(this.data.allPresentData[i])
      var cardpayid = this.data.allPresentData[i].id,
          presentId = this.data.allPresentData[i].gcid;
      wx.navigateTo({
        url: 'giftDetail?cardpayid=' + cardpayid + '&presentId=' + presentId,
      })
    }
  },
  send:function(){
    if (this.data.selectTotal==0){
      wx.showToast({
        title: '请先选择要赠送的礼品卡',
        icon: 'none',
        duration: 2000
      });
    }else{
      wx.showLoading({
        title: '加载中',
      })
      var ids = [];
      for (var i = 0; i < this.data.allPresentData.length; i++) {
        if (this.data.allPresentData[i].selectFlag == true) {
          ids.push(this.data.allPresentData[i].id)
        }
      }
      console.log(ids);
      getApp().globalData.allids = ids;
      wx.request({
        url: 'https://np.pigcms.com/cashier/merchants.php?m=Api&c=wxadoc&a=send_gift',
        data: {
          mid: getApp().globalData.mid,
          openid: getApp().globalData.openid,
          unionid: getApp().globalData.unionid,
          appid: 'wxf3a9a02997b0c4b9',
          ids: ids
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
            url: '../send/sendGift',
          })
        },
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://np.pigcms.com/cashier/merchants.php?m=Api&c=wxadoc&a=use_gift',
      data: {
        mid: getApp().globalData.mid,
        openid: getApp().globalData.openid,
        unionid: getApp().globalData.unionid,
        appid: 'wxf3a9a02997b0c4b9',
        tempnum: options.tempnum
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success:function(res){
        wx.hideLoading();
        console.log(res);
        var allPresentData = res.data.err_msg.allPresentData;          
        for (var i = 0; i < allPresentData.length;i++){
          allPresentData[i].addtime = time.formatTime(parseInt(allPresentData[i].addtime), 'Y-M-D h:m:s')         
        }
        that.setData({
          allPresentData: allPresentData
        })
        console.log(that.data.allPresentData)
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
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})