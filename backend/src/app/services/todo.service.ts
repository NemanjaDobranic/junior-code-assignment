import { StatusCodes } from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";
import { TodoResponseDto } from "../dto/todo-dto.interface";
import { ErrorResponseDto } from "../dto/error-dto.interface";
import { ApiHandlerFunction, withApiHandler } from "../helpers/api-handler";
import { PrismaClient } from "@prisma/client";

const getTodoList: ApiHandlerFunction<TodoResponseDto[]> = async (
  req,
  res,
  prisma: PrismaClient
) => {
  const todoList = await prisma.todo.findMany({
    select: {
      id: true,
      name: true,
      completed: true,
    },
    where: {
      deleted: false,
    },
  });

  res.status(StatusCodes.OK).json(todoList);
};

async function createTodo(
  req: NextApiRequest,
  res: NextApiResponse<TodoResponseDto | ErrorResponseDto>,
  prisma: PrismaClient
) {
  try {
    const { name, completed } = req.body;

    const newTodo = await prisma.todo.create({
      data: { userId: 1, name, completed, deleted: false },
    });

    res.status(StatusCodes.CREATED).json({
      id: newTodo.id,
      name: newTodo.name,
      completed: newTodo.completed,
    });
  } catch (error) {
    console.error("Error creating a todo:", error);
    const errorResponse: ErrorResponseDto = {
      error: "Internal Server Error",
    };
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse);
  } finally {
    await prisma.$disconnect();
  }
}

async function toggleComplete(
  req: NextApiRequest,
  res: NextApiResponse<TodoResponseDto | ErrorResponseDto>,
  prisma: PrismaClient
) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Missing ID parameter" });
  }

  const todoId = parseInt(id as string, 10);
  const existingTodo = await prisma.todo.findUnique({
    where: {
      id: todoId,
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

  if (!id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Missing ID parameter" });
  }

  const todoId = parseInt(id as string, 10);

  try {
    const deletedTodo = await prisma.todo.update({
      where: {
        id: todoId,
      },
      data: {
        deleted: true,
      },
    });

    res.status(StatusCodes.OK).json(deletedTodo);
  } catch (error) {
    console.error("Error deleting Todo:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
}

export const apiGetTodoList = withApiHandler(getTodoList);
export const apiCreateTodo = withApiHandler(createTodo);
export const apiToggleComplete = withApiHandler(toggleComplete);
export const apiRemoveTodo = withApiHandler(removeTodo);
