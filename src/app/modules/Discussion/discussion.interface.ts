import { Types } from "mongoose";


export type TDiscussion = {
    offeredCourseId: Types.ObjectId;
    message: string;
    fileUrl?: string;
    fileName?:string;
    replyMessageId: Types.ObjectId | null;
    authorId: Types.ObjectId;
    role: string; // e.g., 'student', 'faculty'
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}