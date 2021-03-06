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
    openId: '',
    bookInfo: {},
    donateToggle: false,
    donateType: 1
  }

  componentWillMount () {
    this.props.isbn = this.$router.params.isbn
    this.setState({name: this.props.userInfo.user.name})
    this.setState({openId: this.props.userInfo._openid})
  }

  componentDidMount () {
    getBookInfo(this.props.isbn, (res) => {
      const bookInfo = res
      this.setState({bookInfo: bookInfo})
      setTimeout(() => {
        if (bookInfo.donateInfo) {
          this.setState({donateToggle: true})
        }
      })
    })
  }

  back () {
    wx.navigateBack()
  }

  donateBook () {
    const { name, bookInfo, donateType, openId } = this.state
    const bookName = '《' + bookInfo.bookInfo.title + '》'
    const donateName = (donateType == 1) ? name : '公司采购'
    const contentText = '是否确定以' + donateName + '的名义添加' + bookName
    Taro.showModal({
      title: '捐书',
      content: contentText,
    }).then(res => {
      if (res.confirm) {
        wx.cloud.callFunction({
          name: 'time'
        }).then(timeRes => {
          const time = formatTime(timeRes.result.time, 'YYYY-MM-DD')
          const reset = {
            donateOpenId: openId,
            donateType: donateType,
            donateName: donateName,
            donateTime: time
          }
          wx.cloud.callFunction({
            name: 'updateBook',
            data: {
              id: bookInfo._id,
              updateInfo: {donateInfo: {...reset}},
            },
            success: () => {
              const currentBookInfo = Object.assign({}, bookInfo, {donateInfo: reset})
              this.setState({donateToggle: true, bookInfo: currentBookInfo})
              Taro.showToast({
                title: '捐赠成功~',
                icon: 'success',
                duration: 5000
              })
            }
          })
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
            donateInfo={bookInfo.donateInfo}
          />
        }
        <BookInfoView
          bookInfo={bookInfo.bookInfo}
        />
      </View>
    )
  }
}
