//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 6000,
    duration: 800,
    swiperCurrent: 0,
    iphone: false,
    loadingHidden: false, // loading
    wxlogin: true,
    loadingMoreHidden: true,
    showSearch: true,
  },
  onShow: function () {
    var that = this;
    setTimeout(function () {
      // 检验globalData上有没有token,没有的话表示用户还没有授过权，需要显示授权块
      if (!app.globalData.hasOwnProperty('token')) {
        console.log("没token")
        that.setData({
          wxlogin: false
        })
        wx.hideTabBar();
      } else {
        console.log("有token");
      }
    }, 2000)
    //购物车
    app.getShopCartNum()
  },
  onPageScroll: function (ev) {
    if (ev.scrollTop >= 180) {
      wx.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#ffffff'
      })
      app.fadeInOut(this, 'fadeAni', 1);
    } else {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#ffffff'
      })
      app.fadeInOut(this, 'fadeAni', 0);
    }
  },
  onLoad: function () {
    var that = this;
    // 页面加载完立即消失
    app.fadeInOut(this, "fadeAni", 0);
    if (app.globalData.iphone == true) {
      that.setData({
        iphone: true
      })
    }
    //首页顶部Logo
    wx.request({
      url: app.globalData.urls + '/banner/list',
      data: {
        type: 'toplogo'
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            toplogo: res.data.data[0].picUrl,
            topname: wx.getStorageSync('mallName')
          });
          // console.log(that.data.topname);
        }
      }
    })

    //首页轮播图
    wx.request({
      url: app.globalData.urls + '/banner/list',
      data: {
        type: 'home'
      },
      success: function (res) {
        // console.log("轮播",res);
        if (res.data.code == 0) {
          that.setData({
            banners: res.data.data
          });
        }
      }
    })

    //4个功能展示位
    wx.request({
      url: app.globalData.urls + '/banner/list',
      data: {
        // key: 'mallName',
        type: 'sale'
      },
      success: function (res) {
        // console.log("功能",res)
        if (res.data.code == 0) {
          that.setData({
            sales: res.data.data
          });
        }
      }
    })
    //4个热销广告位
    wx.request({
      url: app.globalData.urls + '/banner/list',
      data: {
        type: 'hot'
      },
      success: function (res) {
        // console.log("热销",res)
        if (res.data.code == 0) {
          that.setData({
            hot: res.data.data
          });
        }
      }
    })

    //获取推荐商品信息
    wx.request({
      url: app.globalData.urls + '/config/get-value',
      data: {
        key: 'topgoods'
      },
      success: function (res) {
        // console.log("推荐给你",res);
        if (res.data.code == 0) {
          that.setData({
            topgoods: res.data.data
          });
          wx.request({
            url: app.globalData.urls + '/shop/goods/list',
            data: {
              recommendStatus: 1,
              pageSize: 10
            },
            success: function (res) {
              // console.log("推荐",res);
              that.setData({
                goods: [],
                loadingMoreHidden: true
              });
              var goods = [];
              if (res.data.code != 0 || res.data.data.length == 0) {
                that.setData({
                  loadingMoreHidden: false,
                });
                return;
              }
              for (var i = 0; i < res.data.data.length; i++) {
                goods.push(res.data.data[i]);
              }
              that.setData({
                goods: goods,
              });
            }
          })
        }
      }
    })
  },
  
  swiperchange: function (e) {
    // console.log(e);
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  toDetailsTap: function (e) {
    wx.navigateTo({
      url: "/pages/goods-detail/goods-detail?id=" + e.currentTarget.dataset.id
    })
  },
  tapBanner: function (e) {
    if (e.currentTarget.dataset.id != 0) {
      wx.navigateTo({
        url: "/pages/goods-detail/goods-detail?id=" + e.currentTarget.dataset.id
      })
    }
  },
  tapSales: function (e) {
    if (e.currentTarget.dataset.id != 0) {
      wx.navigateTo({
        url: e.currentTarget.dataset.id
      })
    }
  },
  userlogin: function (e) {
    var that = this;
    var iv = e.detail.iv;
    var encryptedData = e.detail.encryptedData;
    wx.login({
      success: function (wxs) {
        wx.request({
          url: app.globalData.urls + '/user/wxapp/register/complex',
          data: {
            code: wxs.code,
            encryptedData: encryptedData,
            iv: iv
          },
          success: function (res) {
            console.log("返回", res);
            if (res.data.code != 0) {
              wx.showModal({
                title: '温馨提示',
                content: '需要您的授权，才能正常使用哦～',
                showCancel: false,
                success: function (res) { }
              })
            } else {
              that.setData({
                wxlogin: true
              });
              app.login();
              wx.showToast({
                title: '授权成功',
                duration: 2000
              })
              app.globalData.usinfo = 1;
              wx.showTabBar();
            }
          }
        })
      }
    })
  }
})
