import React from "react";
import * as FaIcons from "react-icons/fa";

const ManagePurchaseTable = (
  showFormHandler,
  actions,
  isGst,
  isReconsile,
  openRow,
  setOpenRow
) => {
  const toggleMenu = (id) => {
    setOpenRow(openRow === id ? null : id);
  };

  let columns = [];

  if (isGst || isReconsile) {
    columns = [
      {
        title: "Invoice Date",
        align: "left",
        val: "invoiceDate",
        render: (row) => (
          <span>{row.invoiceHeader?.invoiceDate}</span>
        ),
      },
      {
        title: "Invoice No",
        align: "right",
        val: "invoiceNo",
        render: (row) => (
          <span>{row.invoiceHeader?.invoiceNo}</span>
        ),
      },
      {
        title: "Supplier Name",
        align: "left",
        val: "supplierName",
        render: (row) => (
          <span>
            {row.invoiceHeader?.supplier?.supplierName}
          </span>
        ),
      },
      {
        title: "Gross Amount",
        align: "right",
        val: "grossAmount",
        render: (row) => (
          <span>{row.paymentDetails?.grossAmount || 0}</span>
        ),
      },
      {
        title: "Total GST",
        align: "right",
        val: "totalGst",
        render: (row) => (
          <span>{row.paymentDetails?.totalGst || 0}</span>
        ),
      },
      {
        title: "Net Total",
        align: "right",
        val: "netTotal",
        render: (row) => (
          <span>{row.paymentDetails?.netTotal || 0}</span>
        ),
      },
    ];
  } else {
    columns = [
      {
        title: "Invoice No",
        align: "right",
        val: "invoiceNo",
        render: (row) => (
          <span>{row.invoiceHeader?.invoiceNo}</span>
        ),
      },
      {
        title: "Invoice Date",
        align: "right",
        val: "invoiceDate",
        render: (row) => (
          <span>{row.invoiceHeader?.invoiceDate}</span>
        ),
      },
      {
        title: "Supplier Name",
        align: "left",
        val: "supplierName",
        render: (row) => (
          <span>
            {row.invoiceHeader?.supplier?.supplierName}
          </span>
        ),
      },
      {
        title: "Gross Amount",
        align: "right",
        val: "grossAmount",
        render: (row) => (
          <span>{row.paymentDetails?.grossAmount || 0}</span>
        ),
      },
      {
        title: "Total GST",
        align: "right",
        val: "totalGst",
        render: (row) => (
          <span>{row.paymentDetails?.totalGst || 0}</span>
        ),
      },
      {
        title: "Net Total",
        align: "right",
        val: "netTotal",
        render: (row) => (
          <span>{row.paymentDetails?.netTotal || 0}</span>
        ),
      },
    ];
  }

  // ACTION COLUMN
  if (!isGst) {
    columns.push({
      title: "Actions",
      align: "center",
      render: (row) => {
        const rowId =
          row.invoiceHeader?.invoiceNo ||
          row.invoiceHeaderId;

        return (
          <div style={{ position: "relative" }}>
            <FaIcons.FaEllipsisV
              style={{ cursor: "pointer" }}
              onClick={() => toggleMenu(rowId)}
            />

            {openRow === rowId && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "22px",
                  background: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  boxShadow:
                    "0 2px 10px rgba(0,0,0,0.15)",
                  padding: "10px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  zIndex: 1000,
                  minWidth: "120px",
                }}
              >
                <div
                  style={{ cursor: "pointer", display: "flex", gap: "6px" }}
                  onClick={() => {
                    setOpenRow(null);
                    showFormHandler(row, actions[2])();
                  }}
                >
                  <FaIcons.FaUpload />
                  <span>Upload</span>
                </div>

                <div
                  style={{ cursor: "pointer", display: "flex", gap: "6px" }}
                  onClick={() => {
                    setOpenRow(null);
                    showFormHandler(row, actions[0])();
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
                    showFormHandler(row, actions[3])();
                  }}
                >
                  <FaIcons.FaTrash />
                  <span>Delete</span>
                </div>
                <div
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    gap: "6px",

                  }}
                  onClick={() => {
                    setOpenRow(null);
                    showFormHandler(row, actions[4])();
                  }}
                >
                  <FaIcons.FaPrint />
                  <span>Print</span>
                </div>

              </div>
            )}
          </div>
        );
      },
    });
  }

  return columns;
};

export default ManagePurchaseTable;