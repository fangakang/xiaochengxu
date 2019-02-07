//logs.js
import drawQrcode from '../../../utils/weapp.qrcode.min.js'
const app = getApp();
Page({
  data: {
  	  code:'',//二维码code
	  uploadSrc: '',//上传的图片路径
	  uploadShow:false,//没上传和已经上传了图片
	  uploadModal:false,//上传图片模态框
	  is_store:1,//平台or 单店
	  id:'',//次卡id
	  cardMsg:'',//详细的次卡信息
	  containShow:false,//页面数据加载完之后展示
	  last:'',//还可赠送几次
	  hasImg:false,//是否需要上传了图像
	  useWrap:{},//剩余次数和转增中次数
	  give_img:'',//分享的图片
	  friendImg:'',//生成海报的图片
	  second_id:'',//生成海报时候的second_id
	  ladetid:'',//生成海报时候的id
	  nick:'',//用户微信昵称
	  is_give:false,//是否能转赠
	  timer:true,
  },
  upload:function () {
  	    var that=this;
	  wx.chooseImage({
		  count: 1, // 默认9
		  sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
		  sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
		  success (res) {
			  const src = res.tempFilePaths;
			  console.log(res.tempFilePaths)
			  wx.showLoading({
				  title:'加载中'
			  })
			  wx.navigateTo({
				  url: `../upload/upload?src=${src}&id=`+that.data.id
			  })
		  }
      })
  },
  shareWrap:function(){
    this.setData({
      shareShow:true
    })
  },
	//关闭分享
	closeShare:function () {
		this.setData({
			shareShow:false
		})
	},
	//查看其他次卡
	seeOther:function () {
		wx.navigateTo({
			url: 'index?tab_index=2'
		})
	},
	closeUp:function () {//点击关闭上传模态框
		this.setData({
			uploadModal:false
		})
	},
	uploadBtn:function () {//点击上传按钮
		this.setData({
			uploadModal:true
		})
	},
	closeImg:function () {//删除图片
		getApp().globalData.uploadShow=false;
		this.setData({
			uploadShow:false
		})
	},
	//定时器
	interFun:function () {
  	    var that=this;
		if(this.data.hasImg){
			var https=app.globalData.https;
			var url='?m=Api&c=wxadoc&a=buyFinishSecond';
			var Type='POST';
			var  methonType='application/x-www-form-urlencoded';
			var params={
				unionid:app.globalData.unionid,
				pigcms_id:app.globalData.pigcms_id,
				mid:getApp().globalData.extMid,
				is_store:that.data.is_store,
				id:that.data.id,
				openid:app.globalData.openid,
			};
			wx.request({
				url:https+url,
				method:Type,
				data:params,
				header: {
					"Content-Type": methonType
				},
				success: (data) => {
					var data=data.data;
					console.log(data,params,2222222222);
					if(data.err_code){
						wx.showToast({
							title:data.err_msg,
							icon:'none'
						});
					}else{
						that.setData({
							cardMsg:data.err_msg,
							containShow:true,//页面数据加载完之后展示
							last:data.err_ladet.last,//还可赠送几次
							give_img:data.err_msg.give_img,//分享的图片
							useWrap:data.err_ladet,//次数对象，可用和正在转增中
							code:data.codes,//生成二维码的code
							second_id:data.err_msg.id,//生成海报时候的second_id
							ladetid:data.err_ladet.info.id,//生成海报时候的id
							nick:data.member.wx_name,//用户微信昵称
							is_give:data.err_msg.is_give,//1转增，0不能
						})
						if(data.err_msg.is_give=='0'){
							wx.hideShareMenu()
						}
						drawQrcode({
							width: 200,
							height: 200,
							canvasId: 'myQrcode',
							text: data.code
						});
						var newstr="";
						for(var i=0;i<data.code.length;i+=4){
							console.log(i,data.code.length-4);
							var tmp=data.code.substring(i, i+4);
							if(i!=0){
								newstr+='-'+tmp;
							}else{
								newstr+=tmp;
							}
						}
						that.setData({
							code:data.codes
						})
						console.log(that.data.containShow);
						wx.setNavigationBarTitle({//动态设置导航栏标题
							title:data.err_msg.title
						})
						if(data.is_identity=='1' && data.member.real_pic==''){
							that.setData({
								hasImg:false
							})
						}else{
							that.setData({
								hasImg:true
							})
						}
					}
				},
				error(res) {

				}
			})
			console.log(233322)
			if(that.data.timer){
				var timeer=setTimeout(function () {
					that.interFun();
				},1000)
			}

		}
	},
	submitImg:function () {//提交图片
		var that=this;
		var params={
			pigcms_id:app.globalData.pigcms_id,
			src:that.data.uploadSrc,
			oriSrc:'',
		};
		app.ajax('POST',params,'?m=Api&c=wxadoc&a=uploadImg',function (res) {
			wx.hideLoading();
			wx.showToast({
				title:'上次成功',
				icon:'none'
			});
			that.setData({
				hasImg:true,//上传了图片
				uploadModal:false,//关闭模态框
			})
		})
	},
  onShareAppMessage: function (res) {//赠送转发
	  var that=this;
	  var give_unionid=app.globalData.unionid;
	  var id=that.data.ladetid;
	  var second_id=that.data.second_id;
	  var params={
		  unionid:getApp().globalData.unionid,
		  pigcms_id:getApp().globalData.pigcms_id,
		  mid:getApp().globalData.extMid,
		  is_store:that.data.is_store,
			id:that.data.ladetid,
		  second_id:that.data.second_id,
		  openid:getApp().globalData.openid
		  // unionid:'owKaU1OA9Tb1Z2sA4rjQfJMi7Ueo',
		  // pigcms_id:4513,
		  // mid:2155,
		  // is_store:1,
		  // id:11196243,
		  // second_id:249,
		  // :openid"osBNG467ZpfFrDt_VIBfPosjjHTw"
	  };
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    console.log(params,give_unionid,id,second_id,11);


    return {
      title: that.data.nick+'发现了不错的次卡，老铁们，不妨来体验下吧！',
      path: '/pages/index/verify?give_unionid='+give_unionid+'&id='+id+'&second_id='+second_id,
	    // path: '/pages/index/verify',
	  imageUrl:that.data.give_img,
	    success:function () {
		    app.ajax('POST',params,'?m=Api&c=wxadoc&a=giveCallBackSecond',function (res) {

			    console.log(res.data,params,16661);
			    that.setData({
				    shareShow:false,
			    })

		    })
	    }
    }

  },
	addNum:function () {//增加次数
		wx.navigateTo({
			url: 'index'
		})
	},
	seeRecord:function () {
  	var that=this;
		wx.navigateTo({
			url: 'record?id='+that.data.second_id
		})
	},
	// 生成海报
	firentSave:function () {
		that.firendImg();
		var urls=[];
		var that=this;
		urls.push(that.data.friendImg)
		wx.previewImage({
			current:this.data.friendImg , // 当前显示图片的http链接
			urls: urls // 需要预览的图片http链接列表
		})
	},
	init:function () {
		var that=this;
		var params={
			unionid:app.globalData.unionid,
			pigcms_id:app.globalData.pigcms_id,
			mid:getApp().globalData.extMid,
			is_store:that.data.is_store,
			id:that.data.id,
			openid:app.globalData.openid,
			// unionid:'owKaU1OA9Tb1Z2sA4rjQfJMi7Ueo',
			// pigcms_id:4504,
			// mid:2155,
			// is_store:that.data.is_store,
			// id:366,
			// openid:'osBNG467ZpfFrDt_VIBfPosjjHTw',
		}
		app.ajax('POST',params,'?m=Api&c=wxadoc&a=buyFinishSecond',function (data) {
			var data=data.data;
			console.log(data,params,2222222222)
			wx.hideLoading();
			if(data.err_code){
				wx.showToast({
					title:data.err_msg,
					icon:'none'
				});
			}else{
				that.setData({
					cardMsg:data.err_msg,
					containShow:true,//页面数据加载完之后展示
					last:data.err_ladet.last,//还可赠送几次
					give_img:data.err_msg.give_img,//分享的图片
					useWrap:data.err_ladet,//次数对象，可用和正在转增中
					code:data.code,//生成二维码的code
					second_id:data.err_msg.id,//生成海报时候的second_id
					ladetid:data.err_ladet.info.id,//生成海报时候的id
					nick:data.member.wx_name,//用户微信昵称
					is_give:data.err_msg.is_give,//1转增，0不能
				})
				if(data.err_msg.is_give=='0'){
					wx.hideShareMenu()
				}
				drawQrcode({
					width: 200,
					height: 200,
					canvasId: 'myQrcode',
					text: data.code
				});
				var newstr="";
				for(var i=0;i<data.code.length;i+=4){
					console.log(i,data.code.length-4);
					var tmp=data.code.substring(i, i+4);
					if(i!=0){
						newstr+='-'+tmp;
					}else{
						newstr+=tmp;
					}
				}
				that.setData({
					code:newstr
				})
				console.log(that.data.containShow);
				wx.setNavigationBarTitle({//动态设置导航栏标题
					title:data.err_msg.title
				})
				if(data.is_identity=='1' && data.member.real_pic==''){
					that.setData({
						hasImg:false
					})
				}else{
					that.setData({
						hasImg:true
					})
				}
				that.interFun();
			}
		})

	},
	// 生成海报的接口
	firendImg:function () {
  	console.log(23567)
		var that=this;
		// 生成海报和分享的图片
		var paramsImg={
			appid:app.globalData.appid,
			give_unionid:app.globalData.unionid,
			// give_unionid:'owKaU1OA9Tb1Z2sA4rjQfJMi7Ueo',
			second_id:that.data.second_id,
			id:that.data.ladetid,
		}
		app.ajax('POST',paramsImg,'?m=Api&c=wxadoc&a=generatingPoster',function (res) {
			var data=res.data;
			console.log(data);
			wx.hideLoading();
			if(data.err_code){
				wx.showToast({
					title:data.err_msg,
					icon:'none'
				});
			}else{
				that.setData({
					friendImg:data.err_msg
				})
			}
		})
	},
	onUnload:function(){
		this.setData({
			timer:false
		})
},
  onLoad: function (option) {
	  var that=this;
	  console.log(option)
	var id=option.id;
	that.setData({
		id:id
	})

  	console.log(getApp().globalData.uploadShow);
	  let { avatar } = option;
	  if (avatar) {
		  this.setData({
			  uploadSrc: avatar,
			  uploadShow:getApp().globalData.uploadShow,//没上传和已经上传了图片
			  uploadModal:getApp().globalData.uploadModal//上传图片模态框
		  })
	  }
  },
	onShow:function () {
  	var that=this;
		this.setData({
			timer:true,
		})
		that.init();
	},
	onHide:function () {
		this.setData({
			timer:false,
		})
	}
})
