"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { contactSchema } from "@/schemas/contactUs.schema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse.type";


export default function ContactForm() {
    const [loading, setLoading] = useState(false);
    const [isExistingUser, setIsExistingUser] = useState(false);

    const form = useForm({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            name: "",
            email: "",
            message: "",
            isExistingUser: false,
            username: "",
            phone: ""
        },
    });

    const onSubmit = async (data: z.infer<typeof contactSchema>) => {
        setLoading(true);
        try {
            const response = await axios.post<ApiResponse>('/api/contact-us', data)

            toast({
                title: "Action Success",
                description: response.data.message
            })
            
            form.reset()
            setIsExistingUser(false)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;

            toast({
                title: "Action Failed",
                description: axiosError.response?.data.message ?? "Failed to send feedback/query",
                variant: "destructive"
            })
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="w-full max-w-md p-8 space-y-5 rounded-lg shadow-md my-8 border">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Contact{" "}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                            Us
                        </span>
                    </h1>
                    <p className="mb-4">We&apos;d love to hear from you</p>
                </div>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-3"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Your Name"
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
                                            placeholder="Your Email"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="Your Phone Number (optional)"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Message</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Your Message"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isExistingUser"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={() => {
                                                    setIsExistingUser(!field.value);
                                                    field.onChange(!field.value);
                                                }}
                                            />
                                            <FormLabel>
                                                Existing User?
                                            </FormLabel>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {isExistingUser && (
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>AskAnon Username</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Your AskAnon Username"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full"
                        >
                            {loading ? "Sending..." : "Send Message"}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}
