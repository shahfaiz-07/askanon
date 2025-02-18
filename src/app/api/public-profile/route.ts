import connect from "@/config/db.config";
import { API_ERROR_MESSAGE, API_SUCCESS_MESSAGE, STATUS_CODES } from "@/constants";
import UserModel from "@/models/user.model";
import { ProfileResponseType } from "@/types/ApiResponse.type";
import { ServerResponse } from "@/util/response";
import { truncate } from "fs/promises";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    await connect()
    try {
        const { username } = await request.json()

        const user = await UserModel.findOne({ username, isVerified: true })
            .select(
                "firstname lastname avatar bio username isAcceptingQuestions createdAt"
            )
            .lean<ProfileResponseType>().exec();

        if(!user) {
            return ServerResponse({
                success: false,
                message: API_ERROR_MESSAGE.USER_NOT_FOUND,
                status: STATUS_CODES.NOT_FOUND
            })
        }

        return ServerResponse({
            success: true,
            message: API_SUCCESS_MESSAGE.PUBLIC_PROFILE,
            status: STATUS_CODES.OK,
            profile: user
        })

    } catch (error) {
        return ServerResponse({
            success: false,
            message: API_ERROR_MESSAGE.PUBLIC_PROFILE,
            status: STATUS_CODES.INTERNAL_SERVER_ERROR
        })
    }
}