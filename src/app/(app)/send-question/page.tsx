"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/ApiResponse.type";
import axios, { AxiosError } from "axios";
import { Loader, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react"; // Import Suspense
import { useCompletion } from "@ai-sdk/react";
import Link from "next/link";

const parseStringMessages = (messageString: string): string[] => {
    return messageString.split("||");
};

const initialMessageString =
    "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function CardWithFormWrapper() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CardWithForm />
        </Suspense>
    );
}

function CardWithForm() {
    const searchParams = useSearchParams();
    const [username, setUsername] = useState<string>(
        searchParams.get("u") || ""
    );
    const [question, setQuestion] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const { complete, completion, error, isLoading } = useCompletion({
        api: "/api/suggest-questions",
        initialCompletion: initialMessageString,
    });

    const handleMessageClick = (message: string) => {
        setQuestion(message);
    };

    const onSubmit = async () => {
        setLoading(true);
        try {
            const response = await axios.post<ApiResponse>(
                "/api/send-question",
                {
                    username,
                    question,
                }
            );

            if (!response.data.success) {
                toast({
                    title: "Error",
                    description: response.data.message,
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Action success",
                    description: response.data.message,
                });
                setQuestion("");
                setUsername(searchParams.get("u") || "");
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "Error",
                description:
                    axiosError.response?.data.message ??
                    "Error sending question",
                variant: "destructive",
            });
        }
        setLoading(false);
    };

    const suggestQuestions = async () => {
        try {
            complete("");
        } catch (error) {
            toast({
                title: "Action Failed",
                description: "Failed to get suggested messages",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen mb-5">
            <Card className="max-w-[500px] lg:mt-20 border">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold mb-2">
                        Ask anyone, anything, anonymously
                    </CardTitle>
                    <CardDescription>
                        Ask your friend, family or any other personality in the
                        world anything. Don't worry they won't be knowing it's
                        you.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Username</Label>
                                <Input
                                    id="name"
                                    placeholder="AskAnon username of the receiver"
                                    value={username}
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                    }}
                                />
                                <p className="text-sm text-muted-foreground pb-3">
                                    You can send question to admin's profile
                                    through{" "}
                                    <Link href={"/profile/admin"}>@admin</Link>{" "}
                                    or anyone of the test accounts{" - "}
                                    <Link href={"/profile/one"}>@one</Link>
                                    {", "}
                                    <Link href={"/profile/two"}>@two</Link>
                                    {", "}
                                    <Link href={"/profile/three"}>@three</Link>
                                </p>
                                <div className="grid w-full gap-1.5 pt-2">
                                    <Label htmlFor="message-2">
                                        Your Question
                                    </Label>
                                    <Textarea
                                        maxLength={300}
                                        placeholder="Type your question here(max 300 characters)."
                                        id="message-2"
                                        value={question}
                                        onChange={(e) => {
                                            setQuestion(e.target.value);
                                        }}
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        Your question will be copied to the
                                        receiver. Make it short and interesting.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col space-y-1.5"></div>
                        </div>
                    </form>
                    <div>
                        <Button onClick={suggestQuestions} disabled={isLoading}>
                            {isLoading ? (
                                <Loader className="animate-spin" />
                            ) : (
                                "Suggest Questions"
                            )}
                        </Button>
                        <div className="flex flex-col gap-y-3 mt-5">
                            {error ? (
                                <p className="text-red-500">{error.message}</p>
                            ) : (
                                parseStringMessages(completion).map(
                                    (message, index) =>
                                        message && (
                                            <div
                                                key={index}
                                                className="block w-full text-wrap text-sm border px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-center rounded"
                                                onClick={() =>
                                                    handleMessageClick(message)
                                                }
                                            >
                                                {message}
                                            </div>
                                        )
                                )
                            )}
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setQuestion("")}>
                        Clear
                    </Button>
                    <Button onClick={onSubmit}>
                        {!loading ? (
                            "Send"
                        ) : (
                            <Loader2 className="animate-spin" />
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
