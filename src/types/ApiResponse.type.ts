import { AvatarVariantTypes } from "./avatar.type";

export type QuestionType = {
    question: string;
    answer?: string;
    createdAt: Date;
    updatedAt: Date;
    _id: string;
    isAnswered: boolean;
    toUsername?: string;
};

export type UserResponseType = {
    username: string;
    firstname: string;
    lastname: string;
    bio?: string;
    avatar?: AvatarVariantTypes;
    email: string;
}

export type ProfileResponseType = {
    username: string;
    firstname: string;
    lastname: string;
    bio: string;
    avatar: AvatarVariantTypes;
    isAcceptingQuestions: boolean;
    createdAt: Date
}

export interface ApiResponse {
    success: boolean;
    message: string;
    data?: {
        questions?: Array<QuestionType>;
        isAcceptingQuestions?: boolean;
        user?: UserResponseType;
        profile?: ProfileResponseType
    };
}
