import { NextApiRequest, NextApiResponse } from "next";
import { StatusCodes } from "http-status-codes";
import {
  apiCreateTodo,
  apiGetTodoList,
  apiRemoveTodo,
  apiToggleComplete,
} from "@/app/services/todo.service";
import NextCors from "nextjs-cors";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await NextCors(req, res, {
    // Options
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200,
    allowedHeaders: ["Content-Type", "Authorization"], // Add 'Authorization' to allowed headers
  });

  switch (req.method) {
    case "GET":
      await apiGetTodoList(req, res);
      break;
    case "POST":
      await apiCreateTodo(req, res);
      break;
    case "PATCH":
      await apiToggleComplete(req, res);
      break;
    case "DELETE":
      await apiRemoveTodo(req, res);
      break;
    case "OPTIONS":
      return res.status(200).send("ok");
    default:
      res
        .status(StatusCodes.METHOD_NOT_ALLOWED)
        .json({ message: "Method Not Allowed" });
      break;
  }
}

export async function getServerSideProps() {
  return {
    props: {},
  };
}
