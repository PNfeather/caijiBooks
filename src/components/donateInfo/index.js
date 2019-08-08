import Taro, { Component } from '@tarojs/taro'
import {View, Text} from '@tarojs/components'
import './index.scss'
import formatTime from '@utils/formatTime'

export default class DonateInfo extends Component {

  render () {
    const {moveInfo} = this.props
    return (
      <View>
        {
          moveInfo && !moveInfo.donateName &&
          <View className='donateName'>
            <Text className='heightLight'>
              书库暂无次数，欢迎捐赠哦~
            </Text>
          </View>
        }
        {
          moveInfo && moveInfo.donateName &&
          <View className='donateName'>
            本书于{formatTime(moveInfo.donateTime, 'YYYY年MM月DD日')},<Text className='heightLight'>{moveInfo.donateName}</Text>{moveInfo.donateType == 2 ? '' : '捐赠'}
          </View>
        }
      </View>
    )
  }
}

