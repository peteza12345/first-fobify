import Wrapper from "../assets/wrappers/DashboardFormPage";
import { Form, Link, useSubmit } from "react-router-dom";
import { FormRow, FormRowSelect } from ".";
import {
  JOB_SORT_BY,
  JOB_STATUS,
  JOB_TYPE,
} from "../../../backend/utils/constants";
import { useAllJbsContext } from "../pages/AllJobs";

const SearchContainer = () => {
  const { searchValues } = useAllJbsContext();
  const { search, jobStatus, jobType, sort } = searchValues;
  const submit = useSubmit();

  const debounce = (onChange) => {
    let timeout;

    return (e) => {
      const form = e.currentTarget.form;

      clearTimeout(timeout); // clear หน่วงเวลา 2 วินาที ก่อนที่จะทำงาน
      timeout = setTimeout(() => {
        onChange(form);
      }, 2000); // หน่วงเวลา 2 วินาที ก่อนที่จะทำงาน
    };
  };

  return (
    <Wrapper>
      <Form className='form'>
        <h5 className='form-title'>search form</h5>

        <div className='form-center'>
          <FormRow
            type='search'
            name='search'
            defaultValue={search}
            onChange={debounce((form) => {
              submit(form);
            })}
          />

          <FormRowSelect
            labelText='job status'
            name='jobStatus'
            list={["all", ...Object.values(JOB_STATUS)]}
            defaultValue={jobStatus}
            onChange={(e) => {
              submit(e.currentTarget.form);
            }}
          />

          <FormRowSelect
            labelText='job type'
            name='jobType'
            list={["all", ...Object.values(JOB_TYPE)]}
            defaultValue={jobType}
            onChange={(e) => {
              submit(e.currentTarget.form);
            }}
          />

          <FormRowSelect
            name='sort'
            defaultValue={sort}
            list={[...Object.values(JOB_SORT_BY)]}
            onChange={(e) => {
              submit(e.currentTarget.form);
            }}
          />

          {/* Link Reset */}
          <Link to='/dashboard/all-jobs' className='btn form-btn delete-btn'>
            Reset Search Values
          </Link>
        </div>
      </Form>
    </Wrapper>
  );
};
export default SearchContainer;
