import React, { useState } from "react";
import * as FaIcons from "react-icons/fa";

const SupplierTable = ({ showFormHandler, actions }) => {

  const [openRow, setOpenRow] = useState(null);

  const toggleMenu = (id) => {
    setOpenRow(openRow === id ? null : id);
  };

  return [
    {
      title: "Supplier Name",
      align: "left",
      val: "supplierName",
      render: (rowData) => <span>{rowData?.supplierName}</span>,
    },
    {
      title: "State",
      align: "left",
      val: "state",
      render: (rowData) => (
        <span>{rowData?.state?.stateName || ""}</span>
      ),
    },
    {
      title: "Country",
      align: "left",
      val: "country",
      render: (rowData) => (
        <span>{rowData?.country?.countryName}</span>
      ),
    },
    {
      title: "Contact No",
      align: "right",
      val: "contactNo",
      render: (rowData) => <span>{rowData?.contactNo}</span>,
    },
    {
      title: "Email",
      align: "left",
      val: "email",
      render: (rowData) => <span>{rowData?.email}</span>,
    },
    {
      title: "Contact Person",
      align: "left",
      val: "contactPerson",
      render: (rowData) => <span>{rowData?.contactPerson}</span>,
    },
    {
      title: "GST NO",
      align: "left",
      val: "gstNo",
      render: (rowData) => <span>{rowData?.gstNo}</span>,
    },

    /* ================= ACTION COLUMN ================= */

    {
      title: "Actions",
      align: "center",
      render: (rowData) => (
        <div style={{ position: "relative", textAlign: "center" }}>
          
          {/* Three Dots */}
          <span
            style={{ cursor: "pointer", fontSize: 18 }}
            onClick={() => toggleMenu(rowData?.supplierId)}
          >
            <FaIcons.FaEllipsisV />
          </span>

          {/* Dropdown Menu */}
          {openRow === rowData?.supplierId && (
            <div
              style={{
                position: "absolute",
                top: "22px",
                right: 0,
                background: "#fff",
                border: "1px solid #ddd",
                borderRadius: "6px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                padding: "8px 12px",
                display: "flex",
                gap: "12px",
                zIndex: 1000,
              }}
            >
              <span
                style={{ cursor: "pointer", color: "blue" }}
                onClick={() => {
                  setOpenRow(null);
                  showFormHandler(rowData, actions[0])();
                }}
              >
                <FaIcons.FaEdit />
              </span>

              <span
                style={{ cursor: "pointer", color: "red" }}
                onClick={() => {
                  setOpenRow(null);
                  showFormHandler(rowData, actions[1])();
                }}
              >
                <FaIcons.FaTrash />
              </span>
            </div>
          )}
        </div>
      ),
    },
  ];
};

export default SupplierTable;