import Taro, { Component } from '@tarojs/taro'
import { ScrollView, View, Image, Text } from '@tarojs/components'
import getBookInfo from '@utils/getBookInfo'
import './index.scss'

export default class BookInfoView extends Component {

  state = {
    bookInfo: {}
  }

  componentDidMount () {
    console.log(this.props);
    // getBookInfo(this.props.isbn, (res) => { // todo 待修改或完善
    getBookInfo('9787111548973', (res) => {
      const bookInfo = res.bookInfo
      this.setState({bookInfo: bookInfo})
    })
  }

  render () {
    const {bookInfo} = this.state
    console.log(bookInfo);
    return (
      <ScrollView className='bookDetail' scrollY='true'>
        <View className='image'>
          <Image
            src={bookInfo.pic}
            style='width: 100%;'
            mode='widthFix'
          />
        </View>
        <View className='bookTextInfo'>
          <Text>书名: 《{bookInfo.title}》</Text>
          <Text>作者: {bookInfo.author}</Text>
          <Text>科类: {bookInfo.subtitle}</Text>
          <Text>出版社: {bookInfo.publisher}</Text>
          <Text>出版地址: {bookInfo.pubplace}</Text>
          <Text>出版时间: {bookInfo.pubdate}</Text>
          <Text>定价: ￥{bookInfo.price}</Text>
          <Text>装订/版本/页数: {bookInfo.binding}/{bookInfo.edition}/{bookInfo.page}</Text>
        </View>
        书籍详情
      </ScrollView>
    )
  }
}

