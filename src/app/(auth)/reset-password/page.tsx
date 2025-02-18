"use client";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { resetPasswordSchema } from "@/schemas/resetPassword.schema";
import { ApiResponse } from "@/types/ApiResponse.type";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function CardWithFormWrapper() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Page />
        </Suspense>
    );
}

const Page = () => {
    const searchParams = useSearchParams();

    const token = searchParams.get("token");

    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter();

    const form = useForm<z.infer<typeof resetPasswordSchema>>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
        setLoading(true);
        try {
            const response = await axios.post<ApiResponse>(
                "/api/reset-password",
                { ...data, token }
            );
            console.log(response);

            if (response.data.success) {
                toast({
                    title: "Password Changed",
                    description: response.data.message,
                });
                router.replace("/login");
            } else {
                toast({
                    title: "Action Failed",
                    description: response.data.message,
                    variant: "destructive",
                });
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "Action Failed",
                description:
                    axiosError.response?.data.message ||
                    "Failed to update password. Please try again later.",
                variant: "destructive",
            });
        }
        setLoading(false);
    };
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="w-full max-w-md p-8 space-y-5 rounded-lg shadow-md my-8 border">
                <h1 className="text-3xl font-extrabold tracking-tight mb-3">
                    Reset Your Password
                </h1>
                <div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-3"
                        >
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="Set your new password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Confirm New Password
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                disabled={loading}
                                className="mt-4"
                            >
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
        </div>
    );
};
