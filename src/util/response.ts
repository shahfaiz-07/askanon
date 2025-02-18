import { ApiResponse, ProfileResponseType, QuestionType, UserResponseType } from "@/types/ApiResponse.type";
import { NextResponse } from "next/server";

type ResponseProps = {
    success: boolean,
    message: string,
    status: number,
    isAcceptingQuestions?: boolean,
    questions?: Array<QuestionType>,
    user?: UserResponseType,
    profile?: ProfileResponseType
}

export function ServerResponse({ success, message, status, questions, isAcceptingQuestions, user, profile }: ResponseProps) {
    const response: ApiResponse = { success, message, data: {
        isAcceptingQuestions,
        questions,
        user,
        profile,
    } };
    return NextResponse.json(response, { status });
}