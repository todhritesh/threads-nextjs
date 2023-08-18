'use server'

import { revalidatePath } from "next/cache";
import User from "../models/user.model"
import { connectToDB } from "../mongoose"
import { FilterQuery, SortOrder } from "mongoose";
import Thread from "../models/thread.model";







export async function getActivity(userId:string) {
    try{
        connectToDB()

        const userThreads = await Thread.find({author:userId})

        const childThreadIds = userThreads.reduce((acc,userThread)=>{
            return acc.concat(userThread.children)
        },[])

        const replies = await Thread.find({
            _id:{$in:childThreadIds},
            author:{$ne:userId}
        })
        .populate({
            path:'author',
            model:'User',
            select:'name image _id'
        })
        
        return replies
    }catch(err:any){
        throw new Error(`Failed fetching activities : ${err}`)
    }
}


export async function fetchUsers({
userId , 
searchString = "",
pageNumber = 1,
pageSize = 10,
sortBy = 'desc'
}:{
    userId : string;
    searchString : string;
    pageNumber? : number;
    pageSize? : number;
    sortBy? : SortOrder
}) {
    try{
        connectToDB()

        const skipAmount = (pageNumber -1) * pageSize

        const regex = new RegExp(searchString , 'i')

        const query : FilterQuery<typeof User> = {
            id : {
                $ne : userId
            }
        }

        if(searchString.trim() !== ""){
            query.$or = [
                {username:{$regex:regex}},
                {name:{$regex:regex}}
            ]
        }

        const sortOptions = {createdAt : sortBy}

        const userQuery = User.find(query)
        .sort(sortOptions)
        .skip(skipAmount)
        .limit(pageSize)

        const totalUsersCount = await User.countDocuments(query)

        const users = await userQuery.exec()

        const isNext = totalUsersCount > skipAmount + users.length

        return {users,isNext}
    }catch(err:any){
        throw new Error(`Failed fetching users : ${err}`)
    }
}


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


export async function fetchUser(userId:string){
    try{
        connectToDB()

        return await User.findOne({id:userId})
        // .populate({
        //     path:'communities',
        //     model:'Community'
        // })
    }catch(err:any){
        new Error(`Failed to fetch user ${err.message}`)
    }
}

