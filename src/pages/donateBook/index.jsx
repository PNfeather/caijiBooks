import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { BookInfoView } from '@components'
import './index.scss'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '捐书'
  }

  static defaultProps = {
    isbn: ''
  }

  componentWillMount () {
    this.props.isbn = this.$router.params.isbn
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
        <BookInfoView
          isbn={this.props.isbn}
        />
      </View>
    )
  }
}
