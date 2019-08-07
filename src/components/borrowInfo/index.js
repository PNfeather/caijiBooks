import Taro, { Component } from '@tarojs/taro'
import {View, Text} from '@tarojs/components'
import './index.scss'
import formatTime from '@utils/formatTime'

export default class BorrowInfo extends Component {

  render () {
    const {borrowName, borrowTime} = this.props
    return (
      <View>
        {
          !borrowName &&
          <View className='borrowName'>
            <Text className='free'>当前书籍空置状态</Text>
          </View>
        }
        {
          borrowName &&
          <View className='borrowName'>
            本书于{formatTime(borrowTime, 'YYYY年MM月')},<Text className='heightLight'>{borrowName}</Text>借阅
          </View>
        }
      </View>
    )
  }
}

