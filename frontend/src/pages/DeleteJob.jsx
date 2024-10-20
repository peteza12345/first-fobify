import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";
import { redirect } from "react-router-dom";

export const action = async ({ params }) => {
  const confirmmation = window.confirm(
    "Are you sure you want to delete this job?"
  );

  if (!confirmmation) {
    //  ยกเลิกการลบ
    return redirect("/dashboard/all-jobs");
  }

  try {
    await customFetch.delete(`/jobs/${params.id}`);
    toast.success("Job deleted successfully");
  } catch (error) {
    toast.error(error?.response?.data?.msg);
  }

  return redirect("/dashboard/all-jobs");
};
