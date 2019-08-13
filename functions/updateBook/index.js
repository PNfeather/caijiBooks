const cloud = require('wx-server-sdk');

cloud.init({
  env: 'caijitushu-pajln',
  traceUser: true
});
const db = cloud.database();
exports.main = (event, context) => {
  const bookList = db.collection('bookList');
  const {id, updateInfo} = event;
  bookList.doc(id).update({
    data: updateInfo
  });
};
