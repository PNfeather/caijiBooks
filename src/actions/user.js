import { USER_INFO} from '@constants/user'

/**
 * 获取用户信息
 */
export default function dispatchUserInfo (data) {
  return {
    type: USER_INFO,
    userInfo: data
  }
}
