import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { ErrorResponseDto } from "@/app/dto/error.dto";

export type ApiHandlerFunction<T> = (
  req: NextApiRequest,
  res: NextApiResponse<T | ErrorResponseDto>,
  prisma: PrismaClient
) => Promise<void>;

export function withApiHandler<T>(handler: ApiHandlerFunction<T>) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const prisma = new PrismaClient();

    try {
      await handler(req, res, prisma);
    } catch (error) {
      console.error("Error in API handler:", error);
      const errorResponse: ErrorResponseDto = {
        error: "Internal Server Error",
      };
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse);
    } finally {
      await prisma.$disconnect();
    }
  };
}
