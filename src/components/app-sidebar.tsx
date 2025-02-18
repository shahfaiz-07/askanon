'use client'
import { Calendar, Home, Inbox, LogOut, MailQuestion, MessageSquareMore, Moon, ScrollText, Search, SendHorizontal, Settings, Sun, UserRoundPen } from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Switch } from "./ui/switch";

// Menu items.
const items = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
    },
    {
        title: "Send Question",
        url: "/send-question",
        icon: SendHorizontal,
    },
    {
        title: "Sent Questions",
        url: "/dashboard/asked-questions",
        icon: ScrollText,
    },
    {
        title: "Received Questions",
        url: "/dashboard/questions",
        icon: MailQuestion,
    },
    {
        title: "Profile",
        url: "/dashboard/profile",
        icon: UserRoundPen,
    },
    {
        title: "Contact Us",
        url: "/contact-us",
        icon: MessageSquareMore,
    },
];

export function AppSidebar() {
    const {setTheme, theme} = useTheme()
    const [darkTheme, setDarkTheme] = useState<boolean>(theme === "dark")
    useEffect(() => {
        setDarkTheme((prev) => theme === "dark")
    }, [theme])
    return (
        <Sidebar side="right">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="flex justify-between items-center">
                        <span>Menu</span>{" "}
                        <SidebarTrigger typeOf={"close"} />
                    </SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                            <SidebarSeparator/>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <div>
                                        {
                                            darkTheme ? <Moon/> : <Sun/>
                                        }
                                        <div className="flex items-center justify-between w-full">
                                            <span>Dark Theme</span>
                                            <Switch checked={darkTheme}
                                            onCheckedChange={() => {
                                                if(darkTheme === false) {
                                                    setTheme("dark")
                                                } else {
                                                    setTheme("light")
                                                }
                                                setDarkTheme((prev) => !prev)
                                            }}/>
                                        </div>
                                    </div>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    onClick={() => {
                                        signOut();
                                    }}
                                    className="cursor-pointer"
                                >
                                    <div>
                                        <LogOut />
                                        <span>Logout</span>
                                    </div>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
