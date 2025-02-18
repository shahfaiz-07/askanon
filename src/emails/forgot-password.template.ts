export const resetPasswordLink = (url: string) => {
    return `<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
        <style>
            body {
                background-color: #ffffff;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.4;
                color: #333333;
                margin: 0;
                padding: 0;
            }

            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
            }

            .logo {
                font-weight: bold;
                font-size: 32px;
                background: linear-gradient(to bottom right, #60a5fa, #a78bfa);
                -webkit-background-clip: text;
                background-clip: text;
                color: transparent;
            }

            .message {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
            }

            .body {
                font-size: 16px;
                margin-bottom: 20px;
            }

            .support {
                font-size: 14px;
                color: #999999;
                margin-top: 20px;
            }

            .highlight {
                font-weight: bold;
            }
            .logo-container {
                text-align: center;
                border-radius: 5px;
                margin-bottom: 10px;
            }
        </style>
    </head>

    <body>
        <div class="container">
            <div class="logo-container">
                <a href="${process.env.DOMAIN}" class="logo">AskAnon</a>
            </div>
            <div class="message">Password Reset Link</div>
            <div class="body">
                <p>Dear User,</p>
                <p>
                    Below is you password reset link for your Askanon Account :
                </p>
                <a href="${url}">${url}</a>
                <p>
                    This link is valid for only 1 hour. Do not share it with
                    anyone. If you did not request this link, please disregard
                    this email.
                </p>
            </div>
            <div class="support">
                If you have any questions or need assistance, please feel free
                to reach out to us at
                <a href="mailto:askanon.owner@gmail.com"
                    >askanon.owner@gmail.com</a
                >. We are here to help!
            </div>
        </div>
    </body>
</html>
`;
};
