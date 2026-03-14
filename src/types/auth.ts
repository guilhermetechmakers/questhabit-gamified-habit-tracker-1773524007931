import type { User } from "./user";

export interface AuthResponse {
  token: string;
  user: User;
  refresh_token?: string;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface SignUpInput {
  email: string;
  password: string;
  display_name?: string;
}
