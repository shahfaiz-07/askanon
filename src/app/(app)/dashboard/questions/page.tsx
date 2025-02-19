"use client";
import QuestionsPreview from "@/components/QuestionsPreview";
import { toast } from "@/hooks/use-toast";
import { ApiResponse, QuestionType } from "@/types/ApiResponse.type";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import axios, { AxiosError } from "axios";
import { Loader } from "lucide-react";
import React, { useEffect, useState } from "react";

const Page = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [allQuestions, setAllQuestions] = useState<QuestionType[]>([]);

    useEffect(() => {
        const fetchUserQuestions = async () => {
            setLoading(true);
            try {
                const response = await axios.get<ApiResponse>(
                    "/api/get-questions-received"
                );
                if (!response.data.success) {
                    toast({
                        title: "Error",
                        description: response.data.message,
                        variant: "destructive",
                    });
                } else {
                    setAllQuestions(response.data.data?.questions || []);
                    setQuestions(response.data.data?.questions || []);
                }
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>;
                toast({
                    title: "Error",
                    description:
                        axiosError.response?.data.message ??
                        "Error fetching questions received",
                    variant: "destructive",
                });
            }
            setLoading(false);
        };
        fetchUserQuestions();
    }, []);

    const onSelectChange = (value: string) => {
        if (value === "all") {
            setQuestions(allQuestions);
        } else if (value === "answered") {
            setQuestions(allQuestions.filter((q) => q.isAnswered === true));
        } else if (value === "not answered") {
            console.log("not answered");
            setQuestions(allQuestions.filter((q) => q.isAnswered === false));
        }
    };

    return loading ? (
        <div className="flex items-center justify-center min-h-[90vh]">
            <Loader className="animate-spin" />
        </div>
    ) : allQuestions && allQuestions.length > 0 ? (
        <div className="min-h-[90vh] mb-5">
            <div className="flex justify-between items-center p-5 md:px-10 lg:px-14">
                <h1 className="text-lg sm:text-xl md:text-3xl font-bold ">
                    Questions
                </h1>
                <Select onValueChange={onSelectChange}>
                    <SelectTrigger className="w-[180px] md:w-[280px]">
                        <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem
                                value="all"
                                defaultChecked
                                className="text-xs md:text-sm"
                            >
                                All
                            </SelectItem>
                            <SelectItem
                                value="not answered"
                                className="text-xs md:text-sm"
                            >
                                Not Answered
                            </SelectItem>
                            <SelectItem
                                value="answered"
                                className="text-xs md:text-sm"
                            >
                                Answered
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-1">
                {questions.map((q) => (
                    <QuestionsPreview
                        key={q._id}
                        question={q.question}
                        createdAt={q.createdAt}
                        updatedAt={q.updatedAt}
                        answer={q.answer}
                        isAnswered={q.isAnswered}
                        quesId={q._id}
                        variant="received"
                    />
                ))}
            </div>
        </div>
    ) : (
        <div className="flex items-center justify-center min-h-[90vh] p-4">
            <h1 className="max-w-[500px]">
                No questions in your inbox. Share your AskAnon public account
                link to receive questions. And don't forget to set the Accept
                Questions Flag
            </h1>
        </div>
    );
};

export default Page;
