import mongoose from "mongoose";
import { readFile } from "fs/promises";
import dotenv from "dotenv";
dotenv.config();
import User from "./models/UserModel.js";
import Job from "./models/jobModel.js";

try {
  await mongoose.connect(process.env.MONGO_URL);

  const user = await User.findOne({ email: 'pete@gmail.com' });
  const jsonJobs = JSON.parse(
    await readFile(new URL('./utils/mockData.json', import.meta.url))
  ); // read mock data from file

  const jobs = jsonJobs.map((job) => {
    return { ...job, createdBy: user._id };
  }); // create jobs for user from mock data

  await Job.deleteMany({ createdBy: user._id }); // delete all jobs created by user
  await Job.create(jobs); // create jobs

  console.log('Success!!!');
  process.exit(0); // exit with success
} catch (error) {
  console.log(error);
  process.exit(1); // exit with error
}