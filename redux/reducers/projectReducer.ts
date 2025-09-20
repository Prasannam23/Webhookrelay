import {
  PROJECT_CREATE_REQUEST,
  PROJECT_CREATE_SUCCESS,
  PROJECT_CREATE_FAILURE,
  PROJECT_FETCH_REQUEST,
  PROJECT_FETCH_SUCCESS,
  PROJECT_FETCH_FAILURE,
  PROJECT_UPDATE_REQUEST,
  PROJECT_UPDATE_SUCCESS,
  PROJECT_UPDATE_FAILURE,
  PROJECT_DELETE_REQUEST,
  PROJECT_DELETE_SUCCESS,
  PROJECT_DELETE_FAILURE,
  type ProjectData,
} from "../actions/projectActions"

interface ProjectState {
  projects: ProjectData[]
  currentProject: ProjectData | null
  isLoading: boolean
  error: string | null
}

const initialState: ProjectState = {
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,
}

const projectReducer = (state = initialState, action: any): ProjectState => {
  switch (action.type) {
    case PROJECT_CREATE_REQUEST:
    case PROJECT_FETCH_REQUEST:
    case PROJECT_UPDATE_REQUEST:
    case PROJECT_DELETE_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      }

    case PROJECT_CREATE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        projects: [action.payload, ...state.projects],
        error: null,
      }

    case PROJECT_FETCH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        projects: action.payload,
        error: null,
      }

    case PROJECT_UPDATE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        projects: state.projects.map((project) => (project.id === action.payload.id ? action.payload : project)),
        currentProject: state.currentProject?.id === action.payload.id ? action.payload : state.currentProject,
        error: null,
      }

    case PROJECT_DELETE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        projects: state.projects.filter((project) => project.id !== action.payload),
        currentProject: state.currentProject?.id === action.payload ? null : state.currentProject,
        error: null,
      }

    case PROJECT_CREATE_FAILURE:
    case PROJECT_FETCH_FAILURE:
    case PROJECT_UPDATE_FAILURE:
    case PROJECT_DELETE_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      }

    default:
      return state
  }
}

export default projectReducer
