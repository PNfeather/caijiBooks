import Taro, { Component } from '@tarojs/taro'
import {View, Button, Text} from '@tarojs/components'
import { BookInfoView, DonateInfo, BorrowInfo } from '@components'
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
    removeToggle: true
  }

  componentWillMount () {
    this.props.isbn = this.$router.params.isbn
    this.setState({name: this.props.userInfo.name})
  }

  componentDidMount () {
    getBookInfo(this.props.isbn, (res) => {
      const bookInfo = res
      this.setState({bookInfo: bookInfo})
      setTimeout(() => {
        if (bookInfo.donateName) {
          this.setState({removeToggle: false})
        }
      })
    })
  }

  back () {
    wx.navigateBack()
  }

  removeBook () {
    const { name, bookInfo } = this.state
    if (bookInfo.donateName === '匿名') {
      return Taro.showToast({
        title: '当前书籍是匿名捐赠，无法撤捐哦~',
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
    if (bookInfo.borrowName && (bookInfo.borrowName !== name)) {
      return Taro.showToast({
        title: '书籍' + bookInfo.borrowName + '借阅中，请先联系借阅人换书才可撤捐哦' ,
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
        const reset = {
          donateName: '',
          donateTime: '',
          borrowName: '',
          borrowTime: ''
        }
        bookList.doc(bookInfo._id).update({
          data: reset,
          success: () => {
            const currentInfo = Object.assign({}, bookInfo, reset)
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
    const { bookInfo, removeToggle } = this.state
    return (
      <View className='index'>
        <View className='BtnGroup'>
          <Button className='btn' size='mini' type='primary' onClick={this.back}>返回</Button>
          <Button disabled={removeToggle} className='btn' size='mini' type='primary' onClick={this.removeBook}>撤捐</Button>
        </View>
        <DonateInfo
          donateName={bookInfo.donateName}
          donateTime={bookInfo.donateTime}
        ></DonateInfo>
        {
          !removeToggle &&
          <BorrowInfo
            borrowName={bookInfo.borrowName}
            borrowTime={bookInfo.borrowTime}
          ></BorrowInfo>
        }
        <BookInfoView
          bookInfo={bookInfo.bookInfo}
        />
      </View>
    )
  }
}
