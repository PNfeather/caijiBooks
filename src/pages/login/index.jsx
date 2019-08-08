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

  onShareAppMessage (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '采集图书馆',
      path: 'pages/login/index'
    }
  }

  componentWillMount () {
    wx.getStorage({
      key: 'CAIJI_CURRENTUSERINFO',
      success: (res) => {
        if (res && res.data) {
          this.changeAndStoreUserInfo(res.data, true)
          Taro.switchTab({
            url: '/pages/index/index'
          })
        }
      }
    })
  }

  getOpenId () {
    wx.cloud.callFunction({
      name: 'user'
    }).then(res => {
      this.setState({ openId: res.result.openid})
      setTimeout(() => {
        this.getIsExist();
      })
    });
  }

  changeAndStoreUserInfo (data, dontStore) {
    this.props.changeUserInfo(data);
    !dontStore && wx.setStorageSync('CAIJI_CURRENTUSERINFO', data)
  }

  getIsExist () {
    const user = wx.cloud.database().collection('user');
    user.where({
      _openid: this.state.openId
    }).get().then(res => {
      if (res.data.length === 0) {
        this.setState({ authorization: true , btnText: '登录'})
      } else {
        this.changeAndStoreUserInfo(res.data[0])
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
      console.log(userInfo);
      this.setState({userInfo: userInfo})
      this.changeAndStoreUserInfo(userInfo)
      setTimeout(() => {
        this.addUser()
      })
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
