const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:{},
    imgUrls: [],
    giftList:[],
    indicatorDots: false,
    autoplay: false,
    displayItems:1,
    interval: 5000,
    duration: 1000,
    previousMargin:'60rpx',
    current:0,
    part:0,
    payBtn:false,
    giftImg:true,
    cardDetail:[],
    themeid:'',
    totalPrice: 0,//总价
    id:'',//被选中的卡面,
    hasMask:false,
    payCancle:false,
    countFlag:true,
    payCount: '',//付款倒计时
    numarr:[],
    numVal:[],
    phone:'',
    loadComplete:false
  },
  getPhoneNumber:function(e){
    wx.showLoading({
      title: '加载中',
    })
    var that=this;
    console.log(e.detail.errMsg)
    if (e.detail.errMsg=='getPhoneNumber:ok'){
      wx.checkSession({
        success: function () {
          //session 未过期，并且在本生命周期一直有效
        },
        fail() {
          wx.login();//重新登录
        }
      });
      wx.request({
        url: app.globalData.urlHead +'/cashier/merchants.php?m=Api&c=wxadoc&a=getUserPhone',
        data: {
          mid: getApp().globalData.mid,
          openid: getApp().globalData.openid,
          unionid: getApp().globalData.unionid,
          appid: getApp().globalData.appid,
          encryptedData: e.detail.encryptedData,
          session_key: getApp().globalData.session_key,
          iv:e.detail.iv
        },
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success:function(res){
          getApp().globalData.phone=res.data.err_dom;
          var numarr = [];
          var numVal = [];
          for (var i = 0; i < that.data.giftList.length; i++) {
            if (that.data.giftList[i].add == true) {
              numarr.push(that.data.giftList[i].id);
              numVal.push(that.data.giftList[i].num);
            }
          }
          that.setData({
            payCancle: false,
            countFlag: false,
            numarr: numarr,
            numVal: numVal
          })
          that.weixinPay();
        }
      })
    }else{
      wx.hideLoading();
      wx.showModal({
        title: '提示',
        content: '获取不到手机号码，可能会影响到到店核销',
        showCancel:false,
        confirmText:'我知道了',
        success: function (res) {
          // if (res.confirm) {
          //   wx.navigateBack({
          //     delta: 1
          //   })
          // }
        }
      })
    }
  },
  closePayMask: function () {
    this.setData({
      payCancle: false,
      countFlag: false
    })
  },
  viewShop: function () {//查看全部门店
    wx.showLoading({
      title: '正在加载...',
    })
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {//未进行位置授权
          wx.authorize({//进行地理位置授权
            scope: 'scope.userLocation',
            success(res) {
              console.log('获取地理位置授权成功');
              wx.getLocation({
                type: 'wgs84',
                success: function (res) {
                  wx.hideLoading();
                  var latitude = res.latitude
                  var longitude = res.longitude
                  wx.navigateTo({
                    url: 'allShop?latitude=' + latitude + '&longitude=' + longitude,
                  })
                }
              })

            },
            fail() {
              wx.hideLoading();
              console.log('获取地理位置授权失败')
            }
          })
        } else {//地理位置已授权
          wx.getLocation({
            type: 'wgs84',
            success: function (res) {
              wx.hideLoading();
              var latitude = res.latitude
              var longitude = res.longitude
              wx.navigateTo({
                url: 'allShop?latitude=' + latitude + '&longitude=' + longitude,
              })
            }
          })

        }
      }
    })
  },
  selectCard:function(e){//选择卡面
    const length = this.data.imgUrls.length;
    for (let i = 0; i < length; i++) {
      if (i == e.currentTarget.dataset.id) {
        this.data.imgUrls[i].active = true;
        this.data.imgUrls[i].iconShow = true;
      } else {
        this.data.imgUrls[i].active = false;
        this.data.imgUrls[i].iconShow = false;
      }
    };
    this.setData({
      current: e.currentTarget.dataset.id,
      imgUrls: this.data.imgUrls,
      id: e.currentTarget.dataset.theme
    });
  },
  swipclick: function (e) {//点击图片触发事件
    const length = this.data.imgUrls.length;
    for (let i = 0; i < length;i++){
      if (i == e.currentTarget.dataset.id){
        this.data.imgUrls[i].active = true;
        this.data.imgUrls[i].iconShow = true;
      }else{
        this.data.imgUrls[i].active = false;
        this.data.imgUrls[i].iconShow = false;
      }
    };
    this.setData({
      current: e.currentTarget.dataset.id,
      imgUrls: this.data.imgUrls,
      id: e.currentTarget.dataset.theme
    });
  },
  giftAdd:function(e){//添加礼品卡
    const length = this.data.giftList.length;
    var part=0;//礼品卡份数
    var totalPrice=0;//礼品卡总价
    var payBtn;//购买按钮
    for(let i=0;i<length;i++){
      if (i == e.currentTarget.dataset.id){
        this.data.giftList[i].maskShow = false;
        if (this.data.giftList[i].num >= parseFloat(this.data.giftList[i].quantity)){
          wx.showToast({
            icon:'none',
            title: '库存不足',
          })
          return;
        }
        this.data.giftList[i].add = true;
        this.data.giftList[i].num++;
        
      }
      part += this.data.giftList[i].num;
      totalPrice += this.data.giftList[i].num * this.data.giftList[i].money;
      payBtn=true;
    };
    console.log()
    this.setData({
      giftList: this.data.giftList,
      part:part,
      totalPrice: totalPrice.toFixed(2),
      payBtn: payBtn,
      hasMask:false
    });
  },
  giftLess:function(e){//减少礼品卡
    const length = this.data.giftList.length;
    var part = 0;//礼品卡份数
    var totalPrice = 0;//礼品卡总价
    var payBtn;//购买按钮
    for (let i = 0; i < length; i++) {
      if (i == e.currentTarget.dataset.id) {
        this.data.giftList[i].num--;
        if (this.data.giftList[i].num==0){
          this.data.giftList[i].add = false;
        }
      }
      part += this.data.giftList[i].num;
      totalPrice += this.data.giftList[i].num * this.data.giftList[i].money;
      if(part==0){
        payBtn=false;
      }else{
        payBtn = true;
      }
    };
    this.setData({
      giftList: this.data.giftList,
      part: part,
      totalPrice: totalPrice.toFixed(2),
      payBtn: payBtn
    });
  },
  openMask:function(e){//打开遮罩层
    const length = this.data.giftList.length;
    for (let i = 0; i < length; i++) {
      if (i == e.currentTarget.dataset.id) {
        this.data.giftList[i].maskShow = true;
      }
    };
    this.setData({
      giftList: this.data.giftList,
      hasMask:true
    });
  },
  closeMask: function (e) {//关闭遮罩层
    const length = this.data.giftList.length;
    for (let i = 0; i < length; i++) {
      if (i == e.currentTarget.dataset.id) {
        this.data.giftList[i].maskShow = false;
      }
    };
    this.setData({
      giftList: this.data.giftList,
      hasMask:false
    });
  },
  buy:function(e){//礼品卡购买
    wx.showLoading({
      title: '加载中',
    })
    var that=this;
    var numarr=[];
    var numVal=[];
    for (var i = 0; i < that.data.giftList.length;i++){
      if (that.data.giftList[i].add==true){
        numarr.push(that.data.giftList[i].id);
        numVal.push(that.data.giftList[i].num);   
      }
    }
    that.setData({
      payCancle: false,
      countFlag: false,
      numarr: numarr,
      numVal: numVal
    })
    that.weixinPay();
  },
  weixinPay:function(){
    var that=this;
    wx.request({
      url: app.globalData.urlHead + '/cashier/merchants.php?m=Api&c=wxadoc&a=weixinPay',
      data: {
        mid: getApp().globalData.mid,
        themeid: that.data.themeid,
        total: that.data.totalPrice,
        id: that.data.id,
        numarr: that.data.numarr,
        numVal: that.data.numVal,
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
        getApp().globalData.orderid = res.data.err_dom;
        console.log(res);
        if(res.data.err_code!=0){
          wx.showModal({
            title: '温馨提示',
            content: res.data.err_msg,
            showCancel: false,
            success: function (msg) {

            }
          })
          return;
        }
        
        wx.requestPayment({
          timeStamp: res.data.err_msg.timeStamp,
          nonceStr: res.data.err_msg.nonceStr,
          package: res.data.err_msg.package,
          signType: res.data.err_msg.signType,
          paySign: res.data.err_msg.paySign,
          success: function (res) {
            console.log(res)
            wx.navigateTo({
              url: 'buyDetail'
            })
          },
          fail: function (res) {
            var now = new Date().getTime();
            now = Math.floor(now / 1000);
            var time = now + 1800;
            console.log(res)
            // that.setData({
            //   payCancle: true,
            //   countFlag: true
            // })
            // that.payCount(time);
            // wx.request({//支付失败发送模板消息
            //   url: app.globalData.urlHead + '/cashier/merchants.php?m=Api&c=wxadoc&a=failCallBack',
            //   data: {
            //     mid: getApp().globalData.mid,
            //     openid: getApp().globalData.openid,
            //     unionid: getApp().globalData.unionid,
            //     appid: getApp().globalData.appid,
            //     id: err_dom,
            //   },
            //   method: 'POST',
            //   header: {
            //     "Content-Type": "application/x-www-form-urlencoded"
            //   },
            //   success: function (res) {

            //   },
            //   fail: function (res) {
            //     console.log(res)
            //   }
            // })
          }
        })
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
  payCount: function (time) {
    if (this.data.countFlag) {
      var that = this;
      var day = new Date().getTime(), seconds;
      day = Math.floor(day / 1000);
      if (time > day) {
        seconds = time - day;
      } else {
        that.setData({
          payCancle: false,
        })
        return false;
      }
      var hour = Math.floor(seconds / 60 / 60);
      var minute = Math.floor(seconds / 60 % 60);
      var second = Math.floor(seconds % 60);
      if (hour < 10) {
        hour = '0' + hour
      };
      if (minute < 10) {
        minute = '0' + minute
      };
      if (second < 10) {
        second = '0' + second
      };
      that.setData({
        payCount: hour + ':' + minute + ":" + second
      })
      var payCount = setTimeout(function () {
        that.payCount(time);
        clearTimeout(payCount);
        payCount = null;
      }, 1000)
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(getApp().globalData.phone)
    wx.showLoading({
      title: '加载中',
    })
    wx.setNavigationBarTitle({
      title: options.name
    })
    console.log(options)
    var that=this;
    wx.request({
      url: app.globalData.urlHead +'/cashier/merchants.php?m=Api&c=wxadoc&a=detail',
      data: { 
        mid: getApp().globalData.mid,
        openid: getApp().globalData.openid,
        unionid: getApp().globalData.unionid,
        appid: getApp().globalData.appid,
        id:options.id
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        wx.hideLoading();
        console.log(res)
        var jsonStr = res.data.err_msg.card_list;//头部swiper
        var imgUrls = [],
          n = {};
        for (var key in jsonStr) {
          n = { 'id': key, 'url': jsonStr[key] ,'active':false,'iconShow':false};
          if (res.data.err_msg.tmp==n.id){//默认选中卡面
            n.active=true;
            n.iconShow=true;
          };
          imgUrls.push(n);
        };

        console.log(imgUrls)
        var giftList = res.data.err_msg.buy_cards;//礼品卡列表
        for(var i=0;i<giftList.length;i++){//使用时间格式
          var time = new Date(parseInt(giftList[i].time));
          var year=time.getFullYear();
          var month = time.getMonth() + 1;
          var date = time.getDate();
          var hour = time.getHours();
          var minutes = time.getMinutes();
          var second = time.getSeconds();
          if(month<10){
            month='0'+month;
          };
          if (date<10){
            date = '0' + date;
          };
          giftList[i].time = year+'-'+month+'-'+date;
        };
        that.setData({
          imgUrls: imgUrls,
          giftList: giftList,
          cardDetail: res.data.err_msg.cardDetail,
          themeid: res.data.err_msg.id,
          id: res.data.err_msg.tmp,
          phone: getApp().globalData.phone,
          loadComplete:true
        })
      },
      fail: function (res) {
        console.log(res);
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