import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { BookInfoView, DonateInfo, BorrowInfo } from '@components'
import './index.scss'
import getBookInfo from '@utils/getBookInfo'
import { connect } from '@tarojs/redux'

@connect(({user}) => {return {userInfo: user.userInfo} })

export default class Index extends Component {

  config = {
    navigationBarTitleText: '还书'
  }

  static defaultProps = {
    isbn: ''
  }

  state = {
    openId: '',
    bookInfo: {},
    repayToggle: true
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
        if (bookInfo.borrowInfo) {
          this.setState({repayToggle: false})
        }
      })
    })
  }

  back () {
    wx.navigateBack()
  }

  repayBook () {
    const { openId, bookInfo } = this.state
    if(openId !== bookInfo.borrowInfo.borrowOpenId) {
      return Taro.showToast({
        title: '借书使用的微信才可以归还本书哦~',
        icon: 'none',
        duration: 5000
      })
    }
    Taro.showModal({
      title: '还书',
      content: '确认归还《' + bookInfo.bookInfo.title + '》',
    }).then(res => {
        if (res.confirm) {
          const bookList = wx.cloud.database().collection('bookList');
          const _ = wx.cloud.database().command
          bookList.doc(bookInfo._id).update({
            data: {
              borrowInfo: _.remove()
            },
            success: () => {
              const currentInfo = {...bookInfo}
              delete currentInfo.borrowInfo
              this.setState({repayToggle: true, bookInfo: currentInfo})
              Taro.showToast({
                title: '您已归还书籍',
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
          <Button disabled={this.state.repayToggle} className='btn' size='mini' type='primary' onClick={this.repayBook}>还书</Button>
        </View>
        <DonateInfo
          donateInfo={bookInfo.donateInfo}
        />
        {
          bookInfo.donateInfo &&
          <BorrowInfo
            borrowInfo={bookInfo.borrowInfo}
          />
        }
        <BookInfoView
          bookInfo={bookInfo.bookInfo}
        />
      </View>
    )
  }
}
