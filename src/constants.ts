export const DOCUMENT_EXPIRY_TIME = 3600000*5; // 5h

export const API_ERROR_MESSAGE = {
    SIGN_UP_ERROR: "Error while user signup",
    EXISTING_EMAIL: "Email already exists",
    EXISTING_USERNAME: "Username already taken",
    MAIL_ERROR_VERIFY: "Error sending verification email",
    USER_NOT_FOUND: "User not found",
    VERIFY_ACCOUNT: "Verify your account first",
    MISSING_FIELDS: "All fields are required",
    INVALID_METHOD: "Method not allowed",
    USERNAME_ERROR: "Error validating username",
    EMAIL_VERIFICATION: "Error verifying email",
    TOKEN_INVALID: "Invalid OTP",
    VERIFICATION_EXPIRED:
        "Verification expired. Please request a new one by logging in.",
    UNAUTHENTICATED: "Not Authorized. Login first.",
    USER_MESSAGE_FLAG_UPDATE: "Failed to update accept message flag",
    GET_USER_MESSAGE_FLAG: "Failed to get accept message flag",
    GET_USER_QUESTION: "Failed to fetch questions",
    POST_QUESION: "Failed to post question",
    SEND_REPLY: "Failed to send reply",
    QUES_NOT_FOUND: "Question not found",
    ALREADY_ANSWERED: "Question already answered",
    NOT_ACCEPTING: "User currently not accepting questions",
    VERIFIED: "User already verified",
    INVALID_CREDENTIALS: "Invalid Credentials",
    RECENT_QUESTIONS: "Failed to fetch recent questions",
    EMPTY_REPLY: "Answer field should not be empty",
    GET_USER_DATA: "Failed to fetch user profile data",
    UPDATE_USER_DATA: "Failed to update user profile data",
    FORGOT_PASSWORD: "Failed to send forgot password email",
    EMAIL_NOT_VERIFIED: "Email not verified",
    PASSWORD_NOT_MATCH: "Password and confirm password do not match",
    PASS_TOKEN_INVALID: "Password token is invalid",
    PASS_TOKEN_EXPIRED: "Password token expired. Generate new one by requesting again.",
    PASSWORD_CHANGE: "Failed to changed password",
    MESSAGE_TO_SELF: "You cannot send message to yourself",
    PUBLIC_PROFILE: "Failed to fetch public profile",
    USERNAME_MISMATCH: "Correct username/email is required for your account to continue",
    INVALID_USERNAME_EMAIL: "Invalid username and/or email. User not found.",
    USERNAME_REQUIRED: "Username is required for existing users",
    CONTACT_US_ERROR: "Error while sending feedback/query. Try again later.",
    EMAIL_FOUND: "An account is linked to this email, please provide correct username also to continue.",
    LOGIN_ERROR: "Error while user login"
} as const;

export const API_SUCCESS_MESSAGE = {
    SIGN_UP_SUCCESS: "User registered successfully. Please verify your email.",
    VALID_USERNAME: "Username is available",
    VERIFICATION: "User verification successful",
    USER_MESSAGE_FLAG: "Accepting message flag updated successfully",
    GET_USER_MESSAGE_FLAG: "Accept message flag fetched successfully",
    GET_USER_MESSAGE: "Questions fetched successfully",
    POST_QUESTION: "Question posted successfully",
    SEND_ANSWER: "Reply sent successfully",
    RECENT_QUESTIONS_SENT: "Recent questions fetched successfully",
    GET_USER_DATA: "User data fetch successfully",
    UPDATE_USER_DATA: "User data updated successfully",
    FORGOT_PASSWORD: "Email sent your account",
    PASSWORD_CHANGED: "Password changed successfully",
    VERIFICATION_EMAIL_SENT: "Verification email sent to your account",
    PUBLIC_PROFILE: "Public profile fetched successfully",
    CONTACT_US: "Your message is received. We will contact you soon.",
    LOGIN_SUCCESS: "User logged in successfully"
} as const;

export const STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,

    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    CONFLICT: 409,
    GONE: 410,

    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
} as const;

export const PUBLIC_ROUTES = [
    "/login",
    "/sign-up",
    "/verify",
    "/forgot-password",
    "/reset-password",
    "/request-verification",
] as const;

export const PRIVATE_ROUTES = ["/dashboard", "/send-question"] as const
