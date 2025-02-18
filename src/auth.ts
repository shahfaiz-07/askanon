import Credentials from "next-auth/providers/credentials";
import { API_ERROR_MESSAGE } from "@/constants";
import connect from "@/config/db.config";
import bcrypt from "bcryptjs";
import { Provider } from "next-auth/providers";
import NextAuth, { CredentialsSignin, NextAuthConfig } from "next-auth";
import axios from "axios";
import { ApiResponse } from "./types/ApiResponse.type";

class InvalidCredentialsError extends CredentialsSignin {
    code = API_ERROR_MESSAGE.INVALID_CREDENTIALS;
}

class EmailNotVerifiedError extends CredentialsSignin {
    code = API_ERROR_MESSAGE.VERIFY_ACCOUNT;
}

const providers: Provider[] = [
    Credentials({
        name: "credentials",
        credentials: {
            identifier: { label: "Email or Username", type: "text" },
            password: { label: "Password", type: "password" },
        },
        async authorize(credentials): Promise<any> {
            const identifier = credentials.identifier as string | "";
            const password = credentials.password as string | "";

            if (!identifier || !password) {
                throw new Error(
                    `${API_ERROR_MESSAGE.MISSING_FIELDS} | Email(or username) and password`
                );
            }

            try {
                // Call your API route for authentication
                const response = await axios.post<ApiResponse>(
                    `${process.env.DOMAIN}/api/login`,
                    {
                        identifier,
                        password,
                    }
                );

                if (!response.data.success) {
                    throw new CredentialsSignin("Some error occured");
                }

                return response.data?.data?.user || null;
            } catch (error) {
                console.log("Authentication error:", error);
                throw new CredentialsSignin("Some error occured here");
            }
        },
    }),
];

export const { auth, handlers } = NextAuth({
    session: {
        strategy: "jwt",
    },
    providers,
    secret: process.env.AUTH_SECRET,
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async session({ session, token }) {
            if (token) {
                // moving information from 'token' to 'session' for server side use
                session.user._id = token._id;
                session.user.username = token.username;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                // moving information from jwt 'user' to 'token'
                token._id = user._id?.toString();
                token.username = user.username;
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
            }
            return token;
        },
        authorized: async ({ auth }) => {
            return !!auth;
        },
    },
});