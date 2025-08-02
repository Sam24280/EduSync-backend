import { model, Schema } from "mongoose";
import { TClassSchedule } from "./schedule.interface";


const classScheduleSchema = new Schema<TClassSchedule>({
    roomId: {
        type: Schema.Types.ObjectId,
        ref: 'ClassRoom',
        required: [true, 'ClassRoom id is required!'],
    },
    classStartTime: {
        type: String,
        required: [true, 'Class start time is required!']
    },
    classEndTime: {
        type: String,
        required: [true, 'Class end time is required!']
    },
    courseId: {
        type: Schema.Types.ObjectId,
        ref: 'Course',

    },
    facultyId: {
        type: Schema.Types.ObjectId,
        ref: 'AcademicFaculty',

    },
    studentId: {
        type: Schema.Types.ObjectId,
        ref: 'Student',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
})

export const ClassSchedule = model<TClassSchedule>('ClassSchedule', classScheduleSchema);