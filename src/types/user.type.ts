export interface User {
  _id: string;
  avatar: string;
  name: string;
  email: string;
  password: string;
  role: string;
  isActive: boolean;
}

export interface UserRequest {
  avatar: string;
  name: string;
  email: string;
  password?: string;
  role: string;
}

export interface MeRequest {
  name: string;
  avatar: string;
}

export interface ChangePassword {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
