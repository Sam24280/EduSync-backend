import { Types } from "mongoose";

export type TClassSchedule = {
    roomId: Types.ObjectId;
    classStartTime: string;
    classEndTime: string;
    courseId: Types.ObjectId;
    facultyId: Types.ObjectId;
    studentId: Types.ObjectId;
    isActive: boolean;
    isDeleted: boolean;
}