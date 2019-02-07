//logs.js
const app = getApp()
Page({
  data: {
      id:'',//次卡id
      is_store:1,//单门店
      record:[],//明细数据
      page:1,//页数
	  emptyList:false,//列表是空的
  },
    // 下拉加载
	listMore:function () {

		if(!this.data.emptyList){
			this.init();
		}
	},
    // 初始化函数
    init:function () {
	    var that=this;
	    var params={
		    unionid:app.globalData.unionid,
		    openid:app.globalData.openid,
		    is_store:that.data.is_store,
		    mid:getApp().globalData.extMid,
		    id:that.data.id,
		    page:that.data.page,
	    }
	    app.ajax('POST',params,'?m=Api&c=wxadoc&a=uSecondDetailAjax',function (res) {
		    wx.hideLoading();
		    var data=res.data;
		    console.log(data);
		    if(data.err_code){
			    wx.showToast({
				    title:data.err_msg,
				    icon:'none'
			    })
		    }else{
			    if(data.err_msg.length<=0){//没有数据了
				    that.setData({
					    emptyList:true
				    })
				    return false;
			    }
			    that.setData({
				    record:that.data.record.concat(data.err_msg),
				    page:++that.data.page
			    })
		    }
	    })
    },

  onLoad: function (option) {
    var that=this;
    this.setData({
        id:option.id
    })
      that.init();
  }
})
