export const userRouterEndPoints = {
  // Auth endpoints
  userLogin: '/api/user/login',
  userLogout: '/api/user/logout',
  
  // Node CRUD operations
  createNode: '/api/user/nodes',
  getNodeById: (nodeId: string) => `/api/user/nodes/${nodeId}`,
  updateNode: (nodeId: string) => `/api/user/nodes/${nodeId}`,
  deleteNode: (nodeId: string) => `/api/user/nodes/${nodeId}`,
  
  // Tree operations
  getAllRootNodes: '/api/user/nodes/root/all',
  getChildNodes: (parentId: string) => `/api/user/nodes/children/${parentId}`,
  getFullTree: '/api/user/tree/full',
} 
