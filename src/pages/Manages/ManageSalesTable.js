import React, { useState, useRef, useEffect, useCallback } from "react";
import * as FaIcons from "react-icons/fa";

const ManageSalesTable = (showFormHandler, actions, isGst, isReconsile) => {

  /* ================= RECONCILE TABLE ================= */
  if (isReconsile) {
    return [
      {
        title: "Invoice No",
        align: "left",
        val: "invoiceNo",
        render: (row) => <span>{row.invoiceHeader?.invoiceNo}</span>,
      },
      {
        title: "Invoice Date",
        align: "left",
        val: "invoiceDate",
        render: (row) => <span>{row.invoiceHeader?.invoiceDate}</span>,
      },
      {
        title: "Customer Name",
        align: "left",
        val: "customerName",
        render: (row) => (
          <span>{row.invoiceHeader?.customer?.customerName}</span>
        ),
      },
      {
        title: "Net Total",
        align: "right",
        val: "netTotal",
        render: (row) => <span>{row.paymentDetails?.netTotal}</span>,
      },
    ];
  }

  /* ================= GST TABLE ================= */
  if (isGst) {
    return [
      {
        title: "Invoice Date",
        align: "left",
        render: (row) => <span>{row.invoiceHeader?.invoiceDate}</span>,
      },
      {
        title: "Invoice No",
        align: "right",
        render: (row) => <span>{row.invoiceHeader?.invoiceNo}</span>,
      },
      {
        title: "Customer Name",
        align: "left",
        render: (row) => (
          <span>{row.invoiceHeader?.customer?.customerName}</span>
        ),
      },
      {
        title: "GST No",
        align: "left",
        render: (row) => (
          <span>{row.invoiceHeader?.customer?.gstNo}</span>
        ),
      },
      {
        title: "Gross",
        align: "right",
        render: (row) => <span>{row.paymentDetails?.grossAmount}</span>,
      },
      {
        title: "CGST",
        align: "right",
        render: (row) => <span>{row.paymentDetails?.cgst}</span>,
      },
      {
        title: "SGST",
        align: "right",
        render: (row) => <span>{row.paymentDetails?.sgst}</span>,
      },
      {
        title: "IGST",
        align: "right",
        render: (row) => <span>{row.paymentDetails?.igst}</span>,
      },
      {
        title: "Total GST",
        align: "right",
        render: (row) => <span>{row.paymentDetails?.totalGst}</span>,
      },
    ];
  }

  /* ================= DEFAULT TABLE ================= */
  return [
    {
      title: "Invoice No",
      align: "right",
      render: (row) => <span>{row.invoiceHeader?.invoiceNo}</span>,
    },
    {
      title: "Invoice Date",
      align: "left",
      render: (row) => <span>{row.invoiceHeader?.invoiceDate}</span>,
    },
    {
      title: "Customer Name",
      align: "left",
      render: (row) => (
        <span>{row.invoiceHeader?.customer?.customerName}</span>
      ),
    },
    {
      title: "Margin Amount",
      align: "left",
      render: (row) => (
        <span>{row.paymentDetails?.totalMarginAmount ||0}</span>
      ),
    },
     {
      title: "Buying Price",
      align: "left",
      render: (row) => (
        <span>{row.paymentDetails?.totalBuyingPrice ||0}</span>
      ),
    },
    {
      title: "Gross Amount",
      align: "right",
      render: (row) => <span>{row.paymentDetails?.grossAmount}</span>,
    },
    {
      title: "Total GST",
      align: "right",
      render: (row) => <span>{row.paymentDetails?.totalGst}</span>,
    },
    {
      title: "Net Total",
      align: "right",
      render: (row) => <span>{row.paymentDetails?.netTotal}</span>,
    },
    {
      title: "Status",
      align: "right",
      render: (row) => (
        <span>{row.invoiceHeader?.status?.statusName || "Not Received"}</span>
      ),
    },
    {
      title: "Action",
      align: "center",
      render: (row) => (
        <ActionCell
          row={row}
          showFormHandler={showFormHandler}
          actions={actions}
        />
      ),
    },
  ];
};

/* ================= ACTION CELL COMPONENT ================= */

const ActionCell = ({ row, showFormHandler, actions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  /* Close when clicking outside */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeMenu]);

  const handleMenuClick = (action) => {
    closeMenu();
    const handler = showFormHandler(row, action);
    if (typeof handler === "function") {
      handler();
    }
  };

  return (
    <div style={{ position: "relative" }} ref={menuRef}>
      <FaIcons.FaEllipsisV
        style={{ cursor: "pointer" }}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
      />

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
            icon={<FaIcons.FaUpload />}
            label="Upload"
            onClick={() => handleMenuClick(actions?.[2])}
          />
          <MenuItem
            icon={<FaIcons.FaEdit />}
            label="Edit"
            onClick={() => handleMenuClick(actions?.[0])}
          />
          <MenuItem
            icon={<FaIcons.FaTrash />}
            label="Delete"
            onClick={() => handleMenuClick(actions?.[3])}
            danger
          />
          <MenuItem
            icon={<FaIcons.FaPrint />}
            label="Print"
            onClick={() => handleMenuClick(actions?.[1])}
          />
          <MenuItem
            icon={<FaIcons.FaCopy />}
            label="Copy"
            onClick={() => handleMenuClick(actions?.[4])}
          />
        </div>
      )}
    </div>
  );
};

/* ================= MENU ITEM ================= */

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
      color: danger ? "red" : "#333",
      fontSize: "14px",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f5")}
    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
  >
    {icon}
    {label}
  </div>
);

export default ManageSalesTable;