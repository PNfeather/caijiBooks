import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { BookInfoView } from '@components'
import './index.scss'
import { connect } from '@tarojs/redux'

@connect(({user}) => {return {userInfo: user.userInfo} })

export default class Index extends Component {

  config = {
    navigationBarTitleText: '捐书'
  }

  static defaultProps = {
    isbn: ''
  }

  componentWillMount () {
    this.props.isbn = this.$router.params.isbn
    console.log(this.props)
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  back () {
    wx.navigateBack()
  }

  donateBook () {

  }

  render () {
    return (
      <View className='index'>
        <View className='BtnGroup'>
          <Button className='btn' size='mini' type='primary' onClick={this.back}>返回</Button>
          <Button className='btn' size='mini' type='primary' onClick={this.donateBook}>捐书</Button>
        </View>
        <BookInfoView
          isbn={this.props.isbn}
        />
      </View>
    )
  }
}
