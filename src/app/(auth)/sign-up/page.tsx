"use client";
import React, { useEffect, useState } from "react";
import { useDebounceCallback, useDebounceValue } from "usehooks-ts";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { signupSchema } from "@/schemas/signup.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse.type";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CircleCheck, CircleX, Loader } from "lucide-react";
import Link from "next/link";

const Page = () => {
    const [username, setUsername] = useState<string>("");
    const [isUsernameValid, setIsUsernameValid] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [isCheckingUsername, setIsCheckingUsername] =
        useState<boolean>(false);
    const [usernameMessage, setUsernameMessage] = useState<string>("");

    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            username: "",
            firstname: "",
            lastname: "",
            email: "",
            password: "",
        },
    });

    const debounced = useDebounceCallback(setUsername, 500);

    useEffect(() => {
        const checkUsernameValidity = async () => {
            if (username) {
                setIsCheckingUsername(true);
                setUsernameMessage("");
                try {
                    const response = await axios.get<ApiResponse>(
                        `/api/check-username?username=${username}`
                    );
                    setUsernameMessage(response.data.message);
                    if (response.data.success) {
                        setIsUsernameValid(true);
                    } else {
                        setIsUsernameValid(false);
                    }
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    setUsernameMessage(
                        axiosError.response?.data.message ??
                            "Error checking username validity !!"
                    );
                    setIsUsernameValid(false);
                }

                setIsCheckingUsername(false);
            }
        };
        checkUsernameValidity();
    }, [username]);

    console.log(isUsernameValid || loading);

    const onSubmit = async (data: z.infer<typeof signupSchema>) => {
        setLoading(true);

        try {
            const response = await axios.post<ApiResponse>(
                "/api/sign-up",
                data
            );
            if (response.data.success) {
                toast({
                    title: "Sign-up Successfull",
                    description: response.data.message,
                });
                router.replace(`/verify/${data.username}`);
            } else {
                toast({
                    title: "Sign-up Failed",
                    description: response.data.message,
                    variant: "destructive",
                });
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "Sign-up Failed",
                description:
                    axiosError.response?.data.message ||
                    "Error during sign-up, please try again later",
                variant: "destructive",
            });
        }
        setLoading(false);
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="w-full max-w-md p-8 space-y-5 rounded-lg shadow-md my-8 border">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        {" "}
                        Join{" "}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                            AskAnon
                        </span>
                    </h1>
                    <p className="mb-4">
                        Sign up to start your anonymous adventure
                    </p>
                </div>
                <div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-3"
                        >
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="username"
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    debounced(e.target.value);
                                                }}
                                            />
                                        </FormControl>
                                        {isCheckingUsername ? (
                                            <div className="flex justify-end">
                                                <Loader
                                                    size={12}
                                                    className="animate-spin"
                                                />
                                            </div>
                                        ) : username ? (
                                            isUsernameValid ? (
                                                <div className="flex justify-end space-x-2 items-center text-green-500 ">
                                                    <p className="text-xs">
                                                        Username available{" "}
                                                    </p>
                                                    <CircleCheck size={12} />
                                                </div>
                                            ) : (
                                                <div className="flex justify-end space-x-2 items-center text-red-500 ">
                                                    <p className="text-xs">
                                                        {usernameMessage}
                                                    </p>
                                                    <CircleX size={12} />
                                                </div>
                                            )
                                        ) : (
                                            <></>
                                        )}

                                        <FormDescription>
                                            This is a public username
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="firstname"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Firstname</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="firstname"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lastname"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Lastname</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="lastname(optional)"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="email@domain.com"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
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
                                disabled={!isUsernameValid || loading}
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
                    <div className="text-center mt-4">
                        <p>
                            Already a member?{" "}
                            <Link
                                href="/login"
                                className="text-blue-600 hover:text-blue-800"
                            >
                                Login
                            </Link>
                        </p>
                        <p>
                            Need help?{" "}
                            <Link
                                href="/contact-us"
                                className="text-blue-600 hover:text-blue-800"
                            >
                                Contact Us
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;
