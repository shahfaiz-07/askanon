"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { KeyRound, Loader } from "lucide-react";
import Link from "next/link";
import { loginSchema } from "@/schemas/login.schema";
import { signIn } from "next-auth/react";

export default function Wrapper() {
    return <Suspense fallback={<div>Loading...</div>}>
        <Page/>
    </Suspense>
}

const Page = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [googleLoading, setGoogleLoading] = useState<boolean>(false);
    const { toast } = useToast();

    const searchParams = useSearchParams()
    const query = searchParams.get("error")

    useEffect(() => {
        if (query === "Configuration") {
            toast({
                title: "Google Login Failed",
                description: "Possible cause: Email Not Registered",
                variant: "destructive",
            });
        }
    }, [query, searchParams])

    const router = useRouter();

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            identifier: "",
            password: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof loginSchema>) => {
        setLoading(true);
        const result = await signIn("credentials", {
            redirect: false,
            identifier: data.identifier,
            password: data.password,
        });

        if (result?.error) {
            if (result.error === "CredentialsSignin") {
                toast({
                    title: "Login Failed",
                    description: result.code,
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Login Failed",
                    description: result.error,
                    variant: "destructive",
                });
            }
        }

        if (result?.url) {
            router.replace('/dashboard')
            window.location.reload()
            toast({
                title: "Login Successful",
                description: "Successfully logged in to your Askanon account",
            });
        }
        setLoading(false);
    };

    const handleGoogleLogin = async() => {
        setGoogleLoading(true);
        const result = await signIn("google", {
            redirect: false
        })

        if(result?.error) {
            toast({
                title: "Login Failed",
                description: result.error,
                variant: "destructive",
            });
        }

        if (result?.url) {
            router.replace("/dashboard");
            toast({
                title: "Login Successful",
                description: "Successfully logged in to your Askanon account",
            });
        }
        setGoogleLoading(false);
    }

    return (
        <div className="flex justify-center items-center min-h-[90vh]">
            <div className="w-full max-w-sm sm:max-w-md p-6 md:p-8 space-y-5 rounded-lg shadow-md my-8 border mx-2">
                <div className="text-center">
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                            AskAnon
                        </span>{" "}
                        Login
                    </h1>
                </div>
                <div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="gap-y-3 flex flex-col items-center"
                        >
                            <FormField
                                control={form.control}
                                name="identifier"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Email or Username</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Email or Username"
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
                                    <FormItem className="w-full">
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
                                disabled={loading}
                                className="mt-3"
                            >
                                {loading ? (
                                    <Loader className="animate-spin" />
                                ) : (
                                    <span className="flex gap-x-2 items-center">
                                        <KeyRound strokeWidth={2}/>{" "}
                                        <span>Sign In with Credentials</span>
                                    </span>
                                )}
                            </Button>
                        </form>
                    </Form>
                    <div className="flex justify-center items-center mt-4">
                        <Button
                            variant={"outline"}
                            onClick={handleGoogleLogin}
                            className="px-4"
                        >
                            {googleLoading ? (
                                <Loader className="animate-spin"/>
                            ) : (
                                <div className="flex gap-x-2 items-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        x="0px"
                                        y="0px"
                                        width="100"
                                        height="100"
                                        viewBox="0 0 48 48"
                                    >
                                        <path
                                            fill="#FFC107"
                                            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                                        ></path>
                                        <path
                                            fill="#FF3D00"
                                            d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                                        ></path>
                                        <path
                                            fill="#4CAF50"
                                            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                                        ></path>
                                        <path
                                            fill="#1976D2"
                                            d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                                        ></path>
                                    </svg>{" "}
                                    Sign in with Google
                                </div>
                            )}
                        </Button>
                    </div>
                    <div className="text-xs sm:text-sm md:text-base text-center mt-4">
                        <p>
                            Don't have an account?{" "}
                            <Link
                                href="/sign-up"
                                className="text-blue-600 hover:text-blue-800"
                            >
                                Sign-up
                            </Link>
                        </p>
                        <p>
                            Forgot Password? Reset{" "}
                            <Link
                                href="/forgot-password"
                                className="text-blue-600 hover:text-blue-800"
                            >
                                here.
                            </Link>
                        </p>
                        <p>
                            Account not verified? Request{" "}
                            <Link
                                href="/request-verification"
                                className="text-blue-600 hover:text-blue-800"
                            >
                                here.
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
