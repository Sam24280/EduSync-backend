import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { ClassRoom } from "./room.model"


const getAllRoomFromDB = async (query: any) => {
    const roomQuery = new QueryBuilder(ClassRoom.find(), query)
    const meta = await roomQuery.countTotal();
    const result = await roomQuery.modelQuery;
    return {
        meta,
        result,
    }
}

const getSingleRoomFromDB = async (id: string) => {
    const result = await ClassRoom.findById(id);
    return result;
}

const createRoomToDB = async (payload: any) => {
    const result = await ClassRoom.create(payload);
    return result;
}

const updateRoomToDB = async (id: string, payload: Partial<any>) => {
    const result = await ClassRoom.findByIdAndUpdate(id,
        { isDeleted: true },
        { new: true },);

    if (!result) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete room');
    }
    return result;
}

const deleteRoomFromDB = async (id: string) => {
    const result = await ClassRoom.findByIdAndDelete(id);
    return result;
}

export const ClassRoomService = {
    getAllRoomFromDB,
    getSingleRoomFromDB,
    createRoomToDB,
    updateRoomToDB,
    deleteRoomFromDB,
};