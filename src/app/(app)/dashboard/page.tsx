'use client'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/hooks/use-toast'
import { acceptQuestionsSchema } from '@/schemas/acceptQuestions.schema'
import { ApiResponse, QuestionType } from '@/types/ApiResponse.type'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { ChevronsUpDown, Link as LinkIcon, Loader } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const Page = () => {

  const {data: session} = useSession()

  const [loading, setLoading] = useState<boolean>(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false)
  const [isAskedOpen, setIsAskedOpen] = useState<boolean>(false)
  const [isReceivedOpen, setIsReceivedOpen] = useState<boolean>(false)
  const [sentQuestions, setSentQuestions] = useState<QuestionType[]>([])
  const [receivedQuestions, setReceivedQuestions] = useState<QuestionType[]>([])
  
  const { register, watch, setValue } = useForm<
      z.infer<typeof acceptQuestionsSchema>
  >({
      resolver: zodResolver(acceptQuestionsSchema),
  });

  const acceptQuestions = watch('acceptQuestions')

  const handleAcceptQuestionsChange = async() => {
    setLoading(true)
    setIsSwitchLoading(true)
    try {
      const response = await axios.post("/api/accept-questions", {
          acceptQuestions: !acceptQuestions,
      });

      setValue('acceptQuestions', !acceptQuestions)
      toast({
        title: "Action Updated",
        description: !acceptQuestions ? "You can now receive questions" : "You are no longer accepting questions"
      })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
          title: "Error",
          description:
              axiosError.response?.data.message ??
              "Failed to update accepting questions status",
          variant: "destructive",
      });
    }
    setIsSwitchLoading(false)
    setLoading(false)
  }

  const fetchAcceptQuestions = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>("/api/accept-questions");
      if (!response.data.success) {
          toast({
              title: "Error",
              description: response.data.message,
              variant: "destructive",
          });
          return;
      }
      setValue("acceptQuestions", response.data.data?.isAcceptingQuestions || false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message ?? "Failed to fetch accepting questions status",
        variant: "destructive"
      })
    }
    setIsSwitchLoading(false)
  }, [])

  const fetchRecentlySentQuestions = async() => {
    setLoading(true)
    try {
      const response = await axios.get<ApiResponse>('/api/recent-questions-sent')
      console.log('Recently Sent Questions')
      console.log(response)
      if(!response.data.success) {
        toast({
          title: "Error",
          description: response.data.message,
          variant: "destructive"
        })
      } else {
        setSentQuestions(response.data.data?.questions || [])
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
          title: "Error",
          description:
              axiosError.response?.data.message ??
              "Failed to fetch recently sent questions",
          variant: "destructive",
      });
    }
    setLoading(false);
  }

  const fetchRecentlyReceivedQuestions = async() => {
    setLoading(true)
    try {
        const response = await axios.get<ApiResponse>(
            "/api/recent-questions-received"
        );
        if (!response.data.success) {
            toast({
                title: "Error",
                description: response.data.message,
                variant: "destructive",
            });
        } else {
            setReceivedQuestions(response.data.data?.questions || []);
        }
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
            title: "Error",
            description:
                axiosError.response?.data.message ??
                "Failed to fetch recently received questions",
            variant: "destructive",
        });
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchAcceptQuestions()
    fetchRecentlyReceivedQuestions()
    fetchRecentlySentQuestions()
  }, [])

  if (!session || !session.user) return;
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const profileUrl = `${baseUrl}/profile/${session.user.username}`;

  const copyToClipboard = () => {
      navigator.clipboard.writeText(profileUrl);
      toast({
          title: "Copied ✅",
          description: "URL copied to clipboard",
      });
  };
  return loading ? (
      <div className="flex justify-center items-center min-h-[90vh]">
          <p className="flex space-x-2">
              <span>Loading</span>
              <Loader className="animate-spin" />
          </p>
      </div>
  ) : (
      <div className="p-3 sm:p-5 md:px-10 lg:px-14 min-h-[90vh]">
          <div className="text-xl md:text-3xl font-bold mb-5">
              Your Dashboard
          </div>
          <div className="flex items-center space-x-2 lg:justify-between text-sm md:text-base">
              <span>
                  Your Public Profile{" "}
                  <span className="hidden lg:inline-block">:</span>
              </span>
              <input
                  type="text"
                  disabled
                  value={profileUrl}
                  className="flex-grow hidden lg:block px-4 py-2"
              />
              <Button onClick={copyToClipboard}>
                  Copy <LinkIcon />{" "}
              </Button>
          </div>
          <p className="text-xs md:text-sm dark:text-gray-400 mt-2">
              Share it publicly to receive questions
          </p>
          <div className="flex items-center space-x-3 mt-4">
              <Switch
                  id="accept-questions"
                  {...register("acceptQuestions")}
                  disabled={isSwitchLoading}
                  checked={acceptQuestions}
                  onCheckedChange={handleAcceptQuestionsChange}
              />
              <Label htmlFor="accept-questions" className="md:text-lg">
                  Accept Questions
              </Label>
          </div>
          <Separator className="my-4" />
          {sentQuestions.length !== 0 && (
              <div>
                  <Collapsible
                      open={isAskedOpen}
                      onOpenChange={setIsAskedOpen}
                      className="w-full space-y-2"
                  >
                      <div className="flex items-center justify-between space-x-4">
                          <h4 className="font-semibold text-sm md:text-base">
                              <Link href={"/dashboard/asked-question"}>
                                  Recently Asked Questions
                              </Link>
                          </h4>
                          <CollapsibleTrigger asChild>
                              <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-9 p-0"
                              >
                                  <ChevronsUpDown className="h-4 w-4" />
                                  <span className="sr-only">Toggle</span>
                              </Button>
                          </CollapsibleTrigger>
                      </div>
                      <CollapsibleContent className="space-y-2">
                          {sentQuestions.map((q) => (
                              <div key={q._id}>
                                  <div className="rounded-md border px-3 py-2 md:px-4 md:py-3 font-mono">
                                      <p className="text-xs md:text-sm text-ellipsis overflow-hidden whitespace-nowrap">
                                          {q.question}
                                      </p>
                                      <Link
                                          href={`/profile/${q.toUsername}`}
                                          className="text-[10px] md:text-xs"
                                      >
                                          Asked From :{" "}
                                          <span className='font-bold'>@{q.toUsername}</span>
                                      </Link>
                                  </div>
                              </div>
                          ))}
                      </CollapsibleContent>
                  </Collapsible>
                  <Separator className="my-4" />
              </div>
          )}
          {receivedQuestions.length !== 0 && (
              <div>
                  <Collapsible
                      open={isReceivedOpen}
                      onOpenChange={setIsReceivedOpen}
                      className="w-full space-y-2"
                  >
                      <div className="flex items-center justify-between space-x-4">
                          <h4 className="font-semibold text-sm md:text-base">
                              <Link href="/dashboard/questions">
                                  Recently Received Questions
                              </Link>
                          </h4>
                          <CollapsibleTrigger asChild>
                              <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-9 p-0"
                              >
                                  <ChevronsUpDown className="h-4 w-4" />
                                  <span className="sr-only">Toggle</span>
                              </Button>
                          </CollapsibleTrigger>
                      </div>
                      <CollapsibleContent className="space-y-2">
                          {receivedQuestions.map((q) => (
                              <div key={q._id}>
                                  <div className="rounded-md border px-3 py-2 md:px-4 md:py-3 font-mono">
                                      <p className="text-xs md:text-sm text-ellipsis overflow-hidden whitespace-nowrap">
                                          {q.question}
                                      </p>
                                      <p
                                          className={`font-bold text-[10px] md:text-xs ${q.isAnswered ? "text-green-500" : "text-red-700"}`}
                                      >
                                          {q.isAnswered
                                              ? "Answered"
                                              : "Not Answered"}
                                      </p>
                                  </div>
                              </div>
                          ))}
                      </CollapsibleContent>
                  </Collapsible>
                  <Separator className="my-4" />
              </div>
          )}
      </div>
  );
}

export default Page