import Job from '../models/jobModel.js';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import day from 'dayjs';

// Get All Jobs
export const getAllJobs = async (req, res) => {
  const { search, jobStatus, jobType, sort } = req.query;
  const queryObject = {
    createdBy: req.user.userId,
  };

  if (search) {
    queryObject.$or = [
      { position: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } },
    ]
  }

  if (jobStatus && jobStatus !== 'all') {
    queryObject.jobStatus = jobStatus;
  }

  if (jobType && jobType !== 'all') {
    queryObject.jobType = jobType;
  }

  const sortOptions = {
    newest: '-createdAt',
    oldest: 'createdAt',
    'a-z': 'position',
    'z-a': '-position',
  };

  const sortKey = sortOptions[sort] || sortOptions.newest;

  // Setup pagination
  const page = Number(req.query.page) || 1; // Get the current page number from the request query
  const limit = Number(req.query.limit) || 10; // Get the limit from the request query
  const skip = (page - 1) * limit; // Calculate the offset to skip based on the current page

  const jobs = await Job.find(queryObject)
    .sort(sortKey)
    .skip(skip)
    .limit(limit);

  // totalJobs
  const totalJobs = await Job.countDocuments(queryObject);

  // Total Pages
  const numOfPages = Math.ceil(totalJobs / limit); // Calculate the total number of pages

  res.status(StatusCodes.OK).json({
    totalJobs,
    numOfPages,
    currentPage: page,
    jobs
  });
};

// Create Jobs
export const createJob = async (req, res) => {
  //const { company, position } = req.body;
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);

  res.status(StatusCodes.CREATED).json({ job, message: 'Job created' });
};

// Get Job By ID
export const getJob = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid ID' });
  }

  const job = await Job.findById(id);

  if (!job) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'Job not found' });
  }

  res.status(StatusCodes.OK).json({ job });
};

// Update Job By ID
export const updateJob = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid ID' });
  }

  const updatedJob = await Job.findByIdAndUpdate(id, req.body, {
    new: true
  });

  if (!updatedJob) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'Job not found' });
  }

  res.status(StatusCodes.OK).json({ updatedJob, message: 'job modified' });
};

// Delete Job By ID
export const deleteJob = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid ID' });
  }

  const removeJob = await Job.findByIdAndDelete(id);

  if (!removeJob) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'Job not found' });
  }

  res.status(StatusCodes.OK).json({ job: removeJob, message: 'job deleted' });
};

// Show Stats
export const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } }, // filter by user id
    { $group: { _id: '$jobStatus', count: { $sum: 1 } } }, // group by job status
  ]);

  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr; // { _id: 'pending', count: 1 }
    acc[title] = count;  // acc['pending'] = 1

    return acc;
  }, {}); // { pending: 1, interview: 2, declined: 3 }

  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };

  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } }, // filter by user id
    { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } }, // group by year and month
    { $sort: { '_id.year': -1, '_id.month': -1 } }, // sort by year and month
  ]);

  monthlyApplications = monthlyApplications.map((item) => {
    const { _id: { year, month }, count } = item;
    const date = day()
      .month(month - 1)
      .year(year)
      .format('MMMM YY'); // format month and year  

    return { date, count };
  }).reverse(); // reverse the array to get the latest month first

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};