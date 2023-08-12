'use server'

import { revalidatePath } from "next/cache";
import User from "../models/user.model"
import { connectToDB } from "../mongoose"

interface updateUserProps {
    userId:string;
    username:string;
    bio:string;
    image:string;
    name:string;
    path:string
}

export async function updateUser({userId,username,bio,image,name,path}:updateUserProps) : Promise<void>{
    connectToDB()
    console.log(image,'on server')

    try{
        await User.findOneAndUpdate(
            {id:userId},
            {
                username:username.toLowerCase(),
                name,image,bio,
                onboarded:true,
            },
            {upsert:true}
        )
    
        if(path==='/profile/edit'){
            revalidatePath(path)
        }
    }catch(err:any){
        new Error(`failed to update user ${err.message}`)
    }
}

