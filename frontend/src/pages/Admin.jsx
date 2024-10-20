import { redirect, useLoaderData } from "react-router-dom";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
import Wrapper from "../assets/wrappers/StatsContainer";
import { StatItem } from "../components";
import { FaCalendarCheck, FaSuitcaseRolling } from "react-icons/fa";

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async () => {
  try {
    const response = await customFetch.get("/users/admin/app-stats");

    return response.data;
  } catch (error) {
    toast.error(
      error?.response?.data?.msg || "You are not authorized to view this page"
    );

    return redirect("/dashboard");
  }
};

const Admin = () => {
  const { users, jobs } = useLoaderData();

  return (
    <Wrapper>
      <StatItem
        title='current users'
        count={users}
        color='#e9b949'
        bcg='#fcefc7'
        icon={<FaSuitcaseRolling />}
      />

      <StatItem
        title='total jobs'
        count={jobs}
        color='#647acb'
        bcg='#e0e8f9'
        icon={<FaCalendarCheck />}
      />
    </Wrapper>
  );
};

export default Admin;
