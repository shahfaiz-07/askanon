import connect from "@/config/db.config";
import { NextRequest } from "next/server";
import { ServerResponse } from "@/util/response";
import { API_ERROR_MESSAGE, API_SUCCESS_MESSAGE, STATUS_CODES } from "@/constants";
import UserModel from "@/models/user.model";
import { getSessionUser } from "@/util/getSessionUser";

export async function POST(request: NextRequest) {
    await connect()
    try {
        const user = await getSessionUser();

        if(!user) {
            return ServerResponse({
                success: false,
                message: API_ERROR_MESSAGE.UNAUTHENTICATED,
                status: STATUS_CODES.UNAUTHORIZED
            })
        }

        const userId = user._id
        const { acceptQuestions } = await request.json()

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                isAcceptingQuestions: acceptQuestions
            },
            { new: true }
        )

        if(!updatedUser) {
            return ServerResponse({
                success: false,
                message: API_ERROR_MESSAGE.USER_MESSAGE_FLAG_UPDATE,
                status: STATUS_CODES.INTERNAL_SERVER_ERROR,
            });
        }

        return ServerResponse({
            success: true,
            message: API_SUCCESS_MESSAGE.USER_MESSAGE_FLAG,
            status: STATUS_CODES.OK,
        });
    } catch (error) {
        console.log(`ERROR in updating acceptMessages flag :: `, error)
        return ServerResponse({
            success: false,
            message: API_ERROR_MESSAGE.USER_MESSAGE_FLAG_UPDATE,
            status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        });
    }
}

export async function GET(request: NextRequest) {
    await connect()
    try {
        const user = await getSessionUser()

        if (!user) {
            return ServerResponse({
                success: false,
                message: API_ERROR_MESSAGE.UNAUTHENTICATED,
                status: STATUS_CODES.UNAUTHORIZED,
            });
        }

        const userId = user._id;

        const userFound = await UserModel.findById(userId);

        if(!userFound) {
            return ServerResponse({
                success: false,
                message: API_ERROR_MESSAGE.USER_NOT_FOUND,
                status: STATUS_CODES.NOT_FOUND
            })
        }

        return ServerResponse({
            success: true,
            message: API_SUCCESS_MESSAGE.GET_USER_MESSAGE_FLAG,
            status: STATUS_CODES.OK,
            isAcceptingQuestions: userFound.isAcceptingQuestions
        })

    } catch (error) {
        console.log(`ERROR in getting acceptMessages flag :: `, error);
        return ServerResponse({
            success: false,
            message: API_ERROR_MESSAGE.GET_USER_MESSAGE_FLAG,
            status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        });
    }
}