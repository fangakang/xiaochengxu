//index.js
//获取应用实例
const app = getApp();
Page({
  data: {
    pageTitle:'',
    authorize: true,
    userInfo: app.globalData.userInfo,
    imgUrls: [],
    indicatorDots: true,
    indicatorActiveColor:'#fff',
    autoplay: true,
    circular:true,
    interval: 5000,
    duration: 1000,
    motto: 'Hello World',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    headWidth: wx.getSystemInfoSync().windowWidth * 2,
    headHeight: wx.getSystemInfoSync().windowWidth * 1.32,
    imgArray:[],
    bargainData:{},
    bargainTime:{
      hour: '00',
      minute: '00',
      second: '00',
      start: true
    },
    gropData:{},
    groupTime: {
      hour: '00',
      minute: '00',
      second: '00',
      start:true
    },
    killTime: {
      endTime: '2018-3-9',
      hour: '00',
      minute: '00',
      second: '00'
    },
    title:123,
    is_store: 1, 
    merdesc:'',
    introduce:false,
    merdescOriginal:'',//未处理的商家介绍
    data:[],
    noPersonMsg:false,
    loadAll:false,
    loadComplete:false,
    mid:'',
    nav_img:''
  },
  showMask:function(){
    var that=this;
    // if (that.data.merdesc!=''){
    //   this.setData({
    //     introduce: true
    //   })
    // }else{
    //   wx.showToast({
    //     title: '暂未配置商家介绍',
    //     icon:'none'
    //   })
    // }
    // wx.showModal({
    //   title: '商家介绍',
    //   content: that.data.merdesc,
    //   confirmText:'我知道了',
    //   showCancel:false,
    //   success:function(res){
    //
    //   }
    // })
      wx.navigateTo({
          url: 'shopDetail?content='+that.data.merdesc
      })
  },
  closeMask:function(e){
    this.setData({
      introduce:false
    })
  },
  use:function(e){
    wx.navigateTo({
      url: '../userCenter/useBalance?gcid=0',
    })
  },
  onShareAppMessage: function (e) {//分享功能
  var that=this;
    return {
      title: '个性化选购，馈赠亲朋好友，少不了它',
      path: '/pages/index/index',
      imageUrl: that.data.nav_img,
      desc: '最具人气的小程序开发联盟!',
      success: function (res) {
      },
      fail: function (res) {
        console.log(res)
      }
    }
  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  viewDetail:function(){
    wx.navigateTo({
      url: 'detail'
    })
  },
  cutPrice:function(){
    wx.navigateToMiniProgram({
      appId: 'wx2f0e7a7202e16bde',
      path: '../../../cutPic/pages/index/index',
      extraData: {
        foo: 'bar'
      },
      envVersion: 'develop',
      success(res) {
        console.log(res)
      }
    })
  },
  groupTimeCount:function(time){//拼团倒计时
    var that=this;
    var nowTime = new Date().getTime() / 1000;//当前时间;
    var endTime=0;
    if (time.stime > nowTime){//尚未开始
      endTime = time.stime;
      that.data.groupTime.start=true;
    } else {//已开始
      endTime = time.etime
      that.data.groupTime.start = false;
    }
    if (nowTime>time.etime){//已结束
      that.setData({
        gropData:false
      });
      return;
    }
    var seconds = endTime - nowTime;
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
    that.data.groupTime.hour = hour;
    that.data.groupTime.minute = minute;
    that.data.groupTime.second = second;
    var that = this;
    that.setData({
      groupTime: that.data.groupTime
    });
    setTimeout(function () {
      that.groupTimeCount(time);
    }, 1000)
  },
  bargainTimeCount: function (time) {//砍价倒计时
    if(time.flag==false){
      return
    }
    var that = this;
    var nowTime = new Date().getTime()/1000;//当前时间;
    var endTime=0;
    if (time.createtime > nowTime) {//尚未开始
      endTime = time.starttime;
      that.data.bargainTime.start = true;
    } else {//已开始
      endTime = time.endtime;
      that.data.bargainTime.start = false;
    }
    if (nowTime > time.endtime){//已结束
      that.data.bargainData.flag=false;
      that.setData({
        bargainData: that.data.bargainData
      })
    }
    var seconds = endTime - nowTime;
    var hour = Math.floor(seconds / 60 / 60);
    var minute = Math.floor(seconds/ 60 % 60);
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
  
    that.data.bargainTime.hour = hour;
    that.data.bargainTime.minute = minute;
    that.data.bargainTime.second = second;
    that.setData({
      bargainTime: that.data.bargainTime
    });  
    setTimeout(function () {
      that.bargainTimeCount(time);
    }, 1000)
  },
  killTimeCount: function (time) {//秒杀倒计时
    var endTime = new Date(time.endTime),//结束时间
        nowTime = new Date(),//当前时间
        total_micro_second = endTime.getTime() - nowTime.getTime();
    if (total_micro_second < 0) {
      return;
    }
    var total_days = total_micro_second / (24 * 60 * 60 * 1000), //总天数
      total_show = Math.floor(total_days), //实际显示的天数
      total_hours = (total_days - total_show) * 24,//剩余小时
      hours_show = Math.floor(total_hours), //实际显示的小时数
      total_minutes = (total_hours - hours_show) * 60, //剩余的分钟数
      minutes_show = Math.floor(total_minutes), //实际显示的分钟数
      total_seconds = (total_minutes - minutes_show) * 60, //剩余的分钟数
      seconds_show = Math.floor(total_seconds), //实际显示的秒数
      hours_true = total_show * 24 + Math.floor(total_hours)//实际显示的小时数
    if (total_show < 10) {
      total_show = '0' + total_show
    };
    if (hours_true < 10) {
      hours_true = '0' + hours_true
    };
    if (minutes_show < 10) {
      minutes_show = '0' + minutes_show
    };
    if (seconds_show < 10) {
      seconds_show = '0' + seconds_show
    };
    time.hour = hours_true;
    time.minute = minutes_show;
    time.second = seconds_show;
    var that = this;
    that.setData({
      killTime: time
    });
    setTimeout(function () {
      that.killTimeCount(time);
    }, 1000)
  },
  
  onLoad: function () {
    var that = this;
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          that.setData({
            authorize:false
          })
          wx.hideLoading();
        }else{
          that.setData({
            authorize: true
          })
        }
      }      
    });
    console.log(app.globalData.mid) 
    if(app.globalData.mid==''){
      app.userInfoReadyCallback = function () { 
        that.index();
      } 
    }
    else{
      that.index();
    } 
  },
  index:function(){
    var pages = getCurrentPages();
    if (pages[0].route != 'pages/index/index'){
        return;
    }
    wx.showLoading({
      title: '加载中...',
    })
    var that=this;
    console.log(app.globalData)
    wx.request({
      url: app.globalData.urlHead+'/cashier/merchants.php?m=Api&c=wxadoc&a=index',
      data: {
        mid: getApp().globalData.mid,
        openid: getApp().globalData.openid,
        unionid: getApp().globalData.unionid,
        appid: getApp().globalData.appid
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        wx.hideLoading();
        console.log(res.data.err_msg);
        
        var jsonStr = res.data.err_msg.nav_img;//头部swiper
        var imgUrls = [],
          n = {};
        for (var key in jsonStr) {
          n = { 'url': key.substr(1), 'href': jsonStr[key] };
          imgUrls.push(n);
        }
        if (res.data.err_msg.groupBuy) {
          that.data.groupData = res.data.err_msg.groupBuy
        } else {
          that.data.groupData = false;
        }
        var merdesc = res.data.err_msg.data.merdesc;
        // if (res.data.err_msg.data.merdesc){
        //   var merdesc = res.data.err_msg.data.merdesc;
        //   merdesc = merdesc.split('ptiegsctmstest');
        // }else{
        //   var merdesc = '';  
        // }
        that.setData({
          imgUrls: imgUrls,
          imgArray: res.data.err_msg.card_list[1].card_list,
          bargainData: res.data.err_msg.bargain,
          groupData: that.data.groupData,
          is_store:app.globalData.is_store,
          merdesc: merdesc,
          merdescOriginal: res.data.err_msg.data.merdesc,
          data:res.data.err_msg.data,
          nav_img: res.data.err_msg.nav_img,
          loadAll:true,
          loadComplete:true,
          pageTitle: res.data.err_msg.data.title
        })
        console.log(res.data.err_msg.data.title)
        that.bargainTimeCount(that.data.bargainData);
        that.groupTimeCount(that.data.groupData);
        that.killTimeCount(that.data.killTime);
        wx.setNavigationBarTitle({
          title: that.data.pageTitle
        })
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },

})
