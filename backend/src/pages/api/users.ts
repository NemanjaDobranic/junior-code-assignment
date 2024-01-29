import { NextApiRequest, NextApiResponse } from "next";
import { StatusCodes } from "http-status-codes";
import {
  apiCreateUser,
  apiGetUserList,
  apiRemoveUser,
} from "@/app/services/user.service";
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
  });

  switch (req.method) {
    case "GET":
      await apiGetUserList(req, res);
      break;
    case "POST":
      await apiCreateUser(req, res);
      break;
    case "DELETE":
      await apiRemoveUser(req, res);
      break;
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
