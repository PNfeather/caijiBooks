import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
// import getBookInfo from '@utils/getBookInfo'
import './index.scss'

export default class BookInfoView extends Component {

  componentWillReceiveProps (nextProps) {
    console.log(nextProps)
    // getBookInfo(this.$router.params.isbn, (res) => {
    //   console.log(res);
    // })
  }

  render () {
    console.log(this.props);
    return (
      <View className='bookDetail'>
        书籍详情
      </View>
    )
  }
}

