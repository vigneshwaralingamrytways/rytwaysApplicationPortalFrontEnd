import React, { useRef, useEffect, useState } from "react";
import * as FaIcons from "react-icons/fa";

const ExpenseSubCatagoryTable = ({
  showFormHandler = () => () => {},
  actions = ["Edit", "Delete"],
   openRow,
  setOpenRow,
}) => {
  return [
    {
      title: "Seq No",
      align: "right",
      render: (rowData) => <span>{rowData?.seqNo}</span>,
    },
    {
      title: "Exp Category",
      align: "left",
      render: (rowData) => (
        <span>{rowData?.expenseCatagory?.expenseCatagory}</span>
      ),
    },
    {
      title: "Exp SubCatagory",
      align: "left",
      render: (rowData) => (
        <span>{rowData?.expenseSubCatagory}</span>
      ),
    },
    {
      title: "Description",
      align: "left",
      render: (rowData) => (
        <span>{rowData?.expSubCatagoryDesc}</span>
      ),
    },
    {
      title: "Status",
      align: "left",
      render: (rowData) => (
        <span>{rowData?.status?.statusName || ""}</span>
      ),
    },
    {
      title: "Actions",
      align: "center",
      render: (rowData) => <ActionCell rowData={rowData} showFormHandler={showFormHandler} />,
    },
  ];
};

// Separate ActionCell component for proper hook usage
const ActionCell = ({ rowData, showFormHandler }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleAction = (action) => {
    setIsOpen(false); // Close menu first
    showFormHandler(rowData, action)(); // Trigger action
  };

  return (
    <div style={{ position: "relative" }} ref={menuRef}>
      {/* Three Dots */}
      <FaIcons.FaEllipsisV
        style={{ 
          cursor: "pointer", 
          fontSize: "16px",
          padding: "4px",
          display: "block"
        }}
        onClick={handleToggle}
      />

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "28px",
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            padding: "4px 0",
            zIndex: 1000,
            minWidth: "110px",
          }}
        >
          {/* Edit */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 12px",
              cursor: "pointer",
              fontSize: "14px",
            }}
            onClick={() => handleAction("Edit")}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <FaIcons.FaEdit style={{ fontSize: "14px" }} />
            <span>Edit</span>
          </div>

          {/* Delete */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 12px",
              cursor: "pointer",
              fontSize: "14px",
              color: "#e74c3c",
            }}
            onClick={() => handleAction("Delete")}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#fee"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <FaIcons.FaTrash style={{ fontSize: "14px" }} />
            <span>Delete</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseSubCatagoryTable;
