"use client"
import * as z from "zod";
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, usePathname } from "next/navigation";
import { Textarea } from "../ui/textarea";
import { ThreadValidation } from "@/lib/validations/thread";
import { createThread } from "@/lib/actions/thread.actions";
import {useOrganization} from '@clerk/nextjs'
import { OrganizationInvitation } from "@clerk/nextjs/server";

interface Props {
    user: {
        id: string;
        objectId: string;
        name: string;
        username: string;
        bio: string;
        image: string;
    },
    btnTitle: string;
}


function PostThread({ userId }: { userId: string }) {
    const {organization} = useOrganization()
    const router = useRouter()
    const pathname = usePathname()
    const form = useForm({
        resolver: zodResolver(ThreadValidation),
        defaultValues: {
            thread: '',
            accountId: ''
        }
    })

    const onSubmit = async (values:z.infer<typeof ThreadValidation>) => {
        await createThread({
            text:values.thread,
            communityId:organization ? organization?.id : null,
            path:pathname,
            author:userId
        })

        router.push('/')
    }
    return (
        <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10 flex flex-col justify-start gap-10">
                <FormField
                    control={form.control}
                    name="thread"
                    render={({ field }) => (
                        <FormItem className="flex w-full flex-col gap-3" >
                            <FormLabel className="text-base-semibold text-light-2" >
                                Content
                            </FormLabel>
                            <FormControl >
                                <Textarea rows={15} {...field} placeholder="" className="no-focus border border-dark-4 bg-dark-3 text-light-1" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="bg-primary-500">
                    Post Thread
                </Button>
            </form>
        </Form>
    )
}

export default PostThread