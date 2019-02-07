// pages/components/footer.js
var app=getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    pageNum:{
      type:Number,
      value:'1'
    }
  },
  
  /**
   * 组件的初始数据
   */
  data: {
    page:1
  },
  /**
   * 组件的方法列表
   */
  methods: {
    queryMultipleNodes: function () {
      var query = wx.createSelectorQuery().in(this)
      query.select('#footer').boundingClientRect(function (res) {
        app.globalData.footHeight = res.height;
      }).exec()
    },
    index:function(){
      var that=this;
      if (that.data.pageNum==1){
        return;
      }
      wx.redirectTo({
          url: '../index/index',
        })
    },
    privilege:function(){
      var that = this;
      if (that.data.pageNum == 4) {
        return;
      }
      wx.redirectTo({
        url: '../index/privilege',
      })
    },
    search:function(){
      var that = this;
      if (that.data.pageNum == 2) {
        return;
      }
      wx.redirectTo({
        url: '../index/searchPage',
      })
    },
    my:function(){
      var that = this;
      if (that.data.pageNum == 3) {
        return;
      }
      wx.redirectTo({
          url: '../index/personPage',
        })
    }
  }
})
