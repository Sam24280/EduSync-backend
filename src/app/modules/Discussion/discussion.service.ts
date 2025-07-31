import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";
import { Admin } from "../Admin/admin.model";
import { Faculty } from "../Faculty/faculty.model";
import { Student } from "../Student/student.model";
import { Discussion } from "./discussion.model";


const getAllDiscussions = async (offeredCourseId: string) => {
    const result = await Discussion.find({ offeredCourseId, isDeleted: false }).populate('replyMessageId', 'message');
    return result;
}

const createDiscussion = async (file: any, payload: any, user: any) => {
    let user_data: any;
    if (user.role == 'student') {
        user_data = await Student.findOne({ id: user.userId, isDeleted: false });
        payload.role = 'student';
        payload.authorId = user_data._id;
    } else if (user.role == 'faculty') {
        user_data = await Faculty.findOne({ id: user.userId, isDeleted: false });
        payload.role = 'faculty';
        payload.authorId = user_data._id;
    } else if (user.role == 'admin') {
        user_data = await Admin.findOne({ id: user.userId, isDeleted: false });
        payload.role = 'admin';
        payload.authorId = user_data._id;
    }
    if (payload.fileUrl) payload.fileUrl = '';
    if (file) {
        const fileName = file?.originalname;
        const path = file?.path;
        //send image to cloudinary
        const { secure_url } = await sendImageToCloudinary(fileName, path);
        payload.fileUrl = secure_url as string;
        payload.fileName = fileName;
    }
    const discussion = new Discussion(payload);
    return await discussion.save();
};

const updateDiscussion = async (discussionId: string, updateData: any) => {
    return await Discussion.findByIdAndUpdate(discussionId, updateData, { new: true });
};

const deleteDiscussion = async (discussionId: string) => {
    return await Discussion.findByIdAndUpdate(discussionId, { isDeleted: true }, { new: true });
};

export const DiscussionService = {
    getAllDiscussions,
    createDiscussion,
    updateDiscussion,
    deleteDiscussion
};

