import { createStore, combineReducers, applyMiddleware } from "redux"
import { composeWithDevTools } from "@redux-devtools/extension"
import authReducer from "./reducers/authReducer"
import imageReducer from "./reducers/imageReducer"
import feedbackReducer from "./reducers/feedbackReducer"
import projectReducer from "./reducers/projectReducer"
import aiVisionReducer from "./reducers/aiVisionReducer"

const rootReducer = combineReducers({
  auth: authReducer,
  images: imageReducer,
  feedback: feedbackReducer,
  projects: projectReducer,
  aiVision: aiVisionReducer,
})

export type RootState = ReturnType<typeof rootReducer>

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware()))

export default store
