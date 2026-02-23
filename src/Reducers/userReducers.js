import { USER_LOGIN_FAIL } from "../constants/userConstants";
import { USER_LOGIN_REQUEST } from "../constants/userConstants";
import { USER_LOGIN_SUCCESS } from "../constants/userConstants";
import { USER_LOGOUT } from "../constants/userConstants";
import { USER_REGISTER_REQUEST } from "../constants/userConstants";
import{ USER_REGISTER_FAIL} from "../constants/userConstants"
import {USER_REGISTER_SUCCESS} from "../constants/userConstants"

export const userLoginReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_LOGIN_REQUEST:
            return { loading: true }
        case USER_LOGIN_SUCCESS:
            return { loading: false, userInfo: action.payload }
        case USER_LOGIN_FAIL:
            return { loading: false, error: action.payload }
        case USER_LOGOUT: 
            return {}
        default:
            return state
    }   
}

export const userRegisterReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_REGISTER_REQUEST:
            return { loading: true }
        case USER_REGISTER_SUCCESS:
            return { loading: false, userInfo: action.payload }
        case USER_REGISTER_FAIL:
            return { loading: false, error: action.payload }
        case USER_LOGOUT: 
            return {}
        default:
            return state
    }   
}

export const userUpdateProfileReducer = (state = {}, action) => {
  switch (action.type) {
    case 'USER_UPDATE_PROFILE_REQUEST':
      return { loading: true }

    case 'USER_UPDATE_PROFILE_SUCCESS':
      return { loading: false, success: true, user: action.payload }

    case 'USER_UPDATE_PROFILE_FAIL':
      return { loading: false, error: action.payload }

    case 'USER_UPDATE_PROFILE_RESET':
      return {}

    default:
      return state
  }
};

export const userListReducer = (state = { users: [] }, action) => {
  switch (action.type) {
    case 'USER_LIST_REQUEST':
      return { loading: true, users: [] }

    case 'USER_LIST_SUCCESS':
      return { loading: false, users: action.payload }

    case 'USER_LIST_FAIL':
      return { loading: false, error: action.payload }

    default:
      return state
  }
}

