'use client'
import QuestionsPreview from '@/components/QuestionsPreview';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { ApiResponse, QuestionType } from '@/types/ApiResponse.type';
import axios from 'axios';
import { Loader } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

const Page = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [questions, setQuestions] = useState<QuestionType[]>([])
  const [allQuestions, setAllQuestions] = useState<QuestionType[]>([])

  useEffect(() => {
    const fetchUserQuestion = async() => {
        setLoading(true)
        
      try {
        const response = await axios.get<ApiResponse>('/api/get-questions-sent')
        if(!response.data.success) {
          toast({
            title: "Error",
            description: response.data.message,
            variant: "destructive"
          })
        } else {
          setAllQuestions(response.data.data?.questions || [])
          setQuestions(response.data.data?.questions || []);
        }
      } catch (error) {
        toast({
            title: "Error",
            description: "Failed to fetch sent questions",
            variant: "destructive",
        });
      }
      setLoading(false);
    }

    fetchUserQuestion()
  }, [])

  const onSelectChange = (value: string) => {
    if (value === "all") {
        setQuestions(allQuestions);
    } else if (value === "answered") {
        setQuestions(allQuestions.filter((q) => q.isAnswered === true));
    } else if (value === "not answered") {
        setQuestions(allQuestions.filter((q) => q.isAnswered === false));
    }
  }
  return loading ? (
      <div className="flex items-center justify-center min-h-[90vh]">
          <Loader className="animate-spin" />
      </div>
  ) : (
      <>
          {allQuestions && allQuestions.length > 0 ? (
              <div className="min-h-[90vh] mb-5">
                  <div className="flex justify-between items-center p-5 md:px-10 lg:px-14">
                      <h1 className="sm:text-lg md:text-3xl font-bold ">
                          Asked Questions
                      </h1>
                      <Select onValueChange={onSelectChange}>
                          <SelectTrigger className="w-[150px] md:w-[280px] text-xs md:text-sm">
                              <SelectValue placeholder="All" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectGroup>
                                  <SelectItem
                                      value="all"
                                      defaultChecked
                                      className="text-xs md:text-sm"
                                  >
                                      All
                                  </SelectItem>
                                  <SelectItem
                                      value="not answered"
                                      className="text-xs md:text-sm"
                                  >
                                      Not Answered
                                  </SelectItem>
                                  <SelectItem
                                      value="answered"
                                      className="text-xs md:text-sm"
                                  >
                                      Answered
                                  </SelectItem>
                              </SelectGroup>
                          </SelectContent>
                      </Select>
                  </div>
                  <div className="space-y-1">
                      {questions.map((q) => (
                          <QuestionsPreview
                              key={q._id}
                              question={q.question}
                              createdAt={q.createdAt}
                              updatedAt={q.updatedAt}
                              answer={q.answer}
                              isAnswered={q.isAnswered}
                              quesId={q._id}
                              toUsername={q.toUsername || ""}
                              variant="asked"
                          />
                      ))}
                  </div>
              </div>
          ) : (
              <div className="flex items-center justify-center min-h-[90vh] p-4">
                  <h1 className="max-w-[500px]">
                      You have not sent any questions yet. Send it from{" "}
                      <Link href="/send-question" className="text-blue-600">
                          here.
                      </Link>
                  </h1>
              </div>
          )}
      </>
  );
}

export default Page