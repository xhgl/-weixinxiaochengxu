// pages/post-comment/post-comment.js
import {dbpost} from '../../db/dbpost.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
  comments:[],
  txt:'',
  sendImageFlag:false,
  chooseImages:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  // console.log(options);
  let postId = options.id;
  this.dbPost= new dbpost(postId);
  let comments = this.dbPost.getcomment();
  // console.log(comments);
  this.setData({
    comments:comments
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
  //预览图片
  previewImg:function(event){
    let commentIndex = event.currentTarget.dataset.commentIndex;
    let imageIndex = event.currentTarget.dataset.imageIndex;
    // console.log(commentIndex, imageIndex);
    let imgs = this.data.comments[commentIndex].content.img;
    wx.previewImage({
      current: imgs[imageIndex],
      urls: imgs,
    })
  },


  /**
  * 处理用户输入信息
  */
  onInputValue: function (event) {
    //获取用户的输入
    //将用户输入的信息绑定到data的某个属性
    let txt = event.detail.value;
    this.setData({
      txt: txt
    });
  },

  /**
   * 点击发送时的功能
   */
  sendComment: function () {
    //点击发送时添加新评论
    this.submitComment();
  },

  submitComment: function () {
    console.log(this.data);
    let newComment = {
      // username: this.data.userInfo.nickName,    //从用户信息中提取(6)
      username:'XIAOMI',
      // avatar: this.data.userInfo.avatarUrl,
      create_time: new Date().getTime(),
      content: {
        txt: this.data.txt,
        img: this.data.chooseImages,
        audio: null
      }
    };
    if (!this.audio) {
      newComment.content.txt = this.data.txt;
      newComment.content.img = this.data.chooseImages;
    } else {
      newComment.content.audio = this.audio;
    }

    this.dbPost.updateData('comment', newComment);
    //将缓存的评论数据再获取一次
    this.setData({
      comments: this.dbPost.getcomment()
    });

    //清空用户输入
    this.setData({
      txt: '',
      sendImageFlag: false,
      chooseImages: [],
      audio: null
    });
  },


  /**
   * 点击加号图标时的处理
   */
  showSendMoreBox: function () {
    this.setData({
      sendImageFlag: true
    });
  },

  /**
   * 点击列表区关闭图片选择功能
   */
  hideSendMoreBox: function () {
    this.setData({
      sendImageFlag: false
    });
  },

  /**
   * 选择图片
   */
  chooseImages: function (event) {
    let type = event.currentTarget.dataset.type;
    let that = this;
    let imgArray = this.data.chooseImages;
    console.log(imgArray);
    let count = 3 - imgArray.length;
    if (count <= 0) {
      return;
    }
    wx.chooseImage({
      count: count,
      sourceType: [type],
      success: function (res) {
        let paths = res.tempFilePaths;
        console.log(paths);
        that.setData({
          chooseImages: imgArray.concat(paths)
        });
      }
    })
  },







  /**
   * 删除某个图片
   */
  deleteImage: function (event) {
    let index = event.currentTarget.dataset.index;
    this.data.chooseImages.splice(index, 1);
    this.setData({
      chooseImages: this.data.chooseImages
    });
  },



  /**
     * 获取用户信息(5)
     * 此方法在弹框出现，用户做出选择之后执行
     */
  getUserInfo: function (event) {
    console.log(event);
    let userInfo = {};
    if (event.detail.errMsg == 'getUserInfo:fail auth deny') {  //表示用户拒绝授权
      userInfo = { nickName: '匿名', avatarUrl: '/images/avatar/niming.png' };
      console.log('deny');
    } else if (event.detail.errMsg == 'getUserInfo:ok') {   //表示用户同意授权
      app.globalData.userInfo = event.detail.userInfo;
      userInfo = event.detail.userInfo;
      console.log('ok');
    }
    //保存用户信息至data属性上
    this.setData({
      userInfo: userInfo
    });

    //发送功能
    this.submitComment();
  },

  switchType: function () {
    this.setData({
      isKeyboard: !this.data.isKeyboard
    });
  },

  /**
   * 开始录音
   */
  recordStart: function () {
    //
    let that = this;
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.record']) {   //如果录音功能已授权 
          that.myAudio();
        } else {                                    //如果未授权
          wx.authorize({                          //调用授权窗口
            scope: 'scope.record'
          })
        }
      }
    });
  },

  myAudio: function () {
    let that = this;
    this.setData({
      recording: 'recording'
    });
    this.startTime = new Date().getTime();

    wx.startRecord({
      success: function (res) {     //结束录音时的回调
        console.log("end");
        console.log(res);
        let len = Math.ceil((that.endTime - that.startTime) / 1000);
        console.log(len);
        let audio = {
          url: res.tempFilePath,
          timeLen: len
        };

        //发送音频
        that.audio = audio;
        that.submitComment();
      }
    });
  },
  /**结束录音 */
  recordEnd: function () {
    this.endTime = new Date().getTime();
    this.setData({
      recording: ''
    });
    console.log("222");
    wx.stopRecord();

  },

  /**
   * 语音播放
   */
  playAudio: function (event) {
    let url = event.currentTarget.dataset.url;
    wx.playVoice({
      filePath: url
    });
  }

})