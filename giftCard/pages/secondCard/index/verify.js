//logs.js
import drawQrcode from '../../../utils/weapp.qrcode.min.js'
const app = getApp()
Page({
  data: {
	  authorize:true,//授权弹窗
	  isMember:'',//是不是会员
	  memCard:false,//不是会员先领卡弹出框
	  pigcms_id:'',//得到pigcms_id
	  containShow:false,//页面数据加载完之后展示
	  give_unionid:'',//分享之后传来的参数
	  id:'',//用户次卡id
	  second_id:'',//次卡id
	  flags:'',//进入页面的状态
	  cardMsg:'',//详细的次卡信息,//
	  cardFlag:1,//领卡类型，1为openCard,2为<navigator target="miniProgram" app-id="wxeb490c6f9b154ef9" extra-data="{{data}}">会员卡开卡</navigator>
	  cardExt:{},//领卡数据
	  cardId:'',// 开卡时候微信卡券 Id
	  is_store:1,
	  give_mode:'',//立即领取的分类
	  give_id:'',//立即领取id
	  give_ext:'',//立即领取ext
  },
	onShow:function () {
  	    var that=this;
		if(app.globalData.mid==''){
			app.userInfoReadyCallback = function () {
				that.setData({
					isMember:getApp().globalData.isMember,//是不是会员
					pigcms_id:getApp().globalData.pigcms_id,//得到pigcms_id
				})
				that.init()
			}
		}
		else{
			that.setData({
				isMember:getApp().globalData.isMember,//是不是会员
				pigcms_id:getApp().globalData.pigcms_id,//得到pigcms_id
			})
			that.init()
		}
		wx.getSetting({
			success(res){
				wx.hideLoading();
				if(!res.authSetting['scope.userInfo']){
					that.setData({
						authorize:false,
					})
				}else{
					that.setData({
						authorize:true,
					})
				}
			}
		})
	},
  onLoad: function (option) {
  	console.log(option,234432);
    var that=this;
    var give_unionid=option.give_unionid;
    var id=option.id;
    var second_id=option.second_id;
    that.setData({
	    give_unionid:give_unionid,//分享之后传来的参数
	    id:id,//用户次卡id
	    second_id:second_id,//次卡id
    })

  },
	//点击立即购买
	bugNow:function () {
		var that=this;
		var id=that.data.second_id;
		// var id=366;
		wx.navigateTo({
			url: 'buyCard?id='+id,
		})
	},
	//查看我的其他次卡
	seeMyCard:function () {

		wx.navigateTo({
			url: 'index?tab_index=2',
		})
	},
	// 立即领取
	receive:function () {
  	var that=this;
		// 非会员要先领卡
		if(!this.data.isMember){
			this.setData({
				memCard:true,
			})
		}else{//是会员直接跳转到列表页面
			if(that.data.give_mode=='2'){
				wx.addCard({
					cardList:[
						{
							cardId:that.data.give_id,
							cardExt:that.data.give_ext,
						}
					],
					success:function (res) {
						console.log(res);
						console.log(that.data.give_id,that.data.give_ext);
						var code=res.cardList[0].code;//返回的code是加密的，要调用接口解密，用于openCard
						var params={
							unionid:getApp().globalData.unionid,
							pigcms_id:getApp().globalData.pigcms_id,
							mid:getApp().globalData.extMid,
							is_store:that.data.is_store,
							code:code
						};
						app.ajax('POST',params,'?m=Api&c=wxadoc&a=code',function (data) {
							var code=data.data.err_msg;//返回的code;
							wx.openCard({
								cardList:[
									{
										cardId:that.data.give_id,

										code:code
									}
								]
							})
						})
					}

				})
			}else{
				var params={
					unionid:getApp().globalData.unionid,
					give_unionid:that.data.give_unionid,
					mid:getApp().globalData.extMid,
					is_store:that.data.is_store,
					openid:getApp().globalData.unionid,
					id:that.data.id,
					second_id:that.data.second_id,
				}
				app.ajax('POST',params,'?m=Api&c=wxadoc&a=giveGetSecond',function (data) {
					wx.hideLoading();

					var data=data.data;
					if(data.err_code){
						wx.showToast({
							title:data.err_msg,
							icon:'none'
						});
					}else{
						console.log(that.data.second_id,33333333333)
						wx.showToast({
							title:data.err_msg,
							icon:'none'
						});
						wx.navigateTo({
							url:'buyDetail?id='+that.data.second_id
						})
					}
				})
			}

		}
	},
	//领卡点击取消
	cardClose:function () {
		this.setData({
			memCard:false,
		})
	},
//点击领卡
	cardSure:function () {
		var that=this;
		wx.addCard({
			cardList:[
				{
					cardId:that.data.cardId,
					cardExt:that.data.cardExt,
				}
			],
			success:function (res) {
				console.log(res,234444444)
				var code=res.code;//返回的code是加密的，要调用接口解密，用于openCard
				var params={
					unionid:getApp().globalData.unionid,
					pigcms_id:getApp().globalData.pigcms_id,
					mid:getApp().globalData.extMid,
					is_store:that.data.is_store,
					code:code
				};
				app.ajax('POST',params,'?m=Api&c=wxadoc&a=code',function (data) {
					var code=data.data.err_msg;//返回的code;
					wx.openCard({
						cardList:[
							{
								cardId:that.data.cardId,

								code:code
							}
						]
					})
				})
			}

		})
	},
    //初始化方法
    init:function () {
        var that=this;
	    var params={
            unionid:getApp().globalData.unionid,
            give_unionid:that.data.give_unionid,
            mid:getApp().globalData.extMid,
            is_store:that.data.is_store,
            openid:getApp().globalData.unionid,
            id:that.data.id,
            second_id:that.data.second_id,

		    // unionid:getApp().globalData.unionid,
		    // give_unionid:'owKaU1NNX2KW16WdBVpCbCZhlmFI',
		    //  mid:getApp().globalData.extMid,
		    // is_store:1,
		    // id:11196417,
		    // second_id:249,
		    // openid:"osBNG467ZpfFrDt_VIBfPosjjHTw"
	    };
        app.ajax('POST',params,'?m=Api&c=wxadoc&a=getSecondGet',function (res) {
        	var data=res.data;
        	console.log("$$$$$$$$$$$$$");
	        console.log(data,getApp().globalData.unionid,that.data.give_unionid);
	        console.log("$$$$$$$$$$$$$");
        	wx.hideLoading();
        	if(data.flags==0){
		        that.setData({
			        flags:data.flags,//进入页面的状态
			        flags_text:data.err_msg,
			        cardMsg:data.err_dom,
			        cardExt:data.err_msg.cardExt1,//领卡数据
			        cardId:data.err_msg.cardinfo.wxcard_id,//领卡的id
			        cardFlag:data.err_msg.cardFlag,
			        give_mode:data.err_dom.give_mode,//立即领取模式
			        give_id:data.err_dom.card_id,//立即领取id
			        give_ext:data.err_msg.cardExt12,//立即领取ext
		        })
		        if(data.err_dom.give_mode=='2'){
			        that.setData({
				        give_id:data.err_dom.card_id,//立即领取id
				        give_ext:data.err_msg.cardExt12,//立即领取ext
			        })
		        }
	        }else{
		        that.setData({
			        flags:data.flags,//进入页面的状态
			        flags_text:data.err_msg,
			        cardMsg:data.err_dom,
		        })
	        }

	        wx.setNavigationBarTitle({//动态设置导航栏标题
		        title:data.err_dom.title
	        })

        })
        that.setData({
	        containShow:true
        })
    },
	onHide:function () {
		this.setData({
			memCard:false,
		})
	}
})
