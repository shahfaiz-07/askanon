import connect from "@/config/db.config";
import { API_ERROR_MESSAGE, API_SUCCESS_MESSAGE, STATUS_CODES } from "@/constants";
import { emailVerificationTemplate } from "@/emails/verification.template";
import UserModel from "@/models/user.model";
import { sendEmail } from "@/util/mailer";
import { ServerResponse } from "@/util/response";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    await connect()
    try {

        const { email } = await request.json()

        if(!email) {
            return ServerResponse({
                success: false,
                message: API_ERROR_MESSAGE.MISSING_FIELDS,
                status: STATUS_CODES.BAD_REQUEST
            })
        }

        const user = await UserModel.findOne({email})

        if(!user) {
            return ServerResponse({
                success: false,
                message: API_ERROR_MESSAGE.USER_NOT_FOUND,
                status: STATUS_CODES.NOT_FOUND
            })
        }

        if(user.isVerified) {
            return ServerResponse({
                success: false,
                message: API_ERROR_MESSAGE.VERIFIED,
                status: STATUS_CODES.BAD_REQUEST
            })
        }

        let token = user.verifyCode as string;

        if (
            !user.verifyCodeExpiry ||
            user.verifyCodeExpiry < new Date(Date.now())
        ) {
            token = Math.floor(100000 + Math.random() * 900000).toString();
            const expiryTime = new Date(Date.now() + 3600000);
            user.verifyCodeExpiry = expiryTime;

            if (user.deleteAt && user.deleteAt < expiryTime) {
                user.deleteAt = expiryTime;
            }

            user.verifyCode = token;
        }

        await user.save();

        const emailResponse = await sendEmail({
            to: user.email,
            subject: "AskAnon Email Verification",
            content: emailVerificationTemplate({
                username: user.username,
                otp: token,
            }),
        });

        if(!emailResponse.success) {
            return ServerResponse({
                success: false,
                message: API_ERROR_MESSAGE.MAIL_ERROR_VERIFY,
                status: STATUS_CODES.INTERNAL_SERVER_ERROR
            })
        }

        return ServerResponse({
            success: true,
            message: API_SUCCESS_MESSAGE.VERIFICATION_EMAIL_SENT,
            status: STATUS_CODES.OK
        })
    } catch (error) {
        return ServerResponse({
            success: false,
            message: API_ERROR_MESSAGE.MAIL_ERROR_VERIFY,
            status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        });
    }
}