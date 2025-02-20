import { DOCUMENT_EXPIRY_TIME } from '@/constants';
import { AvatarVariantTypes } from '@/types/avatar.type';
import mongoose, {Schema, Document} from 'mongoose'

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string | undefined;
    verifyCodeExpiry: Date | undefined;
    passwordToken: string | undefined;
    passwordTokenExpiry: Date | undefined;
    deleteAt: Date | undefined;
    isVerified: boolean;
    isAcceptingQuestions: boolean;
    firstname: string;
    lastname: string;
    avatar: AvatarVariantTypes;
    bio?: string;
}

const userSchema: Schema<User> = new Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            trim: true,
            unique: [true, "Username already taken"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            unique: [true, "Email already exists"],
            match: [
                /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi,
                "Please enter a valid email address!!",
            ],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        verifyCode: String,
        verifyCodeExpiry: Date,
        passwordToken: String,
        passwordTokenExpiry: Date,
        deleteAt: {
            type: Date,
            default: () => new Date(Date.now() + DOCUMENT_EXPIRY_TIME),
            index: {
                expires: 0,
            },
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        isAcceptingQuestions: {
            type: Boolean,
            default: true,
        },
        firstname: {
            type: String,
            required: [true, "First name is required"],
            trim: true,
        },
        lastname: {
            type: String,
            trim: true,
            default: "",
        },
        avatar: {
            type: String,
            default: AvatarVariantTypes.beam
        },
        bio: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);
const UserModel =
    mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User", userSchema);

export default UserModel;