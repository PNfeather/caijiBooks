import { USER_INFO } from '@constants/user'

const INITIAL_STATE = {
  userInfo: {}
}

export default function user(state = INITIAL_STATE, action) {
  switch(action.type) {
    case USER_INFO: {
      return {
        ...state,
        userInfo: {
          ...action.userInfo
        }
      }
    }
    default:
      return state
  }
}
