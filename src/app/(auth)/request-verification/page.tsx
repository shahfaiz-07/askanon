"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/ApiResponse.type";
import axios, { AxiosError } from "axios";
import { Loader } from "lucide-react";
import React, { useState } from "react";

const Page = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");

    const onSubmit = async () => {
        setLoading(true);
        try {
            const response = await axios.post<ApiResponse>(
                "/api/request-verification",
                {
                    email,
                }
            );
            if (!response.data.success) {
                toast({
                    title: "Action Failed",
                    description: response.data.message,
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Action Success",
                    description: response.data.message,
                });
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "Action Failed",
                description:
                    axiosError.response?.data.message ??
                    "Failed to send verification link",
                variant: "destructive",
            });
        }
        setEmail("");
        setLoading(false);
    };
    return (
        <div className="flex justify-center items-center min-h-[90vh]">
            {loading ? (
                <p className="flex space-x-2">
                    Loading <Loader className="animate-spin" />
                </p>
            ) : (
                <div className="w-full max-w-sm sm:max-w-md p-6 md:p-8 space-y-5 rounded-lg shadow-md my-8 border">
                    <h1 className="text-lg font-extrabold tracking-tight lg:text-2xl">
                        Account Verification
                    </h1>
                    <p className="mb-2 text-xs md:text-sm text-gray-600">
                        Account not verified? We got your back. Enter your email
                        below and we will send you an email with the
                        instructions.
                    </p>
                    <div className="">
                        <Label>Email</Label>
                        <Input
                            id="email"
                            placeholder="Enter your AskAnon email..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button className="mt-5" onClick={onSubmit}>
                            Send Email
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Page;
