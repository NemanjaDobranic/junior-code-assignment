import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { StatusCodes } from "http-status-codes";

export async function middleware(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return Response.json(
      {
        error: "Unauthorized - No token provided",
      },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_KEY)
    );

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user", JSON.stringify(payload));

    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });

    // response.headers.set("x-hello-from-middleware2", "hello");
    return response;
  } catch (error) {
    return Response.json(
      {
        error: "Unauthorized - Invalid token",
      },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }
}

export const config = {
  matcher: "/api/todos/:path*",
};
