Page({

  /**
   * 页面的初始数据
   */
  data: {
    giftList:[],
    cardDetail:[],
    giveUser:[],
    recoedd:[],
    card:true,
    hanum:0,
    total:0,
  },
  add0:function(m){
    return m < 10 ? '0' + m : m
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.card)
    var that=this;
    if (options.card==2){
      that.setData({
        card: true
      })
    }else{
      that.setData({
        card: false
      })
    }
    
    wx.request({
      url: 'https://np.pigcms.com/cashier/merchants.php?m=Api&c=wxadoc&a=allGetCard',
      data: {
        from:options.from,
        send_unionid: options.send_unionid,//赠送人的unionid
        smallflag: options.smallflag,
        allids: getApp().globalData.allids,
        mid: getApp().globalData.mid,
        openid: getApp().globalData.openid,
        unionid: getApp().globalData.unionid,//领取人的unionid
        appid: 'wxf3a9a02997b0c4b9',
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        var giftList = res.data.err_msg.dataDetail;
        for(var i=0;i<giftList.length;i++){//将时间戳转化为时间
          var timestamp = parseInt(giftList[i].addtime)*1000,
              time = new Date(timestamp),
              year = time.getFullYear(),
              month = time.getMonth() + 1,
              date = time.getDate(),
              hours = time.getHours(),
              minutes = time.getMinutes(),
              seconds = time.getSeconds();
          giftList[i].addtime = year + '-' + that.add0(month) + '-' + that.add0(date) + ' ' + that.add0(hours) + ':' + that.add0(minutes) + ':' + that.add0(seconds);
        }
        that.setData({
          giftList: giftList,
          giveUser: res.data.err_msg.giveUser,
          recoedd: res.data.err_msg.recoedd,
          hanum: res.data.err_msg.hdnum,
          total: res.data.err_msg.total,
          cardDetail:res.data.err_msg.cardDetail
        })
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