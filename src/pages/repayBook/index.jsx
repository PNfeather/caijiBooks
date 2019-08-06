import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { BookInfoView } from '@components'
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
    repayToggle: false
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

  repayBook () {
    const { name, bookInfo } = this.state
    if (bookInfo.donateName === '' || bookInfo.donateName === undefined) {
      return Taro.showToast({
        title: '当前书籍还未捐赠入库，欢迎您捐赠哦~',
        icon: 'none',
        duration: 5000
      })
    }
    if (name !== bookInfo.borrowName) {
      return Taro.showToast({
        title: '您未借阅本书',
        icon: 'none',
        duration: 5000
      })
    } else {
      Taro.showModal({
        title: '还书',
        content: '确认归还《' + bookInfo.bookInfo.title + '》',
      }).then(res => {
          if (res.confirm) {
            const bookList = wx.cloud.database().collection('bookList');
            bookList.doc(bookInfo._id).update({
              data: {
                borrowName: ''
              },
              success: () => {
                const currentInfo = Object.assign({}, bookInfo, {borrowName: ''})
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
  }

  render () {
    const { bookInfo } = this.state
    return (
      <View className='index'>
        <View className='BtnGroup'>
          <Button className='btn' size='mini' type='primary' onClick={this.back}>返回</Button>
          <Button disabled={this.state.repayToggle} className='btn' size='mini' type='primary' onClick={this.repayBook}>还书</Button>
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
