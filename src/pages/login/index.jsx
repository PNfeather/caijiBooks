import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import './index.scss'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '登录'
  }

  static defaultProps = {
    userInfo: {}
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  getOpenId () {

  }

  login (e) {
    if (e.target.errMsg === 'getUserInfo:ok') {
      wx.getUserInfo({
        success: (res) => {
          console.log(res);
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
