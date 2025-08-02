import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AttendanceServices } from "./attendance.service";

const getOfferedCourseStudents = catchAsync(async (req, res) => {
  const { offeredCourseId } = req.params;
  const attendanceRecords = await AttendanceServices.getOfferedCourseStudents(offeredCourseId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered course students retrieved successfully',
    data: attendanceRecords,
  });
});

const markAttendance = catchAsync(async (req, res) => {
  const attendanceData = req.body;
  const result = await AttendanceServices.markAttendance(attendanceData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Attendance marked successfully',
    data: result,
  });
});

const getAttendanceByStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const body = req.body;
  const result = await AttendanceServices.getAttendanceByStudent(studentId, body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Attendance retrieved successfully',
    data: result,
  });
});

const getAttendanceByCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const result = await AttendanceServices.getAttendanceByCourse(courseId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Attendance retrieved successfully',
    data: result,
  });
});

const deleteAttendance = catchAsync(async (req, res) => {
  const { offeredCourseId } = req.params;
  const date = req?.body?.date;
  const result = await AttendanceServices.deleteAttendance(offeredCourseId, date);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Attendance deleted successfully',
    data: result,
  });
});


export const AttendanceController = {
  getOfferedCourseStudents,
  markAttendance,
  getAttendanceByStudent,
  getAttendanceByCourse,
  deleteAttendance,
};