// components/navigation.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title:{
      type: String,
      default: "分类列表"
    },
    showIcon: {
      type: Boolean,
      default: true
    },
    showSearch: {
      type: Boolean,
      default: true
    },
    showTitle: {
      type: Boolean,
      default: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusBarHeight: 0,
    titleBarHeight: 0
  },

  ready: function () {
    // 因为很多地方都需要用到，所有保存到全局对象中
    if (app.globalData && app.globalData.statusBarHeight && app.globalData.titleBarHeight) {
      this.setData({
        statusBarHeight: app.globalData.statusBarHeight,
        titleBarHeight: app.globalData.titleBarHeight
      });
    } else {
      let that = this
      wx.getSystemInfo({
        success: function (res) {
          if (!app.globalData) {
            app.globalData = {}
          }
          if (res.model.indexOf('iPhone') !== -1) {
            app.globalData.titleBarHeight = 44
          } else {
            app.globalData.titleBarHeight = 48
          }
          app.globalData.statusBarHeight = res.statusBarHeight
          that.setData({
            statusBarHeight: app.globalData.statusBarHeight,
            titleBarHeight: app.globalData.titleBarHeight
          });
        },
        failure() {
          that.setData({
            statusBarHeight: 0,
            titleBarHeight: 0
          });
        }
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    headerBack(){
      wx.navigateBack({
        delta: 1
      })
    },
    backHome(){
      wx.switchTab({
        url: "/pages/index/index"
      })
    },
    toSearch(){
      wx.navigateTo({
        url: "/pages/search/search"
      })
    }
  }
})
