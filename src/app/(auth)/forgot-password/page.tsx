'use client'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { ApiResponse } from '@/types/ApiResponse.type';
import axios from 'axios';
import { Loader } from 'lucide-react';
import React, { useState } from 'react'

const page = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [email, setEmail] = useState<string>("")

    const onSubmit = async() => {
        setLoading(true)
        try {
            const response = await axios.post<ApiResponse>('/api/forgot-password', {
                email
            })
            if(!response.data.success) {
                toast({
                    title: "Action Failed",
                    description: response.data.message,
                    variant: "destructive"
                })
            } else {
                toast({
                    title: "Action Success",
                    description: response.data.message
                })
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to send password reset link",
                variant: "destructive"
            })
        }
        setEmail("")
        setLoading(false)
    }
  return (
      <div className="flex justify-center items-center min-h-screen">
          {
            loading 
            ?
            <p className='flex space-x-2'>Loading{" "}<Loader className='animate-spin'/></p>
            :
            <div className="max-w-md p-8 space-y-3 rounded-lg shadow-md border">
              <h1 className="text-lg font-extrabold tracking-tight lg:text-2xl">
                  Forgot Password
              </h1>
              <p className="mb-2 text-sm text-gray-600">
                  Forgot your password? We got your back. Enter your email below
                  and we will send you an email with the instructions.
              </p>
              <div className=''>
                  <Label>Email</Label>
                  <Input id="email" placeholder="Enter your AskAnon email..." value={email} onChange={(e) => setEmail(e.target.value)}/>
                  <Button className='mt-5' onClick={onSubmit}>Send Email</Button>
              </div>
          </div>
          }
      </div>
  );
}

export default page