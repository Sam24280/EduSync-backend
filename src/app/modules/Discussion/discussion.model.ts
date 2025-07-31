import { TDiscussion } from "./discussion.interface";
import { model, Schema } from "mongoose";


const discussionSchema = new Schema<TDiscussion>({
    offeredCourseId: {
        type: Schema.Types.ObjectId,
        ref: 'OfferedCourse',
        required: [true, 'Offered Course id is required!'],
    },
    message: {
        type: String,
    },
    fileUrl: {
        type: String,
    },
    fileName: {
        type: String,
    },
    replyMessageId: {
        type: Schema.Types.ObjectId,
        ref: 'Discussion',
        default: null,
    },
    authorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    role: {
        type: String,
        enum: ['student', 'faculty', 'admin'],
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

discussionSchema.pre('validate', function(next) {
    if (!this.message && !this.fileUrl) {
        this.invalidate('message', 'Either message or fileUrl is required!');
        this.invalidate('fileUrl', 'Either message or fileUrl is required!');
    }
    next();
});

export const Discussion = model<TDiscussion>('Discussion', discussionSchema);