import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { API_ERROR_MESSAGE } from "@/constants";
import connect from "@/config/db.config";
import bcrypt from "bcryptjs";
import { Provider } from "next-auth/providers";
import { CredentialsSignin } from "next-auth";

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
            await connect();

            const identifier = credentials.identifier as string | "";
            const password = credentials.password as string | "";

            if (!identifier || !password) {
                throw new Error(
                    `${API_ERROR_MESSAGE.MISSING_FIELDS} | Email(or username) and password`
                );
            }

            // 🔥 Lazy-load UserModel after DB connection is established
            const { default: UserModel } = await import("@/models/user.model");

            const user = await UserModel.findOne({
                $or: [{ email: identifier }, { username: identifier }],
            });

            if (!user) {
                throw new InvalidCredentialsError();
            }

            const isPasswordCorrect = await bcrypt.compare(
                password,
                user.password
            );

            if (!isPasswordCorrect) {
                throw new InvalidCredentialsError();
            }

            if (!user.isVerified) {
                throw new EmailNotVerifiedError();
            }

            return user; // this is returned to jwt 'user'
        },
    }),
];
export default {
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
    },
} satisfies NextAuthConfig;

export const providerMap = providers
    .map((provider) => {
        if (typeof provider === "function") {
            const providerData = provider();
            return { id: providerData.id, name: providerData.name };
        } else {
            return { id: provider.id, name: provider.name };
        }
    })
    .filter((provider) => provider.id !== "credentials");
