import { model, Schema } from "mongoose";
import { TMaterial } from "./materials.interface";


const materialsSchema = new Schema<TMaterial>({
    offeredCourseId: {
        type: Schema.Types.ObjectId,
        ref: 'OfferedCourse',
        required: [true, 'Offered Course id is required!'],
    },
    facultyId: {
        type: Schema.Types.ObjectId,
        ref: 'Faculty',
        required: [true, 'Faculty id is required!'],
    },
    title: {
        type: String,
        required: [true, 'Title is required!'],
    },
    description: {
        type: String,
    },
    fileUrl: {
        type: String,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    tags: {
        type: [String],
    },
    fileType: {
        type: String,
    }
})

export const Materials = model<TMaterial>('Materials', materialsSchema);