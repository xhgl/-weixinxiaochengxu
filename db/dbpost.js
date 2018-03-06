class dbpost {
  constructor(postId) {
    this.postId = postId
  }
  //获取缓存数据
  getAllPostData() {
    let postList = wx.getStorageSync('postList');
    return postList;
  }
  //根据id获取缓存数据
  getPostById() {
    // this.postId= postId;   //讲对象保存在对象属性上 
    let postList = this.getAllPostData();
    // console.log(postId);
    for (let i in postList) {
      if (postList[i].postId == this.postId) {
        return {
          index: i,
          data: postList[i]
        }
      }
    }
  }
  //  更新数据
  updateData(type, newComment=null) {
    let op = this.getPostById();
    let oppen = op.data;
    if (type == 'collection') {

      //  console.log(oppen.collectionStatus, typeof oppen.collectionStatus);
      if (oppen.collectionStatus) {
        oppen.collectionStatus = false;
        oppen.collectionNum--;
        //  console.log("a")
      } else {
        oppen.collectionStatus = true;
        oppen.collectionNum++;
        //  console.log("b");
      }

    } else if (type == 'up') {
      if (oppen.upStatus) {
        oppen.upStatus = false;
        oppen.upNum--;
      } else {
        oppen.upStatus = true;
        oppen.upNum++;
      }
    } else if (type == 'comment'){
      //当添加新评论时
      oppen.comments.push(newComment);
    }



    console.log(oppen)
    //更新缓存(取出然后在设置回去)
    let all = this.getAllPostData();
    //  console.log("11:" + all[op.index]);
    all[op.index] = oppen;
    //  console.log("22:" + all[op.index]);
    //  console.log(all);
    wx.setStorageSync('postList', all);
    return oppen
  }


  //获取评论的功能
  getcomment(){
    //按时间倒序排序
    //时间格式
     let postdata = this.getPostById();
     console.log(postdata);
     postdata.data.comments.sort(function(item1,item2){  //创建时间倒序
          return item2.create_time-item1.create_time;
     });
     for(let i in postdata.data.comments){
       let time = Number(postdata.data.comments[i].create_time);
       postdata.data.comments[i].create_time = new Date(time).toLocaleString();
     }
     return postdata.data.comments
  }
}

export { dbpost }