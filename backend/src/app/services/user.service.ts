import { StatusCodes } from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";
import { ErrorResponseDto } from "../dto/error.dto";
import { ApiHandlerFunction, withApiHandler } from "../helpers/api-handler";
import { PrismaClient } from "@prisma/client";
import { UserResponseDto } from "../dto/user.dto";
import bcrypt from "bcrypt";

const getUserList: ApiHandlerFunction<UserResponseDto[]> = async (
  req,
  res,
  prisma: PrismaClient
) => {
  const userList = (await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },

    orderBy: { id: "desc" },
  })) as UserResponseDto[];

  res.status(StatusCodes.OK).json(userList);
};

const getUser: ApiHandlerFunction<UserResponseDto> = async (
  req,
  res,
  prisma: PrismaClient
) => {
  const userId = Number.parseInt(req.query.id as string);
  const user = (await prisma.user.findFirst({
    select: {
      id: true,
      name: true,
      email: true,
    },
    where: {
      id: userId,
    },
  })) as UserResponseDto;

  res.status(StatusCodes.OK).json(user);
};

async function createUser(
  req: NextApiRequest,
  res: NextApiResponse<UserResponseDto | ErrorResponseDto>,
  prisma: PrismaClient
) {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  res.status(StatusCodes.CREATED).json({
    id: newUser.id,
    name: newUser.name as string,
    email: newUser.email,
  });
}

async function removeUser(
  req: NextApiRequest,
  res: NextApiResponse<UserResponseDto | ErrorResponseDto>,
  prisma: PrismaClient
) {
  const { id } = req.query;

  if (!id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Missing ID parameter" });
  }

  const userId = parseInt(id as string, 10);

  const deletedUser = (await prisma.user.delete({
    where: {
      id: userId,
    },
  })) as UserResponseDto;

  res.status(StatusCodes.OK).json(deletedUser);
}

export const apiGetUserList = withApiHandler(getUserList);
export const apiGetUser = withApiHandler(getUser);
export const apiCreateUser = withApiHandler(createUser);
export const apiRemoveUser = withApiHandler(removeUser);
