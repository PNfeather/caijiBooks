import Taro, { Component } from '@tarojs/taro'
import {View, Text} from '@tarojs/components'
import './index.scss'
import formatTime from '@utils/formatTime'

export default class DonateInfo extends Component {

  render () {
    const {donateName, donateTime} = this.props
    return (
      <View>
        {
          !donateName &&
          <View className='donateName'>
            <Text className='heightLight'>
              当前书籍还未捐赠入库
            </Text>
          </View>
        }
        {
          donateName &&
          <View className='donateName'>
            本书于{formatTime(donateTime, 'YYYY年MM月DD日')},<Text className='heightLight'>{donateName}</Text>捐赠
          </View>
        }
      </View>
    )
  }
}

