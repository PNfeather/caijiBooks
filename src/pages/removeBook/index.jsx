import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { BookInfoView } from '@components'
import './index.scss'
import getBookInfo from '@utils/getBookInfo'
import { connect } from '@tarojs/redux'

@connect(({user}) => {return {userInfo: user.userInfo} })

export default class Index extends Component {

  config = {
    navigationBarTitleText: '撤捐'
  }

  static defaultProps = {
    isbn: ''
  }

  state = {
    name: '',
    bookInfo: {},
    removeToggle: false
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

  removeBook () {
    const { name, bookInfo } = this.state
    if (bookInfo.donateName === '' || bookInfo.donateName === undefined) {
      return Taro.showToast({
        title: '当前书籍还未捐赠入库，欢迎您捐赠哦~',
        icon: 'none',
        duration: 5000
      })
    }
    if (name !== bookInfo.donateName) {
      return Taro.showToast({
        title: '当前书籍不是已您的名义捐赠的哦~',
        icon: 'none',
        duration: 5000
      })
    }
    if (bookInfo.donateName === '匿名') {
      return Taro.showToast({
        title: '当前书籍是匿名捐赠，无法撤捐哦~',
        icon: 'none',
        duration: 5000
      })
    }

    Taro.showModal({
      title: '撤捐',
      content: '确认撤销《' + bookInfo.bookInfo.title + '》的捐赠',
    }).then(res => {
      if (res.confirm) {
        const bookList = wx.cloud.database().collection('bookList');
        bookList.doc(bookInfo._id).update({
          data: {
            donateName: '',
            borrowName: ''
          },
          success: () => {
            const currentInfo = Object.assign({}, bookInfo, {donateName: '', borrowName: ''})
            this.setState({removeToggle: true, bookInfo: currentInfo})
            Taro.showToast({
              title: '您已撤销了本书的捐赠',
              icon: 'success',
              duration: 5000
            })
          }
        });
      }
    })
  }

  render () {
    const { bookInfo } = this.state
    return (
      <View className='index'>
        <View className='BtnGroup'>
          <Button className='btn' size='mini' type='primary' onClick={this.back}>返回</Button>
          <Button disabled={this.state.removeToggle} className='btn' size='mini' type='primary' onClick={this.removeBook}>撤捐</Button>
        </View>
        {
          bookInfo.borrowName &&
          <View className='donateName'>
            当前借阅人: {bookInfo.borrowName}
          </View>
        }
        <View className='donateName'>
          当前捐书人: {bookInfo.donateName}
        </View>
        <BookInfoView
          bookInfo={bookInfo.bookInfo}
        />
      </View>
    )
  }
}
