// pages/post-detall/post-detall.js
import { dbpost } from '../../db/dbpost.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    let postId = options.id;
    // console.log(postId);
    //调用dbpost的方法h获取对应的w文章内容
    this.dbPost = new dbpost(postId);
    let oppen = this.dbPost.getPostById();
    // console.log(oppen)
    this.setData({
      oppen: oppen.data
    });


    wx.setNavigationBarTitle({
      title: oppen.data.title,
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



  //用户点击收藏时的处理
  onCollectionTap:function(){
    //调用dbpost的相关方法
    let oppen = this.dbPost.updateData('collection'); 
    this.setData({
      oppen: oppen
    });


   //页面数据更新
   this.setData({
     oppen:oppen
   });


    //弹出提示框//交互反馈
    wx.showToast({
      title: oppen.collectionStatus?'收藏成功':'取消收藏',
      icon:'success',
      duration:2000
    })
  },

  //用户点赞/取消点赞
  onUpStatus:function(){
    let oppen = this.dbPost.updateData('up');
  this.setData({
    oppen:oppen
  });
  wx.showToast({
    title: oppen.upStatus ? '点赞成功' : '取消点赞',
    icon: 'success',
    duration: 2000
  })
  },
  //用户点击评论时的功能
  comment:function(){
    //跳转到评论页
    wx.navigateTo({
      url: '../post-comment/post-comment?id=' + this.dbPost.postId,
    })
  }
})