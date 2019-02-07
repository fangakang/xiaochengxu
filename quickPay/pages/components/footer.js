// pages/components/footer.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      pageNum:{
        type:Number,
        value:1
      }
  },

  /**
   * 组件的初始数据
   */
  data: {
    page: 1
  },

  /**
   * 组件的方法列表
   */
  methods: {
    index:function(){
      var that=this;
      if(that.data.pageNum==1){
        return;
      }else{
        wx.redirectTo({
          url: '../index/index',
        })
      }
      
    },
    my:function(){
      var that = this;
      if (that.data.pageNum == 2) {
        return;
      } else {
        wx.redirectTo({
          url: '../index/my',
        })
      }
    }
  }
})
