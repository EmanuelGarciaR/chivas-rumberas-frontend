export interface LoginDto {
  email: string
  password: string
}

export interface AuthUser {
  id: string
  email: string
  role: string
}

export interface AuthResponse {
  accessToken: string
  user: AuthUser
}
