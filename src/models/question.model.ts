import mongoose, { Document, Schema } from "mongoose";

export interface Question extends Document {
    from: Schema.Types.ObjectId,
    to: Schema.Types.ObjectId,
    question: string,
    answer?: string,
    isAnswered: boolean
}

const questionSchema: Schema<Question> = new Schema({
    from: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    to: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    question: {
        type: String,
        required: [true, "Question content is required"],
        trim: true
    },
    answer: {
        type: String,
        trim: true
    },
    isAnswered: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

const QuestionModel = mongoose.models.Question as mongoose.Model<Question> || mongoose.model<Question>("Question", questionSchema)

export default QuestionModel