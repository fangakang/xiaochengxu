Page({

  /**
   * 页面的初始数据
   */
  data: {
    authorize: true,
    allCard:[],//可用
    noallCard:[],//不可用
    viewFail:false,
    is_store:1,
    merdesc:'',
    introduce: false,
    page:1,
    count:0,
    npcoutn:0,
    pullShow:false,
    loadAll:false,
    noAvlData: false,
    noFailData: false,
    scrollTop:0,
    loadComplete:false
  },
  // showDetail:function(e){
  //   var target=e.currentTarget.dataset.id
  //   for (var i = 0; i < this.data.recordList.length;i++){
  //     if(target==i){
  //       if (this.data.recordList[i].detailFlag == false){
  //         this.data.recordList[i].detailFlag=true;
  //       }else{
  //         this.data.recordList[i].detailFlag = false;
  //       }
  //     }    
  //   }
  //   this.setData({
  //     recordList: this.data.recordList
  //   })
  // },
  loadMore:function(){
    var that=this;
    if(!that.data.loadAll){//尚未全部加载
      if(!that.data.viewFail){
        that.data.page++;
        that.setData({
          pullShow: true,
          page: that.data.page
        })
        that.myCardPackage()
      }
    }
  },
  showMask: function () {
    // this.setData({
    //   introduce: true
    // })
    var that=this;
    wx.showModal({
      title: '商家介绍',
      content: that.data.merdesc,
      confirmText: '我知道了',
      showCancel: false,
      success: function (res) {

      }
    })
  },
  closeMask: function (e) {
    this.setData({
      introduce: false
    })
  },
  viewFail:function(e){//查看失效
    this.setData({
      viewFail:true,
      scrollTop:0
    });
  },
  viewUse: function (e) {//查看可用
    this.setData({
      viewFail: false,
      scrollTop: 0
    });
  },
  use: function (e) {//使用
    wx.navigateTo({
      url: '../userCenter/useBalance?gcid=0',
    })
  },
  nextPage:function(e){
    console.log(e)
    var that=this;
    var target=e.currentTarget.dataset.id;
    var tempnum,
        id,
        gcid;
    for(var i=0;i<that.data.allCard.length;i++){
      if(i==target){
        tempnum = that.data.allCard[i].tempnum;
        gcid = that.data.allCard[i].gcid,
          id = that.data.allCard[i].id;
      }
    }
    that.setData({
      page: 1
    })
    getApp().globalData.presentId=gcid;
    getApp().globalData.cardpayid =id;
    wx.navigateTo({
      url: 'giftDetail'
    })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    // var merdesc = options.merdesc;
    // merdesc = merdesc.split('ptiegsctmstest')
    // this.setData({
    //   merdesc: merdesc
    // })
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
    wx.showLoading({
      title: '加载中',
    });
    wx.setNavigationBarTitle({
      title: '我的卡包'
    });
    var that=this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          that.setData({
            authorize: false
          });
          wx.hideLoading();
          return false;
        } else {
          that.setData({
            authorize: true
          })
          that.myCardPackage();
        }
      }
    });
   
  },
  myCardPackage:function(){
    var that=this;
    if(that.data.page==1){
      that.setData({
        allCard: [],
      })
    }
    wx.request({
      url: getApp().globalData.urlHead +'/cashier/merchants.php?m=Api&c=wxadoc&a=myCardPackage',
      data: {
        mid: getApp().globalData.mid,
        openid: getApp().globalData.openid,
        unionid: getApp().globalData.unionid,
        appid: getApp().globalData.appid,
        latitude: getApp().globalData.latitude,
        longitude: getApp().globalData.longitude,
        is_store: getApp().globalData.is_store,
        page:that.data.page,
        num:16
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        wx.hideLoading();
        console.log(res);
        // that.setData({
        //   loadComplete: true
        // })
        if (res.data.err_msg.count<=8){
          that.setData({
            loadAll: true
          })
        }
        if (res.data.err_msg.count == 0){//可用礼品卡为0
        console.log('noData')
          that.setData({
            noAvlData: true,
            loadComplete: true
          })
        }
        console.log(that.data.noAvlData)
        if (res.data.err_msg.npcoutn == 0){//不可用礼品卡为0
          that.setData({
            noFailData: true,
            loadComplete: true
          })
        }
        var noallCard = res.data.err_msg.noallCard;
        that.setData({
          noallCard: noallCard,
          npcoutn: res.data.err_msg.npcoutn,
        })
        if (res.data.err_msg.allCard == '') {//已全部加载
          that.setData({
            loadAll: true,
            pullShow: false,
          })
          return;
        }
        var allCard = res.data.err_msg.allCard;
        for(var i=0;i<allCard.length;i++){
          allCard[i].price=parseFloat(allCard[i].price)
        }
        that.setData({
          allCard: that.data.allCard.concat(allCard),
          is_store:getApp().globalData.is_store,
          count:res.data.err_msg.count,
          pullShow:false,
          merdesc: res.data.err_msg.merdesc,
          loadComplete: true
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      allCard: [],
      available: 0,
      notAvailable: 0,
      viewFail:false,
      page:1,
      loadAll:false,
      noAvlData: false,
      noFailData: false,
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      allCard:[],
      available: 0,
      notAvailable: 0,
      page: 1,
      noAvlData: false,
      noFailData: false,
    })
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