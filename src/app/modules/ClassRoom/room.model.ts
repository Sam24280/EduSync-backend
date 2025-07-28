import { model, Schema } from "mongoose";
import { TClassRoom } from "./room.interface";


const classRoomSchema = new Schema<TClassRoom>({
    name: {
        type: String,
        required: [true, 'ClassRoom name is required!'],
        maxlength: [20, 'ClassRoom name can not be more than 20 characters!'],
        unique: true
    },
    isLab:
    {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
})

export const ClassRoom = model<TClassRoom>('ClassRoom', classRoomSchema);