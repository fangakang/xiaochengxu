Page({

  /**
   * 页面的初始数据
   */
  data: {
    receive:false,
    received:false,
    receiveOver:false,
    expired:false,
    smallflag:'',
    shareImg:'',
    photo:'',
    nickName:'',
   send_unionid:'',
   seeOther:false
  },
  openList:function(){
    this.getCard(2)
  },
  seeList:function(){
    this.getCard(1)
  },
  personReceive:function(){
    wx.navigateTo({
      url: 'receiveList?card=1&smallflag=' + this.data.smallflag + '&send_unionid=' + this.data.send_unionid + '&from=0'
    })
  },
  getCard:function(flag){
    var that=this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://np.pigcms.com/cashier/merchants.php?m=Api&c=wxadoc&a=getCard',
      data: {
        smallflag: that.data.smallflag,
        allids: getApp().globalData.allids,
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
        wx.navigateTo({
          url: 'receiveList?card=' + flag+'&smallflag=' + that.data.smallflag + '&send_unionid=' + that.data.send_unionid+'&from='+flag,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.setData({
      smallflag: options.smallflag,
      send_unionid: options.unionid
    })
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://np.pigcms.com/cashier/merchants.php?m=Api&c=wxadoc&a=userGet',
      data: {
        smallflag: options.smallflag,
        allids: getApp().globalData.allids,
        mid: getApp().globalData.mid,
        openid: getApp().globalData.openid,
        unionid: getApp().globalData.unionid,
        appid: 'wxf3a9a02997b0c4b9',
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success:function(res){
        console.log(123)
        console.log(res)
        var receive = false,
            received = false,
            receiveOver = false,
            expired = false;
        if(res.data.err_msg.userFlag==1){//已领取
          received=true;
          
        }else if (res.data.err_msg.userFlag==4){//已领完
          receiveOver=true;
        } else if (res.data.err_msg.userFlag == 3){//已过期
          expired = true;
        }else{
          receive = true
        }
        that.setData({
          receive: receive,
          received: received,
          receiveOver: receiveOver,
          expired: expired,
          photo:res.data.err_msg.userDetail.avatarurl,
          nickName: res.data.err_msg.userDetail.nickname
        })
        console.log(that.data)
        wx.hideLoading();
      }
    })
    if (options.unionid == getApp().globalData.unionid){
      that.setData({
        seeOther:true
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