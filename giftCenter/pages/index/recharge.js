Page({

  /**
   * 页面的初始数据
   */
  data: {
    priceList:[
      { oldPrice: 10, offerPrice: 9.96,  flag: true },
      { oldPrice: 20, offerPrice: 19.96, flag: false },
      { oldPrice: 30, offerPrice: 29.60, flag: false },
      { oldPrice: 50, offerPrice: 49.96, flag: false },
      { oldPrice: 100, offerPrice: 99.60, flag: false },
      { oldPrice: 300, offerPrice: 299.80, flag: false },
    ]
  },
  select:function(e){
    var target = e.currentTarget.dataset.id;
    for(var i=0;i<this.data.priceList.length;i++){
      if(i==target){
        this.data.priceList[i].flag=true;
      }else{
        this.data.priceList[i].flag = false;
      }
    };
    this.setData({
      priceList:this.data.priceList
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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