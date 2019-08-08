import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image} from '@tarojs/components'
import borrow from './assets/borrow.png'
import donate from './assets/donate.png'
import repay from './assets/repay.png'
import remove from './assets/remove.png'
import './index.scss'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
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

  scanBook (type) {
    Taro.scanCode().then((res) => {
      wx.navigateTo({
        url: `/pages/${type}/index?isbn=${res.result}`
      })
    }).catch(() => {
      Taro.showToast({
        title: '扫码异常',
        icon: 'none'
      })
    })
  }

  borrowBook () {
    this.scanBook('borrowBook')
  }

  repayBook () {
    this.scanBook('repayBook')
  }

  donateBook () {
    this.scanBook('donateBook')
  }

  removeBook () {
    this.scanBook('removeBook')
  }

  render () {
    return (
      <View className='index'>
        <View className='item'>
          <View className='border' onClick={this.borrowBook}>
            <Image className='icon' src={borrow}></Image>
            <Text className='text'>借书</Text>
          </View>
        </View>
        <View className='item'>
          <View className='border' onClick={this.repayBook}>
            <Image className='icon' src={repay}></Image>
            <Text className='text'>还书</Text>
          </View>
        </View>
        <View className='item'>
          <View className='border' onClick={this.donateBook}>
            <Image className='icon' src={donate}></Image>
            <Text className='text'>捐书</Text>
          </View>
        </View>
        <View className='item'>
          <View className='border' onClick={this.removeBook}>
            <Image className='icon' src={remove}></Image>
            <Text className='text'>撤捐</Text>
          </View>
        </View>
      </View>
    )
  }
}
