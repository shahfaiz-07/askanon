import connect from "@/config/db.config";
import { API_ERROR_MESSAGE, API_SUCCESS_MESSAGE, STATUS_CODES } from "@/constants";
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

        const userQuestions = await QuestionModel.aggregate<QuestionType>([
            { $match: { to: userId } },
            { $sort: { updatedAt: -1 } },
            {
                $lookup: {
                    from: "users",
                    localField: "to",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {
                $unwind: "$user",
            },
            {
                $project: {
                    question: 1,
                    answer: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    toUsername: "$user.username",
                    _id: 1,
                    isAnswered: 1,
                },
            },
        ]).exec();

        if(!userQuestions) {
            console.log('ERROR fetching questions from MongoDB!!')
            return ServerResponse({
                success: false,
                message: API_ERROR_MESSAGE.GET_USER_QUESTION,
                status: STATUS_CODES.INTERNAL_SERVER_ERROR
            })
        }

        const formattedQuestions = userQuestions.map((q) => ({
            question: q.question,
            answer: q.answer || undefined,
            createdAt: q.createdAt as Date,
            updatedAt: q.updatedAt as Date,
            _id: q._id.toString(),
            isAnswered: q.isAnswered,
            toUsername: q.toUsername,
        }));

        return ServerResponse({
            success: true,
            message: API_SUCCESS_MESSAGE.GET_USER_MESSAGE,
            status: STATUS_CODES.OK,
            questions: formattedQuestions
        })

    } catch (error) {
        console.log("ERROR fetching user messages ", error);
        return ServerResponse({
            success: false,
            message: API_ERROR_MESSAGE.GET_USER_QUESTION,
            status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        });
    }
}
