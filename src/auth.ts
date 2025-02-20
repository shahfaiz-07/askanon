import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { API_ERROR_MESSAGE } from "@/constants";
import { Provider } from "next-auth/providers";
import NextAuth, { CredentialsSignin } from "next-auth";
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
                    `${process.env.DOMAIN_URI}/api/login/credentials`,
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
                return null
            }
        },
    }),
    Google({
        name: "google",
        async profile(profile) {
            const email = profile.email

            try {
                const response = await axios.post(
                    `${process.env.DOMAIN_URI}/api/login/google`,
                    {
                        email
                    }
                );

                if(!response.data.success) {
                    throw new Error(
                        response.data.message ??
                            "Error signing in through google"
                    );
                }

                const user = response.data.user

                user.username = user?.username;
                user._id = user?._id;
                user.isVerified = user?.isVerified;
                user.isAcceptingMessages = user?.isAcceptingMessages;
                return user
            } catch (error: any) {
                console.log("Authentication error:", error);
                return null
            }
        }
    })
];

export const { auth, handlers } = NextAuth({
    session: {
        strategy: "jwt",
    },
    providers,
    secret: process.env.AUTH_SECRET,
    pages: {
        signIn: "/login",
        error: "/login"
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
        async jwt({ token, user, account, profile }) {
            if(account?.provider === "google" && user) {
                token._id = user._id?.toString();
                token.username = user.username;
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
            }
            if (user) {
                // moving information from jwt 'user' to 'token'
                token._id = user._id?.toString();
                token.username = user.username;
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
            }
            return token;
        },
    },
});