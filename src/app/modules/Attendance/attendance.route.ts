import express from 'express';
import { AttendanceController } from './attendance.controller';
import { USER_ROLE } from '../User/user.constant';
import auth from '../../middlewares/auth';

const router = express.Router();

router.get('/offered-course-students/:offeredCourseId',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
    AttendanceController.getOfferedCourseStudents);

router.post('/mark',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
    AttendanceController.markAttendance);

router.get('/student/:studentId',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    AttendanceController.getAttendanceByStudent);

router.get('/course/:courseId',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
    AttendanceController.getAttendanceByCourse);

router.delete('/:offeredCourseId',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
    AttendanceController.deleteAttendance);

    export const AttendanceRoutes = router;