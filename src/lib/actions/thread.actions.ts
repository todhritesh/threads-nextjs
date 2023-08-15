'use server'

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";


export async function addCommentToThread(
    threadId:string,
    commentText:string,
    userId:string,
    path:string,
) {
    connectToDB()

    try{
        const originalThread = await Thread.findById(threadId)

        if(!originalThread) {
            throw new Error(`Thread not found`)
        }

        const commentThread = new Thread({
            text:commentText,
            author:userId,
            parentId:threadId
        })

        const savedCommentThread = await commentThread.save()

        originalThread.children.push(savedCommentThread._id)

        await originalThread.save()

        revalidatePath(path)
    }catch(err:any){
        throw new Error(`Error commenting thread ${err.message}`)
    }
}

export async function fetchThreadById(id:string){
    connectToDB()
    try{
        const thread = await Thread.findById(id)
        .populate({
            path:'author',
            model:'User',
            select:'_id name image'
        })
        .populate({
            path:'children',
            populate:[
                {
                    path:'author',
                    model:'User',
                    select:'_id id name parentId image'
                },
                {
                    path:'children',
                    model:'Thread',
                    populate:{
                        path:'author',
                        model:'User',
                        select:'_id id name parentId image'
                    }
                }
            ]
        }).exec()

        return thread
    }catch(err:any){
        throw new Error(`Error fetching thread ${err.message}`)
    }
}

export async function fetchPosts(pageNumber =1 , pageSize=20) {
    try{
        connectToDB()

        // calculate the number of page to skip
        const skipAmount = (pageNumber - 1) * pageSize
        console.log(skipAmount)
        // fetch the posts that have no parents ( top lever threads ..)
        const postQuery = Thread.find({parentId:{$in:[null,undefined]}})
        .sort({createdAt:'desc'})
        .skip(skipAmount)
        .limit(pageSize)
        .populate({
            path:'author',
            model:'User',
        })
        .populate({
            path:'children',
            populate:{
                path:'author',
                model:'User',
                select:'_id name parentId image'
            }
        })

        const totalPostCount = await Thread.countDocuments({
            parentId:{$in:[null,undefined]}
        })

        const posts = await postQuery.exec();

        const isNext = totalPostCount > skipAmount + posts.length

        return {posts,isNext}

    }catch(err:any){
        new Error(`Error in fetching threads ${err.message}`)
    }
}



interface Params {
    text:string;
    author:string;
    communityId:string | null;
    path:string;
}
export async function createThread ({text,author,communityId,path}:Params) {
    try{
        connectToDB()
        const createThread = await Thread.create({
            text,author,community:null
        })

        await User.findByIdAndUpdate(author,{
            $push:{threads:createThread._id}
        })

        revalidatePath(path)
    }catch(err:any){
        new Error(`Error in creating thread ${err.message}`)
    }
}