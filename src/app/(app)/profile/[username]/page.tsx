"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { ApiResponse, ProfileResponseType } from "@/types/ApiResponse.type";
import axios, { AxiosError } from "axios";
import Avatar from "boring-avatars";
import { formatDistance } from "date-fns";
import { Send } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
    const {data: session} = useSession()
    const params = useParams<{ username: string }>();
    const [loading, setLoading] = useState<boolean>(false);
    const [profileData, setProfileData] = useState<ProfileResponseType | null>(
        null
    );

    const fetchProfileData = async () => {
        setLoading(true);
        try {
            const response = await axios.post<ApiResponse>(
                "/api/public-profile",
                {
                    username: params.username,
                }
            );

            if (!response.data.success) {
                toast({
                    title: "Error",
                    description: "Failed to fetch public profile",
                    variant: "destructive",
                });
            } else {
                setProfileData(response.data.data?.profile || null);
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "Action Failed",
                description:
                    axiosError.response?.data.message ??
                    "Failed to fetch public profile",
            });
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProfileData();
    }, [params]);

    return loading ? (
        <div className="flex flex-col min-h-screen w-full">
            <div className="h-[30vh] bg-gradient-to-br from-blue-500 to-purple-400 w-full">
                <div className="relative top-full -translate-y-[75px] flex-col flex items-center gap-y-3 px-5">
                    <Skeleton className="w-[150px] h-[150px] rounded-full" />
                    <div className="text-center flex flex-col space-y-1 items-center">
                        <Skeleton className="h-[36px] w-[200px]" />
                        <Skeleton className="h-[24px] w-[100px]" />
                    </div>
                    <div className="flex flex-col items-center gap-y-1">
                        <Skeleton className="w-[448px] h-[24px] rounded-lg" />
                        <Skeleton className="w-[224px] h-[24px] rounded-lg" />
                    </div>
                    <div className="flex justify-center">
                        <Skeleton className="w-[100px] h-[16px] rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    ) : profileData !== null ? (
        <div className="flex flex-col min-h-screen w-full">
            <div className="h-[30vh] bg-gradient-to-br from-blue-500 to-purple-400 w-full">
                <div className="relative top-full -translate-y-[75px] flex-col flex items-center gap-y-3 px-5">
                    <Avatar
                        name={
                            profileData.firstname + profileData.lastname || ""
                        }
                        variant={profileData.avatar || "beam"}
                        size={150}
                        className="border-4 border-white rounded-full"
                    />
                    <div className="text-center flex flex-col space-y-1">
                        <p className="text-3xl font-semibold">
                            {profileData.firstname + " " + profileData.lastname}
                        </p>
                        <p className="dark:text-gray-300 text-base">
                            @{profileData.username}
                        </p>
                    </div>
                    {profileData.bio && (
                        <div className="max-w-md text-center">
                            {profileData.bio}
                        </div>
                    )}
                    <div className="">
                        {profileData.isAcceptingQuestions ? (
                            <div className="flex flex-col-reverse gap-y-2 items-center mt-2">
                                {!(
                                    session &&
                                    session.user.username ===
                                        profileData.username
                                ) && (
                                    <Link
                                        href={`/send-question?u=${profileData.username}`}
                                    >
                                        <Button>
                                            Send Question <Send />
                                        </Button>
                                    </Link>
                                )}
                                <Badge className="bg-green-500 text-center cursor-default hover:bg-green-500">
                                    Accepting Questions
                                </Badge>
                            </div>
                        ) : (
                            <Badge variant={"destructive"}>
                                Not Accepting Questions
                            </Badge>
                        )}
                    </div>
                    <div>
                        <Badge variant={"outline"}>
                            Joined:{" "}
                            {formatDistance(
                                new Date(Date.now()),
                                profileData.createdAt,
                                {
                                    includeSeconds: true,
                                }
                            )}{" "}
                            ago
                        </Badge>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-center px-3">
                User not found. Try checking the username.
            </p>
        </div>
    );
};

export default Page;
