// pages/component/authorize.js
var app=getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    modalHidden: {
      type: Boolean,
      value: true
    },
  },
  /**
   * 组件的初始数据
   */
  data: {

  },
  
  /**
   * 组件的方法列表
   */
  methods: {
    bindGetUserInfo: function (e) {
      console.log(e)
      if (e.detail.errMsg =='getUserInfo:fail auth deny'){
        this.setData({
          modalHidden: false,
        })
        wx.hideLoading();
      }else{
        app.getInfo();
        wx.switchTab({
          url: '/pages/index/index',
        })
      }      
    },
    modal_click_Hidden:function(){
      this.setData({
        modalHidden: true,
      })
      wx.showLoading({
        title: '加载中...',
      })  
    }
  }
})
