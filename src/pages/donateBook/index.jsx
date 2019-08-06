import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { BookInfoView, InputItem } from '@components'
import './index.scss'
import getBookInfo from '@utils/getBookInfo'
import { connect } from '@tarojs/redux'

@connect(({user}) => {return {userInfo: user.userInfo} })

export default class Index extends Component {

  config = {
    navigationBarTitleText: '捐书'
  }

  static defaultProps = {
    isbn: ''
  }

  state = {
    name: '',
    bookInfo: {}
  }

  componentWillMount () {
    this.props.isbn = this.$router.params.isbn
    this.setState({name: this.props.userInfo.name})
  }

  componentDidMount () {
    // getBookInfo(this.props.isbn, (res) => { // todo 待修改或完善
    getBookInfo('9787111548973', (res) => {
      const bookInfo = res
      this.setState({bookInfo: bookInfo})
    })
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  back () {
    wx.navigateBack()
  }

  donateBook () {
    Taro.showModal({
      title: '捐书',
      content: '是否确定以' + this.state.name + '的名义捐送本书',
    })
      .then(res => {
        if (res.confirm) {
          console.log(this.state);
        }
      })
  }

  handleInput = (key, value) => {
    this.setState({ [key]: value })
  }

  render () {
    const { name, bookInfo } = this.state
    return (
      <View className='index'>
        <View className='BtnGroup'>
          <Button className='btn' size='mini' type='primary' onClick={this.back}>返回</Button>
          <Button className='btn' size='mini' type='primary' onClick={this.donateBook}>捐书</Button>
        </View>
        <View className='donateName'>
          <Text>当前捐书人:</Text>
          <InputItem
            value={name}
            placeholder='请输入姓名'
            onInput={this.handleInput.bind(this, 'name')}
          />
        </View>
        <BookInfoView
          bookInfo={bookInfo.bookInfo}
        />
      </View>
    )
  }
}
