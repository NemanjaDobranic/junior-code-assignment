import { StatusCodes } from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";
import { TodoResponseDto } from "../dto/todo.dto";
import { ErrorResponseDto } from "../dto/error.dto";
import { ApiHandlerFunction, withApiHandler } from "../helpers/api-handler";
import { PrismaClient } from "@prisma/client";
import { JwtPayloadDto } from "../dto/auth.dto";

const getTodoList: ApiHandlerFunction<TodoResponseDto[]> = async (
  req,
  res,
  prisma: PrismaClient
) => {
  const { name } = req.query;
  const user: JwtPayloadDto = JSON.parse(req.headers["x-user"] as string);

  const todoList = await prisma.todo.findMany({
    select: {
      id: true,
      name: true,
      completed: true,
    },
    where: {
      name: {
        contains: name ? (name as string) : "",
      },
      userId: user.id,
      deleted: false,
    },
    orderBy: { id: "desc" },
  });

  res.status(StatusCodes.OK).json(todoList);
};

async function createTodo(
  req: NextApiRequest,
  res: NextApiResponse<TodoResponseDto | ErrorResponseDto>,
  prisma: PrismaClient
) {
  const { name, completed } = req.body;

  const user: JwtPayloadDto = JSON.parse(req.headers["x-user"] as string);

  const newTodo = await prisma.todo.create({
    data: { userId: user.id, name, completed, deleted: false },
  });

  res.status(StatusCodes.CREATED).json({
    id: newTodo.id,
    name: newTodo.name,
    completed: newTodo.completed,
  });
}

async function toggleComplete(
  req: NextApiRequest,
  res: NextApiResponse<TodoResponseDto | ErrorResponseDto>,
  prisma: PrismaClient
) {
  const { id } = req.query;
  const user: JwtPayloadDto = JSON.parse(req.headers["x-user"] as string);

  if (!id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Missing ID parameter" });
  }

  const todoId = parseInt(id as string, 10);
  const existingTodo = await prisma.todo.findUnique({
    where: {
      id: todoId,
      userId: user.id,
    },
  });

  if (!existingTodo) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: "Todo not found" });
  }

  const updatedTodo = await prisma.todo.update({
    where: {
      id: todoId,
    },
    select: { id: true, name: true, completed: true },
    data: {
      completed: !existingTodo.completed,
    },
  });

  res.status(StatusCodes.OK).json(updatedTodo);
}

async function removeTodo(
  req: NextApiRequest,
  res: NextApiResponse<TodoResponseDto | ErrorResponseDto>,
  prisma: PrismaClient
) {
  const { id } = req.query;
  const user: JwtPayloadDto = JSON.parse(req.headers["x-user"] as string);

  if (!id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Missing ID parameter" });
  }

  const todoId = parseInt(id as string, 10);

  const deletedTodo = await prisma.todo.update({
    where: {
      id: todoId,
      userId:user.id
    },
    data: {
      deleted: true,
    },
  });

  res.status(StatusCodes.OK).json(deletedTodo);
}

export const apiGetTodoList = withApiHandler(getTodoList);
export const apiCreateTodo = withApiHandler(createTodo);
export const apiToggleComplete = withApiHandler(toggleComplete);
export const apiRemoveTodo = withApiHandler(removeTodo);
