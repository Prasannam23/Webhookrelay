import {
  AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGIN_FAILURE,
  AUTH_REGISTER_REQUEST,
  AUTH_REGISTER_SUCCESS,
  AUTH_REGISTER_FAILURE,
  AUTH_LOGOUT,
  AUTH_LOAD_USER_REQUEST,
  AUTH_LOAD_USER_SUCCESS,
  AUTH_LOAD_USER_FAILURE,
  type User,
} from "../actions/authActions"

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
}

const authReducer = (state = initialState, action: any): AuthState => {
  switch (action.type) {
    case AUTH_LOGIN_REQUEST:
    case AUTH_REGISTER_REQUEST:
    case AUTH_LOAD_USER_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      }

    case AUTH_LOGIN_SUCCESS:
    case AUTH_REGISTER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        error: null,
      }

    case AUTH_LOAD_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        user: action.payload,
        isAuthenticated: true,
        error: null,
      }

    case AUTH_LOGIN_FAILURE:
    case AUTH_REGISTER_FAILURE:
    case AUTH_LOAD_USER_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        user: null,
        token: null,
        isAuthenticated: false,
      }

    case AUTH_LOGOUT:
      return {
        ...initialState,
      }

    default:
      return state
  }
}

export default authReducer
