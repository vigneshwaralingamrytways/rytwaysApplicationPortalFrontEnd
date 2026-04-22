import React from "react";
import * as FaIcons from "react-icons/fa";

const ExpenseCatagoryTable = ({
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
      title: "Exp Catagory",
      align: "left",
      render: (rowData) => <span>{rowData?.expenseCatagory}</span>,
    },
    {
      title: "Description",
      align: "left",
      render: (rowData) => <span>{rowData?.expCatagoryDesc}</span>,
    },
    {
      title: "Status",
      align: "left",
      render: (rowData) => (
        <span>{rowData?.status?.statusName}</span>
      ),
    },

    {
      title: "Actions",
      align: "center",
      render: (rowData) => (
        <div style={{ position: "relative" }}>
          <FaIcons.FaEllipsisV
            style={{ cursor: "pointer" }}
            onClick={() =>
              setOpenRow(
                openRow === rowData?.expenseCatagoryId
                  ? null
                  : rowData?.expenseCatagoryId
              )
            }
          />

          {openRow === rowData?.expenseCatagoryId && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "22px",
                background: "#fff",
                border: "1px solid #ddd",
                borderRadius: "6px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                padding: "10px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                zIndex: 1000,
                minWidth: "110px",
              }}
            >
              <div
                style={{ cursor: "pointer", display: "flex", gap: "6px" }}
                onClick={() => {
                  setOpenRow(null);
                  showFormHandler(rowData, "Edit")();
                }}
              >
                <FaIcons.FaEdit />
                <span>Edit</span>
              </div>

              <div
                style={{
                  cursor: "pointer",
                  display: "flex",
                  gap: "6px",
                  color: "red",
                }}
                onClick={() => {
                  setOpenRow(null);
                  showFormHandler(rowData, "Delete")();
                }}
              >
                <FaIcons.FaTrash />
                <span>Delete</span>
              </div>
            </div>
          )}
        </div>
      ),
    },
  ];
};

export default ExpenseCatagoryTable;