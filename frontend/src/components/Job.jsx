/* eslint-disable react/prop-types */
import Wrapper from "../assets/wrappers/Job";
import day from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import JobInfo from "./JobInfo";
import { FaBriefcase, FaCalendarAlt, FaLocationArrow } from "react-icons/fa";
import { Form, Link } from "react-router-dom";

day.extend(advancedFormat); // แปลงวันที่เป็น 00:00:00

const Job = ({
  _id,
  position,
  company,
  jobLocation,
  jobType,
  createdAt,
  jobStatus,
}) => {
  const date = day(createdAt).format("MMM Do, YYYY");

  return (
    <Wrapper>
      <header>
        <div className='main-icon'>{company.charAt(0)}</div>

        {/* Info */}
        <div className='info'>
          <h5>{position}</h5>
          <p>{company}</p>
        </div>
      </header>

      {/* Content */}
      <div className='content'>
        <div className='content-center'>
          <JobInfo icon={<FaLocationArrow />} text={jobLocation} />
          <JobInfo icon={<FaCalendarAlt />} text={date} />
          <JobInfo icon={<FaBriefcase />} text={jobType} />
          <div className={`status ${jobStatus}`}>{jobStatus}</div>
        </div>

        {/* Footer Links */}
        <footer className='actions'>
          <Link to={`../edit-job/${_id}`} className='btn edit-btn'>
            Edit
          </Link>

          {/* Form Delete */}
          <Form method='delete' action={`../delete-job/${_id}`}>
            <button type='submit' className='btn delete-btn'>
              Delete
            </button>
          </Form>
        </footer>
      </div>
    </Wrapper>
  );
};

export default Job;
