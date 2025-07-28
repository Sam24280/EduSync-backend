import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { ClassScheduleControllers } from './schedule.controller';

const router = express.Router();

router.get(
    '/',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    ClassScheduleControllers.getAllScheduleFromDB,
);

router.get(
    '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    ClassScheduleControllers.getSingleScheduleFromDB,
);

router.post(
    '/',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    ClassScheduleControllers.createScheduleToDB,
);

router.patch(
    '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    ClassScheduleControllers.updateScheduleToDB,
);

router.post(
    '/add-course/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    ClassScheduleControllers.addCourseToSchedule,
);

router.delete(
    '/delete-course/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    ClassScheduleControllers.deleteCourseToSchedule,
);
router.delete(
    '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    ClassScheduleControllers.deleteScheduleFromDB,
);

export const ClassScheduleRoutes = router;