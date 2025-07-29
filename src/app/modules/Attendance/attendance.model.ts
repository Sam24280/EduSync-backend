import { model, Schema } from "mongoose";

const attendanceSchema = new Schema({
    date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['present', 'absent', 'late'],
        required: true,
    },
    studentId: {
        type: Schema.Types.ObjectId,
        ref: "Student",
        required: true,
    },
    offeredCourseId: {
        type: Schema.Types.ObjectId,
        ref: "OfferedCourse",
        required: true,
    },
    facultyId: {
        type: Schema.Types.ObjectId,
        ref: "Faculty",
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
});

export const Attendance = model('Attendance', attendanceSchema);
