import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { BookInfoView, DonateInfo, CheckboxItem } from '@components'
import './index.scss'
import getBookInfo from '@utils/getBookInfo'
import { connect } from '@tarojs/redux'
import formatTime from '@utils/formatTime'

@connect(({user}) => {return {userInfo: user.userInfo} })

export default class Index extends Component {

  config = {
    navigationBarTitleText: '捐书'
  }

  static defaultProps = {
    isbn: ''
  }

  state = {
    donateList: [
      {text: '个人', type: 1},
      {text: '公司采购', type: 2},
    ],
    name: '',
    bookInfo: {},
    donateToggle: false,
    donateType: 1
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
        if (bookInfo.moveInfo) {
          this.setState({donateToggle: true})
        }
      })
    })
  }

  back () {
    wx.navigateBack()
  }

  donateBook () {
    const { name, bookInfo, donateType } = this.state
    const bookName = '《' + bookInfo.bookInfo.title + '》'
    const donateName = (donateType == 1) ? name : '公司采购'
    const donateText = (donateType == 1) ? (name + '捐赠') : '公司采购'
    const contentText = '是否确定以' + donateText + '的名义添加' + bookName
    Taro.showModal({
      title: '捐书',
      content: contentText,
    }).then(res => {
      if (res.confirm) {
        wx.cloud.callFunction({
          name: 'time'
        }).then(timeRes => {
          const time = formatTime(timeRes.result.time, 'YYYY-MM-DD')
          const bookList = wx.cloud.database().collection('bookList');
          const reset = {
            donateType: donateType,
            donateName: donateName,
            donateTime: time
          }
          bookList.doc(bookInfo._id).update({
            data: {moveInfo: reset},
            success: () => {
              const currentBookInfo = Object.assign({}, bookInfo, {moveInfo: reset})
              this.setState({donateToggle: true, bookInfo: currentBookInfo})
              Taro.showToast({
                title: '捐赠成功~',
                icon: 'success',
                duration: 5000
              })
            }
          });
        });
      }
    })
  }

  render () {
    const { bookInfo, donateToggle, donateType, donateList } = this.state
    return (
      <View className='index'>
        <View className='BtnGroup'>
          <Button className='btn' size='mini' type='primary' onClick={this.back}>返回</Button>
          <Button disabled={donateToggle} className='btn' size='mini' type='primary' onClick={this.donateBook}>捐书</Button>
        </View>
        {
          !donateToggle &&
          <View className='donateName'>
            <Text>捐赠选择:</Text>
            <View className='donateCheck'>
              {
                donateList.map((item, index) => {
                  return <View className='checkItem' key={index}>
                    <CheckboxItem
                      checkText={item.text}
                      checked={donateType === item.type}
                      onClick={() => this.setState({donateType: item.type})}
                    />
                  </View>
                })
              }
            </View>
          </View>
        }
        {
          donateToggle &&
          <DonateInfo
            moveInfo={bookInfo.moveInfo}
          />
        }
        <BookInfoView
          bookInfo={bookInfo.bookInfo}
        />
      </View>
    )
  }
}
