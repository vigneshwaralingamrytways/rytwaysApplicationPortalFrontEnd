import React, { useState } from "react";
import styles from "./CustomerTable3D.module.css";
import * as FaIcons from "react-icons/fa";

const CustomerTable3D = ({ cols, data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const currentData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className={styles["table-container-3d"]}>
      <h2 className={styles["table-title"]}>Customer Records</h2>

      <div className={styles["table-scroll-container"]}>
        <div className={styles["table-3d"]}>
          <div className={styles["table-header"]}>
            {cols.map((col, index) => (
              <div key={index} style={{ textAlign: col.align || "left" }}>
                {col.title}
              </div>
            ))}
          </div>
          {currentData.map((item, index) => (
            <div className={styles["table-row"]} key={index}>
              {cols.map((col, colIndex) => (
                <div key={colIndex} style={{ textAlign: col.align || "left" }}>
                  {col.render(item)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.pagination}>
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className={styles.arrowButton}
        >
          <FaIcons.FaArrowLeft />
        </button>
        <span className={styles.pageNumber}>Page {currentPage}</span>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className={styles.arrowButton}
        >
          <FaIcons.FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default CustomerTable3D;
