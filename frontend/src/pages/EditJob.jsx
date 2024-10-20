import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";
import { Form, redirect, useLoaderData } from "react-router-dom";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import { FormRow, FormRowSelect, SubmitBtn } from "../components";
import { JOB_STATUS, JOB_TYPE } from "../../../backend/utils/constants";

/* eslint-disable react-refresh/only-export-components */
export const loader = async ({ params }) => {
  try {
    const { data } = await customFetch.get(`/jobs/${params.id}`);

    return data;
  } catch (error) {
    toast.error(error?.response?.data?.msg);

    return redirect("/dashboard/all-jobs");
  }
};

export const action = async ({ request, params }) => {
  const formData = await request.formData(); // ใช้ในการรับข้อมูลจากฟอร์ม และส่งข้อมูลไปยัง backend
  const data = Object.fromEntries(formData); // แปลงข้อมูลในฟอร์มเป็น object และเก็บไว้ใน data

  try {
    await customFetch.patch(`/jobs/${params.id}`, data);
    toast.success("Job edited successfully");

    return redirect("/dashboard/all-jobs");
  } catch (error) {
    toast.error(error?.response?.data?.msg);

    return error;
  }
};

const EditJob = () => {
  const { job } = useLoaderData();

  return (
    <Wrapper>
      <Form method='patch' className='form'>
        <h4 className='form-title'>edit job</h4>

        {/* Form Body */}
        <div className='form-center'>
          <FormRow type='text' name='position' defaultValue={job.position} />
          <FormRow type='text' name='company' defaultValue={job.company} />
          <FormRow
            type='text'
            name='jobLocation'
            defaultValue={job.jobLocation}
            labelText='job location'
          />

          {/* Form Row Select: job status */}
          <FormRowSelect
            name='jobStatus'
            labelText='job status'
            defaultValue={job.jobStatus}
            list={Object.values(JOB_STATUS)}
          />

          {/* Form Row Select: job type */}
          <FormRowSelect
            name='jobType'
            labelText='job type'
            defaultValue={job.jobType}
            list={Object.values(JOB_TYPE)}
          />

          {/* Submit Button */}
          <SubmitBtn formBtn />
        </div>
      </Form>
    </Wrapper>
  );
};
export default EditJob;
