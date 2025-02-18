"use client";
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
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
import { Loader } from "lucide-react";
import Link from "next/link";
import { loginSchema } from "@/schemas/login.schema";
import { signIn } from "next-auth/react";

const Page = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const { toast } = useToast();
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

        console.log(result);

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
            toast({
                title: "Login Successful",
                description: "Successfully logged in to your Askanon account",
            });
            router.push('/dashboard')
        }
        setLoading(false);
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="w-full max-w-md p-8 space-y-5 rounded-lg shadow-md my-8 border">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
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
                            className="space-y-3"
                        >
                            <FormField
                                control={form.control}
                                name="identifier"
                                render={({ field }) => (
                                    <FormItem>
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
                    <div className="text-center mt-4">
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

export default Page;
