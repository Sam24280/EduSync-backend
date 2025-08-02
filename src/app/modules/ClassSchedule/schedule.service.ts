import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { ClassSchedule } from "./schedule.model";
import { UserServices } from "../User/user.service";
import { USER_ROLE } from "../User/user.constant";


const getAllScheduleFromDB = async (query: any) => {
    const roomQuery = new QueryBuilder(ClassSchedule.find({ isDeleted: false }).populate('roomId courseId facultyId'), query)
    const meta = await roomQuery.countTotal();
    const result = await roomQuery.modelQuery;
    return {
        meta,
        result,
    }
}

const getSingleScheduleFromDB = async (id: string) => {
    const result = await ClassSchedule.findOne({ _id: id, isDeleted: false }).populate('roomId courseId facultyId');
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Class schedule not found');
    }
    return result;
}

const createScheduleToDB = async (payload: any) => {
    const { roomId, classStartTime, classEndTime, classDuration } = payload;

    const [startHour, startMinute] = classStartTime.split(':').map(Number);
    const [endHour, endMinute] = classEndTime.split(':').map(Number);
    const [durHour, durMinute] = classDuration.split(':').map(Number);

    const startTotal = startHour * 60 + startMinute;
    const endTotal = endHour * 60 + endMinute;
    const durationMin = durHour * 60 + durMinute;

    const classSchedules = [];
    let current = startTotal;

    while (current + durationMin <= endTotal) {
        const startH = Math.floor(current / 60).toString().padStart(2, '0');
        const startM = (current % 60).toString().padStart(2, '0');

        const endMinutes = current + durationMin;
        const endH = Math.floor(endMinutes / 60).toString().padStart(2, '0');
        const endM = (endMinutes % 60).toString().padStart(2, '0');

        const classStart = `${startH}:${startM}`;
        const classEnd = `${endH}:${endM}`;

        // Check for conflicts with existing schedules
        const hasConflict = await ClassSchedule.findOne({
            roomId,
            isDeleted: false,
            $or: [
                {
                    classStartTime: { $lt: classEnd },
                    classEndTime: { $gt: classStart },
                },
            ],
        });

        if (hasConflict) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                `Conflict with existing schedule from ${hasConflict.classStartTime} to ${hasConflict.classEndTime}`
            );
        }

        classSchedules.push({
            roomId,
            classStartTime: classStart,
            classEndTime: classEnd,
            isActive: true,
            isDeleted: false,
        });

        current += durationMin;
    }

    const result = await ClassSchedule.insertMany(classSchedules);
    return result;
};


const addCourseToSchedule = async (id: string, user: any, payload: Partial<any>) => {

    const findCourse = await ClassSchedule.findById(id);
    let findStudent;
    if (user.role == USER_ROLE.student) {
        findStudent = await UserServices.getMe(user.userId, user.role);
        payload.studentId = findStudent?._id;
    }

    if (user.role == USER_ROLE.student && findCourse?.studentId && findCourse?.studentId?.toString() !== findStudent?._id?.toString()) {
        throw new AppError(httpStatus.BAD_REQUEST, 'You are not allowed to add course to this schedule');
    }
    // sequere data validation
    if (!payload.courseId)
        throw new AppError(httpStatus.BAD_REQUEST, 'courseId is required');
    if (!payload.facultyId)
        throw new AppError(httpStatus.BAD_REQUEST, 'facultyId id is required');
    if (payload.roomId) delete payload.roomId;
    if (payload.classEndTime) delete payload.classEndTime;
    if (payload.classStartTime) delete payload.classStartTime;



    const result = await ClassSchedule.findByIdAndUpdate(id,
        { isActive: true, ...payload },
        { new: true },);

    if (!result) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to add course to schedule');
    }
    return result;
}

const deleteCourseToSchedule = async (id: string, user: any) => {
    const findCourse = await ClassSchedule.findById(id);
    let findStudent;
    if (user.role == USER_ROLE.student) {
        findStudent = await UserServices.getMe(user.userId, user.role);
    }

    if (user.role == USER_ROLE.student && findCourse?.studentId?.toString() !== findStudent?._id?.toString()) {
        throw new AppError(httpStatus.BAD_REQUEST, 'You are not allowed to delete course from this schedule');
    }

    const result = await ClassSchedule.findByIdAndUpdate(id,
        { isActive: false, courseId: null, studentId: null, facultyId: null },
        { new: true },);

    if (!result) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete course from schedule');
    }
    return result;
}

const updateScheduleToDB = async (id: string, payload: Partial<any>) => {

    const result = await ClassSchedule.findByIdAndUpdate(id,
        { ...payload },
        { new: true },);

    if (!result) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update schedule');
    }
    return result;
}

const deleteScheduleFromDB = async (id: string) => {
    const result = await ClassSchedule.findByIdAndUpdate(id,
        { isDeleted: true },
        { new: true },);
    return result;
}

export const ClassScheduleService = {
    getAllScheduleFromDB,
    getSingleScheduleFromDB,
    createScheduleToDB,
    addCourseToSchedule,
    deleteCourseToSchedule,
    updateScheduleToDB,
    deleteScheduleFromDB,
};