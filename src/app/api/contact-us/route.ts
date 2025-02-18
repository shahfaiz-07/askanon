import connect from "@/config/db.config";
import { API_ERROR_MESSAGE, API_SUCCESS_MESSAGE } from "@/constants";
import { getSessionUser } from "@/util/getSessionUser";
import { ServerResponse } from "@/util/response";
import { STATUS_CODES } from "@/constants";
import { NextRequest } from "next/server";
import UserModel from "@/models/user.model";
import { sendEmail } from "@/util/mailer";
import { contactUsTemplate } from "@/emails/contact-us.template";

export async function POST(request: NextRequest) {
    await connect()
    try {
        const _user = await getSessionUser()

        const { name, email, message, isExistingUser, username, phone} = await request.json()

        if(_user && _user.username !== username) {
            return ServerResponse({
                success: false,
                message: API_ERROR_MESSAGE.USERNAME_MISMATCH,
                status: STATUS_CODES.CONFLICT
            })
        }

        if(isExistingUser && !username) {
            return ServerResponse({
                success: false,
                message: API_ERROR_MESSAGE.USERNAME_REQUIRED,
                status: STATUS_CODES.BAD_REQUEST
            })
        }

        const emailUser = await UserModel.findOne({email})
        if(emailUser && !emailUser.username) {
            return ServerResponse({
                success: false,
                message: API_ERROR_MESSAGE.EMAIL_FOUND,
                status: STATUS_CODES.BAD_REQUEST
            })
        }

        if(username) {
            const user = await UserModel.findOne({
                username,
                email
            })

            if(!user) {
                return ServerResponse({
                    success: false,
                    message: API_ERROR_MESSAGE.INVALID_USERNAME_EMAIL,
                    status: STATUS_CODES.NOT_FOUND
                })
            }
        }
        const emailResponse = await sendEmail({
            to: process.env.MAIL_USER!,
            subject: "AskAnon Query Mail - Contact Us",
            content: contactUsTemplate({
                name,
                email,
                message,
                isExistingUser,
                username,
                phone
            }),
        });

        if (!emailResponse.success) {
            return ServerResponse({
                success: false,
                message: API_ERROR_MESSAGE.CONTACT_US_ERROR,
                status: STATUS_CODES.INTERNAL_SERVER_ERROR,
            });
        }

        return ServerResponse({
            success: true,
            message: API_SUCCESS_MESSAGE.CONTACT_US,
            status: STATUS_CODES.OK
        })

    } catch (error) {
        return ServerResponse({
            success: false,
            message: API_ERROR_MESSAGE.CONTACT_US_ERROR,
            status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        });
    }
}