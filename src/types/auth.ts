export interface LoginDto {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
}
