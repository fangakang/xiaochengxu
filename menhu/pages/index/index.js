var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadComplate:false,
    page:1,
    authorize:true,
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 500,
    advertisementList:[],
    allCateGory:[],
    allData:[],
    currentPage:1,
    canScroll:false,
    id:'',
    loadAll:false,
    searchMsg:'',
    inputValue: false,
    mainHeight:0,
    mini_title:'',
    shopIn:false,
    latest:true,
    near:false,
    indicatorDots2:false,
    autoplay2:false,
    service_tel:'',
    lbs:0
  },
  selectLatest:function(){
    var that=this;
    that.setData({
      latest: true,
      near: false,
      loadAll: false,
      allData:[],
      currentPage:1,
      lbs:0
    });
    that.cityIndex();
  },
  selectNear:function(){
    var that = this;
    that.setData({
      loadAll: false,
    })
    that.getSetting();
  },
  phoneCall:function(){
    var that = this;
    
    wx.makePhoneCall({
      phoneNumber: that.data.service_tel //仅为示例，并非真实的电话号码
    })
  },
  shopInShow:function(){
    var that=this;
    // this.setData({
    //   shopIn: true,
    // })
    wx.navigateTo({
      url: '../register/register?servicePhone=' + that.data.service_tel,
    })
  },
  shopInHide:function(){
    this.setData({
      shopIn: false,
    })
  },
  goodsDetail:function(e){
    var id=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'foodDetail?id='+id,
    })
  },
  searchPage:function(){
    wx.redirectTo({
      url: 'searchPage',
    })
  },
  searchSubmit: function (e) {
    console.log(e)
    var that = this;
    that.setData({
      searchMsg: e.detail.value,
      allData: [],
      currentPage: 1
    })
    that.cityIndex();
  },
  bindKeyInput: function (e) {
    console.log(e)
    var that = this;
    if (e.detail.value != '') {
      that.setData({
        inputValue: true,
      })
    }else{
      that.setData({
        inputValue: false,
      })
    }
  },
  scrollLoad:function(){
    var that=this;
    if(that.data.loadAll||that.data.lbs==1){
      that.setData({
        loadAll: true
      })
      return;
    };
    that.data.currentPage++;
    that.setData({
      currentPage: that.data.currentPage
    })
    that.cityIndex();
  },
  toDetail:function(e){
    console.log(e) 
    var id = e.detail.target.dataset.id,
        formId=e.detail.formId;
    if(id){
      wx.navigateTo({
        url: 'foodDetail?id=' + id + '&formId=' + formId + '&minitype=1',
      })
    }
    
  },
  getAllData:function(){
    var that=this;
    that.setData({
      allData: [],
      currentPage: 1,
      id: '',
      loadAll: false,
    });
    that.cityIndex();
  },
  searchType:function(e){
    console.log(e)
    var that=this;
    that.setData({
      id:e.currentTarget.dataset.id,
      allData: [],
      currentPage: 1,
      loadAll: false
    });
    that.cityIndex();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var scene = decodeURIComponent(options.scene);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
  bindGetUserInfo: function (e) {
    console.log(e)
    var that=this;
    console.log(e.detail.errMsg)
    if (e.detail.errMsg == "getUserInfo:ok") {
      app.getInfo();
      that.setData({
        authorize:true
      });
    }else{
      wx.showToast({
        title: '授权失败',
        icon:'none'
      })
    }
  },
  getSetting:function(){
    var that=this;
    wx.getSetting({
      success:res=>{
        if (!res.authSetting['scope.userLocation']) {//未进行位置授权
          wx.authorize({//进行地理位置授权
            scope: 'scope.userLocation',
            success(res) {
              console.log('获取地理位置授权成功');
              wx.getLocation({
                type: 'wgs84',
                success: function (res) {
                  getApp().globalData.latitude = res.latitude;
                  getApp().globalData.longitude = res.longitude;
                  console.log(res)
                  that.setData({
                    latest: false,
                    near: true,
                    loadAll: false,
                    allData: [],
                    lbs: 1
                  });
                  that.cityIndex();
                }
              })

            },
            fail() {
              that.openConfirm();
            }
          })
        }else{
          wx.getLocation({
            type: 'wgs84',
            success: function (res) {
              getApp().globalData.latitude = res.latitude;
              getApp().globalData.longitude = res.longitude;
              that.setData({
                latest: false,
                near: true,
                allData: [],
                lbs: 1
              });
              that.cityIndex();
            }
          });
          
        }
      }
    })
  },
  openConfirm: function () {
    wx.showModal({
      content: '检测到您未打开位置权限，是否去设置打开？',
      confirmText: "确认",
      cancelText: "取消",
      success: function (res) {
        console.log(res);
        //点击“确认”时打开设置页面
        if (res.confirm) {
          console.log('用户点击确认')
          wx.openSetting({
            success: (res) => {
              console.log(res)
             }
          })
        } else {
          console.log('用户点击取消')
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this;
    wx.getSystemInfo({
      success: function (res) {
        // 可使用窗口宽度、高度
        console.log('height=' + res.windowHeight);
        console.log('width=' + res.windowWidth);
        var height=45;
        if (res.windowHeight <= 572 && res.windowHeight>504){
          height=45;
        } else if (res.windowHeight <= 504){
          height = 40;
        }
        // 计算主体部分高度,单位为px
        that.setData({
          // second部分高度 = 利用窗口可使用高度 - first部分高度（这里的高度单位为px，所有利用比例将300rpx转换为px）
          mainHeight: res.windowHeight - height
        })
      }
    })
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
    if (app.globalData.extMid == '') {
      app.extReadyCallback = function () {
        that.cityIndex();
      }
    }
    else {
      that.cityIndex();
    }
  },

  cityIndex:function(){
    var that=this;
    var params={
      agentid: app.globalData.extMid,
      // openid: app.globalData.openid, 
      // unionid: app.globalData.unionid,
      page:that.data.currentPage,
      id:that.data.id,
      name: that.data.searchMsg,
      latitude: app.globalData.latitude,
      longitude: app.globalData.longitude,
      lbs: that.data.lbs
    };
    app.ajax('POST', params,'/cashier/merchants.php?m=Api&c=wxadoc&a=cityIndex',(res)=>{
      console.log(res)
      wx.hideLoading()
      if(res.data.err_code==0){
        if (res.data.err_msg.allData.length<8){
          that.setData({
            loadAll:true
          })
        }else{
          loadAll: false
        }
        if (that.data.page == 1 && res.data.err_msg.allData.length<=1){
          that.setData({
            canScroll:false,
          })
        }else{
          that.setData({
            canScroll: true,
          })
        }
        var allData = res.data.err_msg.allData
        console.log(res.data.err_msg.allCateGory)
        var allCateGory=[];
        for (var key in res.data.err_msg.allCateGory){
          allCateGory.push(res.data.err_msg.allCateGory[key])
        }
        that.setData({
          advertisementList: res.data.err_msg.advertisementList,
          allCateGory: allCateGory,
          allData: that.data.allData.concat(allData),
          loadComplate:true,
          mini_title: res.data.err_msg.mini_title,
          service_tel: res.data.err_msg.service_tel
        });
        wx.setNavigationBarTitle({
          title: res.data.err_msg.mini_title,
        })
        app.globalData.title = res.data.err_msg.mini_title;
        wx.stopPullDownRefresh();
        //调用组件内的方法
        that.selectComponent("#footView").queryMultipleNodes();
      }else{
        wx.stopPullDownRefresh();
        wx.showModal({
          title: '提示',
          content: res.data.err_msg,
          showCancel:false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        })
      }
    },(res)=>{

    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var that=this;
    that.setData({
      allData: [],
      currentPage: 1,
      id:'',
      loadAll:false,
      loadComplate:false
    })
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
    var that = this;
    that.setData({
      allData: [],
      currentPage: 1,
      id: '',
      loadAll: false,
    });
    that.cityIndex();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if (that.data.loadAll || that.data.lbs == 1) {
      that.setData({
        loadAll: true
      })
      return;
    };
    that.data.currentPage++;
    that.setData({
      currentPage: that.data.currentPage
    })
    that.cityIndex();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    return {
      title: that.data.mini_title,
      path: '/pages/index/index',
      imageUrl: that.data.advertisementList[0].image
    }
  }
})
