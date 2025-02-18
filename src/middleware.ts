import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { PRIVATE_ROUTES, PUBLIC_ROUTES } from "./constants";

export default async function middleware(request: NextRequest) {
    const token = await getToken({
        req: request,
        secret: process.env.AUTH_SECRET,
    });

    const url = request.nextUrl;

    if (token && url.pathname === "/") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (token && PUBLIC_ROUTES.some((path) => url.pathname.startsWith(path))) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (
        !token &&
        PRIVATE_ROUTES.some((path) => url.pathname.startsWith(path))
    ) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}
