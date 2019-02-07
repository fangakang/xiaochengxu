// pages/register/register.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    authorize: true,
    phone:'',
    errorAccount:false,
    errorPhone:false,
    errorPass:false,
    errNick:false,
    agree:0,
    buttonText:'获取验证码',
    time:60,
    canSend:true,
    really_code:'',
    servicePhone:'',
    x:300,
    y:450,
    wxname:'',
    account:'',
    password:'',
    nick:'',
    sex: [{ value: 0, name: '先生',checked:true }, { value: 1, name: '女士' }],
    genderValue:0,
  },
  radioChange:function(e){
    console.log(e);
    let that=this;
    that.setData({
      genderValue:e.detail.value
    })
  },
  clearNick:function(e){
    let that = this;
    that.setData({
      nick:'',
      errNick: false
    })
  },
  nickInput:function(e){
    let that = this;

    let reg = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
    if (reg.test(e.detail.value)){
      that.setData({
        errNick:true
      })
    }else{
      that.setData({
        errNick: false
      })
    };
    if (!e.detail.value){
      that.setData({
        errNick: false
      })
    }
    that.setData({
      nick: e.detail.value
    })
  },
  wxnameInput:function(e){
    let that=this;
    that.setData({
      wxname: e.detail.value
    })
  },
  clearWxname:function(e){
    let that = this;
    that.setData({
      wxname: ''
    })
  },
  accountInput:function(e){
    let that=this;
    let reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
    let value = e.detail.value;
    if(reg.test(value)||value.length<4){
      that.setData({
        errorAccount:'账号可包含字母、数字、下划线，且长度不能少于4位',
        account: e.detail.value
      })
    }else{
      that.setData({
        errorAccount: false,
        account: e.detail.value
      })
    }
    if (!value){
      that.setData({
        errorAccount: false,
        account: e.detail.value
      })
    }
  },
  clearAccount:function(){
    let that = this;
    that.setData({
      account: '',
      errorAccount:false
    })
  },
  phoneCall:function(){
    var that=this;
    wx.makePhoneCall({
      phoneNumber: that.data.servicePhone //仅为示例，并非真实的电话号码
    })
  },
  seeProcotol:function(){
    wx.navigateTo({
      url: 'procotol',
    })
  },
  checkboxChange:function(e){
    let that=this;
    that.setData({
      agree: !that.data.agree
    })
  },
  clearPass:function(){
    let that=this;
    that.setData({
      password:'',
      errorPass:false
    })
  },
  enterPassword:function(e){
    let that=this;
    let reg1 = /^[0-9]+$/;
    let reg2=/^[a-zA-Z]+$/;
    let value=e.detail.value;
    if(value.length<6&&value.length>0){
      that.setData({
        errorPass:'密码长度不能小于6位'
      })
    } else if (reg1.test(value)||reg2.test(value)){
      that.setData({
        errorPass: '密码不能为纯数字或纯字母'
      })
    }else{
      that.setData({
        errorPass: false
      })
    };
    if(!value){
      that.setData({
        errorPass: false
      })
    }
    that.setData({
      password: value
    })
  },
  checkPhone:function(e){
    let that=this;
    if (that.data.phone.length==0){
      that.setData({
        errorPhone: '手机号不能为空'
      });
      return;
    }else if(that.data.phone.length<11){
      that.setData({
        errorPhone: '手机号长度不能小于11位'
      })
    }else{
      that.setData({
        errorPhone: false
      })
    }
  },
  clearPhone:function(e){
    let that=this;
    that.setData({
      phone:'',
      errorPhone:false
    })
  },
  enterPhone:function(e){
    console.log(e)
    let that=this;
    that.setData({
      phone:e.detail.value
    });
    if(that.data.phone.length==11){
      that.setData({
        errorPhone: false
      })
    }
  },
  countTime: function () {
    var that = this;
    that.data.time--;
    that.setData({
      time: that.data.time
    });
    if(that.data.time<1){
      that.setData({
        buttonText:'重新获取',
        canSend:true
      });
      return;
    }else{
      that.setData({
        buttonText:that.data.time+'s后重新获取',
        canSend:false
      })
    }
    setTimeout(function () {
      that.countTime();
    },1000)
  },
  getCode:function(){
    let that=this;
    let reg = /^1[3|4|5|7|8][0-9]{9}$/;
    if(!reg.test(that.data.phone)){
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      });
      return;
    };
    var params = {
      phone: that.data.phone,
      type: 'register',
      aid: app.globalData.agentid,
      minitype:'minitype'
    };
    app.ajax('POST', params, '/cashier/merchants.php?m=Index&c=login&a=getCode', (res) => {
      wx.hideLoading();
      console.log(res)
      if(res.data.error){
        wx.showToast({
          title: res.data.info,
          icon:'none'
        })
      }else{
        that.setData({
          buttonText: '60s后重新获取',
          time: 60,
          canSend: false
        });
        that.setData({
          really_code:res.data.info
        })
        that.countTime();
      }
    }, (res) => {

    })
  },
  formSubmit:function(e){
    let that=this;
    console.log(e)
    if(!that.data.agree){
      wx.showToast({
        title: '请先同意协议',
        icon:'none'
      })
      return;
    };
    if (!e.detail.value.wxname){
      wx.showToast({
        title: '请输入商户名称',
        icon: 'none'
      })
      return;
    };
    if (!e.detail.value.username) {
      wx.showToast({
        title: '请输入注册账户',
        icon: 'none'
      })
      return;
    };
    if (!e.detail.value.username) {
      wx.showToast({
        title: '请输入注册账户',
        icon: 'none'
      })
      return;
    };
    if (!e.detail.value.password || that.data.errorPass) {
      wx.showToast({
        title: '请设置正确的登录密码',
        icon: 'none'
      })
      return;
    };
    if (!e.detail.value.phone || that.data.errorPhone) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return;
    };
    if (!e.detail.value.code) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
      return;
    };
    if (that.data.errorAccount){
      wx.showToast({
        title: '请输入正确的账号',
        icon: 'none'
      })
      return;
    };
    if (!e.detail.value.nick ||that.data.errorNick) {
      wx.showToast({
        title: '请输入正确的联系人',
        icon: 'none'
      })
      return;
    }
    var params=e.detail.value;
    params.agentid = app.globalData.agentid;
    params.type='register';
    params.minitype = 'minitype';
    params.formId=e.detail.formId;
    params.agree = that.data.agree;
    params.really_code = that.data.really_code;
    app.ajax('POST', params, '/cashier/merchants.php?m=Index&c=login&a=signed', (res) => {
      wx.hideLoading();
      console.log(res)
      if(res.data.err_code){
        wx.showToast({
          title: res.data.err_msg,
          icon:'none'
        })
      }else{
        wx.showToast({
          title: '入驻成功',
          icon: 'none'
        });
        setTimeout(function(){
          wx.reLaunch({
            url: '../index/index',
          })
        },1000)
      }
    }, (res) => {

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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.setData({
      servicePhone:options.servicePhone
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
    let that=this;
    that.setData({
      phone: app.globalData.phone
    })
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

  
})