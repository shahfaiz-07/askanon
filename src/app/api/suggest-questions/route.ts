import { STATUS_CODES } from "@/constants";
import { ServerResponse } from "@/util/response";
import { google, createGoogleGenerativeAI } from "@ai-sdk/google";
// import { GoogleGenerativeAIError } from "@google/generative-ai";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
const model = google(process.env.GEN_AI_MODEL!);
export const maxDuration = 30;

export async function POST(req: Request) {

    const prompt =
        "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment. Also try to suggest questions different from the one suggested please.";
    try {
        const result = streamText({
            model,
            prompt,
        });
    
        return result.toDataStreamResponse();
    } catch (error: any) {
        console.log(`ERROR occured in genrating suggestions :: `, error);
        return ServerResponse({
            success: false,
            message: error?.message || "Error while suggesting messages",
            status: STATUS_CODES.INTERNAL_SERVER_ERROR
        })
    }
}
