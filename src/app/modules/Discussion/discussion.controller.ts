import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { DiscussionService } from "./discussion.service";


const getAllDiscussions = catchAsync(async (req, res) => {
    const offeredCourseId = req?.body?.offeredCourseId as string;
    const result = await DiscussionService.getAllDiscussions(offeredCourseId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Discussions retrieved successfully',
        data: result,
    });
});

const createDiscussion = catchAsync(async (req, res) => {
    const discussionData = req.body;
    const user = req.user;
    const result = await DiscussionService.createDiscussion(req?.file, discussionData, user);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Discussion created successfully',
        data: result,
    });
});

const updateDiscussion = catchAsync(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    const result = await DiscussionService.updateDiscussion(id, updateData);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Discussion updated successfully',
        data: result,
    });
});

const deleteDiscussion = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await DiscussionService.deleteDiscussion(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Discussion deleted successfully',
        data: result,
    });
});

export const DiscussionController = {
    getAllDiscussions,
    createDiscussion,
    updateDiscussion,
    deleteDiscussion
};