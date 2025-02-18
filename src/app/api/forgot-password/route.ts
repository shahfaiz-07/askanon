import connect from "@/config/db.config";
import { API_ERROR_MESSAGE, API_SUCCESS_MESSAGE, STATUS_CODES } from "@/constants";
import { resetPasswordLink } from "@/emails/forgot-password.template";
import UserModel from "@/models/user.model";
import { emailValidation } from "@/schemas/signup.schema";
import { sendEmail } from "@/util/mailer";
import { ServerResponse } from "@/util/response";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    await connect();
    try {
        const { email } = await request.json();

        const result = emailValidation.safeParse(email);

        if (!result.success) {
            const emailErrors = result.error.format()?._errors || [];
            return ServerResponse({
                success: false,
                message:
                    emailErrors?.length > 0
                        ? emailErrors.join(", ")
                        : "Invalid email id",
                status: STATUS_CODES.BAD_REQUEST,
            });
        }
        const user = await UserModel.findOne({ email });

        if (!user) {
            return ServerResponse({
                success: false,
                message: API_ERROR_MESSAGE.USER_NOT_FOUND + ". The email is not registered.",
                status: STATUS_CODES.NOT_FOUND,
            });
        }
        console.log("User found");

        if(!user.isVerified) {
            return ServerResponse({
                success: false,
                message: API_ERROR_MESSAGE.EMAIL_NOT_VERIFIED,
                status: STATUS_CODES.FORBIDDEN
            })
        }
        console.log("User is verified");

        const passwordToken = crypto.randomUUID();
        const passwordTokenExpiry = new Date(Date.now() + 3600000);

        user.passwordToken = passwordToken;
        user.passwordTokenExpiry = passwordTokenExpiry;

        await user.save()
        console.log("Updated");

        const emailResponse = await sendEmail({
            to: email,
            subject: "Askanon Password Reset",
            content: resetPasswordLink(`${process.env.DOMAIN}/reset-password?token=${user.passwordToken}`)
        })
        if(!emailResponse.success) {
            return ServerResponse({
                success: false,
                message: API_ERROR_MESSAGE.FORGOT_PASSWORD,
                status: STATUS_CODES.INTERNAL_SERVER_ERROR,
            });
        }

        return ServerResponse({
            success: true,
            message: API_SUCCESS_MESSAGE.FORGOT_PASSWORD,
            status: STATUS_CODES.OK
        })
    } catch (error) {
        return ServerResponse({
            success: false,
            message: API_ERROR_MESSAGE.FORGOT_PASSWORD,
            status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        });
    }
}
