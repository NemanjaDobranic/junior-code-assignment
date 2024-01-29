export interface SingInRequestDto {
  email: string;
  password: string;
}

export interface SingInResponseDto {
  accessToken: string;
}
