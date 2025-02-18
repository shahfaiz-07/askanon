import nodemailer from 'nodemailer'

export async function sendEmail({
    to,
    subject,
    content
}: {
    to:string;
    subject:string;
    content: string;
}) {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,
            },
        });
    
        const info = await transporter.sendMail({
            from: `AskAnon <edypros.owner@gmail.com>`,
            to,
            subject,
            html: content
        })
    
        return {
            success: true
        }
    } catch (error) {
        return {
            success: false,
            error
        }
    }
}