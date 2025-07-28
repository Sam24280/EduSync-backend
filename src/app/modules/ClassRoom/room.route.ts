import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { ClassRoomControllers } from './room.controller';

const router = express.Router();

router.get(
    '/',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    ClassRoomControllers.getAllRoomFromDB,
);

router.get(
    '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    ClassRoomControllers.getSingleRoomFromDB,
);

router.post(
    '/',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    ClassRoomControllers.createRoomToDB,
);

router.patch(
    '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    ClassRoomControllers.updateRoomToDB,
);

router.delete(
    '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    ClassRoomControllers.deleteRoomFromDB,
);

export const ClassRoomRoutes = router;