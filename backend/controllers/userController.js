import { StatusCodes } from 'http-status-codes';
import User from '../models/UserModel.js';
import Job from '../models/jobModel.js';
import cloudinary from 'cloudinary';
import { formatImage } from '../middleware/multerMiddleware.js';

export const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  const userWithoutPassword = user.toJSON();

  res.status(StatusCodes.OK).json({
    user: userWithoutPassword,
    message: 'get current user'
  });
};

export const getApplicationStats = async (req, res) => {
  const users = await User.countDocuments(); // number of all users
  const jobs = await Job.countDocuments();

  res.status(StatusCodes.OK).json({ users, jobs, message: 'application stats' });
};

export const updateUser = async (req, res) => {
  const newUser = { ...req.body }; // copy req.body to newUser
  delete newUser.password; // delete password from newUser

  if (req.file) {
    const file = formatImage(req.file);
    const response = await cloudinary.v2.uploader.upload(file); // upload image to cloudinary

    newUser.avatar = response.secure_url; // save image url to newUser
    newUser.avatarPublicId = response.public_id; // save image public_id to newUser
  }
  const updateUser = await User.findByIdAndUpdate(req.user.userId, newUser);

  if (req.file && updateUser.avatarPublicId) { // check if image exists
    await cloudinary.v2.uploader.destroy(updateUser.avatarPublicId); // delete image from cloudinary
  }
  res.status(StatusCodes.OK).json({ updateUser, message: 'update user' });
};