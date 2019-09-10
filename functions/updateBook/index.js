const cloud = require('wx-server-sdk');

cloud.init({
  env: 'caijitushu-yahh6',
  traceUser: true
});
const db = cloud.database();
const _ = db.command
exports.main = (event, context) => {
  const bookList = db.collection('bookList');
  const {id, updateInfo, type} = event;
  let params;
  if (!type) {
    params = updateInfo
  } else if (type === 'repay') {
    params = {borrowInfo: _.remove()}
  } else if (type === 'remove') {
    params = {
      donateInfo: _.remove(),
      borrowInfo: _.remove()
    }
  }

  bookList.doc(id).update({
    data: params
  });
};
