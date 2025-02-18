import connect from "@/config/db.config";
import {
    API_ERROR_MESSAGE,
    API_SUCCESS_MESSAGE,
    STATUS_CODES,
} from "@/constants";
import UserModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ServerResponse } from "@/util/response";

export async function POST(request: NextRequest) {
    await connect();

    try {
        console.log("INSIDE THE LOGIN URL...");
        const { identifier, password } = await request.json();

        // Find user by email or username
        const user = await UserModel.findOne({
            $or: [{ email: identifier }, { username: identifier }],
        });

        if (!user) {
            return ServerResponse({
                success: false,
                message: API_ERROR_MESSAGE.INVALID_CREDENTIALS,
                status: STATUS_CODES.UNAUTHORIZED,
            });
        }

        // Check if password is correct
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return ServerResponse({
                success: false,
                message: API_ERROR_MESSAGE.INVALID_CREDENTIALS,
                status: STATUS_CODES.UNAUTHORIZED,
            });
        }

        // Check if user is verified
        if (!user.isVerified) {
            return ServerResponse({
                success: false,
                message: API_ERROR_MESSAGE.VERIFY_ACCOUNT,
                status: STATUS_CODES.UNAUTHORIZED,
            });
        }

        return ServerResponse({
            success: true,
            message: API_SUCCESS_MESSAGE.LOGIN_SUCCESS,
            status: STATUS_CODES.OK,
            user,
        });
    } catch (error) {
        console.error("Error in authentication:", error);
        return NextResponse.json(
            {
                success: false,
                message: API_ERROR_MESSAGE.LOGIN_ERROR,
            },
            { status: STATUS_CODES.INTERNAL_SERVER_ERROR }
        );
    }
}
