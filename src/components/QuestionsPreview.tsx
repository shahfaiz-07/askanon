import React, { useState } from 'react'
import { BadgeCheck, Copy, Loader, MessageCircleQuestion, MessageSquareText, Send, Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatDistance } from 'date-fns'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { DialogFooter, DialogHeader } from './ui/dialog';
import { Label } from '@radix-ui/react-label';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse.type';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';

type QuestionProps = {
    question: string,
    createdAt: Date,
    updatedAt?: Date,
    answer?: string,
    isAnswered: boolean,
    quesId: string,
    variant: "received" | "asked",
    toUsername?: string
}
const QuestionsPreview = ({
    question, createdAt, updatedAt, answer, isAnswered, quesId, variant, toUsername
}: QuestionProps) => {
    const [localAnswer, setLocalAnswer] = useState<string>(answer || "")
    const [loading, setLoading] = useState<boolean>(false)

    const onSend = async() => {
        setLoading(true)
        if(!localAnswer.trim()) {
            toast({
                title: "Reply empty",
                description: "Write something in the reply field textarea",
                variant: "destructive"
            })
            setLoading(false);
            return
        } 
        try {
            const response = await axios.post<ApiResponse>('/api/send-reply', {
                quesId, answer: localAnswer
            })
            if(!response.data.success) {
                toast({
                    title: "Error",
                    description: response.data.message,
                    variant: "destructive"
                })
            } else {
                toast({
                    title: "Reply Sent",
                    description: response.data.message,
                });
                window.location.reload()
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "Error",
                description:
                    axiosError.response?.data.message ??
                    "Failed to send response",
                variant: "destructive",
            });
        }
        setLoading(false)
    }
  return (
      <div className="mx-2 md:mx-5">
          <Dialog>
              <DialogTrigger asChild>
                  <Alert className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900">
                      <MessageSquareText className="h-5 w-5" />
                      <AlertTitle className="text-ellipsis whitespace-nowrap overflow-x-hidden no-scrollbar">
                          {question}
                      </AlertTitle>
                      <AlertDescription className="flex justify-between items-center mt-2">
                          <div className="text-[10px] md:text-xs flex flex-col">
                              <p
                                  className={`${isAnswered ? "text-green-500" : "text-red-600"} leading-tight font-semibold`}
                              >
                                  {isAnswered ? (
                                      <span className="flex items-center gap-x-2">
                                          <span>Answered</span>{" "}
                                          <BadgeCheck className="inline h-[0.65rem] w-[0.65rem]" />
                                      </span>
                                  ) : (
                                      "Not Answered"
                                  )}
                              </p>
                              {variant === "asked" && toUsername && (
                                  <Link href={`/profile/${toUsername}`} className="leading-tight font-semibold">
                                      Asked From : @{toUsername}
                                  </Link>
                              )}
                          </div>
                          <div className="text-[10px] leading-tight md:text-xs flex flex-col">
                              <div>
                                  {variant === "asked" ? (
                                      <span className="font-bold">Sent : </span>
                                  ) : (
                                      <span className="font-bold">
                                          Received :{" "}
                                      </span>
                                  )}
                                  {formatDistance(
                                      new Date(Date.now()),
                                      createdAt,
                                      {
                                          includeSeconds: true,
                                      }
                                  )}{" "}
                                  ago
                              </div>
                              {isAnswered && (
                                  <div>
                                      {(variant === "asked" && isAnswered) ? (
                                          <span className="font-bold">
                                              Received :{" "}
                                          </span>
                                      ) : (
                                          <span className="font-bold">
                                              Replied :{" "}
                                          </span>
                                      )}
                                      {formatDistance(
                                          new Date(),
                                          updatedAt ?? new Date(),
                                          {
                                              includeSeconds: true,
                                          }
                                      )}{" "}
                                      ago
                                  </div>
                              )}
                          </div>
                      </AlertDescription>
                  </Alert>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                      <DialogTitle>Conversation</DialogTitle>
                      {variant === "asked" && toUsername && (
                          <p className="text-xs font-semibold">@{toUsername}</p>
                      )}
                      <DialogDescription>{question}</DialogDescription>
                  </DialogHeader>
                  <div className="">
                      <div className="grid flex-1 gap-2">
                          <Label htmlFor="link">
                              {variant === "asked" ? "Reply:" : "Your Reply:"}
                          </Label>
                          <Textarea
                              id="link"
                              placeholder={
                                  variant === "received"
                                      ? "Give your reply here"
                                      : "You have not received any answer yet"
                              }
                              value={localAnswer}
                              readOnly={isAnswered || variant === "asked"}
                              onChange={(e) => setLocalAnswer(e.target.value)}
                              className={`${isAnswered || variant === "asked" ? "focus-visible:outline-none cursor-default" : ""}`}
                          />
                      </div>
                  </div>
                  <DialogFooter className="flex justify-between items-center w-full">
                      <DialogClose asChild>
                          <Button type="button" variant="secondary">
                              Close
                          </Button>
                      </DialogClose>
                      {variant === "received" && (
                          <Button
                              type="submit"
                              size="sm"
                              className={`px-3 ${isAnswered ? "hidden" : ""}`}
                              disabled={loading}
                              onClick={onSend}
                          >
                              {loading ? (
                                  <Loader className="animate-spin" />
                              ) : (
                                  <>
                                      Send <Send />
                                  </>
                              )}
                          </Button>
                      )}
                  </DialogFooter>
              </DialogContent>
          </Dialog>
      </div>
  );
}

export default QuestionsPreview