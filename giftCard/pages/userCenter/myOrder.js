var time = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navList:[
      { name: '全部', active: true, status:'',is_pay:''},
      { name: '待付款', active: false, status: 1,is_pay:0},
      { name: '已完成', active: false, status:'',is_pay:1},
      // { name: '已退款', active: false, status: 3},
      { name: '已取消', active: false, status: 2,is_pay:''},
    ],
    allOrder:[],
    page:1,
    status:'',
    ispay:'',
    paytime:'',
    status:'',
    index:'',
    id:''
  },
  select:function(e){
    console.log(e)
    var that=this;
    var index = e.currentTarget.dataset.id,
        status=e.currentTarget.dataset.status,
        ispay = e.currentTarget.dataset.pay;
    for (var i = 0; i < that.data.navList.length;i++){
      if(i==index){
        that.data.navList[i].active=true;
      }else{
        that.data.navList[i].active= false;
      }
    }
    that.setData({
      status:status,
      ispay:ispay,
      page:1,
      allOrder:[],
      navList:that.data.navList
    })
    that.orderAgain();
  },
  cancle:function(e){//取消订单
    var that=this;
    var status=that.data.status,
        index = that.data.index,
        id = that.data.id,
        formId=e.detail.formId;
        console.log(formId)
    wx.showModal({
      title: '确定取消订单？',
      confirmColor:'#f24c36',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: getApp().globalData.urlHead +'/cashier/merchants.php?m=Api&c=wxadoc&a=updateStauts',
            data: {
              mid: getApp().globalData.mid,
              openid: getApp().globalData.openid,
              unionid: getApp().globalData.unionid,
              appid: getApp().globalData.appid,
              status: 2,
              id:id,
              formId:formId
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: 'POST',
            success:function(res){
              console.log(res)
             
              that.data.allOrder[index].status=2
              
              that.setData({
                allOrder:that.data.allOrder
              })
            }

          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  getStatus:function(e){
    var status = e.currentTarget.dataset.status,
      index = e.currentTarget.dataset.index,
      id = e.currentTarget.dataset.id;
      this.setData({
        status:status,
        index: index,
        id:id
      })
  },
  deleteOrder:function(e){//删除订单
    var that = this;
    var status = e.currentTarget.dataset.status,
      index = e.currentTarget.dataset.index,
      id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除订单？',
      content: '删除之后订单无法恢复，我的活动参与相关记录也将同步删除',
      confirmColor: '#f24c36',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: getApp().globalData.urlHead +'/cashier/merchants.php?m=Api&c=wxadoc&a=updateStauts',
            data: {
              mid: getApp().globalData.mid,
              openid: getApp().globalData.openid,
              unionid: getApp().globalData.unionid,
              appid: getApp().globalData.appid,
              status: 3,
              id: id
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: 'POST',
            success: function (res) {
              console.log(res)
              that.data.allOrder.splice(index,1)
              that.setData({
                allOrder: that.data.allOrder
              })
            }

          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  pay:function(e){
    var that=this;
    var id = e.currentTarget.dataset.id;
    wx.request({
      url: getApp().globalData.urlHead +'/cashier/merchants.php?m=Api&c=wxadoc&a=payAgain',
      data: {
        mid:getApp().globalData.mid,
        id:id,      
        openid: getApp().globalData.openid,
        unionid: getApp().globalData.unionid,
        appid: getApp().globalData.appid
      },

      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        getApp().globalData.orderid = res.data.err_dom;
        console.log(res);
        wx.requestPayment({
          timeStamp: res.data.err_msg.timeStamp,
          nonceStr: res.data.err_msg.nonceStr,
          package: res.data.err_msg.package,
          signType: 'MD5',
          paySign: res.data.err_msg.paySign,
          success: function (res) {
            console.log(res)
            for (var i = 0; i < that.data.allOrder.length;i++){
              if (that.data.allOrder[i].id==id){
                that.data.allOrder[i].ispay=1
              }
            }
            that.setData({
              allOrder:that.data.allOrder
            })
          },
          fail: function (res) {
            console.log(123)
            console.log(res)
          }
        })
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
  lower: function (e) {//下拉刷新
    this.data.page++;
    this.setData({
      page:this.data.page
    })
    this.orderAgain()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function(){
      that.orderAgain();
    },5000)
  },
  orderAgain:function(){//页面初始化
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: getApp().globalData.urlHead +'/cashier/merchants.php?m=Api&c=wxadoc&a=orderAgain',
      data: {
        mid: getApp().globalData.mid,
        openid: getApp().globalData.openid,
        unionid: getApp().globalData.unionid,
        appid: getApp().globalData.appid,
        page:that.data.page,
        status: that.data.status,
        ispay: that.data.ispay
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        wx.hideLoading();
        console.log(res)
        var allOrder = res.data.err_msg.allOrder;
        for (var i = 0; i < allOrder.length; i++) {
          allOrder[i].orderaddtime = time.formatTime(parseInt(allOrder[i].orderaddtime), 'Y-M-D h:m:s')
        }
        that.setData({
          allOrder: that.data.allOrder.concat(allOrder)
        })
        that.toPaid();
      }
    })
  },
  toPaid:function(){//待付款倒计时
    var that=this;
    for (var i = 0; i < that.data.allOrder.length;i++){
      if (that.data.allOrder[i].ispay == 0 && that.data.allOrder[i].status == 1){
        that.setData({
          allOrder: that.data.allOrder
        })
        var endTime = parseInt(that.data.allOrder[i].add_time) + 1800;
        var nowTime = new Date().getTime() / 1000;
        var seconds = endTime - nowTime;
        if (seconds <= 0) {
          that.data.allOrder[i].status = 2;
          that.setData({
            allOrder: that.data.allOrder
          })
        }
        var hour = Math.floor(seconds / 60 / 60);
        var minute = Math.floor(seconds / 60 % 60);
        var second = Math.floor(seconds % 60);
        if (hour < 10) {
          hour = '0' + hour
        };
        if (minute < 10) {
          minute = '0' + minute
        };
        if (second < 10) {
          second = '0' + second
        };
        that.data.allOrder[i].paytime = hour + '：' + minute + '：' + second;
        that.setData({
          allOrder: that.data.allOrder
        })
      }
    }
    setTimeout(function(){
      that.toPaid();
    },1000)
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