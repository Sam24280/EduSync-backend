import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { MaterialsService } from "./materials.service";


 const getAllMaterials = catchAsync(async (req, res) => {
    const query = req.query;
    const offeredCourseId = req?.body?.offeredCourseId as string;
    const result = await MaterialsService.getAllMaterials(offeredCourseId, query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Materials retrieved successfully',
        data: result,
    });
});

const getSingleMaterial = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await MaterialsService.getSingleMaterial(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Material retrieved successfully',
        data: result,
    });
});

const createMaterial = catchAsync(async (req, res) => {
    const payload = req.body;
    if(!req.file){
        throw new Error('File is required');
    }
    const result = await MaterialsService.createMaterial(req.file, payload);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Material created successfully',
        data: result,
    });
});

const updateMaterial = catchAsync(async (req, res) => {
    const { id } = req.params;
    const payload = req.body;
    if(!req.file){
        throw new Error('File is required');
    }
    const result = await MaterialsService.updateMaterial(id, req.file, payload);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Material updated successfully',
        data: result,
    });
});

const deleteMaterial = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await MaterialsService.deleteMaterial(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Material deleted successfully',
        data: result,
    });
});

export const MaterialsController = {
    getAllMaterials,
    getSingleMaterial,
    createMaterial,
    updateMaterial,
    deleteMaterial,
};
