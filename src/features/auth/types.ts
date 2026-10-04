export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  dob: string | null;
  avatarUrl: string | null;
  role: "USER" | "ADMIN";
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface RegisterRequest {
  fullname: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
}

export type RefreshResponse = LoginResponse;
