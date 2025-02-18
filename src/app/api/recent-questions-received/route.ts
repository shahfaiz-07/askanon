import connect from "@/config/db.config";
import {
    API_ERROR_MESSAGE,
    API_SUCCESS_MESSAGE,
    STATUS_CODES,
} from "@/constants";
import QuestionModel from "@/models/question.model";
import { QuestionType } from "@/types/ApiResponse.type";
import { getSessionUser } from "@/util/getSessionUser";
import { ServerResponse } from "@/util/response";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    await connect();
    try {
        const _user = await getSessionUser();

        if (!_user) {
            return ServerResponse({
                success: false,
                message: API_ERROR_MESSAGE.UNAUTHENTICATED,
                status: STATUS_CODES.UNAUTHORIZED,
            });
        }

        const userId = new mongoose.Types.ObjectId(_user._id);

        const questions = await QuestionModel.aggregate<QuestionType>([
            { $match: { to: userId } },
            { $sort: { createdAt: -1 } },
            { $limit: 5 }
        ]).exec();

        return ServerResponse({
            success: true,
            message: API_SUCCESS_MESSAGE.RECENT_QUESTIONS_SENT,
            status: STATUS_CODES.OK,
            questions: questions.map((q) => ({
                question: q.question,
                answer: q.answer || undefined,
                createdAt: q.createdAt as Date,
                updatedAt: q.updatedAt as Date,
                _id: q._id.toString(),
                isAnswered: q.isAnswered,
            })),
        });
    } catch (error) {
        console.log("ERROR fetching recent questions :: ", error);
        return ServerResponse({
            success: false,
            message: API_ERROR_MESSAGE.RECENT_QUESTIONS,
            status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        });
    }
}
