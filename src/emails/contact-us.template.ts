export const contactUsTemplate = ({
    name,
    email,
    message,
    isExistingUser,
    username,
    phone,
}: {
    name: string;
    email: string;
    message: string;
    isExistingUser: boolean;
    username?: string;
    phone?: string;
}) => {
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
            .list {
                list-style-type: none;
                text-align: left;
            }
            .user-message {
                text-align: left
            }
        </style>
    </head>

    <body>
        <div class="container">
            <div class="logo-container">
                <a href="${process.env.DOMAIN}" class="logo">AskAnon</a>
            </div>
            <div class="message">AskAnon User Query</div>
            <div class="body">
                <p>Dear Admin,</p>
                <ul class="list">
                    <li>name: ${name}</li>
                    <li>email: ${email}</li>
                    <li>Existing User: ${isExistingUser}</li>
                    <li>username: ${username || "N/A"}</li>
                    <li>phone: ${phone || "N/A"}</li>
                </ul>
                <p class="user-message">
                    message: ${message}
                </p>
            </div>
        </div>
    </body>
</html>
`;
};
