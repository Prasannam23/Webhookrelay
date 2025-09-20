export const AUTH_LOGIN_REQUEST = "AUTH_LOGIN_REQUEST"
export const AUTH_LOGIN_SUCCESS = "AUTH_LOGIN_SUCCESS"
export const AUTH_LOGIN_FAILURE = "AUTH_LOGIN_FAILURE"
export const AUTH_REGISTER_REQUEST = "AUTH_REGISTER_REQUEST"
export const AUTH_REGISTER_SUCCESS = "AUTH_REGISTER_SUCCESS"
export const AUTH_REGISTER_FAILURE = "AUTH_REGISTER_FAILURE"
export const AUTH_LOGOUT = "AUTH_LOGOUT"
export const AUTH_LOAD_USER_REQUEST = "AUTH_LOAD_USER_REQUEST"
export const AUTH_LOAD_USER_SUCCESS = "AUTH_LOAD_USER_SUCCESS"
export const AUTH_LOAD_USER_FAILURE = "AUTH_LOAD_USER_FAILURE"

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
}

export const loginRequest = () => ({ type: AUTH_LOGIN_REQUEST })
export const loginSuccess = (user: User, token: string) => ({
  type: AUTH_LOGIN_SUCCESS,
  payload: { user, token },
})
export const loginFailure = (error: string) => ({
  type: AUTH_LOGIN_FAILURE,
  payload: error,
})

export const registerRequest = () => ({ type: AUTH_REGISTER_REQUEST })
export const registerSuccess = (user: User, token: string) => ({
  type: AUTH_REGISTER_SUCCESS,
  payload: { user, token },
})
export const registerFailure = (error: string) => ({
  type: AUTH_REGISTER_FAILURE,
  payload: error,
})

export const logout = () => ({ type: AUTH_LOGOUT })

export const loadUserRequest = () => ({ type: AUTH_LOAD_USER_REQUEST })
export const loadUserSuccess = (user: User) => ({
  type: AUTH_LOAD_USER_SUCCESS,
  payload: user,
})
export const loadUserFailure = (error: string) => ({
  type: AUTH_LOAD_USER_FAILURE,
  payload: error,
})
