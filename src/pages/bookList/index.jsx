import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '采集书库'
  }

  state = {
    bookList: []
  }

  componentWillMount () {
    wx.cloud.callFunction({
      name: 'bookList'
    }).then(res => {
      const bookList = res.result.data
      this.setState({bookList: bookList})
      console.log(res.result.data);
    });
  }

  render () {
    const { bookList } = this.state
    return (
      <View className='index'>
        <View
          className='listItem'
        >
          <View className='cell padding-more'>书名</View>
          <View className='cell'>借阅人</View>
        </View>
        {
          bookList.map((item) => (
            <View
              key={item.id}
              className='listItem'
            >
              <View className='col-7 cell'>《{item.bookInfo.title}》</View>
              <View className={(item.borrowName ? '' : 'free ') + 'col-3 cell'}>{item.borrowName || '闲置'}</View>
            </View>
          ))
        }
      </View>
    )
  }
}
