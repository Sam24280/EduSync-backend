import { Types } from "mongoose";

export interface Attendance {
    date: Date;
    studentId: Types.ObjectId;
    offeredCourseId: Types.ObjectId;
    facultyId: Types.ObjectId;
    status: 'present' | 'absent' | 'late';
    isDeleted?: boolean;
}