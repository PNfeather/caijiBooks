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
    name: '',
    bookInfo: {},
    repayToggle: true
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
        if (bookInfo.donateName && (this.state.name === bookInfo.borrowName)) {
          this.setState({repayToggle: false})
        }
      })
    })
  }

  back () {
    wx.navigateBack()
  }

  repayBook () {
    const { name, bookInfo } = this.state
    if (name !== bookInfo.borrowName) {
      return Taro.showToast({
        title: '您未借阅本书',
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
          const reset = {
            borrowName: '',
            borrowTime: '',
            borrowDetail: null,
          }
          bookList.doc(bookInfo._id).update({
            data: reset,
            success: () => {
              const currentInfo = Object.assign({}, bookInfo, reset)
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
          donateName={bookInfo.donateName}
          donateTime={bookInfo.donateTime}
        />
        {
          bookInfo.donateName &&
          <BorrowInfo
            borrowName={bookInfo.borrowName}
            borrowTime={bookInfo.borrowTime}
            borrowDetail={bookInfo.borrowDetail}
          />
        }
        <BookInfoView
          bookInfo={bookInfo.bookInfo}
        />
      </View>
    )
  }
}
