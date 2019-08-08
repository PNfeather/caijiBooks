import Taro, { Component } from '@tarojs/taro'
import {View, Text} from '@tarojs/components'
import './index.scss'
import formatTime from '@utils/formatTime'

export default class DonateInfo extends Component {

  render () {
    const {donateInfo} = this.props
    return (
      <View>
        {
          !donateInfo &&
          <View className='donateName'>
            <Text className='heightLight'>
              书库暂无本书，欢迎捐赠哦~
            </Text>
          </View>
        }
        {
          donateInfo &&
          <View className='donateName'>
            本书于{formatTime(donateInfo.donateTime, 'YYYY年MM月DD日')},<Text className='heightLight'>{donateInfo.donateName}</Text>{donateInfo.donateType == 2 ? '' : '捐赠'}
          </View>
        }
      </View>
    )
  }
}

