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
    const {borrowInfo} = this.props
    const {detailToggle} = this.state
    let userInfo
    borrowInfo && ( userInfo = borrowInfo.borrowDetail.user )
    console.log(borrowInfo);
    return (
      <View>
        {
          !borrowInfo &&
          <View className='borrowName'>
            <Text className='free'>当前书籍空置状态</Text>
          </View>
        }
        {
          borrowInfo &&
          <View>
            <View className='borrowName flexBlock' onClick={this.changeToggle.bind(this)}>
              <View>
                当前借阅人: <Text className='heightLight'>{borrowInfo.borrowName}</Text>
              </View>
              <View className={'pullIcon ' + (detailToggle ? 'pullDownState' : 'pullUpState')} />
            </View>
            {
              detailToggle &&
              <View className='detailInfo'>
                <View className='border'>
                  <View className='item'>借阅人信息: </View>
                  <View className='item'>
                    <View className='cell'>
                      头像: <Image className='header' src={userInfo.avatarUrl} />
                    </View>
                    <View className='cell'>
                      昵称: {userInfo.nickName}
                    </View>
                  </View>
                  <View className='item'>借阅日期: {formatTime(borrowInfo.borrowTime, 'YYYY年MM月DD日')}</View>
                </View>
              </View>
            }
          </View>
        }
      </View>
    )
  }
}

