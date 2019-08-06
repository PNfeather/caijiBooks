import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { InputItem } from '@components'
import './index.scss'
import { connect } from '@tarojs/redux'
import dispatchUserInfo from '@actions/user'

@connect(state => state, (dispatch) => ({
  changeUserInfo (data) {
    dispatch(dispatchUserInfo(data))
  }
}))

export default class Index extends Component {

  config = {
    navigationBarTitleText: '登录'
  }

  state = {
    userInfo: {},
    openId: '',
    name: '',
    section: '',
    btnText: '授权',
    authorization: false
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
      this.setState({ openId: res.result.openid})
      this.getIsExist();
    });
  }

  getIsExist () {
    const user = wx.cloud.database().collection('user');
    user.where({
      _openid: this.state.openId
    }).get().then(res => {
      if (res.data.length === 0) {
        this.setState({ authorization: true , btnText: '登录'})
      } else {
        this.props.changeUserInfo(res.data[0].user)
        Taro.switchTab({
          url: '/pages/index/index'
        })
      }
    });
  }

  addUser () {
    const user = wx.cloud.database().collection('user');
    user.add({
      data: {
        user: this.state.userInfo
      }
    }).then(res => {
      console.log(res);
      Taro.switchTab({
        url: '/pages/index/index'
      })
    });
  }

  login (e) {
    if (this.state.authorization) {
      const {name, section} = this.state
      if (name === '') {
        return Taro.showToast({
          title: '请输入姓名~',
          icon: 'none'
        })
      }
      if (section === '') {
        return Taro.showToast({
          title: '请输入部门~',
          icon: 'none'
        })
      }
      let userInfo = Object.assign({}, this.state.userInfo, {name}, {section})
      this.setState({userInfo: userInfo})
      this.addUser()
    } else {
      if (e.target.errMsg === 'getUserInfo:ok') {
        wx.getUserInfo({
          success: (res) => {
            this.setState({userInfo: res.userInfo})
            this.getOpenId();
          }
        });
      }
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
            onInput={this.handleInput.bind(this, 'name')}
          />
          <InputItem
            value={section}
            placeholder='请输入部门'
            onInput={this.handleInput.bind(this, 'section')}
          />
        </View>
        }
        <Button className='loginBtn' type='primary' lang='zh_CN' open-type='getUserInfo' onGetUserInfo={this.login}>{btnText}</Button>
      </View>
    )
  }
}
