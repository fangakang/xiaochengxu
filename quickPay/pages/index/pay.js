// pages/index/paySecond.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mid: 3911533,
    phone:'',
    loadComplete:false,
    firstStep:true, 
    secondStep:false,
    keyNum:['1','2','3','4','5','6','7','8','9','0','.'],
    keyBord:true,
    inputTarget:1,//1.支付总额输入，2.不优惠金额输入
    totalMoney:'',
    noReduce:'',
    inputNum:'',
    couponMask:false,
    storeMask:true,
    enterRemark:false,
    remarkMsg:'',
    remarkModal:false,
    sureRemark:'',
    authorize: true,
    memberMsg: {},
    storeList:[],
    storeName:'',
    storeId: '',
    isPoint:0,
    payType:'wx_balance',
    couponId:0,
    payReduceMoney:'',
    couponName:'请选择优惠券',
    rechargeData:[],
    rechargeIndex:0,
    remainMoney:0,
    passKey:['1','2','3','4','5','6','7','8','9','C','0'],
    firstInput:'',
    secondInput:'',
    password:['','','','','',''],
    passwordNotice:'请用户设置余额支付密码，用于线上余额支付验证或商家线下验证会员身份',
    first:true,
    second:false,
    passwordModal:false,
    isMember:0,
    wxWord:'微信直接买单',
    rechargeWord:'充值并余额支付',
    balanceWord:'余额支付',
    canPay:true,
    init:0,
    fromCode:false,//是否来自二维码
    storeLen:0
  },
  getPhoneNumber:function(e){
    let that = this;
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      wx.checkSession({
        success: function () {
          //session 未过期，并且在本生命周期一直有效
        },
        fail() {
          wx.login();//重新登录
        }
      });
    };
    that.getUserPhone(e);
  },
  getUserPhone: function (e) {
    var that = this;
    var params = {
      agentid: app.globalData.extMid,
      openid: app.globalData.openid,
      unionid: app.globalData.unionid,
      appid: app.globalData.appid,
      encryptedData: e.detail.encryptedData,
      session_key: app.globalData.session_key,
      iv: e.detail.iv
    }
    app.ajax('POST', params, '/cashier/merchants.php?m=Api&c=wxadoc&a=getUserPhone', (res) => {
      wx.hideLoading();
      if (res.data.err_code != 0) {
        wx.showToast({
          title: '手机号获取失败',
          icon:'none'
        })
      } else {
        that.setData({
          phone: res.data.err_dom,
        });
        app.globalData.phone = res.data.err_dom;
        that.getMemberByTel();
      }

    }, (res) => {

    })
  },
  passwordClose:function(){
    let that=this;
    that.setData({
      passwordModal: false,
      password: ['', '', '', '', '', ''],
      firstInput: '',
      secondInput: '',
      first: true,
      second: false,
    })
  },
  passTap:function(e){//输入密码
    let that=this;
    let key=e.currentTarget.dataset.target;
    let passInput;
    if(that.data.first){//第一次输入
      passInput = that.data.firstInput;
    }else{//第二次输入
      passInput = that.data.secondInput;
    }
    if(key!='C'&&key!='D'){
      if (passInput.length>=6){
        return;
      }
      passInput+=key;
      for (let i = 0; i < passInput.length;i++){
        that.data.password[i]="*";
      }
      
      if(that.data.first){//第一次输入
        that.setData({
          firstInput: passInput,
          password: that.data.password
        })
        if (that.data.firstInput.length >= 6) {
          if(!that.data.payInfo.isPwd){//没有初始密码，需设置密码并确认密码
            that.setData({
              passwordNotice: '确认密码',
              first: false,
              second: true,
              password: ['', '', '', '', '', ''],
            })
          }else{//有初始密码，校验密码进行支付
            that.verifyUserCardPayPwd();
          }
        }
      }else{//确认密码
        that.setData({
          secondInput: passInput,
          password: that.data.password
        })
        if (that.data.secondInput.length >= 6) {
          if (that.data.secondInput==that.data.firstInput){
            wx.showToast({
              title: '密码设置成功',
              icon:'none'
            });
            that.setMemberCardPayPwd();
            
          }else{
            wx.showToast({
              title: '两次输入不一致，请重新设置',
              icon:'none'
            })
            that.setData({
              passwordNotice: '请用户设置余额支付密码，用于线上余额支付验证或商家线下验证会员身份',
              first: true,
              second: false,
              firstInput:'',
              secondInput:'',
              password: ['', '', '', '', '', ''],
            })
          }
        }
      }
      
    }else if(key=='C'){
      if(that.data.first){//第一次输入
        that.setData({
          firstInput: '',
          password: ['', '', '', '', '', '']
        })
      }else{//第二次输入
        that.setData({
          secondInput: '',
          password: ['', '', '', '', '', '']
        })
      }
    }else if(key=='D'){
      let len = passInput.length;
      that.data.password[len-1]='';
      passInput = passInput.substring(0, passInput.length-1);
      if(that.data.first){//第一次输入
        that.setData({
          firstInput: passInput,
          password: that.data.password
        })
      }else{//第二次输入
        that.setData({
          secondInput: passInput,
          password: that.data.password
        })
      }
      
    }
  },
  verifyUserCardPayPwd:function(){//支付验证密码
    let that = this;
    let params = {
      pwd: that.data.firstInput,
      memberId: that.data.memberMsg.memberId
    };
    app.ajax('POST', params, '/cashier/merchants.php?m=Api&c=wxadoc&a=verifyUserCardPayPwd', (res) => {
      console.log(res);
      if (!res.data.err_code) {        
        that.CardPaying();        
      } else {
        wx.showToast({
          title: res.data.err_msg,
          icon: 'none'
        });
        that.setData({
          password: ['', '', '', '', '', ''],
          firstInput: '',
          secondInput: '',
          first: true,
          second: false,
        })
      }
    }, (res) => {

    })
  },
  setMemberCardPayPwd:function(){//设置密码接口
    let that=this;
    let params={
      pwd:that.data.firstInput,
      memberId: that.data.memberMsg.memberId
    };
    app.ajax('POST', params,'/cashier/merchants.php?m=Api&c=wxadoc&a=setMemberCardPayPwd',(res)=>{
      console.log(res);
      if(!res.data.err_code){
        that.CardPaying();    
      }else{
        wx.showToast({
          title: res.data.err_msg,
          icon:'none'
        })
      }
    },(res)=>{

    })
  },
  selectRecharge:function(e){//选择档位
    let that=this;
    let index = e.currentTarget.dataset.id;
    let remainMoney=0;
    remainMoney = (parseFloat(that.data.rechargeData[index].money) + parseFloat(that.data.rechargeData[index].gift) + parseFloat(that.data.memberMsg.money) - parseFloat(that.data.payInfo.pay_money)).toFixed(2);
    that.setData({
      rechargeIndex:e.currentTarget.dataset.id,
      remainMoney: remainMoney
    })
  },
  showStore:function(){
    let that=this;
    that.setData({
      storeMask: !that.data.storeMask,
    })
  },
  selectStore:function(e){
    let that=this;
    console.log(e);
    that.setData({
      storeName:e.currentTarget.dataset.name,
      storeId:e.currentTarget.dataset.id,
      storeMask:false
    })
  },
  bindGetUserInfo: function (e) {
    console.log(e)
    var that = this;
    console.log(e.detail.errMsg)
    if (e.detail.errMsg == "getUserInfo:ok") {
      app.getInfo();
      that.setData({
        authorize: true
      });
    } else {
      wx.showToast({
        title: '授权失败',
        icon: 'none'
      })
    }
  },
  getPayInfo:function(e){
    let that=this;
    let params={
      mid: that.data.mid,
      appid: app.globalData.appid,
      unionid: app.globalData.unionid,
      storeid:that.data.storeId,
      memberId: that.data.memberMsg.memberId,  
      totalNumber:that.data.totalMoney,
      noDiscountNumber: that.data.noReduce,  
      isPoint:that.data.isPoint,  
      couponId:that.data.couponId,  
      payReduceMoney: that.data.payReduceMoney,  
      payType:that.data.payType,
      openid: app.globalData.openid
    }
    app.ajax('POST', params,'/cashier/merchants.php?m=Api&c=wxadoc&a=getPayInfo',(res)=>{
      if(res.data.err_code==0){
        console.log(res)
        wx.hideLoading();
        that.setData({
          payInfo:res.data.err_msg.payInfo,
          rechargeData: res.data.err_msg.rechargeData,
          couponMask: false,
          rechargeIndex:0,
        })
        if (res.data.err_msg.payInfo.couponId){
          that.setData({
            couponId: res.data.err_msg.payInfo.couponId,
          })
        };
        if(e){
          if (e == 'cardPay' && parseFloat(that.data.payInfo.pay_money) > parseFloat(that.data.memberMsg.money)){
            that.setData({
              payType: 'wx_balance'
            })
          } else if (e == 'wx_balance' && parseFloat(that.data.payInfo.pay_money) < parseFloat(that.data.memberMsg.money)){
            that.setData({
              payType: 'cardPay'
            })
          }else{
            that.setData({
              payType: e
            })
          }
          
        }else{
          if (that.data.payInfo.canCardPay){
            that.setData({
              payType:'cardPay'
            })
          } else if (!that.data.payInfo.canCardPay && that.data.rechargeData.length!=0){
            that.setData({
              payType: 'wx_balance'
            })
          } else if (!that.data.payInfo.canCardPay && that.data.rechargeData.length == 0){
            that.setData({
              payType: 'weixin'
            })
          }
        }
        
        if (!that.data.payInfo.canCardPay && that.data.payType =="weixin"){
          that.setData({
            wxWord: '微信直接买单支付' + that.data.payInfo.pay_money+'元',
            rechargeWord: '返回充值买单享优惠',
          });
        } else if (that.data.payInfo.canCardPay && that.data.payType == "weixin"){
          that.setData({
            wxWord: '微信直接买单支付' + that.data.payInfo.pay_money + '元',
            balanceWord: '返回余额买单享优惠',
          });
        }
        if (that.data.payType == "wx_balance"){
          that.setData({
            wxWord:'微信直接买单',
            rechargeWord:'充值并余额支付'
          })
        };
        if (that.data.payType == "cardPay") {
          that.setData({
            wxWord: '微信直接买单',
            balanceWord: '余额支付'
          })
        };
        that.setData({
          canPay:true
        })
        if(that.data.rechargeData.length){
          let remainMoney = 0;
          if (!that.data.memberMsg.money){
            that.data.memberMsg.money=0;
            that.setData({
              memberMsg: that.data.memberMsg
            })
          }
          remainMoney = (parseFloat(that.data.rechargeData[0].money) + parseFloat(that.data.rechargeData[0].gift) + parseFloat(that.data.memberMsg.money) - parseFloat(that.data.payInfo.pay_money)).toFixed(2);
          that.setData({
            remainMoney: remainMoney
          })
        }
      }
    },(res)=>{

    })
  },
  getMemberByTel: function () {
    let that = this;
    var phone='';
    if (app.globalData.phone){
      phone = app.globalData.phone
    }
    var params = {
      mid: that.data.mid,
      phone: phone,
      appid: app.globalData.appid,
      unionid: app.globalData.unionid,
      openid: app.globalData.openid
    };
    app.ajax('POST', params, '/cashier/merchants.php?m=Api&c=wxadoc&a=getMemberByTel', (res) => {
      wx.hideLoading();
      console.log(res)
      that.setData({
        memberMsg: res.data.err_msg,
        isMember:res.data.err_msg.isMember
      });
      that.getPayInfo(that.data.payType)
    }, (res) => {

    })
  },
  smallRechargeIndex:function(){
    let that=this;
    var phone = '';
    if (app.globalData.phone) {
      phone = app.globalData.phone
    }
    that.setData({
      phone: app.globalData.phone
    })
    var params = {
      openid:app.globalData.openid,
      mid: that.data.mid,
      phone: phone,
      appid: app.globalData.appid,
      unionid: app.globalData.unionid,
      storeid:that.data.storeId
    };
    app.ajax('POST', params, '/cashier/merchants.php?m=Api&c=wxadoc&a=smallRechargeIndex', (res) => {
      wx.hideLoading();
      var arr = Object.keys(res.data.err_msg.storeList);
      if (!res.data.err_msg.storeName){
        wx.showToast({
          icon:'none',
          title: '暂无开启门店',
        });
        setTimeout(function(){
          wx.navigateBack({
            delta: 1
          });
        },2000)
        return;
      }
      that.setData({
        storeList:res.data.err_msg.storeList,
        storeName: res.data.err_msg.storeName,
        storeId:res.data.err_msg.storeid,
        loadComplete:true,
        storeLen:arr.length
      });
      wx.setNavigationBarTitle({
        title: res.data.err_msg.storeName,
      })
      if(that.data.phone){
        that.getMemberByTel();
      }
    }, (res) => {

    })

  },
  weixinPay:function(){//微信直接买单
    let that=this;
    if (that.data.wxWord == '重新计算优惠金额中...'||!that.data.canPay){
      return;
    }
    if(that.data.payInfo.isSame){
      that.setData({
        payType:'weixin'
      })
    }
    if (that.data.payInfo.isSame && that.data.payType == 'weixin' || that.data.payType == 'weixin'||!that.data.isMember) {
      that.wxCardPay();
    } else if (!that.data.payInfo.isSame && !that.data.payInfo.canCardPay ){
      wx.showLoading({
        title: '加载中',
      })
      that.setData({
        wxWord: '重新计算金额中...',
        canPay:false
      });
      setTimeout(function(){
        that.setData({
          payType: 'weixin'
        });
        that.getPayInfo(that.data.payType);
      },1000)
      
    } else if (!that.data.payInfo.isSame &&that.data.payInfo.canCardPay){
      wx.showLoading({
        title: '加载中',
      })
      that.setData({
        wxWord: '重新计算金额中...',
        canPay: false
      });
      setTimeout(function () {
        that.setData({
          payType: 'weixin'
        });
        that.getPayInfo(that.data.payType);
      }, 1000)
    }
  },
  wxCardPay:function(){//微信直接买单接口
    let that=this;
    console.log(app.globalData.openid);
    let params={
      storeid:that.data.storeId,
      mid:that.data.mid,
      appid:app.globalData.appid,
      goods_price: that.data.payInfo.pay_money,
      old_price: that.data.totalMoney,
      openid:app.globalData.openid,
      member_id:that.data.memberMsg.memberId,
      ucid: that.data.memberMsg.ucid,
      goods_describe: that.data.sureRemark,
      phone:app.globalData.phone,
      unionid: app.globalData.unionid 
    };
    let payInfo=that.data.payInfo;
    params=Object.assign(params, payInfo);
    params.couponList='';
    app.ajax('POST',params, '/cashier/merchants.php?m=Api&c=wxadoc&a=wxCardPay',(res)=>{
      console.log(res);
      wx.hideLoading();
      if(!res.data.err_code){
        wx.requestPayment({
          timeStamp: res.data.err_msg.timeStamp,
          nonceStr: res.data.err_msg.nonceStr,
          package: res.data.err_msg.package,
          signType: res.data.err_msg.signType,
          paySign: res.data.err_msg.paySign,
          'success': function (res) {
            console.log(res)
            wx.navigateTo({
              url: 'consumeDetail?from=1&mid=' + that.data.mid,
            })
          },
          'fail':function(res){
            wx.showToast({
              title: '支付失败',
              icon: 'none'
            })
          }
        })
      }else{
        wx.showToast({
          title: res.data.errMsg,
          icon:'none'
        })
      }
    },(res)=>{

    })
  },
  balancePay:function(){//余额支付
    let that=this;
    if (that.data.balanceWord == '重新计算金额中...' || !that.data.canPay){
      return;
    }
    if (that.data.payInfo.isSame){
      that.setData({
        payType:'cardPay'
      })
    };
    if (that.data.payInfo.isSame && that.data.payType == 'cardPay' ||  that.data.payType == 'cardPay'){
      if (that.data.payInfo.isPwd) {
        that.setData({
          passwordNotice: '输入支付密码'
        })
      } else {
        that.setData({
          passwordNotice: '请用户设置余额支付密码，用于线上余额支付验证或商家线下验证会员身份'
        })
      }
      that.setData({
        passwordModal: true,
      })
    }else{
      wx.showLoading({
        title: '加载中',
      })
      that.setData({
        balanceWord: '重新计算金额中...',
        canPay:false
      });
      setTimeout(function () {
        that.setData({
          payType: 'cardPay'
        });
        that.getPayInfo(that.data.payType);
      }, 1000)
    }
    
  },
  CardPaying:function(){//余额支付接口
    let that = this;
    if (parseFloat(that.data.memberMsg.money) < parseFloat(that.data.payInfo.pay_money)){
      wx.showToast({
        title: '余额不足',
        icon:'none'
      });
      return;
    }
    let params = {
      storeid: that.data.storeId,
      mid: that.data.mid,
      appid: app.globalData.appid,
      goods_price: that.data.payInfo.pay_money,
      old_price: that.data.totalMoney,
      openid: app.globalData.openid,
      member_id: that.data.memberMsg.memberId,
      ucid: that.data.memberMsg.ucid,
      goods_describe: that.data.sureRemark,
      phone: app.globalData.phone,
      unionid: app.globalData.unionid 
    };
    let payInfo = that.data.payInfo;
    params = Object.assign(params, payInfo);
    params.couponList = '';
    app.ajax('POST', params, '/cashier/merchants.php?m=Api&c=wxadoc&a=CardPaying', (res) => {
      console.log(res)
      wx.hideLoading();
      if(!res.data.err_code){
        wx.showToast({
          title: '支付成功',
          icon:'none'
        })
        wx.redirectTo({
          url: 'payOver?cardLogo=' + res.data.data.cardLogo + '&goods_price=' + res.data.data.goods_price + '&name=' + res.data.data.name + '&old_price=' + res.data.data.old_price,
        })
      }else{
        wx.showToast({
          title: res.data.err_msg,
          icon:'none'
        })
      }
    }, (res) => {

    })
  },
  chargeBalancePay: function () {//充值并余额支付
    let that = this;
    console.log(that.data.canPay)
    if (that.data.rechargeWord == '重新计算金额中...' || !that.data.canPay){
      return;
    }
    console.log(133333)
    if (that.data.rechargeIndex=="a"){
      wx.showToast({
        title: '请选择充值档位',
        icon:'none'
      });
      return;
    };
    if (that.data.payInfo.isSame){
      that.setData({
        payType:'wx_balance',
        canPay:false
      })
    };
    if (that.data.payInfo.isSame && that.data.payType == 'wx_balance' || !that.data.isMember || that.data.payType == 'wx_balance') {
      that.wxRechargePay();
    } else if (!that.data.payInfo.isSame&&that.data.isMember){
      wx.showLoading({
        title: '加载中',
      });
      that.setData({
        rechargeWord: '重新计算金额中...'
      });
      setTimeout(function () {
        that.setData({
          payType: 'wx_balance'
        });
        that.getPayInfo(that.data.payType);
      }, 1000)
    }
  },
  wxRechargePay: function () {//微信充值并余额支付接口
    let that = this;
    let params = {
      storeid: that.data.storeId,
      mid: that.data.mid,
      appid: app.globalData.appid,
      goods_price: that.data.payInfo.pay_money,
      old_price: that.data.totalMoney,
      openid: app.globalData.openid,
      member_id: that.data.memberMsg.memberId,
      ucid: that.data.memberMsg.ucid,
      goods_describe: that.data.sureRemark,
      phone: app.globalData.phone,
      rechargeMoney: that.data.rechargeData[that.data.rechargeIndex].money,
      rechargePresent: that.data.rechargeData[that.data.rechargeIndex].gift,
      unionid: app.globalData.unionid 
    };
    let payInfo = that.data.payInfo;
    params = Object.assign(params, payInfo);
    params.couponList = '';
    app.ajax('POST', params, '/cashier/merchants.php?m=Api&c=wxadoc&a=wxRechargePay', (res) => {
      console.log(res)
      wx.hideLoading();
      if(!res.data.err_code){
        wx.requestPayment({
          timeStamp: res.data.err_msg.timeStamp,
          nonceStr: res.data.err_msg.nonceStr,
          package: res.data.err_msg.package,
          signType: res.data.err_msg.signType,
          paySign: res.data.err_msg.paySign,
          'success': function (res) {
            console.log(res)
            wx.navigateTo({
              url: 'consumeDetail?from=1&mid='+that.data.mid,
            })
          },
          'fail': function (res) {
            wx.showToast({
              title: '支付失败',
              icon: 'none'
            })
          }
        })
      }else{
        wx.showToast({
          title: res.errMsg,
          icon:'none'
        })
      }
    }, (res) => {

    })
  },
  switchChange2:function(e){
    console.log(e)
    let that=this;
    if(e.detail.value){
      that.setData({
        isPoint:1,
      })
    }else{
      that.setData({
        isPoint: 0
      })
    }
    that.getPayInfo(that.data.payType)
  },
  remarkInput:function(e){
    let that=this;
    that.setData({
      remarkMsg:e.detail.value
    })
  },
  remark:function(){
    let that=this;
    that.setData({
      inputTarget:0,
      keyBord:false,
      remarkModal:true,
      remarkMsg:that.data.sureRemark
    })
  },
  remarkClose:function(){
    let that=this;
    that.setData({
      remarkModal: false,
      remarkMsg:''
    })
  },
  remarkSure: function () {
    let that = this;
    if (that.data.remarkMsg==''){
      wx.showToast({
        title: '请输入备注信息',
        icon:'none'
      })
    }else{
      that.setData({
        remarkModal: false,
        sureRemark: that.data.remarkMsg
      })
    }
  },
  closeMask:function(){
    let that = this;
    that.setData({
      couponMask: false
    })
  },
  openCouponMask:function(e){
    let that = this;
    that.setData({
      couponMask: true
    })
  },
  selectCoupon:function(e){
    let that=this;
    console.log(e)
    that.setData({
      couponId:e.currentTarget.dataset.id
    })
    that.getPayInfo(that.data.payType);
  },
  reEdit:function(){
    let that=this;
    that.setData({
      firstStep: true,
      secondStep: false, 
      keyBord: true,
      inputTarget: 1,
      inputNum: that.data.totalMoney,
      payType:''
    })
    
  },
  sureMoney:function(){
    let that=this;
    // if(!that.data.phone){
    //   wx.showToast({
    //     title: '请先获取手机号',
    //     icon: 'none'
    //   });
    //   return;
    // };
    if (!that.data.totalMoney){
      wx.showToast({
        title: '请输入支付总额',
        icon:'none'
      });
      return;
    };
    if (that.data.totalMoney==0) {
      wx.showToast({
        title: '支付总额不能为0',
        icon: 'none'
      });
      return;
    };
    if (parseFloat(that.data.totalMoney) < parseFloat(that.data.noReduce)) {
      wx.showToast({
        title: '支付总额不能小于不优惠金额',
        icon: 'none'
      });
      return;
    };
    if(that.data.firstStep){
      that.getPayInfo('');
    }else{
      that.getPayInfo(that.data.payType);
    } 
    that.setData({
      firstStep: false,
      secondStep: true,
      keyBord:false
    })
    
  },
  deleteNum:function(){
    let that=this;
    let num = that.data.inputNum.slice(0, that.data.inputNum.length-1);
    if (that.data.inputNum.length<=1){
      num=''
    }
    that.setData({
      inputNum: num
    });
    if (that.data.inputTarget == 1) {
      that.setData({
        totalMoney: that.data.inputNum
      })
    } else if (that.data.inputTarget == 2) {
      that.setData({
        noReduce: that.data.inputNum
      })
    }
  },
  inputNum:function(e){
    let that=this;
    let num=e.currentTarget.dataset.val;
    let inputNum = that.data.inputNum;
    inputNum += num;
    inputNum = inputNum.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
    inputNum = inputNum.replace(/^\./g, ""); //验证第一个字符是数字
    inputNum = inputNum.replace("..", "."); //只保留第一个, 清除多余的
    inputNum = inputNum.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    inputNum = inputNum.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
    that.setData({
      inputNum: inputNum
    })
    if(that.data.inputTarget==1){
      that.setData({
        totalMoney: that.data.inputNum
      })
    } else if (that.data.inputTarget == 2){
      that.setData({
        noReduce: that.data.inputNum
      })
    }
    
  },
  closeBord:function(){
    var that = this;
    that.setData({
      keyBord: false
    })
  },
  bordShow1:function(){//支付总额
    var that=this;
    that.setData({
      keyBord: true,
      inputTarget:1,
      inputNum:that.data.totalMoney
    })
  },
  bordShow2: function () {//不优惠金额
    var that = this;
    that.setData({
      keyBord: true,
      inputTarget:2,
      inputNum: that.data.noReduce
    })
  },
  switchChange:function(e){
    console.log(e)
    let that=this;
    if(e.detail.value){
      that.setData({
        enterRemark:true,
        inputTarget: 2,
        keyBord:true,
        inputNum:'',
        noReduce:''
      })
    }else{
      that.setData({
        enterRemark: false,
        noReduce:'',
        inputNum: '',
        noReduce:''
      })
      if (that.data.secondStep) {
        console.log(111)
        that.setData({
          keyBord: false
        })
      }
    }
    if (that.data.secondStep){
      that.getPayInfo(that.data.payType);
    }
  }, 
   /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    console.log(options)
    if(options.init){
      that.setData({
        firstStep: true,
        secondStep: false,
        inputTarget: 1,
        inputNum: ''
      })
    }
    var scene = decodeURIComponent(options.scene);
    if (scene != 'undefined') {
      var tem = scene.split('=');
      that.setData({
        storeId:tem[0],
        mid: tem[1],
        fromCode:true
      })
    }else{
      that.setData({
        mid:options.mid,
        fromCode: false
      })
    }
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
    let that=this;
    console.log(that.data.init)
    
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          that.setData({
            authorize: false
          })
          wx.hideLoading();
        } else {
          that.setData({
            authorize: true
          })
        }
      }
    });
    if (!app.globalData.initComplete) {
      app.userInfoReadyCallback = function () {
        that.smallRechargeIndex();
      }
    } else {
      that.smallRechargeIndex();
    }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})