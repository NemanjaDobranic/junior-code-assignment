export interface TodoResponseDto {
  id: number;
  name: string;
  completed: boolean;
}

export type TodoRequestDto = Omit<TodoResponseDto, 'id'>;
