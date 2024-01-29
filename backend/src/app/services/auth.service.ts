import { StatusCodes } from "http-status-codes";
import { ApiHandlerFunction, withApiHandler } from "../helpers/api-handler";
import { PrismaClient } from "@prisma/client";
import { hash, compare } from "bcrypt";
import { JwtPayloadDto, JwtResponseDto } from "../dto/auth.dto";
import { SignJWT } from "jose";

const signIn: ApiHandlerFunction<JwtResponseDto> = async (
  req,
  res,
  prisma: PrismaClient
) => {
  const user = await prisma.user.findFirst({
    where: { email: req.body.email },
  });

  if (!user) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "User does not exist with given email" });
  }

  if (
    req.body.email === user.email &&
    (await compare(req.body.password, user.password))
  ) {
    const payload: JwtPayloadDto = {
      id: user.id,
      email: user.email,
    };

    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 60 * 60; // one hour

    const token = await new SignJWT({ ...payload })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setExpirationTime(exp)
      .setIssuedAt(iat)
      .setNotBefore(iat)
      .sign(new TextEncoder().encode(process.env.JWT_KEY));

    return res.status(StatusCodes.OK).json({
      accessToken: token,
    });
  }

  return res.status(StatusCodes.UNAUTHORIZED).json({
    error: "Email or password are incorrect",
  });
};

export const apiSignIn = withApiHandler(signIn);
