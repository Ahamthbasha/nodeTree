export interface INode {
  _id: string;
  name: string;
  parentId: string | null;
  userId: string;
  children: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ITreeNode {
  id: string;
  name: string;
  parentId: string | null;
  children: ITreeNode[];
  isExpanded?:boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNodeDto {
  name: string;
  parentId?: string | null;
}

export interface UpdateNodeDto {
  name: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface ApiError {
  success: false;
  message: string;
  failToken?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export interface User {
  id: string;
  email: string;
  role: string;
}