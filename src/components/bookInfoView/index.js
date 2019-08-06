import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import './index.scss'

export default class BookInfoView extends Component {

  render () {
    const {bookInfo} = this.props
    return (
      <View className='bookDetail' scrollY='true'>
        <View className='image'>
          <Image
            src={bookInfo.pic}
            style='width: 100%;'
            mode='widthFix'
          />
        </View>
        <View className='bookTextInfo'>
          <View>书名: 《{bookInfo.title}》</View>
          <View>作者: {bookInfo.author}</View>
          <View>科类: {bookInfo.subtitle}</View>
          <View>出版社: {bookInfo.publisher}</View>
          <View>出版地址: {bookInfo.pubplace}</View>
          <View>出版时间: {bookInfo.pubdate}</View>
          <View>定价: ￥{bookInfo.price}</View>
          <View>装订/版本/页数: {bookInfo.binding}/{bookInfo.edition}/{bookInfo.page}</View>
          <View className='margin_top'>简介: {bookInfo.summary}</View>
        </View>
      </View>
    )
  }
}
