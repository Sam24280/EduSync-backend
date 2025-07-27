/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import config from '../../config';
import { sendEmail } from '../../config/sendMail';
import AppError from '../../errors/AppError';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import { AcademicDepartment } from '../AcademicDepartment/academicDepartment.model';
import { AcademicSemester } from '../AcademicSemester/academicSemester.model';
import { TAdmin } from '../Admin/admin.interface';
import { Admin } from '../Admin/admin.model';
import { TFaculty } from '../Faculty/faculty.interface';
import { Faculty } from '../Faculty/faculty.model';
import { TStudent } from '../Student/student.interface';
import { Student } from '../Student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
} from './user.utils';

const createStudentIntoDB = async (
  file: any,
  password: string,
  payload: TStudent,
) => {
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use default password
  userData.password = password || (config.default_password as string);

  //set student role
  userData.role = 'student';
  // set student email
  userData.email = payload.email;

  // find academic semester info
  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );

  if (!admissionSemester) {
    throw new AppError(400, 'Admission semester not found');
  }

  // find department
  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment,
  );

  if (!academicDepartment) {
    throw new AppError(400, 'Aademic department not found');
  }
  payload.academicFaculty = academicDepartment.academicFaculty;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generateStudentId(admissionSemester);

    if (file) {
      const imageName = `${userData.id}${payload?.name?.firstName}`;
      const path = file?.path;

      //send image to cloudinary
      const { secure_url } = await sendImageToCloudinary(imageName, path);
      payload.profileImg = secure_url as string;
    }

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session }); // array

    //create a student
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // create a student (transaction-2)
    const newStudent = await Student.create([payload], { session });

    if (!newStudent.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student');
    }

    const subject = 'Welcome to EduSync EMS';

    const emailContent = `
  <h2 style="color: #4CAF50; text-align: center;">Welcome to EduSync EMS!</h2>
  <p>Dear ${payload.fullName},</p>
  <p>Congratulations! Your account has been successfully created on <strong>EduSync EMS</strong>. You now have access to the platform and can start exploring our educational tools and features.</p>
  
  <h3>Your Account Details:</h3>
  <ul>
    <li><strong>ID:</strong> ${newUser[0].id}</li>
    <li><strong>Password:</strong> ${password}</li>
    <li><strong>Role:</strong> ${newUser[0].role}</li>
  </ul>
  
  <p>🔒 For your security, we strongly recommend changing your password immediately after your first login.</p>

  <p>
    <a href="${'http://localhost:8080/login'}" 
       style="background-color: #4CAF50; color: white; padding: 10px 20px; 
              text-decoration: none; border-radius: 5px; display: inline-block;">
      Log In to EduSync
    </a>
  </p>

  <p>If you have any questions or face any issues, feel free to contact our support team.</p>

  <p>Best regards,</p>
  <p><strong>The EduSync EMS Team</strong></p>
`;
    await sendEmail(newUser[0].email, emailContent, subject);
    await session.commitTransaction();
    await session.endSession();
    return newStudent;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const createFacultyIntoDB = async (
  file: any,
  password: string,
  payload: TFaculty,
) => {
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use deafult password
  userData.password = password || (config.default_password as string);

  //set faculty role
  userData.role = 'faculty';
  //set faculty email
  userData.email = payload.email;

  // find academic department info
  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment,
  );

  if (!academicDepartment) {
    throw new AppError(400, 'Academic department not found');
  }

  payload.academicFaculty = academicDepartment?.academicFaculty;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generateFacultyId();

    if (file) {
      const imageName = `${userData.id}${payload?.name?.firstName}`;
      const path = file?.path;
      //send image to cloudinary
      const { secure_url } = await sendImageToCloudinary(imageName, path);
      payload.profileImg = secure_url as string;
    }

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session }); // array

    //create a faculty
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // create a faculty (transaction-2)

    const newFaculty = await Faculty.create([payload], { session });

    if (!newFaculty.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create faculty');
    }
    const subject = 'Welcome to EduSync EMS';

    const emailContent = `
  <h2 style="color: #4CAF50; text-align: center;">Welcome to EduSync EMS!</h2>
  <p>Dear ${payload.fullName},</p>
  <p>Congratulations! Your account has been successfully created on <strong>EduSync EMS</strong>. You now have access to the platform and can start exploring our educational tools and features.</p>
  
  <h3>Your Account Details:</h3>
  <ul>
    <li><strong>ID:</strong> ${newUser[0].id}</li>
    <li><strong>Password:</strong> ${password}</li>
    <li><strong>Role:</strong> ${newUser[0].role}</li>
  </ul>
  
  <p>🔒 For your security, we strongly recommend changing your password immediately after your first login.</p>

  <p>
    <a href="${'http://localhost:8080/login'}" 
       style="background-color: #4CAF50; color: white; padding: 10px 20px; 
              text-decoration: none; border-radius: 5px; display: inline-block;">
      Log In to EduSync
    </a>
  </p>

  <p>If you have any questions or face any issues, feel free to contact our support team.</p>

  <p>Best regards,</p>
  <p><strong>The EduSync EMS Team</strong></p>
`;
    await sendEmail(newUser[0].email, emailContent, subject);

    await session.commitTransaction();
    await session.endSession();

    return newFaculty;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const createAdminIntoDB = async (
  file: any,
  password: string,
  payload: TAdmin,
) => {
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use deafult password
  userData.password = password || (config.default_password as string);

  //set student role
  userData.role = 'admin';
  //set admin email
  userData.email = payload.email;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generateAdminId();

    if (file) {
      const imageName = `${userData.id}${payload?.name?.firstName}`;
      const path = file?.path;
      //send image to cloudinary
      const { secure_url } = await sendImageToCloudinary(imageName, path);
      payload.profileImg = secure_url as string;
    }

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session });

    //create a admin
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // create a admin (transaction-2)
    const newAdmin = await Admin.create([payload], { session });

    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }
    const subject = 'Welcome to EduSync EMS';

    const emailContent = `
  <h2 style="color: #4CAF50; text-align: center;">Welcome to EduSync EMS!</h2>
  <p>Dear ${payload.fullName},</p>
  <p>Congratulations! Your account has been successfully created on <strong>EduSync EMS</strong>. You now have access to the platform and can start exploring our educational tools and features.</p>
  
  <h3>Your Account Details:</h3>
  <ul>
    <li><strong>ID:</strong> ${newUser[0].id}</li>
    <li><strong>Password:</strong> ${password}</li>
    <li><strong>Role:</strong> ${newUser[0].role}</li>
  </ul>
  
  <p>🔒 For your security, we strongly recommend changing your password immediately after your first login.</p>

  <p>
    <a href="${'http://localhost:8080/login'}" 
       style="background-color: #4CAF50; color: white; padding: 10px 20px; 
              text-decoration: none; border-radius: 5px; display: inline-block;">
      Log In to EduSync
    </a>
  </p>

  <p>If you have any questions or face any issues, feel free to contact our support team.</p>

  <p>Best regards,</p>
  <p><strong>The EduSync EMS Team</strong></p>
`;
    await sendEmail(newUser[0].email, emailContent, subject);
    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const getMe = async (userId: string, role: string) => {
  let result = null;
  if (role === 'student') {
    result = await Student.findOne({ id: userId }).populate('user');
  }
  if (role === 'admin') {
    result = await Admin.findOne({ id: userId }).populate('user');
  }

  if (role === 'faculty') {
    result = await Faculty.findOne({ id: userId }).populate('user');
  }

  return result;
};

const changeStatus = async (id: string, payload: { status: string }) => {
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

export const UserServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB,
  getMe,
  changeStatus,
};
