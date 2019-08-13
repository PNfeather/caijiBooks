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
    bookInfo: {},
    openId: '',
    removeToggle: true
  }

  componentWillMount () {
    this.props.isbn = this.$router.params.isbn
    this.setState({openId: this.props.userInfo._openid})
  }

  componentDidMount () {
    getBookInfo(this.props.isbn, (res) => {
      const bookInfo = res
      this.setState({bookInfo: bookInfo})
      setTimeout(() => {
        if (bookInfo.donateInfo) {
          this.setState({removeToggle: false})
        }
      })
    })
  }

  back () {
    wx.navigateBack()
  }

  removeBook () {
    const { openId, bookInfo } = this.state
    const { donateInfo, borrowInfo } = bookInfo
    if (donateInfo.donateType === 2) {
      return Taro.showToast({
        title: '当前书籍是公司采购无法撤捐哦~',
        icon: 'none',
        duration: 5000
      })
    }
    if (openId !== donateInfo.donateOpenId) {
      return Taro.showToast({
        title: '当前书籍不是已您的名义捐赠的哦~',
        icon: 'none',
        duration: 5000
      })
    }
    if (borrowInfo && (borrowInfo.borrowOpenId !== openId)) {
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
        wx.cloud.callFunction({
          name: 'updateBook',
          data: {
            id: bookInfo._id,
            type: 'remove'
          },
          success: (result) => {
            console.log(result);
            this.setState({removeToggle: true})
            Taro.showToast({
              title: '您已撤销了本书的捐赠',
              icon: 'success',
              duration: 5000
            })
          }
        })
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
        {
          !removeToggle &&
          <View>
            <DonateInfo
              donateInfo={bookInfo.donateInfo}
            />
            <BorrowInfo
              borrowInfo={bookInfo.borrowInfo}
            />
          </View>
        }
        <BookInfoView
          bookInfo={bookInfo.bookInfo}
        />
      </View>
    )
  }
}
