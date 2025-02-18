import connect from "@/config/db.config";
import { API_ERROR_MESSAGE, API_SUCCESS_MESSAGE, STATUS_CODES } from "@/constants";
import UserModel from "@/models/user.model";
import { updateProfileSchema } from "@/schemas/userProfile.schema";
import { UserResponseType } from "@/types/ApiResponse.type";
import { getSessionUser } from "@/util/getSessionUser";
import { ServerResponse } from "@/util/response";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    await connect()
    try {

        const _user = await getSessionUser()

        if (!_user) {
            return ServerResponse({
                success: false,
                message: API_ERROR_MESSAGE.UNAUTHENTICATED,
                status: STATUS_CODES.UNAUTHORIZED,
            });
        }

        const user = await UserModel.findById(_user._id).select("username firstname lastname email bio avatar").lean<UserResponseType>().exec()

        if(!user) {
            return ServerResponse({
                success: false,
                message: API_ERROR_MESSAGE.USER_NOT_FOUND,
                status: STATUS_CODES.NOT_FOUND,
            });
        }

        return ServerResponse({
            success: true,
            message: API_SUCCESS_MESSAGE.GET_USER_DATA,
            status: STATUS_CODES.OK,
            user
        });
    } catch (error) {
        return ServerResponse({
            success: false,
            message: API_ERROR_MESSAGE.GET_USER_DATA,
            status: STATUS_CODES.INTERNAL_SERVER_ERROR
        })
    }
}

export async function POST(request: NextRequest) {
    await connect()
    try {
        const _user = await getSessionUser()

        if(!_user) {
            return ServerResponse({
                success: false,
                message: API_ERROR_MESSAGE.UNAUTHENTICATED,
                status: STATUS_CODES.UNAUTHORIZED,
            });
        }

        const { firstname, lastname, bio, avatar } = await request.json()

        const result = updateProfileSchema.safeParse({firstname, lastname, bio, avatar})

        if (!result.success) {
            const firstnameErrors = result.error.format().firstname?._errors || [];
            const lastnameErrors = result.error.format().lastname?._errors || [];
            const bioErrors = result.error.format().bio?._errors || [];

            return ServerResponse({
                success: false,
                message:
                    firstnameErrors?.length > 0
                        ? firstnameErrors.join(", ")
                        : lastnameErrors.length > 0 
                        ? lastnameErrors.join(", ")
                        : bioErrors.length > 0
                        ? bioErrors.join(", ")
                        : "Invalid parameters",
                status: STATUS_CODES.BAD_REQUEST,
            });
        }

        const user = await UserModel.findByIdAndUpdate(
            _user._id,
            {
                firstname,
                lastname,
                bio,
                avatar,
            },
            {
                new: true,
            }
        );

        if(!user) {
            return ServerResponse({
                success: false,
                message: API_ERROR_MESSAGE.USER_NOT_FOUND,
                status: STATUS_CODES.NOT_FOUND,
            });
        }

        return ServerResponse({
            success: true,
            message: API_SUCCESS_MESSAGE.UPDATE_USER_DATA,
            status: STATUS_CODES.OK
        })
    } catch (error) {
        return ServerResponse({
            success: false,
            message: API_ERROR_MESSAGE.UPDATE_USER_DATA,
            status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        });
    }
}