"use client"
import * as z from "zod";
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, usePathname } from "next/navigation";
import { Input } from "../ui/input";
import { CommentValidation } from "@/lib/validations/thread";
import { addCommentToThread, createThread } from "@/lib/actions/thread.actions";
import Image from "next/image";




interface Props {
    threadId:string;
    currentUserImg:string;
    currentUserId:string;
}

function Comment({
    threadId,
    currentUserImg,
    currentUserId,
}:Props) {


    const router = useRouter()
    const pathname = usePathname()
    const form = useForm({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
            thread: '',
        }
    })

    const onSubmit = async (values:z.infer<typeof CommentValidation>) => {
        await addCommentToThread(
            threadId,values.thread,JSON.parse(currentUserId),pathname
        )

        form.reset()
    }

  return (
    <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
                <FormField
                    control={form.control}
                    name="thread"
                    render={({ field }) => (
                        <FormItem className="flex w-full items-center gap-3" >
                            <FormLabel  >
                                <Image width={48} height={48} alt="profile_image" className="object-contain rounded-full" src={currentUserImg} />
                            </FormLabel>
                            <FormControl className="border-none bg-transparent" >
                                <Input type='text' {...field} placeholder="Comment ..." className="no-focus outline-1 text-light-1" />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type="submit" className="comment-form_btn">
                    Reply
                </Button>
            </form>
        </Form>
  )
}

export default Comment