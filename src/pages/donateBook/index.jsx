import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'
import getBookInfo from '@utils/getBookInfo'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '捐书'
  }

  componentWillMount () {
    getBookInfo(this.$router.params.isbn, (res) => {
      console.log(res);
    })
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
        <Text>Hello world!</Text>
      </View>
    )
  }
}
