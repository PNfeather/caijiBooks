import Taro, { Component } from '@tarojs/taro'
import {View, Text, Image} from '@tarojs/components'
import './index.scss'
import formatTime from '@utils/formatTime'

export default class BorrowInfo extends Component {

  state = {
    detailToggle: false
  }

  changeToggle () {
    this.setState({detailToggle: !this.state.detailToggle})
  }

  render () {
    const {borrowName, borrowTime, borrowDetail} = this.props
    const {detailToggle} = this.state
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
          <View>
            <View className='borrowName flexBlock' onClick={this.changeToggle.bind(this)}>
              <View>
                当前借阅人: <Text className='heightLight'>{borrowName}</Text>
              </View>
              <View className={'pullIcon ' + (detailToggle ? 'pullDownState' : 'pullUpState')} />
            </View>
            {
              detailToggle &&
              <View>
                <View>借阅人头像: <Image src={borrowDetail.avatarUrl}></Image></View>
                <View>借阅日期: {borrowTime}</View>
                <View>借阅人昵称: {borrowDetail.nickName}</View>
              </View>
            }
          </View>
        }
      </View>
    )
  }
}
