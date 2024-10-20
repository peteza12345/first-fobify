import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";
import { useLoaderData } from "react-router-dom";
import { createContext, useContext } from "react";
import { JobsContainer, SearchContainer } from "../components";

const AllJobsContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async ({ request }) => {
  try {
    const params = Object.fromEntries([
      ...new URL(request.url).searchParams.entries(),
    ]);

    const { data } = await customFetch.get("/jobs", {
      params,
    });

    return { data, searchValues: { ...params } };
  } catch (error) {
    toast.error(
      error.response?.data?.msg || "An error occurred while fetching jobs."
    );
    return { data: [], seaechValues: {} }; // ส่งค่าว่างเปล่า
  }
};

const AllJobs = () => {
  const { data, searchValues } = useLoaderData();

  return (
    <AllJobsContext.Provider value={{ data, searchValues }}>
      <SearchContainer />
      <JobsContainer />
    </AllJobsContext.Provider>
  );
};

export default AllJobs;

// eslint-disable-next-line react-refresh/only-export-components
export const useAllJbsContext = () => useContext(AllJobsContext);
