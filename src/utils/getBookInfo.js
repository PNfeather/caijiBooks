import Taro from "@tarojs/taro";

export default function getBookInfo(isbn, callback) {
  const bookList = wx.cloud.database().collection('bookList');
  bookList.where({
    isbn: isbn
  }).get().then(res => {
    if (res.data.length === 0) {
      wx.request({
        //项目的真正接口，通过字符串拼接方式实现
        url: 'https://api.jisuapi.com/isbn/query?appkey=30221f54092e628c&isbn=' + isbn,
        header: {
          "content-type": "application/json;charset=UTF-8"
        },
        data: {},
        method: 'get',
        success: function (inRes) {
          bookList.add({
            data: {
              isbn: isbn,
              bookInfo: inRes.data.result
            }
          }).then(addRes => {
            console.log(addRes);
            callback({
              isbn: isbn,
              bookInfo: inRes.data.result
            })
          });
        }
      })
    } else {
      callback(res.data[0])
    }
  });
}
