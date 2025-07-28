import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ClassScheduleService } from "./schedule.service";


const getAllScheduleFromDB = catchAsync(async (req, res) => {
    const query = req.query;
    const result = await ClassScheduleService.getAllScheduleFromDB(query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Class schedules retrieved successfully',
        data: result,
    })
})

const getSingleScheduleFromDB = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await ClassScheduleService.getSingleScheduleFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Class schedule retrieved successfully',
        data: result,
    })
})

const createScheduleToDB = catchAsync(async (req, res) => {
    const payload = req.body;
    const result = await ClassScheduleService.createScheduleToDB(payload);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Class schedule created successfully',
        data: result,
    })
})

const addCourseToSchedule = catchAsync(async (req, res) => {
    const user = req?.user;
    const { id } = req.params;
    const payload = req.body;
    const result = await ClassScheduleService.addCourseToSchedule(id,user, payload);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Added course to class schedule',
        data: result,
    })
})

const deleteCourseToSchedule = catchAsync(async (req, res) => {
    const { id } = req.params;
    const  user = req?.user;
    const result = await ClassScheduleService.deleteCourseToSchedule(id, user);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Deleted course from class schedule',
        data: result,
    })
})

const updateScheduleToDB = catchAsync(async (req, res) => {
    const { id } = req.params;
    const payload = req.body;
    const result = await ClassScheduleService.updateScheduleToDB(id, payload);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Class schedule updated successfully',
        data: result,
    })
})

const deleteScheduleFromDB = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await ClassScheduleService.deleteScheduleFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Class schedule deleted successfully',
        data: result,
    })
})

export const ClassScheduleControllers = {
    getAllScheduleFromDB,
    getSingleScheduleFromDB,
    createScheduleToDB,
    addCourseToSchedule,
    deleteCourseToSchedule,
    updateScheduleToDB,
    deleteScheduleFromDB,
};
