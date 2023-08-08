"use client"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'
import { userValidation } from '@/lib/validations/user';
import * as z from "zod";
import Image from "next/image";
import { ChangeEvent } from "react";
import { Textarea } from "../ui/textarea";

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

const AccountProfile = ({ user, btnTitle }: Props) => {
    const form = useForm({
        resolver: zodResolver(userValidation),
        defaultValues: {
            profile_photo: '',
            name: '',
            username: '',
            bio: ''
        }
    })

    function handleImage(e:ChangeEvent , fieldChange : (value:string)=>void){
        e.preventDefault()
    }

    function onSubmit(values: z.infer<typeof userValidation>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
      }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex justify-start flex-col gap-10">
                <FormField
                    control={form.control}
                    name="profile_photo"
                    render={({ field }) => (
                        <FormItem className="flex items-center gap-4" >
                            <FormLabel className="account-form_image-label" >
                                {
                                    field.value ?
                                    <Image priority className="rounded-full object-contain"  src={field.value} alt="profile_photo" width={96} height={96} />
                                    :
                                    <Image className="object-contain"  src={'/assets/profile.svg'} alt="profile_photo" width={24} height={24} />
                                }
                            </FormLabel>
                            <FormControl className="flex-1 text-base-semibold text-gray-200" >
                                <Input type="file" accept="image/*" placeholder="Upload a photo" className="account-form_image-input" onChange={(e)=>handleImage(e,field.onChange)}  />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="flex w-full flex-col gap-3" >
                            <FormLabel className="text-base-semibold text-light-2" >
                                Name
                            </FormLabel>
                            <FormControl >
                                <Input {...field} type="text" placeholder="" className="account-form_input no-focus"  />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem className="flex w-full flex-col gap-3" >
                            <FormLabel className="text-base-semibold text-light-2" >
                                User Name
                            </FormLabel>
                            <FormControl >
                                <Input {...field} type="text" placeholder="" className="account-form_input no-focus"  />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem className="flex w-full flex-col gap-3" >
                            <FormLabel className="text-base-semibold text-light-2" >
                                Bio
                            </FormLabel>
                            <FormControl  >
                                <Textarea {...field} rows={10} placeholder="" className="account-form_input no-focus"  />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button className="bg-primary-500" type="submit">Submit</Button>
            </form>
        </Form>
    )
}

export default AccountProfile