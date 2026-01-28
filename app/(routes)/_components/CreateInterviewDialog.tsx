import React, { useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ResumeUpload from './ResumeUpload'
import JobDescription from './JobDescription'
function CreateInterviewDialog() {
  const [formData, setFormData] = useState<any>();

  const onHandleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button>+ Create interview</Button>
      </DialogTrigger>
      <DialogContent className='min-w-3xl'>
        <DialogHeader>
          <DialogTitle>Please submit following details</DialogTitle>
          <DialogDescription>
            <Tabs defaultValue="resume-upload" className="w-full mt-5">
              <TabsList>
                <TabsTrigger value="resume-upload">Resume Upload</TabsTrigger>
                <TabsTrigger value="job-description">Job Description</TabsTrigger>
              </TabsList>
              <TabsContent value="resume-upload"><ResumeUpload /></TabsContent>
              <TabsContent value="job-description"><JobDescription onHandleInputChange={onHandleInputChange} />
              </TabsContent>
            </Tabs>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='flex gap-6'>
          <DialogClose>
            <Button variant={'ghost'}>Cancel</Button>
          </DialogClose>
          <Button>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateInterviewDialog