export const PROJECT_CREATE_REQUEST = "PROJECT_CREATE_REQUEST"
export const PROJECT_CREATE_SUCCESS = "PROJECT_CREATE_SUCCESS"
export const PROJECT_CREATE_FAILURE = "PROJECT_CREATE_FAILURE"
export const PROJECT_FETCH_REQUEST = "PROJECT_FETCH_REQUEST"
export const PROJECT_FETCH_SUCCESS = "PROJECT_FETCH_SUCCESS"
export const PROJECT_FETCH_FAILURE = "PROJECT_FETCH_FAILURE"
export const PROJECT_UPDATE_REQUEST = "PROJECT_UPDATE_REQUEST"
export const PROJECT_UPDATE_SUCCESS = "PROJECT_UPDATE_SUCCESS"
export const PROJECT_UPDATE_FAILURE = "PROJECT_UPDATE_FAILURE"
export const PROJECT_DELETE_REQUEST = "PROJECT_DELETE_REQUEST"
export const PROJECT_DELETE_SUCCESS = "PROJECT_DELETE_SUCCESS"
export const PROJECT_DELETE_FAILURE = "PROJECT_DELETE_FAILURE"

export interface ProjectData {
  id: string
  name: string
  description?: string
  ownerId: string
  members: string[]
  createdAt: string
  updatedAt: string
  imageCount: number
  status: "active" | "archived" | "completed"
}

export const createProjectRequest = () => ({ type: PROJECT_CREATE_REQUEST })
export const createProjectSuccess = (project: ProjectData) => ({
  type: PROJECT_CREATE_SUCCESS,
  payload: project,
})
export const createProjectFailure = (error: string) => ({
  type: PROJECT_CREATE_FAILURE,
  payload: error,
})

export const fetchProjectsRequest = () => ({ type: PROJECT_FETCH_REQUEST })
export const fetchProjectsSuccess = (projects: ProjectData[]) => ({
  type: PROJECT_FETCH_SUCCESS,
  payload: projects,
})
export const fetchProjectsFailure = (error: string) => ({
  type: PROJECT_FETCH_FAILURE,
  payload: error,
})

export const updateProjectRequest = () => ({ type: PROJECT_UPDATE_REQUEST })
export const updateProjectSuccess = (project: ProjectData) => ({
  type: PROJECT_UPDATE_SUCCESS,
  payload: project,
})
export const updateProjectFailure = (error: string) => ({
  type: PROJECT_UPDATE_FAILURE,
  payload: error,
})

export const deleteProjectRequest = () => ({ type: PROJECT_DELETE_REQUEST })
export const deleteProjectSuccess = (projectId: string) => ({
  type: PROJECT_DELETE_SUCCESS,
  payload: projectId,
})
export const deleteProjectFailure = (error: string) => ({
  type: PROJECT_DELETE_FAILURE,
  payload: error,
})
