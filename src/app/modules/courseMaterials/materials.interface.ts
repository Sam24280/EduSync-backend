import { Types } from "mongoose";


export type TMaterial = {
    offeredCourseId: Types.ObjectId;
    facultyId: Types.ObjectId;
    title: string;
    description: string;
    fileUrl: string;
    isDeleted: boolean;
    tags?: string[];
    fileType?: string;
    // createdAt: Date;
    // updatedAt: Date;
}