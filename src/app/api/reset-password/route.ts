import connect from "@/config/db.config";
import { API_ERROR_MESSAGE, API_SUCCESS_MESSAGE, STATUS_CODES } from "@/constants";
import UserModel from "@/models/user.model";
import { passwordValidation } from "@/schemas/signup.schema";
import { ServerResponse } from "@/util/response";
import { NextRequest } from "next/server";
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
    await connect()
    try {
        const {token, password, confirmPassword} = await request.json()

        if(!token || !password || !confirmPassword) {
            return ServerResponse({
                success: false,
                message: API_ERROR_MESSAGE.MISSING_FIELDS + ". Token, password and confirm password",
                status: STATUS_CODES.BAD_REQUEST
            })
        }

        const result = passwordValidation.safeParse(password)

        if(!result.success) {
            const passwordErrors =
                result.error.format()?._errors || [];
            return ServerResponse({
                success: false,
                message:
                    passwordErrors?.length > 0
                        ? passwordErrors.join(", ")
                        : "Invalid password",
                status: STATUS_CODES.BAD_REQUEST,
            });
        }

        if(password !== confirmPassword) {
            return ServerResponse({
                success: false,
                message: API_ERROR_MESSAGE.PASSWORD_NOT_MATCH,
                status: STATUS_CODES.BAD_REQUEST
            })
        }

        const user = await UserModel.findOne({passwordToken: token})

        if(!user) {
            console.log("User not found")
            return ServerResponse({
                success: false,
                message: API_ERROR_MESSAGE.PASS_TOKEN_INVALID,
                status: STATUS_CODES.NOT_FOUND
            })
        }

        const currentTime = new Date(Date.now());
        if(!user.passwordTokenExpiry || currentTime > user.passwordTokenExpiry) {
            return ServerResponse({
                success: false,
                message: API_ERROR_MESSAGE.PASS_TOKEN_EXPIRED,
                status: STATUS_CODES.GONE
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        user.password = hashedPassword;
        user.passwordToken = undefined;
        user.passwordTokenExpiry = undefined;

        await user.save();

        return ServerResponse({
            success: true,
            message: API_SUCCESS_MESSAGE.PASSWORD_CHANGED,
            status: STATUS_CODES.OK
        })
    } catch (error) {
        return ServerResponse({
            success: false,
            message: API_ERROR_MESSAGE.PASSWORD_CHANGE,
            status: STATUS_CODES.INTERNAL_SERVER_ERROR
        })
    }
}