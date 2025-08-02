import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ClassRoomService } from "./room.service";


const getAllRoomFromDB = catchAsync(async(req,res)=>{
    const query = req.query;
    const result = await ClassRoomService.getAllRoomFromDB(query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Classrooms retrieved successfully',
        data: result,
    })
})

const getSingleRoomFromDB = catchAsync(async(req,res)=>{
    const { id } = req.params;
    const result = await ClassRoomService.getSingleRoomFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Classroom retrieved successfully',
        data: result,
    })
})

const createRoomToDB = catchAsync(async(req,res)=>{
    const payload = req.body;
    const result = await ClassRoomService.createRoomToDB(payload);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Classroom created successfully',
        data: result,
    })
})

const updateRoomToDB = catchAsync(async(req,res)=>{
    const { id } = req.params;
    const payload = req.body;
    const result = await ClassRoomService.updateRoomToDB(id, payload);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Classroom updated successfully',
        data: result,
    })
})

const deleteRoomFromDB = catchAsync(async(req,res)=>{
    const { id } = req.params;
    const result = await ClassRoomService.deleteRoomFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Classroom deleted successfully',
        data: result,
    })
})

export const ClassRoomControllers = {
    getAllRoomFromDB,
    getSingleRoomFromDB,
    createRoomToDB,
    updateRoomToDB,
    deleteRoomFromDB,
};
