import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { BookInfoView, InputItem } from '@components'
import './index.scss'
import getBookInfo from '@utils/getBookInfo'
import { connect } from '@tarojs/redux'

@connect(({user}) => {return {userInfo: user.userInfo} })

export default class Index extends Component {

  config = {
    navigationBarTitleText: '捐书'
  }

  static defaultProps = {
    isbn: ''
  }

  state = {
    name: '',
    bookInfo: {},
    donateToggle: false
  }

  componentWillMount () {
    this.props.isbn = this.$router.params.isbn
    this.setState({name: this.props.userInfo.name})
  }

  componentDidMount () {
    getBookInfo(this.props.isbn, (res) => {
      const bookInfo = res
      this.setState({bookInfo: bookInfo})
    })
  }

  back () {
    wx.navigateBack()
  }

  donateBook () {
    const { name, bookInfo } = this.state
    if (bookInfo.donateName !== '' && bookInfo.donateName !== undefined) {
      return Taro.showToast({
        title: '当前书籍已记录捐赠人为' + bookInfo.donateName,
        icon: 'none',
        duration: 5000
      })
    }
    const bookName = '《' + bookInfo.bookInfo.title + '》'
    const contentText = name ? ('是否确定以' + name + '的名义捐赠' + bookName) : ('是否确定匿名捐赠' + bookName)
    Taro.showModal({
      title: '捐书',
      content: contentText,
    }).then(res => {
      if (res.confirm) {
        const bookList = wx.cloud.database().collection('bookList');
        bookList.doc(bookInfo._id).update({
          data: {
            donateName: name || '匿名'
          },
          success: () => {
            this.setState({donateToggle: true})
            Taro.showToast({
              title: '感谢您的捐赠',
              icon: 'success',
              duration: 5000
            })
          }
        });
      }
    })
  }

  handleInput = (key, value) => {
    this.setState({ [key]: value })
  }

  render () {
    const { name, bookInfo } = this.state
    return (
      <View className='index'>
        <View className='BtnGroup'>
          <Button className='btn' size='mini' type='primary' onClick={this.back}>返回</Button>
          <Button disabled={this.state.donateToggle} className='btn' size='mini' type='primary' onClick={this.donateBook}>捐书</Button>
        </View>
        <View className='donateName'>
          <Text>当前捐书人:</Text>
          <InputItem
            value={name}
            placeholder='请输入姓名'
            onInput={this.handleInput.bind(this, 'name')}
          />
        </View>
        <BookInfoView
          bookInfo={bookInfo.bookInfo}
        />
      </View>
    )
  }
}
