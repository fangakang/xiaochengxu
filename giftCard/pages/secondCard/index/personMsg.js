var app=getApp();
var tcity = require("../../../utils/citys.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadComplete: false,
    carNo: '',
    noEnergy: '',
    provinceList: ['京', '津', '冀', '晋', '蒙', '辽', '吉', '黑', '沪', '苏', '浙', '皖', '闽', '赣', '鲁', '豫', '鄂', '湘', '粤', '桂', '琼', '渝', '川', '贵', '云', '藏', '陕', '甘', '青', '宁', '新'],
    numArr: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    wordArr: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    newEnergyArr: ['港', '澳', '学', '领'],
    carNumArr: ['', '', '', '', '', '', '', ''],
    target: '',
    keyBord: false,
    provinceBord: false,
    numBord: false,
    newEnergyFlag: false,
    merchantField:[],
    index:0,
    list:[],
    formData:[],
    tempInfo:[],
    richInfo:[],
    codeInfo:[],
    UserCardCode:'',
    activate_ticket:'',
    phone:'',
    CardId:'',
    wx_coupon:[],
      is_member:false,
	  provinces: [],
	  province: "",
	  province_code: '',//省的code
	  citys: [],
	  city: "",
	  city_code: '',//市的code
	  countys: [],
	  county: '',
	  county_code: '',//区的code

	  value: [0, 0, 0],
	  values: [0, 0, 0],
	  condition: false
  },
  closeKeyBord: function () {//关闭车牌号键盘
    this.setData({
      keyBord: false
    })
  },
  numChoose: function (e) {//选择输入车牌号的哪一位
    // wx.pageScrollTo({
    //   scrollTop: 1200
    // })
    console.log(e)
    var that = this;
    that.setData({
      fieldid: 8
    })
    that.setData({
      target: e.currentTarget.dataset.index,
      keyBord: true
    })
    if (e.currentTarget.dataset.index == 0) {//调用省份键盘
      that.setData({
        provinceBord: true,
        numBord: false,
      })
    } else {//调用数字、字母键盘
      that.setData({
        provinceBord: false,
        numBord: true,
      })
    }
    if (e.currentTarget.dataset.index == 7) {//新能源单独处理
      that.setData({
        newEnergyFlag: true
      })
    } else {
      that.setData({
        newEnergyFlag: false
      })
    }
  },
  selectProvince: function (e) {//选择省份
    console.log(e)
    var that = this;
    that.data.carNumArr[0] = e.target.dataset.val;
    that.setData({
      carNumArr: that.data.carNumArr,
      target: 1,
      provinceBord: false,
      numBord: true,
    })
    that.setData({
      carNo: that.data.carNumArr.join('')
    })
  },
  selectNum: function (e) {//选择车牌号英文数字
    console.log(e)
    var that = this;
    var target = that.data.target
    if (!that.data.newEnergyFlag) {//不是新能源输入
      if (that.data.target != 7) {
        if (target == 1) {//第二位只能输入字母
          if (e.target.dataset.type == "number" || e.target.dataset.type == "special") {
            return false;
          }
        } else if (target != 1 && target != 6) {//中间的位数不能输入港澳等
          if (e.target.dataset.type == "special") {
            return false;
          }
        }
        that.data.carNumArr[target] = e.target.dataset.val;
        if (target != 6) {
          target++;
        }
      }
    } else {//新能源输入
      if (e.target.dataset.type == "special") {//新能源位不能输入港澳等
        return false
      } else {
        that.data.carNumArr[target] = e.target.dataset.val;
      }
    }

    that.setData({
      carNumArr: that.data.carNumArr,
      target: target,
      provinceBord: false,
      numBord: true,
    })

    that.setData({
      carNo: that.data.carNumArr.join('')
    })
  },
  deleteNum: function (e) {//删除操作
    var that = this;
    var target = that.data.target;
    that.data.carNumArr[target] = '';
    target--;
    if (target <= 0) {
      target = 0;
      that.setData({
        provinceBord: true,
        numBord: false,
      })
    }
    that.setData({
      target: target,
      carNumArr: that.data.carNumArr,
      newEnergyFlag: false
    })
    that.setData({
      carNo: that.data.carNumArr.join('')
    })
  
  },
  bindPickerChange:function(e){//单选
    console.log(e)
    var that=this;
    var target=e.currentTarget.dataset.id,
        val=e.detail.value;
        that.data.merchantField[target].index=val;
      that.data.merchantField[target].fvalue = that.data.merchantField[target].typeall[val].value;
    that.setData({
      merchantField: that.data.merchantField
    })
  },
  multiSelect:function(e){//多选
    console.log(e)
    var that=this;
     var index =e.currentTarget.dataset.index,
         val = 0;
        
     if (e.target.dataset.val!=''){
       val = e.target.dataset.val;
       for (var i = 0; i < that.data.merchantField[index].typeall.length;i++){
         if (that.data.merchantField[index].typeall[i].value==val){
           if (that.data.merchantField[index].typeall[i].stype==true){
             var listIndex = that.data.merchantField[index].list.indexOf(val)
             if (listIndex>-1){
               that.data.merchantField[index].list.splice(listIndex,1)
             }
             that.data.merchantField[index].typeall[i].stype=false;
           }else{
             that.data.merchantField[index].list.push(val);
             that.data.merchantField[index].typeall[i].stype = true;
           }
         }
       }
       console.log(that.data.merchantField[index].list)
     }else{
       return;
     }
  
    that.data.merchantField[index].fvalue = that.data.merchantField[index].list.join(',')
    that.setData({
      merchantField: that.data.merchantField
    })
    console.log(that.data.merchantField)

  },
  bindDateChange:function(e){//日期选择
    console.log(e);
    var that=this;
    var target=e.currentTarget.dataset.id,
        value=e.detail.value;
    that.data.merchantField[target].fvalue = value;
    that.setData({
      merchantField: that.data.merchantField
    })
  },
  textInput:function(e){//文本输入
    console.log(e)
    var that = this;
    var target = e.currentTarget.dataset.id,
      value = e.detail.value;
    that.data.merchantField[target].fvalue = value;
    that.setData({
      merchantField: that.data.merchantField
    })
  },
  formSubmit:function(e){
    console.log(e)
    var that=this;
    console.log(that.data.merchantField);
    for (var i = 0; i < that.data.merchantField.length;i++){
      if (that.data.merchantField[i].ismust==1){
        var name = that.data.merchantField[i].name;
        if(e.detail.value[name]==''){
          wx.showToast({
            title: that.data.merchantField[i].title+'不能为空',
            icon:'none'
          });
          return false;
        }
      }
    }
    if (that.data.carNumArr[7]!=''){
      if (that.data.carNo.length<8){
        wx.showToast({
          title: '车牌号格式不正确',
          icon: 'none'
        });
        return false;
      }      
    } else{
      if (that.data.carNo.length < 7 && that.data.carNo.length!=0){
        wx.showToast({
          title: '车牌号格式不正确',
          icon: 'none'
        });
        return false;
      }
    }
    
    var formData = e.detail.value;
    formData.activate_ticket = that.data.activate_ticket;
    formData.UserCardCode = that.data.UserCardCode;
    formData.phone=that.data.phone;
    formData.CardId = that.data.CardId;
    formData.unionid=getApp().globalData.unionid
    formData.unionid=app.globalData.unionid;
    formData.openid=app.globalData.openid;
    formData.mid=app.globalData.mid;
    formData.is_store=1;
    formData.area='\''+that.data.province_code+','+that.data.city_code+','+that.data.county_code+'\'';
    console.log(formData.area);
    that.setData({
      formData: formData
    })
    if (that.data.wx_coupon.payactive==2){//需支付激活
      wx.showLoading({
        title: '加载中....',
      })
      wx.request({
        url: app.globalData.https + '?m=Api&c=wxadoc&a=weixinPayCard',
        data: {
          mid: getApp().globalData.mid,
      
          total: that.data.wx_coupon.paymoney,
          openid: getApp().globalData.openid,
          unionid: getApp().globalData.unionid,
          appid: getApp().globalData.appid,
        },

        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          wx.hideLoading();
          var err_dom = res.data.err_dom
          //getApp().globalData.orderid = res.data.err_dom;
          console.log(res);
          wx.requestPayment({
            timeStamp: res.data.err_msg.timeStamp,
            nonceStr: res.data.err_msg.nonceStr,
            package: res.data.err_msg.package,
            signType: 'MD5',
            paySign: res.data.err_msg.paySign,
            success: function (res) {
              that.activateCard();
            },
            fail: function (res) {
           
            }
          })
        },
        fail: function (res) {
          console.log(res);
        }
      })
    }else{
      that.activateCard();
    }
    
  },
  activateCard:function(){
    var that=this;
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: app.globalData.https + '?m=Api&c=wxadoc&a=activateCard',
      data: that.data.formData,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        wx.hideLoading();
        if(res.data.err_code==1){
          wx.showToast({
            title: res.data.err_msg,
            icon: 'none'
          });
        }else{
          wx.openCard({
            cardList: [
              {
                cardId: res.data.err_msg.cardid,
                code: res.data.err_msg.card_no
              }
            ],
            success: function (res) {
            }
          })
        }
      },
    
    })
  },
	bindChange: function (e) {//省市区选择
		console.log(e);
		var val = e.detail.value
		var t = this.data.values;
		var cityData = this.data.cityData;

		if (val[0] != t[0]) {
			console.log('province no ');
			const citys = [];
			const countys = [];

			for (let i = 0; i < cityData[val[0]].sub.length; i++) {
				citys.push({'name':cityData[val[0]].sub[i].name,'code':cityData[val[0]].sub[i].code})
			}
			for (let i = 0; i < cityData[val[0]].sub[0].sub.length; i++) {
				countys.push({'name':cityData[val[0]].sub[0].sub[i].name,'code':cityData[val[0]].sub[0].sub[i].code})
			}

			this.setData({
				province: this.data.provinces[val[0]].name,
				province_code: this.data.provinces[val[0]].code,
				city: cityData[val[0]].sub[0].name,
				city_code: cityData[val[0]].sub[0].code,
				citys: citys,
				county: cityData[val[0]].sub[0].sub[0].name,
				county_code: cityData[val[0]].sub[0].sub[0].code,
				countys: countys,
				values: val,
				value: [val[0], 0, 0]
			})

			return;
		}
		if (val[1] != t[1]) {
			console.log('city no');
			const countys = [];

			for (let i = 0; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
				countys.push({'name':cityData[val[0]].sub[val[1]].sub[i].name,'code':cityData[val[0]].sub[val[1]].sub[i].code})
			}

			this.setData({
				city: this.data.citys[val[1]].name,
				city_code: this.data.citys[val[1]].code,
				county: cityData[val[0]].sub[val[1]].sub[0].name,
				county_code: cityData[val[0]].sub[val[1]].sub[0].code,
				countys: countys,
				values: val,
				value: [val[0], val[1], 0]
			})
			return;
		}
		if (val[2] != t[2]) {
			console.log('county no');
			this.setData({
				county: this.data.countys[val[2]].name,
				county_code: this.data.countys[val[2]].code,
				values: val
			})
			return;
		}


	},
	open: function () {
		this.setData({
			condition: !this.data.condition
		})
	},
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
   var data=app.globalData.openCardData;
   console.log('1-----------------------1');
   console.log(data);
   console.log('1-----------------------1');
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    wx.setNavigationBarTitle({
      title:'激活会员卡'
    })
    if (getApp().globalData.mid == '') {
      getApp().userInfoReadyCallback = function () {
        that.showPersonInfo(data);
      }
    }
    else {
      that.showPersonInfo(data);
    }
	  that.getCityPicker();
  },
	cityChoose:function(data){
		var that=this;
		tcity.init(that);

		var cityData = data;


		const provinces = [];
		const citys = [];
		const countys = [];

		for (let i = 0; i < cityData.length; i++) {
			provinces.push({'name':cityData[i].name,'code':cityData[i].code});
		}
		console.log('省份完成');
		for (let i = 0; i < cityData[0].sub.length; i++) {
			citys.push({'name':cityData[0].sub[i].name,'code':cityData[0].sub[i].code})
		}
		console.log('city完成');
		for (let i = 0; i < cityData[0].sub[0].sub.length; i++) {
			countys.push({'name':cityData[0].sub[0].sub[i].name,'code':cityData[0].sub[0].sub[i].code})
		}

		that.setData({
			'provinces': provinces,
			'citys': citys,
			'countys': countys,
			'province': cityData[0].name,
			'province_code': cityData[0].code,
			'city': cityData[0].sub[0].name,
			'city_code':cityData[0].sub[0].code,
			'county': cityData[0].sub[0].sub[0].name,
			'county_code': cityData[0].sub[0].sub[0].code,
		})
	},
	getCityPicker:function(){
		var that=this;
		wx.request({
			url: app.globalData.https + '?m=Index&c=index&a=getCityPicker',
			data: '',
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			method: 'POST',
			success:function(res){
				console.log(res)
				that.cityChoose(res.data);
			}
		})
	},
  showPersonInfo: function (data) {//显示会员信息
    var that = this;
    data.mid=app.globalData.extMid;
    var postData
    if (data.referrerInfo == undefined || data.referrerInfo.extraData == undefined){
      postData={
        unionid: app.globalData.unionid,
        openid: app.globalData.openid,
        mid: app.globalData.extMid,
        is_store:1
      }
    }else{
      postData={
        appid: data.referrerInfo.appId,
        mid: app.globalData.extMid,
        activate_ticket: data.referrerInfo.extraData.activate_ticket,
        card_id: data.referrerInfo.extraData.card_id,
        code: data.referrerInfo.extraData.code,
        wx_active_after_submit_url: data.referrerInfo.extraData.wx_active_after_submit_url,
        unionid: app.globalData.unionid,
        openid: app.globalData.openid,
        is_store: 1
      }
    }
    
    wx.request({
      url: app.globalData.https +'?m=Api&c=wxadoc&a=jumpPage',
      data: postData,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        wx.hideLoading();
	      console.log('>>>>>>>>>>');
          console.log(res);
	      console.log('>>>>>>>>>>');
        // if(res.data.isMember){
	     //    wx.switchTab({
		 //        url: '/pages/index/index',
	     //    })
        // }
        if (res.data.err_code==2){
          wx.openCard({
            cardList: [
              {
                cardId: res.data.err_msg.wxcard_id,
                code: res.data.err_msg.UserCardCode
              }
            ],
            success: function (res) {
            }
          })
        } else if (res.data.err_code == 3){
	        var pages=getCurrentPages();
	        var prevPage=pages[pages.length-2]//获取上一个页面信息栈
	        if (prevPage && prevPage.route=='pages/index/verify'){
		        console.log(12333,prevPage);
		        var give_unionid=prevPage.options.give_unionid;
		        var id=prevPage.options.id;
		        var second_id=prevPage.options.second_id;
		        wx.navigateTo({
			        url:'/pages/index/verify?give_unionid='+give_unionid+'&id='+id+'&second_id='+second_id,
		        })
            }else{
		        wx.navigateTo({
		          url: 'index',
		        })
            }

        }else{
          that.setData({
            merchantField: res.data.err_msg.merchantField,
            tempInfo: res.data.err_msg.tempInfo,
            loadComplete: true,
            richInfo: res.data.err_msg.richInfo,
            codeInfo: res.data.err_msg.codeInfo,
            UserCardCode: res.data.err_msg.UserCardCode,
            activate_ticket: res.data.err_msg.activate_ticket,
            phone: res.data.err_msg.phone,
            CardId: res.data.err_msg.card_id,
            wx_coupon: res.data.err_msg.wx_coupon
          })
        }
        
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
