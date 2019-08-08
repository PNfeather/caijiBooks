import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { BookInfoView, InputItem, DonateInfo, CheckboxItem } from '@components'
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
        if (bookInfo.donateName) {
          this.setState({donateToggle: true})
        }
      })
    })
  }

  back () {
    wx.navigateBack()
  }

  donateBook () {
    const { name, bookInfo } = this.state
    const bookName = '《' + bookInfo.bookInfo.title + '》'
    const contentText = name ? ('是否确定以' + name + '的名义捐赠' + bookName) : ('是否确定匿名捐赠' + bookName)
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
            donateName: name || '匿名',
            donateTime: time
          }
          bookList.doc(bookInfo._id).update({
            data: reset,
            success: () => {
              const currentBookInfo = Object.assign({}, bookInfo, reset)
              this.setState({donateToggle: true, bookInfo: currentBookInfo})
              Taro.showToast({
                title: '感谢您的捐赠',
                icon: 'success',
                duration: 5000
              })
            }
          });
        });
      }
    })
  }

  handleInput = (key, value) => {
    this.setState({ [key]: value })
  }

  render () {
    const { name, bookInfo, donateToggle, donateType, donateList } = this.state
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
            {/*<InputItem
              value={name}
              placeholder='请输入姓名'
              onInput={this.handleInput.bind(this, 'name')}
            />*/}
          </View>
        }
        {
          donateToggle &&
          <DonateInfo
            donateName={bookInfo.donateName}
            donateTime={bookInfo.donateTime}
          ></DonateInfo>
        }
        <BookInfoView
          bookInfo={bookInfo.bookInfo}
        />
      </View>
    )
  }
}
