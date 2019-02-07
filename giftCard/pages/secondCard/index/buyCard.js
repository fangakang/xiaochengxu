//logs.js
const app = getApp()
Page({
  data: {
	  containShow:false,//页面数据加载完之后展示
      detailMsg:{},//页面详情数据
      detailNum:[],//购买的次卡次数
	  is_store:1,//平台or 单店
	  id:'',//次卡id
	  tipIndex:'',//次数选中的下表
	  cishu:'',//次数
	  price:''//价格
  },
  buyNow:function(event){
    var that=this;
    var cishu=that.data.cishu;
    var price=that.data.price;
    var params={
	    unionid:app.globalData.unionid,
	    pigcms_id:app.globalData.pigcms_id,
	    openid:app.globalData.openid,
	    mid:app.globalData.extMid,
	    is_store:that.data.is_store,
	    cishu:cishu,
	    price:price,
        id:that.data.id,
        appid:app.globalData.appid
    }
    app.ajax('POST',params,'?m=Api&c=wxadoc&a=cardSecondPay',function (data) {
	    var data = data.data.err_msg;
	    wx.hideLoading();
	    console.log(data);
	    wx.requestPayment({
		    'timeStamp': data.timeStamp,
		    'nonceStr' : data.nonceStr,
		    'package'  : data.package,
		    'signType' : data.signType,
		    'paySign'  : data.paySign,
		    'success'  : function (res) {
			    wx.showToast({
				    title: '支付成功',
				    icon : 'none'
			    });
			    wx.navigateTo({
				    url:'buyDetail?id='+that.data.id
			    })
		    },
		    'fail'     : function (res) {
			    wx.showToast({
				    title: '支付失败',
				    icon : 'none'
			    });
		    }
	    })
    })
    // wx.navigateTo({
    //   url: 'buyDetail',//页面数据加载完之后展示
    //
    // })
  },
    //点击次数
	choceNum:function (event) {
        var index=event.currentTarget.dataset.index;
		var cishu=event.currentTarget.dataset.cishu;//次数
		var price=event.currentTarget.dataset.price;//价格
		var total=event.currentTarget.dataset.total;//买了多少张
		var limit=event.currentTarget.dataset.limit;//限购多少张
		if(total>=limit && limit!='0' && limit!='undefined'){
			return false;
		}
        this.setData({
	        tipIndex:index,//设置下标为点击的下标
	        cishu:cishu,//次数
	        price:price,//价格
        })
	},
    // 页面初始化
    init:function () {
      var that=this;
      var params={
	      unionid:app.globalData.unionid,
	      pigcms_id:app.globalData.pigcms_id,
	      mid:getApp().globalData.extMid,
	      is_store:that.data.is_store,
	      id:that.data.id,
      }
	    app.ajax('POST',params,'?m=Api&c=wxadoc&a=secondDetail',function (data) {
		    wx.hideLoading();
	      if(data.data.err_code){
		      wx.showToast({
			      title:data.data.err_msg,
			      icon:'none'
		      });
          }else{
	        that.setData({
		        detailMsg:data.data.err_msg,
		        detailNum:data.data.err_msg.stall,
		        containShow:true,//数据加载完成，页面展示
		        cishu:data.data.err_msg.stall[0].s,
		        price:data.data.err_msg.stall[0].t,
            })
		      var detailNum=data.data.err_msg.stall;
		      for (var i=0;i<detailNum.length;i++){
		      	if(detailNum[i].l-detailNum[i].total>0 || detailNum[i].l=='0' || detailNum[i].l=='undefined'){
			        that.setData({
				        tipIndex:i,
				        cishu:detailNum[i].s,
				        price:detailNum[i].t,
			        })
			        console.log(that.data.tipIndex)

			        return;
		        }

		      }
		      wx.setNavigationBarTitle({//动态设置导航栏标题
			      title:data.data.err_msg.title
		      })
		      console.log(data.data.err_msg.title);
          }
            console.log(that.data.detailNum[0].m=='1');
	    })
    },
  onLoad: function (option) {
    console.log(option);
    this.setData({
        id:option.id,
    })
     this.init();
	  var pages=getCurrentPages();
	  var prevPage=pages[pages.length-2]//获取上一个页面信息栈
	  console.log(pages,prevPage,1234321)
  }
})
