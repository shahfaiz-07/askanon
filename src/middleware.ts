import { NextResponse } from "next/server";
import { PRIVATE_ROUTES, PUBLIC_ROUTES } from "./constants";
import { auth } from "./auth";

export default auth((request) => {
    const url = request.nextUrl;

    if (!request.auth && url.pathname === "/") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (
        request.auth &&
        PUBLIC_ROUTES.some((path) => url.pathname.startsWith(path))
    ) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (
        !request.auth &&
        PRIVATE_ROUTES.some((path) => url.pathname.startsWith(path))
    ) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        "/login",
        "/sign-up",
        "/",
        "/dashboard/:path*",
        "/verify/:path",
        "/forgot-password",
        "/reset-password",
        "/request-verification",
        "/profile/:path",
        "/send-question",
        "/contact-us",
    ],
};
