import { NextRequest, NextResponse } from "next/server";
import authConfig from "@/config/auth.config";
import NextAuth from "next-auth";
import { ALL_ROUTES_MATCHER, PRIVATE_ROUTES, PUBLIC_ROUTES } from "./constants";

const { auth } = NextAuth(authConfig);

export default auth((request) => {

    const url = request.nextUrl;

    if(!request.auth && url.pathname === "/") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (request.auth && PUBLIC_ROUTES.some((path) => url.pathname.startsWith(path))) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (
        !request.auth &&
        PRIVATE_ROUTES.some((path) => url.pathname.startsWith(path))
    ) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next()
});

export const config = {
    matcher: ALL_ROUTES_MATCHER,
};
