import { useLocation, useNavigate } from "react-router-dom";
import Wrapper from "../assets/wrappers/PageBtnContainer";
import { useAllJbsContext } from "../pages/AllJobs";

import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi";

const PageBtnContainer = () => {
  const {
    data: { numOfPages, currentPage },
  } = useAllJbsContext();

  // const pages = Array.from({ length: numOfPages }, (_, index) => index + 1); // สร้าง array ขึ้นมา จาก 0 ถึง numOfPages

  const { search, pathname } = useLocation(); // ดึงค่า search และ pathname จาก useLocation
  const navigate = useNavigate();

  const handlePageChange = (pageNumber) => {
    const searchParmas = new URLSearchParams(search); // สร้าง URLSearchParams จาก search
    searchParmas.set("page", pageNumber); // ตั้งค่า page ใน searchParmas

    navigate(`${pathname}?${searchParmas.toString()}`); // ส่งค่า searchParmas ไปยัง pathname และเปลี่ยนหน้า page ที่เลือก
  }; // สร้าง function ที่รับค่า pageNumber และ เปลี่ยนหน้า page ที่เลือก

  const addPageButton = ({ pageNumber, activeClass }) => {
    return (
      <button
        className={`btn page-btn ${activeClass ? "active" : ""}`}
        key={pageNumber}
        onClick={() => handlePageChange(pageNumber)}
      >
        {pageNumber}
      </button>
    );
  }; // สร้าง function ที่รับค่า pageNumber และ activeClass และ เปลี่ยนหน้า page ที่เลือก

  const renderPageButton = () => {
    const pageButton = [];
    // first page
    pageButton.push(
      addPageButton({ pageNumber: 1, activeClass: currentPage === 1 })
    ); // เพิ่ม page button แรกที่มี pageNumber เป็น 1 และ activeClass เป็น currentPage ที่เลือกเป็น 1

    // dots
    if (currentPage > 3) {
      pageButton.push(
        <span className='page-btn dots' key='dots-1'>
          ....
        </span>
      );
    }

    // One before current page
    if (currentPage > 2) {
      pageButton.push(
        addPageButton({ pageNumber: currentPage - 1, activeClass: false })
      ); // เพิ่ม page button ก่อนปัจจุบันที่มี pageNumber เป็น currentPage - 1 และ activeClass เป็น false
    }

    // Current Page
    if (currentPage !== 1 && currentPage !== numOfPages) {
      pageButton.push(
        addPageButton({
          pageNumber: currentPage,
          activeClass: true,
        })
      ); // เพิ่ม page button ปัจจุบันที่มี pageNumber เป็น currentPage และ activeClass เป็น true
    }

    // One after current page
    if (currentPage < numOfPages - 1) {
      pageButton.push(
        addPageButton({ pageNumber: currentPage + 1, activeClass: false })
      ); // เพิ่ม page button หลังปัจจุบันที่มี pageNumber เป็น currentPage + 1 และ activeClass เป็น false
    }

    // Dots after current page if needed
    if (currentPage < numOfPages - 2) {
      pageButton.push(
        <span className='page-btn dots' key='dots+1'>
          ....
        </span>
      );
    }

    // Last page
    pageButton.push(
      addPageButton({
        pageNumber: numOfPages,
        activeClass: currentPage === numOfPages,
      })
    ); // เพิ่ม page button สุดท้ายที่มี pageNumber เป็น numOfPages และ activeClass เป็น currentPage ที่เลือกเป็น numOfPages

    return pageButton;
  };

  return (
    <Wrapper>
      <button
        className='btn prev-btn'
        onClick={() => {
          let prevPage = currentPage > 1 ? currentPage - 1 : numOfPages;
          handlePageChange(prevPage);
        }}
      >
        <HiChevronDoubleLeft />
        prev
      </button>

      {/* TODO: add pagination */}
      <div className='btn-container'>{renderPageButton()}</div>

      <button
        className='btn next-btn'
        onClick={() => {
          let nextPage = currentPage < numOfPages ? currentPage + 1 : 1;
          handlePageChange(nextPage);
        }}
      >
        <HiChevronDoubleRight />
        next
      </button>
    </Wrapper>
  );
};
export default PageBtnContainer;
