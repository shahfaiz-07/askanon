type emailVerificationProps = {
    otp: string;
    username: string;
}
export const emailVerificationTemplate = ({otp , username}: emailVerificationProps) => {
    return `<!DOCTYPE html>
	<html>
	
	<head>
		<meta charset="UTF-8">
		<title>OTP Verification Email</title>
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
	
			.cta {
				display: inline-block;
				padding: 10px 20px;
				background-color: #FFD60A;
				color: #000000;
				text-decoration: none;
				border-radius: 5px;
				font-size: 16px;
				font-weight: bold;
				margin-top: 20px;
			}
	
			.support {
				font-size: 14px;
				color: #999999;
				margin-top: 20px;
			}
	
			.highlight {
				font-weight: bold;
			}

            .link {
                background-color: royalblue;
                padding: 15px 30px;
                color: white;
                border-radius: 5px;
                text-decoration: none;
                font-size: 25px;
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
			<div class="message">OTP Verification Email</div>
			<div class="body">
				<p>Dear User,</p>
				<p>Thank you for registering with AskAnon. To complete your registration, please use the following OTP
					(One-Time Password) to verify your account:</p>
				<h2 class="highlight">${otp}</h2>
				<p>This OTP is valid for 1 hour. If you did not request this verification, please disregard this email.
				Once your account is verified, you will have access to our platform and its features. Click on the below link to continue the verification process.</p>

                <a href="${process.env.DOMAIN}/verify/${username}" class="link">Verify Email</a>
			</div>
			<div class="support">If you have any questions or need assistance, please feel free to reach out to us at <a
					href="mailto:askanon.owner@gmail.com">askanon.owner@gmail.com</a>. We are here to help!</div>
		</div>
	</body>
	
	</html>`;
};
