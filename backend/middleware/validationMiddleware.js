import { body, param, validationResult } from "express-validator";
import { BadRequsetError, NotFoundError, UnauthorizedError } from "../errors/customErrors.js";
import { JOB_STATUS, JOB_TYPE } from "../utils/constants.js";
import mongoose from "mongoose";
import Job from "../models/jobModel.js";
import User from "../models/UserModel.js";

const withValidationError = (validationValue) => {
  return [
    validationValue,
    (req, res, next) => {
      const errors = validationResult(req);
      // เช็คว่าถ้ามี error
      if (!errors.isEmpty()) {
        // เก็บข้อขวามจาก error ทั้งหมด 
        const errorMessages = errors.array().map((error) => error.msg);

        if (errorMessages[0].startsWith('no job')) {
          throw new NotFoundError(errorMessages);
        }
        if (errorMessages[0].startsWith('not authorized')) {
          throw new UnauthorizedError('not authorized to access this route');
        }
        throw new BadRequsetError(errorMessages);
      }
      // ถ้าไม่มี error
      next();
    },
  ];
};

export const validateJobInput = withValidationError([
  body("company").notEmpty().withMessage("company is required").trim(),
  body("position").notEmpty().withMessage("position is required").trim(),
  body("jobLocation").notEmpty().withMessage("job location is required"),
  body("jobStatus")
    .isIn(Object.values(JOB_STATUS))
    .withMessage("invalid status value"),
  body("jobType").isIn(Object.values(JOB_TYPE)).withMessage("invalid job type"),
]);

export const validateIdParam = withValidationError([
  param('id').custom(async (value, { req }) => {
    const isValidId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidId) throw new BadRequsetError('invalid MongoDB id');

    const job = await Job.findById(value);
    if (!job) throw new NotFoundError(`no job with id ${value}`);

    const isAdmin = req.user.role === 'admin';
    const isOwner = req.user.userId === job.createdBy.toString();
    if (!isAdmin || !isOwner) throw new UnauthorizedError('not authorized to access this route');
  })
]);

export const validateRegisterInput = withValidationError([
  body('name').notEmpty().withMessage('name is required').trim(),
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .trim()
    .isEmail()
    .withMessage('invalid email format')
    .custom(async (email) => {
      const user = await User.findOne({ email });

      if (user) throw new BadRequsetError('email already exists');
    }),
  body('password')
    .notEmpty()
    .withMessage('password is required')
    .isLength({ min: 8 })
    .withMessage('password must be at least 8 characters long')
    .trim(),
  body('location').notEmpty().withMessage('location is required'),
]);

export const validateLoginInput = withValidationError([
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .trim()
    .isEmail()
    .withMessage('invalid email format')
  ,
  body('password')
    .notEmpty()
    .withMessage('password is required')
    .trim()
]);

export const validateUpdateUserInput = withValidationError([
  body('name').notEmpty().withMessage('name is required').trim(),
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .trim()
    .isEmail()
    .withMessage('invalid email format')
    .custom(async (email, { req }) => {
      const user = await User.findOne({ email });
      if (user && user._id.toString() !== req.user.userId) {
        throw new BadRequsetError('email already exists');
      }
    })
  ,
  body('location').notEmpty().withMessage('location is required'),
  body('lastName').notEmpty().withMessage('last name is required')
]);