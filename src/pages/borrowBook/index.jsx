import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { BookInfoView, DonateInfo, BorrowInfo } from '@components'
import './index.scss'
import getBookInfo from '@utils/getBookInfo'
import { connect } from '@tarojs/redux'
import formatTime from '@utils/formatTime'

@connect(({user}) => {return {userInfo: user.userInfo} })

export default class Index extends Component {

  config = {
    navigationBarTitleText: '借书'
  }

  static defaultProps = {
    isbn: ''
  }

  state = {
    name: '',
    bookInfo: {},
    borrowToggle: true
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
        if (bookInfo.donateName && !bookInfo.borrowName) {
          this.setState({borrowToggle: false})
        }
      })
    })
  }

  back () {
    wx.navigateBack()
  }

  borrowBook () {
    const { name, bookInfo } = this.state
    Taro.showModal({
      title: '借书',
      content: '确认借阅《' + bookInfo.bookInfo.title + '》',
    }).then(res => {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'time'
          }).then(timeRes => {
            const time = formatTime(timeRes.result.time, 'YYYY-MM-DD')
            const bookList = wx.cloud.database().collection('bookList');
            const reset = {
              borrowName: name,
              borrowTime: time
            }
            bookList.doc(bookInfo._id).update({
              data: reset,
              success: () => {
                const currentInfo = Object.assign({}, bookInfo, reset)
                this.setState({borrowToggle: true, bookInfo: currentInfo})
                Taro.showToast({
                  title: '借阅成功',
                  icon: 'success',
                  duration: 5000
                })
              }
            })
          })
        }
      })
  }

  render () {
    const { bookInfo } = this.state
    return (
      <View className='index'>
        <View className='BtnGroup'>
          <Button className='btn' size='mini' type='primary' onClick={this.back}>返回</Button>
          <Button disabled={this.state.borrowToggle} className='btn' size='mini' type='primary' onClick={this.borrowBook}>借书</Button>
        </View>
        <DonateInfo
          donateName={bookInfo.donateName}
          donateTime={bookInfo.donateTime}
        />
        <BorrowInfo
          borrowName={bookInfo.borrowName}
          borrowTime={bookInfo.borrowTime}
        />
        <BookInfoView
          bookInfo={bookInfo.bookInfo}
        />
      </View>
    )
  }
}
