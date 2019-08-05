import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import './index.scss'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '登录'
  }

  static defaultProps = {
    userInfo: {},
    openId: ''
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  getOpenId () {
    wx.cloud.callFunction({
      name: 'user'
    }).then(res => {
      this.props.openId = res.result.openid;
      this.getIsExist();
    });
  }

  getIsExist () {
    const user = wx.cloud.database().collection('user');
    user.where({
      _openid: this.props.openId
    }).get().then(res => {
      if (res.data.length === 0) {
        this.addUser();
      }
    });
  }

  addUser () {
    const user = wx.cloud.database().collection('user');
    user.add({
      data: {
        user: this.props.userInfo
      }
    });
  }

  login (e) {
    if (e.target.errMsg === 'getUserInfo:ok') {
      wx.getUserInfo({
        success: (res) => {
          this.props.userInfo = res.userInfo;
          this.getOpenId();
        }
      });
    }
  }

  render () {
    return (
      <View className='index'>
        <Button className='loginBtn' type='primary' lang='zh_CN' open-type='getUserInfo' onGetUserInfo={this.login}>登录</Button>
      </View>
    )
  }
}
