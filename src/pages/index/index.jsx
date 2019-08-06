import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image} from '@tarojs/components'
import borrow from './assets/borrow.png'
import donate from './assets/donate.png'
import repay from './assets/repay.png'
import remove from './assets/remove.png'
import './index.scss'
import { connect } from '@tarojs/redux'

@connect(({user}) => {return {userInfo: user.userInfo} })

export default class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  componentWillMount () {
    console.log(this.props);
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
        <View className='item'>
          <View className='border'>
            <Image className='icon' src={borrow}></Image>
            <Text className='text'>借书</Text>
          </View>
        </View>
        <View className='item'>
          <View className='border'>
            <Image className='icon' src={repay}></Image>
            <Text className='text'>还书</Text>
          </View>
        </View>
        <View className='item'>
          <View className='border'>
            <Image className='icon' src={donate}></Image>
            <Text className='text'>捐书</Text>
          </View>
        </View>
        <View className='item'>
          <View className='border'>
            <Image className='icon' src={remove}></Image>
            <Text className='text'>撤捐</Text>
          </View>
        </View>
      </View>
    )
  }
}
