import connect from "@/config/db.config";
import {
    API_ERROR_MESSAGE,
    API_SUCCESS_MESSAGE,
    STATUS_CODES,
} from "@/constants";
import UserModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { ServerResponse } from "@/util/response";

export async function POST(request: NextRequest) {
    await connect();

    try {
        const { email } = await request.json();

        // Find user by email or username
        const user = await UserModel.findOne({
            email,
        }).select("-password");

        if (!user) {
            return ServerResponse({
                success: false,
                message: API_ERROR_MESSAGE.EMAIL_NOT_FOUND,
                status: STATUS_CODES.NOT_FOUND,
            });
        }

        // Even if user is not verified, google logins are, so we change the isVerified flag to true
        if (!user.isVerified) {
            user.isVerified = true;
            user.deleteAt = undefined;
            user.verifyCode = undefined;
            user.verifyCodeExpiry = undefined;
            await user.save()
        }

        return NextResponse.json({
            success: true,
            user
        })
    } catch (error) {
        console.error("Error in google authentication:", error);
        return NextResponse.json(
            {
                success: false,
                message: API_ERROR_MESSAGE.LOGIN_ERROR,
            },
            { status: STATUS_CODES.INTERNAL_SERVER_ERROR }
        );
    }
}
