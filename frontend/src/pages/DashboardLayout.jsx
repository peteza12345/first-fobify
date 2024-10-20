import { createContext, useContext, useState } from "react";
import { Outlet, redirect, useLoaderData, useNavigate } from "react-router-dom";
import Wrapper from "../assets/wrappers/Dashboard";
import { BigSidebar, Navbar, SmallSidebar } from "../components";
import { checkDefaultTheme } from "../App";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async () => {
  try {
    const { data } = await customFetch.get("/users/current-user");
    return data;
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return redirect("/");
  }
};

const DashboardContext = createContext(); // สร้าง DashboardContext ซึ่งใช้ร่วมกับ useContext เพื่อแชร์ข้อมูลและฟังก์ชันระหว่างคอมโพเนนต์ภายใน Dashboard

const DashboardLayout = () => {
  const { user } = useLoaderData();
  const navigate = useNavigate();
  // console.log(user);

  const [showSidebar, setShowSidebar] = useState(false); // ใช้ state เพื่อควบคุมการแสดงหรือซ่อน Sidebar
  const [isDarkTheme, setIsDarkTheme] = useState(checkDefaultTheme); // ใช้ state เพื่อควบคุมธีมมืด/สว่าง โดยใช้ค่าเริ่มต้นจากฟังก์ชัน checkDefaultTheme

  const toggleDarkTheme = () => {
    const newDarkTheme = !isDarkTheme; // เปลี่ยนค่า state isDarkTheme
    setIsDarkTheme(newDarkTheme);

    document.body.classList.toggle("dark-theme", newDarkTheme); // เพิ่ม/ลบคลาส dark-theme ให้กับ <body> ตามค่า newDarkTheme
    localStorage.setItem("dark-theme", newDarkTheme); // บันทึกสถานะธีมลงใน localStorage เพื่อรักษาการตั้งค่านี้เมื่อผู้ใช้กลับมา.
    //console.log("toggle dark theme");
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar); // toggleSidebar: สลับการแสดง Sidebar โดยการสลับค่าของ showSidebar
  };

  const logoutUser = async () => {
    navigate("/");
    await customFetch.get("/auth/logout");
    toast.success("Logging out...");
  };

  return (
    <DashboardContext.Provider
      value={{
        user,
        showSidebar,
        isDarkTheme,
        toggleDarkTheme,
        toggleSidebar,
        logoutUser,
      }}
    >
      <Wrapper>
        <main className='dashboard'>
          <SmallSidebar />
          <BigSidebar />

          <section>
            <Navbar />
            <div className='dashboard-page'>
              <Outlet context={{ user }} />
            </div>
          </section>
        </main>
      </Wrapper>
    </DashboardContext.Provider>
  );
};
// เป็น custom hook ที่ใช้ useContext(DashboardContext) เพื่อให้คอมโพเนนต์อื่นสามารถดึงข้อมูลจาก
// DashboardContext ได้ง่ายๆ โดยไม่ต้องเรียก useContext โดยตรง
// eslint-disable-next-line react-refresh/only-export-components
export const useDashboardContext = () => useContext(DashboardContext);
export default DashboardLayout;
