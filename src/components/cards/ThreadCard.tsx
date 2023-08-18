import { formatDateString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface Props {
    id: string;
    currentUserId: string;
    parentId: string | null;
    content: string;
    author: {
        name: string;
        image: string;
        id: string;
    };
    community: {
        id: string;
        name: string;
        image: string;
    } | null;
    createdAt: string;
    comments: {
        author: {
            image: string
        }
    }[];
    isComment?: boolean;
}

const ThreadCard = ({
    id,
    currentUserId,
    parentId,
    content,
    author,
    community,
    createdAt,
    comments,
    isComment
}: Props) => {
    return (
        <article className={`flex w-full flex-col rounded-xl ${isComment ? 'px-0 xs:px-7 ' : 'bg-dark-4 p-7'}`} >
            <div className="flex items-start justify-between">
                <div className="flex w-full flex-row flex-1 gap-4">
                    <div className="flex flex-col items center">
                        <Link href={`/profile/${author.id}`} className="relative h-11 w-11" >
                            <Image alt={author.name} src={author.image} fill className="cursor-pointer rounded-full" />
                        </Link>
                        <div className="thread-card_bar" />
                    </div>
                    <div className="flex w-full flex-col">
                        <Link href={`/profile/${author.id}`} className="w-fit" >
                            <h4 className="cursor-pointer text-base-semibold text-light-1">
                                {author.name}
                            </h4>
                        </Link>
                        <p className="mt-2 text-small-regular text-light-2">
                            {content}
                        </p>
                        <div className={`${isComment && 'mb-10'} mt-5 flex flex-col gap-5`}>
                            <div className="flex gap-3.5">
                                <Image className="cursor-pointer object-contain" alt="heart" width={24} height={24} src={'/assets/heart-gray.svg'} />
                                <Link href={`/thread/${id}`} >
                                    <Image className="cursor-pointer object-contain" alt="heart" width={24} height={24} src={'/assets/reply.svg'} />
                                </Link>
                                <Image className="cursor-pointer object-contain" alt="heart" width={24} height={24} src={'/assets/repost.svg'} />
                                <Image className="cursor-pointer object-contain" alt="heart" width={24} height={24} src={'/assets/share.svg'} />
                            </div>
                            {
                                isComment && comments.length > 0 && (
                                    <Link href={`/thread/${id}`}>
                                        <p className="mt-1 text-subtle-medium text-gray-1">
                                            {comments.length} replies
                                        </p>
                                    </Link>
                                )
                            }
                        </div>
                    </div>
                </div>

                {
                    !isComment && community && (
                        <Link href={`communities/${community.id}`} className="mt-5 flex items-center" >
                            <p className="text-subtle-medium text-gray-1">
                                {formatDateString(createdAt)}
                                - {community.name} Community
                            </p>

                            <Image src={community.image} width={14} className="rounded-full ml-2 object-cover" height={14} alt={community.name} />
                        </Link>
                    )
                }
            </div>
        </article>
    )
}

export default ThreadCard