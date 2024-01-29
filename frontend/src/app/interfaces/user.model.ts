export interface CreateUserRequestDto {
  name: string;
  email: string;
  password: string;
}
export interface CreateUserResponseDto {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface UserResponseDto extends CreateUserResponseDto {}
