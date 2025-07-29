import EnrolledCourse from "../EnrolledCourse/enrolledCourse.model";
import { Attendance } from "./attendance.model";


const getOfferedCourseStudents = async (offeredCourseId: string) => {
    const attendanceRecords = await EnrolledCourse.find({ offeredCourse: offeredCourseId })
        .populate({
            path: 'student',
            select: 'name _id id',
        })
        .select('student');

    return attendanceRecords;
};

const markAttendance = async (attendanceData: {
    offeredCourseId: string;
    date: string;
    attendances: { studentId: string; status: 'present' | 'absent' }[];
}) => {
    const { offeredCourseId, date, attendances } = attendanceData;

    const bulkOps = await Promise.all(attendances.map(async (entry) => {
        const checkTheStudentIsEnrolled = await EnrolledCourse.findOne({
            student: entry.studentId,
            offeredCourse: offeredCourseId,
        });
        if (!checkTheStudentIsEnrolled) {
            throw new Error(`Student with ID ${entry.studentId} is not enrolled in the offered course with ID ${offeredCourseId}`);
        }
        return {
            updateOne: {
                filter: {
                    date: new Date(date),
                    studentId: entry.studentId,
                    offeredCourseId: offeredCourseId,
                },
                update: {
                    $set: {
                        status: entry.status,
                    },
                },
                upsert: true,
            },
        };
    }));


    const result = await Attendance.bulkWrite(bulkOps);
    return result;
};

const getAttendanceByStudent = async (studentId: string, payload: any) => {
    const { offeredCourseId, date } = payload;
    if (date) {
        const result = await Attendance.findOne({
            studentId,
            offeredCourseId,
            date: new Date(date),
        });
        return result;
    }

    const attendanceData = (await Attendance.find({ offeredCourseId }, { date: 1, _id: 0 }));
  

    const uniqueDates = new Set(
        attendanceData.map((item) => new Date(item.date).toISOString().split('T')[0])
    );

    const studentAttendanceData = await Attendance.find({
        studentId,
        status: 'present', offeredCourseId
    });

    const totalClassAttendance = uniqueDates.size;
    const studentAttendance = studentAttendanceData.length;
    const percentage = (studentAttendance / totalClassAttendance) * 100;

    let attendanceStatus: string;
    if (percentage >= 90) {
        attendanceStatus = 'Excellent';
    } else if (percentage >= 75) {
        attendanceStatus = 'Good';
    } else if (percentage >= 50) {
        attendanceStatus = 'Average';
    } else if (percentage >= 30) {
        attendanceStatus = 'Poor';
    } else {
        attendanceStatus = 'Very Poor';
    }



    return {
        totalClassAttendance,
        studentAttendance,
        percentage: percentage.toFixed(2) + '%',
        attendanceStatus,
    };
}

const getAttendanceByCourse = async (courseId: string) => {
    const result = await Attendance.find({ offeredCourseId: courseId }).populate({
        path: 'studentId',
        select: 'name _id id',
    })
    return result;
}


const deleteAttendance = async (offeredCourseId: string, date: string) => {
    const result = await Attendance.deleteMany(
        { offeredCourseId, date: new Date(date) }
    );
    return result;
}
export const AttendanceServices = {
    getOfferedCourseStudents,
    markAttendance,
    getAttendanceByStudent,
    getAttendanceByCourse,
    deleteAttendance,
};