import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { InputItem } from '@components'
import './index.scss'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '登录'
  }

  static defaultProps = {
    userInfo: {},
    openId: ''
  }

  state = {
    name: '',
    section: '',
    btnText: '授权',
    authorization: true // todo 待修改或完善
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
        this.setState({ authorization: true , btnText: '登录'})
      } else {
        console.log(res.data[0]);
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

  handleInput = (key, value) => {
    this.setState({ [key]: value })
  }

  render () {
    const { name, section, btnText, authorization } = this.state
    return (
      <View className='index'>
        {authorization &&
        <View className='inputBorder'>
          <InputItem
            value={name}
            placeholder='请输入姓名'
            onInput={this.handleInput.bind(this, 'username')}
          />
          <InputItem
            value={section}
            placeholder='请输入部门'
            onInput={this.handleInput.bind(this, 'password')}
          />
        </View>
        }
        <Button className='loginBtn' type='primary' lang='zh_CN' open-type='getUserInfo' onGetUserInfo={this.login}>{btnText}</Button>
      </View>
    )
  }
}
