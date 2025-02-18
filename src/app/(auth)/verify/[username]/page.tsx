"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "@/hooks/use-toast";
import { verifySchema } from "@/schemas/verify.schema";
import { useState } from "react";
import { Loader } from "lucide-react";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { ApiResponse } from "@/types/ApiResponse.type";

export default function InputOTPForm() {
    const params = useParams<{ username: string }>();

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            verifyCode: "",
        },
    });

    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter();

    async function onSubmit(data: z.infer<typeof verifySchema>) {
        setLoading(true);
        try {
            const response = await axios.post("/api/verify-email", {
                username: params.username,
                ...data,
            });
            if (response.data.success) {
                toast({
                    title: "Verification Successfull",
                    description: response.data.message,
                });
                router.replace(`/login`);
            } else {
                toast({
                    title: "Verification Failed",
                    description: response.data.message,
                    variant: "destructive",
                });
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "Verification Failed",
                description:
                    axiosError.response?.data.message ||
                    "Error during sign-up, please try again later",
                variant: "destructive",
            });
        }
        setLoading(false);
    }

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="w-full max-w-md p-8 space-y-5 rounded-lg shadow-md border">
                <h1 className="text-lg font-extrabold tracking-tight lg:text-2xl mb-6">
                    {" "}
                    AskAnon Email Verification
                </h1>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6 flex flex-col items-center justify-center"
                    >
                        <FormField
                            control={form.control}
                            name="verifyCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>One-Time Password</FormLabel>
                                    <FormControl>
                                        <InputOTP
                                            maxLength={6}
                                            pattern={"^[0-9]*$"}
                                            {...field}
                                        >
                                            <InputOTPGroup className="mx-auto">
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                                <InputOTPSlot index={2} />
                                                <InputOTPSlot index={3} />
                                                <InputOTPSlot index={4} />
                                                <InputOTPSlot index={5} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                    <FormDescription>
                                        Please enter the one-time password sent
                                        to your email.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={loading}>
                            {loading ? (
                                <Loader className="animate-spin" />
                            ) : (
                                "Submit"
                            )}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}
