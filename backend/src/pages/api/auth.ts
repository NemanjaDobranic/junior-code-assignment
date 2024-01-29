import { NextApiRequest, NextApiResponse } from "next";
import { StatusCodes } from "http-status-codes";
import {
  apiSignIn,
} from "@/app/services/auth.service";
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
    case "POST":
      await apiSignIn(req, res);
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
