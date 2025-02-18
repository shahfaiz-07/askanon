import connect from "@/config/db.config";
import { API_ERROR_MESSAGE, API_SUCCESS_MESSAGE, STATUS_CODES } from "@/constants";
import UserModel from "@/models/user.model";
import { ServerResponse } from "@/util/response";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs'
import { sendEmail } from "@/util/mailer";
import { signupSchema } from "@/schemas/signup.schema";
import { emailVerificationTemplate } from "@/emails/verification.template";


export async function POST(request: NextRequest) {
    await connect()

    try {
        const {email, username, password, firstname, lastname} = await request.json();

        const result = signupSchema.safeParse({
            email, username, password, firstname, lastname
        });

        const existingUserEmail = await UserModel.findOne({email})

        if(existingUserEmail) {
            return ServerResponse({
                success: false,
                message: API_ERROR_MESSAGE.EXISTING_EMAIL,
                status: STATUS_CODES.CONFLICT
            })
        }
        const existingUsername = await UserModel.findOne({username})

        if (existingUsername) {
            return ServerResponse({
                success: false,
                message: API_ERROR_MESSAGE.EXISTING_USERNAME,
                status: STATUS_CODES.CONFLICT,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verifyCode = Math.floor(100000 + Math.random()*900000).toString()
        const verifyCodeExpiry = new Date(Date.now() + 3600000)

        const user = new UserModel({
            email,
            username,
            password: hashedPassword,
            verifyCode,
            verifyCodeExpiry,
            firstname,
            lastname: lastname || "",
        });

        await user.save()
        
        const emailResponse = await sendEmail({
            to: email,
            subject: "AskAnon Email Verification",
            content: emailVerificationTemplate({
                otp: verifyCode,
                username
            })
        })

        if(!emailResponse.success) {
            return ServerResponse({
                success: false,
                message: API_ERROR_MESSAGE.MAIL_ERROR_VERIFY,
                status: STATUS_CODES.INTERNAL_SERVER_ERROR
            })
        }

        return ServerResponse({
            success: true,
            message: API_SUCCESS_MESSAGE.SIGN_UP_SUCCESS,
            status: STATUS_CODES.CREATED,
        })

    } catch (error) {
        console.log(`ERROR in signup...`, error);
        return ServerResponse({
            success: false,
            message: API_ERROR_MESSAGE.SIGN_UP_ERROR,
            status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        });
    }
}