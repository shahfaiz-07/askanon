import connect from "@/config/db.config";
import {
    API_ERROR_MESSAGE,
    API_SUCCESS_MESSAGE,
    STATUS_CODES,
} from "@/constants";
import QuestionModel from "@/models/question.model";
import { getSessionUser } from "@/util/getSessionUser";
import { ServerResponse } from "@/util/response";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {

    const _user = await getSessionUser();

    if (!_user) {
        return ServerResponse({
            success: false,
            message: API_ERROR_MESSAGE.UNAUTHENTICATED,
            status: STATUS_CODES.UNAUTHORIZED,
        });
    }

    await connect();

    try {
        const { quesId, answer } = await request.json();
        if(!answer.trim()) {
            return ServerResponse({
                success: false,
                message: API_ERROR_MESSAGE.EMPTY_REPLY,
                status: STATUS_CODES.BAD_REQUEST,
            });
        }
        const ques = await QuestionModel.findOne({
            _id: quesId,
            to: _user._id
        });

        if (!ques) {
            return ServerResponse({
                success: false,
                message: API_ERROR_MESSAGE.QUES_NOT_FOUND,
                status: STATUS_CODES.NOT_FOUND,
            });
        }

        if (ques.isAnswered) {
            return ServerResponse({
                success: false,
                message: API_ERROR_MESSAGE.ALREADY_ANSWERED,
                status: STATUS_CODES.BAD_REQUEST,
            });
        }

        ques.answer = answer;
        ques.isAnswered = true;
        await ques.save();

        return ServerResponse({
            success: true,
            message: API_SUCCESS_MESSAGE.SEND_ANSWER,
            status: STATUS_CODES.OK,
        });
    } catch (error) {
        console.log(`ERROR in sending response message :: `, error);
        return ServerResponse({
            success: false,
            message: API_ERROR_MESSAGE.SEND_REPLY,
            status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        });
    }
}
