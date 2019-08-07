import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'
import { connect } from '@tarojs/redux'

@connect(({user}) => {return {userInfo: user.userInfo} })

export default class Index extends Component {

  config = {
    navigationBarTitleText: '采集书库'
  }

  state = {
    name: '',
    bookList: []
  }

  componentWillMount () {
    this.setState({name: this.props.userInfo.name})
    wx.cloud.callFunction({
      name: 'bookList'
    }).then(res => {
      const bookList = res.result.data
      this.setState({bookList: bookList})
      console.log(res.result.data);
    });
  }

  goDetail (item) {
    let detailType = 'borrowBook'
    const isbn = item.isbn
    const {name} = this.state
    if (item.borrowName === name) {
      detailType = 'repayBook'
    }
    wx.navigateTo({
      url: `/pages/${detailType}/index?isbn=${isbn}`
    })
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
              onClick={this.goDetail.bind(this, item)}
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
