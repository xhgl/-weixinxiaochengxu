//  var dataObj = require('../../data/data.js');
// import {postList} from '../../data/data.js'
import { dbpost } from '../../db/dbpost.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // postList:dataObj.postList
    // postList:postList
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let that = this;
    //从缓存中将数据提取出来
    //   wx.getStorage({
    //     key: 'postList',
    //     success: function (res) {
    //       that.setData({
    //         postList: res.data
    //       });
    //   },
    // }) 


    //调用dbpost的相关方法得到数据
    this.dbPost = new dbpost();
    var postList = this.dbPost.getAllPostData();
    this.setData({
      postList: postList
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //用户点击页面上某项时跳转到详情页面
  li: function (event) {
    let postId = event.currentTarget.dataset.postId;
    //得到被点击的文章的Id号
    //跳转详情页(同时携带postId过去)

    wx.navigateTo({
      url: '../post-detall/post-detall?id=' + postId,
    })
  }
})