"use client"
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { EyeOff } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[90vh] p-2 sm:p-4 md:p-6">
            <motion.h1
                className="text-4xl md:text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                AskAnon
            </motion.h1>
            <p className="text-base md:text-lg mt-2 text-center dark:text-gray-300">
                Ask anynone, anything, anonymously.
            </p>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-6 w-full max-w-md"
            >
                <Card className="bg-white/10 backdrop-blur-lg shadow-lg border p-6">
                    <CardContent className="flex flex-col items-center">
                        <EyeOff className="w-10 h-10 text-blue-400 mb-2" />
                        <h2 className="text-2xl font-semibold">
                            Stay Anonymous
                        </h2>
                        <p className="dark:text-gray-300 text-center mt-1 text-xs sm:text-sm md:text-base">
                            Create account to start your anonymous journey
                            today.
                        </p>
                        <Link href={"/sign-up"}>
                            <Button
                                className="my-4 w-full md:text-lg"
                                variant="default"
                            >
                                Start now
                            </Button>
                        </Link>
                        <p className="text-xs sm:text-sm md:text-base">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="text-blue-600 hover:text-blue-800"
                            >
                                Login.
                            </Link>
                        </p>
                        <p className="text-xs sm:text-sm md:text-base">
                            Need help?{" "}
                            <Link
                                href="/contact-us"
                                className="text-blue-600 hover:text-blue-800"
                            >
                                Contact Us
                            </Link>
                        </p>
                    </CardContent>
                </Card>
            </motion.div>

            <Separator className="my-6 w-1/2 bg-gray-600" />

            <p className="text-sm text-gray-400 mx-2">
                Join thousands of users in open, honest discussions.
            </p>
        </div>
    );
}
