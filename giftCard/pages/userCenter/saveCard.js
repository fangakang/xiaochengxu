var time = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    authorize: true,
    loadComplete:false,
    navList: [
      { name: '全部', active: true, status: 2 },
      { name: '已购买', active: false, status: 1 },
      { name: '已收到', active: false, status: 0 },
    ],
    allPresentData:[],
    chooseShow:false,
    selectAll:false,
    selectTotal:0,
    gcid:'',
    page:1,
    tempnum:'',
    outid:'',
    buy:false,
    pullShow:false,
    is_store:0,
    loadAll:false,
    noData:false,
    orderList: [],
    receiveOrder:true,
    activityOrder:false
  },
  activityOrder:function(){
    this.setData({
      receiveOrder: false,
      activityOrder: true
    })
    this.activityList()
  },
  activityList: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: getApp().globalData.urlHead + '/cashier/merchants.php?m=Api&c=wxadoc&a=activityList',
      data: {
        mid: getApp().globalData.mid,
        openid: getApp().globalData.openid,
        unionid: getApp().globalData.unionid,
        appid: getApp().globalData.appid,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        wx.hideLoading();
        console.log(res)
        that.setData({
          orderList: res.data.err_msg.data
        })
      }
    })
  },
  receiveOrder:function(){
    this.setData({
      receiveOrder: true,
      activityOrder: false
    })
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
    console.log(e)
    var target = e.currentTarget.dataset.id;
    for (var i = 0; i < this.data.navList.length; i++) {
      if (i == target) {
        this.data.navList[i].active = true;
      } else {
        this.data.navList[i].active = false;
      }
    };
    var showTarget = e.currentTarget.dataset.status;
    var outid=''
    if (showTarget == 2){//显示全部
      outid=''
    }
     
     if (showTarget == 1){//显示已购买
       this.data.chooseShow = true;
       this.data.buy=true;
       outid = 5;
       for (var i = 0; i < this.data.allPresentData.length;i++){
          if (this.data.allPresentData[i].status == 8) {//选择已购买时不显示赠送中的数据
            this.data.allPresentData[i].show = false;
          } 
       }
         
    } else {
      this.data.chooseShow = false;
      this.data.buy=false;
     }

    if (showTarget == 0){//显示已收到
      outid=14;
    }
    this.setData({
      navList: this.data.navList,
      chooseShow: this.data.chooseShow,
      page: 1,
      outid: outid,
      allPresentData: [],
      buy:this.data.buy
    })
    this.useGift();
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
    // if (type == 14 || status == 6 || status == 7 || status==8){
    //   return false;
    // }else{
      console.log(this.data.allPresentData[i])
      var cardpayid = this.data.allPresentData[i].id,
          presentId = this.data.allPresentData[i].gcid,
          order_no = this.data.allPresentData[i].order_no;
      if (this.data.allPresentData[i].smallflag == '' && this.data.allPresentData[i].outid != 14){
        wx.navigateTo({
          url: 'orderDetail?cardpayid=' + cardpayid + '&presentId=' + presentId + '&gcid=' + presentId + '&count=1&order_no=' + order_no,
        })
      } else if (this.data.allPresentData[i].smallflag != '' && this.data.allPresentData[i].outid==14){
        wx.navigateTo({
          url: '../send/receiveList?send_unionid=&card=2&userFlag=1&smallflag=' + this.data.allPresentData[i].smallflag +'&myRecord=1',
        })
      } else if (this.data.allPresentData[i].smallflag == '' && this.data.allPresentData[i].outid == 14){
        return;
      }
      
    //}
  },
  send:function(){
    var that=this;
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
      var ids = [],
          count=0;
      for (var i = 0; i < this.data.allPresentData.length; i++) {
        if (this.data.allPresentData[i].selectFlag == true) {
          ids.push(this.data.allPresentData[i].id)
          that.setData({
            gcid: that.data.allPresentData[i].gcid
          })
          count++;
        }
      }
      console.log(ids);
      getApp().globalData.allids = ids;
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
        success: function (res) {
          wx.hideLoading();
          getApp().globalData.sendData = res.data.err_msg
          console.log(res)
          wx.navigateTo({
            url: '../send/sendGift?gcid='+that.data.gcid+'&count='+count,
          })
        },
      })
    }
  },
  lower: function (e) {//下拉刷新
    if (!this.data.loadAll && this.data.receiveOrder){//获取记录下拉刷新
      this.data.page++;
      this.setData({
        page: this.data.page,
        pullShow: true
      })
      this.useGift()
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this;
    wx.showLoading({
      title: '加载中',
    })
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          that.setData({
            authorize: false
          });
          wx.hideLoading();
          return;
        } else {
          that.setData({
            authorize: true
          })
          that.setData({
            is_store: getApp().globalData.is_store
          });
          if (that.data.is_store == 1) {
            wx.setNavigationBarTitle({
              title: '我的记录'
            })
          }
          if (getApp().globalData.mid == '') {
            getApp().userInfoReadyCallback = function () {
              that.useGift();
            }
          }
          else {
            that.useGift();
          }
        }
      }
    });
   
  },
  useGift:function(){
    console.log(getApp().globalData.urlHead)
    wx.showLoading({
      title: '加载中',
    })
    var that=this;
    wx.request({
      url: getApp().globalData.urlHead +'/cashier/merchants.php?m=Api&c=wxadoc&a=use_gift',
      data: {
        mid: getApp().globalData.mid,
        openid: getApp().globalData.openid,
        unionid: getApp().globalData.unionid,
        appid: getApp().globalData.appid,
        tempnum: that.data.tempnum,
        page:that.data.page,
        outid:that.data.outid,
        is_store:that.data.is_store
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        wx.hideLoading();
        console.log(res);
        if (that.data.page != 1 &&res.data.err_msg.allPresentData==''){//全部加载完成
          that.setData({
            loadAll:true
          })
        }
        if (that.data.page == 1 && res.data.err_msg.allPresentData == ''){//没有数据
          that.setData({
            noData: true
          })
        }
        var allPresentData = res.data.err_msg.allPresentData;
        for (var i = 0; i < allPresentData.length; i++) {
          allPresentData[i].addtime = time.formatTime(parseInt(allPresentData[i].addtime), 'Y-M-D h:m:s')
        }
        that.setData({
          allPresentData: that.data.allPresentData.concat(allPresentData),
          pullShow:false,
          loadComplete:true
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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      loadComplete:false,
      allPresentData:[],
      page:1,
      loadAll: false
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
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})