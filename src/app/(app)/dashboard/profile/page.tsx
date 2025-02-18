"use client";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { ApiResponse, UserResponseType } from "@/types/ApiResponse.type";
import axios, { AxiosError } from "axios";
import { Loader, Lock, Pencil } from "lucide-react";
import React, { useEffect, useState } from "react";
import Avatar from 'boring-avatars'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AvatarVariantTypes } from "@/types/avatar.type";
import { Badge } from "@/components/ui/badge";


const Page = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [profileData, setProfileData] = useState<UserResponseType | null>(
        null
    );
    const [isEditable, setIsEditable] = useState<boolean>(false);
    const [isAvatarEditable, setIsAvatarEditable] = useState<boolean>(false);

    const fetchUserData = async () => {
        setLoading(true);
        try {
            const response = await axios.get<ApiResponse>("/api/user-profile");
            if (!response.data.success) {
                toast({
                    title: "Error",
                    description: response.data.message,
                    variant: "destructive",
                });
            } else {
                setProfileData(response.data.data?.user || null);
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: "Error",
                description:
                    axiosError.response?.data.message ??
                    "Failed to fetch user profile data",
                variant: "destructive",
            });
        }
        setLoading(false);
    };
    const updateUserProfileData = async () => {
        setLoading(true);
        try {
            console.log("Inside profile updation");
            const response = await axios.post<ApiResponse>(
                "/api/user-profile",
                {
                    firstname: profileData?.firstname,
                    lastname: profileData?.lastname,
                    bio: profileData?.bio,
                    avatar: profileData?.avatar
                }
            );

            if (!response.data.success) {
                toast({
                    title: "Validation Error",
                    description: response.data.message,
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Action Success",
                    description: response.data.message,
                });
                setIsEditable(() => false);
                setIsAvatarEditable(() => false)
                setTimeout(()=>{window.location.reload();}, 1000)
                
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "Error",
                description:
                    axiosError.response?.data.message ??
                    "Failed to update user profile data",
                variant: "destructive",
            });
        }
        setIsEditable(false);
        setIsAvatarEditable(false);
        setLoading(false);
    };
    useEffect(() => {
        fetchUserData();
    }, []);
    return (
        <div className="">
            {loading || !profileData ? (
                <div className="flex gap-x-2 items-center justify-center min-h-screen">
                    <p>Loading</p>
                    <Loader className="animate-spin" />
                </div>
            ) : (
                <Tabs
                    defaultValue="account"
                    className="max-w-[400px] mx-auto my-5"
                >
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="account">Account</TabsTrigger>
                        <TabsTrigger value="avatar">Avatar</TabsTrigger>
                    </TabsList>
                    <TabsContent value="account">
                        <Card>
                                <CardHeader>
                                    <CardTitle>Account</CardTitle>
                                    <CardDescription>
                                        Make changes to your account here. Click
                                        save when you're done.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="space-y-1 flex items-center justify-end space-x-2 w-full">
                                        <Switch
                                            id="airplane-mode"
                                            checked={isEditable}
                                            onCheckedChange={(e) => {
                                                setIsEditable(e);
                                            }}
                                        />
                                        <Label htmlFor="airplane-mode">
                                            Edit
                                        </Label>
                                        <Pencil className="w-3 h-3" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label
                                            htmlFor="username"
                                            className="flex space-x-1 items-center"
                                        >
                                            <span>Username</span>{" "}
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <Lock
                                                            className="w-3 h-3"
                                                            strokeWidth={3}
                                                        />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>
                                                            Username cannot be
                                                            changed
                                                        </p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </Label>
                                        <Input
                                            id="username"
                                            value={profileData.username}
                                            readOnly
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label
                                            htmlFor="email"
                                            className="flex space-x-1 items-center"
                                        >
                                            <span>Email</span>{" "}
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <Lock
                                                            className="w-3 h-3"
                                                            strokeWidth={3}
                                                        />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>
                                                            Email cannot be
                                                            changed
                                                        </p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </Label>
                                        <Input
                                            id="email"
                                            value={profileData.email}
                                            readOnly
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="firstname">
                                            First Name
                                        </Label>
                                        <Input
                                            id="firstname"
                                            value={profileData.firstname}
                                            onChange={(e) => {
                                                setProfileData((prev) =>
                                                    prev
                                                        ? {
                                                              ...prev,
                                                              firstname:
                                                                  e.target
                                                                      .value,
                                                          }
                                                        : null
                                                );
                                            }}
                                            readOnly={!isEditable}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="lastname">
                                            Last Name
                                        </Label>
                                        <Input
                                            id="lastname"
                                            value={profileData.lastname}
                                            onChange={(e) => {
                                                setProfileData((prev) =>
                                                    prev
                                                        ? {
                                                              ...prev,
                                                              lastname:
                                                                  e.target
                                                                      .value,
                                                          }
                                                        : null
                                                );
                                            }}
                                            readOnly={!isEditable}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="bio">Bio</Label>
                                        <Textarea
                                            id="bio"
                                            value={profileData.bio}
                                            onChange={(e) => {
                                                setProfileData((prev) =>
                                                    prev
                                                        ? {
                                                              ...prev,
                                                              bio: e.target
                                                                  .value,
                                                          }
                                                        : null
                                                );
                                            }}
                                            rows={5}
                                            readOnly={!isEditable}
                                            placeholder="Your account bio, tell the world about yourself"
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        disabled={!isEditable}
                                        onClick={updateUserProfileData}
                                    >
                                        Save changes
                                    </Button>
                                </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="avatar">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-5">
                                    <span>Avatar Builder</span>{" "}
                                    <Badge>Beta</Badge>
                                </CardTitle>
                                <CardDescription>
                                    Build or edit your own custom avatar here.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="space-y-1 flex items-center justify-end space-x-2 w-full">
                                    <Switch
                                        id="avatar-edit"
                                        checked={isAvatarEditable}
                                        onCheckedChange={(e) => {
                                            setIsAvatarEditable(e);
                                        }}
                                    />
                                    <Label htmlFor="avatar-edit">Edit</Label>
                                    <Pencil className="w-3 h-3" />
                                </div>
                                <div className="space-y-1">
                                    <Avatar
                                        name={profileData.firstname + profileData.lastname}
                                        variant={profileData.avatar || "beam"}
                                        size={150}
                                        className="mx-auto"
                                    />
                                </div>
                                {isAvatarEditable && (
                                    <div className="space-y-1 flex flex-col justify-center items-center gap-y-1 pt-3">
                                        <Label className="font-bold">
                                            Avatar Variant
                                        </Label>
                                        <Select
                                            defaultValue={
                                                profileData.avatar || "beam"
                                            }
                                            onValueChange={(value) => {
                                                setProfileData((prev) =>
                                                    prev
                                                        ? {
                                                              ...prev,
                                                              avatar: value as AvatarVariantTypes,
                                                          }
                                                        : null
                                                );
                                            }}
                                        >
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Select an avatar variant" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>
                                                        Avatar Variant
                                                    </SelectLabel>
                                                    {Object.values(
                                                        AvatarVariantTypes
                                                    ).map((e) => (
                                                        <SelectItem
                                                            value={e}
                                                            key={e}
                                                        >
                                                            {e}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter>
                                <Button
                                    disabled={!isAvatarEditable}
                                    onClick={updateUserProfileData}
                                >
                                    Save changes
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            )}
        </div>
    );
};

export default Page;
