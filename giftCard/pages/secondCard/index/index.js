//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
  	https:app.globalData.https,
	  isMember:false,//是否是会员，
	  page:1,//数据的页数
	  tab_index:1,//顶部切换，点击的是哪个
    useCard:true,//使用中的次卡和过期的次卡的显示与否
	memCard:false,//不是会员先领卡弹出框
    authorize:true,
	containShow:false,//页面数据加载完之后展示
	 pigcms_id:4055,
	 is_store:1,
	cardList:[],//次卡的列表数据
	  noList:false,//数据列表有没有到头
	  emptyList:false,//列表是空的
	  id:'',//当前次卡的id，用于点击购买，次卡详情页面
	  cardFlag:1,//领卡类型，1为openCard,2为<navigator target="miniProgram" app-id="wxeb490c6f9b154ef9" extra-data="{{data}}">会员卡开卡</navigator>
	  cardExt:{},//领卡数据
	  cardId:'',// 开卡时候微信卡券 Id
	  hasImg:'',//有没有上传图像
	  // 图片上传
	  uploadWrap:{
		  uploadModal:false,//弹窗不打开
		  uploadShow:false,//显示上传按钮
		  uploadSrc:'',//上传图片的路径
	  },
  },
	// 点击去上传
	upImg:function () {
  	    var uploadModal='uploadWrap.uploadModal';
		this.setData({
			[uploadModal]:true,
		})
	},
	//点击切换tab
	tabClick:function (event) {
    console.log(event)
		this.setData({
			tab_index:event.target.dataset.index//设置tab的切换
		})
		var tab_index=this.data.tab_index;
		// 调用列表接口
		this.init(tab_index,0);
		if(tab_index!=1){
			wx.hideShareMenu();
		}else{
			wx.showShareMenu({
				withShareTicket: true
			})
		}
	},
  //事件处理函数
  //   查看使用中和过期的次卡的切换
  seeCard:function () {
      this.setData({
	      useCard:!this.data.useCard
      })
  },
	// 下拉加载
	listMore:function(){
  	if(!this.data.noList){
	    console.log(222);
	    var tab_index=this.data.tab_index;
	    this.init(tab_index,1);
    }

	},
  //点击面板，购买
  cardBuy:function (e) {
		var that=this;
		if(this.data.tab_index==3){
			return false;
		}
		var id=e.currentTarget.dataset.id;
		console.log(id,457);
	  if(that.data.tab_index==2){
		  wx.navigateTo({
			  url: 'buyDetail?id='+id,
		  })
		  return;
	  }
    // 非会员要先领卡
    if(!this.data.isMember){
      this.setData({
	      memCard:true,
      })
    }else{//是会员直接跳转到列表页面
      wx.navigateTo({
        url: 'buyCard?id='+id,
      })

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
			var code=res.code;//返回的code是加密的，要调用接口解密，用于openCard
			var params={
				unionid:getApp().globalData.unionid,
				pigcms_id:that.data.pigcms_id,
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

bindGetUserInfo:function(e){
    var that=this;
	if (e.detail.errMsg == "getUserInfo:ok") {
		app.getInfo();
		that.setData({
			authorize:true
		})
	}

},
	init:function (tab_index,type) {
		var that=this;
		if(type==0){
			that.setData({
				page:1,
				cardList:[],
				noList:false,
				emptyList:false
			})
		}
		var params={
			unionid:getApp().globalData.unionid,
			pigcms_id:that.data.pigcms_id,
			mid:getApp().globalData.extMid,
			is_store:that.data.is_store,
			page:that.data.page,
			search:tab_index
		};
		app.ajax('POST',params,'?m=Api&c=wxadoc&a=secondIndex',function (data) {
				wx.hideLoading();
				if(data.data.err_code){
					wx.showToast({
						title:data.data.err_msg,
						icon:'none'
					});
				}else{
					if(tab_index==1){//购买
						var dataList=data.data.err_msg.cardSecondList;
					}
					if(tab_index==2){//可使用
						var dataList=data.data.err_msg.cardMemberList;
					}
					if(tab_index==3){//失效
						var dataList=data.data.err_msg.expireList;
					}

					if(dataList.length<=0 && that.data.page!=1){//没有数据了
						that.setData({
							noList:true
						})
						return false;
					}
					if(dataList.length<=0 && that.data.page==1){//没有数据了
						that.setData({
							emptyList:true
						})
						return false;
					}
					if(!(Array.isArray(dataList))){
						var list=[];
						for (var k in dataList){
							list.push(dataList[k]);
						}
						dataList=list;
					}
					if(data.data.err_msg.memberInfo && data.data.err_msg.memberInfo.real_pic=='' && data.data.err_msg.merchant.is_identity=='1'){
						that.setData({
							hasImg:true
						})
					}else{
						that.setData({
							hasImg:false
						})
					}
					that.setData({
						cardList:that.data.cardList.concat(dataList),//数据列表
						containShow:true,//页面显示
						page:++that.data.page,
						emptyList:false,
						cardFlag:data.data.err_msg.cardFlag,//激活卡类型 1 非跳转 2
						cardExt:data.data.err_msg.cardExt1,//领卡数据

					})
					if(data.data.err_msg.cardinfo){
                        that.setData({
                            cardId:data.data.err_msg.cardinfo.wxcard_id,//领卡的id
                        })
					}
				}
				console.log(that.data.cardList,2616)
		});
	},
  onShow: function () {
    var that=this;
    wx.showLoading({
        title:'加载中',
    });
    var tab_index=this.data.tab_index;
	  if(app.globalData.mid==''){
		  app.userInfoReadyCallback = function () {
			  that.setData({
				  isMember:getApp().globalData.isMember,//是不是会员
				  pigcms_id:getApp().globalData.pigcms_id,//得到pigcms_id
			  })
			  that.init(tab_index,0)
              console.log(22222);
		  }

	  }
	  else{
		  that.setData({
			  isMember:getApp().globalData.isMember,//是不是会员
			  pigcms_id:getApp().globalData.pigcms_id,//得到pigcms_id
		  })
		  that.init(tab_index,0)
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
	onHide:function () {
		var that=this;
		this.setData({
			containShow:false,
			memCard:false,
		})
	},
	onShareAppMessage: function (res) {//赠送转发
		var that=this;
		if (res.from === 'button') {
			// 来自页面内转发按钮
			console.log(res.target)
		}
		return {
			title: '次卡分享！',
			path: '/page/index',
		}
	},
	onLoad:function (option) {
		if(option.tab_index){
			this.setData({
				tab_index:option.tab_index,
			})
		}
		var that=this;
		console.log(option)
		console.log(getApp().globalData.uploadShow);
		let { avatar } = option;
		if (avatar) {
			this.setData({
				['uploadWrap.uploadSrc']: avatar,
				['uploadWrap.uploadShow']:getApp().globalData.uploadShow,//没上传和已经上传了图片
				['uploadWrap.uploadModal']:getApp().globalData.uploadModal//上传图片模态框
			})
		}
	}
})
