import connect from "@/config/db.config";
import { API_ERROR_MESSAGE, API_SUCCESS_MESSAGE, STATUS_CODES } from "@/constants";
import UserModel from "@/models/user.model";
import { usernameValidation } from "@/schemas/signup.schema";
import { ServerResponse } from "@/util/response";
import { NextRequest } from "next/server";
import { z } from "zod";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: NextRequest) {
    await connect();
    try {
        const { searchParams } = new URL(request.url)

        const queryParams = { username: searchParams.get('username') }

        const result = UsernameQuerySchema.safeParse(queryParams);

        if(!result.success) {
            const usernameErrors =
                result.error.format().username?._errors || [];
            return ServerResponse(
                {
                    success: false,
                    message:
                        usernameErrors?.length > 0
                            ? usernameErrors.join(", ")
                            : "Invalid username",
                    status: STATUS_CODES.BAD_REQUEST
                }
            );
        }

        const username = await UserModel.findOne({
            username: result.data.username
        })

        if(username) {
            return ServerResponse({
                success: false,
                message: API_ERROR_MESSAGE.EXISTING_USERNAME,
                status: STATUS_CODES.CONFLICT
            })
        }

        return ServerResponse({
            success: true,
            message: API_SUCCESS_MESSAGE.VALID_USERNAME,
            status: STATUS_CODES.OK
        })
    } catch (error) {
        console.log(`ERROR validating username : ${error}`);
        return ServerResponse({
            success: false,
            message: API_ERROR_MESSAGE.USERNAME_ERROR,
            status: STATUS_CODES.INTERNAL_SERVER_ERROR
        })
    }
}
