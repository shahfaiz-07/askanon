"use client";
import { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { EyeOff, Loader, LogOut, Logs, Menu, Moon, Sun } from "lucide-react";
import Avatar from "boring-avatars";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse.type";
import { AvatarVariantTypes } from "@/types/avatar.type";
import { toast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Skeleton } from "./ui/skeleton";
import { SidebarTrigger, useSidebar } from "./ui/sidebar";
import { useTheme } from "next-themes";

const Navbar = () => {
    const { data: session } = useSession();

    const { toggleSidebar, state } = useSidebar()

    const [loading, setLoading] = useState<boolean>(false)
    const [name, setName] = useState<string>("")
    const [avatarType, setAvatarType] = useState<AvatarVariantTypes>(
        "beam" as AvatarVariantTypes
    );

    const user: User = session?.user;
    const { setTheme } = useTheme()

    useEffect(() => {
        const fetchUserDetails = async () => {
            setLoading(true);
            try {
                const response =
                    await axios.get<ApiResponse>("/api/user-profile");
                if (response.data.success) {
                    setName(
                        response.data.data?.user?.firstname +
                            (response.data.data?.user?.lastname ?? "")
                    );
                    setAvatarType(
                        (response.data.data?.user?.avatar ??
                            "") as AvatarVariantTypes
                    );
                } else {
                    toast({
                        title: "Error",
                        description: response.data.message,
                        variant: "destructive",
                    });
                }
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>;
                toast({
                    title: "Error",
                    description:
                        axiosError.response?.data.message ||
                        "Failed to fetch user details",
                    variant: "destructive",
                });
            }
            setLoading(false);
        };
        if (session && session.user) {
            fetchUserDetails();
        }
    }, [session]);

    return (
        <nav className="p-5 md:px-10 lg:px-14 shadow-lg border-b">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-x-2">
                    <a
                        href="#"
                        className="text-transparent bg-gradient-to-br from-blue-400 to-purple-500 bg-clip-text font-extrabold text-lg sm:text-xl md:text-2xl"
                    >
                        AskAnon
                    </a>
                </div>
                {session ? (
                    <div className="flex space-x-2 items-center">
                        <p className="hidden sm:inline-block">Welcome, {user.username}</p>
                        {loading ? (
                            <Skeleton className="h-[30px] w-[30px] rounded-full" />
                        ) : (
                            <Avatar
                                name={name}
                                variant={avatarType}
                                size={30}
                            />
                        )}
                        <Button
                            onClick={() => toggleSidebar()}
                            variant={"secondary"}
                        >
                            <span className="hidden md:inline-block">Menu</span>
                            <Menu
                                className={`${state === "expanded" ? "rotate-90" : ""}`}
                            />
                        </Button>
                    </div>
                ) : (
                    <div className="flex space-x-2 items-center">
                        <Link href={"/login"}>
                            <Button className="text-xs sm:text-sm">
                                Login
                            </Button>
                        </Link>
                        <Link href={"/sign-up"}>
                            <Button className="text-xs sm:text-sm">
                                Sign Up
                            </Button>
                        </Link>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Sun className="h-[1rem] w-[1rem] md:h-[1.2rem] md:w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                    <Moon className="absolute h-[1rem] w-[1rem] md:h-[1.2rem] md:w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                    <span className="sr-only">
                                        Toggle theme
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onClick={() => setTheme("light")}
                                >
                                    <span className="text-xs md:text-base">
                                        Light
                                    </span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setTheme("dark")}
                                >
                                    <span className="text-xs md:text-base">
                                        Dark
                                    </span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
