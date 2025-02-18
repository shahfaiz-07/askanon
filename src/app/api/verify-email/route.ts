import connect from "@/config/db.config";
import { API_ERROR_MESSAGE, API_SUCCESS_MESSAGE, STATUS_CODES } from "@/constants";
import UserModel from "@/models/user.model";
import { ServerResponse } from "@/util/response";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    await connect()

    try {
        const { username, verifyCode } = await request.json();

        const user = await UserModel.findOne({username})

        if(!user) {
            return ServerResponse({
                success: false,
                message: API_ERROR_MESSAGE.USER_NOT_FOUND,
                status: STATUS_CODES.NOT_FOUND,
            });
        }

        if(user.isVerified) {
            return ServerResponse({
                success: false,
                message: API_ERROR_MESSAGE.VERIFIED,
                status: STATUS_CODES.CONFLICT
            })
        }

        if(user.verifyCode != verifyCode) {
            return ServerResponse({
                success: false,
                message: API_ERROR_MESSAGE.TOKEN_INVALID,
                status: STATUS_CODES.BAD_REQUEST,
            });
        }

        if(user.verifyCodeExpiry && new Date() > user.verifyCodeExpiry) {

            return ServerResponse({
                success: false,
                message: API_ERROR_MESSAGE.VERIFICATION_EXPIRED,
                status: STATUS_CODES.GONE
            })
        }

        user.isVerified = true
        user.deleteAt = undefined
        user.verifyCode = undefined
        user.verifyCodeExpiry = undefined

        await user.save()

        return ServerResponse({
            success: true,
            message: API_SUCCESS_MESSAGE.VERIFICATION,
            status: STATUS_CODES.OK
        })
    } catch (error) {
        console.log(`ERROR verifying email : `, error)
        return ServerResponse({
            success: false,
            message: API_ERROR_MESSAGE.EMAIL_VERIFICATION,
            status: STATUS_CODES.INTERNAL_SERVER_ERROR
        })
    }
}