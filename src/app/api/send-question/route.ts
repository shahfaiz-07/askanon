import { auth } from "@/auth";
import connect from "@/config/db.config";
import { API_ERROR_MESSAGE, API_SUCCESS_MESSAGE, STATUS_CODES } from "@/constants";
import QuestionModel from "@/models/question.model";
import UserModel from "@/models/user.model";
import { getSessionUser } from "@/util/getSessionUser";
import { ServerResponse } from "@/util/response";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    await connect()
    try {
        const _user = await getSessionUser()

        if(!_user) {
            return ServerResponse({
                success: false,
                message: API_ERROR_MESSAGE.UNAUTHENTICATED,
                status: STATUS_CODES.UNAUTHORIZED
            })
        }

        const { username , question } = await request.json()

        const toUser = await UserModel.findOne({
            username
        })

        if(!toUser) {
            return ServerResponse({
                success: false,
                message: API_ERROR_MESSAGE.USER_NOT_FOUND,
                status: STATUS_CODES.NOT_FOUND
            })
        }

        if(toUser.username === _user.username) {
            return ServerResponse({
                success: false,
                message: API_ERROR_MESSAGE.MESSAGE_TO_SELF,
                status: STATUS_CODES.BAD_REQUEST
            })
        }

        if(!toUser.isAcceptingQuestions) {
            return ServerResponse({
                success: false,
                message: API_ERROR_MESSAGE.NOT_ACCEPTING,
                status: STATUS_CODES.BAD_REQUEST
            })
        }

        const questionEntry = new QuestionModel({
            from: _user._id,
            to: toUser._id,
            question
        });

        if(!questionEntry) {
            return ServerResponse({
                success: false,
                message: API_ERROR_MESSAGE.POST_QUESION,
                status: STATUS_CODES.INTERNAL_SERVER_ERROR
            })
        }


        await questionEntry.save()

        return ServerResponse({
            success: true,
            message: API_SUCCESS_MESSAGE.POST_QUESTION,
            status: STATUS_CODES.OK
        })
        
    } catch (error) {
        console.log('ERROR posting question :: ', error)
        return ServerResponse({
            success: false,
            message: API_ERROR_MESSAGE.POST_QUESION,
            status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        });
    }
}