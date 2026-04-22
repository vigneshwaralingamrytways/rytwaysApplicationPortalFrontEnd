import React, { useState, useRef, useEffect, useCallback } from "react";
import * as FaIcons from "react-icons/fa";

const EmployeeTable = ({ showFormHandler, actions = [] }) => {
  return [
    {
      title: "Employee Name",
      align: "left",
      val: "employeeName",
      render: (rowData) => <span>{rowData?.employeeName}</span>,
    },
    {
      title: "Mobile No",
      align: "left",
      val: "mobileNo",
      render: (rowData) => <span>{rowData?.mobileNo}</span>,
    },
    {
      title: "Email ID",
      align: "left",
      val: "officialEmailId",
      render: (rowData) => <span>{rowData?.officialEmailId}</span>,
    },
    {
      title: "Designation",
      align: "left",
      val: "designation",
      render: (rowData) => <span>{rowData?.designation}</span>,
    },
    {
      title: "Department",
      align: "left",
      val: "departmentId",
      render: (rowData) => (
        <span>{rowData?.department?.departmentName}</span>
      ),
    },
    /* ACTION COLUMN */
    {
      title: "Actions",
      align: "center",
      render: (rowData) => <ActionCell rowData={rowData} showFormHandler={showFormHandler} />,
    },
  ];
};

// Reusable ActionCell component with proper hook usage
const ActionCell = ({ rowData, showFormHandler }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);
    
    // Cleanup on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeMenu]);

  const handleDotsClick = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleMenuItemClick = useCallback((action) => {
  closeMenu();
  const handler = showFormHandler(rowData, action);
  if (typeof handler === "function") {
    handler();   // ? EXECUTE returned function
  }
}, [closeMenu, rowData, showFormHandler]);

  return (
    <div style={{ position: "relative" }} ref={menuRef}>
      {/* 3 Dots */}
      <FaIcons.FaEllipsisV
        style={{ cursor: "pointer", fontSize: "16px" }}
        onClick={handleDotsClick}
      />

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "22px",
            background: "#fff",
            boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
            borderRadius: "6px",
            padding: "6px 0",
            zIndex: 999,
            minWidth: "150px",
          }}
        >
          <MenuItem
            icon={<FaIcons.FaEdit />}
            label="Edit"
            onClick={() => handleMenuItemClick("Edit")}
          />
          <MenuItem
            icon={<FaIcons.FaTrash />}
            label="Delete"
            danger
            onClick={() => handleMenuItemClick("Delete")}
          />
          <MenuItem
            icon={<FaIcons.FaUpload />}
            label="Upload"
            onClick={() => handleMenuItemClick("Upload")}
          />
          <MenuItem
            icon={<FaIcons.FaPrint />}
            label="Print"
            onClick={() => handleMenuItemClick("Print")}
          />
        </div>
      )}
    </div>
  );
};

const MenuItem = ({ icon, label, onClick, danger }) => (
  <div
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "8px 12px",
      cursor: "pointer",
      color: danger ? "#e74c3c" : "#333",
      fontSize: "14px",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f5")}
    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
  >
    <span style={{ fontSize: "16px" }}>{icon}</span>
    <span>{label}</span>
  </div>
);

export default EmployeeTable;
